const PHASE_COLORS = {
  overview: { bg: '#F5F3EE', tc: '#5C5850' },
  foundation: { bg: '#E8F5EE', tc: '#085041' },
  platform: { bg: '#EEEDFE', tc: '#342E7A' },
  cloud: { bg: '#FEF8EC', tc: '#7A5C1A' },
  observability: { bg: '#FAECE7', tc: '#993C1D' },
  scripting: { bg: '#EAF3DE', tc: '#27500A' },
  java_core: { bg: '#EEEDFE', tc: '#342E7A' },
  backend: { bg: '#E6F1FB', tc: '#0C447C' },
  databases: { bg: '#FCE4EC', tc: '#880E4F' },
  system_design: { bg: '#F3E5F5', tc: '#4A148C' },
  devops: { bg: '#E6F1FB', tc: '#0C447C' },
  testing: { bg: '#EAF3DE', tc: '#27500A' },
  projects: { bg: '#E1F5EE', tc: '#085041' },
  interviews: { bg: '#FEF8EC', tc: '#7A5C1A' },
};



function escHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) { return escHtml(String(str ?? '')); }

export function renderCheckKey(topicId, section, index) {
  return `${topicId}::${section}::${index}`;
}

export function renderOverview(topics, phaseLabels, phaseOrder, checkState = {}) {

  const byPhase = {};
  topics.filter(t => t.id !== 'overview').forEach(t => {
    if (!byPhase[t.phase]) byPhase[t.phase] = [];
    byPhase[t.phase].push(t);
  });

  const orderedPhases = (phaseOrder || Object.keys(byPhase)).filter(
    p => p !== 'overview' && byPhase[p]
  );

  let html = '';


  html += `<div class="overview-phases">`;
  orderedPhases.forEach(phase => {
    const ts = byPhase[phase] || [];
    const c = PHASE_COLORS[phase] || { bg: '#f5f5f5', tc: '#333' };
    const label = phaseLabels[phase] || phase;
    const chips = ts.map(t =>
      `<span class="phase-topic-chip" style="color:${c.tc}">${escHtml(t.label)}</span>`
    ).join('');
    html += `
      <div class="phase-summary-card" style="background:${c.bg}">
        <p class="phase-summary-name" style="color:${c.tc}">${escHtml(label)}</p>
        <div class="phase-topics-chips">${chips}</div>
      </div>`;
  });
  html += `</div>`;


  html += `<p class="overview-jump-heading">Jump to a topic</p>`;
  html += `<div class="jump-grid">`;
  topics.filter(t => t.id !== 'overview').forEach((t, i) => {
    const c = PHASE_COLORS[t.phase] || {};
    html += `
      <div class="jump-card"
           role="button" tabindex="0"
           data-show="${escAttr(t.id)}"
           onkeydown="if(event.key==='Enter'||event.key===' ')showSection('${escAttr(t.id)}')">
        <p class="jump-num">${String(i + 1).padStart(2, '0')}</p>
        <p class="jump-name">${escHtml(t.label)}</p>
        <p class="jump-phase" style="color:${c.tc || '#888'}">
          ${escHtml(phaseLabels[t.phase] || t.phase)}
        </p>
      </div>`;
  });
  html += `</div>`;

  return html;
}


export function renderTopic(topic, phaseLabels, checkState = {}) {
  const t = topic;
  let html = '';


  const badges = (t.badges || [])
    .map(b => `<span class="badge ${escAttr(b.c)}">${escHtml(b.t)}</span>`)
    .join('');
  const phaseBadge = `<span class="badge b-neutral">${escHtml(phaseLabels[t.phase] || t.phase)}</span>`;

  html += `
    <div class="topic-header">
      <div>
        <h2 class="topic-title">${escHtml(t.title)}</h2>
        <p class="topic-why">${escHtml(t.why)}</p>
      </div>
      <div class="topic-badges">${badges}${phaseBadge}</div>
    </div>`;


  if (Array.isArray(t.prereqs) && t.prereqs.length) {
    html += `
      <div class="prereqs-bar">
        <strong>Prerequisites: </strong>${t.prereqs.map(escHtml).join(' · ')}
      </div>`;
  }


  if (Array.isArray(t.stages) && t.stages.length) {
    const stageKeys = ['beginner', 'intermediate', 'advanced'];
    const stageClasses = ['stage-beginner', 'stage-intermediate', 'stage-advanced'];
    const stageLabels = ['Beginner', 'Intermediate', 'Advanced'];

    html += `<p class="stages-heading">Learning progression</p>`;
    html += `<div class="stages-grid">`;

    t.stages.forEach((stage, i) => {
      const sKey = stageKeys[i];
      const sClass = stageClasses[i];
      const sLabel = stageLabels[i];
      const items = (stage.items || []).map((x, j) => {
        const key = renderCheckKey(t.id, `stage_${sKey}`, j);
        const checked = checkState[key] ? 'checked' : '';
        const done = checkState[key] ? 'done' : '';
        return `
          <label class="check-item ${done}">
            <input type="checkbox" data-key="${escAttr(key)}" ${checked}
                   onchange="window._onCheck && window._onCheck(this)" />
            <span>${escHtml(x)}</span>
          </label>`;
      }).join('');

      html += `
        <div class="stage-card ${sClass}">
          <p class="stage-label">${sLabel}</p>
          <div>${items}</div>
        </div>`;
    });

    html += `</div>`;
  }


  const INFO_SECTIONS = [
    { key: 'projects', title: 'Hands-on projects' },
    { key: 'usecases', title: 'Real-world use cases' },
    { key: 'mistakes', title: 'Common beginner mistakes' },
    { key: 'production', title: 'How it is used in production' },
  ];

  const hasCards = INFO_SECTIONS.some(s => t[s.key]);
  if (hasCards) {
    html += `<div class="cards-grid">`;
    INFO_SECTIONS.forEach(({ key, title }) => {
      const val = t[key];
      if (!val) return;

      let bodyHtml = '';
      if (Array.isArray(val)) {
        bodyHtml = val.map((x, i) => {
          const ck = renderCheckKey(t.id, key, i);
          const checked = checkState[ck] ? 'checked' : '';
          const done = checkState[ck] ? 'done' : '';
          return `
            <label class="check-item ${done}">
              <input type="checkbox" data-key="${escAttr(ck)}" ${checked}
                     onchange="window._onCheck && window._onCheck(this)" />
              <span>${escHtml(x)}</span>
            </label>`;
        }).join('');
      } else {
        bodyHtml = `<p>${escHtml(String(val))}</p>`;
      }

      html += `
        <div class="info-card">
          <p class="info-card-title">${title}</p>
          <div class="info-card-body">${bodyHtml}</div>
        </div>`;
    });
    html += `</div>`;
  }


  if (Array.isArray(t.ready) && t.ready.length) {
    const readyDone = t.ready.filter((_, i) => checkState[renderCheckKey(t.id, 'ready', i)]).length;
    const readyPct = Math.round((readyDone / t.ready.length) * 100);

    html += `<p class="ready-heading">Ready to move on when you can:</p>`;
    html += `<p class="ready-progress-label" id="ready-lbl-${escAttr(t.id)}">${readyDone} / ${t.ready.length} completed</p>`;
    html += `
      <div class="ready-bar-track">
        <div class="ready-bar-fill" id="ready-bar-${escAttr(t.id)}" style="width:${readyPct}%"></div>
      </div>`;
    html += `<div class="ready-list">`;
    t.ready.forEach((r, i) => {
      const key = renderCheckKey(t.id, 'ready', i);
      const checked = checkState[key] ? 'checked' : '';
      const done = checkState[key] ? 'done' : '';
      html += `
        <label class="ready-item ${done}">
          <input type="checkbox" data-key="${escAttr(key)}" ${checked}
                 onchange="window._onCheck && window._onCheck(this)" />
          <span>${escHtml(r)}</span>
        </label>`;
    });
    html += `</div>`;
  }

  return html;
}