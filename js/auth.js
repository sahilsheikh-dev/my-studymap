import { auth } from './firebase-config.js';
import { createUserProfile, getUserProfile } from './db.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as _firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

let _currentUser = false;

setPersistence(auth, browserLocalPersistence).catch(err =>
  console.warn('[auth] setPersistence failed:', err.message)
);


async function _resolveUser(firebaseUser) {
  let role = 'user';

  try {
    const profile = await getUserProfile(firebaseUser.uid);
    if (profile && profile.role === 'admin') {
      role = 'admin';
    }
  } catch (err) {
    console.error('[auth] _resolveUser: role lookup failed:', err.message);
  }

  _currentUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email,
    role,
    photoURL: firebaseUser.photoURL || null
  };

  return _currentUser;
}

function _friendlyError(code) {
  const MAP = {
    'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a few minutes and try again.',
    'auth/user-disabled': 'This account has been disabled. Contact your administrator.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.',
  };
  return MAP[code] || 'Authentication failed. Please try again.';
}

export async function signUp(email, password, displayName = '') {

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;


  if (displayName.trim()) {
    await updateProfile(user, { displayName: displayName.trim() });
  }


  await new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) {
        unsub();
        resolve();
      }
    });
  });


  await createUserProfile({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || displayName
  });

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || displayName,
    role: 'user'
  };
}

export async function signIn(email, password) {
  let credential;
  try {
    credential = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error(_friendlyError(err.code));
  }
  return _resolveUser(credential.user);
}

export async function signOut(redirectTo = 'login.html') {
  try {
    await _firebaseSignOut(auth);
  } finally {
    _currentUser = null;
    window.location.href = redirectTo;
  }
}

export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    if (err.code === 'auth/user-not-found') return;
    throw new Error(_friendlyError(err.code));
  }
}

export async function refreshCurrentUser() {
  const fbUser = auth.currentUser;
  if (!fbUser) { _currentUser = null; return null; }
  return _resolveUser(fbUser);
}

export function getCurrentUser() { return _currentUser; }

export function isAdmin() {
  return !!(_currentUser && _currentUser.role === 'admin');
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      await _resolveUser(fbUser);
    } else {
      _currentUser = null;
    }
    callback(_currentUser);
  });
}

export function requireAuth(redirectUrl = 'login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      unsub();
      if (!fbUser) {
        const returnTo = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `${redirectUrl}?redirect=${returnTo}`;
        return;
      }
      const user = await _resolveUser(fbUser);
      resolve(user);
    });
  });
}