/**
 * firebase-config.js
 * ═══════════════════════════════════════════════════════════════════
 * Firebase SDK initialization — imported by every other JS module.
 *
 * SETUP INSTRUCTIONS (do this once in Firebase Console):
 * ─────────────────────────────────────────────────────
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it (e.g. "studymap")
 * 3. In Project Overview → click the </> (Web) icon
 * 4. Register your app → copy the firebaseConfig object below
 * 5. In the left sidebar:
 *    • Authentication → Get Started → Email/Password → Enable
 *    • Firestore Database → Create database → Start in production mode
 *      → choose a region → Done
 * 6. Replace the placeholder values in firebaseConfig below with your own.
 * ═══════════════════════════════════════════════════════════════════
 *
 * WHY FIRESTORE (not Realtime Database)?
 * ───────────────────────────────────────
 * Firestore is recommended for this project because:
 *  • Richer querying (filter by field, order, limit)
 *  • Better offline support and caching
 *  • Scales automatically; no manual sharding
 *  • Security rules are more expressive
 *  • Documents map naturally to our TOPICS/PHASE_LABELS structure
 *
 * DATABASE SCHEMA
 * ───────────────
 * Firestore collection layout:
 *
 *  categories/                        ← top-level collection
 *    devops-sre/                      ← document (one per roadmap)
 *      meta: { title, description, accentColor, tags[] }
 *      phases/                        ← sub-collection
 *        phase_labels: { foundation: "Phase 1: Foundation", ... }
 *        phase_order:  { order: ["overview","foundation",...] }
 *      topics/                        ← sub-collection
 *        overview: { id, label, phase, title, why, ... }
 *        linux:    { id, label, phase, title, why, stages[], ... }
 *        ...
 *    java/
 *      ...
 *
 *  users/                             ← top-level collection
 *    <uid>/
 *      email: "user@example.com"
 *      role:  "admin" | "user"
 *      displayName: "Alice"
 *      createdAt: Timestamp
 * ═══════════════════════════════════════════════════════════════════
 */

// Firebase v9+ modular SDK (imported via CDN ESM shim)
import { initializeApp }       from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth }             from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore }        from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ─────────────────────────────────────────────────────────────────
// 🔧  REPLACE THESE VALUES WITH YOUR OWN FROM FIREBASE CONSOLE
//     Project Settings → General → Your apps → SDK setup → Config
// ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBptGoX94xU29pPMvs9D3EJBWTYffVUnYE",
  authDomain: "studymap-dbb27.firebaseapp.com",
  projectId: "studymap-dbb27",
  storageBucket: "studymap-dbb27.firebasestorage.app",
  messagingSenderId: "649146908608",
  appId: "1:649146908608:web:4145f598f7d79d1756d225",
  measurementId: "G-5QMQDFE47W"
};

// Initialize Firebase (safe to call multiple times — returns cached app)
const app = initializeApp(firebaseConfig);

// Export shared service instances used throughout the app
export const auth = getAuth(app);
export const db   = getFirestore(app);

export default app;