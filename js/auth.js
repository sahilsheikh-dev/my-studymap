/**
 * auth.js — Authentication layer
 * ═══════════════════════════════════════════════════════════════════
 * The ONLY file that imports Firebase Auth.
 * Every other module imports from here, never from Firebase directly.
 *
 * ── BUGS FIXED ────────────────────────────────────────────────────
 *
 * BUG 1 — Race condition: admin panel stuck on "Verifying access…"
 *   or redirects real admins to index.html intermittently.
 *
 *   CAUSE: admin.js called requireAuth() then immediately called
 *   isAdmin(). isAdmin() reads _currentUser from module state. On a
 *   fast cache hit, requireAuth's onAuthStateChanged callback had not
 *   yet written to _currentUser before isAdmin() ran.
 *
 *   FIX: requireAuth() now returns the full AppUser (with role) from
 *   its Promise. admin.js checks user.role !== 'admin' on the returned
 *   value — no separate isAdmin() call needed for access gating.
 *
 * BUG 2 — _ensureUserDoc called after _resolveUser in signIn.
 *
 *   CAUSE: First-time sign-in for users without a Firestore doc would
 *   call _resolveUser (which reads the doc, finds nothing, returns
 *   role "user") THEN create the doc. The doc was written too late to
 *   affect the current session's role. On the next login, everything
 *   worked. On the first login after migration, the user had no doc
 *   and the write happened after role was already read.
 *
 *   FIX: _ensureUserDoc is called BEFORE _resolveUser in signIn.
 *
 * BUG 3 — Network errors silently swallowed in signUp duplicate check.
 *
 *   CAUSE: The try/catch only re-threw auth/email-already-in-use.
 *   Network failures were caught and ignored, making signUp silently
 *   proceed to createUserWithEmailAndPassword which then failed with
 *   a confusing unrelated error.
 *
 *   FIX: auth/network-request-failed is now explicitly re-thrown.
 *
 * BUG 4 — Role updates not visible to already-logged-in users.
 *
 *   CAUSE: onAuthChange only fires on Auth state changes (login/logout).
 *   If an admin updates a user's Firestore role while that user is
 *   already logged in, the cached role never updates until sign-out.
 *
 *   FIX: Added refreshCurrentUser() export. admin.js calls it after
 *   every setUserRole() so the admin's own cache is always fresh.
 *   Other users need to sign out/in for their role to update — this
 *   is correct and expected behavior.
 *
 * ── EXPORTS ────────────────────────────────────────────────────────
 *   signUp(email, password, displayName?)  → Promise<AppUser>
 *   signIn(email, password)                → Promise<AppUser>
 *   signOut(redirectTo?)                   → Promise<void>
 *   sendPasswordReset(email)               → Promise<void>
 *   refreshCurrentUser()                   → Promise<AppUser|null>
 *   getCurrentUser()                       → AppUser | null | false
 *   onAuthChange(callback)                 → unsubscribe fn
 *   requireAuth(redirectUrl?)              → Promise<AppUser>
 *   isAdmin()                              → boolean
 *
 * AppUser: { uid, email, displayName, role, photoURL }
 * ═══════════════════════════════════════════════════════════════════
 */

import { auth, db } from './firebase-config.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut            as _firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  fetchSignInMethodsForEmail
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* ── Module state ───────────────────────────────────────────────────
   false  = Firebase Auth not yet resolved on this page load
   null   = Resolved; no user signed in
   object = Signed in with Firestore role attached
─────────────────────────────────────────────────────────────────── */
let _currentUser = false;

/* Persist login across browser restarts */
setPersistence(auth, browserLocalPersistence).catch(err =>
  console.warn('[auth] setPersistence failed:', err.message)
);

/* ══════════════════════════════════════════════════════════════════
   PRIVATE HELPERS
   ══════════════════════════════════════════════════════════════════ */

/**
 * Reads role from Firestore. Returns "user" on any failure.
 * NEVER returns "admin" unless Firestore explicitly confirms it.
 * Fail-closed: security is preserved even under Firestore errors.
 */
async function _fetchRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const r = snap.data().role;
      return r === 'admin' ? 'admin' : 'user'; // whitelist only
    }
    return 'user';
  } catch (err) {
    console.error('[auth] _fetchRole failed, defaulting to user:', err.message);
    return 'user';
  }
}

/**
 * Creates users/{uid} document if it does not exist.
 * Role is ALWAYS "user" — never taken from caller input.
 * Idempotent: safe to call on every sign-in.
 */
async function _ensureUserDoc(firebaseUser) {
  const ref  = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email:       firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      role:        'user',       // always "user" — NEVER from client
      createdAt:   serverTimestamp()
    });
  }
}

/**
 * Builds AppUser from a Firebase Auth user. Reads role from Firestore.
 * Updates _currentUser cache. Single source of truth for user assembly.
 */
async function _resolveUser(firebaseUser) {
  const role = await _fetchRole(firebaseUser.uid);
  _currentUser = {
    uid:         firebaseUser.uid,
    email:       firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email,
    role,
    photoURL:    firebaseUser.photoURL || null
  };
  return _currentUser;
}

/**
 * Maps Firebase error codes to user-friendly messages.
 * Raw Firebase codes must never reach the UI.
 */
function _friendlyError(code) {
  const MAP = {
    'auth/email-already-in-use':   'An account with this email already exists. Please sign in instead.',
    'auth/user-not-found':         'No account found with this email address.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many failed attempts. Please wait a few minutes and try again.',
    'auth/user-disabled':          'This account has been disabled. Contact your administrator.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-closed-by-user':   'Sign-in was cancelled.',
    'auth/invalid-credential':     'Invalid email or password. Please check and try again.',
    'auth/operation-not-allowed':  'This sign-in method is not enabled. Contact support.',
  };
  return MAP[code] || 'Authentication failed. Please try again.';
}

/* ══════════════════════════════════════════════════════════════════
   SIGN UP
   ══════════════════════════════════════════════════════════════════ */

/**
 * Creates Firebase Auth account + Firestore profile document.
 *
 * Role is always "user" on signup. Admins are created by existing
 * admins via the Users panel — never through self-signup.
 *
 * @param {string} email
 * @param {string} password   — Firebase minimum: 6 characters
 * @param {string} [displayName]
 * @returns {Promise<AppUser>}
 * @throws {Error} with user-friendly message
 */
export async function signUp(email, password, displayName = '') {
  /* Step 1: Check for duplicate email before attempting account creation */
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods && methods.length > 0) {
      const err = new Error(
        'An account with this email already exists. Please sign in instead.'
      );
      err.code = 'auth/email-already-in-use';
      throw err;
    }
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') throw err;
    // BUG 3 FIX: rethrow network errors instead of swallowing them
    if (err.code === 'auth/network-request-failed') {
      throw new Error(_friendlyError(err.code));
    }
    // Other transient check errors: fall through, let createUser handle
  }

  /* Step 2: Create Firebase Auth account */
  let credential;
  try {
    credential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error(_friendlyError(err.code));
  }

  const fbUser = credential.user;

  /* Step 3: Set display name in Auth (cosmetic, non-critical) */
  if (displayName.trim()) {
    try {
      await updateProfile(fbUser, { displayName: displayName.trim() });
    } catch {
      // Display name is cosmetic — don't fail signup over it
    }
  }

  /* Step 4: Write Firestore document with role: "user" */
  await _ensureUserDoc(fbUser);

  /* Step 5: Build and return enriched user */
  return _resolveUser(fbUser);
}

/* ══════════════════════════════════════════════════════════════════
   SIGN IN
   ══════════════════════════════════════════════════════════════════ */

/**
 * Signs in with email/password. Ensures Firestore doc exists,
 * then fetches role.
 *
 * BUG 2 FIX: _ensureUserDoc runs before _resolveUser so the doc
 * exists before we try to read the role from it.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AppUser>}
 */
export async function signIn(email, password) {
  let credential;
  try {
    credential = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error(_friendlyError(err.code));
  }

  const fbUser = credential.user;

  // BUG 2 FIX: ensure doc exists BEFORE reading role
  await _ensureUserDoc(fbUser);
  return _resolveUser(fbUser);
}

/* ══════════════════════════════════════════════════════════════════
   SIGN OUT
   ══════════════════════════════════════════════════════════════════ */

/**
 * Signs out and redirects to login. State is always cleared even if
 * Firebase signOut fails (finally block).
 *
 * @param {string} [redirectTo='login.html']
 */
export async function signOut(redirectTo = 'login.html') {
  try {
    await _firebaseSignOut(auth);
  } finally {
    _currentUser = null;
    window.location.href = redirectTo;
  }
}

/* ══════════════════════════════════════════════════════════════════
   PASSWORD RESET
   ══════════════════════════════════════════════════════════════════ */

/**
 * Sends a password reset email.
 * Swallows auth/user-not-found to prevent email enumeration attacks —
 * always shows success to the caller.
 *
 * @param {string} email
 */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    if (err.code === 'auth/user-not-found') return; // silent: don't reveal account existence
    throw new Error(_friendlyError(err.code));
  }
}

/* ══════════════════════════════════════════════════════════════════
   REFRESH CURRENT USER  (BUG 4 FIX)
   ══════════════════════════════════════════════════════════════════ */

/**
 * Re-reads the current user's Firestore role and updates the cache.
 *
 * Call this after any role change (admin.js does this) so the
 * logged-in admin's cached user stays fresh without a sign-out.
 *
 * Note: The USER whose role was changed still needs to sign out and
 * back in to see the update — their auth session did not change.
 *
 * @returns {Promise<AppUser|null>}
 */
export async function refreshCurrentUser() {
  const fbUser = auth.currentUser;
  if (!fbUser) {
    _currentUser = null;
    return null;
  }
  return _resolveUser(fbUser);
}

/* ══════════════════════════════════════════════════════════════════
   AUTH STATE
   ══════════════════════════════════════════════════════════════════ */

/**
 * Returns the cached AppUser, null, or false.
 * false = Auth not yet resolved (page just loaded).
 * null  = No user signed in.
 * object = Signed in with role.
 */
export function getCurrentUser() {
  return _currentUser;
}

/**
 * Returns true only if the cached user has role === "admin".
 * Convenience function — do NOT use this for initial page access
 * checks in async code. Use the user returned by requireAuth() instead.
 */
export function isAdmin() {
  return !!(_currentUser && _currentUser.role === 'admin');
}

/**
 * Subscribes to auth state changes.
 * Callback fires immediately with current state, then on every change.
 *
 * @param {(user: AppUser|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async fbUser => {
    if (fbUser) {
      await _resolveUser(fbUser);
    } else {
      _currentUser = null;
    }
    callback(_currentUser);
  });
}

/**
 * Guards a protected page. Redirects to login if not authenticated.
 * Resolves with the full AppUser (including Firestore role) once confirmed.
 *
 * BUG 1 FIX: Returns AppUser directly. Callers must check role on
 * the returned user object, not by calling isAdmin() separately.
 *
 * Correct usage in admin.js:
 *   const user = await requireAuth('login.html');
 *   if (user.role !== 'admin') { redirect; return; }
 *
 * @param {string} [redirectUrl='login.html']
 * @returns {Promise<AppUser>}
 */
export function requireAuth(redirectUrl = 'login.html') {
  return new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      unsub(); // unsubscribe after first resolution
      if (!fbUser) {
        const returnTo = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `${redirectUrl}?redirect=${returnTo}`;
        return; // Promise never resolves — redirect is happening
      }
      const user = await _resolveUser(fbUser);
      resolve(user); // resolves with full AppUser including role
    });
  });
}