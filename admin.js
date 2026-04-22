/* ================================================================
   admin.js  v2  —  Fixed Admin Panel + Profile Photo Upload
   ================================================================ */

const ADMIN_USER = 'nur';
const ADMIN_PASS = '##nur**';       // ← Change this before deploying!
const SESSION_KEY = 'nh_admin_ok';
const PHOTO_KEY   = 'nh_profile_photo';

let editingId   = null;
let pendingPhotoData = null;   // base64 of chosen but not-yet-applied photo

/* ================================================================
   OPEN / CLOSE
   ================================================================ */
function openAdmin() {
  const overlay = document.getElementById('admin-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    showDashboard();
  } else {
    showLogin();
  }
}

function closeAdmin() {
  const overlay = document.getElementById('admin-overlay');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  if (window.location.hash === '#admin') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

function showLogin() {
  document.getElementById('admin-login-screen').style.display = 'flex';
  document.getElementById('admin-dash-screen').style.display  = 'none';
  document.getElementById('admin-error-msg').style.display    = 'none';
  document.getElementById('admin-username').value = '';
  document.getElementById('admin-password').value = '';
  setTimeout(() => document.getElementById('admin-username').focus(), 100);
}

function showDashboard() {
  document.getElementById('admin-login-screen').style.display = 'none';
  document.getElementById('admin-dash-screen').style.display  = 'flex';
  sessionStorage.setItem(SESSION_KEY, '1');
  refreshAllAdminLists();
  loadPhotoIntoAdmin();
}

/* ================================================================
   TRIGGERS  (3 ways to access admin)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // 1. URL hash
  if (window.location.hash === '#admin') openAdmin();

  // 2. Keyboard: Ctrl+Shift+A
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openAdmin();
    }
  });

  // 3. Triple-click logo
  let clickCount = 0, clickTimer;
  const logo = document.getElementById('nav-logo-trigger');
  if (logo) {
    logo.addEventListener('click', e => {
      e.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      if (clickCount >= 3) { clickCount = 0; openAdmin(); }
    });
  }

  // Close on backdrop click
  document.getElementById('admin-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('admin-overlay')) closeAdmin();
  });

  /* ---- LOGIN EVENTS ---- */
  document.getElementById('admin-login-btn').addEventListener('click', doLogin);
  document.getElementById('admin-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('admin-cancel-btn').addEventListener('click', closeAdmin);

  // Password show/hide
  document.getElementById('pw-toggle').addEventListener('click', () => {
    const pw = document.getElementById('admin-password');
    const icon = document.querySelector('#pw-toggle i');
    if (pw.type === 'password') {
      pw.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      pw.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  /* ---- DASHBOARD EVENTS ---- */
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });
  document.getElementById('admin-close-btn').addEventListener('click', closeAdmin);

  // Sidebar navigation
  document.querySelectorAll('.aside-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.aside-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ap-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        target.classList.add('active');
        // scroll content area to top when switching tabs
        const scroll = document.querySelector('.admin-content-scroll');
        if (scroll) scroll.scrollTop = 0;
      }
    });
  });

  /* ---- PHOTO EVENTS ---- */
  setupPhotoUpload();

  /* ---- PROJECTS ---- */
  document.getElementById('add-project-btn').addEventListener('click', () => {
    editingId = null;
    resetForm(['pf-title','pf-desc','pf-tech','pf-icon','pf-live','pf-github']);
    document.getElementById('pf-category').value = 'web';
    document.getElementById('project-form-title').textContent = 'Add New Project';
    showForm('project-form-wrap');
  });
  document.getElementById('cancel-project-btn').addEventListener('click', () => hideForm('project-form-wrap'));
  document.getElementById('save-project-btn').addEventListener('click', saveProject);

  /* ---- SKILLS ---- */
  document.getElementById('add-skill-btn').addEventListener('click', () => {
    editingId = null;
    resetForm(['sf-name','sf-icon','sf-level']);
    document.getElementById('sf-category').value = 'web';
    document.getElementById('skill-form-title').textContent = 'Add New Skill';
    showForm('skill-form-wrap');
  });
  document.getElementById('cancel-skill-btn').addEventListener('click', () => hideForm('skill-form-wrap'));
  document.getElementById('save-skill-btn').addEventListener('click', saveSkill);

  /* ---- SERVICES ---- */
  document.getElementById('add-service-btn').addEventListener('click', () => {
    editingId = null;
    resetForm(['svf-title','svf-icon','svf-desc','svf-features']);
    document.getElementById('service-form-title').textContent = 'Add New Service';
    showForm('service-form-wrap');
  });
  document.getElementById('cancel-service-btn').addEventListener('click', () => hideForm('service-form-wrap'));
  document.getElementById('save-service-btn').addEventListener('click', saveService);

  /* ---- TIMELINE ---- */
  document.getElementById('add-timeline-btn').addEventListener('click', () => {
    editingId = null;
    resetForm(['tf-title','tf-org','tf-period','tf-desc']);
    document.getElementById('tf-type').value = 'experience';
    document.getElementById('timeline-form-title').textContent = 'Add New Entry';
    showForm('timeline-form-wrap');
  });
  document.getElementById('cancel-timeline-btn').addEventListener('click', () => hideForm('timeline-form-wrap'));
  document.getElementById('save-timeline-btn').addEventListener('click', saveTimeline);

  /* ---- SITE INFO ---- */
  document.getElementById('save-info-btn').addEventListener('click', saveInfo);
});

/* ================================================================
   AUTH
   ================================================================ */
function doLogin() {
  const u = document.getElementById('admin-username').value.trim();
  const p = document.getElementById('admin-password').value.trim();
  const err = document.getElementById('admin-error-msg');
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    err.style.display = 'none';
    showDashboard();
  } else {
    err.style.display = 'flex';
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-password').focus();
  }
}

/* ================================================================
   HELPERS
   ================================================================ */
function showForm(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
function hideForm(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
  editingId = null;
}
function resetForm(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
function refreshAllAdminLists() {
  renderAdminProjects();
  renderAdminSkills();
  renderAdminServices();
  renderAdminTimeline();
  populateInfoForm();
}

/* ================================================================
   PROFILE PHOTO
   ================================================================ */
function setupPhotoUpload() {
  const fileInput  = document.getElementById('photo-input');
  const applyBtn   = document.getElementById('photo-apply-btn');
  const removeBtn  = document.getElementById('photo-remove-btn');
  const previewImg = document.getElementById('admin-photo-img');
  const emptyState = document.getElementById('photo-empty-state');
  const filename   = document.getElementById('photo-filename');
  const msgEl      = document.getElementById('photo-msg');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showPhotoMsg('error', 'File too large. Please choose an image under 3MB.');
      fileInput.value = '';
      return;
    }
    filename.textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => {
      pendingPhotoData = e.target.result;
      previewImg.src = pendingPhotoData;
      previewImg.style.display = 'block';
      emptyState.style.display = 'none';
      showPhotoMsg('', '');
      msgEl.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  applyBtn.addEventListener('click', () => {
    if (!pendingPhotoData) {
      showPhotoMsg('error', 'Please choose a photo file first.');
      return;
    }
    try {
      localStorage.setItem(PHOTO_KEY, pendingPhotoData);
      applyPhotoToPortfolio(pendingPhotoData);
      showPhotoMsg('success', 'Photo applied to portfolio successfully!');
    } catch(e) {
      showPhotoMsg('error', 'Could not save — image may be too large. Try a smaller file.');
    }
  });

  removeBtn.addEventListener('click', () => {
    localStorage.removeItem(PHOTO_KEY);
    pendingPhotoData = null;
    previewImg.src = '';
    previewImg.style.display = 'none';
    emptyState.style.display = 'flex';
    filename.textContent = 'No file chosen';
    fileInput.value = '';
    applyPhotoToPortfolio(null);
    showPhotoMsg('success', 'Photo removed.');
  });
}

function showPhotoMsg(type, text) {
  const el = document.getElementById('photo-msg');
  if (!text) { el.style.display = 'none'; return; }
  el.className = 'inline-msg ' + type;
  el.innerHTML = (type === 'success' ? '<i class="fa-solid fa-circle-check"></i> ' : '<i class="fa-solid fa-triangle-exclamation"></i> ') + text;
  el.style.display = 'flex';
}

function loadPhotoIntoAdmin() {
  const saved = localStorage.getItem(PHOTO_KEY);
  const previewImg  = document.getElementById('admin-photo-img');
  const emptyState  = document.getElementById('photo-empty-state');
  if (saved) {
    previewImg.src = saved;
    previewImg.style.display = 'block';
    emptyState.style.display = 'none';
    pendingPhotoData = saved;
    document.getElementById('photo-filename').textContent = 'Previously saved photo';
  } else {
    previewImg.style.display = 'none';
    emptyState.style.display = 'flex';
  }
}

function applyPhotoToPortfolio(dataUrl) {
  const placeholder = document.getElementById('about-img-placeholder');
  const img = document.getElementById('about-profile-img');
  if (dataUrl) {
    img.src = dataUrl;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    img.src = '';
    if (placeholder) placeholder.style.display = 'flex';
  }
}

/* Called by main.js on page load to restore saved photo */
window.restoreProfilePhoto = function() {
  const saved = localStorage.getItem(PHOTO_KEY);
  if (saved) {
    applyPhotoToPortfolio(saved);
  } else {
    // Try to auto-load nurhossain.png if it exists
    fetch('nurhossain.png')
      .then(res => res.ok ? res.blob() : Promise.reject())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = e => {
          localStorage.setItem(PHOTO_KEY, e.target.result);
          applyPhotoToPortfolio(e.target.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // Image not found, use placeholder
      });
  }
};

/* ================================================================
   PROJECTS CRUD
   ================================================================ */
function renderAdminProjects() {
  const list = document.getElementById('admin-projects-list');
  const data = window.portfolioData.projects;
  if (!data.length) {
    list.innerHTML = '<div class="adm-empty"><i class="fa-solid fa-folder-open"></i>No projects yet. Click "Add Project" to create one.</div>';
    return;
  }
  list.innerHTML = data.map(p => `
    <div class="adm-item">
      <div class="adm-item-info">
        <div class="adm-item-title"><i class="fa-solid ${p.icon || 'fa-code'}" style="color:var(--accent);margin-right:0.4rem;"></i>${esc(p.title)}</div>
        <div class="adm-item-sub">${esc(p.category)} · ${esc((p.tech||[]).join(', '))}</div>
      </div>
      <div class="adm-item-btns">
        <button class="adm-icon-btn edit" onclick="editProject(${p.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="adm-icon-btn del" onclick="deleteProject(${p.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

window.editProject = function(id) {
  const p = window.portfolioData.projects.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('project-form-title').textContent = 'Edit Project';
  document.getElementById('pf-title').value    = p.title || '';
  document.getElementById('pf-category').value = p.category || 'web';
  document.getElementById('pf-desc').value     = p.description || '';
  document.getElementById('pf-tech').value     = (p.tech||[]).join(', ');
  document.getElementById('pf-icon').value     = p.icon || '';
  document.getElementById('pf-live').value     = p.liveUrl || '';
  document.getElementById('pf-github').value   = p.githubUrl || '';
  showForm('project-form-wrap');
};

window.deleteProject = function(id) {
  if (!confirm('Delete this project?')) return;
  window.portfolioData.projects = window.portfolioData.projects.filter(p => p.id !== id);
  saveData(window.portfolioData);
  renderAdminProjects();
  if (window.renderProjects) window.renderProjects();
};

function saveProject() {
  const title = document.getElementById('pf-title').value.trim();
  if (!title) { alert('Project title is required.'); return; }
  const proj = {
    id: editingId || generateId(window.portfolioData.projects),
    title,
    category:    document.getElementById('pf-category').value,
    description: document.getElementById('pf-desc').value.trim(),
    tech:        document.getElementById('pf-tech').value.split(',').map(t=>t.trim()).filter(Boolean),
    icon:        document.getElementById('pf-icon').value.trim() || 'fa-code',
    liveUrl:     document.getElementById('pf-live').value.trim() || '#',
    githubUrl:   document.getElementById('pf-github').value.trim() || '#',
  };
  if (editingId) {
    const idx = window.portfolioData.projects.findIndex(p => p.id === editingId);
    window.portfolioData.projects[idx] = proj;
  } else {
    window.portfolioData.projects.push(proj);
  }
  saveData(window.portfolioData);
  renderAdminProjects();
  if (window.renderProjects) window.renderProjects();
  hideForm('project-form-wrap');
}

/* ================================================================
   SKILLS CRUD
   ================================================================ */
function renderAdminSkills() {
  const list = document.getElementById('admin-skills-list');
  const data = window.portfolioData.skills;
  if (!data.length) {
    list.innerHTML = '<div class="adm-empty"><i class="fa-solid fa-code"></i>No skills yet.</div>';
    return;
  }
  list.innerHTML = data.map(s => `
    <div class="adm-item">
      <div class="adm-item-info">
        <div class="adm-item-title"><i class="${esc(s.icon)}" style="color:var(--accent);margin-right:0.4rem;"></i>${esc(s.name)}</div>
        <div class="adm-item-sub">${esc(s.category)} · ${s.level}%</div>
      </div>
      <div class="adm-item-btns">
        <button class="adm-icon-btn edit" onclick="editSkill(${s.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="adm-icon-btn del"  onclick="deleteSkill(${s.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

window.editSkill = function(id) {
  const s = window.portfolioData.skills.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('skill-form-title').textContent = 'Edit Skill';
  document.getElementById('sf-name').value     = s.name;
  document.getElementById('sf-category').value = s.category;
  document.getElementById('sf-level').value    = s.level;
  document.getElementById('sf-icon').value     = s.icon;
  showForm('skill-form-wrap');
};

window.deleteSkill = function(id) {
  if (!confirm('Delete this skill?')) return;
  window.portfolioData.skills = window.portfolioData.skills.filter(s => s.id !== id);
  saveData(window.portfolioData);
  renderAdminSkills();
  if (window.renderSkills) window.renderSkills(document.querySelector('.skills-tab.active')?.dataset.tab||'web');
};

function saveSkill() {
  const name = document.getElementById('sf-name').value.trim();
  if (!name) { alert('Skill name is required.'); return; }
  const skill = {
    id:       editingId || generateId(window.portfolioData.skills),
    name,
    category: document.getElementById('sf-category').value,
    level:    Math.min(100, Math.max(1, parseInt(document.getElementById('sf-level').value)||80)),
    icon:     document.getElementById('sf-icon').value.trim() || 'fa-solid fa-code',
  };
  if (editingId) {
    const idx = window.portfolioData.skills.findIndex(s => s.id === editingId);
    window.portfolioData.skills[idx] = skill;
  } else {
    window.portfolioData.skills.push(skill);
  }
  saveData(window.portfolioData);
  renderAdminSkills();
  if (window.renderSkills) window.renderSkills(document.querySelector('.skills-tab.active')?.dataset.tab||'web');
  hideForm('skill-form-wrap');
}

/* ================================================================
   SERVICES CRUD
   ================================================================ */
function renderAdminServices() {
  const list = document.getElementById('admin-services-list');
  const data = window.portfolioData.services;
  if (!data.length) {
    list.innerHTML = '<div class="adm-empty"><i class="fa-solid fa-concierge-bell"></i>No services yet.</div>';
    return;
  }
  list.innerHTML = data.map(s => `
    <div class="adm-item">
      <div class="adm-item-info">
        <div class="adm-item-title"><i class="fa-solid ${esc(s.icon)}" style="color:var(--accent);margin-right:0.4rem;"></i>${esc(s.title)}</div>
        <div class="adm-item-sub">${esc((s.features||[]).slice(0,3).join(', '))}</div>
      </div>
      <div class="adm-item-btns">
        <button class="adm-icon-btn edit" onclick="editService(${s.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="adm-icon-btn del"  onclick="deleteService(${s.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

window.editService = function(id) {
  const s = window.portfolioData.services.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('service-form-title').textContent = 'Edit Service';
  document.getElementById('svf-title').value    = s.title;
  document.getElementById('svf-icon').value     = s.icon;
  document.getElementById('svf-desc').value     = s.description;
  document.getElementById('svf-features').value = (s.features||[]).join(', ');
  showForm('service-form-wrap');
};

window.deleteService = function(id) {
  if (!confirm('Delete this service?')) return;
  window.portfolioData.services = window.portfolioData.services.filter(s => s.id !== id);
  saveData(window.portfolioData);
  renderAdminServices();
  if (window.renderServices) window.renderServices();
};

function saveService() {
  const title = document.getElementById('svf-title').value.trim();
  if (!title) { alert('Service title is required.'); return; }
  const service = {
    id:          editingId || generateId(window.portfolioData.services),
    title,
    icon:        document.getElementById('svf-icon').value.trim() || 'fa-star',
    description: document.getElementById('svf-desc').value.trim(),
    features:    document.getElementById('svf-features').value.split(',').map(f=>f.trim()).filter(Boolean),
  };
  if (editingId) {
    const idx = window.portfolioData.services.findIndex(s => s.id === editingId);
    window.portfolioData.services[idx] = service;
  } else {
    window.portfolioData.services.push(service);
  }
  saveData(window.portfolioData);
  renderAdminServices();
  if (window.renderServices) window.renderServices();
  hideForm('service-form-wrap');
}

/* ================================================================
   TIMELINE CRUD
   ================================================================ */
function renderAdminTimeline() {
  const list = document.getElementById('admin-timeline-list');
  const data = window.portfolioData.timeline;
  if (!data.length) {
    list.innerHTML = '<div class="adm-empty"><i class="fa-solid fa-timeline"></i>No entries yet.</div>';
    return;
  }
  list.innerHTML = data.map(t => `
    <div class="adm-item">
      <div class="adm-item-info">
        <div class="adm-item-title">
          <i class="fa-solid ${t.type==='education' ? 'fa-graduation-cap' : 'fa-briefcase'}" style="color:var(--accent);margin-right:0.4rem;"></i>
          ${esc(t.title)}
        </div>
        <div class="adm-item-sub">${esc(t.organization)} · ${esc(t.period)} · <em>${t.type}</em></div>
      </div>
      <div class="adm-item-btns">
        <button class="adm-icon-btn edit" onclick="editTimeline(${t.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="adm-icon-btn del"  onclick="deleteTimeline(${t.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

window.editTimeline = function(id) {
  const t = window.portfolioData.timeline.find(x => x.id === id);
  if (!t) return;
  editingId = id;
  document.getElementById('timeline-form-title').textContent = 'Edit Entry';
  document.getElementById('tf-title').value  = t.title;
  document.getElementById('tf-type').value   = t.type;
  document.getElementById('tf-org').value    = t.organization;
  document.getElementById('tf-period').value = t.period;
  document.getElementById('tf-desc').value   = t.description;
  showForm('timeline-form-wrap');
};

window.deleteTimeline = function(id) {
  if (!confirm('Delete this entry?')) return;
  window.portfolioData.timeline = window.portfolioData.timeline.filter(t => t.id !== id);
  saveData(window.portfolioData);
  renderAdminTimeline();
  if (window.renderTimeline) window.renderTimeline(document.querySelector('.exp-tab.active')?.dataset.tab||'experience');
};

function saveTimeline() {
  const title = document.getElementById('tf-title').value.trim();
  if (!title) { alert('Title is required.'); return; }
  const entry = {
    id:           editingId || generateId(window.portfolioData.timeline),
    title,
    type:         document.getElementById('tf-type').value,
    organization: document.getElementById('tf-org').value.trim(),
    period:       document.getElementById('tf-period').value.trim(),
    description:  document.getElementById('tf-desc').value.trim(),
  };
  if (editingId) {
    const idx = window.portfolioData.timeline.findIndex(t => t.id === editingId);
    window.portfolioData.timeline[idx] = entry;
  } else {
    window.portfolioData.timeline.push(entry);
  }
  saveData(window.portfolioData);
  renderAdminTimeline();
  if (window.renderTimeline) window.renderTimeline(document.querySelector('.exp-tab.active')?.dataset.tab||'experience');
  hideForm('timeline-form-wrap');
}

/* ================================================================
   SITE INFO
   ================================================================ */
function populateInfoForm() {
  const info = window.portfolioData.info;
  document.getElementById('inf-name').value       = info.heroName || '';
  document.getElementById('inf-proj-count').value = info.heroProjectsCount || '';
  document.getElementById('inf-tagline').value    = info.heroTagline || '';
  document.getElementById('inf-about-sub').value  = info.aboutSubtitle || '';
  document.getElementById('inf-bio').value        = info.aboutBio || '';
  document.getElementById('inf-email').value      = info.email || '';
  document.getElementById('inf-phone').value      = info.phone || '';
  document.getElementById('inf-location').value   = info.location || '';
}

function saveInfo() {
  window.portfolioData.info = {
    heroName:         document.getElementById('inf-name').value.trim(),
    heroProjectsCount:document.getElementById('inf-proj-count').value.trim(),
    heroTagline:      document.getElementById('inf-tagline').value.trim(),
    aboutSubtitle:    document.getElementById('inf-about-sub').value.trim(),
    aboutBio:         document.getElementById('inf-bio').value.trim(),
    email:            document.getElementById('inf-email').value.trim(),
    phone:            document.getElementById('inf-phone').value.trim(),
    location:         document.getElementById('inf-location').value.trim(),
  };
  saveData(window.portfolioData);
  if (window.applyInfo) window.applyInfo();
  const msg = document.getElementById('info-saved-msg');
  msg.style.display = 'flex';
  setTimeout(() => msg.style.display = 'none', 3000);
}

/* ================================================================
   UTILITIES
   ================================================================ */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
