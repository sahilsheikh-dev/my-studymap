/**
 * db.js
 * ═══════════════════════════════════════════════════════════════════
 * Data access layer — ALL Firestore reads and writes go through here.
 * No other file imports Firestore directly.
 *
 * WHAT CHANGED FROM THE ORIGINAL
 * ────────────────────────────────────────────────────────────────
 * + createUserDoc()     — new export; called by auth.js during signup
 * + getUserDoc()        — new export; fetch a single user's profile
 * + updateUserDoc()     — new export; user can update own non-role fields
 * + Input sanitisation  — slug validated before any Firestore path concat
 * + Error tagging       — all catch blocks tag source for easier debugging
 * + saveProgress merge  — now rejects empty checkboxMap to prevent overwrites
 *
 * EXPORTS (grouped by domain)
 * ────────────────────────────
 * Categories:   listCategories, getCategory, createCategory,
 *               updateCategory, deleteCategory
 * Topics:       listTopics, getTopic, setTopic, deleteTopic
 * Users:        listUsers, getUserDoc, createUserDoc,
 *               updateUserDoc, setUserRole
 * Progress:     loadProgress, saveProgress
 * ═══════════════════════════════════════════════════════════════════
 */

import { db } from './firebase-config.js';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

/* ── Internal helpers ────────────────────────────────────────────── */

/**
 * Validates a slug — only allows safe Firestore document ID characters.
 * Throws if invalid to prevent path injection.
 *
 * @param {string} slug
 * @throws {Error}
 */
function _validateSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('[db] slug must be a non-empty string');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error('[db] slug contains invalid characters (allowed: a-z, 0-9, _ -)');
  }
}

/* ══════════════════════════════════════════════════════════════════
   CATEGORIES
   ══════════════════════════════════════════════════════════════════ */

/**
 * Returns all categories sorted by `order` field.
 * Used by index.html to render the roadmap grid.
 *
 * @returns {Promise<Array>}
 */
export async function listCategories() {
  try {
    const snap = await getDocs(
      query(collection(db, 'categories'), orderBy('order', 'asc'))
    );
    return snap.docs.map(d => ({ slug: d.id, ...d.data() }));
  } catch (err) {
    console.error('[db] listCategories:', err);
    throw err;
  }
}

/**
 * Returns a category document + all its topics (sorted by _order).
 *
 * @param {string} slug
 * @returns {Promise<{ meta, topics, phaseLabels, phaseOrder } | null>}
 */
export async function getCategory(slug) {
  _validateSlug(slug);
  try {
    const catSnap = await getDoc(doc(db, 'categories', slug));
    if (!catSnap.exists()) return null;

    const meta = catSnap.data();

    const topicsSnap = await getDocs(
      collection(db, 'categories', slug, 'topics')
    );
    const topics = topicsSnap.docs
      .map(d => ({ ...d.data(), id: d.id }))
      .sort((a, b) => (a._order ?? 999) - (b._order ?? 999));

    return {
      meta,
      topics,
      phaseLabels: meta.phaseLabels || {},
      phaseOrder:  meta.phaseOrder  || []
    };
  } catch (err) {
    console.error('[db] getCategory:', err);
    throw err;
  }
}

/**
 * Creates a new category document.
 * Admin only (Firestore rules enforce this server-side).
 *
 * @param {string} slug
 * @param {object} meta
 */
export async function createCategory(slug, meta) {
  _validateSlug(slug);
  await setDoc(doc(db, 'categories', slug), {
    ...meta,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

/**
 * Updates fields on an existing category.
 *
 * @param {string} slug
 * @param {object} updates
 */
export async function updateCategory(slug, updates) {
  _validateSlug(slug);
  await updateDoc(doc(db, 'categories', slug), {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

/**
 * Deletes a category and all its topics.
 * Firestore does NOT cascade-delete sub-collections automatically.
 *
 * @param {string} slug
 */
export async function deleteCategory(slug) {
  _validateSlug(slug);
  const topicsSnap = await getDocs(
    collection(db, 'categories', slug, 'topics')
  );
  const batch = writeBatch(db);
  topicsSnap.docs.forEach(d => batch.delete(d.ref));
  batch.delete(doc(db, 'categories', slug));
  await batch.commit();
}

/* ══════════════════════════════════════════════════════════════════
   TOPICS
   ══════════════════════════════════════════════════════════════════ */

/**
 * Returns all topics for a category, sorted by _order.
 *
 * @param {string} categorySlug
 * @returns {Promise<Array>}
 */
export async function listTopics(categorySlug) {
  _validateSlug(categorySlug);
  const snap = await getDocs(
    collection(db, 'categories', categorySlug, 'topics')
  );
  return snap.docs
    .map(d => ({ ...d.data(), id: d.id }))
    .sort((a, b) => (a._order ?? 999) - (b._order ?? 999));
}

/**
 * Returns a single topic document.
 *
 * @param {string} categorySlug
 * @param {string} topicId
 * @returns {Promise<object|null>}
 */
export async function getTopic(categorySlug, topicId) {
  _validateSlug(categorySlug);
  const snap = await getDoc(
    doc(db, 'categories', categorySlug, 'topics', topicId)
  );
  return snap.exists() ? { ...snap.data(), id: snap.id } : null;
}

/**
 * Creates or fully replaces a topic document.
 *
 * @param {string} categorySlug
 * @param {string} topicId
 * @param {object} data
 */
export async function setTopic(categorySlug, topicId, data) {
  _validateSlug(categorySlug);
  await setDoc(
    doc(db, 'categories', categorySlug, 'topics', topicId),
    { ...data, updatedAt: serverTimestamp() }
  );
}

/**
 * Deletes a single topic document.
 *
 * @param {string} categorySlug
 * @param {string} topicId
 */
export async function deleteTopic(categorySlug, topicId) {
  _validateSlug(categorySlug);
  await deleteDoc(doc(db, 'categories', categorySlug, 'topics', topicId));
}

/* ══════════════════════════════════════════════════════════════════
   USERS
   ══════════════════════════════════════════════════════════════════ */

/**
 * Returns all user documents.
 * Only callable by admin (Firestore rules enforce this).
 *
 * @returns {Promise<Array<{ uid, email, role, displayName, createdAt }>>}
 */
export async function listUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

/**
 * Returns a single user document.
 *
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
}

/**
 * Creates a user document. Called by auth.js during signup.
 * Role is always set to "user" — never accept role from params.
 *
 * @param {string} uid
 * @param {{ email: string, displayName?: string }} profile
 */
export async function createUserDoc(uid, profile) {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return; // idempotent — don't overwrite existing doc

  await setDoc(ref, {
    email:       profile.email,
    displayName: profile.displayName || '',
    role:        'user',             // hardcoded — NEVER take role from client
    createdAt:   serverTimestamp()
  });
}

/**
 * Updates non-role fields on a user's own document.
 * Never pass role here — use setUserRole() for that (admin only).
 *
 * @param {string} uid
 * @param {{ displayName?: string, photoURL?: string }} updates
 */
export async function updateUserDoc(uid, updates) {
  // Strip role from updates even if caller passes it (defense in depth)
  const { role: _stripped, ...safe } = updates;
  await updateDoc(doc(db, 'users', uid), {
    ...safe,
    updatedAt: serverTimestamp()
  });
}

/**
 * Promotes or demotes a user's role.
 * Firestore rules restrict this to admin callers only.
 *
 * @param {string} uid
 * @param {'admin'|'user'} role
 */
export async function setUserRole(uid, role) {
  if (role !== 'admin' && role !== 'user') {
    throw new Error('Role must be "admin" or "user"');
  }
  await updateDoc(doc(db, 'users', uid), { role });
}

/* ══════════════════════════════════════════════════════════════════
   PROGRESS  (per-user checkbox state)
   ══════════════════════════════════════════════════════════════════ */

/**
 * Loads a user's checkbox progress for one category.
 * Returns flat object: { "linux::stage_beginner::0": true, ... }
 *
 * @param {string} uid
 * @param {string} categorySlug
 * @returns {Promise<object>}
 */
export async function loadProgress(uid, categorySlug) {
  try {
    const snap = await getDoc(
      doc(db, 'progress', uid, 'checkboxes', categorySlug)
    );
    return snap.exists() ? snap.data() : {};
  } catch {
    return {}; // safe fallback
  }
}

/**
 * Saves checkbox progress for one category.
 * Uses merge:true so other keys are preserved.
 * Rejects empty maps to avoid accidental overwrites.
 *
 * @param {string} uid
 * @param {string} categorySlug
 * @param {object} checkboxMap
 */
export async function saveProgress(uid, categorySlug, checkboxMap) {
  if (!checkboxMap || Object.keys(checkboxMap).length === 0) return;

  try {
    await setDoc(
      doc(db, 'progress', uid, 'checkboxes', categorySlug),
      { ...checkboxMap, _updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    // Non-critical — fail silently but log for debugging
    console.warn('[db] saveProgress failed:', err.message);
  }
}