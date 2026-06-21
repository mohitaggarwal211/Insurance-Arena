// ═══════════════════════════════════════════════════════════
// INSURANCE ARENA — NEW FEATURES V2.1+
// 1. Smart Search | 3. Save Comparisons | 6. Swipe Cats
// 7. FAB | 8. Card Expand/Collapse | 9. Dark/Light Mode
// 11. Flashcard Mode | 15. Diff Highlight | 16. Shortlist
// 19. Need Analysis | 21. Share Plan
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────
// FEATURE 9: DARK / LIGHT MODE
// ─────────────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('ia_theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light-mode');
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = saved === 'light' ? '🌙' : '☀️';
})();

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('ia_theme', isLight ? 'light' : 'dark');
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
}

// ─────────────────────────────────────────────────────────
// FEATURE 1: UNIFIED SMART SEARCH
// ─────────────────────────────────────────────────────────
function openSearch() {
  document.getElementById('searchOverlay')?.classList.remove('hidden');
  document.getElementById('globalSearchInput')?.focus();
}
function closeSearch() {
  document.getElementById('searchOverlay')?.classList.add('hidden');
  const inp = document.getElementById('globalSearchInput');
  if (inp) inp.value = '';
  const res = document.getElementById('searchResults');
  if (res) res.innerHTML = '';
}

function runGlobalSearch() {
  const q = (document.getElementById('globalSearchInput')?.value || '').toLowerCase().trim();
  const res = document.getElementById('searchResults');
  if (!res) return;
  if (q.length < 2) { res.innerHTML = '<div class="gs-hint">Type at least 2 characters to search…</div>'; return; }

  const results = [];

  // Search Term Plans
  if (typeof PLANS !== 'undefined') {
    PLANS.forEach(p => {
      if ((p.company||'').toLowerCase().includes(q) || (p.planName||'').toLowerCase().includes(q)) {
        results.push({ type:'Term Insurance', icon:'🛡️', title: p.company + ' — ' + p.planName, sub: p.type || 'Term Plan', action: ()=>{ closeSearch(); switchCompareCat('term'); } });
      }
    });
  }

  // Search Anmol Plans
  if (typeof ANMOL_PLANS !== 'undefined') {
    ANMOL_PLANS.forEach(p => {
      if ((p.company||'').toLowerCase().includes(q) || (p.plan||'').toLowerCase().includes(q)) {
        results.push({ type:'Participating', icon:'📈', title: p.company + ' — ' + p.plan, sub: p.type || 'Participating Endowment', action: ()=>{ closeSearch(); switchCompareCat('par'); } });
      }
    });
  }

  // Search Nishchit Plans
  if (typeof NISHCHIT_PLANS !== 'undefined') {
    NISHCHIT_PLANS.forEach(p => {
      if (!p.excluded && ((p.company||'').toLowerCase().includes(q) || (p.plan||'').toLowerCase().includes(q))) {
        results.push({ type:'Guaranteed Early Income', icon:'💰', title: p.company + ' — ' + p.plan, sub: p.type || 'Non-Par Income', action: ()=>{ closeSearch(); switchCompareCat('nonpar'); } });
      }
    });
  }

  // Search Savings Plans
  if (typeof SAVINGS_PLANS !== 'undefined') {
    SAVINGS_PLANS.forEach(p => {
      if ((p.company||'').toLowerCase().includes(q) || (p.plan||'').toLowerCase().includes(q)) {
        results.push({ type:'Guaranteed Savings', icon:'💎', title: p.company + ' — ' + p.plan, sub: p.type || 'Non-Par Savings', action: ()=>{ closeSearch(); switchCompareCat('nonpar'); } });
      }
    });
  }

  // Search Annuity Plans
  if (typeof ANNUITY_PLANS !== 'undefined') {
    ANNUITY_PLANS.forEach(p => {
      if ((p.company||'').toLowerCase().includes(q) || (p.plan||'').toLowerCase().includes(q)) {
        results.push({ type:'Annuity', icon:'🏦', title: p.company + ' — ' + p.plan, sub: p.type || 'Annuity Plan', action: ()=>{ closeSearch(); switchCompareCat('annuity'); } });
      }
    });
  }

  // Search Dictionary
  if (typeof dictData !== 'undefined' && dictData.length) {
    dictData.forEach(d => {
      if ((d.term||'').toLowerCase().includes(q) || (d.definition||'').toLowerCase().includes(q)) {
        results.push({ type:'Dictionary', icon:'📖', title: d.term, sub: (d.definition||'').slice(0,60) + '…', action: ()=>{ closeSearch(); document.querySelector('[data-sec="learn"]')?.click(); setTimeout(()=>{ const el=document.getElementById('dictSearch'); if(el){el.value=d.term; el.dispatchEvent(new Event('input'));} }, 300); } });
      }
    });
  }

  // Search Learning Topics
  if (typeof ALL_TOPICS !== 'undefined' && ALL_TOPICS.length) {
    ALL_TOPICS.forEach(t => {
      if ((t.title||t.q||'').toLowerCase().includes(q) || (t.chapter||'').toLowerCase().includes(q)) {
        results.push({ type:'Learning', icon:'📚', title: t.title || t.q, sub: t.chapter || 'Learning Hub', action: ()=>{ closeSearch(); document.querySelector('[data-sec="learn"]')?.click(); } });
      }
    });
  }

  // Search News
  if (typeof allNewsData !== 'undefined' && allNewsData.length) {
    allNewsData.slice(0,50).forEach(n => {
      if ((n.title||'').toLowerCase().includes(q) || (n.desc||'').toLowerCase().includes(q)) {
        results.push({ type:'Finance News', icon:'📰', title: n.title, sub: n.source || 'News', action: ()=>{ closeSearch(); document.querySelector('[data-sec="news"]')?.click(); } });
      }
    });
  }

  if (!results.length) {
    res.innerHTML = '<div class="gs-hint">No results found for "' + san(q) + '"</div>';
    return;
  }

  const top = results.slice(0, 15);
  res.innerHTML = top.map((r, i) => `
    <div class="gs-result" onclick="gsActions[${i}]()">
      <span class="gs-icon">${r.icon}</span>
      <div class="gs-text">
        <div class="gs-title">${san(r.title)}</div>
        <div class="gs-sub"><span class="gs-type-tag">${san(r.type)}</span> ${san(r.sub)}</div>
      </div>
      <span class="gs-arrow">→</span>
    </div>`).join('');

  // Store actions globally (can't put functions in innerHTML onclick)
  window.gsActions = top.map(r => r.action);
}

// ─────────────────────────────────────────────────────────
// FEATURE 3: SAVE & SHARE COMPARISONS
// ─────────────────────────────────────────────────────────
const IA_SAVED_KEY = 'ia_saved_comparisons';
const MAX_SAVED = 5;

function getSavedComparisons() {
  try { return JSON.parse(localStorage.getItem(IA_SAVED_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveCurrentComparison() {
  const a = window.avbProductA, b = window.avbProductB;
  if (!a || !b) { alert('Run a comparison first, then save it.'); return; }
  const saved = getSavedComparisons();
  const id = Date.now();
  const entry = {
    id, timestamp: new Date().toLocaleDateString('en-IN'),
    coA: a.company, plA: a.plan, regIdA: a.regId,
    coB: b.company, plB: b.plan, regIdB: b.regId
  };
  // Avoid duplicates
  const existing = saved.findIndex(s => s.regIdA === entry.regIdA && s.regIdB === entry.regIdB);
  if (existing >= 0) saved.splice(existing, 1);
  saved.unshift(entry);
  if (saved.length > MAX_SAVED) saved.pop();
  localStorage.setItem(IA_SAVED_KEY, JSON.stringify(saved));
  renderSavedComparisons();
  showToast('Comparison saved ✓');
}

function loadSavedComparison(regIdA, regIdB) {
  if (typeof PRODUCT_REGISTRY === 'undefined') return;
  const a = PRODUCT_REGISTRY.find(p => p.regId === regIdA);
  const b = PRODUCT_REGISTRY.find(p => p.regId === regIdB);
  if (!a || !b) { showToast('Plans no longer available in dataset'); return; }
  window.avbProductA = a; window.avbProductB = b;
  // Set dropdowns
  ['A','B'].forEach((side, idx) => {
    const plan = idx === 0 ? a : b;
    const catSel = document.getElementById('avbCat' + side);
    const planSel = document.getElementById('avbPlan' + side);
    if (catSel) { catSel.value = plan.category; updateAvBPlans(side); }
    if (planSel) setTimeout(() => { planSel.value = plan.regId; }, 100);
  });
  checkAvBReady();
  setTimeout(runAvBComparison, 200);
}

function deleteSavedComparison(id) {
  const saved = getSavedComparisons().filter(s => s.id !== id);
  localStorage.setItem(IA_SAVED_KEY, JSON.stringify(saved));
  renderSavedComparisons();
}

function renderSavedComparisons() {
  const wrap = document.getElementById('savedCompsWrap');
  if (!wrap) return;
  const saved = getSavedComparisons();
  if (!saved.length) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <div class="saved-comps-title">📌 Saved Comparisons</div>
    ${saved.map(s => `
    <div class="saved-comp-row">
      <div class="sc-names" onclick="loadSavedComparison('${san(s.regIdA)}','${san(s.regIdB)}')">
        <span class="sc-a">${san(s.coA)}</span>
        <span class="sc-vs">vs</span>
        <span class="sc-b">${san(s.coB)}</span>
        <span class="sc-date">${san(s.timestamp)}</span>
      </div>
      <button class="sc-del" onclick="deleteSavedComparison(${s.id})">✕</button>
    </div>`).join('')}`;
}

// ─────────────────────────────────────────────────────────
// FEATURE 7: FLOATING ACTION BUTTON
// ─────────────────────────────────────────────────────────
let fabOpen = false;

function toggleFAB() {
  fabOpen = !fabOpen;
  document.getElementById('fabMenu')?.classList.toggle('hidden', !fabOpen);
  document.getElementById('fabMainBtn').textContent = fabOpen ? '✕' : '⚡';
}

function fabAction(action) {
  fabOpen = false;
  document.getElementById('fabMenu')?.classList.add('hidden');
  document.getElementById('fabMainBtn').textContent = '⚡';
  if (action === 'search') openSearch();
  else if (action === 'avb') {
    document.querySelector('[data-mode="avb"]')?.click() ||
    (() => { switchCompareCat(window.activeCat||'term'); setTimeout(()=>document.querySelector('.cab-btn[data-mode="avb"]')?.click(), 100); })();
  }
  else if (action === 'toolkit') {
    document.querySelector('.cab-btn[data-mode="toolkit"]')?.click();
  }
  else if (action === 'top') window.scrollTo({ top:0, behavior:'smooth' });
}

// ─────────────────────────────────────────────────────────
// FEATURE 6: SWIPE BETWEEN CATEGORIES
// ─────────────────────────────────────────────────────────
(function initSwipe() {
  const CAT_ORDER = ['term','par','nonpar','annuity'];
  let startX = 0, startY = 0;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (Math.abs(dx) < 60 || dy > 40) return; // not a horizontal swipe
    // Only swipe if we're in the compare section
    const compareEl = document.getElementById('sec-compare');
    if (!compareEl || !compareEl.classList.contains('active')) return;

    const cur = window.activeCat || 'term';
    const idx = CAT_ORDER.indexOf(cur);
    if (idx === -1) return;
    const next = dx < 0 ? CAT_ORDER[idx + 1] : CAT_ORDER[idx - 1];
    if (next) switchCompareCat(next);
  }, { passive: true });
})();

// ─────────────────────────────────────────────────────────
// FEATURE 8: CARD EXPAND / COLLAPSE
// ─────────────────────────────────────────────────────────
function toggleCard(btn) {
  const card = btn.closest('.prod-card');
  if (!card) return;
  const body = card.querySelector('.pc-card-body');
  if (!body) return;
  const isOpen = !body.classList.contains('hidden');
  body.classList.toggle('hidden', isOpen);
  btn.textContent = isOpen ? '▼ Show more' : '▲ Show less';
  btn.classList.toggle('pc-expand-open', !isOpen);
}

// Patch renderPar / renderNishchit / renderFeatureCards to wrap bodies
// Called after any card render to add expand toggles
function applyCardExpand(wrap) {
  if (!wrap) return;
  wrap.querySelectorAll('.prod-card').forEach(card => {
    if (card.querySelector('.pc-expand-btn')) return; // already patched
    // Find everything below pc-top
    const top = card.querySelector('.pc-top');
    const uin = card.querySelector('.pc-uin');
    if (!top) return;
    // Wrap remaining children in a body div
    const children = Array.from(card.children);
    const headerEnd = uin ? children.indexOf(uin) : children.indexOf(top);
    const bodyChildren = children.slice(headerEnd + 1);
    if (bodyChildren.length === 0) return;
    const body = document.createElement('div');
    body.className = 'pc-card-body hidden';
    bodyChildren.forEach(ch => body.appendChild(ch));
    const btn = document.createElement('button');
    btn.className = 'pc-expand-btn';
    btn.textContent = '▼ Show more';
    btn.onclick = function() { toggleCard(this); };
    card.appendChild(btn);
    card.appendChild(body);
  });
}

// ─────────────────────────────────────────────────────────
// FEATURE 15: WHAT'S DIFFERENT HIGHLIGHT IN A vs B
// ─────────────────────────────────────────────────────────
let showDiffOnly = false;

function toggleDiffOnly() {
  showDiffOnly = !showDiffOnly;
  const btn = document.getElementById('diffToggleBtn');
  if (btn) { btn.classList.toggle('active', showDiffOnly); btn.textContent = showDiffOnly ? '✓ Differences Only' : '⚡ Show Differences'; }
  document.querySelectorAll('.avb-tbl tbody tr').forEach(row => {
    const isDiff = row.classList.contains('avb-diff-row');
    row.classList.toggle('hidden', showDiffOnly && !isDiff);
  });
}

function applyDiffHighlight() {
  const rows = document.querySelectorAll('.avb-tbl tbody tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) return;
    const valA = cells[1]?.textContent?.trim() || '';
    const valB = cells[2]?.textContent?.trim() || '';
    if (valA && valB && valA !== valB && valA !== '—' && valB !== '—') {
      row.classList.add('avb-diff-row');
    } else {
      row.classList.remove('avb-diff-row');
    }
  });
  // Add diff toggle button if not already there
  const sec = document.querySelector('.avb-tbl-scroll');
  if (sec && !document.getElementById('diffToggleBtn')) {
    const btn = document.createElement('button');
    btn.id = 'diffToggleBtn';
    btn.className = 'diff-toggle-btn';
    btn.textContent = '⚡ Show Differences';
    btn.onclick = toggleDiffOnly;
    sec.parentElement.insertBefore(btn, sec);
  }
}

// ─────────────────────────────────────────────────────────
// FEATURE 21: SHARE THIS PLAN (One-tap WhatsApp share)
// ─────────────────────────────────────────────────────────
function shareThisPlan(company, plan, type, highlightsStr, brochureUrl) {
  const highlights = highlightsStr.split('|').filter(Boolean).slice(0,3).map(h => '• ' + h.trim()).join('\n');
  const bro = brochureUrl && brochureUrl.startsWith('http') ? '\n📎 Brochure: ' + brochureUrl : '';
  const msg = `📌 *${plan}*\n_${company} | ${type}_\n\n${highlights}${bro}\n\n_Shared via Insurance Arena — insurance-arena.vercel.app_\n\n_For information only. Not financial advice. Read official brochure before any decision._`;
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

// Inject share buttons into rendered cards
function injectShareButtons(wrap) {
  if (!wrap) return;
  wrap.querySelectorAll('.prod-card').forEach(card => {
    if (card.querySelector('.pc-share-btn')) return;
    const co   = card.querySelector('.pc-co')?.textContent?.trim() || '';
    const pl   = card.querySelector('.pc-pl')?.textContent?.trim() || '';
    const type = card.querySelector('.pc-type')?.textContent?.trim() || '';
    const lis  = card.querySelectorAll('.pc-highlights li');
    const highlights = Array.from(lis).map(li=>li.textContent).join('|');
    const bro = card.querySelector('a.pc-btn-sec')?.href || '';
    const btn = document.createElement('button');
    btn.className = 'pc-share-btn';
    btn.innerHTML = '📤 Share via WhatsApp';
    btn.onclick = () => shareThisPlan(co, pl, type, highlights, bro);
    // Insert before the links section if exists
    const links = card.querySelector('.pc-links');
    if (links) card.insertBefore(btn, links);
    else card.appendChild(btn);
  });
}

// ─────────────────────────────────────────────────────────
// FEATURE 16: PLAN SHORTLISTING (Multi-select Compare)
// ─────────────────────────────────────────────────────────
let shortlistedPlans = [];

function toggleShortlist(planKey, company, plan) {
  const idx = shortlistedPlans.findIndex(p => p.key === planKey);
  if (idx >= 0) {
    shortlistedPlans.splice(idx, 1);
  } else {
    if (shortlistedPlans.length >= 4) { showToast('Maximum 4 plans can be compared at once'); return; }
    shortlistedPlans.push({ key: planKey, company, plan });
  }
  updateShortlistBar();
  // Update checkbox visual
  const cb = document.querySelector(`[data-shortlist="${planKey}"]`);
  if (cb) { cb.checked = shortlistedPlans.some(p => p.key === planKey); }
}

function updateShortlistBar() {
  let bar = document.getElementById('shortlistBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'shortlistBar';
    bar.className = 'shortlist-bar hidden';
    bar.innerHTML = `<span id="shortlistCount"></span><button onclick="runShortlistCompare()" class="sl-compare-btn">Compare Selected →</button><button onclick="clearShortlist()" class="sl-clear-btn">✕</button>`;
    document.body.appendChild(bar);
  }
  if (shortlistedPlans.length >= 2) {
    bar.classList.remove('hidden');
    document.getElementById('shortlistCount').textContent = `${shortlistedPlans.length} plans selected`;
  } else {
    bar.classList.add('hidden');
  }
}

function clearShortlist() {
  shortlistedPlans = [];
  updateShortlistBar();
  document.querySelectorAll('[data-shortlist]').forEach(cb => cb.checked = false);
}

function runShortlistCompare() {
  if (shortlistedPlans.length < 2) return;
  const modal = document.getElementById('shortlistModal');
  if (!modal) return;
  const plans = shortlistedPlans.map(sl => {
    return PRODUCT_REGISTRY?.find(p => p.regId === sl.key) || { company: sl.company, plan: sl.plan };
  }).filter(Boolean);

  const fields = ['company','plan','category','type','entryAge','ppt','pt','deathBenefit','loan','jointLife','guaranteedAdditions','loyaltyAdditions','incomeBenefit','incomePeriod','uniqueAdvantage'];
  const labels = ['Company','Plan','Category','Type','Entry Age','PPT','Policy Term','Death Benefit','Loan','Joint Life','Guar. Additions','Loyalty Additions','Income Benefit','Income Period','Unique Advantage'];

  let h = `<div class="sl-modal-inner"><button class="sl-close-btn" onclick="document.getElementById('shortlistModal').classList.add('hidden')">✕ Close</button>
  <h3 class="sl-title">📋 Shortlist Comparison (${plans.length} Plans)</h3>
  <div class="sl-tbl-scroll"><table class="sl-tbl">
  <thead><tr><th>Feature</th>${plans.map(p=>`<th>${san(p.company)}<br/><small>${san(p.plan)}</small></th>`).join('')}</tr></thead>
  <tbody>`;
  fields.forEach((f,i) => {
    h += `<tr><td class="sl-label">${labels[i]}</td>`;
    const vals = plans.map(p => {
      let v = p[f];
      if (typeof v === 'boolean') v = v ? '✅ Yes' : '❌ No';
      return v || '—';
    });
    const allSame = vals.every(v=>v===vals[0]);
    plans.forEach((p,j) => {
      h += `<td class="${!allSame?'sl-diff':''}">${san(vals[j])}</td>`;
    });
    h += '</tr>';
  });
  h += '</tbody></table></div></div>';
  modal.innerHTML = h;
  modal.classList.remove('hidden');
}

// Inject shortlist checkboxes into rendered cards
function injectShortlistCheckboxes(wrap, category) {
  if (!wrap || typeof PRODUCT_REGISTRY === 'undefined') return;
  wrap.querySelectorAll('.prod-card').forEach(card => {
    if (card.querySelector('.sl-checkbox-wrap')) return;
    const co = card.querySelector('.pc-co')?.textContent?.trim() || '';
    const pl = card.querySelector('.pc-pl')?.textContent?.trim() || '';
    const regId = PRODUCT_REGISTRY.find(p => p.company === co && p.plan === pl)?.regId || (co + '_' + pl).replace(/\s/g,'_');
    const wrap2 = document.createElement('div');
    wrap2.className = 'sl-checkbox-wrap';
    wrap2.innerHTML = `<label class="sl-cb-label"><input type="checkbox" data-shortlist="${san(regId)}" onchange="toggleShortlist('${san(regId)}','${san(co)}','${san(pl)}')" ${shortlistedPlans.some(p=>p.key===regId)?'checked':''}> Add to Compare</label>`;
    const top = card.querySelector('.pc-top');
    if (top && top.nextSibling) card.insertBefore(wrap2, top.nextSibling);
    else card.appendChild(wrap2);
  });
}

// ─────────────────────────────────────────────────────────
// FEATURE 11: FLASHCARD MODE
// ─────────────────────────────────────────────────────────
let fcDeck = [], fcIndex = 0, fcFlipped = false;

function initFlashcards() {
  const wrap = document.getElementById('flashcardWrap');
  if (!wrap) return;

  // Build deck from ALL_TOPICS or dictData
  fcDeck = [];
  if (typeof ALL_TOPICS !== 'undefined' && ALL_TOPICS.length) {
    ALL_TOPICS.forEach(t => {
      if (t.q && t.a) fcDeck.push({ front: t.q, back: t.a, tag: t.chapter || 'General' });
      else if (t.title && t.content) fcDeck.push({ front: t.title, back: t.content?.slice(0,200) || '—', tag: t.chapter || 'General' });
    });
  }
  if (typeof dictData !== 'undefined' && dictData.length && fcDeck.length < 20) {
    dictData.slice(0, 50).forEach(d => {
      fcDeck.push({ front: d.term, back: d.definition || '—', tag: 'Dictionary' });
    });
  }

  fcDeck = fcDeck.slice(0, 200); // cap at 200
  fcIndex = 0; fcFlipped = false;
  if (!fcDeck.length) { wrap.innerHTML = '<div style="padding:20px;color:var(--g400);text-align:center">No flashcard data available yet. Complete more learning topics first.</div>'; return; }
  renderFlashcard(wrap);
}

function renderFlashcard(wrap) {
  if (!fcDeck.length) return;
  const card = fcDeck[fcIndex];
  wrap.innerHTML = `
  <div class="fc-header">
    <div class="fc-progress">${fcIndex + 1} / ${fcDeck.length}</div>
    <div class="fc-tag">${san(card.tag)}</div>
    <div class="fc-progress-bar"><div class="fc-progress-fill" style="width:${(fcIndex+1)/fcDeck.length*100}%"></div></div>
  </div>
  <div class="fc-card${fcFlipped?' fc-flipped':''}" onclick="flipFlashcard()">
    <div class="fc-face fc-front">
      <div class="fc-hint">Tap to reveal</div>
      <div class="fc-q">${san(card.front)}</div>
    </div>
    <div class="fc-face fc-back">
      <div class="fc-hint">Answer</div>
      <div class="fc-a">${san(card.back)}</div>
    </div>
  </div>
  <div class="fc-controls">
    <button class="fc-btn" onclick="fcNav(-1)" ${fcIndex===0?'disabled':''}>← Prev</button>
    <button class="fc-btn fc-shuffle" onclick="shuffleFlashcards()">🔀 Shuffle</button>
    <button class="fc-btn" onclick="fcNav(1)" ${fcIndex===fcDeck.length-1?'disabled':''}>Next →</button>
  </div>`;
}

function flipFlashcard() {
  fcFlipped = !fcFlipped;
  const card = document.querySelector('.fc-card');
  if (card) card.classList.toggle('fc-flipped', fcFlipped);
}

function fcNav(dir) {
  fcIndex = Math.max(0, Math.min(fcDeck.length - 1, fcIndex + dir));
  fcFlipped = false;
  const wrap = document.getElementById('flashcardWrap');
  if (wrap) renderFlashcard(wrap);
}

function shuffleFlashcards() {
  for (let i = fcDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fcDeck[i], fcDeck[j]] = [fcDeck[j], fcDeck[i]];
  }
  fcIndex = 0; fcFlipped = false;
  const wrap = document.getElementById('flashcardWrap');
  if (wrap) renderFlashcard(wrap);
  showToast('Deck shuffled 🔀');
}

// ─────────────────────────────────────────────────────────
// FEATURE 19: NEED ANALYSIS CALCULATOR
// ─────────────────────────────────────────────────────────
function runNeedAnalysis() {
  const age     = parseInt(document.getElementById('na-age')?.value || 0);
  const income  = parseFloat(document.getElementById('na-income')?.value || 0);
  const deps    = parseInt(document.getElementById('na-deps')?.value || 0);
  const loans   = parseFloat(document.getElementById('na-loans')?.value || 0);
  const exist   = parseFloat(document.getElementById('na-exist')?.value || 0);
  const expense = parseFloat(document.getElementById('na-expense')?.value || 0);

  const res = document.getElementById('na-result');
  if (!res) return;
  if (!age || !income) { res.innerHTML = '<div class="na-error">Please enter at least Age and Annual Income.</div>'; return; }

  const yearsLeft = Math.max(5, 60 - age);

  // Method 1: Income Replacement (15× annual income rule)
  const incomeReplace = income * 15;

  // Method 2: Human Life Value = PV of future income
  const rate = 0.06;
  const hlv = income * ((1 - Math.pow(1+rate, -yearsLeft)) / rate);

  // Method 3: Expense-based = expenses × years × 0.7 inflation factor
  const expenseBased = expense > 0 ? expense * yearsLeft * 0.7 : 0;

  // Total need = max(HLV, income replace, expense) + loans - existing cover
  const base = Math.max(incomeReplace, hlv, expenseBased);
  const rawNeed = base + (loans * 100000) - (exist * 100000);
  const recommended = Math.max(0, rawNeed);
  const recCr = (recommended / 10000000).toFixed(2);
  const recL  = (recommended / 100000).toFixed(0);

  const hlvCr = (hlv / 10000000).toFixed(2);
  const irCr  = (incomeReplace / 10000000).toFixed(2);

  res.innerHTML = `
  <div class="na-result-box">
    <div class="na-rec-label">Recommended Life Cover</div>
    <div class="na-rec-value">₹${recCr} Crore</div>
    <div class="na-rec-sub">(₹${Number(recL).toLocaleString('en-IN')} Lakh)</div>
    <div class="na-breakdown">
      <div class="na-bd-title">How we calculated:</div>
      <div class="na-bd-row"><span>Human Life Value (PV of ${yearsLeft} yrs income @6%)</span><span>₹${hlvCr} Cr</span></div>
      <div class="na-bd-row"><span>Income Replacement (15× Annual Income)</span><span>₹${irCr} Cr</span></div>
      ${loans?`<div class="na-bd-row"><span>Outstanding Loans</span><span>+ ₹${loans.toFixed(2)} L</span></div>`:''}
      ${exist?`<div class="na-bd-row"><span>Existing Cover (deducted)</span><span>– ₹${exist.toFixed(2)} L</span></div>`:''}
    </div>
    <div class="na-note">⚠️ This is an indicative estimate using standard actuarial methods. Consult a licensed advisor for a personalised assessment.</div>
    ${deps?`<div class="na-dep-note">👨‍👩‍👧 With ${deps} dependent${deps>1?'s':''}, adequate life cover is especially critical.</div>`:''}
  </div>`;
}

// ─────────────────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  let t = document.getElementById('iaToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'iaToast';
    t.className = 'ia-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// ─────────────────────────────────────────────────────────
// INIT ALL FEATURES ON DOM READY
// ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Keyboard shortcut for search
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') { closeSearch(); }
  });
  // Close search on overlay bg click
  document.getElementById('searchOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeSearch();
  });
  // Close shortlist modal on bg click
  document.getElementById('shortlistModal')?.addEventListener('click', function(e) {
    if (e.target === this) this.classList.add('hidden');
  });
  // Load saved comparisons on A vs B open
  const avbSec = document.getElementById('sec-avb');
  if (avbSec) {
    const observer = new MutationObserver(() => {
      if (!avbSec.classList.contains('hidden')) {
        renderSavedComparisons();
      }
    });
    observer.observe(avbSec, { attributes: true, attributeFilter: ['class'] });
  }
});

// ─────────────────────────────────────────────────────────
// SAFE POST-RENDER INTEGRATION
// Uses MutationObserver instead of function patching
// No risk of infinite recursion
// ─────────────────────────────────────────────────────────
(function initPostRenderHooks() {
  // Observe each content wrap for new card content
  const wrapsToWatch = [
    { id: 'parWrap',       cat: 'par'     },
    { id: 'nonparWrap',    cat: 'nonpar'  },
    { id: 'annCardsView',  cat: 'annuity' },
  ];

  function applyHooks(el, cat) {
    if (!el) return;
    if (typeof applyCardExpand === 'function')         applyCardExpand(el);
    if (typeof injectShareButtons === 'function')      injectShareButtons(el);
    if (typeof injectShortlistCheckboxes === 'function') injectShortlistCheckboxes(el, cat);
  }

  wrapsToWatch.forEach(({ id, cat }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new MutationObserver(() => {
      // Debounce — wait for render to complete
      clearTimeout(el._hookTimer);
      el._hookTimer = setTimeout(() => applyHooks(el, cat), 200);
    });
    obs.observe(el, { childList: true, subtree: false });
  });

  // Observe nav section switches to show Need Analysis + Flashcard
  const allSections = document.querySelectorAll('.sec');
  allSections.forEach(sec => {
    const obs = new MutationObserver(() => {
      const isVisible = !sec.classList.contains('hidden') && sec.classList.contains('active');
      if (!isVisible) return;
      if (sec.id === 'sec-tools') {
        const na = document.getElementById('needAnalysisCalc');
        if (na) na.classList.remove('hidden');
      }
      if (sec.id === 'sec-learn') {
        injectFlashcardBtn();
      }
    });
    obs.observe(sec, { attributes: true, attributeFilter: ['class'] });
  });

  // Also watch nav button clicks directly (safe — just adds show/hide logic)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn, .mnav-btn');
    if (!btn) return;
    const sec = btn.dataset.sec;
    if (sec === 'tools') {
      setTimeout(() => {
        const na = document.getElementById('needAnalysisCalc');
        if (na) na.classList.remove('hidden');
      }, 100);
    }
    if (sec === 'learn') {
      setTimeout(injectFlashcardBtn, 100);
    }
  }, true); // capture phase — runs before existing listeners
})();

function injectFlashcardBtn() {
  const learnSec = document.getElementById('sec-learn');
  if (!learnSec || document.getElementById('fcToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'fcToggleBtn';
  btn.className = 'fc-toggle-btn';
  btn.textContent = '📇 Flashcard Mode';
  btn.onclick = function() {
    const fcSec = document.getElementById('flashcardSection');
    if (!fcSec) return;
    const isOn = !fcSec.classList.contains('hidden');
    fcSec.classList.toggle('hidden', isOn);
    this.classList.toggle('active', !isOn);
    this.textContent = isOn ? '📇 Flashcard Mode' : '📖 Back to Learning';
    if (!isOn && typeof initFlashcards === 'function') initFlashcards();
  };
  learnSec.insertBefore(btn, learnSec.firstChild);
}
