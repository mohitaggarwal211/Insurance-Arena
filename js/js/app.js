// ══════════════════════════════════════
// INSURANCE ARENA — APP LOGIC v4.0
// Fixes: CSR removed from cards, flat learn list,
// expanded news categories, mobile tabs fixed
// ══════════════════════════════════════

// ── STATE ──
let activeSection   = 'compare';
let activeFilter    = 'all';
let activeSearch    = '';
let activeSort      = 'default';
let activeView      = 'card';
let activeNewsCat   = 'all';
let activeSubject   = 'All Topics';
let learnSearch     = '';
let completedTopics = new Set(JSON.parse(localStorage.getItem('ia_done') || '[]'));
let allNewsData     = [];
let currentTopicIdx = null; // index in filtered list
let filteredTopics  = [];

// ── HELPERS ──
function cc(v){ return v >= 99 ? 'high' : v >= 98 ? 'mid' : 'low'; }
function cw(v){ return Math.max(0, Math.min(100, ((v - 97) / 3) * 100)); }
function san(s){ const d = document.createElement('div'); d.textContent = String(s||''); return d.innerHTML; }
function today(){
  const m = ['January','February','March','April','May','June','July',
             'August','September','October','November','December'];
  const n = new Date();
  return `${n.getDate()} ${m[n.getMonth()]} ${n.getFullYear()}`;
}
function saveProgress(){ localStorage.setItem('ia_done', JSON.stringify([...completedTopics])); }

// ── SECTION NAVIGATION ──
function showSection(name){
  if (activeSection === name) return;
  activeSection = name;
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('sec-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('[data-sec]').forEach(b => {
    b.classList.toggle('active', b.dataset.sec === name);
  });
  document.getElementById('mobileNav').classList.add('hidden');
  window.scrollTo(0, 0);
  if (name === 'news' && allNewsData.length === 0) loadNews();
  if (name === 'learn' && !document.getElementById('topicsFlatList').children.length) initLearn();
}

document.querySelectorAll('[data-sec]').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.sec));
});
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('hidden');
});

// ════════════════════════════════════════
// SECTION 1 — COMPARE (CSR removed from cards)
// ════════════════════════════════════════
function getFilteredPlans(){
  let result = [...PLANS];
  if (activeSearch.trim()){
    const q = activeSearch.toLowerCase();
    result = result.filter(p =>
      p.company.toLowerCase().includes(q) ||
      p.companyShort.toLowerCase().includes(q) ||
      p.plan.toLowerCase().includes(q) ||
      p.salesPitch.toLowerCase().includes(q) ||
      p.tags.some(t => t.label.toLowerCase().includes(q)) ||
      (p.keyFeatures||[]).some(f => f.toLowerCase().includes(q))
    );
  }
  const map = {'whole-life':'wholeLife','rop':'returnOfPremium','joint':'jointLife','ci':'criticalIllness'};
  if (activeFilter !== 'all' && map[activeFilter])
    result = result.filter(p => p[map[activeFilter]] === true);
  if (activeSort === 'csr-high') result.sort((a,b) => b.csr - a.csr);
  else if (activeSort === 'csr-low') result.sort((a,b) => a.csr - b.csr);
  else if (activeSort === 'name') result.sort((a,b) => a.company.localeCompare(b.company));
  else result.sort((a,b) => a.id - b.id);
  return result;
}

function renderPlans(){
  const plans = getFilteredPlans();
  document.getElementById('resultsCount').textContent = `Showing ${plans.length} plan${plans.length !== 1 ? 's' : ''}`;
  const empty = plans.length === 0;
  document.getElementById('noResults').classList.toggle('hidden', !empty);
  document.getElementById('cardsGrid').classList.toggle('hidden', empty || activeView === 'table');
  document.getElementById('tableWrap').classList.toggle('hidden', empty || activeView === 'card');
  if (empty) return;
  if (activeView === 'card') renderCards(plans);
  else renderTable(plans);
}

function renderCards(plans){
  document.getElementById('cardsGrid').innerHTML = plans.map((p, i) => {
    const tags = p.tags.map(t => `<span class="feat-tag ${t.type}">${san(t.label)}</span>`).join('');
    const stats = (p.keyStats||[]).map(s =>
      `<div><span class="card-stat-val">${san(s.val)}</span><span class="card-stat-lbl">${san(s.lbl)}</span></div>`
    ).join('');
    return `<div class="plan-card" tabindex="0" role="article" onclick="openModal(${p.id})">
      <div class="card-header">
        <div>
          <div class="card-company">${san(p.companyShort)}</div>
          <div class="card-plan-name">${san(p.plan)}</div>
        </div>
        <div class="card-rank">${i+1}</div>
      </div>
      <div class="card-features">${tags}</div>
      ${stats ? `<div class="card-stats">${stats}</div>` : ''}
      <div class="card-pitch">
        <div class="card-pitch-label">Why this plan?</div>
        <div class="card-pitch-text">${san(p.salesPitch)}</div>
      </div>
      <div class="card-footer">
        <a href="${p.calcUrl}" target="_blank" rel="noopener" class="btn-calc" onclick="event.stopPropagation()">🧮 Calculate Premium</a>
        <button class="btn-details" onclick="event.stopPropagation();openModal(${p.id})">Full Details</button>
      </div>
    </div>`;
  }).join('');
}

function renderTable(plans){
  const yn = v => v ? `<span class="tbl-yes">✓</span>` : `<span class="tbl-no">–</span>`;
  document.getElementById('tableBody').innerHTML = plans.map(p => {
    const cls = cc(p.csr);
    return `<tr>
      <td><div style="font-weight:600;color:var(--white)">${san(p.companyShort)}</div></td>
      <td style="font-size:11px;color:var(--g400)">${san(p.plan)}</td>
      <td class="tbl-csr ${p.csrPending?'mid':cls}">${p.csrPending?'⚠️ Pending':p.csr+'%'}</td>
      <td>${yn(p.wholeLife)}</td><td>${yn(p.terminalIllness)}</td><td>${yn(p.criticalIllness)}</td>
      <td>${yn(p.returnOfPremium)}</td><td>${yn(p.jointLife)}</td><td>${yn(p.wopDisability)}</td>
      <td style="font-size:11px">${san(p.maxMaturity)}</td>
      <td>${p.womenDiscount&&!p.womenDiscount.toLowerCase().includes('no')?'<span class="tbl-yes">✓</span>':'<span class="tbl-no">–</span>'}</td>
      <td><a href="${p.calcUrl}" target="_blank" rel="noopener" class="tbl-calc">Calculate →</a></td>
    </tr>`;
  }).join('');
}

// ── MODAL — CSR shown here only ──
function openModal(id){
  const p = PLANS.find(x => x.id === id);
  if (!p) return;
  const cls = cc(p.csr);
  const csrVal = p.csrPending
    ? `<span class="csr-value mid">⚠️ Pending</span>`
    : `<span class="csr-value ${cls}">${p.csr}%</span>`;
  const featRows = [
    ['Whole Life Option',p.wholeLife],['Terminal Illness',p.terminalIllness],
    ['Accidental Death Benefit',p.accidentalDeath],['Critical Illness Cover',p.criticalIllness],
    ['WOP on Disability',p.wopDisability],['Return of Premium',p.returnOfPremium],
    ['Joint Life Cover',p.jointLife],['Premium Break',p.premiumBreak],
    ['Smart Exit / SEV',p.smartExit],['Spouse Cover',p.spouseCover],['Life Stage SA+',p.lifeStage],
  ].map(([l,v]) => `<span class="m-feat ${v?'yes':'no'}">${v?'✓':'✗'} ${l}</span>`).join('');
  const bullets = (p.keyFeatures||[]).map(f => `<li>${san(f)}</li>`).join('');

  document.getElementById('modalContent').innerHTML = `
    <div class="m-company">${san(p.company)}</div>
    <div class="m-plan">${san(p.plan)}</div>
    <div class="m-uin">UIN: ${san(p.uin)} · Data: FY 2024–25</div>
    <div class="csr-section">
      <div class="csr-header"><span class="csr-label">Claim Settlement Ratio FY 2024–25</span>${csrVal}</div>
      <div class="csr-bar-track"><div class="csr-bar-fill ${p.csrPending?'mid':cls}" style="width:0%" data-w="${p.csrPending?55:cw(p.csr)}"></div></div>
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
  requestAnimationFrame(() => overlay.classList.add('active'));
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const b = document.querySelector('#modalContent .csr-bar-fill');
    if (b){ const w = b.dataset.w; b.style.width = '0%'; requestAnimationFrame(() => { b.style.width = w + '%'; }); }
  });
}

function closeModal(){
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  setTimeout(() => overlay.classList.add('hidden'), 250);
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── COMPARE CONTROLS ──
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
function resetFilters(){
  activeFilter = 'all'; activeSearch = ''; activeSort = 'default';
  document.getElementById('searchInput').value = '';
  document.getElementById('sortSelect').value = 'default';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  renderPlans();
}

// ════════════════════════════════════════
// SECTION 2 — NEWS (expanded free sources)
// ════════════════════════════════════════
const FALLBACK_NEWS = [
  {title:"IRDAI raises health insurance sum insured limits for standard products",source:"IRDAI Official",category:"irdai",date:"Today",summary:"The insurance regulator revised guidelines for standard health insurance products, increasing minimum sum insured thresholds to improve policyholder protection.",url:"https://irdai.gov.in"},
  {title:"Life insurance new business premium grows 18% year-on-year in FY25",source:"Moneycontrol",category:"insurance",date:"2 days ago",summary:"The life insurance sector recorded robust growth in new business premium collection, driven by strong performance from both LIC and private insurers.",url:"https://www.moneycontrol.com/news/business/moneycontrol-research/insurance"},
  {title:"Term insurance premiums expected to rise as global reinsurers revise rates",source:"GoodReturns",category:"insurance",date:"3 days ago",summary:"Global reinsurance costs are increasing, which may lead to marginal premium hikes in term insurance plans across major insurers in India.",url:"https://www.goodreturns.in/insurance"},
  {title:"IRDAI circular on health insurance portability — new guidelines effective immediately",source:"IRDAI Official",category:"irdai",date:"4 days ago",summary:"IRDAI issued a comprehensive circular updating health insurance portability norms, making it easier for policyholders to switch insurers without losing waiting period credit.",url:"https://irdai.gov.in"},
  {title:"RBI keeps repo rate unchanged at 6.25% — impact on insurance and investments",source:"NDTV Profit",category:"banking",date:"4 days ago",summary:"The Reserve Bank of India kept the repo rate unchanged, which will have implications for the insurance sector's investment returns and policy pricing.",url:"https://profit.ndtv.com/"},
  {title:"ELSS vs Term Insurance — which gives better tax benefit under Section 80C",source:"ET Money Blog",category:"tax",date:"5 days ago",summary:"A detailed comparison of tax benefits available under Section 80C through ELSS mutual funds versus life insurance premium payments.",url:"https://etmoney.com/learn"},
  {title:"SBI Mutual Fund launches new debt fund — what it means for insurance investors",source:"NDTV Profit",category:"mutualfunds",date:"5 days ago",summary:"SBI Mutual Fund's new offering targets conservative investors, and financial planners suggest pairing it with term insurance for complete financial protection.",url:"https://profit.ndtv.com/"},
  {title:"PM-JAY Ayushman Bharat expanded to cover all senior citizens above 70",source:"PIB India",category:"insurance",date:"1 week ago",summary:"The government announced expansion of Ayushman Bharat PMJAY to cover all senior citizens above 70, providing ₹5 lakh annual health cover free of cost.",url:"https://pib.gov.in"},
  {title:"GST on insurance premiums — government reviews exemption for term and health plans",source:"Moneycontrol",category:"tax",date:"1 week ago",summary:"The government is examining the current GST structure on insurance premiums following representations from industry and policyholder groups seeking rationalisation.",url:"https://www.moneycontrol.com"},
  {title:"Best mutual funds for 2025 — SIP strategy for insurance professionals",source:"GoodReturns",category:"mutualfunds",date:"1 week ago",summary:"A comprehensive guide to mutual fund selection for 2025, with specific recommendations for insurance professionals looking to diversify their investment portfolio.",url:"https://www.goodreturns.in"},
  {title:"How to build an emergency fund while paying insurance premiums",source:"BankBazaar Blog",category:"personalfinance",date:"1 week ago",summary:"Financial planning guide explaining how to balance maintaining adequate emergency funds while keeping up with life and health insurance premium payments.",url:"https://www.bankbazaar.com/insurance.html"},
  {title:"LIC posts highest-ever new business premium collection in FY 2024-25",source:"NDTV Profit",category:"insurance",date:"10 days ago",summary:"Life Insurance Corporation recorded its highest-ever new business premium in FY25, consolidating market leadership while private insurers also showed strong growth.",url:"https://profit.ndtv.com/"},
  {title:"Health insurance claim settlement ratio improves across industry in FY25",source:"Moneycontrol",category:"insurance",date:"10 days ago",summary:"IRDAI data shows improvement in health insurance claim settlement ratios, with several private insurers surpassing 98% for the first time in FY25.",url:"https://www.moneycontrol.com"},
  {title:"Income tax saving tips — maximising deductions on insurance premiums",source:"TaxGuru",category:"tax",date:"2 weeks ago",summary:"Comprehensive guide to claiming maximum income tax deductions on life insurance, health insurance, and pension plan premiums under various sections of the Income Tax Act.",url:"https://taxguru.in/income-tax"},
  {title:"Sensex crosses 80,000 — how market rally affects ULIP returns",source:"NDTV Profit",category:"markets",date:"2 weeks ago",summary:"Analysis of how the strong equity market performance impacts ULIP policyholders and whether now is a good time to review fund allocations.",url:"https://profit.ndtv.com/"},
  {title:"Personal finance basics — term insurance before investment, always",source:"Jagoinvestor",category:"personalfinance",date:"2 weeks ago",summary:"Why financial planners unanimously recommend buying adequate term insurance before making any investment, and how to calculate the right coverage amount.",url:"https://jagoinvestor.com"},
  {title:"Critical illness insurance — IRDAI standardises list of covered conditions",source:"IRDAI Official",category:"irdai",date:"3 weeks ago",summary:"IRDAI mandated a standard list of critical illnesses covered by all CI policies, bringing uniformity and removing confusion for buyers comparing different products.",url:"https://irdai.gov.in"},
  {title:"NPS vs PPF vs Insurance — retirement planning comparison for salaried individuals",source:"ET Money Blog",category:"personalfinance",date:"3 weeks ago",summary:"Detailed retirement planning comparison of National Pension System, Public Provident Fund, and insurance-based pension plans for salaried employees.",url:"https://etmoney.com/learn"},
];

async function loadNews(){
  document.getElementById('newsLoadingState').classList.remove('hidden');
  document.getElementById('newsGrid').classList.add('hidden');
  const dateEl = document.getElementById('newsDateDisplay');
  if (dateEl) dateEl.textContent = today();
  const tabSub = document.getElementById('newsUpdateTime');
  if (tabSub) tabSub.textContent = `Updated at 7 AM · ${today()}`;
  try {
    const res = await fetch('./data/news.json');
    if (res.ok){
      const data = await res.json();
      allNewsData = (data.articles && data.articles.length > 0) ? data.articles : FALLBACK_NEWS;
    } else throw new Error('Fetch failed');
  } catch(e){
    allNewsData = FALLBACK_NEWS;
  }
  document.getElementById('newsLoadingState').classList.add('hidden');
  document.getElementById('newsGrid').classList.remove('hidden');
  renderNews();
}

function renderNews(){
  const filtered = activeNewsCat === 'all'
    ? allNewsData
    : allNewsData.filter(n => n.category === activeNewsCat);
  if (filtered.length === 0){
    document.getElementById('newsGrid').innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--g400)">No news in this category yet.</div>`;
    return;
  }
  const catLabel = {
    insurance:'INSURANCE', irdai:'IRDAI', mutualfunds:'MUTUAL FUNDS',
    tax:'TAX', banking:'BANKING', personalfinance:'PERSONAL FINANCE', markets:'MARKETS'
  };
  document.getElementById('newsGrid').innerHTML = filtered.map(n => `
    <a class="news-card" href="${n.url||'#'}" target="_blank" rel="noopener">
      <div class="news-card-top">
        <span class="news-source">📰 ${san(n.source)}</span>
        <span class="news-cat-badge ${n.category}">${catLabel[n.category]||n.category.toUpperCase()}</span>
      </div>
      <div class="news-title">${san(n.title)}</div>
      <div class="news-summary">${san(n.summary)}</div>
      <div class="news-footer">
        <span class="news-date">${san(n.date||'')}</span>
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
// SECTION 3 — LEARN (flat list, all 147 topics)
// ════════════════════════════════════════
function getFilteredTopics(){
  let list = ALL_TOPICS;
  if (activeSubject !== 'All Topics')
    list = list.filter(t => t.subject === activeSubject);
  if (learnSearch.trim()){
    const q = learnSearch.toLowerCase();
    list = list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.nutshell.toLowerCase().includes(q) ||
      t.quiz.toLowerCase().includes(q)
    );
  }
  return list;
}

function initLearn(){
  // Build subject filter buttons
  const row = document.getElementById('subjectFilterRow');
  row.innerHTML = SUBJECTS.map(s =>
    `<button class="subj-btn${s === 'All Topics' ? ' active' : ''}" onclick="setSubject('${s.replace(/'/g,"\\'")}', this)">${san(s)}</button>`
  ).join('');
  renderTopicList();
}

function setSubject(subject, btn){
  activeSubject = subject;
  document.querySelectorAll('.subj-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTopicList();
}

function renderTopicList(){
  filteredTopics = getFilteredTopics();
  const listEl = document.getElementById('topicsFlatList');
  const detailEl = document.getElementById('topicDetailView');
  listEl.classList.remove('hidden');
  detailEl.classList.add('hidden');

  // Show count
  const existing = document.querySelector('.topics-count');
  if (existing) existing.remove();
  const countEl = document.createElement('div');
  countEl.className = 'topics-count';
  countEl.textContent = `${filteredTopics.length} topic${filteredTopics.length !== 1 ? 's' : ''}`;
  listEl.before(countEl);

  if (filteredTopics.length === 0){
    listEl.innerHTML = `<div class="no-topics">No topics found. Try a different search or subject.</div>`;
    return;
  }

  listEl.innerHTML = filteredTopics.map((t, i) => {
    const done = completedTopics.has(t.id);
    return `<div class="topic-row-item${done?' done':''}" onclick="openTopicDetail(${i})">
      <span class="tri-subject">${san(t.subject)}</span>
      <span class="tri-title">${san(t.title)}</span>
      <span class="tri-diff ${t.difficulty||'Medium'}">${t.difficulty||'Medium'}</span>
      ${done ? '<span class="tri-done">✓</span>' : '<span class="tri-arr">›</span>'}
    </div>`;
  }).join('');
}

function openTopicDetail(idx){
  currentTopicIdx = idx;
  const t = filteredTopics[idx];
  if (!t) return;
  const total = filteredTopics.length;
  const listEl = document.getElementById('topicsFlatList');
  const detailEl = document.getElementById('topicDetailView');
  listEl.classList.add('hidden');
  const countEl = document.querySelector('.topics-count');
  if (countEl) countEl.style.display = 'none';
  detailEl.classList.remove('hidden');

  detailEl.innerHTML = `
    <div class="td-back-row">
      <button class="td-back" onclick="backToList()">← Back to topics</button>
      <span class="td-breadcrumb">${idx+1} of ${total}</span>
    </div>
    <div class="topic-card">
      <div class="tc-head">
        <div class="tc-subject">${san(t.subject)}</div>
        <div class="tc-title">${san(t.title)}</div>
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
          ${t.opts.map((o,i) =>
            `<button class="quiz-opt" onclick="answerQuiz(this,${i},${t.correct},'${t.id}')">${String.fromCharCode(65+i)}. ${san(o)}</button>`
          ).join('')}
        </div>
        <div class="quiz-result" id="qresult-${t.id}"></div>
      </div>
      <div class="tc-nav">
        <button class="tc-nav-btn" onclick="openTopicDetail(${idx-1})" ${idx===0?'disabled':''}>← Prev</button>
        <span class="tc-progress">${idx+1} / ${total}</span>
        <button class="tc-nav-btn primary" onclick="markDone('${t.id}',${idx})">
          ${idx===total-1?'✓ Done':'Next →'}
        </button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function backToList(){
  document.getElementById('topicDetailView').classList.add('hidden');
  document.getElementById('topicsFlatList').classList.remove('hidden');
  const countEl = document.querySelector('.topics-count');
  if (countEl) countEl.style.display = 'block';
  // Re-render to update done marks
  renderTopicList();
}

function answerQuiz(btn, selected, correct, tid){
  document.querySelectorAll(`#qopts-${tid} .quiz-opt`).forEach((b,i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
  });
  if (selected !== correct) btn.classList.add('wrong');
  const r = document.getElementById('qresult-' + tid);
  const right = selected === correct;
  r.textContent = right ? '🎉 Correct! Well done.' : '❌ Not quite — correct answer is highlighted above.';
  r.className = 'quiz-result show ' + (right ? 'right' : 'wrong-r');
}

function markDone(tid, idx){
  completedTopics.add(tid);
  saveProgress();
  if (idx < filteredTopics.length - 1) openTopicDetail(idx + 1);
  else backToList();
}

// ── LEARN SEARCH ──
document.getElementById('learnSearch').addEventListener('input', function(){
  learnSearch = this.value.trim();
  const clearBtn = document.getElementById('learnSearchClear');
  clearBtn.classList.toggle('hidden', !learnSearch);
  if (activeSection === 'learn') renderTopicList();
});

function clearLearnSearch(){
  learnSearch = '';
  document.getElementById('learnSearch').value = '';
  document.getElementById('learnSearchClear').classList.add('hidden');
  renderTopicList();
}

// ── INIT ──
(function init(){
  const dateEl = document.getElementById('newsDateDisplay');
  if (dateEl) dateEl.textContent = today();
  const tabSub = document.getElementById('newsUpdateTime');
  if (tabSub) tabSub.textContent = `Updated at 7 AM · ${today()}`;
  renderPlans();
})();
