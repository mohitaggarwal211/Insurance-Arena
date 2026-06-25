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

let completedTopics = new Set(JSON.parse(localStorage.getItem('ia_done') || '[]'));

// ── HELPERS ──
function cc(v){ return v>=99?'high':v>=98?'mid':'low'; }
function cw(v){ return Math.max(0,Math.min(100,((v-97)/3)*100)); }
function san(s){ const d=document.createElement('div'); d.textContent=String(s||''); return d.innerHTML; }

// ── ANALYTICS TRACKING (GA4) ──
function track(event, params) {
  try {
    if (typeof gtag === 'function') gtag('event', event, params || {});
    if (typeof clarity === 'function') clarity('set', event, JSON.stringify(params||{}));
  } catch(e) {}
}

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
function showSection(name){ track('section_view', {section_name: name});
  if(activeSection===name){ document.getElementById('mobileNav').classList.add('hidden'); return; }
  activeSection=name;
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById('sec-'+name);
  if(el) el.classList.add('active');
  document.querySelectorAll('[data-sec]').forEach(b=>b.classList.toggle('active',b.dataset.sec===name));
  document.getElementById('mobileNav').classList.add('hidden');
  window.scrollTo(0,0);
  // News disabled — rebuilding in next version
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
// NEWS SECTION — Google News RSS
// Improvements: Status bar · Featured story · Skeleton loading
// Category counts · XSS-safe bookmarks via data-* + delegation
// ════════════════════════════════════════

// ── SKELETON LOADER ──
function showSkeletons(){
  const skel = (i) => `<div class="skel-card">
    <div class="skel skel-row1"></div>
    <div class="skel skel-row2"></div>
    <div class="skel skel-row3"></div>
    <div class="skel skel-row4"></div>
    <div class="skel skel-row5"></div>
    <div class="skel-footer"><div class="skel skel-date"></div><div class="skel skel-btn"></div></div>
  </div>`;
  const el = document.getElementById('newsLoadingState');
  if(el){ el.innerHTML = [0,1,2,3,4,5].map(skel).join(''); el.classList.remove('hidden'); }
}
function hideSkeletons(){
  const el = document.getElementById('newsLoadingState');
  if(el) el.classList.add('hidden');
}

// ── NEWS STATUS BAR ──
function renderStatusBar(data){
  const bar  = document.getElementById('newsStatusBar');
  const dot  = document.getElementById('nsbDot');
  const cnt  = document.getElementById('nsbCount');
  const cats = document.getElementById('nsbCats');
  const time = document.getElementById('nsbTime');
  if(!bar) return;
  const count = (data.articles||[]).filter(isValidArticle).length;
  if(count===0){ bar.classList.add('hidden'); return; }
  const catCount = new Set((data.articles||[]).filter(isValidArticle).map(a=>a.category)).size;
  cnt.textContent  = count + (count===1?' article':' articles');
  cats.textContent = catCount + (catCount===1?' category':' categories');
  if(data.lastUpdated){
    try{
      const d=new Date(data.lastUpdated);
      const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const hh=d.getHours(),mm=String(d.getMinutes()).padStart(2,'0');
      const ap=hh>=12?'PM':'AM',h=hh%12||12;
      time.textContent=`Updated: ${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()} • ${h}:${mm} ${ap}`;
    }catch(e){ time.textContent=''; }
  }
  bar.classList.remove('hidden');
}

// ── CATEGORY FILTER COUNTS ──
function updateCategoryFilters(){
  const counts={};
  allNewsData.forEach(a=>{ counts[a.category]=(counts[a.category]||0)+1; });
  const labels={insurance:'Insurance',irdai:'IRDAI',mutualfunds:'Mutual Funds',
    tax:'Tax',banking:'Banking',personalfinance:'Personal Finance',markets:'Markets'};
  document.querySelectorAll('.news-cat').forEach(btn=>{
    const cat=btn.dataset.ncat;
    if(cat==='all'){
      btn.textContent='All News'+(allNewsData.length?` (${allNewsData.length})`:'');
    } else {
      const n=counts[cat]||0;
      btn.textContent=(labels[cat]||cat)+(n?` (${n})`:'');
    }
  });
}

async function loadNews(){
  showSkeletons();
  document.getElementById('newsGrid')?.classList.add('hidden');
  document.getElementById('newsFeatured').classList.add('hidden');
  const ndd=document.getElementById('newsDateDisplay'); if(ndd) ndd.textContent=today();
  try{
    const res=await fetch('./data/news.json?t='+Date.now());
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    allNewsData=(data.articles||[]).filter(isValidArticle);
    renderStatusBar(data);
    if(data.lastUpdated){
      const d=new Date(data.lastUpdated);
      const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const hh=d.getHours(),mm=String(d.getMinutes()).padStart(2,'0');
      const ap=hh>=12?'PM':'AM',h=hh%12||12;
      const el=document.getElementById('newsUpdateTime');
      if(el) el.textContent=`Updated ${h}:${mm} ${ap}`;
    }
  }catch(e){ allNewsData=[]; }
  hideSkeletons();
  document.getElementById('newsGrid')?.classList.remove('hidden');
  updateCategoryFilters();
  renderNewsDigest();
  renderFeaturedStory();
  renderNews();
}

// Runtime validation
function isValidArticle(a){
  if(!a||!a.title||a.title.length<8) return false;
  if(!a.source||!a.url) return false;
  if(typeof a.url!=='string'||!a.url.startsWith('https://')) return false;
  if(a.url.includes('news.google.com/search')) return false;
  try{ new URL(a.url); return true; }catch(e){ return false; }
}

function getFilteredNews(){
  let list=activeNewsCat==='all'?allNewsData:allNewsData.filter(n=>n.category===activeNewsCat);
  if(activeNewsSearch){
    const words=activeNewsSearch.toLowerCase().split(/\s+/).filter(Boolean);
    list=list.filter(n=>{const h=(n.title+' '+n.summary+' '+n.source).toLowerCase();return words.every(w=>h.includes(w));});
  }
  return list.filter(isValidArticle);
}

// ── TOP 10 HEADLINES DIGEST ──
function renderNewsDigest(){
  const top=allNewsData.filter(isValidArticle).slice(0,10);
  const el=document.getElementById('newsDigest');
  const list=document.getElementById('digestList');
  if(!el||!list||top.length===0){ if(el) el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  const catLabel={insurance:'Insurance',irdai:'IRDAI',mutualfunds:'Mutual Funds',
    tax:'Tax',banking:'Banking',personalfinance:'Personal Finance',markets:'Markets'};
  list.innerHTML=top.map((n,i)=>`<div class="digest-item">
    <span class="digest-num">${i+1}</span>
    <div class="digest-body">
      <div class="digest-cat">${catLabel[n.category]||n.category}</div>
      <a class="digest-headline" href="${n.url}" target="_blank" rel="noopener noreferrer">${san(n.title)}</a>
      <div class="digest-meta">${san(n.source)} · ${n.publishedAt?relativeDate(n.publishedAt):''}</div>
    </div></div>`).join('');
}

// ── FEATURED STORY (latest article) ──
function renderFeaturedStory(){
  const wrap=document.getElementById('newsFeatured');
  if(!wrap) return;
  const article=allNewsData.filter(isValidArticle)[0];
  if(!article){ wrap.classList.add('hidden'); return; }
  const catLabel={insurance:'Insurance',irdai:'IRDAI',mutualfunds:'Mutual Funds',
    tax:'Tax',banking:'Banking',personalfinance:'Personal Finance',markets:'Markets'};
  wrap.classList.remove('hidden');
  wrap.innerHTML=`<div class="news-card-featured">
    <div class="ncf-label">⭐ Featured Story</div>
    <div class="ncf-top">
      <span class="news-source">📰 ${san(article.source)}</span>
      <span class="news-cat-badge ${article.category||'insurance'}">${catLabel[article.category]||'NEWS'}</span>
    </div>
    <a class="ncf-title" href="${article.url}" target="_blank" rel="noopener noreferrer">${san(article.title)}</a>
    <div class="ncf-summary">${san(article.summary)}</div>
    <div class="ncf-footer">
      <div class="ncf-meta"><strong>${san(article.source)}</strong> · ${article.publishedAt?relativeDate(article.publishedAt):''}</div>
      <a class="ncf-read" href="${article.url}" target="_blank" rel="noopener noreferrer">Read Article →</a>
    </div>
  </div>`;
}

// ── NEWS CARDS (XSS-safe: data-* attributes, no inline onclick) ──
function renderNews(){
  const filtered=getFilteredNews();
  const catLabel={insurance:'INSURANCE',irdai:'IRDAI',mutualfunds:'MUTUAL FUNDS',
    tax:'TAX',banking:'BANKING',personalfinance:'PERSONAL FINANCE',markets:'MARKETS'};
  const grid=document.getElementById('newsGrid'); if(!grid) return;
  if(filtered.length===0){
    const searching=activeNewsSearch||activeNewsCat!=='all';
    grid.innerHTML=searching
      ?'<div class="news-empty-state"><div class="nes-icon">🔍</div><div class="nes-title">No articles match your filter</div><div class="nes-text">Try a different category or clear the search.</div></div>'
      :'<div class="news-empty-state"><div class="nes-icon">📰</div><div class="nes-title">News Refreshing Soon</div><div class="nes-text">Articles auto-update at <strong>7 AM</strong> and <strong>4 PM IST</strong>.</div></div>';
    return;
  }
  const bm=getBM();
  // Skip index 0 if it's the featured story and no filter active
  const startIdx=(activeNewsCat==='all'&&!activeNewsSearch&&allNewsData.length>0&&filtered[0]===allNewsData[0])?1:0;
  const gridArticles=filtered.slice(startIdx);
  grid.innerHTML=gridArticles.map(n=>{
    const isBm=bm.articles.some(a=>a.url===n.url);
    return `<div class="news-card">
      <div class="news-card-top">
        <span class="news-source">📰 ${san(n.source)}</span>
        <span class="news-cat-badge ${n.category||'insurance'}">${catLabel[n.category]||'NEWS'}</span>
      </div>
      <a class="news-title-link" href="${n.url}" target="_blank" rel="noopener noreferrer">${san(n.title)}</a>
      <div class="news-summary">${san(n.summary)}</div>
      <div class="news-footer">
        <span class="news-date">${n.publishedAt?relativeDate(n.publishedAt):''}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="bm-icon${isBm?' saved':''}"
            data-bm-url="${san(n.url)}"
            data-bm-title="${san(n.title)}"
            data-bm-source="${san(n.source)}"
            title="${isBm?'Remove bookmark':'Save article'}">🔖</button>
          <a class="news-read-btn" href="${n.url}" target="_blank" rel="noopener noreferrer">Read full article →</a>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── BOOKMARK EVENT DELEGATION (XSS-safe) ──
document.getElementById('newsGrid')?.addEventListener('click', function(e){
  const btn = e.target.closest('[data-bm-url]');
  if(!btn) return;
  e.preventDefault(); e.stopPropagation();
  const url    = btn.dataset.bmUrl;
  const title  = btn.dataset.bmTitle;
  const source = btn.dataset.bmSource;
  if(!url) return;
  toggleBMArticle(url, title, source);
  btn.classList.toggle('saved', getBM().articles.some(a=>a.url===url));
});

// Category filter
document.querySelectorAll('.news-cat').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.news-cat').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeNewsCat=btn.dataset.ncat;
  renderNews();
}));
// Search
document.getElementById('newsSearch')?.addEventListener('input',function(){
  activeNewsSearch=this.value.trim();
  document.getElementById('newsSearchClear')?.classList.toggle('hidden',!activeNewsSearch);
  renderNews();
});
function clearNewsSearch(){ activeNewsSearch='';const ns=document.getElementById('newsSearch');if(ns)ns.value='';document.getElementById('newsSearchClear')?.classList.add('hidden');renderNews(); }

// ════════════════════════════════════════
// LEARNING SECTION — Topics + Dict + Claims
// ════════════════════════════════════════

// Learning segment control
const learnTabDesc = {
  topics: '147 topics · Quiz every concept · Track progress',
  dictionary: '61 insurance terms · Searchable · Definitions + Examples',
  claims: 'Life · Health · Travel claim process guides',
};
document.querySelectorAll('.learn-seg').forEach(btn=>{
  btn.addEventListener('click',()=>{
    activeLearnTab=btn.dataset.ltab;
    document.querySelectorAll('.learn-seg').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.learn-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('lpanel-'+activeLearnTab).classList.add('active');
    const desc=document.getElementById('learnTabDesc');
    if(desc) desc.textContent=learnTabDesc[activeLearnTab]||'';
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

function openTopicDetail(idx){ track('topic_opened', {topic_index: idx});
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
      <button class="td-share-btn" onclick="shareLearningTopic('${t.title.replace(/'/g,"\\'")}','${(t.subject||'').replace(/'/g,"\\'")}')">📤</button>
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
  // Scroll to topic detail, not page top
  const dtv=document.getElementById('topicDetailView'); if(dtv) dtv.scrollIntoView({behavior:'smooth',block:'start'});
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
        <button class="dict-share-btn" onclick="shareDictTerm('${t.term.replace(/'/g,"\\'")}','${(t.definition||'').replace(/'/g,"\\'").replace(/"/g,'')}')">📤 Share</button>
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

}));



function showCalcResult(id,mainVal,mainLabel,rows){
  const el=document.getElementById(id);
  el.classList.remove('hidden');
  el.innerHTML=`<div class="calc-result-main">${mainVal}</div><div class="calc-result-label">${mainLabel}</div><div class="calc-result-rows">${rows.map(([l,v])=>`<div class="calc-result-row"><span>${l}</span><span>${v}</span></div>`).join('')}</div>`;
}
function showCalcError(id,msg){ const el=document.getElementById(id); el.classList.remove('hidden'); el.innerHTML=`<div class="calc-error">⚠️ ${msg}</div>`; }

function calcHLV(){ track('calculator_used', {calc_type: 'hlv'});
  const income=getVal('hlv-income')*12, age=getVal('hlv-age'), retire=getVal('hlv-retire');
  const existing=getVal('hlv-existing'), growth=getVal('hlv-growth')/100, inflation=getVal('hlv-inflation')/100;
  if(!income||!age||age>=retire){showCalcError('hlv-result','Please fill all fields correctly.');return;}
  const years=retire-age, dr=Math.max(inflation,0.01), gr=growth;
  const hlv=Math.abs(gr-dr)<0.001?income*years:income*((1-Math.pow((1+gr)/(1+dr),years))/(dr-gr));
  const add=Math.max(0,hlv-existing);
  showCalcResult('hlv-result',fmtCr(Math.round(add)),'Additional life cover recommended',[['Human Life Value',fmtCr(Math.round(hlv))],['Existing Cover',fmtCr(existing)],['Additional Needed',fmtCr(Math.round(add))],['Years to retirement',years+' years'],['Annual income',fmtCr(income)]]);
}
function calcSIP(){ track('calculator_used', {calc_type: 'sip'});
  const P=getVal('sip-amount'),r=getVal('sip-return')/100/12,n=getVal('sip-years')*12;
  if(!P||!r||!n){showCalcError('sip-result','Please fill all fields.');return;}
  const FV=P*((Math.pow(1+r,n)-1)/r)*(1+r), inv=P*n, gains=FV-inv;
  showCalcResult('sip-result',fmtCr(Math.round(FV)),'Estimated maturity value',[['Total invested',fmtCr(Math.round(inv))],['Estimated returns',fmtCr(Math.round(gains))],['Total maturity value',fmtCr(Math.round(FV))],['Wealth multiplier',(FV/inv).toFixed(2)+'×']]);
}
function calcRetirement(){ track('calculator_used', {calc_type: 'retirement'});
  const ca=getVal('ret-age'),ra=getVal('ret-retire'),me=getVal('ret-expenses'),inf=getVal('ret-inflation')/100,ret=getVal('ret-return')/100,le=getVal('ret-life');
  if(!ca||!me||ca>=ra||ra>=le){showCalcError('ret-result','Please check all fields. Age order: Current < Retirement < Life Expectancy.');return;}
  const ytr=ra-ca, dur=le-ra;
  const meAtRetire=me*Math.pow(1+inf,ytr);
  const corpus=meAtRetire*12/ret*(1-Math.pow(1+ret,-dur));
  const mr=ret/12, n=ytr*12;
  const sip=corpus*mr/(Math.pow(1+mr,n)-1);
  showCalcResult('ret-result',fmtCr(Math.round(corpus)),'Retirement corpus you need',[['Years to build corpus',ytr+' years'],['Monthly expenses today',fmtCr(me)],['Monthly expenses at retirement',fmtCr(Math.round(meAtRetire))],['Retirement duration',dur+' years'],['Monthly investment needed now',fmtCr(Math.round(sip))]]);
}

// ── IRR CALCULATOR ──
function calcIRR(){
  const premium=getVal('irr-premium'),ppt=getVal('irr-ppt'),term=getVal('irr-term'),maturity=getVal('irr-maturity');
  if(!premium||!ppt||!term||!maturity||ppt>term){showCalcError('irr-result','Please fill all fields. Premium paying term must be ≤ policy term.');return;}
  const cf=[];
  for(let y=0;y<=term;y++){
    if(y<ppt) cf.push(-premium);
    else if(y===term) cf.push(maturity);
    else cf.push(0);
  }
  function npv(r){return cf.reduce((s,c,t)=>s+c/Math.pow(1+r,t),0);}
  let lo=-0.99,hi=5.0;
  if(npv(lo)*npv(hi)>0){showCalcError('irr-result','No valid IRR found. Please check if maturity value is greater than total premiums paid.');return;}
  for(let i=0;i<200;i++){const mid=(lo+hi)/2;if(Math.abs(hi-lo)<0.000001)break;if(npv(lo)*npv(mid)<0)hi=mid;else lo=mid;}
  const irr=((lo+hi)/2)*100,totalP=premium*ppt,gain=maturity-totalP;
  showCalcResult('irr-result',irr.toFixed(2)+'% p.a.','Approximate Internal Rate of Return',[
    ['Total Premium Paid',fmtCr(totalP)],
    ['Maturity / Death Value',fmtCr(maturity)],
    ['Total Gain',fmtCr(Math.max(0,gain))],
    ['Premium Paying Term',ppt+' years'],
    ['Policy Term',term+' years'],
  ]);
}

// ── TVM CALCULATOR ──
function setTvmMode(m,b){
  tvmMode=m;
  document.querySelectorAll('.tvm-mode').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const l=document.getElementById('tvm-amount-label');
  if(l) l.textContent=m==='fv'?'Present Value (₹)':'Future Value (₹)';
  document.getElementById('tvm-result').classList.add('hidden');
}
function calcTVM(){
  const amount=getVal('tvm-amount'),rate=getVal('tvm-rate')/100,years=getVal('tvm-years');
  const n=parseFloat(document.getElementById('tvm-compound').value)||1;
  if(!amount||!rate||!years){showCalcError('tvm-result','Please fill all fields.');return;}
  const er=rate/n,periods=years*n;
  if(tvmMode==='fv'){
    const fv=amount*Math.pow(1+er,periods),gain=fv-amount;
    const compLabel=n===1?'Annual':n===2?'Half-Yearly':n===4?'Quarterly':'Monthly';
    showCalcResult('tvm-result',fmtCr(Math.round(fv)),'Future Value of your money',[
      ['Present Value (Today)',fmtCr(amount)],
      ['Future Value',fmtCr(Math.round(fv))],
      ['Total Growth',fmtCr(Math.round(gain))],
      ['Growth Multiple',(fv/amount).toFixed(2)+'×'],
      ['Compounding',compLabel],
      ['Formula','FV = PV × (1 + r/n)^(n×t)'],
    ]);
  } else {
    const pv=amount/Math.pow(1+er,periods);
    showCalcResult('tvm-result',fmtCr(Math.round(pv)),'Present Value (what future money is worth today)',[
      ['Future Value',fmtCr(amount)],
      ['Present Value (Today)',fmtCr(Math.round(pv))],
      ['Discount',fmtCr(Math.round(amount-pv))],
      ['Time Period',years+' years'],
      ['Discount Rate',(rate*100).toFixed(2)+'% p.a.'],
      ['Formula','PV = FV / (1 + r/n)^(n×t)'],
    ]);
  }
}

// ── EMI CALCULATOR ──
function calcEMI(){ track('calculator_used', {calc_type: 'emi'});
  const P=getVal('emi-loan'),r=getVal('emi-rate')/100/12,n=getVal('emi-tenure')*12;
  if(!P||!r||!n){showCalcError('emi-result','Please fill all fields.');return;}
  const emi=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const total=emi*n,interest=total-P;
  showCalcResult('emi-result',fmtCr(Math.round(emi)),'Monthly EMI',[
    ['Loan Amount',fmtCr(P)],
    ['Total Interest',fmtCr(Math.round(interest))],
    ['Total Repayment',fmtCr(Math.round(total))],
    ['Loan Tenure',getVal('emi-tenure')+' years'],
  ]);
  // Year-wise amortization
  let bal=P,rows='';
  for(let y=1;y<=getVal('emi-tenure');y++){
    let yp=0,yi=0;
    for(let m=1;m<=12&&(y-1)*12+m<=n;m++){const ip=bal*r;const pp=emi-ip;yi+=ip;yp+=pp;bal-=pp;}
    rows+=`<tr><td>Year ${y}</td><td>${fmtCr(Math.round(yp))}</td><td>${fmtCr(Math.round(yi))}</td><td>${bal>0?fmtCr(Math.round(bal)):'—'}</td></tr>`;
  }
  const amEl=document.getElementById('emi-amort');
  amEl.classList.remove('hidden');
  amEl.innerHTML=`<div class="amort-title">Year-wise Amortization</div><div style="overflow-x:auto"><table class="amort-table"><thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// ── ULIP CALCULATOR — PPT + FMC + Year-wise Projection ──
function calcULIP(){
  const premium  = getVal('ulip-premium');
  const ppt      = getVal('ulip-ppt');
  const term     = getVal('ulip-term');
  const retRate  = getVal('ulip-return') / 100;
  const fmc      = getVal('ulip-fmc') / 100;
  if(!premium||!ppt||!term||!retRate){showCalcError('ulip-result','Please fill all fields. PPT must be ≤ Policy Term.');return;}
  if(ppt>term){showCalcError('ulip-result','Premium Paying Term (PPT) cannot be greater than Policy Term. Reduce PPT or increase Policy Term.');return;}
  const netRate = retRate - fmc; // effective return after FMC
  let fund = 0;
  const yearData = [];
  for(let y=1;y<=term;y++){
    if(y<=ppt) fund = (fund + premium) * (1 + netRate);
    else fund = fund * (1 + netRate);
    yearData.push({year:y, fund:Math.round(fund), paid:Math.min(y,ppt)*premium});
  }
  const totalPremium = premium * ppt;
  const finalFund = Math.round(fund);
  const gain = finalFund - totalPremium;
  // Compute approximate CAGR
  const cagr = (Math.pow(finalFund/totalPremium, 1/term) - 1) * 100;
  showCalcResult('ulip-result',
    fmtCr(finalFund),
    'Estimated Fund Value at Maturity',
    [
      ['Total Premium Paid',fmtCr(totalPremium)],
      ['Premium Paying Term',ppt+' years'],
      ['Policy Term',term+' years'],
      ['Estimated Fund Value',fmtCr(finalFund)],
      ['Estimated Wealth Gain',fmtCr(Math.max(0,gain))],
      ['Approx CAGR',cagr.toFixed(2)+'% p.a.'],
      ['Net Return (after '+fmc*100+'% FMC)',(netRate*100).toFixed(2)+'% p.a.'],
    ]
  );
  // Year-wise projection table
  const el = document.getElementById('ulip-result');
  const milestones = yearData.filter(d => d.year % 5 === 0 || d.year === 1 || d.year === term);
  el.innerHTML += `
    <div style="margin-top:14px">
      <div class="amort-title">📈 Year-wise Fund Projection</div>
      <div style="overflow-x:auto">
        <table class="amort-table">
          <thead><tr><th style="text-align:left">Year</th><th>Premium Paid (Total)</th><th>Estimated Fund Value</th></tr></thead>
          <tbody>${milestones.map(d=>`<tr><td>Year ${d.year}${d.year===term?' (Maturity)':''}</td><td>${fmtCr(d.paid)}</td><td>${fmtCr(d.fund)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="calc-note" style="margin-top:8px">⚠️ Illustrative projections only. Actual returns are not guaranteed and depend on market performance and insurer charges.</div>
    </div>`;
}

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

// ── RESET CALCULATORS ──
function resetCalc(id){
  const panels={
    hlv:['hlv-income','hlv-age','hlv-retire','hlv-existing','hlv-growth','hlv-inflation'],
    sip:['sip-amount','sip-return','sip-years'],
    retirement:['ret-age','ret-retire','ret-expenses','ret-inflation','ret-return','ret-life'],
    irr:['irr-premium','irr-ppt','irr-term','irr-maturity'],
    tvm:['tvm-amount','tvm-rate','tvm-years'],
    emi:['emi-loan','emi-rate','emi-tenure'],
    ulip:['ulip-premium','ulip-ppt','ulip-term','ulip-return','ulip-fmc'],
  };
  const defaults={
    'hlv-growth':'5','hlv-inflation':'6','hlv-retire':'60',
    'sip-return':'12','ret-retire':'60','ret-inflation':'6','ret-return':'10','ret-life':'80',
    'tvm-rate':'8','ulip-return':'10','ulip-fmc':'1.35',
  };
  (panels[id]||[]).forEach(fid=>{
    const el=document.getElementById(fid);
    if(el){ el.value=defaults[fid]||''; }
  });
  const res=document.getElementById(id+'-result');
  if(res) res.classList.add('hidden');
  const am=document.getElementById(id+'-amort');
  if(am) am.classList.add('hidden');
  if(id==='tvm') document.getElementById('tvm-result')?.classList.add('hidden');
}

// ── INIT ──
(function init(){
  const ndd=document.getElementById('newsDateDisplay'); if(ndd) ndd.textContent=today();
  renderPlans();
  updateContinueStrip();
  updateBMCount();
  updateDQUI();

})();


// ════════════════════════════════════════════════════════════
// COMPARE MODULE v3.0 — Clean rebuild
// All pending fixes + UX enhancements integrated
// ════════════════════════════════════════════════════════════

let activeCat   = 'term';
let activeMode  = 'plans'; // plans | avb | toolkit
let parRendered    = false;
let nonparRendered = false;
let annuityRendered = false;
let activeNP    = 'nishchit';

// ── SECONDARY ACTION BAR ──
function initCatActionBar() {
  const bar = document.getElementById('catActionBar');
  if (!bar) return;
  bar.querySelectorAll('.cab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.cab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchMode(btn.dataset.mode);
    });
  });
}

function switchMode(mode) {
  activeMode = mode;
  track('compare_mode', {mode: mode, category: activeCat});
  const isPlans   = mode === 'plans';
  const isAvB     = mode === 'avb';
  const isTk      = mode === 'toolkit';

  // Hide/show content for current category
  // Term: mix of classes and IDs — handle correctly
  if (activeCat === 'term') {
    ['controls-bar','results-meta'].forEach(cls => {
      const el = document.querySelector('.' + cls);
      if (el) el.classList.toggle('hidden', !isPlans);
    });
    ['cardsGrid','tableWrap','noResults'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', !isPlans);
    });
  } else {
    const catEl = { par:'sec-par', nonpar:'sec-nonpar', annuity:'sec-annuity' }[activeCat];
    if (catEl) {
      const el = document.getElementById(catEl);
      if (el) el.classList.toggle('hidden', !isPlans);
    }
  }

  const avbDiv = document.getElementById('sec-avb');
  const tkDiv  = document.getElementById('sec-toolkit');
  if (avbDiv) { avbDiv.classList.toggle('hidden', !isAvB); if (isAvB) renderAvB(activeCat); }
  if (tkDiv)  { tkDiv.classList.toggle('hidden', !isTk);  if (isTk)  renderToolkit(activeCat); }
}

// ── CAT-TAB SWITCHING ──
function switchCompareCat(cat) {
  activeCat = cat;
  track('compare_category', {category: cat});
  activeMode = 'plans';
  if (typeof buildProductRegistry === 'function') PRODUCT_REGISTRY = buildProductRegistry();
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));

  // Reset action bar
  const bar = document.getElementById('catActionBar');
  if (bar) { bar.querySelectorAll('.cab-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'plans')); }

  // Hide all compare content
  const isTerm    = cat === 'term';
  const isPar     = cat === 'par';
  const isNonPar  = cat === 'nonpar';
  const isAnnuity = cat === 'annuity';

  ['controls-bar','results-meta'].forEach(cls => { const el = document.querySelector('.' + cls); if (el) el.classList.toggle('hidden', !isTerm); });
  ['cardsGrid','tableWrap','noResults'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', !isTerm); });

  const secPar    = document.getElementById('sec-par');
  const secNP     = document.getElementById('sec-nonpar');
  const secAnn    = document.getElementById('sec-annuity');
  const secAvB    = document.getElementById('sec-avb');
  const secTk     = document.getElementById('sec-toolkit');

  if (secPar)  secPar.classList.toggle('hidden', !isPar);
  if (secNP)   secNP.classList.toggle('hidden', !isNonPar);
  if (secAnn)  secAnn.classList.toggle('hidden', !isAnnuity);
  if (secAvB)  secAvB.classList.add('hidden');
  if (secTk)   secTk.classList.add('hidden');

  // Render on first show
  if (isPar && !parRendered)    renderPar();
  if (isNonPar && !nonparRendered) renderNonPar();
  if (isAnnuity && !annuityRendered) renderAnnuity();
}

// Bind cat-btns
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('coming')) return;
    switchCompareCat(btn.dataset.cat);
  });
});
initCatActionBar();

// ════════════════════════════════════════════════════════════
// PARTICIPATING — ANMOL AKSHAYA
// Layout: Key Highlights → Features → Returns → Sales Story
// ════════════════════════════════════════════════════════════
function renderPar() {
  if (parRendered) return; parRendered = true;
  const wrap = document.getElementById('parWrap'); if (!wrap) return;
  const base  = ANMOL_PLANS.find(p => p.isBase);
  const comps = ANMOL_PLANS.filter(p => !p.isBase);
  const all   = [base, ...comps];

  let html = `<div class="prod-header">
    <h2 class="prod-title">Participating Endowment Plans</h2>
    <p class="prod-sub">Comparing ${all.length} plans · ${comps.filter(p=>!p.notAvailable).length} verified competitors</p>
  </div>
  <div class="prod-note-bar">⚠️ All plans are <strong>Participating</strong> — bonus is non-guaranteed and depends on insurer performance each year.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    if (p.notAvailable && !p.isBase) {
      html += `<div class="prod-card">
        <div class="pc-top"><div><div class="pc-co">${san(p.company)}</div><div class="pc-pl">${san(p.plan)}</div></div><div class="pc-type">${san(p.type)}</div></div>
        <div class="pc-na-block">❌ PPT 10 + PT 20 combination not available under this plan</div>
        <div class="pc-unique">${san(p.uniqueFeature||'')}</div>
        ${p.productUrl?`<a href="${san(p.productUrl)}" target="_blank" rel="noopener noreferrer" class="pc-btn">Visit Product →</a>`:''}
      </div>`;
      return;
    }

    const meta = getMeta ? getMeta(p.id) : {};
    const highlights = meta.keyHighlights || (p.isBase ? ['Non-Linked Participating Endowment','Compound Reversionary + Terminal Bonus','Joint Life Protection for spouse','Extended Life Cover up to age 85'] : []);
    const limitations = meta.limitations || [];

    html += `<div class="prod-card${p.isBase?' prod-card-base':''}${p.pending?' prod-card-pending':''}">
      <div class="pc-top">
        <div><div class="pc-co">${san(p.company)}</div><div class="pc-pl">${san(p.plan)}</div>
        ${p.isBase?'<span class="prod-base-tag">Base Plan</span>':''}
        ${p.uin&&p.uin!=='Verify from current policy document'?`<div class="pc-uin">UIN: ${san(p.uin)}</div>`:''}
        </div>
        <div class="pc-type">${san(p.type||'Non-Linked Participating')}</div>
      </div>`;

    if (highlights.length) {
      html += `<div class="pc-section-title">✨ Key Highlights</div>
      <ul class="pc-highlights">${highlights.map(h=>`<li>${san(h)}</li>`).join('')}</ul>`;
    }

    html += `<div class="pc-section-title">📋 Plan Features</div>
    <div class="pc-feature-list">
      ${p.isBase?`
      <div class="pc-feat"><span class="pc-fl">Entry Age</span><span class="pc-fv">30 days – 65 yrs (Single) | 18-50 (Joint)</span></div>
      <div class="pc-feat"><span class="pc-fl">Maturity Age</span><span class="pc-fv">85 years</span></div>
      <div class="pc-feat"><span class="pc-fl">PPT Options</span><span class="pc-fv">Single Pay | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 years</span></div>
      <div class="pc-feat"><span class="pc-fl">Joint Life</span><span class="pc-fv">✅ Yes — Spouse at 20% of SA</span></div>
      <div class="pc-feat"><span class="pc-fl">Policy Loan</span><span class="pc-fv">✅ Up to 80% of Surrender Value</span></div>
      <div class="pc-feat"><span class="pc-fl">Riders</span><span class="pc-fv">Accidental Death | Critical Illness | Surgical Care | Hospital Care</span></div>
      `:p.features?Object.entries(p.features).map(([k,v])=>`<div class="pc-feat"><span class="pc-fl">${san(k)}</span><span class="pc-fv">${san(v)}</span></div>`).join(''):'<div class="pc-feat-note">Refer official brochure for complete features</div>'}
    </div>`;

    if (!p.pending && p.sa) {
      html += `<div class="pc-section-title">💼 Sum Assured</div>
      <div class="pc-nums">
        <div class="pc-num-row"><span class="pc-nl">Sum Assured</span><span class="pc-nv">₹${Number(p.sa).toLocaleString('en-IN')}</span></div>
      </div>`;
    }

    if (p.pitch) {
      html += `<div class="pc-section-title">💬 Sales Story</div><div class="pc-pitch">"${san(p.pitch)}"</div>`;
    }

    html += `<div class="pc-links">
      ${p.productUrl?`<a href="${san(p.productUrl)}" target="_blank" rel="noopener noreferrer" class="pc-btn">Product →</a>`:''}
      ${p.brochureUrl&&!p.brochureUrl.startsWith('http')?'':(p.brochureUrl?`<a href="${san(p.brochureUrl)}" target="_blank" rel="noopener noreferrer" class="pc-btn-sec">Brochure →</a>`:'')}
    </div></div>`;
  });

  html += '</div>';

  wrap.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
// NON-PAR MODULE — 3 sub-products with corrected tab names
// ════════════════════════════════════════════════════════════
function renderNonPar() {
  if (!nonparRendered) {
    nonparRendered = true;
    document.querySelectorAll('.npsub').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.npsub').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeNP = btn.dataset.np;
        renderNPContent();
      });
    });
  }
  renderNPContent();
}

function renderNPContent() {
  const wrap = document.getElementById('nonparWrap'); if (!wrap) return;
  if (activeNP === 'nishchit')    renderNishchit(wrap);
  else if (activeNP === 'savings') renderSavingsComp(wrap);
  else if (activeNP === 'income')  renderIncomeComp(wrap);
}

// ── NISHCHIT AAYUSH ──
function renderNishchit(wrap) {
  const base  = NISHCHIT_PLANS.find(p => p.isBase);
  const comps = NISHCHIT_PLANS.filter(p => !p.isBase && !p.excluded);
  const excl  = NISHCHIT_PLANS.filter(p => p.excluded);
  const all   = [base, ...comps];

  let html = `<div class="prod-header">
    <h2 class="prod-title">Guaranteed Early Income Plans</h2>
    <p class="prod-sub">Comparing ${all.length} plans · Income from Year 1 or 2</p>
  </div>
  <div class="prod-note-bar">✅ All comparable plans are <strong>Non-Participating</strong> — returns fully guaranteed.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    const meta = (typeof getMeta !== 'undefined') ? getMeta(p.isBase?'nishchit-absli':p.id) : {};
    const highlights = meta.keyHighlights || (p.isBase?['Guaranteed income from Year 1 (0 deferment)','Level income for 20 years','Guaranteed lump sum at maturity','Non-Participating — 100% guaranteed returns']:[]);

    html += `<div class="prod-card${p.isBase?' prod-card-base':''}${p.pending?' prod-card-pending':''}">
      <div class="pc-top">
        <div><div class="pc-co">${san(p.company)}</div><div class="pc-pl">${san(p.plan)}</div>
        ${p.isBase?'<span class="prod-base-tag">Base Plan</span>':''}
        ${p.tag?`<span class="prod-tag">${san(p.tag)}</span>`:''}
        </div>
        <div class="pc-type">${san(p.type||'Non-Linked Non-Par')}</div>
      </div>`;

    if (highlights.length) {
      html += `<div class="pc-section-title">✨ Key Highlights</div>
      <ul class="pc-highlights">${highlights.map(h=>`<li>${san(h)}</li>`).join('')}</ul>`;
    }

    html += `<div class="pc-section-title">📋 Plan Features</div>
    <div class="pc-feature-list">
      <div class="pc-feat"><span class="pc-fl">Income From</span><span class="pc-fv">${san(p.incomeFrom||'—')}</span></div>
      <div class="pc-feat"><span class="pc-fl">Income Type</span><span class="pc-fv">${san(p.incomeType||'—')}</span></div>
      <div class="pc-feat"><span class="pc-fl">Income Period</span><span class="pc-fv">${san(p.incomePeriod?p.incomePeriod+' years':'—')}</span></div>
      ${p.sa?`<div class="pc-feat"><span class="pc-fl">Sum Assured</span><span class="pc-fv">₹${Number(p.sa).toLocaleString('en-IN')}</span></div>`:''}
      ${p.cashback?`<div class="pc-feat"><span class="pc-fl">Instant Cashback</span><span class="pc-fv">₹${Number(p.cashback).toLocaleString('en-IN')}</span></div>`:''}
      ${p.note?`<div class="pc-feat-note">ⓘ ${san(p.note)}</div>`:''}
    </div>`;

    if (!p.pending && (p.annualIncome || p.annualIncomeY2 || p.lumpsum)) {
      html += `<div class="pc-section-title">💰 Income Structure</div>
      <div class="pc-nums">
        ${p.annualIncome?`<div class="pc-num-row pc-highlight"><span class="pc-nl">Annual Income</span><span class="pc-nv pc-green">₹${Number(p.annualIncome).toLocaleString('en-IN')}/yr</span></div>`:''}
        ${p.annualIncomeY2?`<div class="pc-num-row pc-highlight"><span class="pc-nl">Income Yr 2 (start)</span><span class="pc-nv pc-green">₹${Number(p.annualIncomeY2).toLocaleString('en-IN')}/yr</span></div>`:''}
        ${p.lumpsum?`<div class="pc-num-row"><span class="pc-nl">Lump Sum at Maturity</span><span class="pc-nv">₹${Number(p.lumpsum).toLocaleString('en-IN')}</span></div>`:''}
      </div>`;
    } else if (p.pending) {
      html += `<div class="pc-section-title">💰 Income Structure</div><div class="pc-pending-block">⏳ Details will be updated</div>`;
    }

    if (p.pitch) { html += `<div class="pc-section-title">💬 Sales Story</div><div class="pc-pitch">"${san(p.pitch)}"</div>`; }

    html += `<div class="pc-links">
      ${p.productUrl?`<a href="${san(p.productUrl)}" target="_blank" rel="noopener noreferrer" class="pc-btn">Product →</a>`:''}
      ${p.calcUrl?`<a href="${san(p.calcUrl)}" target="_blank" rel="noopener noreferrer" class="pc-btn-sec">Calculator →</a>`:''}
    </div></div>`;
  });
  html += '</div>';

  // Income comparison table (no returns/IRR)
  const conf = all.filter(p => (p.annualIncome || p.annualIncomeY2) && !p.pending);
  if (conf.length > 1) {
    html += `<div class="prod-irr-table"><h3 class="prod-irr-title">💰 Income Comparison</h3>
    <div class="prod-irr-scroll"><table class="pirr-tbl"><thead>
    <tr><th>Plan</th><th>Income/yr</th><th>Income Period</th><th>Lump Sum</th></tr>
    </thead><tbody>
    ${conf.map(p=>`<tr${p.isBase?' class="pirr-base"':''}>
      <td><strong>${san(p.company)}</strong><br/><small>${san(p.plan.split('(')[0])}</small></td>
      <td>${p.annualIncome?'₹'+Number(p.annualIncome).toLocaleString('en-IN')+'/yr (level)':p.annualIncomeY2?'₹'+Number(p.annualIncomeY2).toLocaleString('en-IN')+'/yr from Yr2':'—'}</td>
      <td>${san(p.incomePeriod||'—')} yrs</td>
      <td>${p.lumpsum?'₹'+Number(p.lumpsum).toLocaleString('en-IN'):'—'}</td>
    </tr>`).join('')}
    </tbody></table></div></div>`;
  }

  if (excl.length) {
    html += `<div class="prod-excl"><h4>Excluded from Comparison</h4>
    ${excl.map(p=>`<div class="prod-excl-item">❌ <strong>${san(p.company)} ${san(p.plan)}</strong> — ${san(p.excludedReason||'Does not meet benchmark criteria')}</div>`).join('')}</div>`;
  }
  wrap.innerHTML = html;
}

// ── SAVINGS + INCOME COMP (Feature cards — clean) ──
function renderSavingsComp(wrap) { renderFeatureCards(wrap, SAVINGS_PLANS, 'Guaranteed Savings Plans', 'Non-Linked Non-Par Savings | Benchmark: Age 35 | Male | ₹1L | 10 PPT | 20 PT'); }
function renderIncomeComp(wrap) { renderFeatureCards(wrap, INCOME_PLANS, 'Guaranteed Long Term Income Plans', 'Non-Linked Non-Par Income | Benefit Payout Period: 20/25/30 years'); }

function renderFeatureCards(wrap, plans, title, bench) {
  const base  = plans.find(p => p.isBase);
  const comps = plans.filter(p => !p.isBase);
  const all   = [base, ...comps];

  let html = `<div class="prod-header">
    <h2 class="prod-title">${san(title)}</h2>
  </div>
  <div class="prod-note-bar">ⓘ Data from official insurer sources. Fields not publicly available are hidden.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    if (!p) return;
    const isTW  = p.typeWarning;
    const isRep = p.replacementNote;

    html += `<div class="prod-card${p.isBase?' prod-card-base':''}${isTW?' prod-card-warn':''}">
      <div class="pc-top">
        <div><div class="pc-co">${san(p.company)}</div><div class="pc-pl">${san(p.plan)}</div>
        ${p.isBase?'<span class="prod-base-tag">Base Plan</span>':''}
        </div>
        <div class="pc-type${isTW?' pc-type-warn':''}">${san(p.type||'—')}</div>
      </div>`;

    if (isTW) html += `<div class="pc-warn">⚠️ Participating plan — returns include non-guaranteed bonus. Different structure from Non-Par base plan.</div>`;
    if (isRep) html += `<div class="pc-rep-note">ⓘ ${san(isRep)}</div>`;

    // Key highlights
    const highlights = p.isBase ? (title.includes('Savings') ?
      ['Non-Linked, Non-Participating — guaranteed returns','Joint Life Protection option','Loyalty Additions at maturity','Multiple PPT options (5-12 years)','Multiple rider options available'] :
      ['Non-Linked, Non-Participating — guaranteed returns','Income for 20/25/30 years (customer choice)','Option 2: Income + Return of Premium at end','Loyalty Additions boost income','Life cover throughout policy term']
    ) : [];

    if (highlights.length) {
      html += `<div class="pc-section-title">✨ Key Highlights</div>
      <ul class="pc-highlights">${highlights.map(h=>`<li>${san(h)}</li>`).join('')}</ul>`;
    }

    // Features
    const featItems = [];
    if (p.entryAge && !p.entryAge.includes('Verify')) featItems.push(['Entry Age', p.entryAge]);
    if (p.ppt && !p.ppt.includes('Verify')) featItems.push(['PPT', p.ppt]);
    if (p.incomePeriods?.length) featItems.push(['Income Period', p.incomePeriods.join(' / ')]);
    if (p.planOptions?.length) featItems.push(['Plan Options', p.planOptions.join(' | ')]);
    if (p.deathBenefit && !p.deathBenefit.includes('Verify')) featItems.push(['Death Benefit', p.deathBenefit]);
    if (p.riders && !p.riders.includes('Verify')) featItems.push(['Riders', p.riders]);
    if (p.maturityBenefit) featItems.push(['Maturity Benefit', typeof p.maturityBenefit==='string'?p.maturityBenefit:'✅ Yes']);
    if (p.guaranteedAdditions) featItems.push(['Guaranteed Additions', '✅ Yes']);
    if (p.loyaltyAdditions) featItems.push(['Loyalty Additions', '✅ Yes']);
    if (p.loan) featItems.push(['Policy Loan', '✅ Yes']);
    if (p.jointLife) featItems.push(['Joint Life', '✅ Yes']);

    if (featItems.length) {
      html += `<div class="pc-section-title">📋 Plan Features</div>
      <div class="pc-feature-list">${featItems.map(([l,v])=>`<div class="pc-feat"><span class="pc-fl">${san(l)}</span><span class="pc-fv">${san(v)}</span></div>`).join('')}</div>`;
    }

    // Sales story
    if (p.uniqueFeature) { html += `<div class="pc-section-title">💬 Sales Story</div><div class="pc-pitch">"${san(p.pitch||p.uniqueFeature)}"</div>`; }

    html += `<div class="pc-links">
      ${p.url?`<a href="${san(p.url)}" target="_blank" rel="noopener noreferrer" class="pc-btn">Product →</a>`:''}
      ${p.brochure&&!p.brochure.startsWith('Verify')?`<a href="${san(p.brochure)}" target="_blank" rel="noopener noreferrer" class="pc-btn-sec">Brochure →</a>`:''}
    </div></div>`;
  });
  html += '</div>';
  wrap.innerHTML = html;
}

// ════════════════════════════════════════════════════════════
// ANNUITY — FULL MATRIX REBUILD with all UX enhancements
// P4a: No rate in header | P4b/c: Sticky fixed | P4d: No benchmark section
// UX1-9: All integrated
// ════════════════════════════════════════════════════════════
let annFilter = 'All';
let annHL = null;
let annVS = false;
let annVSSel = ['absli'];
let annColl = {};
let annNotePopup = null;
const ANN_CATS = ['All','Life Annuity','Certain Period','Corpus Protection','Joint Life','Full ROP','Partial ROP','CI Cover','Living Benefit','Deferred','NPS Special'];
const ANN_SI = { yes:'✅', no:'❌', sim:'⚠️', unique:'★', na:'—' };

function renderAnnuity() {
  if (annuityRendered) return; annuityRendered = true;
  const outer = document.getElementById('sec-annuity');
  if (!outer) return;

  const base  = ANNUITY_PLANS.find(p => p.isBase);
  const comps = ANNUITY_PLANS.filter(p => !p.isBase);

  outer.innerHTML = `
  <div id="annTopBar">
    <div class="ann-header">
      <div class="ann-hrow">
        <div>
          <h2 class="ann-title">Annuity Plan Comparison</h2>
          <p class="ann-subtitle">ABSLI Guaranteed Annuity Plus vs ${comps.length} plans · UIN: ${san(base?.uin||'109N132V17')}</p>
        </div>
        <div class="ann-meta-pills">
          <span class="ann-pill">14 Variants</span>
          <span class="ann-pill">${ANNUITY_PLANS.length} Plans</span>
          <span class="ann-pill">10 Companies</span>
        </div>
      </div>
    </div>
    <div class="ann-legend" id="annLegend">
      <span class="aleg aleg-yes">✅ Available</span>
      <span class="aleg aleg-no">❌ Not Available</span>
      <span class="aleg aleg-sim">⚠️ ⓘ Similar—tap</span>
      <span class="aleg aleg-unique">★ ABSLI Unique</span>
      <span class="aleg aleg-na">— N/A</span>
      <span class="ann-pin-badge">📌 Pinned</span>
    </div>
    <div class="ann-controls" id="annControls">
      <div class="ann-filter-label">Filter by type:</div>
      <div class="ann-pills" id="annPillRow"></div>
      <div class="ann-vs-row">
        <div class="ann-vtog-group">
          <button class="ann-vtog active" id="annMatBtn" onclick="annSetView('matrix')">⊞ Matrix</button>
          <button class="ann-vtog" id="annCdBtn" onclick="annSetView('cards')">☰ Cards</button>
        </div>
        <button class="ann-vs-btn" id="annVsBtn" onclick="annToggleVS()">⚡ VS Compare</button>
        <span class="ann-vs-hint hidden" id="annVsHint">Tap company to add/remove</span>
      </div>
    </div>
  </div>

  <div id="annBody">
    <div id="annMatrixView">
      <div class="ann-tbl-box" id="annTblBox">
        <table class="ann-tbl" id="annTbl"></table>
      </div>
      <div class="ann-hl-info hidden" id="annHLInfo"></div>
    </div>
    <div id="annCardsView" class="hidden"></div>
  </div>

  <div class="ann-note-popup hidden" id="annNotePopup" onclick="annCloseNote()">
    <div class="ann-note-inner" onclick="event.stopPropagation()">
      <button class="ann-note-close" onclick="annCloseNote()">✕</button>
      <div id="annNoteContent"></div>
    </div>
  </div>`;

  annRenderPills();
  annRenderMatrix(); // still renders embedded matrix (used by filter pills)
  annRenderCards();  // default view is cards
  document.getElementById('annMatrixView')?.classList.add('hidden');
  document.getElementById('annCardsView')?.classList.remove('hidden');
}

function annFixStickyTop() {
  // Height now handled by CSS flex (sec-annuity fills viewport, ann-tbl-box uses flex:1)
  // This function kept as no-op to avoid errors from existing callers
}

function annRenderPills() {
  const row = document.getElementById('annPillRow'); if (!row) return;
  row.innerHTML = ANN_CATS.map(c => {
    const count = c === 'All' ? ANNUITY_OPTION_ROWS.length : ANNUITY_OPTION_ROWS.filter(o=>o.category===c).length;
    return `<button class="ann-pill${annFilter===c?' active':''}" onclick="annSetFilter('${c}')">${san(c)}${c!=='All'?` (${count})`:''}</button>`;
  }).join('');
}

function annSetFilter(f) {
  annFilter = f; annRenderPills(); annRenderMatrix();
  const fi = document.getElementById('annFilterInfo');
  if (fi) {
    const cnt = f==='All'?ANNUITY_OPTION_ROWS.length:ANNUITY_OPTION_ROWS.filter(o=>o.category===f).length;
    fi.textContent = f!=='All' ? `Showing ${cnt} of ${ANNUITY_OPTION_ROWS.length} variants` : '';
  }
}

function annToggleVS() {
  annVS = !annVS; if (!annVS) annVSSel = ['absli'];
  const btn = document.getElementById('annVsBtn');
  if (btn) { btn.classList.toggle('on', annVS); btn.textContent = annVS ? '✕ Exit VS' : '⚡ VS Compare'; }
  document.getElementById('annVsHint')?.classList.toggle('hidden', !annVS);
  annRenderMatrix();
}

function annToggleVSSel(id) {
  if (id === 'absli') return;
  annVSSel = annVSSel.includes(id) ? annVSSel.filter(x=>x!==id) : [...annVSSel, id];
  annRenderMatrix();
}

function annToggleColl(g) { annColl[g] = !annColl[g]; annRenderMatrix(); }

function annHL_row(id) {
  annHL = annHL === id ? null : id; annRenderMatrix();
  const info = document.getElementById('annHLInfo');
  if (annHL) {
    const opt = ANNUITY_OPTION_ROWS.find(o => o.id === id);
    info?.classList.remove('hidden');
    if (info) info.textContent = '📌 ' + (opt?.label||'') + ' — scroll right to compare all companies';
  } else info?.classList.add('hidden');
}

function annSetView(v) {
  if (v === 'matrix') {
    annOpenMatrixPopup();
  } else {
    // Cards view — just render inline
    document.getElementById('annMatBtn')?.classList.remove('active');
    document.getElementById('annCdBtn')?.classList.add('active');
    document.getElementById('annCardsView')?.classList.remove('hidden');
    document.getElementById('annMatrixView')?.classList.add('hidden');
    annRenderCards();
  }
}

function annOpenMatrixPopup() {
  // Create popup if it doesn't exist
  let popup = document.getElementById('annMatrixPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'annMatrixPopup';
    popup.className = 'ann-matrix-popup hidden';
    popup.innerHTML = `
      <div class="amp-topbar">
        <div class="amp-title-row">
          <div class="amp-title">⊞ Annuity Option Matrix</div>
          <button class="amp-close" onclick="annCloseMatrixPopup()">✕</button>
        </div>
        <div class="amp-legend">
          <span class="aleg aleg-yes">✅ Available</span>
          <span class="aleg aleg-no">❌ Not Available</span>
          <span class="aleg aleg-sim">⚠️ Similar</span>
          <span class="aleg aleg-unique">★ ABSLI Unique</span>
          <span class="aleg" style="color:var(--g500)">— N/A</span>
        </div>
        <div class="amp-pills" id="ampPillRow"></div>
      </div>
      <div class="amp-tbl-wrap" id="ampTblWrap">
        <table class="ann-tbl" id="ampTbl"></table>
      </div>`;
    document.body.appendChild(popup);
  }

  popup.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // prevent page scroll behind popup

  // Render pills and matrix into popup
  annRenderPopupPills();
  annRenderMatrixInto('ampTbl');

  // Highlight matrix button
  document.getElementById('annMatBtn')?.classList.add('active');
  document.getElementById('annCdBtn')?.classList.remove('active');
}

function annCloseMatrixPopup() {
  const popup = document.getElementById('annMatrixPopup');
  if (popup) popup.classList.add('hidden');
  document.body.style.overflow = '';
  document.getElementById('annMatBtn')?.classList.remove('active');
  document.getElementById('annCdBtn')?.classList.add('active');
  // Switch to cards view
  document.getElementById('annCardsView')?.classList.remove('hidden');
  annRenderCards();
}

function annRenderPopupPills() {
  const row = document.getElementById('ampPillRow');
  if (!row) return;
  const cats = ['All', ...new Set(ANNUITY_OPTION_ROWS.map(r=>r.category).filter(Boolean))];
  row.innerHTML = cats.map((c,i) =>
    `<button class="ann-pill${i===0?' active':''}" onclick="annFilterPopup('${c}',this)">${c}</button>`
  ).join('');
}

function annFilterPopup(cat, btn) {
  document.querySelectorAll('#ampPillRow .ann-pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  annRenderMatrixInto('ampTbl', cat === 'All' ? null : cat);
}

function annRenderMatrixInto(tableId, filterCat) {
  const tbl = document.getElementById(tableId);
  if (!tbl) return;
  // Re-use existing annRenderMatrix logic but target this table
  const base  = ANNUITY_PLANS.find(p => p.isBase);
  const comps = ANNUITY_PLANS.filter(p => !p.isBase);
  const rows  = filterCat
    ? ANNUITY_OPTION_ROWS.filter(r => r.category === filterCat)
    : ANNUITY_OPTION_ROWS;

  const allPlans = [base, ...comps];

  const icon = v => v==='yes'?'✅':v==='no'?'❌':v==='unique'?'<span style="color:#FACC15">★</span>':v==='sim'?'⚠️':'<span style="color:var(--g500)">—</span>';
  const pct  = p => {
    const n = ANNUITY_OPTION_ROWS.filter(r=>['yes','unique'].includes((p.options||{})[r.id])).length;
    return Math.round(n/ANNUITY_OPTION_ROWS.length*100);
  };

  let thead = '<thead><tr>';
  thead += `<th class="ann-corner">ABSLI Option / Variant</th>`;
  allPlans.forEach(p => {
    const p2 = pct(p);
    const fc = p2>=90?'var(--teal)':p2>=60?'#22C55E':'#FBBF24';
    thead += `<th class="ann-co-th${p.isBase?' ann-base-th':''}">
      <div class="ann-co-name${p.isBase?' base':''}">${san(p.company)}</div>
      <div class="ann-co-plan">${san(p.plan)}</div>
      <div class="cov-bar-wrap" style="max-width:80px;margin:4px auto 0">
        <div style="display:flex;justify-content:space-between;font-size:8px;margin-bottom:2px">
          <span>Coverage</span><span style="color:${fc};font-weight:700">${ANNUITY_OPTION_ROWS.filter(r=>['yes','unique'].includes((p.options||{})[r.id])).length}/${ANNUITY_OPTION_ROWS.length}</span>
        </div>
        <div style="background:rgba(255,255,255,.08);border-radius:3px;height:4px;overflow:hidden">
          <div style="width:${p2}%;background:${fc};height:100%;border-radius:3px"></div>
        </div>
      </div>
      ${p.calcUrl?`<a href="${san(p.calcUrl)}" target="_blank" class="am-calc">🧮 Calc →</a>`:''}
    </th>`;
  });
  thead += '</tr></thead>';

  let tbody = '<tbody>';
  rows.forEach(row => {
    tbody += `<tr><td class="ann-opt-td">
      <div class="ann-opt-label${row.unique?' ann-unique-label':''}">${row.unique?'★ ':''}${san(row.label)}</div>
      ${row.desc?`<div class="ann-opt-desc">${san(row.desc)}</div>`:''}
    </td>`;
    allPlans.forEach(p => {
      const v = (p.options||{})[row.id] || '—';
      const isU = v==='unique';
      tbody += `<td class="ann-cell${p.isBase?' base-col':''}${isU?' unique':''}">${icon(v)}</td>`;
    });
    tbody += '</tr>';
  });
  tbody += '</tbody>';

  tbl.innerHTML = thead + tbody;
}

function annRenderCards() {
  const view = document.getElementById('annCardsView'); if (!view) return;
  const all = ANNUITY_PLANS;
  let h = '<div class="ann-cards-grid">';
  all.forEach(p => {
    const meta = (typeof getMeta !== 'undefined') ? getMeta(p.isBase?'absli-ann':'ann_'+p.id) : {};
    const highlights = p.isBase ? (meta.keyHighlights||ANNUITY_OPTION_ROWS.filter(o=>o.unique).map(o=>o.label)) : [];
    const uOpts = ANNUITY_OPTION_ROWS.filter(o => (p.options||{})[o.id]==='unique');
    const optCount = ANNUITY_OPTION_ROWS.filter(o => ['yes','unique'].includes((p.options||{})[o.id])).length;

    h += `<div class="ann-card${p.isBase?' ann-card-base':''}">
      <div class="ac-header">
        <div><div class="ac-company">${san(p.company)}</div><div class="ac-plan">${san(p.plan)}</div>
        ${p.isBase?'<span class="prod-base-tag">Base Plan</span>':''}
        ${p.badge?`<span class="ann-badge">${san(p.badge)}</span>`:''}
        </div>
        <div class="ac-type-badge">${san(p.type)}</div>
      </div>
      <div style="font-size:9px;color:var(--g500)">UIN: ${san(p.uin||'—')}</div>`;

    if (highlights.length||uOpts.length) {
      h += `<div class="pc-section-title">✨ Key Highlights</div><ul class="pc-highlights">`;
      (highlights.length?highlights:uOpts.map(o=>o.label)).slice(0,4).forEach(hl=>{ h+=`<li>${san(hl)}</li>`; });
      h += '</ul>';
    }

    h += `<div class="pc-section-title">📋 Features</div>
    <div class="ac-feat-grid">
      <div class="ac-feat"><span class="ac-fl">Type</span><span class="ac-fv">${san(p.type)}</span></div>
      <div class="ac-feat"><span class="ac-fl">Options</span><span class="ac-fv">${san(String(p.totalOptions))}</span></div>
      <div class="ac-feat"><span class="ac-fl">Coverage</span><span class="ac-fv">${optCount}/${ANNUITY_OPTION_ROWS.length} variants</span></div>
      <div class="ac-feat"><span class="ac-fl">Entry Age</span><span class="ac-fv">${san(p.entryAge||'—')}</span></div>
      <div class="ac-feat"><span class="ac-fl">Limited Pay</span><span class="ac-fv">${p.limitedPay?'✅ '+san(p.limitedPayNote||'Yes'):'❌ No'}</span></div>
      <div class="ac-feat"><span class="ac-fl">Joint Life</span><span class="ac-fv">${p.jointLife?'✅ Yes':'❌ No'}</span></div>
      <div class="ac-feat"><span class="ac-fl">Top-Up</span><span class="ac-fv">${p.topUp?'✅ Yes':'❌ No'}</span></div>
      <div class="ac-feat"><span class="ac-fl">Loan</span><span class="ac-fv">${p.loan?'✅ '+san(String(p.loan)):'❌ No'}</span></div>
    </div>`;

    if (uOpts.length) {
      h += `<div class="pc-section-title">★ ABSLI Unique Options</div>
      <ul class="pc-highlights" style="color:#FACC15">${uOpts.map(o=>`<li>${san(o.label)}</li>`).join('')}</ul>`;
    }

    // Score bar
    const pct = Math.round(optCount/ANNUITY_OPTION_ROWS.length*100);
    const fc  = pct>=90?'#00C4B4':pct>=60?'#22C55E':'#FBBF24';
    h += `<div class="ac-score-wrap"><div class="ac-score-row"><span>Variant Coverage</span><span style="color:${fc};font-weight:700">${optCount}/${ANNUITY_OPTION_ROWS.length}</span></div>
    <div class="ac-score-track"><div style="width:${pct}%;background:${fc};height:100%;border-radius:3px"></div></div></div>`;

    if (p.uniqueFeature) { h += `<div class="pc-section-title">💬 Sales Story</div><div class="pc-pitch">"${san(p.uniqueFeature)}"</div>`; }

    h += `<div class="ac-actions">
      ${p.calcUrl?`<a href="${san(p.calcUrl)}" target="_blank" rel="noopener noreferrer" class="ac-btn-calc">🧮 Calculator →</a>`:''}
      ${p.brochureUrl?`<a href="${san(p.brochureUrl)}" target="_blank" rel="noopener noreferrer" class="ac-btn-bro">📄 Brochure</a>`:''}
    </div></div>`;
  });
  h += '</div>';
  view.innerHTML = h;
}

function annRenderMatrix() {
  const fOpts = annFilter==='All' ? ANNUITY_OPTION_ROWS : ANNUITY_OPTION_ROWS.filter(o=>o.category===annFilter);
  const disCos = annVS ? ANNUITY_PLANS.filter(p=>annVSSel.includes(p.id)) : ANNUITY_PLANS;
  const groups = [...new Set(fOpts.map(o=>o.group))];

  let h = '<thead><tr>';
  // Corner — sticky top+left
  h += `<th class="ann-corner">ABSLI Option / Variant</th>`;
  // Company headers — P4a: NO rate in header
  disCos.forEach(co => {
    const opts = co.options||{};
    const matched = ANNUITY_OPTION_ROWS.filter(o=>['yes','unique'].includes(opts[o.id])).length;
    const total   = ANNUITY_OPTION_ROWS.length;
    const pct     = Math.round(matched/total*100);
    const fc      = pct>=90?'#00C4B4':pct>=60?'#22C55E':'#FBBF24';
    const sel     = annVS && annVSSel.includes(co.id);
    h += `<th class="ann-co-th${co.isBase?' ann-base-th':''}${sel&&!co.isBase?' ann-vs-sel':''}"${annVS&&!co.isBase?` onclick="annToggleVSSel('${co.id}')" style="cursor:pointer"`:''}>`;
    if (annVS&&!co.isBase) h+=`<div style="font-size:8px;color:${sel?'#60A5FA':'#64748B'};margin-bottom:2px">${sel?'✓ Selected':'+ Add'}</div>`;
    if (co.badge) h+=`<div class="ann-badge">${san(co.badge)}</div>`;
    h += `<div class="ann-co-name${co.isBase?' base':''}">${san(co.company)}</div>`;
    h += `<div class="ann-co-plan">${san(co.plan)}</div>`;
    // UX6: Score bar
    h += `<div class="ann-score-wrap"><div class="ann-score-row"><span style="color:#64748B;font-size:8px">Coverage</span><span style="color:${fc};font-weight:700;font-size:8px">${matched}/${total}</span></div>
    <div class="ann-score-track"><div style="width:${pct}%;background:${fc}" class="ann-score-fill"></div></div></div>`;
    // Calculator link (P4a: removed rate)
    if (co.calcUrl) h += `<a href="${san(co.calcUrl)}" target="_blank" rel="noopener noreferrer" class="am-calc-link">🧮 Calc →</a>`;
    h += '</th>';
  });
  h += '</tr></thead><tbody>';

  groups.forEach(grp => {
    const gOpts = fOpts.filter(o=>o.group===grp);
    const isColl = annColl[grp];
    // UX7: Collapsible group header
    h += `<tr class="ann-grp-hdr" onclick="annToggleColl('${grp}')">`;
    h += `<td class="ann-grp-corner"><span class="ann-grp-lbl">${isColl?'▶':'▼'} ${san(grp)} (${gOpts.length})</span></td>`;
    for (let i=1;i<disCos.length;i++) h += `<td style="background:#0E1828"></td>`;
    h += '</tr>';

    if (!isColl) {
      gOpts.forEach(opt => {
        const isHl = annHL === opt.id;
        // UX3: Tap to highlight
        h += `<tr${isHl?' class="ann-hl-row"':''} onclick="annHL_row('${opt.id}')" style="cursor:pointer">`;
        // Sticky left column — UX5: Gold for unique
        h += `<td class="ann-opt-td${opt.unique?' ann-opt-unique':''}${isHl?' ann-opt-hl':''}">
          <div class="ann-opt-name${opt.unique?' ann-gold':''}">${san(opt.label)}</div>
          <div class="ann-opt-desc">${san(opt.desc)}</div>
        </td>`;

        disCos.forEach(co => {
          const st = (co.options||{})[opt.id] || 'na';
          const hasNote = st==='sim' && co.optionNotes?.[opt.id];
          let bgCls = co.isBase?' ann-base-cell':(st==='unique'?' ann-uniq-cell':st==='sim'?' ann-sim-cell':'');
          if (isHl) bgCls += ' ann-hl-data';
          h += `<td class="ann-data-td${bgCls}"${hasNote?` onclick="event.stopPropagation();annOpenNote('${co.id}','${opt.id}')" style="cursor:pointer"`:''}>`;
          if (st==='unique') h += `<span class="ann-star">★</span>`;
          else h += `<span class="ann-ci">${ANN_SI[st]||'—'}</span>`;
          // UX4: ⓘ tap cue
          if (hasNote) h += `<div class="ann-tap-cue">ⓘ tap</div>`;
          h += '</td>';
        });
        h += '</tr>';
      });
    }
  });

  // Summary row
  h += `<tr class="ann-sum-row"><td class="ann-opt-td ann-sum-label">Matched (${fOpts.length} shown)</td>`;
  disCos.forEach(co => {
    const m = fOpts.filter(o=>['yes','unique'].includes((co.options||{})[o.id])).length;
    h += `<td class="ann-data-td${co.isBase?' ann-base-cell':''}">${m}/${fOpts.length}</td>`;
  });
  h += '</tr></tbody>';

  const tbl = document.getElementById('annTbl'); if (tbl) tbl.innerHTML = h;
  setTimeout(annFixStickyTop, 20);
}

function annOpenNote(coId, optId) {
  const co  = ANNUITY_PLANS.find(p=>p.id===coId);
  const opt = ANNUITY_OPTION_ROWS.find(o=>o.id===optId);
  const note = co?.optionNotes?.[optId] || 'No additional detail available.';
  const popup = document.getElementById('annNotePopup');
  document.getElementById('annNoteContent').innerHTML = `
    <div style="font-weight:700;color:#00C4B4;font-size:12px;margin-bottom:3px">${san(co?.company||'')} — ${san(co?.plan||'')}</div>
    <div style="font-size:11px;color:#FBBF24;margin-bottom:7px">⚠️  ${san(opt?.label||'')}</div>
    <div style="font-size:12px;color:#CBD5E1;line-height:1.7">${san(note)}</div>`;
  popup?.classList.remove('hidden');
}
function annCloseNote() { document.getElementById('annNotePopup')?.classList.add('hidden'); }

