// ══════════════════════════════════════════════════════════════
// ARENA FEATURES MODULE — Release 2
// Self-contained: Advisor Personalisation, Client Profiles,
// What's New alerts, Pinned Plans, Plan of the Day, WhatsApp Copy
// All data stored in localStorage on the advisor's own device.
// No servers, no accounts, no external calls (except updates.json from same origin).
// ══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
// STORAGE HELPERS (safe wrappers — never throw)
// ─────────────────────────────────────────────
const ArenaStore = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch(e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch(e) { return false; }
  }
};

// ─────────────────────────────────────────────
// 1. ADVISOR PERSONALISATION
// ─────────────────────────────────────────────
function getAdvisorProfile() {
  return ArenaStore.get('ia_advisor', { name: '', designation: '', phone: '', email: '' });
}

function saveAdvisorProfile() {
  const profile = {
    name: (document.getElementById('advName')?.value || '').trim(),
    designation: (document.getElementById('advDesig')?.value || '').trim(),
    phone: (document.getElementById('advPhone')?.value || '').trim(),
    email: (document.getElementById('advEmail')?.value || '').trim()
  };
  ArenaStore.set('ia_advisor', profile);
  const msg = document.getElementById('advSaveMsg');
  if (msg) { msg.textContent = '✅ Saved — your details will now appear in all generated messages.'; setTimeout(()=>{ msg.textContent=''; }, 3000); }
}

// Builds the signature block used in WhatsApp/Email messages.
// Falls back to the old placeholder if nothing is saved.
function advisorSignature(kind) {
  const a = getAdvisorProfile();
  if (!a.name) return '[Advisor Name]';
  let sig = a.name;
  if (a.designation) sig += (kind === 'wa' ? '\n' : '\n') + a.designation;
  if (a.phone) sig += '\n📞 ' + a.phone;
  if (a.email && kind !== 'wa') sig += '\n✉️ ' + a.email;
  return sig;
}

// ─────────────────────────────────────────────
// 2. CLIENT PROFILES (max 10, device-local only)
// ─────────────────────────────────────────────
const MAX_CLIENT_PROFILES = 10;

function getClientProfiles() { return ArenaStore.get('ia_clients', []); }

function saveCurrentClientProfile() {
  const name = (document.getElementById('tkName')?.value || '').trim();
  const age  = (document.getElementById('tkAge')?.value || '').trim();
  const occ  = (document.getElementById('tkOccupation')?.value || '').trim();
  const goal = document.getElementById('tkGoal')?.value || '';
  const risk = document.getElementById('tkRisk')?.value || '';
  if (!name) { alert('Enter a client name first, then save.'); return; }

  let profiles = getClientProfiles();
  const existingIdx = profiles.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
  const entry = { name, age, occ, goal, risk, savedAt: Date.now() };
  if (existingIdx >= 0) { profiles[existingIdx] = entry; }
  else {
    if (profiles.length >= MAX_CLIENT_PROFILES) {
      alert('Maximum ' + MAX_CLIENT_PROFILES + ' profiles. Delete one to add a new client.');
      return;
    }
    profiles.push(entry);
  }
  ArenaStore.set('ia_clients', profiles);
  renderClientProfileChips();
}

function loadClientProfile(idx) {
  const p = getClientProfiles()[idx]; if (!p) return;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  set('tkName', p.name); set('tkAge', p.age); set('tkOccupation', p.occ);
  // Re-activate the right chips
  ['tkGoalChips','tkRiskChips'].forEach((chipsId) => {
    const wanted = chipsId === 'tkGoalChips' ? p.goal : p.risk;
    const hiddenId = chipsId === 'tkGoalChips' ? 'tkGoal' : 'tkRisk';
    const wrap = document.getElementById(chipsId);
    if (!wrap || !wanted) return;
    wrap.querySelectorAll('.tk-chip').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === wanted);
    });
    const hidden = document.getElementById(hiddenId);
    if (hidden) hidden.value = wanted;
  });
}

function deleteClientProfile(idx) {
  const profiles = getClientProfiles();
  if (!profiles[idx]) return;
  if (!confirm('Delete profile "' + profiles[idx].name + '"?')) return;
  profiles.splice(idx, 1);
  ArenaStore.set('ia_clients', profiles);
  renderClientProfileChips();
}

function renderClientProfileChips() {
  const wrap = document.getElementById('clientProfileChips'); if (!wrap) return;
  const profiles = getClientProfiles();
  if (!profiles.length) { wrap.innerHTML = '<span class="cp-empty">No saved clients yet — fill the form and tap "Save Client".</span>'; return; }
  wrap.innerHTML = profiles.map((p, i) =>
    `<span class="cp-chip" onclick="loadClientProfile(${i})" title="${p.goal || ''} | ${p.risk || ''}">👤 ${p.name}<button class="cp-del" onclick="event.stopPropagation();deleteClientProfile(${i})" title="Delete">×</button></span>`
  ).join('');
}

// ─────────────────────────────────────────────
// 3. WHAT'S NEW / PRODUCT UPDATE ALERTS (in-app)
//    Reads data/updates.json (same origin, updated via GitHub)
// ─────────────────────────────────────────────
let ARENA_UPDATES = [];

function initWhatsNew() {
  fetch('data/updates.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data || !Array.isArray(data.updates)) return;
      ARENA_UPDATES = data.updates;
      const lastSeen = ArenaStore.get('ia_updates_seen', 0);
      const unread = ARENA_UPDATES.filter(u => u.ts > lastSeen).length;
      const badge = document.getElementById('whatsNewBadge');
      if (badge && unread > 0) { badge.textContent = unread; badge.classList.remove('hidden'); }
    })
    .catch(() => { /* silent — feature is non-critical */ });
}

function openWhatsNew() {
  const modal = document.getElementById('whatsNewModal'); if (!modal) return;
  const list = document.getElementById('whatsNewList');
  if (list) {
    list.innerHTML = ARENA_UPDATES.length
      ? ARENA_UPDATES.slice(0, 20).map(u =>
          `<div class="wn-item">
             <div class="wn-date">${new Date(u.ts).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
             <div class="wn-title">${u.title || ''}</div>
             <div class="wn-body">${u.body || ''}</div>
           </div>`).join('')
      : '<div class="wn-item">No updates yet. Check back soon!</div>';
  }
  modal.classList.remove('hidden');
  ArenaStore.set('ia_updates_seen', Date.now());
  const badge = document.getElementById('whatsNewBadge');
  if (badge) badge.classList.add('hidden');
}

function closeWhatsNew() {
  const modal = document.getElementById('whatsNewModal');
  if (modal) modal.classList.add('hidden');
}

// ─────────────────────────────────────────────
// 4. PINNED PLANS (quick access bar)
// ─────────────────────────────────────────────
function getPinnedPlans() { return ArenaStore.get('ia_pins', []); }

function togglePin(regId) {
  let pins = getPinnedPlans();
  if (pins.includes(regId)) { pins = pins.filter(p => p !== regId); }
  else {
    if (pins.length >= 6) { alert('Maximum 6 pinned plans. Unpin one first.'); return; }
    pins.push(regId);
  }
  ArenaStore.set('ia_pins', pins);
  renderPinBar();
}

function renderPinBar() {
  const bar = document.getElementById('pinBar'); if (!bar) return;
  if (typeof PRODUCT_REGISTRY === 'undefined' || !PRODUCT_REGISTRY) { bar.classList.add('hidden'); return; }
  const pins = getPinnedPlans();
  const entries = pins.map(id => PRODUCT_REGISTRY.find(p => p.regId === id)).filter(Boolean);
  if (!entries.length) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  bar.innerHTML = '<span class="pin-label">📌 Pinned:</span>' + entries.map(p =>
    `<span class="pin-chip" title="${p.plan}">${p.company} · ${p.plan.length > 22 ? p.plan.slice(0,22)+'…' : p.plan}<button class="pin-del" onclick="togglePin('${p.regId}')" title="Unpin">×</button></span>`
  ).join('');
}

// ─────────────────────────────────────────────
// 5. PLAN OF THE DAY (deterministic daily rotation, no backend)
// ─────────────────────────────────────────────
function renderPlanOfTheDay() {
  const box = document.getElementById('podCard'); if (!box) return;
  if (typeof PRODUCT_REGISTRY === 'undefined' || !PRODUCT_REGISTRY || !PRODUCT_REGISTRY.length) return;
  // Deterministic index from date — same plan for all users on the same day
  const today = new Date();
  const seed = today.getFullYear() * 372 + (today.getMonth()+1) * 31 + today.getDate();
  const p = PRODUCT_REGISTRY[seed % PRODUCT_REGISTRY.length];
  if (!p) return;
  const feat = (p.keyFeatures && p.keyFeatures[0]) || p.uniqueFeature || '';
  box.innerHTML = `
    <div class="pod-tag">🎯 Plan Spotlight — Today</div>
    <div class="pod-co">${p.company}</div>
    <div class="pod-plan">${p.plan}</div>
    <div class="pod-cat">${p.category}</div>
    <div class="pod-feat">${String(feat).slice(0, 140)}</div>`;
  box.classList.remove('hidden');
}

// ─────────────────────────────────────────────
// 6. COPY AS WHATSAPP (formats any plan for WhatsApp paste)
// ─────────────────────────────────────────────
function copyPlanAsWhatsApp(regId) {
  if (typeof PRODUCT_REGISTRY === 'undefined') return;
  const p = PRODUCT_REGISTRY.find(x => x.regId === regId); if (!p) return;
  const feats = (p.keyFeatures || []).slice(0, 5).map(f => '✅ ' + String(f).replace(/^[✅⭐]\s*/, '')).join('\n');
  const sig = advisorSignature('wa');
  const text = `*${p.plan}*\n_${p.company} | ${p.type || p.category}_\n\n${feats || '✅ Refer official brochure for verified features'}\n\n${p.brochureUrl ? '📎 Brochure: ' + p.brochureUrl + '\n\n' : ''}_For information only — not financial advice. Always read the official brochure before any decision._\n\n— ${sig}`;
  copyTextToClipboard(text, 'Plan copied in WhatsApp format!');
}

function copyTextToClipboard(text, successMsg) {
  const done = () => { showCopyToast(successMsg || 'Copied!'); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else { fallbackCopy(text, done); }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch(e) {}
  document.body.removeChild(ta);
}

function showCopyToast(msg) {
  let t = document.getElementById('copyToast');
  if (!t) {
    t = document.createElement('div'); t.id = 'copyToast'; t.className = 'copy-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ─────────────────────────────────────────────
// SETTINGS MODAL open/close
// ─────────────────────────────────────────────
function openAdvisorSettings() {
  const modal = document.getElementById('advisorModal'); if (!modal) return;
  const a = getAdvisorProfile();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  set('advName', a.name); set('advDesig', a.designation); set('advPhone', a.phone); set('advEmail', a.email);
  modal.classList.remove('hidden');
}
function closeAdvisorSettings() {
  const modal = document.getElementById('advisorModal');
  if (modal) modal.classList.add('hidden');
}

// ─────────────────────────────────────────────
// PWA SERVICE WORKER REGISTRATION
// ─────────────────────────────────────────────
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* non-critical */ });
  }
}

// ─────────────────────────────────────────────
// INIT — deferred so PRODUCT_REGISTRY is ready
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initPWA();
  initWhatsNew();
  renderClientProfileChips();
  // Registry builds on a timeout in product-meta.js, so wait slightly longer
  setTimeout(function() { renderPinBar(); renderPlanOfTheDay(); }, 400);
});

// ─────────────────────────────────────────────
// CARD DECORATOR — adds Pin + WhatsApp Copy buttons to every product card
// Zero-touch: works on all category renderers without modifying them.
// Matches cards to the registry via company + plan text.
// ─────────────────────────────────────────────
function decorateProductCards() {
  if (typeof PRODUCT_REGISTRY === 'undefined' || !PRODUCT_REGISTRY) return;
  document.querySelectorAll('.prod-card:not(.arena-decorated)').forEach(card => {
    card.classList.add('arena-decorated');
    const co = card.querySelector('.pc-co')?.textContent?.trim();
    const pl = card.querySelector('.pc-pl')?.textContent?.trim();
    if (!co || !pl) return;
    const entry = PRODUCT_REGISTRY.find(p => p.company === co && (p.plan === pl || p.plan.startsWith(pl) || pl.startsWith(p.plan)));
    if (!entry) return;
    const pinned = getPinnedPlans().includes(entry.regId);
    const row = document.createElement('div');
    row.className = 'arena-card-actions';
    row.innerHTML =
      `<button class="aca-btn" onclick="togglePin('${entry.regId}');this.textContent=getPinnedPlans().includes('${entry.regId}')?'📌 Pinned':'📌 Pin';" title="Pin for quick access">${pinned ? '📌 Pinned' : '📌 Pin'}</button>` +
      `<button class="aca-btn" onclick="copyPlanAsWhatsApp('${entry.regId}')" title="Copy in WhatsApp format">💬 Copy for WhatsApp</button>`;
    card.appendChild(row);
  });
}

// Re-decorate whenever the user switches category/section (cards render lazily)
document.addEventListener('click', function(e) {
  if (e.target.closest('.cat-btn, .nav-btn, .tab-btn, .mnav-btn, .np-tab')) {
    setTimeout(decorateProductCards, 350);
  }
});
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(decorateProductCards, 700);
});

// ─────────────────────────────────────────────
// THEME TOGGLE (dark default = current design; light optional)
// ─────────────────────────────────────────────
function initTheme() {
  let theme = ArenaStore.get('ia_theme', null);
  if (!theme) {
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }
  applyTheme(theme);
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  ArenaStore.set('ia_theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#EEF2F7' : '#0D1B2A');
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(cur === 'light' ? 'dark' : 'light');
}
// Apply theme IMMEDIATELY (before DOMContentLoaded) to avoid flash
initTheme();

// ─────────────────────────────────────────────
// STICKY CATEGORY CONTEXT STRIP
// ─────────────────────────────────────────────
function initStickyStrip() {
  const strip = document.createElement('div');
  strip.id = 'stickyStrip'; strip.className = 'sticky-strip hidden';
  strip.innerHTML = '<span id="stickyStripLabel"></span><button class="ss-top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Top</button>';
  document.body.appendChild(strip);

  let currentLabel = '';
  window.addEventListener('scroll', function() {
    const show = window.scrollY > 600;
    strip.classList.toggle('hidden', !show || !currentLabel);
  }, { passive: true });

  // Track active category from cat-btn clicks
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.cat-btn:not(.coming)');
    if (!btn) return;
    setTimeout(function() {
      const cat = btn.getAttribute('data-cat');
      const names = { term:'Term Insurance', ulip:'ULIP', par:'Participating', nonpar:'Non-Par', annuity:'Annuity' };
      let count = '';
      if (typeof PRODUCT_REGISTRY !== 'undefined' && PRODUCT_REGISTRY) {
        const n = PRODUCT_REGISTRY.filter(p => p.catKey === cat).length;
        if (n) count = ' · ' + n + ' plans';
      }
      currentLabel = (names[cat] || cat) + count;
      const lbl = document.getElementById('stickyStripLabel');
      if (lbl) lbl.textContent = '📂 ' + currentLabel;
    }, 200);
  });
}

// ─────────────────────────────────────────────
// SKELETON LOADERS (shown briefly when switching categories)
// ─────────────────────────────────────────────
function showSkeletons(wrapId, n) {
  const wrap = document.getElementById(wrapId);
  if (!wrap || wrap.children.length > 0) return; // only when empty (first render)
  wrap.innerHTML = Array.from({length: n || 3}, () =>
    '<div class="skel-card"><div class="skel-line skel-w40"></div><div class="skel-line skel-w70"></div><div class="skel-line skel-w90"></div><div class="skel-line skel-w60"></div></div>'
  ).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  initStickyStrip();
});
