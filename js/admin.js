/**
 * admin.js — Admin panel logic
 * ═══════════════════════════════════════════════════════════════════
 * Loaded only by admin.html. Manages categories, topics, and users.
 *
 * ── BUG FIXES APPLIED ─────────────────────────────────────────────
 *
 * BUG 1 FIX — Admin access race condition:
 *   OLD CODE:
 *     _currentUser = await requireAuth('login.html');
 *     if (!isAdmin()) { redirect; }   ← isAdmin() reads module state
 *                                       which may not be set yet
 *
 *   NEW CODE:
 *     _currentUser = await requireAuth('login.html');
 *     if (_currentUser.role !== 'admin') { redirect; }
 *     ↑ checks role on the returned object directly — no module state race
 *
 * BUG 4 FIX — Role update visible to admin without sign-out:
 *   After setUserRole(), refreshCurrentUser() is called so the admin's
 *   own cached AppUser stays current. Without this, if an admin demotes
 *   themselves, their session would still show role "admin" until reload.
 *
 * IMPROVEMENT — Admin self-demotion guard:
 *   An admin cannot demote their own account via the Users panel.
 *   This prevents accidentally locking yourself out of admin access.
 *   You can still demote yourself via Firestore Console if needed.
 *
 * IMPROVEMENT — Confirm before role toggle:
 *   Role changes now require confirmation (shows a confirm dialog)
 *   before writing to Firestore. Prevents accidental role changes.
 * ═══════════════════════════════════════════════════════════════════
 */

import { requireAuth, isAdmin, signOut, refreshCurrentUser } from './auth.js';
import {
  listCategories, getCategory, createCategory, updateCategory, deleteCategory,
  listTopics, setTopic, deleteTopic,
  listUsers, setUserRole
} from './db.js';

/* ── Module state ───────────────────────────────────────────────── */
let _categories = [];
let _activeSlug = null;
let _topics = [];
let _users = [];
let _currentUser = null;

/* ── DOM root ───────────────────────────────────────────────────── */
const $app = document.getElementById('admin-app');

/* ══════════════════════════════════════════════════════════════════
   ENTRY POINT
   ══════════════════════════════════════════════════════════════════ */

(async function bootstrap() {
  try {
    /* Step 1: Require login — redirects to login.html if not signed in */
    _currentUser = await requireAuth('login.html');

    /* Step 2: BUG 1 FIX — Check role on returned user, NOT isAdmin() */
    if (_currentUser.role !== 'admin') {
      // Not an admin — redirect silently to index
      window.location.href = 'index.html';
      return;
    }

    /* Step 3: Render the admin shell (topbar + sidebar + main area) */
    renderShell();

    /* Step 4: Load initial data in parallel for speed */
    await Promise.all([loadCategories(), loadUsers()]);

  } catch (err) {
    // Surface bootstrap errors visibly instead of hanging on the spinner
    $app.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;font-family:system-ui;">
        <p style="font-size:18px;font-weight:600;color:#E24B4A;">Admin panel failed to load</p>
        <p style="font-size:13px;color:#666;">${escHtml(err.message)}</p>
        <a href="index.html" style="font-size:13px;color:#3C3489;">← Go back</a>
      </div>`;
  }
})();

/* ══════════════════════════════════════════════════════════════════
   SHELL LAYOUT
   ══════════════════════════════════════════════════════════════════ */

function renderShell() {
  $app.innerHTML = `
    <header class="admin-topbar">
      <div class="admin-topbar-inner">
        <div class="admin-brand">
          <a href="index.html" class="admin-back">← Site</a>
          <span class="admin-title">Admin Panel</span>
        </div>
        <div class="admin-user-info">
          <span class="admin-user-email">${escHtml(_currentUser.email)}</span>
          <span class="admin-role-chip">admin</span>
          <button class="admin-signout-btn" onclick="window._adminSignOut()">Sign out</button>
        </div>
      </div>
    </header>

    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-sidebar-section">
          <p class="admin-sidebar-heading">Categories</p>
          <div id="cat-list" class="admin-cat-list">
            <div class="admin-loading-sm">Loading…</div>
          </div>
          <button class="admin-btn admin-btn-primary admin-btn-full"
                  onclick="window._openCategoryModal()">
            + New category
          </button>
        </div>
        <div class="admin-sidebar-section">
          <p class="admin-sidebar-heading">Navigation</p>
          <button class="admin-nav-link" onclick="window._showView('topics')">Topics</button>
          <button class="admin-nav-link" onclick="window._showView('users')">Users &amp; Roles</button>
        </div>
      </aside>

      <main class="admin-main" id="admin-main">

        <!-- Admin how-to instructions -->
        <section class="admin-howto">

          <p class="section-eyebrow" style="margin-bottom:12px;">
            How to add a new roadmap
          </p>

          <div class="how-to">
            <p class="how-to-heading">Four steps to extend this collection</p>

            <div class="steps-grid">
              <div class="step">
                <span class="step-num">1</span>
                <p class="step-text">
                  Use the left panel to manage categories and topics.
                </p>
              </div>

              <div class="step">
                <span class="step-num">2</span>
                <p class="step-text">
                  Click <strong>“+ New category”</strong> to create a roadmap and define its phases.
                </p>
              </div>

              <div class="step">
                <span class="step-num">3</span>
                <p class="step-text">
                  Add topics to the category using the topic editor.
                </p>
              </div>

              <div class="step">
                <span class="step-num">4</span>
                <p class="step-text">
                  Save — the roadmap appears instantly on the main page.
                </p>
              </div>
            </div>
          </div>

        </section>

        <!-- Empty state (shown until category is picked) -->
        <div class="admin-empty-state">
          <p class="admin-empty-icon">📚</p>
          <p class="admin-empty-text">
            Select a category from the sidebar to manage its topics.
          </p>
        </div>

      </main>
    </div>

    <div id="modal-container"></div>
    <div id="toast-container" class="admin-toast-container"></div>
  `;

  /* Expose handlers to inline onclick attributes */
  window._adminSignOut = () => signOut();
  window._openCategoryModal = () => openCategoryModal();
  window._showView = (v) => showView(v);
}

/* ══════════════════════════════════════════════════════════════════
   CATEGORIES SIDEBAR
   ══════════════════════════════════════════════════════════════════ */

async function loadCategories() {
  try {
    _categories = await listCategories();
    renderCategoryList();
  } catch (err) {
    toast('Failed to load categories: ' + err.message, 'error');
  }
}

function renderCategoryList() {
  const $list = document.getElementById('cat-list');
  if (!$list) return;

  if (!_categories.length) {
    $list.innerHTML = `<p class="admin-empty-sm">No categories yet.</p>`;
    return;
  }

  $list.innerHTML = _categories.map(cat => `
    <div class="admin-cat-item ${cat.slug === _activeSlug ? 'active' : ''}"
         onclick="window._selectCategory('${escAttr(cat.slug)}')">
      <span class="admin-cat-dot" style="background:${escAttr(cat.accentColor || '#666')}"></span>
      <span class="admin-cat-name">${escHtml(cat.title)}</span>
    </div>
  `).join('');

  window._selectCategory = (slug) => selectCategory(slug);
}

async function selectCategory(slug) {
  _activeSlug = slug;
  renderCategoryList();
  await showView('topics');
}

/* ══════════════════════════════════════════════════════════════════
   MAIN VIEWS
   ══════════════════════════════════════════════════════════════════ */

async function showView(view) {
  const $main = document.getElementById('admin-main');
  if (!$main) return;

  if (view === 'topics') {
    if (!_activeSlug) {
      $main.innerHTML = `
        <div class="admin-empty-state">
          <p class="admin-empty-text">Select a category from the sidebar first.</p>
        </div>`;
      return;
    }
    $main.innerHTML = `<div class="admin-loading">Loading topics…</div>`;
    try {
      _topics = await listTopics(_activeSlug);
      const cat = _categories.find(c => c.slug === _activeSlug);
      renderTopicsView($main, cat);
    } catch (err) {
      $main.innerHTML = `<div class="admin-error">Failed to load topics: ${escHtml(err.message)}</div>`;
    }

  } else if (view === 'users') {
    $main.innerHTML = `<div class="admin-loading">Loading users…</div>`;
    try {
      _users = await listUsers();
      renderUsersView($main);
    } catch (err) {
      $main.innerHTML = `<div class="admin-error">Failed to load users: ${escHtml(err.message)}</div>`;
    }
  }
}

/* ── TOPICS VIEW ─────────────────────────────────────────────────── */

function renderTopicsView($main, cat) {
  $main.innerHTML = `
    <div class="admin-view-header">
      <div>
        <h2 class="admin-view-title">${cat ? escHtml(cat.title) : escHtml(_activeSlug)}</h2>
        <p class="admin-view-subtitle">${_topics.length} topic(s)</p>
      </div>
      <div class="admin-view-actions">
        <button class="admin-btn admin-btn-danger-outline"
                onclick="window._confirmDeleteCategory('${escAttr(_activeSlug)}')">
          Delete category
        </button>
        <button class="admin-btn admin-btn-secondary"
                onclick="window._openCategoryModal('${escAttr(_activeSlug)}')">
          Edit category
        </button>
        <button class="admin-btn admin-btn-primary"
                onclick="window._openTopicModal()">
          + Add topic
        </button>
      </div>
    </div>
    <div class="admin-topics-grid" id="topics-grid">
      ${_topics.length
      ? _topics.map(t => renderTopicCard(t)).join('')
      : `<div class="admin-empty-state"><p class="admin-empty-text">No topics yet. Click "+ Add topic".</p></div>`
    }
    </div>`;

  window._openTopicModal = (id) => openTopicModal(id);
  window._confirmDeleteTopic = (id) => confirmDelete(
    `Delete topic "${id}"? This cannot be undone.`, () => doDeleteTopic(id)
  );
  window._confirmDeleteCategory = (slug) => confirmDelete(
    `Delete the entire "${slug}" category and ALL its topics? This cannot be undone.`,
    () => doDeleteCategory(slug)
  );
  window._openCategoryModal = (slug) => openCategoryModal(slug || null);
}

function renderTopicCard(t) {
  const preview = (t.why || '').substring(0, 100);
  return `
    <div class="admin-topic-card">
      <div class="admin-topic-card-header">
        <span class="admin-topic-id">${escHtml(t.id)}</span>
        <span class="admin-topic-phase">${escHtml(t.phase || '')}</span>
      </div>
      <p class="admin-topic-title">${escHtml(t.title || t.label || t.id)}</p>
      <p class="admin-topic-why">${escHtml(preview)}${preview.length >= 100 ? '…' : ''}</p>
      <div class="admin-topic-actions">
        <button class="admin-btn-sm admin-btn-secondary"
                onclick="window._openTopicModal('${escAttr(t.id)}')">Edit</button>
        <button class="admin-btn-sm admin-btn-danger"
                onclick="window._confirmDeleteTopic('${escAttr(t.id)}')">Delete</button>
      </div>
    </div>`;
}

/* ── USERS VIEW ──────────────────────────────────────────────────── */

function renderUsersView($main) {
  $main.innerHTML = `
    <div class="admin-view-header">
      <h2 class="admin-view-title">Users &amp; Roles</h2>
      <p class="admin-view-subtitle">${_users.length} registered user(s)</p>
    </div>

    <div class="admin-info-bar">
      <strong>Role update takes effect on the user's next sign-in.</strong>
      Firestore is updated immediately, but the user's current session
      uses their cached role until they sign out and back in.
    </div>

    <div class="admin-users-table-wrap">
      <table class="admin-users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Display Name</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${_users.map(u => renderUserRow(u)).join('')}
        </tbody>
      </table>
    </div>`;

  /* BUG 4 FIX + self-demotion guard */
  window._toggleRole = async (uid, currentRole, email) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    /* Guard: prevent admin from demoting themselves */
    if (uid === _currentUser.uid && newRole === 'user') {
      toast('You cannot demote your own admin account. Use Firestore Console if needed.', 'error');
      return;
    }

    const action = newRole === 'admin' ? 'promote' : 'demote';
    if (!confirm(`${action === 'promote' ? 'Promote' : 'Demote'} ${email} to "${newRole}"?`)) return;

    try {
      await setUserRole(uid, newRole);
      toast(`${email} is now "${newRole}"`, 'success');

      /* BUG 4 FIX: refresh current user's cache after role change */
      await refreshCurrentUser();

      /* Re-fetch users and re-render */
      _users = await listUsers();
      renderUsersView($main);
    } catch (e) {
      toast('Error updating role: ' + e.message, 'error');
    }
  };
}

function renderUserRow(u) {
  const isSelf = u.uid === _currentUser.uid;
  const joinedDate = u.createdAt?.toDate
    ? u.createdAt.toDate().toLocaleDateString()
    : '—';

  return `
    <tr ${isSelf ? 'class="admin-user-row-self"' : ''}>
      <td>
        ${escHtml(u.email)}
        ${isSelf ? '<span class="admin-you-badge">you</span>' : ''}
      </td>
      <td>${escHtml(u.displayName || '—')}</td>
      <td>
        <span class="admin-role-badge admin-role-${u.role || 'user'}">
          ${escHtml(u.role || 'user')}
        </span>
      </td>
      <td style="font-size:12px;color:#888">${joinedDate}</td>
      <td>
        ${isSelf
      ? `<span style="font-size:11px;color:#aaa">Cannot modify own role</span>`
      : `<button class="admin-btn-sm admin-btn-secondary"
                     onclick="window._toggleRole('${escAttr(u.uid)}','${escAttr(u.role || 'user')}','${escAttr(u.email)}')">
               ${u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
             </button>`
    }
      </td>
    </tr>`;
}

/* ── Load users (called from bootstrap) ─────────────────────────── */
async function loadUsers() {
  try {
    _users = await listUsers();
  } catch (err) {
    console.warn('[admin] loadUsers failed:', err.message);
  }
}

/* ══════════════════════════════════════════════════════════════════
   MODALS
   ══════════════════════════════════════════════════════════════════ */

function showModal(html) {
  const $c = document.getElementById('modal-container');
  $c.innerHTML = `
    <div class="admin-modal-backdrop" onclick="window._closeModal()">
      <div class="admin-modal" onclick="event.stopPropagation()">
        ${html}
      </div>
    </div>`;
  window._closeModal = closeModal;
  // Trap focus in modal
  setTimeout(() => {
    const firstInput = $c.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
  }, 50);
}

function closeModal() {
  const $c = document.getElementById('modal-container');
  if ($c) $c.innerHTML = '';
}

/* ── CATEGORY MODAL ──────────────────────────────────────────────── */

async function openCategoryModal(slug = null) {
  const cat = slug ? _categories.find(c => c.slug === slug) : null;
  const isEdit = !!cat;

  showModal(`
    <div class="admin-modal-header">
      <h3 class="admin-modal-title">${isEdit ? `Edit: ${escHtml(cat.title)}` : 'New Category'}</h3>
      <button class="admin-modal-close" onclick="window._closeModal()">✕</button>
    </div>
    <form id="cat-form" class="admin-form" onsubmit="window._submitCatForm(event)">
      <div class="admin-form-grid">
        <div class="admin-field">
          <label>Slug (URL key) *</label>
          <input type="text" name="slug" placeholder="e.g. cloud" required
                 pattern="[a-z0-9\\-]+" title="lowercase, hyphens only"
                 value="${escAttr(slug || '')}" ${isEdit ? 'readonly' : ''} />
          <span class="admin-field-hint">lowercase letters, numbers, hyphens only</span>
        </div>
        <div class="admin-field">
          <label>Title *</label>
          <input type="text" name="title" placeholder="DevOps & SRE" required
                 value="${escAttr(cat?.title || '')}" />
        </div>
        <div class="admin-field admin-field-full">
          <label>Description *</label>
          <textarea name="description" rows="2" required
                    placeholder="Short description shown on the index card.">${escHtml(cat?.description || '')}</textarea>
        </div>
        <div class="admin-field">
          <label>Accent color</label>
          <input type="color" name="accentColor" value="${escAttr(cat?.accentColor || '#2A4535')}" />
        </div>
        <div class="admin-field">
          <label>Display order</label>
          <input type="number" name="order" min="1" value="${cat?.order ?? 99}" />
        </div>
        <div class="admin-field admin-field-full">
          <label>Tags (comma-separated)</label>
          <input type="text" name="tags" placeholder="Foundation, Platform, Cloud"
                 value="${escAttr((cat?.tags || []).join(', '))}" />
        </div>
        <div class="admin-field admin-field-full">
          <label>Phase Labels (JSON) *</label>
          <textarea name="phaseLabels" rows="5" required
                    placeholder='{"overview":"Start here","foundation":"Phase 1: Foundation"}'>${escHtml(JSON.stringify(cat?.phaseLabels || {}, null, 2))}</textarea>
        </div>
        <div class="admin-field admin-field-full">
          <label>Phase Order (JSON array) *</label>
          <textarea name="phaseOrder" rows="3" required
                    placeholder='["overview","foundation","platform"]'>${escHtml(JSON.stringify(cat?.phaseOrder || [], null, 2))}</textarea>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn admin-btn-ghost" onclick="window._closeModal()">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary">
          ${isEdit ? 'Save changes' : 'Create category'}
        </button>
      </div>
    </form>`);

  window._submitCatForm = (e) => submitCategoryForm(e, isEdit, slug);
}

async function submitCategoryForm(e, isEdit, existingSlug) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  // Disable submit button to prevent double-submit
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving…'; }

  try {
    const phaseLabels = JSON.parse(data.phaseLabels);
    const phaseOrder = JSON.parse(data.phaseOrder);
    const tags = data.tags.split(',').map(s => s.trim()).filter(Boolean);

    const meta = {
      title: data.title.trim(),
      description: data.description.trim(),
      accentColor: data.accentColor,
      tags,
      order: parseInt(data.order) || 99,
      phaseLabels,
      phaseOrder
    };

    if (isEdit) {
      await updateCategory(existingSlug, meta);
      toast('Category updated!', 'success');
    } else {
      const slug = data.slug.trim().toLowerCase();
      if (!slug) throw new Error('Slug is required.');
      await createCategory(slug, meta);
      toast('Category created!', 'success');
    }

    closeModal();
    await loadCategories();

  } catch (err) {
    toast('Error: ' + err.message, 'error');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isEdit ? 'Save changes' : 'Create category'; }
  }
}

/* ── TOPIC MODAL ─────────────────────────────────────────────────── */

async function openTopicModal(topicId = null) {
  const topic = topicId ? _topics.find(t => t.id === topicId) : null;
  const isEdit = !!topic;

  const starterJson = JSON.stringify({
    id: 'your-topic-id',
    label: 'Short label',
    phase: 'foundation',
    title: 'Full topic heading',
    why: 'One sentence explaining why this topic matters.',
    badges: [{ t: 'Foundation', c: 'b-foundation' }],
    prereqs: ['Previous topic'],
    stages: [
      { items: ['Beginner item 1', 'Beginner item 2'] },
      { items: ['Intermediate item 1'] },
      { items: ['Advanced item 1'] }
    ],
    projects: ['Build something real'],
    usecases: ['Real-world scenario'],
    mistakes: ['Common mistake to avoid'],
    production: 'How this is used in production.',
    ready: ['Checkpoint 1', 'Checkpoint 2'],
    _order: 1
  }, null, 2);

  showModal(`
    <div class="admin-modal-header">
      <h3 class="admin-modal-title">${isEdit ? `Edit: ${escHtml(topic.id)}` : 'New Topic'}</h3>
      <button class="admin-modal-close" onclick="window._closeModal()">✕</button>
    </div>
    <form id="topic-form" class="admin-form" onsubmit="window._submitTopicForm(event)">
      <div class="admin-field admin-field-full">
        <label>Topic JSON *</label>
        <p class="admin-field-hint">
          Complete topic object as JSON. Required fields: <code>id</code>, <code>label</code>, <code>phase</code>.
        </p>
        <textarea name="topicJson" rows="22" required class="admin-code-textarea">${escHtml(topic ? JSON.stringify(topic, null, 2) : starterJson)}</textarea>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn admin-btn-ghost" onclick="window._closeModal()">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary">
          ${isEdit ? 'Save topic' : 'Create topic'}
        </button>
      </div>
    </form>`);

  window._submitTopicForm = (e) => submitTopicForm(e, isEdit);
}

async function submitTopicForm(e, isEdit) {
  e.preventDefault();
  const raw = e.target.topicJson.value;
  const submitBtn = e.target.querySelector('[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Saving…'; }

  try {
    const topicData = JSON.parse(raw);
    if (!topicData.id) throw new Error('Topic JSON must have an "id" field.');
    if (!topicData.label) throw new Error('Topic JSON must have a "label" field.');
    if (!topicData.phase) throw new Error('Topic JSON must have a "phase" field.');

    await setTopic(_activeSlug, topicData.id, topicData);
    toast(`Topic "${topicData.id}" ${isEdit ? 'updated' : 'created'}!`, 'success');
    closeModal();

    _topics = await listTopics(_activeSlug);
    const cat = _categories.find(c => c.slug === _activeSlug);
    renderTopicsView(document.getElementById('admin-main'), cat);

  } catch (err) {
    toast('Error: ' + err.message, 'error');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isEdit ? 'Save topic' : 'Create topic'; }
  }
}

/* ── DELETE CONFIRMATION ─────────────────────────────────────────── */

function confirmDelete(message, onConfirm) {
  showModal(`
    <div class="admin-modal-header">
      <h3 class="admin-modal-title" style="color:#E24B4A;">Confirm delete</h3>
    </div>
    <div class="admin-confirm-body">
      <p class="admin-confirm-message">${escHtml(message)}</p>
    </div>
    <div class="admin-modal-footer">
      <button class="admin-btn admin-btn-ghost" onclick="window._closeModal()">Cancel</button>
      <button class="admin-btn admin-btn-danger" onclick="window._doConfirm()">Delete permanently</button>
    </div>`);
  window._doConfirm = () => { closeModal(); onConfirm(); };
}

async function doDeleteTopic(topicId) {
  try {
    await deleteTopic(_activeSlug, topicId);
    toast('Topic deleted.', 'success');
    _topics = await listTopics(_activeSlug);
    const cat = _categories.find(c => c.slug === _activeSlug);
    renderTopicsView(document.getElementById('admin-main'), cat);
  } catch (e) {
    toast('Delete failed: ' + e.message, 'error');
  }
}

async function doDeleteCategory(slug) {
  try {
    await deleteCategory(slug);
    toast('Category deleted.', 'success');
    _activeSlug = null;
    await loadCategories();
    document.getElementById('admin-main').innerHTML = `
      <div class="admin-empty-state">
        <p class="admin-empty-text">Category deleted. Select another from the sidebar.</p>
      </div>`;
  } catch (e) {
    toast('Delete failed: ' + e.message, 'error');
  }
}

/* ══════════════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
   ══════════════════════════════════════════════════════════════════ */

function toast(message, type = 'info') {
  const $c = document.getElementById('toast-container');
  if (!$c) return;

  const div = document.createElement('div');
  div.className = `admin-toast admin-toast-${type}`;
  div.textContent = message;
  div.setAttribute('role', 'status');
  div.setAttribute('aria-live', 'polite');
  $c.appendChild(div);

  // Animate in
  setTimeout(() => div.classList.add('admin-toast-visible'), 10);

  // Animate out and remove
  setTimeout(() => {
    div.classList.remove('admin-toast-visible');
    setTimeout(() => div.remove(), 300);
  }, 3500);
}

/* ── Utilities ───────────────────────────────────────────────────── */
function escHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escAttr(str) { return escHtml(String(str ?? '')); }