/**
 * script.js — Dynamic Roadmap Renderer
 * ═══════════════════════════════════════════════════════════════════
 *
 * HOW DATA LOADING WORKS
 * ─────────────────────────────────────────────────────────────────
 * 1. Read the "data" query parameter from the URL.
 *    e.g.  details.html?data=devops-sre  →  slug = "devops-sre"
 *
 * 2. Dynamically inject a <script> tag:
 *    <script src="data/devops-sre-data.js">
 *    That file sets the global variables TOPICS, PHASE_LABELS, and
 *    optionally PHASE_ORDER.
 *
 * 3. On script load success, call init() which:
 *      a. Sets the page <title> and topbar title
 *      b. Builds the sticky nav strip (phase labels + topic buttons)
 *      c. Renders every topic section (overview + individual topics)
 *      d. Restores checkbox state from localStorage
 *      e. Updates progress bars
 *
 * 4. On script load error (file not found), show an error screen.
 *
 * ADDING A NEW ROADMAP
 * ─────────────────────────────────────────────────────────────────
 * • Create  data/your-slug-data.js  that defines TOPICS + PHASE_LABELS.
 * • Add a card in index.html linking to  details.html?data=your-slug
 * • Done. No changes needed here.
 *
 * LOCALSTORAGE NAMESPACE
 * ─────────────────────────────────────────────────────────────────
 * Keys are namespaced as  "rm::<slug>::<checkboxKey>"
 * so progress for each roadmap is stored independently.
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ── Phase color palette — used for overview cards and jump grid ── */
const PHASE_COLORS = {
  foundation:    { bg: '#E8F5EE', tc: '#085041' },
  platform:      { bg: '#EEEDFE', tc: '#342E7A' },
  cloud:         { bg: '#FEF8EC', tc: '#7A5C1A' },
  observability: { bg: '#FAECE7', tc: '#993C1D' },
  scripting:     { bg: '#EAF3DE', tc: '#27500A' },
  java_core:     { bg: '#EEEDFE', tc: '#342E7A' },
  backend:       { bg: '#E6F1FB', tc: '#0C447C' },
  databases:     { bg: '#FCE4EC', tc: '#880E4F' },
  system_design: { bg: '#F3E5F5', tc: '#4A148C' },
  devops:        { bg: '#E6F1FB', tc: '#0C447C' },
  testing:       { bg: '#EAF3DE', tc: '#27500A' },
  projects:      { bg: '#E1F5EE', tc: '#085041' },
  interviews:    { bg: '#FEF8EC', tc: '#7A5C1A' },
};

/* ── DOM references ── */
const $topbarTitle   = document.getElementById('topbar-title');
const $gpFill        = document.getElementById('gp-fill');
const $gpCount       = document.getElementById('gp-count');
const $navInner      = document.getElementById('nav-strip-inner');
const $content       = document.getElementById('details-content');
const $footer        = document.getElementById('details-footer');
const $loading       = document.getElementById('loading-screen');

/* ── Runtime state ── */
let SLUG = '';        // e.g. "devops-sre"
let STORAGE_NS = '';  // e.g. "rm::devops-sre::"

/* ══════════════════════════════════════════════════════════════════
   STEP 1 — Parse URL and load the data file
   ══════════════════════════════════════════════════════════════════ */

/**
 * Reads the ?data=<slug> query parameter.
 * Returns the slug string, or null if missing.
 */
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('data') || null;
}

/**
 * Dynamically injects <script src="data/<slug>-data.js">.
 * On success, calls init().
 * On failure (404 etc.), calls showError().
 *
 * The data file is expected to define globals:
 *   TOPICS       — Array of topic objects
 *   PHASE_LABELS — Object mapping phase id → display name
 *   PHASE_ORDER  — (optional) Array of phase ids in display order
 */
function loadDataFile(slug) {
  const script = document.createElement('script');
  script.src = `data/${slug}-data.js`;

  script.onload = () => {
    // Validate that the file defined the required globals
    if (typeof TOPICS === 'undefined' || typeof PHASE_LABELS === 'undefined') {
      showError(
        'Bad data file',
        `<code>data/${slug}-data.js</code> loaded but did not define <code>TOPICS</code> or <code>PHASE_LABELS</code>.`
      );
      return;
    }
    init(slug);
  };

  script.onerror = () => {
    showError(
      'Roadmap not found',
      `Could not load <code>data/${slug}-data.js</code>. Make sure the file exists and the slug is spelled correctly.`
    );
  };

  document.head.appendChild(script);
}

/* ══════════════════════════════════════════════════════════════════
   STEP 2 — Initialise after data is ready
   ══════════════════════════════════════════════════════════════════ */

function init(slug) {
  SLUG = slug;
  STORAGE_NS = `rm::${slug}::`;

  // Infer a human-readable roadmap name from the overview topic or slug
  const overviewTopic = TOPICS.find(t => t.id === 'overview');
  const roadmapName = overviewTopic?.label
    ? overviewTopic.label
    : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Set page title (used by browser tab + localStorage namespace)
  document.title = `${roadmapName} — Roadmap`;
  $topbarTitle.textContent = roadmapName;

  // Build UI
  buildNav();
  buildAllSections();

  // Restore saved checkbox state
  loadAllChecks();

  // Update progress displays
  TOPICS.filter(t => t.id !== 'overview').forEach(t => updateTopicProgress(t.id));
  updateGlobalProgress();

  // Show footer
  $footer.style.display = '';
}

/* ══════════════════════════════════════════════════════════════════
   NAV STRIP — phase labels + topic buttons
   ══════════════════════════════════════════════════════════════════ */

/**
 * Builds the sticky nav strip.
 * Groups topic buttons by phase, inserting a phase label before each group.
 */
function buildNav() {
  $navInner.innerHTML = '';

  // Determine ordered list of phases
  const orderedPhases = getPhaseOrder();

  // Build a map: phase → [topics]
  const byPhase = {};
  TOPICS.forEach(t => {
    if (!byPhase[t.phase]) byPhase[t.phase] = [];
    byPhase[t.phase].push(t);
  });

  orderedPhases.forEach(phase => {
    const topics = byPhase[phase];
    if (!topics) return;

    // Phase label (except for overview which has no visual separator)
    if (phase !== 'overview') {
      const lbl = document.createElement('span');
      lbl.className = 'phase-divider';
      lbl.textContent = PHASE_LABELS[phase] || phase;
      $navInner.appendChild(lbl);
    }

    topics.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.id = `btn-${t.id}`;
      btn.textContent = t.label;
      btn.setAttribute('aria-label', `Go to ${t.label}`);
      btn.addEventListener('click', () => showSection(t.id));
      $navInner.appendChild(btn);
    });
  });
}

/* ══════════════════════════════════════════════════════════════════
   SECTION RENDERING
   ══════════════════════════════════════════════════════════════════ */

/**
 * Builds and injects all section panels into #details-content.
 * Removes the loading spinner first.
 */
function buildAllSections() {
  // Remove loading screen
  $loading.remove();

  TOPICS.forEach(t => {
    const panel = document.createElement('section');
    panel.className = 'section-panel';
    panel.id = `sec-${t.id}`;
    panel.setAttribute('aria-label', t.label || t.id);

    panel.innerHTML = t.id === 'overview'
      ? renderOverview()
      : renderTopic(t);

    $content.appendChild(panel);
  });

  // Show overview by default
  showSection('overview');
}

/* ── SHOW / HIDE sections ── */
function showSection(id) {
  // Hide all panels
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('visible'));
  // Deactivate all nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(`sec-${id}`);
  const btn   = document.getElementById(`btn-${id}`);

  if (panel) panel.classList.add('visible');
  if (btn)   btn.classList.add('active');

  // Scroll nav button into view (for mobile horizontal scroll)
  if (btn) btn.scrollIntoView({ inline: 'nearest', block: 'nearest' });

  // Restore checks for newly visible section
  if (panel) {
    panel.querySelectorAll('input[type="checkbox"][data-key]').forEach(restoreCheck);
  }

  if (id !== 'overview') updateTopicProgress(id);
}

/* ══════════════════════════════════════════════════════════════════
   OVERVIEW RENDERER
   ══════════════════════════════════════════════════════════════════ */

function renderOverview() {
  const orderedPhases = getPhaseOrder().filter(p => p !== 'overview');

  // Group topics by phase
  const byPhase = {};
  TOPICS.filter(t => t.id !== 'overview').forEach(t => {
    if (!byPhase[t.phase]) byPhase[t.phase] = [];
    byPhase[t.phase].push(t);
  });

  let html = '';

  // ── Phase summary cards ──
  html += `<div class="overview-phases">`;
  orderedPhases.forEach(phase => {
    const topics = byPhase[phase];
    if (!topics) return;
    const c = PHASE_COLORS[phase] || { bg: '#f5f5f5', tc: '#333' };
    const label = PHASE_LABELS[phase] || phase;
    const chips = topics.map(t =>
      `<span class="phase-topic-chip" style="color:${c.tc}">${escHtml(t.label)}</span>`
    ).join('');
    html += `
      <div class="phase-summary-card" style="background:${c.bg}">
        <p class="phase-summary-name" style="color:${c.tc}">${escHtml(label)}</p>
        <div class="phase-topics-chips">${chips}</div>
      </div>`;
  });
  html += `</div>`;

  // ── Jump grid ──
  html += `<p class="overview-jump-heading">Jump to a topic</p>`;
  html += `<div class="jump-grid">`;
  TOPICS.filter(t => t.id !== 'overview').forEach((t, i) => {
    const c = PHASE_COLORS[t.phase] || {};
    html += `
      <div class="jump-card" onclick="showSection('${escAttr(t.id)}')" role="button" tabindex="0"
           onkeydown="if(event.key==='Enter'||event.key===' ')showSection('${escAttr(t.id)}')">
        <p class="jump-num">${String(i + 1).padStart(2, '0')}</p>
        <p class="jump-name">${escHtml(t.label)}</p>
        <p class="jump-phase" style="color:${c.tc || '#888'}">${escHtml(PHASE_LABELS[t.phase] || t.phase)}</p>
      </div>`;
  });
  html += `</div>`;

  return html;
}

/* ══════════════════════════════════════════════════════════════════
   TOPIC RENDERER
   ══════════════════════════════════════════════════════════════════ */

function renderTopic(t) {
  let html = '';

  // ── Topic header ──
  const badges = (t.badges || [])
    .map(b => `<span class="badge ${escAttr(b.c)}">${escHtml(b.t)}</span>`)
    .join('');
  const phaseBadge = `<span class="badge b-neutral">${escHtml(PHASE_LABELS[t.phase] || t.phase)}</span>`;

  html += `
    <div class="topic-header">
      <div>
        <h2 class="topic-title">${escHtml(t.title)}</h2>
        <p class="topic-why">${escHtml(t.why)}</p>
      </div>
      <div class="topic-badges">${badges}${phaseBadge}</div>
    </div>`;

  // ── Prerequisites ──
  if (t.prereqs && t.prereqs.length) {
    html += `
      <div class="prereqs-bar">
        <strong>Prerequisites: </strong>${t.prereqs.map(escHtml).join(' · ')}
      </div>`;
  }

  // ── Learning stages ──
  if (t.stages && t.stages.length) {
    html += `<p class="stages-heading">Learning progression</p>`;
    html += `<div class="stages-grid">`;

    const stageKeys    = ['beginner', 'intermediate', 'advanced'];
    const stageClasses = ['stage-beginner', 'stage-intermediate', 'stage-advanced'];
    const stageLabels  = ['Beginner', 'Intermediate', 'Advanced'];

    t.stages.forEach((stage, i) => {
      const sKey = stageKeys[i];
      const items = stage.items.map((x, j) => {
        const key = `${t.id}::stage_${sKey}::${j}`;
        return `
          <label class="check-item">
            <input type="checkbox" data-key="${escAttr(key)}" onchange="saveCheck(this)" />
            <span>${escHtml(x)}</span>
          </label>`;
      }).join('');

      html += `
        <div class="stage-card ${stageClasses[i]}">
          <p class="stage-label">${stageLabels[i]}</p>
          <div>${items}</div>
        </div>`;
    });

    html += `</div>`;
  }

  // ── Info cards (projects, usecases, mistakes, production) ──
  const infoCards = [
    { key: 'projects',   title: 'Hands-on projects' },
    { key: 'usecases',   title: 'Real-world production use cases' },
    { key: 'mistakes',   title: 'Common beginner mistakes' },
    { key: 'production', title: 'How it is used in production' },
  ];

  const hasCards = infoCards.some(c => t[c.key]);
  if (hasCards) {
    html += `<div class="cards-grid">`;
    infoCards.forEach(({ key, title }) => {
      const val = t[key];
      if (!val) return;

      let bodyHtml = '';
      if (Array.isArray(val)) {
        // Render as checkboxes
        bodyHtml = val.map((x, i) => {
          const ck = `${t.id}::${key}::${i}`;
          return `
            <label class="check-item">
              <input type="checkbox" data-key="${escAttr(ck)}" onchange="saveCheck(this)" />
              <span>${escHtml(x)}</span>
            </label>`;
        }).join('');
      } else {
        // Plain text / HTML string
        bodyHtml = `<p>${val}</p>`;
      }

      html += `
        <div class="info-card">
          <p class="info-card-title">${title}</p>
          <div class="info-card-body">${bodyHtml}</div>
        </div>`;
    });
    html += `</div>`;
  }

  // ── Ready checklist ──
  if (t.ready && t.ready.length) {
    html += `<p class="ready-heading">Ready to move on when you can:</p>`;
    html += `<p class="ready-progress-label" id="ready-lbl-${escAttr(t.id)}"></p>`;
    html += `
      <div class="ready-bar-track">
        <div class="ready-bar-fill" id="ready-bar-${escAttr(t.id)}" style="width:0%"></div>
      </div>`;
    html += `<div class="ready-list">`;
    t.ready.forEach((r, i) => {
      const key = `${t.id}::ready::${i}`;
      html += `
        <label class="ready-item">
          <input type="checkbox" data-key="${escAttr(key)}" onchange="saveCheck(this)" />
          <span>${escHtml(r)}</span>
        </label>`;
    });
    html += `</div>`;
  }

  return html;
}

/* ══════════════════════════════════════════════════════════════════
   PROGRESS TRACKING
   ══════════════════════════════════════════════════════════════════ */

/** Save a checkbox state to localStorage and refresh progress bars. */
function saveCheck(el) {
  const key = el.dataset.key;
  localStorage.setItem(STORAGE_NS + key, el.checked ? '1' : '0');
  el.closest('label').classList.toggle('done', el.checked);

  const topicId = key.split('::')[0];
  updateTopicProgress(topicId);
  updateGlobalProgress();
}

/** Restore a single checkbox from localStorage. */
function restoreCheck(el) {
  const val = localStorage.getItem(STORAGE_NS + el.dataset.key);
  el.checked = val === '1';
  el.closest('label').classList.toggle('done', el.checked);
}

/** Restore all checkboxes currently in the DOM. */
function loadAllChecks() {
  document.querySelectorAll('input[type="checkbox"][data-key]').forEach(restoreCheck);
}

/**
 * Count done/total checkboxes for a given topic id.
 * Covers stages, info-card items, and the ready list.
 */
function getTopicChecks(tid) {
  const t = TOPICS.find(x => x.id === tid);
  if (!t) return { done: 0, total: 0 };

  let done = 0, total = 0;

  // Info card sections
  ['projects', 'usecases', 'mistakes', 'ready'].forEach(sec => {
    if (!Array.isArray(t[sec])) return;
    t[sec].forEach((_, i) => {
      total++;
      if (localStorage.getItem(STORAGE_NS + `${tid}::${sec}::${i}`) === '1') done++;
    });
  });

  // Stage items
  if (t.stages) {
    ['beginner', 'intermediate', 'advanced'].forEach((sKey, si) => {
      if (!t.stages[si]) return;
      t.stages[si].items.forEach((_, i) => {
        total++;
        if (localStorage.getItem(STORAGE_NS + `${tid}::stage_${sKey}::${i}`) === '1') done++;
      });
    });
  }

  return { done, total };
}

/** Update the ready-checklist progress bar for a single topic. */
function updateTopicProgress(tid) {
  const t = TOPICS.find(x => x.id === tid);
  if (!t || !t.ready) return;

  const total = t.ready.length;
  let done = 0;
  t.ready.forEach((_, i) => {
    if (localStorage.getItem(STORAGE_NS + `${tid}::ready::${i}`) === '1') done++;
  });

  const bar = document.getElementById(`ready-bar-${tid}`);
  const lbl = document.getElementById(`ready-lbl-${tid}`);
  if (bar) bar.style.width = Math.round((done / total) * 100) + '%';
  if (lbl) lbl.textContent = `${done} / ${total} completed`;
}

/** Update the global progress bar in the sticky topbar. */
function updateGlobalProgress() {
  let totalDone = 0, totalAll = 0;
  TOPICS.filter(t => t.id !== 'overview').forEach(t => {
    const { done, total } = getTopicChecks(t.id);
    totalDone += done;
    totalAll  += total;
  });

  const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
  $gpFill.style.width  = pct + '%';
  $gpCount.textContent = `${totalDone}/${totalAll} (${pct}%)`;
}

/* ══════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════ */

/**
 * Returns the ordered list of phase IDs to render.
 * Uses PHASE_ORDER global if defined in data file, otherwise infers
 * order from the sequence topics appear in TOPICS.
 */
function getPhaseOrder() {
  if (typeof PHASE_ORDER !== 'undefined' && Array.isArray(PHASE_ORDER)) {
    return PHASE_ORDER;
  }
  // Infer order from TOPICS array (preserving first-seen order)
  const seen = new Set();
  const order = [];
  TOPICS.forEach(t => {
    if (!seen.has(t.phase)) { seen.add(t.phase); order.push(t.phase); }
  });
  return order;
}

/** Escape a string for safe insertion into HTML text nodes. */
function escHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape a string for safe use in an HTML attribute value. */
function escAttr(str) {
  return escHtml(String(str ?? ''));
}

/* ══════════════════════════════════════════════════════════════════
   ERROR SCREEN
   ══════════════════════════════════════════════════════════════════ */

function showError(title, detail) {
  $loading.innerHTML = `
    <div class="error-screen">
      <p class="error-code">404</p>
      <p class="error-message">
        <strong>${escHtml(title)}</strong><br/>
        ${detail}
      </p>
      <a class="error-back-btn" href="index.html">← Back to all roadmaps</a>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════
   ENTRY POINT
   ══════════════════════════════════════════════════════════════════ */

(function bootstrap() {
  /**
   * REDIRECT LOGIC
   * ─────────────────────────────────────────────────────────────────
   * 1. Read ?data=<slug> from the URL.
   * 2. If missing, redirect back to index.html so the user can pick.
   * 3. Sanitise the slug (allow only a-z, 0-9, and hyphens/underscores)
   *    to prevent path traversal attacks before injecting into src.
   * 4. Dynamically load  data/<slug>-data.js
   */
  const slug = getSlugFromURL();

  if (!slug) {
    // No slug — send user back to the selector page
    window.location.replace('index.html');
    return;
  }

  // Sanitise: only allow safe characters in the slug
  const safeSlug = slug.replace(/[^a-zA-Z0-9\-_]/g, '');
  if (!safeSlug) {
    showError('Invalid roadmap slug', `The value "<code>${escHtml(slug)}</code>" is not a valid roadmap identifier.`);
    return;
  }

  // Load the data file dynamically
  loadDataFile(safeSlug);
})();