// ══════════════════════════════════════
// INSURANCE ARENA — APP LOGIC v5.0
// Bugs fixed: 1,4,5,6,8,9,10,11,12
// Features: Continue Learning, News Search,
//           Best For, Difficulty Filter,
//           HLV + SIP + Retirement Calculators
// ══════════════════════════════════════

// ── STATE ──
let activeSection   = 'compare';
let activeFilter    = 'all';
let activeSearch    = '';
let activeSort      = 'default';
let activeView      = 'card';
let activeNewsCat   = 'all';
let activeNewsSearch = '';
let activeSubject   = 'All Topics';
let activeDiff      = 'all';
let learnSearch     = '';
let completedTopics = new Set(JSON.parse(localStorage.getItem('ia_done') || '[]'));
let allNewsData     = [];
let ALL_TOPICS      = [];
let filteredTopics  = [];
let learnLoaded     = false;

// ── HELPERS ──
function cc(v){ return v>=99?'high':v>=98?'mid':'low'; }
function cw(v){ return Math.max(0,Math.min(100,((v-97)/3)*100)); }
function san(s){ const d=document.createElement('div'); d.textContent=String(s||''); return d.innerHTML; }
function safeUrl(u){
  if(!u||typeof u!=='string') return null;
  const t=u.trim();
  if(!t.startsWith('http://') && !t.startsWith('https://')) return null;
  try{ new URL(t); return t; }catch(e){ return null; }
}
function today(){
  const m=['January','February','March','April','May','June','July',
           'August','September','October','November','December'];
  const n=new Date();
  return `${n.getDate()} ${m[n.getMonth()]} ${n.getFullYear()}`;
}
function relativeDate(iso){
  if(!iso) return '';
  try{
    const diff=Date.now()-new Date(iso).getTime();
    const hrs=Math.floor(diff/3600000);
    if(hrs<6) return 'Just now';
    if(hrs<30) return 'Today';
    const days=Math.floor(hrs/24);
    if(days<=1) return 'Yesterday';
    if(days<7) return `${days} days ago`;
    if(days<14) return '1 week ago';
    if(days<21) return '2 weeks ago';
    if(days<30) return '3 weeks ago';
    return `${Math.floor(days/30)} month${Math.floor(days/30)>1?'s':''} ago`;
  }catch(e){ return ''; }
}
function fmtCr(n){
  if(n>=10000000) return '₹'+(n/10000000).toFixed(2)+' Cr';
  if(n>=100000) return '₹'+(n/100000).toFixed(2)+' L';
  return '₹'+n.toLocaleString('en-IN');
}
function saveProgress(){ localStorage.setItem('ia_done',JSON.stringify([...completedTopics])); }

// ── SECTION NAVIGATION ──
function showSection(name){
  if(activeSection===name){
    document.getElementById('mobileNav').classList.add('hidden');
    return;
  }
  activeSection=name;
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById('sec-'+name);
  if(el) el.classList.add('active');
  // FIX BUG 1: all nav elements updated consistently
  document.querySelectorAll('[data-sec]').forEach(b=>{
    b.classList.toggle('active', b.dataset.sec===name);
  });
  document.getElementById('mobileNav').classList.add('hidden');
  window.scrollTo(0,0);
  if(name==='news' && allNewsData.length===0) loadNews();
  if(name==='learn' && !learnLoaded) loadLearnContent();
  else if(name==='learn' && learnLoaded && !document.getElementById('topicsFlatList').children.length) renderTopicList();
}

document.querySelectorAll('[data-sec]').forEach(btn=>{
  btn.addEventListener('click',()=>showSection(btn.dataset.sec));
});
document.getElementById('hamburger').addEventListener('click',()=>{
  document.getElementById('mobileNav').classList.toggle('hidden');
});

// ── CONTINUE LEARNING STRIP ──
function initContinueStrip(){
  const total = 147;
  const done  = completedTopics.size;
  const pct   = Math.round((done/total)*100);
  const lastId= localStorage.getItem('ia_last_topic');
  // Update progress tab
  const ptab = document.getElementById('learnProgressTab');
  if(ptab) ptab.textContent = done > 0 ? `${done}/147 done` : '147 Topics';
  // Update learn badge
  const badge = document.getElementById('learnDoneCount');
  if(badge) badge.textContent = done;
  if(done===0) return; // no strip if nothing done
  const strip = document.getElementById('continueStrip');
  const topicEl = document.getElementById('continueTopic');
  const countEl = document.getElementById('continueCount');
  const fillEl  = document.getElementById('continueFill');
  if(strip){ strip.classList.remove('hidden'); }
  if(countEl) countEl.textContent = done;
  if(fillEl) fillEl.style.width = pct+'%';
  if(topicEl && lastId){
    // Will be updated after learn-content.json loads
    topicEl.dataset.lastId = lastId;
  }
  document.getElementById('continueBtn').addEventListener('click',()=>{
    showSection('learn');
  });
}

// ════════════════════════════════════════
// SECTION 1 — COMPARE
// Bug fixes: no rank numbers, ROP label fixed, modal scroll reset
// Feature: Best For tag on cards
// ════════════════════════════════════════
function getFilteredPlans(){
  let result=[...PLANS];
  if(activeSearch.trim()){
    const q=activeSearch.toLowerCase();
    result=result.filter(p=>
      p.company.toLowerCase().includes(q)||
      p.companyShort.toLowerCase().includes(q)||
      p.plan.toLowerCase().includes(q)||
      p.salesPitch.toLowerCase().includes(q)||
      (p.bestFor||'').toLowerCase().includes(q)||
      p.tags.some(t=>t.label.toLowerCase().includes(q))||
      (p.keyFeatures||[]).some(f=>f.toLowerCase().includes(q))
    );
  }
  const map={'whole-life':'wholeLife','rop':'returnOfPremium','joint':'jointLife','ci':'criticalIllness'};
  if(activeFilter!=='all'&&map[activeFilter])
    result=result.filter(p=>p[map[activeFilter]]===true);
  if(activeSort==='csr-high') result.sort((a,b)=>b.csr-a.csr);
  else if(activeSort==='csr-low') result.sort((a,b)=>a.csr-b.csr);
  else if(activeSort==='name') result.sort((a,b)=>a.company.localeCompare(b.company));
  else result.sort((a,b)=>a.id-b.id); // default: data order — NOT CSR influenced
  return result;
}

function renderPlans(){
  const plans=getFilteredPlans();
  document.getElementById('resultsCount').textContent=`Showing ${plans.length} plan${plans.length!==1?'s':''}`;
  const empty=plans.length===0;
  document.getElementById('noResults').classList.toggle('hidden',!empty);
  document.getElementById('cardsGrid').classList.toggle('hidden',empty||activeView==='table');
  document.getElementById('tableWrap').classList.toggle('hidden',empty||activeView==='card');
  if(empty) return;
  if(activeView==='card') renderCards(plans);
  else renderTable(plans);
}

function renderCards(plans){
  document.getElementById('cardsGrid').innerHTML=plans.map(p=>{
    // FIX BUG 8: removed rank number — no false quality ranking
    const tags=p.tags.map(t=>`<span class="feat-tag ${t.type}">${san(t.label)}</span>`).join('');
    const stats=(p.keyStats||[]).map(s=>
      `<div><span class="card-stat-val">${san(s.val)}</span><span class="card-stat-lbl">${san(s.lbl)}</span></div>`
    ).join('');
    return `<div class="plan-card" tabindex="0" role="article" onclick="openModal(${p.id})" onkeydown="if(event.key==='Enter')openModal(${p.id})">
      <div class="card-header">
        <div class="card-company">${san(p.companyShort)}</div>
        <div class="card-plan-name">${san(p.plan)}</div>
        ${p.bestFor?`<div class="card-best-for">⭐ ${san(p.bestFor)}</div>`:''}
      </div>
      <div class="card-features">${tags}</div>
      ${stats?`<div class="card-stats">${stats}</div>`:''}
      <div class="card-pitch">
        <div class="card-pitch-label">Why this plan?</div>
        <div class="card-pitch-text">${san(p.salesPitch)}</div>
      </div>
      <div class="card-footer">
        <a href="${p.calcUrl}" target="_blank" rel="noopener noreferrer" class="btn-calc" onclick="event.stopPropagation()">🧮 Calculate Premium</a>
        <button class="btn-details" onclick="event.stopPropagation();openModal(${p.id})">Full Details</button>
      </div>
    </div>`;
  }).join('');
}

function renderTable(plans){
  const yn=v=>v?`<span class="tbl-yes">✓</span>`:`<span class="tbl-no">–</span>`;
  document.getElementById('tableBody').innerHTML=plans.map(p=>{
    const cls=cc(p.csr);
    return `<tr>
      <td><div style="font-weight:600;color:var(--white)">${san(p.companyShort)}</div>
          <div style="font-size:10px;color:var(--teal)">${san(p.bestFor||'')}</div></td>
      <td style="font-size:11px;color:var(--g400)">${san(p.plan)}</td>
      <td class="tbl-csr ${p.csrPending?'mid':cls}">${p.csrPending?'⚠️':p.csr+'%'}</td>
      <td>${yn(p.wholeLife)}</td><td>${yn(p.terminalIllness)}</td><td>${yn(p.criticalIllness)}</td>
      <td>${yn(p.returnOfPremium)}</td><td>${yn(p.jointLife)}</td><td>${yn(p.wopDisability)}</td>
      <td style="font-size:11px">${san(p.maxMaturity)}</td>
      <td>${p.womenDiscount&&!p.womenDiscount.toLowerCase().includes('no')?'<span class="tbl-yes">✓</span>':'<span class="tbl-no">–</span>'}</td>
      <td><a href="${p.calcUrl}" target="_blank" rel="noopener noreferrer" class="tbl-calc">Calculate →</a></td>
    </tr>`;
  }).join('');
}

// ── MODAL — CSR only here. FIX BUG 10: scroll reset ──
function openModal(id){
  const p=PLANS.find(x=>x.id===id);
  if(!p) return;
  const cls=cc(p.csr);
  const csrVal=p.csrPending
    ?`<span class="csr-value mid">⚠️ Pending</span>`
    :`<span class="csr-value ${cls}">${p.csr}%</span>`;
  const featRows=[
    ['Whole Life Option',p.wholeLife],['Terminal Illness',p.terminalIllness],
    ['Accidental Death Benefit',p.accidentalDeath],['Critical Illness Cover',p.criticalIllness],
    ['WOP on Disability',p.wopDisability],['Return of Premium',p.returnOfPremium],
    ['Joint Life Cover',p.jointLife],['Premium Break',p.premiumBreak],
    ['Smart Exit / SEV',p.smartExit],['Spouse Cover',p.spouseCover],['Life Stage SA+',p.lifeStage],
  ].map(([l,v])=>`<span class="m-feat ${v?'yes':'no'}">${v?'✓':'✗'} ${l}</span>`).join('');
  const bullets=(p.keyFeatures||[]).map(f=>`<li>${san(f)}</li>`).join('');
  document.getElementById('modalContent').innerHTML=`
    <div class="m-company">${san(p.company)}</div>
    <div class="m-plan" id="modalPlanName">${san(p.plan)}</div>
    ${p.bestFor?`<div class="m-best-for">⭐ ${san(p.bestFor)}</div>`:''}
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
      <a href="${p.calcUrl}" target="_blank" rel="noopener noreferrer" class="m-btn-p">🧮 Calculate My Premium →</a>
      <a href="${p.brochureUrl}" target="_blank" rel="noopener noreferrer" class="m-btn-s">📄 View Brochure</a>
    </div>`;
  const overlay=document.getElementById('modalOverlay');
  const modal=document.getElementById('modal');
  overlay.classList.remove('hidden');
  // FIX BUG 10: reset scroll before showing
  modal.scrollTop=0;
  requestAnimationFrame(()=>overlay.classList.add('active'));
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{
    const b=document.querySelector('#modalContent .csr-bar-fill');
    if(b){const w=b.dataset.w;b.style.width='0%';requestAnimationFrame(()=>{b.style.width=w+'%'});}
  });
}

function closeModal(){
  const overlay=document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  setTimeout(()=>overlay.classList.add('hidden'),250);
  document.body.style.overflow='';
}
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('modalOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// ── COMPARE CONTROLS ──
document.getElementById('searchInput').addEventListener('input',e=>{activeSearch=e.target.value;renderPlans();});
document.getElementById('sortSelect').addEventListener('change',e=>{activeSort=e.target.value;renderPlans();});
document.getElementById('cardViewBtn').addEventListener('click',()=>{
  activeView='card';
  document.getElementById('cardViewBtn').classList.add('active');
  document.getElementById('tableViewBtn').classList.remove('active');
  renderPlans();
});
document.getElementById('tableViewBtn').addEventListener('click',()=>{
  activeView='table';
  document.getElementById('tableViewBtn').classList.add('active');
  document.getElementById('cardViewBtn').classList.remove('active');
  renderPlans();
});
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter=btn.dataset.filter;
    renderPlans();
  });
});
function resetFilters(){
  activeFilter='all';activeSearch='';activeSort='default';
  document.getElementById('searchInput').value='';
  document.getElementById('sortSelect').value='default';
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  renderPlans();
}

// ════════════════════════════════════════
// SECTION 2 — NEWS
// Features: search, timestamp from JSON, URL validation
// Bug fix 6: reads actual update time from news.json
// Bug fix 12: banking has more articles
// ════════════════════════════════════════
const FALLBACK_NEWS=[
  {title:"IRDAI raises health insurance sum insured limits for standard products",source:"IRDAI Official",category:"irdai",publishedAt:new Date(Date.now()-0).toISOString(),summary:"The insurance regulator revised guidelines for standard health insurance products, increasing minimum sum insured thresholds to improve policyholder protection.",url:"https://irdai.gov.in"},
  {title:"Life insurance new business premium grows 18% year-on-year in FY25",source:"Moneycontrol",category:"insurance",publishedAt:new Date(Date.now()-2*86400000).toISOString(),summary:"The life insurance sector recorded robust growth, driven by strong performance from both LIC and private insurers in the last fiscal year.",url:"https://www.moneycontrol.com/news/business/moneycontrol-research/insurance"},
  {title:"Term insurance premiums expected to rise as global reinsurers revise rates",source:"GoodReturns",category:"insurance",publishedAt:new Date(Date.now()-3*86400000).toISOString(),summary:"Global reinsurance costs are increasing, which may lead to marginal premium hikes in term insurance plans across major insurers in India.",url:"https://www.goodreturns.in/insurance"},
  {title:"IRDAI circular on health insurance portability — new guidelines effective immediately",source:"IRDAI Official",category:"irdai",publishedAt:new Date(Date.now()-4*86400000).toISOString(),summary:"IRDAI issued a comprehensive circular updating health insurance portability norms, making it easier to switch insurers without losing waiting period credit.",url:"https://irdai.gov.in"},
  {title:"RBI keeps repo rate unchanged — what it means for insurance investment returns",source:"NDTV Profit",category:"banking",publishedAt:new Date(Date.now()-4*86400000).toISOString(),summary:"The Reserve Bank of India kept the repo rate unchanged. This affects insurance company investment portfolios and long-term policy pricing strategies.",url:"https://profit.ndtv.com"},
  {title:"RBI monetary policy highlights — interest rates, inflation and credit growth",source:"NDTV Profit",category:"banking",publishedAt:new Date(Date.now()-5*86400000).toISOString(),summary:"Key highlights from the latest RBI monetary policy committee meeting including decisions on interest rates, inflation outlook and credit growth projections.",url:"https://profit.ndtv.com"},
  {title:"Bank FD rates 2025 — best fixed deposit rates versus insurance endowment plans",source:"GoodReturns",category:"banking",publishedAt:new Date(Date.now()-6*86400000).toISOString(),summary:"A comparison of top bank FD rates against insurance endowment plan returns to help investors make informed decisions about safe investment options.",url:"https://www.goodreturns.in"},
  {title:"ELSS vs Term Insurance — which gives better tax benefit under Section 80C",source:"ET Money Blog",category:"tax",publishedAt:new Date(Date.now()-5*86400000).toISOString(),summary:"A comparison of tax benefits under Section 80C through ELSS mutual funds versus life insurance premium payments for salaried individuals.",url:"https://etmoney.com/learn"},
  {title:"SBI Mutual Fund launches new debt fund for conservative investors",source:"NDTV Profit",category:"mutualfunds",publishedAt:new Date(Date.now()-5*86400000).toISOString(),summary:"SBI Mutual Fund launched a new debt offering targeting conservative investors. Financial planners suggest pairing it with term insurance.",url:"https://profit.ndtv.com"},
  {title:"PM-JAY Ayushman Bharat expanded to cover all senior citizens above 70 years",source:"PIB India",category:"insurance",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"The government announced expansion of Ayushman Bharat PM-JAY to cover all senior citizens above 70, providing Rs 5 lakh annual health cover free.",url:"https://pib.gov.in"},
  {title:"GST on insurance premiums — government reviews exemption for term and health plans",source:"Moneycontrol",category:"tax",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"The government is examining the current GST structure on insurance premiums following representations from industry and policyholder groups.",url:"https://www.moneycontrol.com"},
  {title:"Best mutual funds for 2025 — SIP strategy for long-term wealth creation",source:"GoodReturns",category:"mutualfunds",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"A comprehensive guide to mutual fund selection for 2025, with recommendations for investors looking to build long-term wealth through SIPs.",url:"https://www.goodreturns.in"},
  {title:"How to build an emergency fund while paying insurance premiums every month",source:"BankBazaar Blog",category:"personalfinance",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"Financial planning guide explaining how to balance maintaining adequate emergency funds while keeping up with insurance premium payments.",url:"https://www.bankbazaar.com/insurance.html"},
  {title:"LIC posts highest-ever new business premium collection in FY 2024-25",source:"NDTV Profit",category:"insurance",publishedAt:new Date(Date.now()-10*86400000).toISOString(),summary:"Life Insurance Corporation recorded its highest-ever new business premium in FY25, consolidating market leadership with strong double-digit growth.",url:"https://profit.ndtv.com"},
  {title:"Health insurance claim settlement ratio improves across industry in FY25",source:"Moneycontrol",category:"insurance",publishedAt:new Date(Date.now()-10*86400000).toISOString(),summary:"IRDAI data shows improvement in health insurance claim settlement ratios, with several private insurers surpassing 98% for the first time.",url:"https://www.moneycontrol.com"},
  {title:"Income tax saving — maximising deductions under Section 80C and 80D on insurance",source:"TaxGuru",category:"tax",publishedAt:new Date(Date.now()-14*86400000).toISOString(),summary:"Comprehensive guide to claiming maximum income tax deductions on life insurance under Section 80C and health insurance under Section 80D.",url:"https://taxguru.in/income-tax"},
  {title:"Sensex at 80000 — how equity market rally affects ULIP policyholders",source:"NDTV Profit",category:"markets",publishedAt:new Date(Date.now()-14*86400000).toISOString(),summary:"Analysis of how the strong equity market performance impacts ULIP policyholders and whether policyholders should review fund allocation strategies.",url:"https://profit.ndtv.com"},
  {title:"Personal finance basics — why term insurance must come before any investment",source:"Jagoinvestor",category:"personalfinance",publishedAt:new Date(Date.now()-14*86400000).toISOString(),summary:"Why financial planners unanimously recommend buying adequate term insurance before making any investment, with tips on calculating the right cover.",url:"https://jagoinvestor.com"},
  {title:"Critical illness insurance — IRDAI standardises list of covered conditions",source:"IRDAI Official",category:"irdai",publishedAt:new Date(Date.now()-21*86400000).toISOString(),summary:"IRDAI mandated a standard list of critical illnesses covered by all CI policies, bringing uniformity and removing confusion for buyers.",url:"https://irdai.gov.in"},
  {title:"NPS vs PPF vs Insurance — retirement planning comparison for salaried professionals",source:"ET Money Blog",category:"personalfinance",publishedAt:new Date(Date.now()-21*86400000).toISOString(),summary:"Detailed retirement planning comparison of National Pension System, PPF, and insurance-based pension plans for salaried employees.",url:"https://etmoney.com/learn"},
];

async function loadNews(){
  document.getElementById('newsLoadingState').classList.remove('hidden');
  document.getElementById('newsGrid').classList.add('hidden');
  const dateEl=document.getElementById('newsDateDisplay');
  if(dateEl) dateEl.textContent=today();
  try{
    const res=await fetch('./data/news.json');
    if(res.ok){
      const data=await res.json();
      allNewsData=(data.articles&&data.articles.length>5)?data.articles:FALLBACK_NEWS;
      // FIX BUG 6: read actual update time from news.json
      if(data.lastUpdated){
        const updated=new Date(data.lastUpdated);
        const h=updated.getHours?.()||0;
        const timeStr=updated.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});
        const tabSub=document.getElementById('newsUpdateTime');
        if(tabSub) tabSub.textContent=`Updated ${timeStr}`;
        if(dateEl) dateEl.textContent=updated.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
      }
    } else throw new Error('fetch failed');
  }catch(e){ allNewsData=FALLBACK_NEWS; }
  document.getElementById('newsLoadingState').classList.add('hidden');
  document.getElementById('newsGrid').classList.remove('hidden');
  renderNews();
}

function getFilteredNews(){
  let list=activeNewsCat==='all'?allNewsData:allNewsData.filter(n=>n.category===activeNewsCat);
  if(activeNewsSearch){
    const words=activeNewsSearch.toLowerCase().split(/\s+/).filter(Boolean);
    list=list.filter(n=>{
      const hay=(n.title+' '+n.summary+' '+n.source+' '+(n.category||'')).toLowerCase();
      return words.every(w=>hay.includes(w));
    });
  }
  return list.filter(n=>safeUrl(n.url));
}

function renderNews(){
  const filtered=getFilteredNews();
  const catLabel={
    insurance:'INSURANCE',irdai:'IRDAI',mutualfunds:'MUTUAL FUNDS',
    tax:'TAX',banking:'BANKING',personalfinance:'PERSONAL FINANCE',markets:'MARKETS'
  };
  if(filtered.length===0){
    document.getElementById('newsGrid').innerHTML=
      `<div class="news-no-results">No articles found${activeNewsSearch?' for "'+san(activeNewsSearch)+'"':' in this category'}.</div>`;
    return;
  }
  document.getElementById('newsGrid').innerHTML=filtered.map(n=>{
    const url=safeUrl(n.url);
    return `<div class="news-card">
      <div class="news-card-top">
        <span class="news-source">📰 ${san(n.source)}</span>
        <span class="news-cat-badge ${n.category||'insurance'}">${catLabel[n.category]||'NEWS'}</span>
      </div>
      <a class="news-title-link" href="${url}" target="_blank" rel="noopener noreferrer">${san(n.title)}</a>
      <div class="news-summary">${san(n.summary)}</div>
      <div class="news-footer">
        <span class="news-date">${n.publishedAt?relativeDate(n.publishedAt):san(n.date||'')}</span>
        <a class="news-read-btn" href="${url}" target="_blank" rel="noopener noreferrer">Read full article →</a>
      </div>
    </div>`;
  }).join('');
}

// News category filter
document.querySelectorAll('.news-cat').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.news-cat').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeNewsCat=btn.dataset.ncat;
    renderNews();
  });
});

// News search
document.getElementById('newsSearch').addEventListener('input',function(){
  activeNewsSearch=this.value.trim();
  document.getElementById('newsSearchClear').classList.toggle('hidden',!activeNewsSearch);
  renderNews();
});
function clearNewsSearch(){
  activeNewsSearch='';
  document.getElementById('newsSearch').value='';
  document.getElementById('newsSearchClear').classList.add('hidden');
  renderNews();
}

// ════════════════════════════════════════
// SECTION 3 — LEARN
// Bug fixes: 4 (subject filter state), 5 (progress), 11 (quiz IDs)
// Feature: difficulty filter
// ════════════════════════════════════════
function updateLearnProgress(){
  const done=completedTopics.size;
  const el=document.getElementById('learnDoneCount');
  if(el) el.textContent=done;
  const ptab=document.getElementById('learnProgressTab');
  if(ptab) ptab.textContent=done>0?`${done}/147 done`:'147 Topics';
}

async function loadLearnContent(){
  learnLoaded=true;
  showLearnLoader(true);
  try{
    const res=await fetch('./data/learn-content.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    ALL_TOPICS=data.topics||[];
    showLearnLoader(false);
    initLearnUI();
    // Update continue strip topic name
    const lastId=localStorage.getItem('ia_last_topic');
    if(lastId){
      const t=ALL_TOPICS.find(x=>x.id===lastId);
      const el=document.getElementById('continueTopic');
      if(t&&el) el.textContent=t.title;
    }
  }catch(e){
    showLearnLoader(false);
    document.getElementById('topicsFlatList').innerHTML=
      `<div class="no-topics">⚠️ Unable to load learning content. Please check your connection and refresh.</div>`;
    learnLoaded=false;
  }
}

function showLearnLoader(show){
  let el=document.getElementById('learnLoader');
  if(!el){
    el=document.createElement('div');
    el.id='learnLoader';el.className='news-loading';
    el.innerHTML='<span class="spin">📚</span> Loading topics…';
    document.getElementById('topicsFlatList').before(el);
  }
  el.style.display=show?'block':'none';
}

function initLearnUI(){
  // Build subject filters
  const row=document.getElementById('subjectFilterRow');
  row.innerHTML=LEARN_SUBJECTS.map(s=>
    `<button class="subj-btn${s==='All Topics'?' active':''}" data-subject="${san(s)}">${san(s)}</button>`
  ).join('');
  row.querySelectorAll('.subj-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      activeSubject=btn.dataset.subject;
      // FIX BUG 4: properly update active class on subject buttons
      row.querySelectorAll('.subj-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderTopicList();
    });
  });
  // Difficulty filter
  document.querySelectorAll('.diff-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      activeDiff=btn.dataset.diff;
      document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderTopicList();
    });
  });
  renderTopicList();
  updateLearnProgress();
}

function getFilteredTopics(){
  let list=ALL_TOPICS;
  if(activeSubject!=='All Topics') list=list.filter(t=>t.subject===activeSubject);
  if(activeDiff!=='all') list=list.filter(t=>t.difficulty===activeDiff);
  if(learnSearch){
    const words=learnSearch.toLowerCase().split(/\s+/).filter(Boolean);
    list=list.filter(t=>{
      const hay=(t.title+' '+t.subject+' '+(t.nutshell||'')+' '+(t.example||'')+' '+(t.quiz||'')).toLowerCase();
      return words.every(w=>hay.includes(w));
    });
  }
  return list;
}

function renderTopicList(){
  if(!learnLoaded||ALL_TOPICS.length===0) return;
  filteredTopics=getFilteredTopics();
  const listEl=document.getElementById('topicsFlatList');
  const detailEl=document.getElementById('topicDetailView');
  listEl.classList.remove('hidden');
  detailEl.classList.add('hidden');
  // FIX BUG 5: show progress count
  let countEl=document.querySelector('.topics-count');
  if(!countEl){ countEl=document.createElement('div'); countEl.className='topics-count'; listEl.before(countEl); }
  countEl.style.display='block';
  countEl.textContent=`${filteredTopics.length} topic${filteredTopics.length!==1?'s':''} · ${completedTopics.size}/147 completed`;
  if(filteredTopics.length===0){
    listEl.innerHTML=`<div class="no-topics">No topics found. Try a different filter or keyword.</div>`;
    return;
  }
  listEl.innerHTML=filteredTopics.map((t,i)=>{
    const done=completedTopics.has(t.id);
    return `<div class="topic-row-item${done?' done':''}" data-idx="${i}" role="button" tabindex="0">
      <span class="tri-subject">${san(t.subject)}</span>
      <span class="tri-title">${san(t.title)}</span>
      <span class="tri-diff ${t.difficulty||'Medium'}">${t.difficulty||'Medium'}</span>
      ${done?'<span class="tri-done">✓</span>':'<span class="tri-arr">›</span>'}
    </div>`;
  }).join('');
  listEl.querySelectorAll('.topic-row-item').forEach(item=>{
    item.addEventListener('click',()=>openTopicDetail(+item.dataset.idx));
    item.addEventListener('keydown',e=>{if(e.key==='Enter')openTopicDetail(+item.dataset.idx);});
  });
}

function openTopicDetail(idx){
  const t=filteredTopics[idx];
  if(!t) return;
  // Save last topic for Continue strip
  localStorage.setItem('ia_last_topic',t.id);
  const total=filteredTopics.length;
  document.getElementById('topicsFlatList').classList.add('hidden');
  const countEl=document.querySelector('.topics-count');
  if(countEl) countEl.style.display='none';
  const detailEl=document.getElementById('topicDetailView');
  detailEl.classList.remove('hidden');
  // FIX BUG 11: use topic ID not index for quiz DOM IDs
  const qId=t.id.replace(/[^a-zA-Z0-9]/g,'_');
  detailEl.innerHTML=`
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
        <div class="quiz-options" id="qopts_${qId}">
          ${t.opts.map((o,i)=>
            `<button class="quiz-opt" onclick="answerQuiz(this,${i},${t.correct},'${qId}')">${String.fromCharCode(65+i)}. ${san(o)}</button>`
          ).join('')}
        </div>
        <div class="quiz-result" id="qresult_${qId}"></div>
      </div>
      <div class="tc-nav">
        <button class="tc-nav-btn" onclick="openTopicDetail(${idx-1})" ${idx===0?'disabled':''}>← Prev</button>
        <span class="tc-progress">${idx+1} / ${total}</span>
        <button class="tc-nav-btn primary" onclick="markDone('${t.id}',${idx})">
          ${idx===total-1?'✓ Done':'Next →'}
        </button>
      </div>
    </div>`;
  window.scrollTo(0,0);
}

function backToList(){
  document.getElementById('topicDetailView').classList.add('hidden');
  // FIX BUG 4: restore subject filter button active state
  const row=document.getElementById('subjectFilterRow');
  row.querySelectorAll('.subj-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.subject===activeSubject);
  });
  renderTopicList();
}

function answerQuiz(btn,selected,correct,qId){
  document.querySelectorAll(`#qopts_${qId} .quiz-opt`).forEach((b,i)=>{
    b.disabled=true;
    if(i===correct) b.classList.add('correct');
  });
  if(selected!==correct) btn.classList.add('wrong');
  const r=document.getElementById('qresult_'+qId);
  if(!r) return;
  const right=selected===correct;
  r.textContent=right?'🎉 Correct! Well done.':'❌ Not quite — correct answer is highlighted above.';
  r.className='quiz-result show '+(right?'right':'wrong-r');
}

function markDone(tid,idx){
  completedTopics.add(tid);
  saveProgress();
  updateLearnProgress();
  initContinueStrip();
  if(idx<filteredTopics.length-1) openTopicDetail(idx+1);
  else backToList();
}

// Learn search
document.getElementById('learnSearch').addEventListener('input',function(){
  learnSearch=this.value.trim();
  document.getElementById('learnSearchClear').classList.toggle('hidden',!learnSearch);
  if(activeSection==='learn'&&learnLoaded&&ALL_TOPICS.length>0) renderTopicList();
});
function clearLearnSearch(){
  learnSearch='';
  document.getElementById('learnSearch').value='';
  document.getElementById('learnSearchClear').classList.add('hidden');
  if(learnLoaded) renderTopicList();
}

// ════════════════════════════════════════
// SECTION 4 — TOOLS (Calculators)
// HLV, SIP, Retirement — pure JS, no APIs
// ════════════════════════════════════════
document.querySelectorAll('.tool-tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tool-tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tool-'+btn.dataset.tool).classList.add('active');
  });
});

function getVal(id){ return parseFloat(document.getElementById(id).value)||0; }

function showCalcResult(id, mainValue, mainLabel, rows){
  const el=document.getElementById(id);
  el.classList.remove('hidden');
  el.innerHTML=`
    <div class="calc-result-main">${mainValue}</div>
    <div class="calc-result-label">${mainLabel}</div>
    <div class="calc-result-rows">
      ${rows.map(([l,v])=>`<div class="calc-result-row"><span>${l}</span><span>${v}</span></div>`).join('')}
    </div>`;
}
function showCalcError(id,msg){
  const el=document.getElementById(id);
  el.classList.remove('hidden');
  el.innerHTML=`<div class="calc-error">⚠️ ${msg}</div>`;
}

// HLV Calculator
function calcHLV(){
  const income   = getVal('hlv-income')*12; // annual
  const age      = getVal('hlv-age');
  const retire   = getVal('hlv-retire');
  const existing = getVal('hlv-existing');
  const growth   = getVal('hlv-growth')/100;
  const inflation= getVal('hlv-inflation')/100;
  if(!income||!age||age>=retire){
    showCalcError('hlv-result','Please fill all fields correctly. Current age must be less than retirement age.');
    return;
  }
  const years=retire-age;
  // HLV = Present value of future income stream
  // Using income replacement method with income growing at growth rate
  // discounted at inflation rate
  let hlv=0;
  const discountRate=Math.max(inflation,0.01);
  const growthRate=growth;
  if(Math.abs(growthRate-discountRate)<0.001){
    hlv=income*years;
  } else {
    hlv=income*((1-Math.pow((1+growthRate)/(1+discountRate),years))/(discountRate-growthRate));
  }
  const additionalCover=Math.max(0,hlv-existing);
  showCalcResult('hlv-result',
    fmtCr(Math.round(additionalCover)),
    'Additional life cover recommended',
    [
      ['Your Human Life Value (Total)',fmtCr(Math.round(hlv))],
      ['Existing Life Cover',fmtCr(existing)],
      ['Additional Cover Needed',fmtCr(Math.round(additionalCover))],
      ['Years to retirement',years+' years'],
      ['Annual income (current)',fmtCr(income)],
    ]
  );
}

// SIP Calculator
function calcSIP(){
  const P=getVal('sip-amount');
  const r=getVal('sip-return')/100/12;
  const n=getVal('sip-years')*12;
  if(!P||!r||!n){
    showCalcError('sip-result','Please fill all fields correctly.');
    return;
  }
  const FV=P*((Math.pow(1+r,n)-1)/r)*(1+r);
  const invested=P*n;
  const gains=FV-invested;
  showCalcResult('sip-result',
    fmtCr(Math.round(FV)),
    'Estimated maturity value',
    [
      ['Total invested',fmtCr(Math.round(invested))],
      ['Estimated returns',fmtCr(Math.round(gains))],
      ['Total maturity value',fmtCr(Math.round(FV))],
      ['Wealth multiplier',(FV/invested).toFixed(2)+'×'],
      ['Duration',getVal('sip-years')+' years'],
    ]
  );
}

// Retirement Calculator
function calcRetirement(){
  const currAge=getVal('ret-age');
  const retireAge=getVal('ret-retire');
  const monthlyExp=getVal('ret-expenses');
  const inflation=getVal('ret-inflation')/100;
  const retReturn=getVal('ret-return')/100;
  const lifeExp=getVal('ret-life');
  if(!currAge||!monthlyExp||currAge>=retireAge||retireAge>=lifeExp){
    showCalcError('ret-result','Please fill all fields correctly. Age values must be in order: Current < Retirement < Life Expectancy.');
    return;
  }
  const yearsToRetire=retireAge-currAge;
  const retirementDuration=lifeExp-retireAge;
  // Monthly expenses at retirement (inflation adjusted)
  const monthlyExpAtRetire=monthlyExp*Math.pow(1+inflation,yearsToRetire);
  const annualExpAtRetire=monthlyExpAtRetire*12;
  // Corpus needed (present value of annuity at retirement)
  const monthlyReturnPostRetire=retReturn/12;
  const months=retirementDuration*12;
  const corpus=annualExpAtRetire/retReturn*(1-Math.pow(1+retReturn,-retirementDuration));
  // Monthly SIP needed to build corpus
  const monthlyR=retReturn/12;
  const n=yearsToRetire*12;
  const sipNeeded=corpus*monthlyR/(Math.pow(1+monthlyR,n)-1);
  showCalcResult('ret-result',
    fmtCr(Math.round(corpus)),
    'Retirement corpus you need to build',
    [
      ['Years to build corpus',yearsToRetire+' years'],
      ['Monthly expenses today',fmtCr(monthlyExp)],
      ['Monthly expenses at retirement',fmtCr(Math.round(monthlyExpAtRetire))],
      ['Retirement duration',retirementDuration+' years'],
      ['Monthly investment needed now',fmtCr(Math.round(sipNeeded))],
      ['Target corpus',fmtCr(Math.round(corpus))],
    ]
  );
}

// ── INIT ──
(function init(){
  const dateEl=document.getElementById('newsDateDisplay');
  if(dateEl) dateEl.textContent=today();
  renderPlans();
  initContinueStrip();
})();


// ════════════════════════════════════════
// V1.4 ADDITIONS
// Daily Quiz · News Digest · Resources
// Dictionary · Claims Hub
// All lazy loaded · Zero paid deps
// ════════════════════════════════════════

// ── SECTION 5 — RESOURCES (tab handler) ──
let activeResTab    = 'dictionary';
let dictLoaded      = false;
let claimsLoaded    = false;
let dictData        = [];
let claimsData      = [];
let dictSearch      = '';
let activeDictCat   = 'All';
let activeClaimType = 0;
let activeSubtype   = 0;

document.querySelectorAll('.res-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    activeResTab = btn.dataset.res;
    document.querySelectorAll('.res-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.res-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('res-' + activeResTab).classList.add('active');
    if (activeResTab === 'dictionary' && !dictLoaded) loadDictionary();
    if (activeResTab === 'claims' && !claimsLoaded) loadClaims();
  });
});

// showSection override — load resources lazily
const _origShowSection = showSection;
function showSection(name) {
  _origShowSection(name);
  if (name === 'resources') {
    if (!dictLoaded) loadDictionary();
  }
}

// ── DICTIONARY ──
async function loadDictionary() {
  dictLoaded = true;
  document.getElementById('dictLoader').style.display = 'block';
  try {
    const res = await fetch('./data/dictionary.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    dictData = data.terms || [];
    document.getElementById('dictLoader').style.display = 'none';
    initDictUI();
  } catch(e) {
    document.getElementById('dictLoader').innerHTML = '<div style="color:var(--red)">⚠️ Unable to load dictionary. Please refresh.</div>';
    dictLoaded = false;
  }
}

function initDictUI() {
  // Build category filters
  const cats = ['All', ...new Set(dictData.map(t => t.category))];
  const row = document.getElementById('dictCatRow');
  row.innerHTML = cats.map(c =>
    `<button class="dict-cat-btn${c === 'All' ? ' active' : ''}" data-cat="${san(c)}">${san(c)}</button>`
  ).join('');
  row.querySelectorAll('.dict-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeDictCat = btn.dataset.cat;
      row.querySelectorAll('.dict-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDictionary();
    });
  });
  renderDictionary();
}

function getDictFiltered() {
  let list = dictData;
  if (activeDictCat !== 'All') list = list.filter(t => t.category === activeDictCat);
  if (dictSearch) {
    const q = dictSearch.toLowerCase();
    list = list.filter(t =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  return list.sort((a,b) => a.term.localeCompare(b.term));
}

function renderDictionary() {
  const filtered = getDictFiltered();
  const listEl = document.getElementById('dictList');
  let countEl = document.querySelector('.dict-count');
  if (!countEl) {
    countEl = document.createElement('div');
    countEl.className = 'dict-count';
    listEl.before(countEl);
  }
  countEl.textContent = `${filtered.length} term${filtered.length !== 1 ? 's' : ''}`;
  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="dict-no-results">No terms found for "<strong>${san(dictSearch)}</strong>"</div>`;
    return;
  }
  listEl.innerHTML = filtered.map((t, i) => `
    <div class="dict-card" id="dict-card-${i}">
      <div class="dict-card-header" onclick="toggleDictCard(${i})">
        <div>
          <div class="dict-term">${san(t.term)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="dict-cat-tag">${san(t.category)}</span>
          <span class="dict-chevron">›</span>
        </div>
      </div>
      <div class="dict-body">
        <div class="dict-section-label">📖 Definition</div>
        <div class="dict-text">${san(t.definition)}</div>
        <div class="dict-section-label">💡 Example</div>
        <div class="dict-example">${san(t.example)}</div>
        <div class="dict-section-label">⭐ Why It Matters</div>
        <div class="dict-text">${san(t.whyMatters)}</div>
      </div>
    </div>`).join('');
}

function toggleDictCard(i) {
  const card = document.getElementById('dict-card-' + i);
  if (card) card.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const dictSearchEl = document.getElementById('dictSearch');
  if (dictSearchEl) {
    dictSearchEl.addEventListener('input', function() {
      dictSearch = this.value.trim();
      document.getElementById('dictSearchClear').classList.toggle('hidden', !dictSearch);
      if (dictLoaded) renderDictionary();
    });
  }
});

function clearDictSearch() {
  dictSearch = '';
  const el = document.getElementById('dictSearch');
  if (el) el.value = '';
  document.getElementById('dictSearchClear').classList.add('hidden');
  if (dictLoaded) renderDictionary();
}

// ── CLAIMS HUB ──
async function loadClaims() {
  claimsLoaded = true;
  document.getElementById('claimsLoader').style.display = 'block';
  try {
    const res = await fetch('./data/claims.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    claimsData = data.claimTypes || [];
    document.getElementById('claimsLoader').style.display = 'none';
    initClaimsUI();
  } catch(e) {
    document.getElementById('claimsLoader').innerHTML = '<div style="color:var(--red)">⚠️ Unable to load claims data. Please refresh.</div>';
    claimsLoaded = false;
  }
}

function initClaimsUI() {
  const tabsEl = document.getElementById('claimTypeTabs');
  tabsEl.innerHTML = claimsData.map((c, i) =>
    `<button class="claim-type-btn${i === 0 ? ' active' : ''}" data-ci="${i}">${c.icon} ${san(c.title)}</button>`
  ).join('');
  tabsEl.querySelectorAll('.claim-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeClaimType = +btn.dataset.ci;
      activeSubtype = 0;
      tabsEl.querySelectorAll('.claim-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderClaimsContent();
    });
  });
  renderClaimsContent();
}

function renderClaimsContent() {
  const claim = claimsData[activeClaimType];
  if (!claim) return;
  const el = document.getElementById('claimsContent');

  // Health has subtypes (cashless + reimbursement)
  if (claim.subtypes) {
    const sub = claim.subtypes[activeSubtype] || claim.subtypes[0];
    el.innerHTML = `
      <div class="claim-subtype-tabs">
        ${claim.subtypes.map((s, i) =>
          `<button class="subtype-btn${i === activeSubtype ? ' active' : ''}" onclick="setSubtype(${i})">${san(s.title)}</button>`
        ).join('')}
      </div>
      ${renderClaimCard(claim, sub)}`;
  } else {
    el.innerHTML = renderClaimCard(claim, claim);
  }
}

function setSubtype(i) {
  activeSubtype = i;
  document.querySelectorAll('.subtype-btn').forEach((b, idx) => b.classList.toggle('active', idx === i));
  const claim = claimsData[activeClaimType];
  const sub = claim.subtypes[i];
  document.getElementById('claimsContent').innerHTML =
    `<div class="claim-subtype-tabs">
      ${claim.subtypes.map((s, idx) =>
        `<button class="subtype-btn${idx === i ? ' active' : ''}" onclick="setSubtype(${idx})">${san(s.title)}</button>`
      ).join('')}
    </div>${renderClaimCard(claim, sub)}`;
}

function renderClaimCard(claim, data) {
  const docs = (data.documents || []).map(d =>
    `<div class="claim-doc"><span class="doc-icon">📄</span><div><div class="doc-name">${san(d.doc)}</div><div class="doc-note">${san(d.note)}</div></div></div>`
  ).join('');
  const steps = (data.steps || []).map(s =>
    `<div class="claim-step"><span class="step-num">${s.step}</span><div class="step-body"><div class="step-title">${san(s.title)}</div><div class="step-detail">${san(s.detail)}</div></div></div>`
  ).join('');
  const mistakes = (data.mistakes || []).map(m => `<li>${san(m)}</li>`).join('');
  const tips = (data.tips || []).map(t => `<li>${san(t)}</li>`).join('');
  const subTitle = data.title || claim.title;
  const intro = data.type ? '' : `<div class="claim-intro"><div class="claim-intro-title">${claim.icon} ${san(claim.title)}</div><div class="claim-intro-text">${san(claim.intro)}</div></div>`;
  return `
    <div class="claim-content-card">
      ${intro}
      ${docs ? `<div class="claim-section"><div class="claim-section-title">📋 Documents Required</div><div class="claim-docs">${docs}</div></div>` : ''}
      ${steps ? `<div class="claim-section"><div class="claim-section-title">✅ Step-by-Step Process</div><div class="claim-steps">${steps}</div></div>` : ''}
      ${data.timeline ? `<div class="claim-section"><div class="claim-section-title">⏱️ Timeline</div><div class="claim-timeline">${san(data.timeline)}</div></div>` : ''}
      ${mistakes ? `<div class="claim-section"><div class="claim-section-title">⚠️ Common Mistakes to Avoid</div><ul class="claim-list mistakes">${mistakes}</ul></div>` : ''}
      ${tips ? `<div class="claim-section"><div class="claim-section-title">💡 Pro Tips</div><ul class="claim-list tips">${tips}</ul></div>` : ''}
    </div>`;
}

// ── NEWS DIGEST ──
function renderNewsDigest() {
  const top5 = allNewsData.filter(n => safeUrl(n.url)).slice(0, 5);
  const catLabel = {
    insurance:'Insurance', irdai:'IRDAI', mutualfunds:'Mutual Funds',
    tax:'Tax', banking:'Banking', personalfinance:'Personal Finance', markets:'Markets'
  };
  const el = document.getElementById('digestList');
  if (!el) return;
  if (top5.length === 0) {
    el.innerHTML = '<div style="font-size:11px;color:var(--g400)">No articles available.</div>';
    return;
  }
  el.innerHTML = top5.map((n, i) => {
    const url = safeUrl(n.url);
    return `<div class="digest-item">
      <span class="digest-num">${i + 1}</span>
      <div class="digest-body">
        <div class="digest-cat">${catLabel[n.category] || n.category || 'NEWS'}</div>
        <a class="digest-headline" href="${url}" target="_blank" rel="noopener noreferrer">${san(n.title)}</a>
        <div class="digest-summary">${san(n.summary)}</div>
      </div>
    </div>`;
  }).join('');
}

// Patch loadNews to also render digest after loading
const _origLoadNews = loadNews;
async function loadNews() {
  await _origLoadNews();
  renderNewsDigest();
}

// ── DAILY QUIZ CHALLENGE ──
let dqTopics    = [];
let dqCurrent   = 0;
let dqScore     = 0;
let dqAnswered  = false;

function getDailyQuizDate() {
  return new Date().toISOString().slice(0, 10); // "2026-06-19"
}

function getDailyQuizState() {
  try {
    const stored = JSON.parse(localStorage.getItem('ia_dq') || '{}');
    if (stored.date === getDailyQuizDate()) return stored;
  } catch(e) {}
  return { date: getDailyQuizDate(), completed: false, score: 0 };
}

function saveDailyQuizState(state) {
  localStorage.setItem('ia_dq', JSON.stringify({ ...state, date: getDailyQuizDate() }));
}

// Deterministic daily topic selection — same 5 topics for everyone on same day
function selectDailyTopics(topics) {
  const dateStr = getDailyQuizDate();
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 1000003;
  const indices = [];
  let s = seed;
  while (indices.length < 5) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idx = s % topics.length;
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map(i => topics[i]);
}

function updateDailyQuizUI() {
  const state = getDailyQuizState();
  const btn = document.getElementById('qcStartBtn');
  const sub = document.getElementById('qcStatus');
  if (!btn || !sub) return;
  if (state.completed) {
    const score = state.score || 0;
    btn.textContent = `${score}/5 ✓`;
    btn.className = 'qc-btn done';
    sub.textContent = `Completed today · Score: ${score}/5 · Come back tomorrow!`;
    btn.onclick = () => showDailyQuizResult(score);
  } else {
    btn.textContent = 'Start →';
    btn.className = 'qc-btn';
    sub.textContent = '5 questions · Changes every day';
    btn.onclick = () => openDailyQuiz();
  }
}

async function openDailyQuiz() {
  // Load topics if not already loaded
  if (ALL_TOPICS.length === 0) {
    if (!learnLoaded) {
      await loadLearnContent();
      // Wait for topics to load
      let attempts = 0;
      while (ALL_TOPICS.length === 0 && attempts < 20) {
        await new Promise(r => setTimeout(r, 200));
        attempts++;
      }
    }
  }
  if (ALL_TOPICS.length === 0) {
    alert('Unable to load quiz. Please check your connection.');
    return;
  }
  const state = getDailyQuizState();
  if (state.completed) { showDailyQuizResult(state.score); return; }
  dqTopics  = selectDailyTopics(ALL_TOPICS);
  dqCurrent = 0;
  dqScore   = 0;
  dqAnswered = false;
  const overlay = document.getElementById('dqOverlay');
  const modal   = document.getElementById('dqModal');
  overlay.classList.remove('hidden');
  modal.scrollTop = 0;
  requestAnimationFrame(() => overlay.classList.add('active'));
  document.body.style.overflow = 'hidden';
  renderDailyQuizQuestion();
}

function renderDailyQuizQuestion() {
  const t = dqTopics[dqCurrent];
  if (!t) return;
  const total = dqTopics.length;
  const pct   = Math.round((dqCurrent / total) * 100);
  const qId   = 'dq_' + dqCurrent;
  document.getElementById('dqContent').innerHTML = `
    <div class="dq-header">
      <div class="dq-title">🧠 Daily Quiz</div>
      <div class="dq-meta">${getDailyQuizDate()} · Question ${dqCurrent + 1} of ${total}</div>
    </div>
    <div class="dq-progress-bar"><div class="dq-progress-fill" style="width:${pct}%"></div></div>
    <div class="dq-q-num">Question ${dqCurrent + 1} / ${total}</div>
    <div class="dq-question">${san(t.quiz)}</div>
    <div class="dq-options" id="dq-opts">
      ${t.opts.map((o, i) =>
        `<button class="dq-opt" onclick="answerDQ(this,${i},${t.correct},'${qId}')">${String.fromCharCode(65+i)}. ${san(o)}</button>`
      ).join('')}
    </div>
    <div class="dq-feedback" id="dq-feedback"></div>
    <button class="dq-next-btn" id="dq-next" onclick="nextDailyQuestion()">
      ${dqCurrent === total - 1 ? 'See Result →' : 'Next Question →'}
    </button>`;
  dqAnswered = false;
}

function answerDQ(btn, selected, correct, qId) {
  if (dqAnswered) return;
  dqAnswered = true;
  document.querySelectorAll('#dq-opts .dq-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
  });
  if (selected !== correct) {
    btn.classList.add('wrong');
  } else {
    dqScore++;
  }
  const fb = document.getElementById('dq-feedback');
  const right = selected === correct;
  fb.textContent = right ? '🎉 Correct!' : '❌ Incorrect — correct answer highlighted above.';
  fb.className   = 'dq-feedback show ' + (right ? 'right' : 'wrong-r');
  const nextBtn  = document.getElementById('dq-next');
  if (nextBtn) nextBtn.classList.add('show');
}

function nextDailyQuestion() {
  dqCurrent++;
  if (dqCurrent >= dqTopics.length) {
    saveDailyQuizState({ completed: true, score: dqScore });
    updateDailyQuizUI();
    showDailyQuizResult(dqScore);
  } else {
    renderDailyQuizQuestion();
    document.getElementById('dqModal').scrollTop = 0;
  }
}

function showDailyQuizResult(score) {
  const total  = 5;
  const pct    = Math.round((score / total) * 100);
  let badge, msg;
  if (score === 5) { badge = 'perfect'; msg = 'Perfect score! 🎯 Outstanding!'; }
  else if (score >= 4) { badge = 'great'; msg = 'Excellent! You really know your stuff.'; }
  else if (score >= 3) { badge = 'good'; msg = 'Good effort! Keep learning daily.'; }
  else { badge = 'keep-going'; msg = 'Keep going! Each quiz makes you better.'; }

  const overlay = document.getElementById('dqOverlay');
  const modal   = document.getElementById('dqModal');
  overlay.classList.remove('hidden');
  modal.scrollTop = 0;
  requestAnimationFrame(() => overlay.classList.add('active'));
  document.body.style.overflow = 'hidden';

  document.getElementById('dqContent').innerHTML = `
    <div class="dq-header">
      <div class="dq-title">Today's Quiz Complete!</div>
      <div class="dq-meta">${getDailyQuizDate()}</div>
    </div>
    <div style="text-align:center;padding:20px 0">
      <div class="dq-result-score">${score}</div>
      <div class="dq-result-out">out of ${total} correct</div>
      <div class="dq-result-msg">${msg}</div>
      <span class="dq-result-badge ${badge}">${badge === 'perfect' ? '🏆 Perfect' : badge === 'great' ? '⭐ Excellent' : badge === 'good' ? '👍 Good' : '💪 Keep Going'}</span>
    </div>
    <div style="text-align:center;margin-top:16px;font-size:11px;color:var(--g400)">New quiz available tomorrow at midnight</div>
    <div style="text-align:center;margin-top:16px">
      <button class="dq-close-btn" onclick="closeDailyQuiz()">Close</button>
    </div>`;
}

function closeDailyQuiz() {
  const overlay = document.getElementById('dqOverlay');
  overlay.classList.remove('active');
  setTimeout(() => overlay.classList.add('hidden'), 250);
  document.body.style.overflow = '';
}

// Init daily quiz UI on load
document.addEventListener('DOMContentLoaded', () => {
  updateDailyQuizUI();
});

// ════════════════════════════════════════
// V1.5 — Recently Viewed · Bookmarks
// IRR · TVM · EMI · ULIP Calculators
// All localStorage · Zero paid deps
// ════════════════════════════════════════

// ── RECENTLY VIEWED TOPICS ──
const MAX_RECENT = 5;

function getRecentTopics() {
  try { return JSON.parse(localStorage.getItem('ia_recent') || '[]'); }
  catch(e) { return []; }
}

function addRecentTopic(topicId) {
  let recent = getRecentTopics().filter(id => id !== topicId);
  recent.unshift(topicId);
  if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
  localStorage.setItem('ia_recent', JSON.stringify(recent));
}

function renderRecentTopics() {
  const strip = document.getElementById('recentTopicsStrip');
  const list  = document.getElementById('recentTopicsList');
  if (!strip || !list) return;
  const recent = getRecentTopics();
  if (recent.length === 0 || ALL_TOPICS.length === 0) { strip.classList.add('hidden'); return; }
  const topics = recent.map(id => ALL_TOPICS.find(t => t.id === id)).filter(Boolean);
  if (topics.length === 0) { strip.classList.add('hidden'); return; }
  strip.classList.remove('hidden');
  list.innerHTML = topics.map(t => `
    <div class="recent-item" onclick="jumpToTopic('${t.id}')">
      <span class="recent-dot"></span>
      <span class="recent-title">${san(t.title)}</span>
      <span class="recent-subj">${san(t.subject)}</span>
    </div>`).join('');
}

function jumpToTopic(topicId) {
  if (!learnLoaded || ALL_TOPICS.length === 0) return;
  filteredTopics = ALL_TOPICS; // reset filters to find topic
  const idx = filteredTopics.findIndex(t => t.id === topicId);
  if (idx >= 0) {
    // Reset filters to All Topics
    activeSubject = 'All Topics';
    activeDiff = 'all';
    learnSearch = '';
    document.getElementById('learnSearch').value = '';
    document.querySelectorAll('.subj-btn').forEach(b => b.classList.toggle('active', b.dataset.subject === 'All Topics'));
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.toggle('active', b.dataset.diff === 'all'));
    filteredTopics = ALL_TOPICS;
    openTopicDetail(idx);
  }
}

// Patch openTopicDetail to track recently viewed
const _origOpenTopicDetail = openTopicDetail;
function openTopicDetail(idx) {
  const t = filteredTopics[idx];
  if (t) addRecentTopic(t.id);
  _origOpenTopicDetail(idx);
}

// Patch renderTopicList to show recently viewed
const _origRenderTopicList = renderTopicList;
function renderTopicList() {
  _origRenderTopicList();
  renderRecentTopics();
}

// ── BOOKMARKS ──
// Structure: { topics:[{id,title,subject}], articles:[{title,url,source}], plans:[{id,name,company}] }
function getBM() {
  try { return JSON.parse(localStorage.getItem('ia_bm') || '{"topics":[],"articles":[],"plans":[]}'); }
  catch(e) { return {topics:[],articles:[],plans:[]}; }
}
function saveBM(bm) { localStorage.setItem('ia_bm', JSON.stringify(bm)); }
function isBMTopic(id) { return getBM().topics.some(t => t.id === id); }
function isBMArticle(url) { return getBM().articles.some(a => a.url === url); }
function isBMPlan(id) { return getBM().plans.some(p => p.id === id); }

function toggleBMTopic(id, title, subject) {
  const bm = getBM();
  const idx = bm.topics.findIndex(t => t.id === id);
  if (idx >= 0) bm.topics.splice(idx, 1);
  else bm.topics.unshift({id, title, subject});
  saveBM(bm);
  updateBMCount();
  return idx < 0; // true = now bookmarked
}

function toggleBMArticle(url, title, source) {
  const bm = getBM();
  const idx = bm.articles.findIndex(a => a.url === url);
  if (idx >= 0) bm.articles.splice(idx, 1);
  else bm.articles.unshift({url, title, source});
  saveBM(bm);
  updateBMCount();
  return idx < 0;
}

function toggleBMPlan(id, name, company) {
  const bm = getBM();
  const idx = bm.plans.findIndex(p => p.id === id);
  if (idx >= 0) bm.plans.splice(idx, 1);
  else bm.plans.unshift({id, name, company});
  saveBM(bm);
  updateBMCount();
  return idx < 0;
}

function updateBMCount() {
  const bm = getBM();
  const total = bm.topics.length + bm.articles.length + bm.plans.length;
  const el = document.getElementById('bookmarkCount');
  if (el) el.textContent = total > 0 ? total : '';
  const trigger = document.getElementById('bookmarksTrigger');
  if (trigger) trigger.style.display = total > 0 || true ? '' : 'none';
}

function openBookmarks() {
  const bm = getBM();
  const overlay = document.getElementById('bmOverlay');
  const modal   = document.getElementById('bmModal');
  overlay.classList.remove('hidden');
  modal.scrollTop = 0;
  requestAnimationFrame(() => overlay.classList.add('active'));
  document.body.style.overflow = 'hidden';
  renderBMContent('topics');
}

function closeBookmarks() {
  const overlay = document.getElementById('bmOverlay');
  overlay.classList.remove('active');
  setTimeout(() => overlay.classList.add('hidden'), 250);
  document.body.style.overflow = '';
}

let activeBMTab = 'topics';
function renderBMContent(tab) {
  activeBMTab = tab || activeBMTab;
  const bm = getBM();
  const tabs = ['topics','articles','plans'];
  const tabLabels = {topics:`📚 Topics (${bm.topics.length})`, articles:`📰 Articles (${bm.articles.length})`, plans:`🔍 Plans (${bm.plans.length})`};
  let content = `
    <div class="bm-title">🔖 Saved Items</div>
    <div class="bm-tabs">
      ${tabs.map(t => `<div class="bm-tab${t===activeBMTab?' active':''}" onclick="renderBMContent('${t}')">${tabLabels[t]}</div>`).join('')}
    </div>`;
  if (activeBMTab === 'topics') {
    content += `<div class="bm-panel active">`;
    if (bm.topics.length === 0) content += `<div class="bm-empty"><span class="bm-empty-icon">📚</span>No saved topics yet.<br/><small>Tap 🔖 on any topic to save it.</small></div>`;
    else content += `<div class="bm-list">${bm.topics.map(t => `
      <div class="bm-topic-item" onclick="closeBookmarks();showSection('learn');setTimeout(()=>jumpToTopic('${t.id}'),300)">
        <div><div class="bm-item-title">${san(t.title)}</div><div class="bm-item-sub">${san(t.subject)}</div></div>
        <span class="bm-remove" onclick="event.stopPropagation();removeBMTopic('${t.id}')" title="Remove">✕</span>
      </div>`).join('')}</div>`;
    content += `</div>`;
  } else if (activeBMTab === 'articles') {
    content += `<div class="bm-panel active">`;
    if (bm.articles.length === 0) content += `<div class="bm-empty"><span class="bm-empty-icon">📰</span>No saved articles yet.<br/><small>Tap 🔖 on any news article to save it.</small></div>`;
    else content += `<div class="bm-list">${bm.articles.map(a => {
      const url = safeUrl(a.url);
      return `<div class="bm-news-item">
        <div class="bm-news-head">
          <a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:600;color:var(--white);text-decoration:none;flex:1;line-height:1.4" onclick="void(0)">${san(a.title)}</a>
          <span class="bm-remove" onclick="removeBMArticle('${a.url.replace(/'/g,'')}')" title="Remove">✕</span>
        </div>
        <div style="font-size:10px;color:var(--g400)">${san(a.source)}</div>
      </div>`;
    }).join('')}</div>`;
    content += `</div>`;
  } else if (activeBMTab === 'plans') {
    content += `<div class="bm-panel active">`;
    if (bm.plans.length === 0) content += `<div class="bm-empty"><span class="bm-empty-icon">🔍</span>No saved plans yet.<br/><small>Tap 🔖 in any plan's full details to save it.</small></div>`;
    else content += `<div class="bm-list">${bm.plans.map(p => `
      <div class="bm-plan-item" onclick="closeBookmarks();showSection('compare');setTimeout(()=>openModal(${p.id}),300)">
        <div><div class="bm-item-title">${san(p.name)}</div><div class="bm-item-sub">${san(p.company)}</div></div>
        <span class="bm-remove" onclick="event.stopPropagation();removeBMPlan(${p.id})" title="Remove">✕</span>
      </div>`).join('')}</div>`;
    content += `</div>`;
  }
  document.getElementById('bmContent').innerHTML = content;
}

function removeBMTopic(id) { const bm=getBM(); bm.topics=bm.topics.filter(t=>t.id!==id); saveBM(bm); updateBMCount(); renderBMContent(); }
function removeBMArticle(url) { const bm=getBM(); bm.articles=bm.articles.filter(a=>a.url!==url); saveBM(bm); updateBMCount(); renderBMContent(); }
function removeBMPlan(id) { const bm=getBM(); bm.plans=bm.plans.filter(p=>p.id!==id); saveBM(bm); updateBMCount(); renderBMContent(); }

// Add bookmark button to topic detail view
const _origOpenTopicDetail2 = openTopicDetail;
// Patch: inject bookmark button into topic detail after render
function patchTopicDetailWithBM(t, idx) {
  const backRow = document.querySelector('.td-back-row');
  if (!backRow || !t) return;
  const saved = isBMTopic(t.id);
  const btn = document.createElement('button');
  btn.className = 'bm-icon' + (saved ? ' saved' : '');
  btn.title = saved ? 'Remove bookmark' : 'Bookmark this topic';
  btn.textContent = saved ? '🔖' : '🔖';
  btn.style.marginLeft = 'auto';
  btn.onclick = () => {
    const nowSaved = toggleBMTopic(t.id, t.title, t.subject);
    btn.className = 'bm-icon' + (nowSaved ? ' saved' : '');
    btn.title = nowSaved ? 'Remove bookmark' : 'Bookmark this topic';
  };
  backRow.appendChild(btn);
}

// Patch openTopicDetail to inject BM button
const __origOTD = openTopicDetail;
function openTopicDetail(idx) {
  __origOTD(idx);
  const t = filteredTopics[idx];
  if (t) setTimeout(() => patchTopicDetailWithBM(t, idx), 0);
}

// Patch renderNews to add bookmark buttons to news cards
const _origRenderNews = renderNews;
function renderNews() {
  _origRenderNews();
  addNewsBookmarkButtons();
}

function addNewsBookmarkButtons() {
  const cards = document.querySelectorAll('.news-card');
  cards.forEach((card, i) => {
    const n = getFilteredNews()[i];
    if (!n) return;
    const saved = isBMArticle(n.url);
    const btn = document.createElement('button');
    btn.className = 'bm-icon' + (saved ? ' saved' : '');
    btn.title = saved ? 'Remove bookmark' : 'Save article';
    btn.textContent = '🔖';
    btn.style.marginLeft = 'auto';
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const nowSaved = toggleBMArticle(n.url, n.title, n.source);
      btn.className = 'bm-icon' + (nowSaved ? ' saved' : '');
    });
    const footer = card.querySelector('.news-footer');
    if (footer) footer.insertBefore(btn, footer.firstChild);
  });
}

// Patch openModal to add bookmark button for plans
const _origOpenModal = openModal;
function openModal(id) {
  _origOpenModal(id);
  const p = PLANS.find(x => x.id === id);
  setTimeout(() => {
    const actionsEl = document.querySelector('.m-actions');
    if (!actionsEl || !p) return;
    const saved = isBMPlan(p.id);
    const btn = document.createElement('button');
    btn.className = 'bm-icon' + (saved ? ' saved' : '');
    btn.style.cssText = 'font-size:18px;padding:8px 12px;border:1px solid var(--bg-border);border-radius:var(--r-sm);background:rgba(255,255,255,.04)';
    btn.title = saved ? 'Remove from saved' : 'Save this plan';
    btn.textContent = '🔖';
    btn.onclick = () => {
      const nowSaved = toggleBMPlan(p.id, p.plan, p.companyShort);
      btn.className = 'bm-icon' + (nowSaved ? ' saved' : '');
    };
    actionsEl.appendChild(btn);
  }, 0);
}

// ═══════════════════════════════════════
// NEW CALCULATORS
// ═══════════════════════════════════════

// ── EXTRA CALCULATORS (IRR · TVM · EMI · ULIP) ──
// Lazy loaded from js/calcs-extra.js when tools section first opens
let calcExtraLoaded = false;

async function loadCalcsExtra() {
  if (calcExtraLoaded) return;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'js/calcs-extra.js';
    script.onload  = () => { calcExtraLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load calcs-extra.js'));
    document.head.appendChild(script);
  });
}

// Stub functions — call real function after lazy loading
async function calcIRR()  { await loadCalcsExtra(); _calcIRR();  }
async function calcTVM()  { await loadCalcsExtra(); _calcTVM();  }
async function calcEMI()  { await loadCalcsExtra(); _calcEMI();  }
async function calcULIP() { await loadCalcsExtra(); _calcULIP(); }
function setTvmMode(m,b)  { if(calcExtraLoaded) _setTvmMode(m,b); else loadCalcsExtra().then(()=>_setTvmMode(m,b)); }

// // Init bookmarks count on load
document.addEventListener('DOMContentLoaded', () => {
  updateBMCount();
});
