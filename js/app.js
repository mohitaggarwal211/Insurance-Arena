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
