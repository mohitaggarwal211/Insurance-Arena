// ══════════════════════════════════════
// INSURANCE ARENA — APP LOGIC v3.0
// Three sections: Compare · News · Learn
// ══════════════════════════════════════

// ── STATE ──
let activeSection  = 'compare';
let activeFilter   = 'all';
let activeSearch   = '';
let activeSort     = 'default';
let activeView     = 'card';
let activeCat      = 'all';
let activeChapter  = null;
let completedTopics = new Set(JSON.parse(localStorage.getItem('ia_done') || '[]'));
let allNewsData    = [];
let activeNewsCat  = 'all';

// ── DOM REFS ──
const cardsGrid   = () => document.getElementById('cardsGrid');
const tableWrap   = () => document.getElementById('tableWrap');
const tableBody   = () => document.getElementById('tableBody');
const noResults   = () => document.getElementById('noResults');
const resMeta     = () => document.getElementById('resultsCount');
const newsGrid    = () => document.getElementById('newsGrid');
const newsLoading = () => document.getElementById('newsLoadingState');
const chSidebar   = () => document.getElementById('chapterSidebar');
const topicPH     = () => document.getElementById('topicPlaceholder');
const topicCont   = () => document.getElementById('topicContent');
const progText    = () => document.getElementById('progressText');
const srResults   = () => document.getElementById('srResults');

// ── HELPERS ──
function cc(v){ return v >= 99 ? 'high' : v >= 98 ? 'mid' : 'low'; }
function cw(v){ return Math.max(0, Math.min(100, ((v - 97) / 3) * 100)); }
function san(s){ const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmt(dt){ const m=['January','February','March','April','May','June','July','August','September','October','November','December']; const d=new Date(dt); return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`; }
function today(){ return fmt(new Date()); }
function saveProgress(){ localStorage.setItem('ia_done', JSON.stringify([...completedTopics])); }

// ── SECTION NAVIGATION ──
function showSection(name) {
  if (activeSection === name) return;
  activeSection = name;
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('sec-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn, .tab-btn, .mnav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sec === name);
  });
  document.getElementById('mobileNav').classList.add('hidden');
  window.scrollTo(0, 0);
  if (name === 'news' && allNewsData.length === 0) loadNews();
  if (name === 'learn' && chSidebar().children.length === 0) renderChapterList();
}

// Nav buttons
document.querySelectorAll('[data-sec]').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.sec));
});

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('hidden');
});

// ════════════════════════════════════════
// SECTION 1 — COMPARE
// ════════════════════════════════════════
function getFilteredPlans() {
  let result = [...PLANS];
  if (activeSearch.trim()) {
    const q = activeSearch.toLowerCase();
    result = result.filter(p =>
      p.company.toLowerCase().includes(q) ||
      p.companyShort.toLowerCase().includes(q) ||
      p.plan.toLowerCase().includes(q) ||
      p.salesPitch.toLowerCase().includes(q) ||
      p.tags.some(t => t.label.toLowerCase().includes(q)) ||
      p.keyFeatures.some(f => f.toLowerCase().includes(q))
    );
  }
  const map = { 'whole-life':'wholeLife', 'rop':'returnOfPremium', 'joint':'jointLife', 'ci':'criticalIllness' };
  if (activeFilter !== 'all' && map[activeFilter]) {
    result = result.filter(p => p[map[activeFilter]] === true);
  }
  if (activeSort === 'csr-high') result.sort((a, b) => b.csr - a.csr);
  else if (activeSort === 'csr-low') result.sort((a, b) => a.csr - b.csr);
  else if (activeSort === 'name') result.sort((a, b) => a.company.localeCompare(b.company));
  else result.sort((a, b) => a.id - b.id);
  return result;
}

function renderPlans() {
  const plans = getFilteredPlans();
  resMeta().textContent = `Showing ${plans.length} plan${plans.length !== 1 ? 's' : ''}`;
  const empty = plans.length === 0;
  noResults().classList.toggle('hidden', !empty);
  cardsGrid().classList.toggle('hidden', empty);
  tableWrap().classList.add('hidden');
  if (empty) return;
  if (activeView === 'card') { renderCards(plans); }
  else { cardsGrid().classList.add('hidden'); tableWrap().classList.remove('hidden'); renderTable(plans); }
}

function renderCards(plans) {
  cardsGrid().innerHTML = plans.map((p, i) => {
    const cls = cc(p.csr), w = cw(p.csr);
    const tags = p.tags.map(t => `<span class="feat-tag ${t.type}">${san(t.label)}</span>`).join('');
    const stats = (p.keyStats || []).map(s =>
      `<div><span class="card-stat-val">${san(s.val)}</span><span class="card-stat-lbl">${san(s.lbl)}</span></div>`
    ).join('');
    const csrVal = p.csrPending
      ? `<span class="csr-value mid">⚠️ Pending</span>`
      : `<span class="csr-value ${cls}">${p.csr}%</span>`;
    return `<div class="plan-card" tabindex="0" role="article" onclick="openModal(${p.id})">
      <div class="card-header">
        <div>
          <div class="card-company">${san(p.companyShort)}</div>
          <div class="card-plan-name">${san(p.plan)}</div>
        </div>
        <div class="card-rank">${i + 1}</div>
      </div>
      <div class="csr-section">
        <div class="csr-header"><span class="csr-label">Claim Settlement Ratio FY 2024–25</span>${csrVal}</div>
        <div class="csr-bar-track"><div class="csr-bar-fill ${p.csrPending ? 'mid' : cls}" style="width:0%" data-w="${p.csrPending ? 55 : w}"></div></div>
        <div class="csr-sub">${p.csrPending ? '⚠️ Update from IRDAI Annual Report 2024-25' : 'Source: IRDAI Annual Report FY 2024–25'}</div>
      </div>
      <div class="card-features">${tags}</div>
      ${stats ? `<div class="card-stats">${stats}</div>` : ''}
      <div class="card-pitch">
        <div class="card-pitch-label">Why this plan?</div>
        <div class="card-pitch-text">${san(p.salesPitch)}</div>
      </div>
      <div class="card-footer">
        <a href="${p.calcUrl}" target="_blank" rel="noopener" class="btn-calc" onclick="event.stopPropagation()">🧮 Calculate Premium</a>
        <button class="btn-details" onclick="event.stopPropagation(); openModal(${p.id})">Full Details</button>
      </div>
    </div>`;
  }).join('');
  requestAnimationFrame(() => {
    document.querySelectorAll('.csr-bar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
  });
}

function renderTable(plans) {
  const yn = v => v ? `<span class="tbl-yes">✓</span>` : `<span class="tbl-no">–</span>`;
  tableBody().innerHTML = plans.map(p => {
    const cls = cc(p.csr);
    return `<tr>
      <td><div style="font-weight:600;color:var(--white)">${san(p.companyShort)}</div></td>
      <td style="font-size:11px;color:var(--g400)">${san(p.plan)}</td>
      <td class="tbl-csr ${p.csrPending ? 'mid' : cls}">${p.csrPending ? '⚠️ Pending' : p.csr + '%'}</td>
      <td>${yn(p.wholeLife)}</td><td>${yn(p.terminalIllness)}</td><td>${yn(p.criticalIllness)}</td>
      <td>${yn(p.returnOfPremium)}</td><td>${yn(p.jointLife)}</td><td>${yn(p.wopDisability)}</td>
      <td style="font-size:11px">${san(p.maxMaturity)}</td>
      <td>${p.womenDiscount && !p.womenDiscount.toLowerCase().includes('no') ? '<span class="tbl-yes">✓</span>' : '<span class="tbl-no">–</span>'}</td>
      <td><a href="${p.calcUrl}" target="_blank" rel="noopener" class="tbl-calc">Calculate →</a></td>
    </tr>`;
  }).join('');
}

// ── MODAL ──
function openModal(id) {
  const p = PLANS.find(x => x.id === id);
  if (!p) return;
  const cls = cc(p.csr);
  const csrVal = p.csrPending ? `<span class="csr-value mid">⚠️ Pending</span>` : `<span class="csr-value ${cls}">${p.csr}%</span>`;
  const featRows = [
    ['Whole Life Option', p.wholeLife], ['Terminal Illness', p.terminalIllness],
    ['Accidental Death Benefit', p.accidentalDeath], ['Critical Illness Cover', p.criticalIllness],
    ['WOP on Disability', p.wopDisability], ['Return of Premium', p.returnOfPremium],
    ['Joint Life Cover', p.jointLife], ['Premium Break', p.premiumBreak],
    ['Smart Exit / SEV', p.smartExit], ['Spouse Cover', p.spouseCover], ['Life Stage SA+', p.lifeStage],
  ].map(([l, v]) => `<span class="m-feat ${v ? 'yes' : 'no'}">${v ? '✓' : '✗'} ${l}</span>`).join('');
  const bullets = (p.keyFeatures || []).map(f => `<li>${san(f)}</li>`).join('');
  document.getElementById('modalContent').innerHTML = `
    <div class="m-company">${san(p.company)}</div>
    <div class="m-plan">${san(p.plan)}</div>
    <div class="m-uin">UIN: ${san(p.uin)} · Data: FY 2024–25</div>
    <div class="csr-section" style="background:none;padding:0;margin-bottom:16px">
      <div class="csr-header"><span class="csr-label">Claim Settlement Ratio FY 2024–25</span>${csrVal}</div>
      <div class="csr-bar-track"><div class="csr-bar-fill ${p.csrPending ? 'mid' : cls}" style="width:0%" data-w="${p.csrPending ? 55 : cw(p.csr)}"></div></div>
    </div>
    <div class="m-sec">Plan Details</div>
    <div class="m-grid">
      <div><div class="m-fl">Entry Age</div><div class="m-fv">${san(p.entryAge)}</div></div>
      <div><div class="m-fl">Max Maturity</div><div class="m-fv">${san(p.maxMaturity)}</div></div>
      <div><div class="m-fl">Sum Assured</div><div class="m-fv">${san(p.minSA)} – ${san(p.maxSA)}</div></div>
      <div><div class="m-fl">Premium Pay</div><div class="m-fv">${san(p.premiumPay)}</div></div>
      <div><div class="m-fl">Limited Pay Terms</div><div class="m-fv">${san(p.limitedPayTerms)}</div></div>
      <div><div class="m-fl">Premium Modes</div><div class="m-fv">${san(p.premiumModes)}</div></div>
      <div><div class="m-fl">Death Benefit</div><div class="m-fv">${san(p.deathBenefit)}</div></div>
      <div><div class="m-fl">Women Discount</div><div class="m-fv">${san(p.womenDiscount)}</div></div>
    </div>
    <div class="m-sec">Features at a Glance</div>
    <div class="m-feats">${featRows}</div>
    <div class="m-sec">Key Highlights</div>
    <ul class="m-bullets">${bullets}</ul>
    <div class="m-sec">Why Recommend This Plan?</div>
    <div class="m-pitch-box">${san(p.salesPitch)}</div>
    <div class="m-actions">
      <a href="${p.calcUrl}" target="_blank" rel="noopener" class="m-btn-p">🧮 Calculate My Premium →</a>
      <a href="${p.brochureUrl}" target="_blank" rel="noopener" class="m-btn-s">📄 View Brochure</a>
    </div>`;
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => { overlay.classList.add('active'); });
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const b = document.querySelector('#modalContent .csr-bar-fill');
    if (b) { const w = b.dataset.w; b.style.width = '0%'; requestAnimationFrame(() => { b.style.width = w + '%'; }); }
  });
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  setTimeout(() => overlay.classList.add('hidden'), 250);
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── CONTROLS ──
document.getElementById('searchInput').addEventListener('input', e => { activeSearch = e.target.value; renderPlans(); });
document.getElementById('sortSelect').addEventListener('change', e => { activeSort = e.target.value; renderPlans(); });
document.getElementById('cardViewBtn').addEventListener('click', () => {
  activeView = 'card';
  document.getElementById('cardViewBtn').classList.add('active');
  document.getElementById('tableViewBtn').classList.remove('active');
  renderPlans();
});
document.getElementById('tableViewBtn').addEventListener('click', () => {
  activeView = 'table';
  document.getElementById('tableViewBtn').classList.add('active');
  document.getElementById('cardViewBtn').classList.remove('active');
  renderPlans();
});
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderPlans();
  });
});

function resetFilters() {
  activeFilter = 'all'; activeSearch = ''; activeSort = 'default';
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  renderPlans();
}

// ════════════════════════════════════════
// SECTION 2 — NEWS
// ════════════════════════════════════════
const FALLBACK_NEWS = [
  {title:"IRDAI raises health insurance sum insured limits for standard products",source:"Business Standard",category:"irdai",date:"Today",summary:"The insurance regulator revised guidelines for standard health insurance products, increasing minimum sum insured thresholds to improve policyholder protection across all age groups.",url:"https://www.business-standard.com/finance/insurance"},
  {title:"Life insurance new business premium grows 18% year-on-year in FY25",source:"Economic Times",category:"market",date:"2 days ago",summary:"The life insurance sector recorded robust growth in new business premium collection, driven by strong performance from both LIC and private insurers in the last fiscal year.",url:"https://economictimes.indiatimes.com/industry/banking/insurance"},
  {title:"Term insurance premiums expected to rise as global reinsurers revise rates",source:"Livemint",category:"product",date:"3 days ago",summary:"Global reinsurance costs are increasing, which may lead to marginal premium hikes in term insurance plans across major insurers in India over the next 6–12 months.",url:"https://www.livemint.com/insurance"},
  {title:"IRDAI circular on health insurance portability — new guidelines effective immediately",source:"IRDAI Official",category:"irdai",date:"4 days ago",summary:"IRDAI issued a comprehensive circular updating health insurance portability norms, making it easier for policyholders to switch insurers without losing waiting period credit.",url:"https://irdai.gov.in"},
  {title:"GST on life insurance premiums — government reviews exemption framework",source:"Financial Express",category:"irdai",date:"5 days ago",summary:"The government is examining the current GST structure on insurance premiums following representations from industry and policyholder groups seeking further rationalisation.",url:"https://www.financialexpress.com/money/insurance"},
  {title:"LIC posts highest-ever new business premium collection in FY 2024-25",source:"Hindu Business Line",category:"market",date:"1 week ago",summary:"Life Insurance Corporation recorded its highest-ever new business premium in FY25, consolidating market leadership while private insurers also showed strong growth.",url:"https://www.thehindubusinessline.com/money-and-banking/insurance"},
  {title:"Health insurance claim settlement ratio improves across industry in FY25",source:"Moneycontrol",category:"claims",date:"1 week ago",summary:"IRDAI data shows improvement in health insurance claim settlement ratios, with several private insurers surpassing 98% for the first time in the last financial year.",url:"https://www.moneycontrol.com/news/business/moneycontrol-research/insurance"},
  {title:"IRDAI revises ULIP disclosure and charge norms for improved transparency",source:"NDTV Profit",category:"irdai",date:"10 days ago",summary:"IRDAI issued revised guidelines for Unit Linked Insurance Plans, strengthening disclosure requirements and capping charges to improve transparency for policyholders.",url:"https://profit.ndtv.com/insurance"},
  {title:"PM-JAY Ayushman Bharat expanded to cover all senior citizens above 70",source:"PIB India",category:"market",date:"2 weeks ago",summary:"The government announced expansion of Ayushman Bharat PMJAY to cover all senior citizens above 70, providing ₹5 lakh annual health cover completely free of cost.",url:"https://pib.gov.in"},
  {title:"Critical illness insurance — IRDAI standardises list of covered conditions",source:"Business Standard",category:"product",date:"2 weeks ago",summary:"IRDAI mandated a standard list of critical illnesses covered by all CI policies, bringing uniformity and removing confusion for buyers comparing different products.",url:"https://www.business-standard.com/finance/insurance"},
  {title:"Insurance sector FDI limit raised to 100% — Cabinet gives approval",source:"Economic Times",category:"market",date:"3 weeks ago",summary:"The Cabinet approved raising the FDI limit in insurance from 74% to 100%, which is expected to attract significant foreign capital and new players into the Indian insurance sector.",url:"https://economictimes.indiatimes.com/industry/banking/insurance"},
  {title:"Claim rejection rate for health insurance falls to 4-year low in FY25",source:"Livemint",category:"claims",date:"3 weeks ago",summary:"The health insurance claim rejection rate fell to its lowest in four years, attributed to IRDAI's stricter monitoring and improved grievance redressal mechanisms.",url:"https://www.livemint.com/insurance"},
];

async function loadNews() {
  newsLoading().classList.remove('hidden');
  newsGrid().classList.add('hidden');
  // Set dynamic date
  const dateEl = document.getElementById('newsDateDisplay');
  if (dateEl) dateEl.textContent = today();
  const tabSub = document.getElementById('newsUpdateTime');
  if (tabSub) tabSub.textContent = `Updated at 7 AM · ${today()}`;
  try {
    const res = await fetch('./data/news.json');
    if (res.ok) {
      const data = await res.json();
      allNewsData = data.articles || FALLBACK_NEWS;
    } else throw new Error('Fetch failed');
  } catch (e) {
    allNewsData = FALLBACK_NEWS;
  }
  newsLoading().classList.add('hidden');
  newsGrid().classList.remove('hidden');
  renderNews();
}

function renderNews() {
  const filtered = activeNewsCat === 'all'
    ? allNewsData
    : allNewsData.filter(n => n.category === activeNewsCat);
  if (filtered.length === 0) {
    newsGrid().innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--g400)">No news in this category yet.</div>`;
    return;
  }
  newsGrid().innerHTML = filtered.map(n => `
    <a class="news-card" href="${n.url || '#'}" target="_blank" rel="noopener">
      <div class="news-card-top">
        <span class="news-source">📰 ${san(n.source)}</span>
        <span class="news-cat-badge ${n.category}">${n.category.toUpperCase()}</span>
      </div>
      <div class="news-title">${san(n.title)}</div>
      <div class="news-summary">${san(n.summary)}</div>
      <div class="news-footer">
        <span class="news-date">${san(n.date || '')}</span>
        <span class="news-read-more">Read full story →</span>
      </div>
    </a>`).join('');
}

document.querySelectorAll('.news-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.news-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeNewsCat = btn.dataset.ncat;
    renderNews();
  });
});

// ════════════════════════════════════════
// SECTION 3 — LEARN
// ════════════════════════════════════════
function updateProgressDisplay() {
  const total = CHAPTERS.reduce((s, c) => s + c.topics, 0);
  const pct = total > 0 ? Math.round((completedTopics.size / total) * 100) : 0;
  const el = document.getElementById('sidebarProgress');
  if (el) el.textContent = pct + '%';
}

function renderChapterList() {
  const sections = ['Common', 'Life Insurance', 'Health Insurance'];
  chSidebar().innerHTML = `
    <div class="sidebar-head">
      <span class="sidebar-label">📋 Chapters</span>
      <span class="sidebar-progress" id="sidebarProgress">0%</span>
    </div>
    <div class="ch-list">
      ${sections.map(sec => {
        const chs = CHAPTERS.filter(c => c.section === sec);
        const col = SECTION_COLORS[sec] || '#1A2B4A';
        return `<div class="ch-sec-header" style="color:${col}">${sec}</div>` +
          chs.map(c => {
            const done = [...completedTopics].filter(id => id.startsWith('CH' + String(c.id).padStart(2,'0'))).length;
            const allDone = done === c.topics;
            return `<div class="ch-item${activeChapter === c.id ? ' active' : ''}" onclick="openChapter(${c.id})">
              <span class="ch-num">${String(c.id).padStart(2,'0')}</span>
              <span class="ch-name">${san(c.title)}</span>
              ${allDone ? '<span class="ch-done-mark">✓</span>' : `<span class="ch-count">${done}/${c.topics}</span>`}
            </div>`;
          }).join('');
      }).join('')}
    </div>`;
  updateProgressDisplay();
}

function openChapter(chId) {
  activeChapter = chId;
  const ch = CHAPTERS.find(c => c.id === chId);
  if (!ch) return;
  // Update sidebar active state
  document.querySelectorAll('.ch-item').forEach(item => {
    const onclick = item.getAttribute('onclick') || '';
    const m = onclick.match(/openChapter\((\d+)\)/);
    item.classList.toggle('active', m && +m[1] === chId);
  });
  topicPH().classList.add('hidden');
  topicCont().classList.remove('hidden');
  const topics = SAMPLE_TOPICS[chId] || [];
  const topicRows = topics.length > 0
    ? topics.map((t, i) => {
        const done = completedTopics.has(t.id);
        return `<div class="topic-row${done ? ' done' : ''}" onclick="openTopic(${chId}, ${i})">
          <span class="topic-row-num">${String(i+1).padStart(2,'0')}</span>
          <span class="topic-row-name">${san(t.title)}</span>
          ${done ? '<span class="topic-done-badge">✓</span>' : '<span class="topic-arrow">›</span>'}
        </div>`;
      }).join('')
    : `<div style="padding:20px;text-align:center;font-size:12px;color:var(--g400);line-height:1.7">
        Full content for this chapter loads from Google Sheets in the live app.<br>
        <span style="color:var(--teal)">Chapter ${chId} · ${ch.topics} topics available</span>
      </div>`;
  topicCont().innerHTML = `
    <div class="ch-intro">
      <div class="ch-intro-title">Chapter ${chId}: ${san(ch.title)}</div>
      <div class="ch-intro-sub">${san(ch.section)} · ${ch.topics} topics${topics.length > 0 ? ' · Click any topic to begin' : ''}</div>
      <div class="topics-list">${topicRows}</div>
    </div>`;
}

function openTopic(chId, idx) {
  const topics = SAMPLE_TOPICS[chId] || [];
  const t = topics[idx];
  if (!t) return;
  const total = topics.length;
  topicCont().innerHTML = `
    <div class="topic-card">
      <div class="tc-head">
        <div>
          <div class="tc-chapter">Chapter ${chId} · Topic ${idx+1} of ${total}</div>
          <div class="tc-title">${san(t.title)}</div>
        </div>
        <button class="tc-back" onclick="openChapter(${chId})">← Back</button>
      </div>
      <div class="tc-nutshell">
        <div class="block-label">🌟 In a Nutshell</div>
        <div class="tc-nut-text">${san(t.nutshell)}</div>
        <div class="tc-hinglish">${san(t.hinglish)}</div>
      </div>
      <div class="tc-example">
        <div class="block-label">🏃 Real Life Example</div>
        <div class="tc-example-text">${san(t.example)}</div>
      </div>
      <div class="tc-quiz">
        <div class="block-label">🧠 Brain Tickle</div>
        <div class="quiz-question">${san(t.quiz)}</div>
        <div class="quiz-options" id="qopts-${t.id}">
          ${t.options.map((o, i) => `
            <button class="quiz-opt" onclick="answerQuiz(this, ${i}, ${t.correct}, '${t.id}')">
              ${String.fromCharCode(65+i)}. ${san(o)}
            </button>`).join('')}
        </div>
        <div class="quiz-result" id="qresult-${t.id}"></div>
      </div>
      <div class="tc-nav">
        <button class="tc-nav-btn" onclick="openTopic(${chId}, ${idx-1})" ${idx===0?'disabled':''}>← Prev</button>
        <span class="tc-progress">${idx+1} / ${total}</span>
        <button class="tc-nav-btn primary" onclick="markDone('${t.id}', ${chId}, ${idx}, ${total})">
          ${idx === total-1 ? '✓ Complete' : 'Next →'}
        </button>
      </div>
    </div>`;
}

function answerQuiz(btn, selected, correct, tid) {
  document.querySelectorAll(`#qopts-${tid} .quiz-opt`).forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
  });
  if (selected !== correct) btn.classList.add('wrong');
  const r = document.getElementById('qresult-' + tid);
  const right = selected === correct;
  r.textContent = right ? '🎉 Correct! Well done.' : '❌ Not quite — correct answer is highlighted above.';
  r.className = 'quiz-result show ' + (right ? 'right' : 'wrong-r');
}

function markDone(tid, chId, idx, total) {
  completedTopics.add(tid);
  saveProgress();
  updateProgressDisplay();
  renderChapterList();
  if (idx < total - 1) openTopic(chId, idx + 1);
  else openChapter(chId);
}

// ── LEARN SEARCH ──
document.getElementById('learnSearch').addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  const clearBtn = document.getElementById('learnSearchClear');
  const resultsEl = document.getElementById('srResults');
  const layoutEl  = document.getElementById('learnLayout');
  clearBtn.classList.toggle('hidden', !q);
  if (!q) {
    resultsEl.classList.add('hidden');
    layoutEl.classList.remove('hidden');
    return;
  }
  resultsEl.classList.remove('hidden');
  layoutEl.classList.add('hidden');
  const hits = SEARCH_INDEX.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.chTitle.toLowerCase().includes(q) ||
    (t.nutshell && t.nutshell.toLowerCase().includes(q)) ||
    (t.chSec && t.chSec.toLowerCase().includes(q))
  ).slice(0, 18);
  if (hits.length === 0) {
    resultsEl.innerHTML = `<div class="sr-empty">No results found for "${san(q)}"</div>`;
    return;
  }
  resultsEl.innerHTML = hits.map(r => {
    const action = r.isChapter
      ? `openChapter(${r.chId}); clearLearnSearch()`
      : `openTopic(${r.chId}, ${(SAMPLE_TOPICS[r.chId]||[]).findIndex(t => t.id === r.id)}); clearLearnSearch()`;
    return `<div class="sr-item" onclick="${action}">
      <div class="sr-ch">Chapter ${r.chId} · ${r.chSec}</div>
      <div class="sr-title">${r.isChapter ? '📋 ' + r.chTitle + ' (' + r.n + ' topics)' : '📄 ' + r.title}</div>
    </div>`;
  }).join('');
});

function clearLearnSearch() {
  document.getElementById('learnSearch').value = '';
  document.getElementById('learnSearchClear').classList.add('hidden');
  document.getElementById('srResults').classList.add('hidden');
  document.getElementById('learnLayout').classList.remove('hidden');
}

// ── INIT ──
(function init() {
  // Set news date on load
  const dateEl = document.getElementById('newsDateDisplay');
  if (dateEl) dateEl.textContent = today();
  const tabSub = document.getElementById('newsUpdateTime');
  if (tabSub) tabSub.textContent = `Updated at 7 AM · ${today()}`;
  // Render compare section
  renderPlans();
})();
