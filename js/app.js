// INSURANCE ARENA — APP LOGIC v6.0
// Clean rewrite: no function patching, no wrapping
// All features integrated directly
// ════════════════════════════════════════

// ── GLOBALS ──
let activeSection  = 'compare';
let activeFilter   = 'all';
let activeSearch   = '';
let activeSort     = 'default';
let activeView     = 'card';
let activeNewsCat  = 'all';
let activeNewsSearch = '';
let activeSubject  = 'All Topics';
let activeDiff     = 'all';
let activeLearnTab = 'topics';
let activeDictCat  = 'All';
let learnSearch    = '';
let allNewsData    = [];
let ALL_TOPICS     = [];
let filteredTopics = [];
let learnLoaded    = false;
let dictLoaded     = false;
let claimsLoaded   = false;
let dictData       = [];
let claimsData     = [];
let dictSearch     = '';
let activeClaimType = 0;
let activeSubtype   = 0;
let tvmMode        = 'fv';
let calcExtraLoaded = false;
let completedTopics = new Set(JSON.parse(localStorage.getItem('ia_done') || '[]'));

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
function fmtCr(n){
  if(n>=10000000) return '₹'+(n/10000000).toFixed(2)+' Cr';
  if(n>=100000) return '₹'+(n/100000).toFixed(2)+' L';
  return '₹'+n.toLocaleString('en-IN');
}
function today(){
  const m=['January','February','March','April','May','June','July','August','September','October','November','December'];
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
    if(days<7) return days+' days ago';
    if(days<14) return '1 week ago';
    if(days<21) return '2 weeks ago';
    if(days<30) return '3 weeks ago';
    return Math.floor(days/30)+' month'+(Math.floor(days/30)>1?'s':'')+' ago';
  }catch(e){ return ''; }
}
function saveProgress(){ localStorage.setItem('ia_done',JSON.stringify([...completedTopics])); }
function getVal(id){ return parseFloat(document.getElementById(id).value)||0; }

// ── SECTION NAVIGATION ──
function showSection(name){
  if(activeSection===name){ document.getElementById('mobileNav').classList.add('hidden'); return; }
  activeSection=name;
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById('sec-'+name);
  if(el) el.classList.add('active');
  document.querySelectorAll('[data-sec]').forEach(b=>b.classList.toggle('active',b.dataset.sec===name));
  document.getElementById('mobileNav').classList.add('hidden');
  window.scrollTo(0,0);
  if(name==='news' && allNewsData.length===0) loadNews();
  if(name==='learn' && !learnLoaded) loadLearnContent();
}

document.querySelectorAll('[data-sec]').forEach(btn=>btn.addEventListener('click',()=>showSection(btn.dataset.sec)));
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileNav').classList.toggle('hidden'));

// ── CONTINUE LEARNING ──
function updateContinueStrip(){
  const done=completedTopics.size;
  const pct=Math.round((done/147)*100);
  // Update tab + badge
  const ptab=document.getElementById('learnProgressTab');
  if(ptab) ptab.textContent=done>0?done+'/147 done':'147 Topics';
  const badge=document.getElementById('learnDoneCount');
  if(badge) badge.textContent=done;
  if(done===0) return;
  const strip=document.getElementById('continueStrip');
  if(strip) strip.classList.remove('hidden');
  const countEl=document.getElementById('continueCount');
  if(countEl) countEl.textContent=done;
  const fillEl=document.getElementById('continueFill');
  if(fillEl) fillEl.style.width=pct+'%';
  const lastId=localStorage.getItem('ia_last_topic');
  if(lastId && ALL_TOPICS.length>0){
    const t=ALL_TOPICS.find(x=>x.id===lastId);
    const el=document.getElementById('continueTopic');
    if(t&&el) el.textContent=t.title;
  }
  const btn=document.getElementById('continueBtn');
  if(btn) btn.onclick=()=>showSection('learn');
}

// ── BOOKMARKS ──
function getBM(){ try{ return JSON.parse(localStorage.getItem('ia_bm')||'{"topics":[],"articles":[],"plans":[]}'); }catch(e){ return {topics:[],articles:[],plans:[]}; } }
function saveBM(bm){ localStorage.setItem('ia_bm',JSON.stringify(bm)); }
function updateBMCount(){
  const bm=getBM();
  const n=bm.topics.length+bm.articles.length+bm.plans.length;
  const el=document.getElementById('bookmarkCount');
  if(el) el.textContent=n>0?(' '+n):'';
}
function toggleBMTopic(id,title,subject){ const bm=getBM(); const i=bm.topics.findIndex(t=>t.id===id); if(i>=0) bm.topics.splice(i,1); else bm.topics.unshift({id,title,subject}); saveBM(bm); updateBMCount(); return i<0; }
function toggleBMArticle(url,title,source){ const bm=getBM(); const i=bm.articles.findIndex(a=>a.url===url); if(i>=0) bm.articles.splice(i,1); else bm.articles.unshift({url,title,source}); saveBM(bm); updateBMCount(); return i<0; }
function toggleBMPlan(id,name,company){ const bm=getBM(); const i=bm.plans.findIndex(p=>p.id===id); if(i>=0) bm.plans.splice(i,1); else bm.plans.unshift({id,name,company}); saveBM(bm); updateBMCount(); return i<0; }
function openBookmarks(){ renderBMContent('topics'); const o=document.getElementById('bmOverlay'); o.classList.remove('hidden'); requestAnimationFrame(()=>o.classList.add('active')); document.body.style.overflow='hidden'; }
function closeBookmarks(){ const o=document.getElementById('bmOverlay'); o.classList.remove('active'); setTimeout(()=>o.classList.add('hidden'),250); document.body.style.overflow=''; }
let activeBMTab='topics';
function renderBMContent(tab){
  activeBMTab=tab||activeBMTab;
  const bm=getBM();
  const tabs={topics:'📚 Topics ('+bm.topics.length+')',articles:'📰 Articles ('+bm.articles.length+')',plans:'🔍 Plans ('+bm.plans.length+')'};
  let html=`<div class="bm-title">🔖 Saved Items</div><div class="bm-tabs">${Object.entries(tabs).map(([k,v])=>`<div class="bm-tab${k===activeBMTab?' active':''}" onclick="renderBMContent('${k}')">${v}</div>`).join('')}</div>`;
  if(activeBMTab==='topics'){
    html+=bm.topics.length===0?'<div class="bm-empty"><span class="bm-empty-icon">📚</span>No saved topics yet.<br/><small>Tap 🔖 on any topic to save it.</small></div>'
    :'<div class="bm-list">'+bm.topics.map(t=>`<div class="bm-item" onclick="closeBookmarks();showSection('learn');setTimeout(()=>jumpToTopic('${t.id}'),400)"><div><div class="bm-item-title">${san(t.title)}</div><div class="bm-item-sub">${san(t.subject)}</div></div><span class="bm-remove" onclick="event.stopPropagation();removeBM('topics','${t.id}')">✕</span></div>`).join('')+'</div>';
  } else if(activeBMTab==='articles'){
    html+=bm.articles.length===0?'<div class="bm-empty"><span class="bm-empty-icon">📰</span>No saved articles yet.<br/><small>Tap 🔖 on any news card to save it.</small></div>'
    :'<div class="bm-list">'+bm.articles.map(a=>{const u=safeUrl(a.url);return`<div class="bm-item"><div style="flex:1"><a href="${u}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:600;color:var(--white);text-decoration:none">${san(a.title)}</a><div style="font-size:10px;color:var(--g400);margin-top:2px">${san(a.source)}</div></div><span class="bm-remove" onclick="removeBM('articles','${encodeURIComponent(a.url)}')">✕</span></div>`;}).join('')+'</div>';
  } else {
    html+=bm.plans.length===0?'<div class="bm-empty"><span class="bm-empty-icon">🔍</span>No saved plans yet.<br/><small>Tap 🔖 in any plan\'s full details to save it.</small></div>'
    :'<div class="bm-list">'+bm.plans.map(p=>`<div class="bm-item" onclick="closeBookmarks();showSection('compare');setTimeout(()=>openModal(${p.id}),400)"><div><div class="bm-item-title">${san(p.name)}</div><div class="bm-item-sub">${san(p.company)}</div></div><span class="bm-remove" onclick="event.stopPropagation();removeBM('plans',${p.id})">✕</span></div>`).join('')+'</div>';
  }
  document.getElementById('bmContent').innerHTML=html;
}
function removeBM(type,id){
  const bm=getBM();
  if(type==='topics') bm.topics=bm.topics.filter(t=>t.id!==id);
  else if(type==='articles') bm.articles=bm.articles.filter(a=>a.url!==decodeURIComponent(id));
  else if(type==='plans') bm.plans=bm.plans.filter(p=>p.id!==+id);
  saveBM(bm); updateBMCount(); renderBMContent();
}

// ════════════════════════════════════════
// COMPARE SECTION
// ════════════════════════════════════════
function getFilteredPlans(){
  let r=[...PLANS];
  if(activeSearch.trim()){ const q=activeSearch.toLowerCase(); r=r.filter(p=>p.company.toLowerCase().includes(q)||p.companyShort.toLowerCase().includes(q)||p.plan.toLowerCase().includes(q)||p.salesPitch.toLowerCase().includes(q)||(p.bestFor||'').toLowerCase().includes(q)||p.tags.some(t=>t.label.toLowerCase().includes(q))||(p.keyFeatures||[]).some(f=>f.toLowerCase().includes(q))); }
  const map={'whole-life':'wholeLife','rop':'returnOfPremium','joint':'jointLife','ci':'criticalIllness'};
  if(activeFilter!=='all'&&map[activeFilter]) r=r.filter(p=>p[map[activeFilter]]===true);
  if(activeSort==='csr-high') r.sort((a,b)=>b.csr-a.csr);
  else if(activeSort==='csr-low') r.sort((a,b)=>a.csr-b.csr);
  else if(activeSort==='name') r.sort((a,b)=>a.company.localeCompare(b.company));
  else r.sort((a,b)=>a.id-b.id);
  return r;
}
function renderPlans(){
  const plans=getFilteredPlans();
  document.getElementById('resultsCount').textContent='Showing '+plans.length+' plan'+(plans.length!==1?'s':'');
  const empty=plans.length===0;
  document.getElementById('noResults').classList.toggle('hidden',!empty);
  document.getElementById('cardsGrid').classList.toggle('hidden',empty||activeView==='table');
  document.getElementById('tableWrap').classList.toggle('hidden',empty||activeView==='card');
  if(empty) return;
  if(activeView==='card') renderCards(plans); else renderTable(plans);
}
function renderCards(plans){
  document.getElementById('cardsGrid').innerHTML=plans.map(p=>{
    const tags=p.tags.map(t=>`<span class="feat-tag ${t.type}">${san(t.label)}</span>`).join('');
    const stats=(p.keyStats||[]).map(s=>`<div><span class="card-stat-val">${san(s.val)}</span><span class="card-stat-lbl">${san(s.lbl)}</span></div>`).join('');
    return `<div class="plan-card" tabindex="0" role="article" onclick="openModal(${p.id})">
      <div class="card-header">
        <div class="card-company">${san(p.companyShort)}</div>
        <div class="card-plan-name">${san(p.plan)}</div>
        ${p.bestFor?`<div class="card-best-for">⭐ ${san(p.bestFor)}</div>`:''}
      </div>
      <div class="card-features">${tags}</div>
      ${stats?`<div class="card-stats">${stats}</div>`:''}
      <div class="card-pitch"><div class="card-pitch-label">Why this plan?</div><div class="card-pitch-text">${san(p.salesPitch)}</div></div>
      <div class="card-footer">
        <a href="${p.calcUrl}" target="_blank" rel="noopener noreferrer" class="btn-calc" onclick="event.stopPropagation()">🧮 Calculate Premium</a>
        <button class="btn-details" onclick="event.stopPropagation();openModal(${p.id})">Full Details</button>
      </div>
    </div>`;
  }).join('');
}
function renderTable(plans){
  const yn=v=>v?'<span class="tbl-yes">✓</span>':'<span class="tbl-no">–</span>';
  document.getElementById('tableBody').innerHTML=plans.map(p=>{
    const cls=cc(p.csr);
    return `<tr><td><div style="font-weight:600;color:var(--white)">${san(p.companyShort)}</div><div style="font-size:10px;color:var(--teal)">${san(p.bestFor||'')}</div></td>
    <td style="font-size:11px;color:var(--g400)">${san(p.plan)}</td>
    <td class="tbl-csr ${p.csrPending?'mid':cls}">${p.csrPending?'⚠️':p.csr+'%'}</td>
    <td>${yn(p.wholeLife)}</td><td>${yn(p.terminalIllness)}</td><td>${yn(p.criticalIllness)}</td>
    <td>${yn(p.returnOfPremium)}</td><td>${yn(p.jointLife)}</td><td>${yn(p.wopDisability)}</td>
    <td style="font-size:11px">${san(p.maxMaturity)}</td>
    <td>${p.womenDiscount&&!p.womenDiscount.toLowerCase().includes('no')?'<span class="tbl-yes">✓</span>':'<span class="tbl-no">–</span>'}</td>
    <td><a href="${p.calcUrl}" target="_blank" rel="noopener noreferrer" class="tbl-calc">Calculate →</a></td></tr>`;
  }).join('');
}

// ── PLAN MODAL ──
function openModal(id){
  const p=PLANS.find(x=>x.id===id);
  if(!p) return;
  const cls=cc(p.csr);
  const csrVal=p.csrPending?'<span class="csr-value mid">⚠️ Pending</span>':`<span class="csr-value ${cls}">${p.csr}%</span>`;
  const feats=[['Whole Life',p.wholeLife],['Terminal Illness',p.terminalIllness],['Accidental Death',p.accidentalDeath],['Critical Illness',p.criticalIllness],['WOP Disability',p.wopDisability],['Return of Premium',p.returnOfPremium],['Joint Life',p.jointLife],['Premium Break',p.premiumBreak],['Smart Exit',p.smartExit],['Spouse Cover',p.spouseCover],['Life Stage SA+',p.lifeStage]].map(([l,v])=>`<span class="m-feat ${v?'yes':'no'}">${v?'✓':'✗'} ${l}</span>`).join('');
  const bullets=(p.keyFeatures||[]).map(f=>`<li>${san(f)}</li>`).join('');
  const bm=getBM(); const isBm=bm.plans.some(x=>x.id===id);
  document.getElementById('modalContent').innerHTML=`
    <div class="m-company">${san(p.company)}</div>
    <div class="m-plan">${san(p.plan)}</div>
    ${p.bestFor?`<div class="m-best-for">⭐ ${san(p.bestFor)}</div>`:''}
    <div class="m-uin">UIN: ${san(p.uin)} · FY 2024–25</div>
    <div class="csr-section">
      <div class="csr-header"><span class="csr-label">Claim Settlement Ratio FY25</span>${csrVal}</div>
      <div class="csr-bar-track"><div class="csr-bar-fill ${p.csrPending?'mid':cls}" style="width:0%" data-w="${p.csrPending?55:cw(p.csr)}"></div></div>
    </div>
    <div class="m-sec">Plan Details</div>
    <div class="m-grid">
      <div><div class="m-fl">Entry Age</div><div class="m-fv">${san(p.entryAge)}</div></div>
      <div><div class="m-fl">Max Maturity</div><div class="m-fv">${san(p.maxMaturity)}</div></div>
      <div><div class="m-fl">Sum Assured</div><div class="m-fv">${san(p.minSA)} – ${san(p.maxSA)}</div></div>
      <div><div class="m-fl">Premium Pay</div><div class="m-fv">${san(p.premiumPay)}</div></div>
      <div><div class="m-fl">Limited Pay</div><div class="m-fv">${san(p.limitedPayTerms)}</div></div>
      <div><div class="m-fl">Premium Modes</div><div class="m-fv">${san(p.premiumModes)}</div></div>
      <div><div class="m-fl">Death Benefit</div><div class="m-fv">${san(p.deathBenefit)}</div></div>
      <div><div class="m-fl">Women Discount</div><div class="m-fv">${san(p.womenDiscount)}</div></div>
    </div>
    <div class="m-sec">Features</div><div class="m-feats">${feats}</div>
    <div class="m-sec">Highlights</div><ul class="m-bullets">${bullets}</ul>
    <div class="m-sec">Why This Plan?</div>
    <div class="m-pitch-box">${san(p.salesPitch)}</div>
    <div class="m-actions">
      <a href="${p.calcUrl}" target="_blank" rel="noopener noreferrer" class="m-btn-p">🧮 Calculate Premium →</a>
      <a href="${p.brochureUrl}" target="_blank" rel="noopener noreferrer" class="m-btn-s">📄 View Brochure</a>
      <button class="bm-plan-btn${isBm?' saved':''}" id="planBmBtn" onclick="handlePlanBM(${p.id},'${p.plan.replace(/'/g,"\\'")}','${p.companyShort}')">${isBm?'🔖 Saved':'🔖 Save Plan'}</button>
    </div>`;
  const overlay=document.getElementById('modalOverlay');
  document.getElementById('modal').scrollTop=0;
  overlay.classList.remove('hidden');
  requestAnimationFrame(()=>overlay.classList.add('active'));
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{ const b=document.querySelector('#modalContent .csr-bar-fill'); if(b){const w=b.dataset.w;b.style.width='0%';requestAnimationFrame(()=>{b.style.width=w+'%';});} });
}
function handlePlanBM(id,name,company){
  const saved=toggleBMPlan(id,name,company);
  const btn=document.getElementById('planBmBtn');
  if(btn){ btn.textContent=saved?'🔖 Saved':'🔖 Save Plan'; btn.classList.toggle('saved',saved); }
}
function closeModal(){ const o=document.getElementById('modalOverlay'); o.classList.remove('active'); setTimeout(()=>o.classList.add('hidden'),250); document.body.style.overflow=''; }
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('modalOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){ closeModal(); closeDailyQuiz(); closeBookmarks(); }});

// Compare controls
document.getElementById('searchInput').addEventListener('input',e=>{activeSearch=e.target.value;renderPlans();});
document.getElementById('sortSelect').addEventListener('change',e=>{activeSort=e.target.value;renderPlans();});
document.getElementById('cardViewBtn').addEventListener('click',()=>{activeView='card';document.getElementById('cardViewBtn').classList.add('active');document.getElementById('tableViewBtn').classList.remove('active');renderPlans();});
document.getElementById('tableViewBtn').addEventListener('click',()=>{activeView='table';document.getElementById('tableViewBtn').classList.add('active');document.getElementById('cardViewBtn').classList.remove('active');renderPlans();});
document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeFilter=btn.dataset.filter;renderPlans();}));
function resetFilters(){ activeFilter='all';activeSearch='';activeSort='default';document.getElementById('searchInput').value='';document.getElementById('sortSelect').value='default';document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));document.querySelector('[data-filter="all"]').classList.add('active');renderPlans(); }

// ════════════════════════════════════════
// NEWS SECTION
// ════════════════════════════════════════
const FALLBACK_NEWS=[
  {title:"IRDAI raises health insurance sum insured limits for standard products",source:"IRDAI Official",category:"irdai",publishedAt:new Date(Date.now()-0).toISOString(),summary:"The insurance regulator revised guidelines for standard health insurance products, increasing minimum sum insured thresholds to improve policyholder protection.",url:"https://irdai.gov.in"},
  {title:"Life insurance new business premium grows 18% year-on-year in FY25",source:"Moneycontrol",category:"insurance",publishedAt:new Date(Date.now()-2*86400000).toISOString(),summary:"The life insurance sector recorded robust growth, driven by strong performance from both LIC and private insurers in the last fiscal year.",url:"https://www.moneycontrol.com/news/business/moneycontrol-research/insurance"},
  {title:"Term insurance premiums expected to rise as global reinsurers revise rates",source:"GoodReturns",category:"insurance",publishedAt:new Date(Date.now()-3*86400000).toISOString(),summary:"Global reinsurance costs are increasing, which may lead to marginal premium hikes in term insurance plans across major insurers.",url:"https://www.goodreturns.in/insurance"},
  {title:"IRDAI circular on health insurance portability — new guidelines effective",source:"IRDAI Official",category:"irdai",publishedAt:new Date(Date.now()-4*86400000).toISOString(),summary:"IRDAI issued a comprehensive circular updating health insurance portability norms, making it easier to switch insurers without losing waiting period credit.",url:"https://irdai.gov.in"},
  {title:"RBI keeps repo rate unchanged — impact on insurance investment returns",source:"NDTV Profit",category:"banking",publishedAt:new Date(Date.now()-4*86400000).toISOString(),summary:"The RBI kept repo rate unchanged. This affects insurance company investment portfolios and long-term policy pricing strategies.",url:"https://profit.ndtv.com"},
  {title:"RBI monetary policy — interest rates, inflation and credit growth outlook",source:"NDTV Profit",category:"banking",publishedAt:new Date(Date.now()-5*86400000).toISOString(),summary:"Key highlights from the latest RBI monetary policy committee meeting including decisions on interest rates and inflation outlook.",url:"https://profit.ndtv.com"},
  {title:"Bank FD rates 2025 — comparing fixed deposits vs insurance endowment plans",source:"GoodReturns",category:"banking",publishedAt:new Date(Date.now()-6*86400000).toISOString(),summary:"A comparison of top bank FD rates against insurance endowment plan returns to help investors make informed decisions.",url:"https://www.goodreturns.in"},
  {title:"ELSS vs Term Insurance — which gives better tax benefit under Section 80C",source:"ET Money Blog",category:"tax",publishedAt:new Date(Date.now()-5*86400000).toISOString(),summary:"A comparison of tax benefits under Section 80C through ELSS mutual funds versus life insurance premium payments.",url:"https://etmoney.com/learn"},
  {title:"SBI Mutual Fund launches new debt fund for conservative investors",source:"NDTV Profit",category:"mutualfunds",publishedAt:new Date(Date.now()-5*86400000).toISOString(),summary:"SBI Mutual Fund launched a new debt offering targeting conservative investors. Planners suggest pairing it with term insurance.",url:"https://profit.ndtv.com"},
  {title:"PM-JAY Ayushman Bharat expanded to cover all senior citizens above 70",source:"PIB India",category:"insurance",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"The government announced expansion of Ayushman Bharat PM-JAY to cover all senior citizens above 70, providing Rs 5 lakh cover free.",url:"https://pib.gov.in"},
  {title:"GST on insurance premiums — government reviews exemption for policies",source:"Moneycontrol",category:"tax",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"The government is examining the current GST structure on insurance premiums following representations from industry groups.",url:"https://www.moneycontrol.com"},
  {title:"Best mutual funds for 2025 — SIP strategy for long-term wealth creation",source:"GoodReturns",category:"mutualfunds",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"A comprehensive guide to mutual fund selection for 2025, with recommendations for building long-term wealth through SIPs.",url:"https://www.goodreturns.in"},
  {title:"How to build an emergency fund while paying insurance premiums",source:"BankBazaar Blog",category:"personalfinance",publishedAt:new Date(Date.now()-7*86400000).toISOString(),summary:"Financial planning guide explaining how to balance maintaining adequate emergency funds while keeping up insurance payments.",url:"https://www.bankbazaar.com/insurance.html"},
  {title:"LIC posts highest-ever new business premium collection in FY 2024-25",source:"NDTV Profit",category:"insurance",publishedAt:new Date(Date.now()-10*86400000).toISOString(),summary:"Life Insurance Corporation recorded its highest-ever new business premium in FY25, consolidating market leadership.",url:"https://profit.ndtv.com"},
  {title:"Health insurance claim settlement ratio improves across industry in FY25",source:"Moneycontrol",category:"insurance",publishedAt:new Date(Date.now()-10*86400000).toISOString(),summary:"IRDAI data shows improvement in health insurance claim settlement ratios, with several private insurers surpassing 98%.",url:"https://www.moneycontrol.com"},
  {title:"Income tax — maximising deductions under Section 80C and 80D on insurance",source:"TaxGuru",category:"tax",publishedAt:new Date(Date.now()-14*86400000).toISOString(),summary:"Guide to claiming maximum income tax deductions on life insurance under Section 80C and health insurance under Section 80D.",url:"https://taxguru.in/income-tax"},
  {title:"Sensex at 80000 — how equity market rally affects ULIP policyholders",source:"NDTV Profit",category:"markets",publishedAt:new Date(Date.now()-14*86400000).toISOString(),summary:"Analysis of how the strong equity market performance impacts ULIP policyholders and fund allocation strategies.",url:"https://profit.ndtv.com"},
  {title:"Why term insurance must come before any investment — financial basics",source:"Jagoinvestor",category:"personalfinance",publishedAt:new Date(Date.now()-14*86400000).toISOString(),summary:"Why financial planners unanimously recommend buying adequate term insurance before making any investment.",url:"https://jagoinvestor.com"},
  {title:"Critical illness insurance — IRDAI standardises list of covered conditions",source:"IRDAI Official",category:"irdai",publishedAt:new Date(Date.now()-21*86400000).toISOString(),summary:"IRDAI mandated a standard list of critical illnesses covered by all CI policies, bringing uniformity for buyers.",url:"https://irdai.gov.in"},
  {title:"NPS vs PPF vs Insurance — retirement planning for salaried professionals",source:"ET Money Blog",category:"personalfinance",publishedAt:new Date(Date.now()-21*86400000).toISOString(),summary:"Detailed comparison of National Pension System, PPF, and insurance pension plans for salaried employees.",url:"https://etmoney.com/learn"},
];

async function loadNews(){
  document.getElementById('newsLoadingState').classList.remove('hidden');
  document.getElementById('newsGrid').classList.add('hidden');
  document.getElementById('newsDateDisplay').textContent=today();
  try{
    const res=await fetch('./data/news.json');
    if(res.ok){
      const data=await res.json();
      allNewsData=(data.articles&&data.articles.length>5)?data.articles:FALLBACK_NEWS;
      if(data.lastUpdated){
        const u=new Date(data.lastUpdated);
        const t=u.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});
        const el=document.getElementById('newsUpdateTime');
        if(el) el.textContent='Updated '+t;
        document.getElementById('newsDateDisplay').textContent=u.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
      }
    } else throw new Error('fetch failed');
  }catch(e){ allNewsData=FALLBACK_NEWS; }
  document.getElementById('newsLoadingState').classList.add('hidden');
  document.getElementById('newsGrid').classList.remove('hidden');
  renderNewsDigest();
  renderNews();
}

function renderNewsDigest(){
  const top5=allNewsData.filter(n=>safeUrl(n.url)).slice(0,5);
  const el=document.getElementById('newsDigest');
  const list=document.getElementById('digestList');
  if(!el||!list||top5.length===0) return;
  el.classList.remove('hidden');
  const catLabel={insurance:'Insurance',irdai:'IRDAI',mutualfunds:'Mutual Funds',tax:'Tax',banking:'Banking',personalfinance:'Personal Finance',markets:'Markets'};
  list.innerHTML=top5.map((n,i)=>`<div class="digest-item">
    <span class="digest-num">${i+1}</span>
    <div class="digest-body">
      <div class="digest-cat">${catLabel[n.category]||n.category||'NEWS'}</div>
      <a class="digest-headline" href="${safeUrl(n.url)}" target="_blank" rel="noopener noreferrer">${san(n.title)}</a>
    </div></div>`).join('');
}

function getFilteredNews(){
  let list=activeNewsCat==='all'?allNewsData:allNewsData.filter(n=>n.category===activeNewsCat);
  if(activeNewsSearch){ const words=activeNewsSearch.toLowerCase().split(/\s+/).filter(Boolean); list=list.filter(n=>{const h=(n.title+' '+n.summary+' '+n.source).toLowerCase();return words.every(w=>h.includes(w));}); }
  return list.filter(n=>safeUrl(n.url));
}

function renderNews(){
  const filtered=getFilteredNews();
  const catLabel={insurance:'INSURANCE',irdai:'IRDAI',mutualfunds:'MUTUAL FUNDS',tax:'TAX',banking:'BANKING',personalfinance:'PERSONAL FINANCE',markets:'MARKETS'};
  if(filtered.length===0){ document.getElementById('newsGrid').innerHTML='<div class="news-no-results">No articles found.</div>'; return; }
  const bm=getBM();
  document.getElementById('newsGrid').innerHTML=filtered.map(n=>{
    const url=safeUrl(n.url);
    const isBm=bm.articles.some(a=>a.url===n.url);
    return `<div class="news-card">
      <div class="news-card-top">
        <span class="news-source">📰 ${san(n.source)}</span>
        <span class="news-cat-badge ${n.category||'insurance'}">${catLabel[n.category]||'NEWS'}</span>
      </div>
      <a class="news-title-link" href="${url}" target="_blank" rel="noopener noreferrer">${san(n.title)}</a>
      <div class="news-summary">${san(n.summary)}</div>
      <div class="news-footer">
        <span class="news-date">${n.publishedAt?relativeDate(n.publishedAt):san(n.date||'')}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="bm-icon${isBm?' saved':''}" onclick="handleArticleBM('${url}','${n.title.replace(/'/g,"\\'")}','${n.source}')" title="${isBm?'Remove bookmark':'Save article'}">🔖</button>
          <a class="news-read-btn" href="${url}" target="_blank" rel="noopener noreferrer">Read →</a>
        </div>
      </div>
    </div>`;
  }).join('');
}
function handleArticleBM(url,title,source){ const saved=toggleBMArticle(url,title,source); renderNews(); }

document.querySelectorAll('.news-cat').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.news-cat').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeNewsCat=btn.dataset.ncat;renderNews();}));
document.getElementById('newsSearch').addEventListener('input',function(){ activeNewsSearch=this.value.trim(); document.getElementById('newsSearchClear').classList.toggle('hidden',!activeNewsSearch); renderNews(); });
function clearNewsSearch(){ activeNewsSearch='';document.getElementById('newsSearch').value='';document.getElementById('newsSearchClear').classList.add('hidden');renderNews(); }

// ════════════════════════════════════════
// LEARNING SECTION — Topics + Dict + Claims
// ════════════════════════════════════════

// Learning sub-tabs
document.querySelectorAll('.learn-sub-tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeLearnTab=btn.dataset.ltab;
    document.querySelectorAll('.learn-sub-tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.learn-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('lpanel-'+activeLearnTab).classList.add('active');
    if(activeLearnTab==='topics' && !learnLoaded) loadLearnContent();
    if(activeLearnTab==='dictionary' && !dictLoaded) loadDictionary();
    if(activeLearnTab==='claims' && !claimsLoaded) loadClaims();
  });
});

// ── RECENTLY VIEWED ──
function getRecent(){ try{ return JSON.parse(localStorage.getItem('ia_recent')||'[]'); }catch(e){ return []; } }
function addRecent(id){ let r=getRecent().filter(x=>x!==id); r.unshift(id); if(r.length>5) r=r.slice(0,5); localStorage.setItem('ia_recent',JSON.stringify(r)); }
function renderRecent(){
  const strip=document.getElementById('recentStrip');
  const list=document.getElementById('recentList');
  if(!strip||!list||ALL_TOPICS.length===0) return;
  const ids=getRecent();
  const topics=ids.map(id=>ALL_TOPICS.find(t=>t.id===id)).filter(Boolean);
  if(topics.length===0){ strip.classList.add('hidden'); return; }
  strip.classList.remove('hidden');
  list.innerHTML=topics.map(t=>`<div class="recent-item" onclick="jumpToTopic('${t.id}')"><span class="recent-dot"></span><span class="recent-title">${san(t.title)}</span><span class="recent-subj">${san(t.subject)}</span></div>`).join('');
}
function jumpToTopic(id){
  if(!learnLoaded||ALL_TOPICS.length===0) return;
  const idx=ALL_TOPICS.findIndex(t=>t.id===id);
  if(idx<0) return;
  activeSubject='All Topics'; activeDiff='all'; learnSearch='';
  document.getElementById('learnSearch').value='';
  document.querySelectorAll('.subj-btn').forEach(b=>b.classList.toggle('active',b.dataset.subject==='All Topics'));
  document.querySelectorAll('.diff-btn').forEach(b=>b.classList.toggle('active',b.dataset.diff==='all'));
  filteredTopics=[...ALL_TOPICS];
  openTopicDetail(idx);
}

// ── TOPICS ──
async function loadLearnContent(){
  learnLoaded=true;
  const loader=document.getElementById('topicsFlatList');
  loader.innerHTML='<div class="loading-state"><span class="spin">📚</span> Loading 147 topics…</div>';
  try{
    const res=await fetch('./data/learn-content.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    ALL_TOPICS=data.topics||[];
    initLearnUI();
    updateContinueStrip();
    renderRecent();
  }catch(e){
    loader.innerHTML='<div class="no-topics">⚠️ Unable to load topics. Please check your connection and refresh.</div>';
    learnLoaded=false;
  }
}

function initLearnUI(){
  const row=document.getElementById('subjectFilterRow');
  row.innerHTML=LEARN_SUBJECTS.map(s=>`<button class="subj-btn${s==='All Topics'?' active':''}" data-subject="${san(s)}">${san(s)}</button>`).join('');
  row.querySelectorAll('.subj-btn').forEach(btn=>btn.addEventListener('click',()=>{
    activeSubject=btn.dataset.subject;
    row.querySelectorAll('.subj-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderTopicList();
  }));
  document.querySelectorAll('.diff-btn').forEach(btn=>btn.addEventListener('click',()=>{
    activeDiff=btn.dataset.diff;
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderTopicList();
  }));
  renderTopicList();
}

function getFilteredTopics(){
  let list=ALL_TOPICS;
  if(activeSubject!=='All Topics') list=list.filter(t=>t.subject===activeSubject);
  if(activeDiff!=='all') list=list.filter(t=>t.difficulty===activeDiff);
  if(learnSearch){ const words=learnSearch.toLowerCase().split(/\s+/).filter(Boolean); list=list.filter(t=>{const h=(t.title+' '+t.subject+' '+(t.nutshell||'')+' '+(t.example||'')+' '+(t.quiz||'')).toLowerCase();return words.every(w=>h.includes(w));}); }
  return list;
}

function renderTopicList(){
  if(!learnLoaded||ALL_TOPICS.length===0) return;
  filteredTopics=getFilteredTopics();
  const listEl=document.getElementById('topicsFlatList');
  const detailEl=document.getElementById('topicDetailView');
  listEl.classList.remove('hidden');
  detailEl.classList.add('hidden');
  let countEl=document.querySelector('.topics-count');
  if(!countEl){ countEl=document.createElement('div'); countEl.className='topics-count'; listEl.before(countEl); }
  countEl.style.display='block';
  countEl.textContent=filteredTopics.length+' topic'+(filteredTopics.length!==1?'s':'')+' · '+completedTopics.size+'/147 completed';
  if(filteredTopics.length===0){ listEl.innerHTML='<div class="no-topics">No topics found. Try a different filter or keyword.</div>'; return; }
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
  renderRecent();
}

function openTopicDetail(idx){
  const t=filteredTopics[idx];
  if(!t) return;
  // Track recently viewed and last topic
  addRecent(t.id);
  localStorage.setItem('ia_last_topic',t.id);
  const total=filteredTopics.length;
  document.getElementById('topicsFlatList').classList.add('hidden');
  const countEl=document.querySelector('.topics-count');
  if(countEl) countEl.style.display='none';
  const detailEl=document.getElementById('topicDetailView');
  detailEl.classList.remove('hidden');
  const qId=t.id.replace(/[^a-zA-Z0-9]/g,'_');
  const bm=getBM(); const isBm=bm.topics.some(x=>x.id===t.id);
  detailEl.innerHTML=`
    <div class="td-back-row">
      <button class="td-back" onclick="backToList()">← Back</button>
      <span class="td-breadcrumb">${idx+1} of ${total}</span>
      <button class="bm-icon${isBm?' saved':''}" onclick="handleTopicBM('${t.id}','${t.title.replace(/'/g,"\\'")}','${t.subject}')" style="margin-left:auto">${isBm?'🔖':'🔖'}</button>
    </div>
    <div class="topic-card">
      <div class="tc-head"><div class="tc-subject">${san(t.subject)}</div><div class="tc-title">${san(t.title)}</div></div>
      <div class="tc-nutshell"><div class="block-label">🌟 In a Nutshell</div><div class="tc-nut-text">${san(t.nutshell)}</div><div class="tc-hinglish">${san(t.hinglish)}</div></div>
      <div class="tc-example"><div class="block-label">🏃 Real Life Example</div><div class="tc-example-text">${san(t.example)}</div></div>
      <div class="tc-quiz">
        <div class="block-label">🧠 Brain Tickle</div>
        <div class="quiz-question">${san(t.quiz)}</div>
        <div class="quiz-options" id="qopts_${qId}">${t.opts.map((o,i)=>`<button class="quiz-opt" onclick="answerQuiz(this,${i},${t.correct},'${qId}')">${String.fromCharCode(65+i)}. ${san(o)}</button>`).join('')}</div>
        <div class="quiz-result" id="qresult_${qId}"></div>
      </div>
      <div class="tc-nav">
        <button class="tc-nav-btn" onclick="openTopicDetail(${idx-1})" ${idx===0?'disabled':''}>← Prev</button>
        <span class="tc-progress">${idx+1} / ${total}</span>
        <button class="tc-nav-btn primary" onclick="markDone('${t.id}',${idx})">${idx===total-1?'✓ Done':'Next →'}</button>
      </div>
    </div>`;
  window.scrollTo(0,0);
}
function handleTopicBM(id,title,subject){ const saved=toggleBMTopic(id,title,subject); const btn=document.querySelector('.td-back-row .bm-icon'); if(btn) btn.classList.toggle('saved',saved); }
function backToList(){
  document.getElementById('topicDetailView').classList.add('hidden');
  document.getElementById('subjectFilterRow').querySelectorAll('.subj-btn').forEach(b=>b.classList.toggle('active',b.dataset.subject===activeSubject));
  renderTopicList();
}
function answerQuiz(btn,selected,correct,qId){
  document.querySelectorAll(`#qopts_${qId} .quiz-opt`).forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add('correct');});
  if(selected!==correct) btn.classList.add('wrong');
  const r=document.getElementById('qresult_'+qId);
  if(!r) return;
  const right=selected===correct;
  r.textContent=right?'🎉 Correct! Well done.':'❌ Not quite — correct answer highlighted above.';
  r.className='quiz-result show '+(right?'right':'wrong-r');
}
function markDone(tid,idx){ completedTopics.add(tid); saveProgress(); updateContinueStrip(); if(idx<filteredTopics.length-1) openTopicDetail(idx+1); else backToList(); }

document.getElementById('learnSearch').addEventListener('input',function(){
  learnSearch=this.value.trim();
  document.getElementById('learnSearchClear').classList.toggle('hidden',!learnSearch);
  if(learnLoaded&&ALL_TOPICS.length>0) renderTopicList();
});
function clearLearnSearch(){ learnSearch='';document.getElementById('learnSearch').value='';document.getElementById('learnSearchClear').classList.add('hidden');if(learnLoaded)renderTopicList(); }

// ── DICTIONARY ──
async function loadDictionary(){
  dictLoaded=true;
  const loader=document.getElementById('dictLoader');
  loader.classList.remove('hidden');
  try{
    const res=await fetch('./data/dictionary.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    dictData=data.terms||[];
    loader.classList.add('hidden');
    initDictUI();
  }catch(e){
    loader.innerHTML='<div style="color:var(--red)">⚠️ Unable to load dictionary. Please refresh.</div>';
    dictLoaded=false;
  }
}
function initDictUI(){
  const cats=['All',...new Set(dictData.map(t=>t.category))];
  const row=document.getElementById('dictCatRow');
  row.innerHTML=cats.map(c=>`<button class="dict-cat-btn${c==='All'?' active':''}" data-cat="${san(c)}">${san(c)}</button>`).join('');
  row.querySelectorAll('.dict-cat-btn').forEach(btn=>btn.addEventListener('click',()=>{activeDictCat=btn.dataset.cat;row.querySelectorAll('.dict-cat-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderDictionary();}));
  document.getElementById('dictSearch').addEventListener('input',function(){dictSearch=this.value.trim();document.getElementById('dictSearchClear').classList.toggle('hidden',!dictSearch);renderDictionary();});
  renderDictionary();
}
function renderDictionary(){
  const filtered=(activeDictCat==='All'?dictData:dictData.filter(t=>t.category===activeDictCat)).filter(t=>!dictSearch||t.term.toLowerCase().includes(dictSearch.toLowerCase())||t.definition.toLowerCase().includes(dictSearch.toLowerCase())).sort((a,b)=>a.term.localeCompare(b.term));
  let cnt=document.querySelector('.dict-count');
  if(!cnt){cnt=document.createElement('div');cnt.className='dict-count';document.getElementById('dictList').before(cnt);}
  cnt.textContent=filtered.length+' term'+(filtered.length!==1?'s':'');
  if(filtered.length===0){document.getElementById('dictList').innerHTML='<div class="dict-no-results">No terms found.</div>';return;}
  document.getElementById('dictList').innerHTML=filtered.map((t,i)=>`
    <div class="dict-card" id="dc-${i}">
      <div class="dict-card-header" onclick="document.getElementById('dc-${i}').classList.toggle('open')">
        <div class="dict-term">${san(t.term)}</div>
        <div style="display:flex;align-items:center;gap:6px"><span class="dict-cat-tag">${san(t.category)}</span><span class="dict-chevron">›</span></div>
      </div>
      <div class="dict-body">
        <div class="dict-section-label">📖 Definition</div><div class="dict-text">${san(t.definition)}</div>
        <div class="dict-section-label">💡 Example</div><div class="dict-example">${san(t.example)}</div>
        <div class="dict-section-label">⭐ Why It Matters</div><div class="dict-text">${san(t.whyMatters)}</div>
      </div>
    </div>`).join('');
}
function clearDictSearch(){ dictSearch='';document.getElementById('dictSearch').value='';document.getElementById('dictSearchClear').classList.add('hidden');if(dictLoaded)renderDictionary(); }

// ── CLAIMS HUB ──
async function loadClaims(){
  claimsLoaded=true;
  const loader=document.getElementById('claimsLoader');
  loader.classList.remove('hidden');
  try{
    const res=await fetch('./data/claims.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    claimsData=data.claimTypes||[];
    loader.classList.add('hidden');
    initClaimsUI();
  }catch(e){
    loader.innerHTML='<div style="color:var(--red)">⚠️ Unable to load claim guide. Please refresh.</div>';
    claimsLoaded=false;
  }
}
function initClaimsUI(){
  const tabs=document.getElementById('claimTypeTabs');
  tabs.innerHTML=claimsData.map((c,i)=>`<button class="claim-type-btn${i===0?' active':''}" data-ci="${i}">${c.icon} ${san(c.title)}</button>`).join('');
  tabs.querySelectorAll('.claim-type-btn').forEach(btn=>btn.addEventListener('click',()=>{activeClaimType=+btn.dataset.ci;activeSubtype=0;tabs.querySelectorAll('.claim-type-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderClaimsContent();}));
  renderClaimsContent();
}
function renderClaimsContent(){
  const claim=claimsData[activeClaimType];
  if(!claim) return;
  const el=document.getElementById('claimsContent');
  if(claim.subtypes){
    const sub=claim.subtypes[activeSubtype]||claim.subtypes[0];
    el.innerHTML=`<div class="claim-subtype-tabs">${claim.subtypes.map((s,i)=>`<button class="subtype-btn${i===activeSubtype?' active':''}" onclick="setClaimSubtype(${i})">${san(s.title)}</button>`).join('')}</div>${buildClaimCard(claim,sub)}`;
  } else { el.innerHTML=buildClaimCard(claim,claim); }
}
function setClaimSubtype(i){ activeSubtype=i; renderClaimsContent(); }
function buildClaimCard(claim,data){
  const docs=(data.documents||[]).map(d=>`<div class="claim-doc"><span class="doc-icon">📄</span><div><div class="doc-name">${san(d.doc)}</div><div class="doc-note">${san(d.note)}</div></div></div>`).join('');
  const steps=(data.steps||[]).map(s=>`<div class="claim-step"><span class="step-num">${s.step}</span><div class="step-body"><div class="step-title">${san(s.title)}</div><div class="step-detail">${san(s.detail)}</div></div></div>`).join('');
  const mistakes=(data.mistakes||[]).map(m=>`<li>${san(m)}</li>`).join('');
  const tips=(data.tips||[]).map(t=>`<li>${san(t)}</li>`).join('');
  const intro=data.type?'':(`<div class="claim-intro"><div class="claim-intro-title">${claim.icon} ${san(claim.title)}</div><div class="claim-intro-text">${san(claim.intro)}</div></div>`);
  return `<div class="claim-content-card">${intro}
    ${docs?`<div class="claim-section"><div class="claim-section-title">📋 Documents Required</div><div class="claim-docs">${docs}</div></div>`:''}
    ${steps?`<div class="claim-section"><div class="claim-section-title">✅ Step-by-Step Process</div><div class="claim-steps">${steps}</div></div>`:''}
    ${data.timeline?`<div class="claim-section"><div class="claim-section-title">⏱️ Timeline</div><div class="claim-timeline">${san(data.timeline)}</div></div>`:''}
    ${mistakes?`<div class="claim-section"><div class="claim-section-title">⚠️ Common Mistakes</div><ul class="claim-list mistakes">${mistakes}</ul></div>`:''}
    ${tips?`<div class="claim-section"><div class="claim-section-title">💡 Pro Tips</div><ul class="claim-list tips">${tips}</ul></div>`:''}
  </div>`;
}

// ════════════════════════════════════════
// CALCULATORS
// HLV, SIP, Retirement in app.js
// IRR, TVM, EMI, ULIP lazy loaded
// ════════════════════════════════════════
document.querySelectorAll('.tool-tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tool-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tool-'+btn.dataset.tool).classList.add('active');
  if(['irr','tvm','emi','ulip'].includes(btn.dataset.tool)) loadCalcsExtra();
}));

async function loadCalcsExtra(){
  if(calcExtraLoaded) return;
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='js/calcs-extra.js';
    s.onload=()=>{calcExtraLoaded=true;resolve();};
    s.onerror=()=>reject(new Error('Failed to load calcs-extra.js'));
    document.head.appendChild(s);
  });
}

function showCalcResult(id,mainVal,mainLabel,rows){
  const el=document.getElementById(id);
  el.classList.remove('hidden');
  el.innerHTML=`<div class="calc-result-main">${mainVal}</div><div class="calc-result-label">${mainLabel}</div><div class="calc-result-rows">${rows.map(([l,v])=>`<div class="calc-result-row"><span>${l}</span><span>${v}</span></div>`).join('')}</div>`;
}
function showCalcError(id,msg){ const el=document.getElementById(id); el.classList.remove('hidden'); el.innerHTML=`<div class="calc-error">⚠️ ${msg}</div>`; }

function calcHLV(){
  const income=getVal('hlv-income')*12, age=getVal('hlv-age'), retire=getVal('hlv-retire');
  const existing=getVal('hlv-existing'), growth=getVal('hlv-growth')/100, inflation=getVal('hlv-inflation')/100;
  if(!income||!age||age>=retire){showCalcError('hlv-result','Please fill all fields correctly.');return;}
  const years=retire-age, dr=Math.max(inflation,0.01), gr=growth;
  const hlv=Math.abs(gr-dr)<0.001?income*years:income*((1-Math.pow((1+gr)/(1+dr),years))/(dr-gr));
  const add=Math.max(0,hlv-existing);
  showCalcResult('hlv-result',fmtCr(Math.round(add)),'Additional life cover recommended',[['Human Life Value',fmtCr(Math.round(hlv))],['Existing Cover',fmtCr(existing)],['Additional Needed',fmtCr(Math.round(add))],['Years to retirement',years+' years'],['Annual income',fmtCr(income)]]);
}
function calcSIP(){
  const P=getVal('sip-amount'),r=getVal('sip-return')/100/12,n=getVal('sip-years')*12;
  if(!P||!r||!n){showCalcError('sip-result','Please fill all fields.');return;}
  const FV=P*((Math.pow(1+r,n)-1)/r)*(1+r), inv=P*n, gains=FV-inv;
  showCalcResult('sip-result',fmtCr(Math.round(FV)),'Estimated maturity value',[['Total invested',fmtCr(Math.round(inv))],['Estimated returns',fmtCr(Math.round(gains))],['Total maturity value',fmtCr(Math.round(FV))],['Wealth multiplier',(FV/inv).toFixed(2)+'×']]);
}
function calcRetirement(){
  const ca=getVal('ret-age'),ra=getVal('ret-retire'),me=getVal('ret-expenses'),inf=getVal('ret-inflation')/100,ret=getVal('ret-return')/100,le=getVal('ret-life');
  if(!ca||!me||ca>=ra||ra>=le){showCalcError('ret-result','Please check all fields. Age order: Current < Retirement < Life Expectancy.');return;}
  const ytr=ra-ca, dur=le-ra;
  const meAtRetire=me*Math.pow(1+inf,ytr);
  const corpus=meAtRetire*12/ret*(1-Math.pow(1+ret,-dur));
  const mr=ret/12, n=ytr*12;
  const sip=corpus*mr/(Math.pow(1+mr,n)-1);
  showCalcResult('ret-result',fmtCr(Math.round(corpus)),'Retirement corpus you need',[['Years to build corpus',ytr+' years'],['Monthly expenses today',fmtCr(me)],['Monthly expenses at retirement',fmtCr(Math.round(meAtRetire))],['Retirement duration',dur+' years'],['Monthly investment needed now',fmtCr(Math.round(sip))]]);
}

// Lazy calc stubs
async function calcIRR(){ await loadCalcsExtra(); _calcIRR(); }
async function calcTVM(){ await loadCalcsExtra(); _calcTVM(); }
async function calcEMI(){ await loadCalcsExtra(); _calcEMI(); }
async function calcULIP(){ await loadCalcsExtra(); _calcULIP(); }
function setTvmMode(m,b){ tvmMode=m; document.querySelectorAll('.tvm-mode').forEach(x=>x.classList.remove('active')); b.classList.add('active'); const l=document.getElementById('tvm-amount-label'); if(l) l.textContent=m==='fv'?'Present Value (₹)':'Future Value (₹)'; document.getElementById('tvm-result').classList.add('hidden'); }

// ════════════════════════════════════════
// DAILY QUIZ
// ════════════════════════════════════════
let dqTopics=[],dqCurrent=0,dqScore=0,dqAnswered=false;
function getDQDate(){ return new Date().toISOString().slice(0,10); }
function getDQState(){ try{ const s=JSON.parse(localStorage.getItem('ia_dq')||'{}'); if(s.date===getDQDate()) return s; }catch(e){} return {date:getDQDate(),completed:false,score:0}; }
function saveDQState(s){ localStorage.setItem('ia_dq',JSON.stringify({...s,date:getDQDate()})); }
function selectDQTopics(topics){
  const d=getDQDate(); let seed=0; for(let i=0;i<d.length;i++) seed=(seed*31+d.charCodeAt(i))%1000003;
  const idx=[]; let s=seed;
  while(idx.length<5){ s=(s*1103515245+12345)&0x7fffffff; const i=s%topics.length; if(!idx.includes(i))idx.push(i); }
  return idx.map(i=>topics[i]);
}
function updateDQUI(){
  const state=getDQState(), btn=document.getElementById('qcStartBtn'), sub=document.getElementById('qcStatus');
  if(!btn||!sub) return;
  if(state.completed){ btn.textContent=(state.score||0)+'/5 ✓'; btn.className='qc-btn done'; sub.textContent='Completed today · Score: '+(state.score||0)+'/5'; btn.onclick=()=>showDQResult(state.score); }
  else { btn.textContent='Start →'; btn.className='qc-btn'; sub.textContent='5 questions · Changes every day'; btn.onclick=openDailyQuiz; }
}
async function openDailyQuiz(){
  if(ALL_TOPICS.length===0){if(!learnLoaded){loadLearnContent();let a=0;while(ALL_TOPICS.length===0&&a<25){await new Promise(r=>setTimeout(r,200));a++;}}}
  if(ALL_TOPICS.length===0){alert('Unable to load quiz. Please try again.');return;}
  const state=getDQState();
  if(state.completed){showDQResult(state.score);return;}
  dqTopics=selectDQTopics(ALL_TOPICS);dqCurrent=0;dqScore=0;dqAnswered=false;
  const o=document.getElementById('dqOverlay');
  document.getElementById('dqModal').scrollTop=0;
  o.classList.remove('hidden');requestAnimationFrame(()=>o.classList.add('active'));
  document.body.style.overflow='hidden';
  renderDQQuestion();
}
function renderDQQuestion(){
  const t=dqTopics[dqCurrent],total=dqTopics.length,pct=Math.round((dqCurrent/total)*100);
  document.getElementById('dqContent').innerHTML=`
    <div class="dq-header"><div class="dq-title">🧠 Daily Quiz</div><div class="dq-meta">${getDQDate()} · Q${dqCurrent+1} of ${total}</div></div>
    <div class="dq-progress-bar"><div class="dq-progress-fill" style="width:${pct}%"></div></div>
    <div class="dq-q-num">Question ${dqCurrent+1} / ${total}</div>
    <div class="dq-question">${san(t.quiz)}</div>
    <div class="dq-options" id="dq-opts">${t.opts.map((o,i)=>`<button class="dq-opt" onclick="answerDQ(this,${i},${t.correct})">${String.fromCharCode(65+i)}. ${san(o)}</button>`).join('')}</div>
    <div class="dq-feedback" id="dq-fb"></div>
    <button class="dq-next-btn" id="dq-next" onclick="nextDQ()">${dqCurrent===total-1?'See Result →':'Next →'}</button>`;
  dqAnswered=false;
}
function answerDQ(btn,sel,correct){
  if(dqAnswered) return;dqAnswered=true;
  document.querySelectorAll('#dq-opts .dq-opt').forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add('correct');});
  if(sel!==correct)btn.classList.add('wrong');else dqScore++;
  const fb=document.getElementById('dq-fb');
  fb.textContent=sel===correct?'🎉 Correct!':'❌ Incorrect — correct answer highlighted.';
  fb.className='dq-feedback show '+(sel===correct?'right':'wrong-r');
  document.getElementById('dq-next').classList.add('show');
}
function nextDQ(){ dqCurrent++; if(dqCurrent>=dqTopics.length){saveDQState({completed:true,score:dqScore});updateDQUI();showDQResult(dqScore);}else{renderDQQuestion();document.getElementById('dqModal').scrollTop=0;} }
function showDQResult(score){
  const badges=['keep-going','keep-going','good','good','great','perfect'];
  const msgs=['Keep going!','Keep going!','Good effort!','Good effort!','Excellent!','Perfect! 🎯'];
  const o=document.getElementById('dqOverlay');
  document.getElementById('dqModal').scrollTop=0;
  o.classList.remove('hidden');requestAnimationFrame(()=>o.classList.add('active'));
  document.body.style.overflow='hidden';
  document.getElementById('dqContent').innerHTML=`
    <div class="dq-header"><div class="dq-title">Quiz Complete!</div><div class="dq-meta">${getDQDate()}</div></div>
    <div style="text-align:center;padding:20px 0">
      <div class="dq-result-score">${score}</div><div class="dq-result-out">out of 5</div>
      <div class="dq-result-msg">${msgs[score]}</div>
      <span class="dq-result-badge ${badges[score]}">${badges[score]==='perfect'?'🏆 Perfect':badges[score]==='great'?'⭐ Excellent':badges[score]==='good'?'👍 Good':'💪 Keep Going'}</span>
    </div>
    <div style="text-align:center;margin-top:12px;font-size:11px;color:var(--g400)">New quiz tomorrow at midnight</div>
    <div style="text-align:center;margin-top:14px"><button class="dq-close-btn" onclick="closeDailyQuiz()">Close</button></div>`;
}
function closeDailyQuiz(){ const o=document.getElementById('dqOverlay'); o.classList.remove('active'); setTimeout(()=>o.classList.add('hidden'),250); document.body.style.overflow=''; }

// ── INIT ──
(function init(){
  document.getElementById('newsDateDisplay').textContent=today();
  renderPlans();
  updateContinueStrip();
  updateBMCount();
  updateDQUI();
})();
