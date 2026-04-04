/**
 * seed.js — One-time Firestore seeding script
 * ═══════════════════════════════════════════════════════════════════
 * Migrates your existing devops-sre-data.js and java-data.js files
 * into Firestore so you no longer need local data files.
 *
 * HOW TO RUN (one time only):
 * ─────────────────────────────────────────────────────────────────
 * 1. Install Node.js (https://nodejs.org) if you don't have it.
 * 2. npm install firebase-admin
 * 3. In Firebase Console:
 *    → Project Settings → Service accounts → Generate new private key
 *    → Save the downloaded file as  serviceAccountKey.json
 *       (in the same folder as this script — NEVER commit this to git!)
 * 4. Copy your devops-sre-data.js and java-data.js into this folder.
 *    Rename the global const to module.exports:
 *      // devops-sre-data.js
 *      module.exports = { TOPICS, PHASE_LABELS, PHASE_ORDER };
 * 5. node seed.js
 *
 * WHAT IT DOES:
 * ─────────────────────────────────────────────────────────────────
 * For each data file, it:
 *   a. Creates a  categories/<slug>  document with meta + phaseLabels
 *   b. Creates one  topics/<topicId>  document per topic
 *   c. Sets _order on each topic for correct display sorting
 *
 * Safe to re-run — uses setDoc which overwrites existing documents.
 * ═══════════════════════════════════════════════════════════════════
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // download from Firebase Console

// Initialize Firebase Admin SDK (server-side, bypasses security rules)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ── Import your local data files ────────────────────────────────
// Adjust the require() paths to match where your data files live.
// The files need to use module.exports instead of const.
const devopsData = require('./devops-sre-data.js');
const javaData   = require('./java-data.js');

// ── Dataset registry ────────────────────────────────────────────
// Add more entries here for additional roadmaps you want to seed.
const DATASETS = [
  {
    slug:        'devops-sre',
    title:       'DevOps & SRE',
    description: 'Linux to Kubernetes, CI/CD pipelines, cloud platforms, observability, and SRE principles. ~40 weeks end-to-end.',
    accentColor: '#2A4535',
    order:       1,
    tags:        ['Foundation', 'Platform', 'Cloud', 'Observability'],
    tagColors: [
      { bg:'#E4EEE9', tc:'#2A4535' },
      { bg:'#ECEAFC', tc:'#342E7A' },
      { bg:'#F5EDD8', tc:'#7A5C1A' },
      { bg:'#F3E8E3', tc:'#7A3218' }
    ],
    data:        devopsData
  },
  {
    slug:        'java',
    title:       'Java Developer',
    description: 'CS fundamentals through Spring Boot, distributed systems, databases, and full interview preparation. 9 phases.',
    accentColor: '#7A3218',
    order:       2,
    tags:        ['CS Fundamentals', 'Spring Boot', 'System Design'],
    tagColors: [
      { bg:'#E1F5EE', tc:'#085041' },
      { bg:'#E6F1FB', tc:'#0C447C' },
      { bg:'#FBEAF0', tc:'#72243E' }
    ],
    data:        javaData
  }
];

async function seed() {
  console.log('🌱 Starting Firestore seed…\n');

  for (const dataset of DATASETS) {
    const { slug, title, description, accentColor, order, tags, tagColors, data } = dataset;
    const { TOPICS, PHASE_LABELS, PHASE_ORDER } = data;

    console.log(`📂 Seeding category: ${slug} (${TOPICS.length} topics)`);

    // 1. Write the category document
    await db.collection('categories').doc(slug).set({
      title,
      description,
      accentColor,
      order,
      tags,
      tagColors,
      phaseLabels: PHASE_LABELS,
      phaseOrder:  PHASE_ORDER || [],
      createdAt:   admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:   admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`  ✓ Category document written`);

    // 2. Write each topic as a document in the topics sub-collection
    const batch = db.batch();
    TOPICS.forEach((topic, index) => {
      const topicRef = db
        .collection('categories')
        .doc(slug)
        .collection('topics')
        .doc(topic.id);

      // Add _order for sorting (position in the original TOPICS array)
      batch.set(topicRef, {
        ...topic,
        _order:    index,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    // Firestore batch writes are limited to 500 ops.
    // If you have > 490 topics, split into multiple batches.
    await batch.commit();
    console.log(`  ✓ ${TOPICS.length} topics written`);
    console.log('');
  }

  console.log('✅ Seeding complete!\n');
  console.log('Next steps:');
  console.log('  1. Open Firebase Console → Firestore → verify data looks correct');
  console.log('  2. Create your first admin user:');
  console.log('     - Sign in to the app once (creates a users/{uid} doc)');
  console.log('     - In Firestore Console: users/{uid} → Edit → role: "admin"');
  console.log('  3. Deploy Firestore security rules (see firestore.rules)');
  console.log('  4. Delete serviceAccountKey.json from this folder');
  console.log('');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});