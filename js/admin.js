import { requireAuth, isAdmin, signOut, refreshCurrentUser } from "./auth.js";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listTopics,
  setTopic,
  deleteTopic,
  listUsers,
  setUserRole,
} from "./db.js";

let _categories = [];
let _activeSlug = null;
let _topics = [];
let _users = [];
let _currentUser = null;

const $app = document.getElementById("admin-app");
(async function bootstrap() {
  try {
    _currentUser = await requireAuth("login.html");

    if (_currentUser.role !== "admin") {
      window.location.href = "index.html";
      return;
    }

    renderShell();
    await Promise.all([loadCategories(), loadUsers()]);
  } catch (err) {
    $app.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;font-family:system-ui;">
        <p style="font-size:18px;font-weight:600;color:#E24B4A;">Admin panel failed to load</p>
        <p style="font-size:13px;color:#666;">${escHtml(err.message)}</p>
        <a href="index.html" style="font-size:13px;color:#3C3489;">← Go back</a>
      </div>`;
  }
})();

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
        <div class="admin-empty-state">
          <p class="admin-empty-icon">📚</p>
          <p class="admin-empty-text">Select a category from the sidebar to manage its topics.</p>
        </div>
      </main>
    </div>

    <div id="modal-container"></div>
    <div id="toast-container" class="admin-toast-container"></div>
  `;

  window._adminSignOut = () => signOut();
  window._openCategoryModal = () => openCategoryModal();
  window._showView = (v) => showView(v);
}

async function loadCategories() {
  try {
    _categories = await listCategories();
    renderCategoryList();
  } catch (err) {
    toast("Failed to load categories: " + err.message, "error");
  }
}

function renderCategoryList() {
  const $list = document.getElementById("cat-list");
  if (!$list) return;

  if (!_categories.length) {
    $list.innerHTML = `<p class="admin-empty-sm">No categories yet.</p>`;
    return;
  }

  $list.innerHTML = _categories
    .map(
      (cat) => `
    <div class="admin-cat-item ${cat.slug === _activeSlug ? "active" : ""}"
         onclick="window._selectCategory('${escAttr(cat.slug)}')">
      <span class="admin-cat-dot" style="background:${escAttr(cat.accentColor || "#666")}"></span>
      <span class="admin-cat-name">${escHtml(cat.title)}</span>
    </div>
  `,
    )
    .join("");

  window._selectCategory = (slug) => selectCategory(slug);
}

async function selectCategory(slug) {
  _activeSlug = slug;
  renderCategoryList();
  await showView("topics");
}

async function showView(view) {
  const $main = document.getElementById("admin-main");
  if (!$main) return;

  if (view === "topics") {
    if (!_activeSlug) {
      $main.innerHTML = `<div class="admin-empty-state"><p class="admin-empty-text">Select a category first.</p></div>`;
      return;
    }
    $main.innerHTML = `<div class="admin-loading">Loading topics…</div>`;
    try {
      _topics = await listTopics(_activeSlug);
      const cat = _categories.find((c) => c.slug === _activeSlug);
      renderTopicsView($main, cat);
    } catch (err) {
      $main.innerHTML = `<div class="admin-error">Failed to load topics: ${escHtml(err.message)}</div>`;
    }
  } else if (view === "users") {
    $main.innerHTML = `<div class="admin-loading">Loading users…</div>`;
    try {
      _users = await listUsers();
      renderUsersView($main);
    } catch (err) {
      $main.innerHTML = `<div class="admin-error">Failed to load users: ${escHtml(err.message)}</div>`;
    }
  }
}

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
      ${
        _topics.length
          ? _topics.map((t) => renderTopicCard(t)).join("")
          : `<div class="admin-empty-state"><p class="admin-empty-text">No topics yet. Click "+ Add topic".</p></div>`
      }
    </div>`;

  window._openTopicModal = (id) => openTopicModal(id);
  window._confirmDeleteTopic = (id) =>
    confirmDelete(`Delete topic "${id}"? This cannot be undone.`, () =>
      doDeleteTopic(id),
    );
  window._confirmDeleteCategory = (slug) =>
    confirmDelete(
      `Delete category "${slug}" and ALL its topics? This cannot be undone.`,
      () => doDeleteCategory(slug),
    );
  window._openCategoryModal = (slug) => openCategoryModal(slug || null);
}

function renderTopicCard(t) {
  const preview = (t.why || "").substring(0, 100);
  return `
    <div class="admin-topic-card">
      <div class="admin-topic-card-header">
        <span class="admin-topic-id">${escHtml(t.id)}</span>
        <span class="admin-topic-phase">${escHtml(t.phase || "")}</span>
      </div>
      <p class="admin-topic-title">${escHtml(t.title || t.label || t.id)}</p>
      <p class="admin-topic-why">${escHtml(preview)}${preview.length >= 100 ? "…" : ""}</p>
      <div class="admin-topic-actions">
        <button class="admin-btn-sm admin-btn-secondary"
                onclick="window._openTopicModal('${escAttr(t.id)}')">Edit</button>
        <button class="admin-btn-sm admin-btn-danger"
                onclick="window._confirmDeleteTopic('${escAttr(t.id)}')">Delete</button>
      </div>
    </div>`;
}

function renderUsersView($main) {
  $main.innerHTML = `
    <div class="admin-view-header">
      <h2 class="admin-view-title">Users &amp; Roles</h2>
      <p class="admin-view-subtitle">${_users.length} registered user(s)</p>
    </div>
    <div class="admin-info-bar" style="background:#E6F1FB;border:1px solid #378ADD;border-left-width:3px;padding:10px 14px;font-size:12px;color:#0C447C;margin-bottom:16px;border-radius:4px;">
      <strong>Role updates take effect on the user's next sign-in.</strong>
      Firestore is updated immediately, but the user's cached session reflects the old role until they sign out and back in.
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
          ${_users.map((u) => renderUserRow(u)).join("")}
        </tbody>
      </table>
    </div>`;

  window._toggleRole = async (uid, currentRole, email) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    if (uid === _currentUser.uid && newRole === "user") {
      toast("You cannot demote your own admin account.", "error");
      return;
    }

    if (
      !confirm(
        `${newRole === "admin" ? "Promote" : "Demote"} ${email} to "${newRole}"?`,
      )
    )
      return;

    try {
      await setUserRole(uid, newRole);
      toast(`${email} is now "${newRole}"`, "success");
      await refreshCurrentUser();
      _users = await listUsers();
      renderUsersView($main);
    } catch (e) {
      toast("Error updating role: " + e.message, "error");
    }
  };
}

function renderUserRow(u) {
  const isSelf = u.uid === _currentUser.uid;
  const joinedDate = u.createdAt?.toDate
    ? u.createdAt.toDate().toLocaleDateString()
    : "—";

  return `
    <tr>
      <td>
        ${escHtml(u.email)}
        ${isSelf ? '<span style="font-size:10px;background:#EEEDFE;color:#3C3489;padding:1px 6px;border-radius:99px;margin-left:6px;">you</span>' : ""}
      </td>
      <td>${escHtml(u.displayName || "—")}</td>
      <td>
        <span class="admin-role-badge admin-role-${u.role || "user"}">
          ${escHtml(u.role || "user")}
        </span>
      </td>
      <td style="font-size:12px;color:#888">${joinedDate}</td>
      <td>
        ${
          isSelf
            ? `<span style="font-size:11px;color:#aaa">Cannot modify own role</span>`
            : `<button class="admin-btn-sm admin-btn-secondary"
                     onclick="window._toggleRole('${escAttr(u.uid)}','${escAttr(u.role || "user")}','${escAttr(u.email)}')">
               ${u.role === "admin" ? "Demote to user" : "Promote to admin"}
             </button>`
        }
      </td>
    </tr>`;
}

async function loadUsers() {
  try {
    _users = await listUsers();
  } catch (err) {
    console.warn("[admin] loadUsers failed:", err.message);
  }
}

function showModal(html) {
  const $c = document.getElementById("modal-container");
  $c.innerHTML = `
    <div class="admin-modal-backdrop" onclick="window._closeModal()">
      <div class="admin-modal" onclick="event.stopPropagation()">
        ${html}
      </div>
    </div>`;
  window._closeModal = closeModal;
}

function closeModal() {
  const $c = document.getElementById("modal-container");
  if ($c) $c.innerHTML = "";
}

async function openCategoryModal(slug = null) {
  const cat = slug ? _categories.find((c) => c.slug === slug) : null;
  const isEdit = !!cat;

  showModal(`
    <div class="admin-modal-header">
      <h3 class="admin-modal-title">${isEdit ? `Edit: ${escHtml(cat.title)}` : "New Category"}</h3>
      <button class="admin-modal-close" onclick="window._closeModal()">✕</button>
    </div>
    <form id="cat-form" class="admin-form" onsubmit="window._submitCatForm(event)">
      <div class="admin-form-grid">
        <div class="admin-field">
          <label>Slug (URL key) *</label>
          <input type="text" name="slug" placeholder="e.g. cloud" required
                 pattern="[a-z0-9\\-]+" value="${escAttr(slug || "")}" ${isEdit ? "readonly" : ""} />
        </div>
        <div class="admin-field">
          <label>Title *</label>
          <input type="text" name="title" placeholder="DevOps & SRE" required
                 value="${escAttr(cat?.title || "")}" />
        </div>
        <div class="admin-field admin-field-full">
          <label>Description *</label>
          <textarea name="description" rows="2" required>${escHtml(cat?.description || "")}</textarea>
        </div>
        <div class="admin-field">
          <label>Accent color</label>
          <input type="color" name="accentColor" value="${escAttr(cat?.accentColor || "#2A4535")}" />
        </div>
        <div class="admin-field">
          <label>Display order</label>
          <input type="number" name="order" min="1" value="${cat?.order ?? 99}" />
        </div>
        <div class="admin-field admin-field-full">
          <label>Tags (comma-separated)</label>
          <input type="text" name="tags" value="${escAttr((cat?.tags || []).join(", "))}" />
        </div>
        <div class="admin-field admin-field-full">
          <label>Phase Labels (JSON) *</label>
          <textarea name="phaseLabels" rows="5" required>${escHtml(JSON.stringify(cat?.phaseLabels || {}, null, 2))}</textarea>
        </div>
        <div class="admin-field admin-field-full">
          <label>Phase Order (JSON array) *</label>
          <textarea name="phaseOrder" rows="3" required>${escHtml(JSON.stringify(cat?.phaseOrder || [], null, 2))}</textarea>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn admin-btn-ghost" onclick="window._closeModal()">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary">
          ${isEdit ? "Save changes" : "Create category"}
        </button>
      </div>
    </form>`);

  window._submitCatForm = (e) => submitCategoryForm(e, isEdit, slug);
}

async function submitCategoryForm(e, isEdit, existingSlug) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const btn = e.target.querySelector('[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Saving…";
  }

  try {
    const phaseLabels = JSON.parse(data.phaseLabels);
    const phaseOrder = JSON.parse(data.phaseOrder);
    const tags = data.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const meta = {
      title: data.title.trim(),
      description: data.description.trim(),
      accentColor: data.accentColor,
      tags,
      order: parseInt(data.order) || 99,
      phaseLabels,
      phaseOrder,
    };

    if (isEdit) {
      await updateCategory(existingSlug, meta);
      toast("Category updated!", "success");
    } else {
      const slug = data.slug.trim().toLowerCase();
      if (!slug) throw new Error("Slug is required.");
      await createCategory(slug, meta);
      toast("Category created!", "success");
    }

    closeModal();
    await loadCategories();
  } catch (err) {
    toast("Error: " + err.message, "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = isEdit ? "Save changes" : "Create category";
    }
  }
}

async function openTopicModal(topicId = null) {
  const topic = topicId ? _topics.find((t) => t.id === topicId) : null;
  const isEdit = !!topic;

  const starterJson = JSON.stringify(
    {
      id: "your-topic-id",
      label: "Short label",
      phase: "foundation",
      title: "Full topic heading",
      why: "One sentence explaining why this topic matters.",
      badges: [{ t: "Foundation", c: "b-foundation" }],
      prereqs: ["Previous topic"],
      stages: [
        { items: ["Beginner item 1"] },
        { items: ["Intermediate item 1"] },
        { items: ["Advanced item 1"] },
      ],
      projects: ["Build something real"],
      usecases: ["Real-world scenario"],
      mistakes: ["Common mistake to avoid"],
      production: "How this is used in production.",
      ready: ["Checkpoint 1", "Checkpoint 2"],
      _order: 1,
    },
    null,
    2,
  );

  showModal(`
    <div class="admin-modal-header">
      <h3 class="admin-modal-title">${isEdit ? `Edit: ${escHtml(topic.id)}` : "New Topic"}</h3>
      <button class="admin-modal-close" onclick="window._closeModal()">✕</button>
    </div>
    <form id="topic-form" class="admin-form" onsubmit="window._submitTopicForm(event)">
      <div class="admin-field admin-field-full">
        <label>Topic JSON *</label>
        <p class="admin-field-hint">Required: <code>id</code>, <code>label</code>, <code>phase</code></p>
        <textarea name="topicJson" rows="22" required class="admin-code-textarea">${escHtml(topic ? JSON.stringify(topic, null, 2) : starterJson)}</textarea>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="admin-btn admin-btn-ghost" onclick="window._closeModal()">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary">
          ${isEdit ? "Save topic" : "Create topic"}
        </button>
      </div>
    </form>`);

  window._submitTopicForm = (e) => submitTopicForm(e, isEdit);
}

async function submitTopicForm(e, isEdit) {
  e.preventDefault();
  const raw = e.target.topicJson.value;
  const btn = e.target.querySelector('[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Saving…";
  }

  try {
    const topicData = JSON.parse(raw);
    if (!topicData.id) throw new Error('Topic must have an "id" field.');
    if (!topicData.label) throw new Error('Topic must have a "label" field.');
    if (!topicData.phase) throw new Error('Topic must have a "phase" field.');

    await setTopic(_activeSlug, topicData.id, topicData);
    toast(
      `Topic "${topicData.id}" ${isEdit ? "updated" : "created"}!`,
      "success",
    );
    closeModal();

    _topics = await listTopics(_activeSlug);
    const cat = _categories.find((c) => c.slug === _activeSlug);
    renderTopicsView(document.getElementById("admin-main"), cat);
  } catch (err) {
    toast("Error: " + err.message, "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = isEdit ? "Save topic" : "Create topic";
    }
  }
}

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
  window._doConfirm = () => {
    closeModal();
    onConfirm();
  };
}

async function doDeleteTopic(topicId) {
  try {
    await deleteTopic(_activeSlug, topicId);
    toast("Topic deleted.", "success");
    _topics = await listTopics(_activeSlug);
    renderTopicsView(
      document.getElementById("admin-main"),
      _categories.find((c) => c.slug === _activeSlug),
    );
  } catch (e) {
    toast("Delete failed: " + e.message, "error");
  }
}

async function doDeleteCategory(slug) {
  try {
    await deleteCategory(slug);
    toast("Category deleted.", "success");
    _activeSlug = null;
    await loadCategories();
    document.getElementById("admin-main").innerHTML = `
      <div class="admin-empty-state">
        <p class="admin-empty-text">Category deleted. Select another from the sidebar.</p>
      </div>`;
  } catch (e) {
    toast("Delete failed: " + e.message, "error");
  }
}

function toast(message, type = "info") {
  const $c = document.getElementById("toast-container");
  if (!$c) return;
  const div = document.createElement("div");
  div.className = `admin-toast admin-toast-${type}`;
  div.textContent = message;
  $c.appendChild(div);
  setTimeout(() => div.classList.add("admin-toast-visible"), 10);
  setTimeout(() => {
    div.classList.remove("admin-toast-visible");
    setTimeout(() => div.remove(), 300);
  }, 3500);
}

function escHtml(str) {
  if (typeof str !== "string") return String(str ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escAttr(str) {
  return escHtml(String(str ?? ""));
}
