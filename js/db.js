import { db } from "./firebase-config.js";

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
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function _validateSlug(slug) {
  if (!slug || typeof slug !== "string") {
    throw new Error("[db] slug must be a non-empty string");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error("[db] slug contains invalid characters");
  }
}

export async function createUserProfile({ uid, email, displayName }) {
  try {
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      displayName: displayName ?? "",
      role: "user",
      createdAt: serverTimestamp(),
    });

    console.log("[createUserProfile] user created:", uid);
  } catch (err) {
    console.error("[createUserProfile] FAILED:", err);
    throw err;
  }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, updates) {
  const { role: _r, uid: _u, createdAt: _c, ...safe } = updates;

  await updateDoc(doc(db, "users", uid), {
    ...safe,
    updatedAt: serverTimestamp(),
  });
}

export async function listUsers() {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  } catch (err) {
    console.error("[db] listUsers:", err);
    throw err;
  }
}

export async function setUserRole(uid, role) {
  if (role !== "admin" && role !== "user") {
    throw new Error('[db] setUserRole: role must be "admin" or "user"');
  }

  await updateDoc(doc(db, "users", uid), { role });
}

export async function listCategories() {
  try {
    const snap = await getDocs(
      query(collection(db, "categories"), orderBy("order", "asc")),
    );
    return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
  } catch (err) {
    console.error("[db] listCategories:", err);
    throw err;
  }
}

export async function getCategory(slug) {
  _validateSlug(slug);
  try {
    const catSnap = await getDoc(doc(db, "categories", slug));
    if (!catSnap.exists()) return null;

    const meta = catSnap.data();
    const topicsSnap = await getDocs(
      collection(db, "categories", slug, "topics"),
    );
    const topics = topicsSnap.docs
      .map((d) => ({ ...d.data(), id: d.id }))
      .sort((a, b) => (a._order ?? 999) - (b._order ?? 999));

    return {
      meta,
      topics,
      phaseLabels: meta.phaseLabels || {},
      phaseOrder: meta.phaseOrder || [],
    };
  } catch (err) {
    console.error("[db] getCategory:", err);
    throw err;
  }
}

export async function createCategory(slug, meta) {
  _validateSlug(slug);
  await setDoc(doc(db, "categories", slug), {
    ...meta,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCategory(slug, updates) {
  _validateSlug(slug);
  await updateDoc(doc(db, "categories", slug), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(slug) {
  _validateSlug(slug);
  const topicsSnap = await getDocs(
    collection(db, "categories", slug, "topics"),
  );
  const batch = writeBatch(db);
  topicsSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, "categories", slug));
  await batch.commit();
}

export async function listTopics(categorySlug) {
  _validateSlug(categorySlug);
  const snap = await getDocs(
    collection(db, "categories", categorySlug, "topics"),
  );
  return snap.docs
    .map((d) => ({ ...d.data(), id: d.id }))
    .sort((a, b) => (a._order ?? 999) - (b._order ?? 999));
}

export async function getTopic(categorySlug, topicId) {
  _validateSlug(categorySlug);
  const snap = await getDoc(
    doc(db, "categories", categorySlug, "topics", topicId),
  );
  return snap.exists() ? { ...snap.data(), id: snap.id } : null;
}

export async function setTopic(categorySlug, topicId, data) {
  _validateSlug(categorySlug);
  await setDoc(doc(db, "categories", categorySlug, "topics", topicId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTopic(categorySlug, topicId) {
  _validateSlug(categorySlug);
  await deleteDoc(doc(db, "categories", categorySlug, "topics", topicId));
}

export async function loadProgress(uid, categorySlug) {
  try {
    const snap = await getDoc(
      doc(db, "progress", uid, "checkboxes", categorySlug),
    );
    return snap.exists() ? snap.data() : {};
  } catch {
    return {};
  }
}

export async function saveProgress(uid, categorySlug, checkboxMap) {
  if (
    !checkboxMap ||
    typeof checkboxMap !== "object" ||
    Object.keys(checkboxMap).length === 0
  ) {
    return;
  }

  try {
    await setDoc(
      doc(db, "progress", uid, "checkboxes", categorySlug),
      { ...checkboxMap, _updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch (err) {
    console.warn("[db] saveProgress failed:", err.message);
  }
}
