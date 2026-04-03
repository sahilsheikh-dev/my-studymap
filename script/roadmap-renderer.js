/* ═══════════════════════════════════════════════════════════
   roadmap-renderer.js
   Shared rendering engine for all learning roadmap pages.
   Drop a new <script src="data/your-data.js"> before this
   file in any roadmap HTML page and it just works.
═══════════════════════════════════════════════════════════ */

/* ── OVERVIEW RENDERER ── */
function renderOverview() {
  // Build phases from TOPICS — group by phase in PHASE_ORDER order
  const phaseTopicMap = {};
  TOPICS.filter(t => t.id !== 'overview').forEach(t => {
    if (!phaseTopicMap[t.phase]) phaseTopicMap[t.phase] = [];
    phaseTopicMap[t.phase].push(t.label);
  });

  const phaseColors = {
    foundation:    { bg:'#E1F5EE', tc:'#085041' },
    platform:      { bg:'#EEEDFE', tc:'#3C3489' },
    cloud:         { bg:'#FAEEDA', tc:'#633806' },
    observability: { bg:'#FAECE7', tc:'#993C1D' },
    scripting:     { bg:'#EAF3DE', tc:'#27500A' },
    java_core:     { bg:'#EEEDFE', tc:'#3C3489' },
    backend:       { bg:'#E6F1FB', tc:'#0C447C' },
    databases:     { bg:'#FAECE7', tc:'#993C1D' },
    system_design: { bg:'#FBEAF0', tc:'#72243E' },
    devops:        { bg:'#E6F1FB', tc:'#0C447C' },
    testing:       { bg:'#EAF3DE', tc:'#27500A' },
    projects:      { bg:'#E1F5EE', tc:'#085041' },
    interviews:    { bg:'#FAEEDA', tc:'#633806' },
  };

  const orderedPhases = (typeof PHASE_ORDER !== 'undefined' ? PHASE_ORDER : Object.keys(phaseTopicMap))
    .filter(p => p !== 'overview' && phaseTopicMap[p]);

  let html = `<div style="display:grid;gap:12px;margin-bottom:24px">`;
  orderedPhases.forEach((phase, idx) => {
    const c = phaseColors[phase] || { bg:'#f5f5f5', tc:'#333' };
    const label = PHASE_LABELS[phase] || phase;
    const topics = phaseTopicMap[phase] || [];
    html += `<div style="background:${c.bg};border-radius:12px;padding:1rem 1.25rem">
      <div style="font-size:14px;font-weight:500;color:${c.tc};margin-bottom:8px">${label}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${topics.map(t =>
        `<span style="font-size:12px;padding:3px 8px;border-radius:99px;background:rgba(255,255,255,0.5);color:${c.tc}">${t}</span>`
      ).join('')}</div>
    </div>`;
  });
  html += `</div>`;

  html += `<div style="font-size:14px;font-weight:500;color:#111;margin-bottom:12px">Jump to a topic</div>`;
  html += `<div class="nav-grid">`;
  TOPICS.filter(t => t.id !== 'overview').forEach((t, i) => {
    const c = phaseColors[t.phase] || {};
    html += `<div class="topic-nav-card" onclick="showTopic('${t.id}')">
      <div class="tnc-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="tnc-name">${t.label}</div>
      <div class="tnc-phase" style="color:${(c.tc)||'#888'}">${PHASE_LABELS[t.phase] || ''}</div>
    </div>`;
  });
  html += `</div>`;
  return html;
}

/* ── TOPIC RENDERER ── */
function renderTopic(t) {
  let html = '';

  html += `<div class="topic-header">
    <div>
      <div class="topic-title">${t.title}</div>
      <div class="topic-why">${t.why}</div>
    </div>
    <div class="badges">
      ${(t.badges || []).map(b => `<span class="badge ${b.c}">${b.t}</span>`).join('')}
      <span class="badge" style="background:#f5f5f5;color:#666">${PHASE_LABELS[t.phase] || t.phase}</span>
    </div>
  </div>`;

  if (t.prereqs) {
    html += `<div class="accent-bar accent-blue" style="margin-bottom:16px">
      <strong style="font-size:12px;font-weight:500">Prerequisites: </strong>${t.prereqs.join(' · ')}
    </div>`;
  }

  if (t.stages) {
    const stageKeys    = ['beginner','intermediate','advanced'];
    const stageClasses = ['stage-bgn','stage-int','stage-adv'];
    const stageLabels  = ['Beginner','Intermediate','Advanced'];
    html += `<div style="font-size:13px;font-weight:500;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Learning progression</div>`;
    html += `<div class="stages">`;
    t.stages.forEach((s, i) => {
      const skey = stageKeys[i];
      html += `<div class="stage-card ${stageClasses[i]}">
        <div class="stage-label">${stageLabels[i]}</div>
        <div class="stage-body">${s.items.map((x, j) => {
          const key = `${t.id}::stage_${skey}::${j}`;
          return `<label class="check-item" style="padding:2px 0">
            <input type="checkbox" data-key="${key}" onchange="saveCheck(this)">
            <span>${x}</span>
          </label>`;
        }).join('')}</div>
      </div>`;
    });
    html += `</div>`;
  }

  function checkList(items, tid, section) {
    return items.map((x, i) => {
      const key = `${tid}::${section}::${i}`;
      return `<label class="check-item" id="ci-${key.replace(/:/g,'_')}">
        <input type="checkbox" data-key="${key}" onchange="saveCheck(this)">
        <span>${x}</span>
      </label>`;
    }).join('');
  }

  html += `<div class="grid2">`;
  if (t.projects)   html += `<div class="card"><div class="card-title">Hands-on projects</div><div class="card-body">${checkList(t.projects, t.id, 'projects')}</div></div>`;
  if (t.usecases)   html += `<div class="card"><div class="card-title">Real-world production use cases</div><div class="card-body">${checkList(t.usecases, t.id, 'usecases')}</div></div>`;
  if (t.mistakes)   html += `<div class="card"><div class="card-title">Common beginner mistakes</div><div class="card-body">${checkList(t.mistakes, t.id, 'mistakes')}</div></div>`;
  if (t.production) html += `<div class="card"><div class="card-title">How it is used in production</div><div class="card-body">${t.production}</div></div>`;
  html += `</div>`;

  if (t.ready) {
    html += `<div style="font-size:13px;font-weight:500;color:#666;text-transform:uppercase;letter-spacing:.05em;margin:16px 0 4px">Ready to move on when you can:</div>`;
    html += `<div class="progress-label" id="ready-prog-${t.id}"></div>`;
    html += `<div class="progress-bar-wrap"><div class="progress-bar-fill" id="ready-bar-${t.id}" style="width:0%"></div></div>`;
    html += `<div class="ready-list">${t.ready.map((r, i) => {
      const key = `${t.id}::ready::${i}`;
      return `<label class="ready-item" id="ci-${key.replace(/:/g,'_')}">
        <input type="checkbox" data-key="${key}" onchange="saveCheck(this)">
        <span>${r}</span>
      </label>`;
    }).join('')}</div>`;
  }

  return html;
}

/* ── STORAGE ── */
// Namespace storage per-page so DevOps and Java progress don't collide
const STORAGE_NS = 'roadmap::' + (document.title || 'default') + '::';

function storageKey(key) { return STORAGE_NS + key; }

function saveCheck(el) {
  const key = el.dataset.key;
  localStorage.setItem(storageKey(key), el.checked ? '1' : '0');
  el.closest('label').classList.toggle('done', el.checked);
  updateTopicProgress(key.split('::')[0]);
  updateGlobalProgress();
}

function loadChecks() {
  document.querySelectorAll('input[type=checkbox][data-key]').forEach(el => {
    el.checked = localStorage.getItem(storageKey(el.dataset.key)) === '1';
    el.closest('label').classList.toggle('done', el.checked);
  });
}

function getTopicChecks(tid) {
  const t = TOPICS.find(x => x.id === tid);
  if (!t) return { done: 0, total: 0 };
  let done = 0, total = 0;
  ['projects','usecases','mistakes','ready'].forEach(sec => {
    if (!t[sec]) return;
    t[sec].forEach((_, i) => {
      total++;
      if (localStorage.getItem(storageKey(`${tid}::${sec}::${i}`)) === '1') done++;
    });
  });
  if (t.stages) {
    ['beginner','intermediate','advanced'].forEach((skey, si) => {
      if (!t.stages[si]) return;
      t.stages[si].items.forEach((_, i) => {
        total++;
        if (localStorage.getItem(storageKey(`${tid}::stage_${skey}::${i}`)) === '1') done++;
      });
    });
  }
  return { done, total };
}

function updateTopicProgress(tid) {
  const t = TOPICS.find(x => x.id === tid);
  if (!t || !t.ready) return;
  let rdone = 0;
  t.ready.forEach((_, i) => {
    if (localStorage.getItem(storageKey(`${tid}::ready::${i}`)) === '1') rdone++;
  });
  const bar = document.getElementById(`ready-bar-${tid}`);
  const lbl = document.getElementById(`ready-prog-${tid}`);
  if (bar) bar.style.width = Math.round((rdone / t.ready.length) * 100) + '%';
  if (lbl) lbl.textContent = `${rdone} / ${t.ready.length} completed`;
}

function updateGlobalProgress() {
  let totalDone = 0, totalAll = 0;
  TOPICS.filter(t => t.id !== 'overview').forEach(t => {
    const { done, total } = getTopicChecks(t.id);
    totalDone += done; totalAll += total;
  });
  const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
  const fill  = document.getElementById('gp-bar-fill');
  const count = document.getElementById('gp-count');
  if (fill)  fill.style.width = pct + '%';
  if (count) count.textContent = `${totalDone} / ${totalAll} (${pct}%)`;
}

function showTopic(id) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  const btn = document.getElementById('btn-' + id);
  if (sec) sec.classList.add('visible');
  if (btn) btn.classList.add('active');
  loadChecks();
  if (id !== 'overview') updateTopicProgress(id);
}

/* ── DOM BUILD ── */
const topbar    = document.getElementById('topbar');
const contentEl = document.getElementById('content');

// Global progress bar
const gpWrap = document.createElement('div');
gpWrap.className = 'global-progress';
gpWrap.innerHTML = `
  <span class="gp-label">Overall progress</span>
  <div class="gp-bar-wrap"><div class="gp-bar-fill" id="gp-bar-fill" style="width:0%"></div></div>
  <span class="gp-count" id="gp-count">0 / 0 (0%)</span>`;
document.querySelector('.root').insertBefore(gpWrap, topbar);

// Nav buttons + content sections
let lastPhase = null;
TOPICS.forEach(t => {
  if (t.phase !== lastPhase) {
    if (t.id !== 'overview') {
      const lbl = document.createElement('span');
      lbl.className = 'phase-label';
      lbl.textContent = PHASE_LABELS[t.phase] || t.phase;
      topbar.appendChild(lbl);
    }
    lastPhase = t.phase;
  }

  const btn = document.createElement('button');
  btn.className = 'nav-btn';
  btn.id = 'btn-' + t.id;
  btn.textContent = t.label;
  btn.onclick = () => showTopic(t.id);
  topbar.appendChild(btn);

  const sec = document.createElement('div');
  sec.className = 'sec';
  sec.id = 'sec-' + t.id;
  sec.innerHTML = t.id === 'overview' ? renderOverview() : renderTopic(t);
  contentEl.appendChild(sec);
});

showTopic('overview');
loadChecks();
TOPICS.filter(t => t.id !== 'overview').forEach(t => updateTopicProgress(t.id));
updateGlobalProgress();