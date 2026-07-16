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
  if(name==='news') loadArenaNews();
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
        <button class="btn-pdf" onclick="event.stopPropagation();generateSingleProductPDF(PLANS[${p.id-1}],'term')" title="Download Plan PDF">📄 PDF</button>
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
        <button class="m-btn-s m-btn-pdf" onclick="generateSingleProductPDF(PLANS[${p.id-1}],'term')">📄 Download PDF</button>
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
// ════════════════════════════════════════
// ARENA NEWS ENGINE v3 — Publisher-direct RSS
// Free sources only · Direct article links · 6-hourly updates
// ════════════════════════════════════════

let ARENA_NEWS = [];
let newsActiveCategory = 'all';
let newsLoaded = false;

const NEWS_CAT_META = {
  insurance:  { label: 'INSURANCE',    cls: 'insurance' },
  markets:    { label: 'STOCK MARKET', cls: 'markets' },
  regulatory: { label: 'REGULATORY',   cls: 'regulatory' },
};

function newsTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : mins + ' mins ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? '1 hour ago' : hrs + ' hours ago';
  const days = Math.floor(hrs / 24);
  return days === 1 ? '1 day ago' : days + ' days ago';
}

async function loadArenaNews() {
  if (newsLoaded) { renderArenaNews(); return; }
  const grid = document.getElementById('arenaNewsGrid');
  if (grid) grid.innerHTML = '<div class="anews-loading">Loading latest financial news…</div>';
  try {
    const res = await fetch('./data/news.json?t=' + Math.floor(Date.now() / 600000)); // 10-min cache key
    const data = await res.json();
    ARENA_NEWS = data.articles || [];
    newsLoaded = true;
    // Status bar
    const status = document.getElementById('arenaNewsStatus');
    if (status && data.lastUpdated) {
      status.textContent = 'Updated ' + newsTimeAgo(data.lastUpdated) + ' · ' + ARENA_NEWS.length + ' stories · Auto-refreshes every 6 hours';
    }
    const tabSub = document.getElementById('newsUpdateTime');
    if (tabSub && data.lastUpdated) tabSub.textContent = 'Updated ' + newsTimeAgo(data.lastUpdated);
    renderArenaNews();
  } catch (e) {
    if (grid) grid.innerHTML = '<div class="anews-empty">📰 News temporarily unavailable. Please check back shortly.</div>';
  }
}

function renderArenaNews() {
  const grid = document.getElementById('arenaNewsGrid');
  const featured = document.getElementById('arenaNewsFeatured');
  if (!grid) return;

  let list = newsActiveCategory === 'all'
    ? ARENA_NEWS
    : ARENA_NEWS.filter(a => a.category === newsActiveCategory);

  // Update category counts
  document.querySelectorAll('.anews-cat').forEach(btn => {
    const cat = btn.dataset.cat;
    const count = cat === 'all' ? ARENA_NEWS.length : ARENA_NEWS.filter(a => a.category === cat).length;
    const badge = btn.querySelector('.anews-cat-count');
    if (badge) badge.textContent = count;
  });

  if (list.length === 0) {
    if (featured) featured.innerHTML = '';
    grid.innerHTML = '<div class="anews-empty">No stories in this category right now. Check back after the next update.</div>';
    return;
  }

  // Featured = newest story in current filter
  const [hero, ...rest] = list;
  if (featured) {
    const cm = NEWS_CAT_META[hero.category] || NEWS_CAT_META.markets;
    featured.innerHTML = `
      <a href="${san(hero.url)}" target="_blank" rel="noopener noreferrer" class="anews-hero">
        <div class="anews-hero-top">
          <span class="anews-badge ${cm.cls}">${cm.label}</span>
          <span class="anews-time">${newsTimeAgo(hero.publishedAt)}</span>
        </div>
        <div class="anews-hero-title">${san(hero.title)}</div>
        ${hero.summary ? `<div class="anews-hero-summary">${san(hero.summary)}</div>` : ''}
        <div class="anews-hero-footer">
          <span class="anews-source">📰 ${san(hero.source)}</span>
          <span class="anews-read">Read Full Article →</span>
        </div>
      </a>`;
  }

  grid.innerHTML = rest.map(a => {
    const cm = NEWS_CAT_META[a.category] || NEWS_CAT_META.markets;
    return `
    <a href="${san(a.url)}" target="_blank" rel="noopener noreferrer" class="anews-card">
      <div class="anews-card-top">
        <span class="anews-badge ${cm.cls}">${cm.label}</span>
        <span class="anews-time">${newsTimeAgo(a.publishedAt)}</span>
      </div>
      <div class="anews-card-title">${san(a.title)}</div>
      ${a.summary ? `<div class="anews-card-summary">${san(a.summary)}</div>` : ''}
      <div class="anews-card-footer">
        <span class="anews-source">📰 ${san(a.source)}</span>
        <span class="anews-read">Read →</span>
      </div>
    </a>`;
  }).join('');
}

// Category filter clicks
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.anews-cat');
  if (!btn) return;
  document.querySelectorAll('.anews-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  newsActiveCategory = btn.dataset.cat;
  renderArenaNews();
});

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



// Calculator config for PDF generation
const CALC_CONFIG = {
  'hlv-result':  { title: 'Human Life Value (HLV) Calculator', desc: 'Estimates the ideal life insurance cover based on your income, age and goals.', inputs: [['Monthly Income','hlv-income','₹'],['Current Age','hlv-age','years'],['Retirement Age','hlv-retire','years'],['Existing Cover','hlv-existing','₹'],['Income Growth Rate','hlv-growth','% p.a.'],['Inflation Rate','hlv-inflation','% p.a.']] },
  'sip-result':  { title: 'SIP Returns Calculator', desc: 'Projects the future value of your Systematic Investment Plan.', inputs: [['Monthly SIP Amount','sip-amount','₹'],['Expected Return Rate','sip-return','% p.a.'],['Investment Period','sip-years','years']] },
  'irr-result':  { title: 'Policy IRR Calculator', desc: 'Calculates the approximate Internal Rate of Return of a life insurance policy.', inputs: [['Annual Premium','irr-premium','₹'],['Premium Paying Term','irr-ppt','years'],['Policy Term','irr-term','years'],['Maturity / Death Value','irr-maturity','₹']] },
  'ret-result':  { title: 'Retirement Corpus Calculator', desc: 'Calculates retirement corpus needed and monthly investment required to build it.', inputs: [['Current Age','ret-age','years'],['Retirement Age','ret-retire','years'],['Monthly Expenses Today','ret-expenses','₹'],['Inflation Rate','ret-inflation','% p.a.'],['Expected Return Rate','ret-return','% p.a.'],['Life Expectancy','ret-life','years']] },
  'emi-result':  { title: 'EMI / Loan Calculator', desc: 'Calculates monthly EMI and total interest on a loan.', inputs: [['Loan Amount','emi-loan','₹'],['Interest Rate','emi-rate','% p.a.'],['Loan Tenure','emi-tenure','years']] },
  'tvm-result':  { title: 'TVM Calculator', desc: 'Solve for any unknown — enter 4 values and click a button to solve for PV, PMT, FV, Rate or Periods.', inputs: [['Present Value','tvm-pv','₹'],['Payments (PMT)','tvm-pmt','₹'],['Future Value','tvm-fv','₹'],['Annual Rate','tvm-rate-new','%'],['Periods','tvm-periods','periods']] },
  'ulip-result': { title: 'ULIP Projection Calculator', desc: 'Projects ULIP fund value after FMC deductions over the policy term.', inputs: [['Annual Premium','ulip-premium','₹'],['Premium Paying Term','ulip-ppt','years'],['Policy Term','ulip-term','years'],['Expected Return Rate','ulip-return','% p.a.'],['Fund Management Charge','ulip-fmc','% p.a.']] },
};

function showCalcResult(id,mainVal,mainLabel,rows){
  const el=document.getElementById(id);
  el.classList.remove('hidden');
  el.innerHTML=`<div class="calc-result-main">${mainVal}</div><div class="calc-result-label">${mainLabel}</div><div class="calc-result-rows">${rows.map(([l,v])=>`<div class="calc-result-row"><span>${l}</span><span>${v}</span></div>`).join('')}</div><button class="calc-pdf-btn" onclick="generateCalcPDF('${id}')">📄 Download PDF Report</button>`;
}

function generateCalcPDF(resultId) {
  const cfg = CALC_CONFIG[resultId];
  if (!cfg) return;
  const resEl = document.getElementById(resultId);
  if (!resEl) return;
  const inputRows = cfg.inputs.map(([label, domId, unit]) => {
    const el = document.getElementById(domId);
    const v = el ? (el.value || '—') : '—';
    const display = (v !== '—' && unit) ? (unit === '₹' ? '₹ ' + Number(v).toLocaleString('en-IN') : v + ' ' + unit) : v;
    return [label, display];
  });
  const mainVal = resEl.querySelector('.calc-result-main')?.textContent || '—';
  const mainLabel = resEl.querySelector('.calc-result-label')?.textContent || '—';
  const resultRows = [...resEl.querySelectorAll('.calc-result-row')].map(r => {
    const spans = r.querySelectorAll('span');
    return [spans[0]?.textContent||'', spans[1]?.textContent||''];
  });
  const date = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Insurance Arena — ' + cfg.title + '</title>'
    + '<style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:12px;color:#1E293B;max-width:700px;margin:0 auto;padding:24px}'
    + '.header{border-bottom:3px solid #00C4B4;padding-bottom:10px;margin-bottom:16px}.brand{color:#00C4B4;font-weight:800;font-size:20px}'
    + '.subtitle{color:#64748B;font-size:10px;margin-top:3px}.calc-title{font-size:15px;font-weight:800;color:#0F172A;margin:12px 0 4px}'
    + '.calc-desc{font-size:11px;color:#64748B;margin-bottom:12px}'
    + '.section-title{font-size:11px;font-weight:800;color:#0F172A;margin:14px 0 4px;padding:5px 10px;background:#F1F5F9;border-left:4px solid #00C4B4}'
    + 'table{border-collapse:collapse;width:100%;margin:0 0 4px}td{padding:7px 10px;border-bottom:1px solid #E2E8F0;font-size:11.5px;vertical-align:top}'
    + 'td:first-child{color:#475569;font-weight:600;width:55%}'
    + '.result-box{background:#0F172A;color:#fff;border-radius:8px;padding:16px;text-align:center;margin:8px 0}'
    + '.result-main{font-size:26px;font-weight:800;color:#00C4B4}.result-label{font-size:11px;color:#94A3B8;margin-top:4px}'
    + '.result-rows{margin-top:12px;border-top:1px solid rgba(255,255,255,0.1);padding-top:10px}'
    + '.result-row{display:flex;justify-content:space-between;padding:4px 0;font-size:11px}'
    + '.result-row span:first-child{color:#94A3B8}.result-row span:last-child{color:#fff;font-weight:600}'
    + '.disclaimer-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:10px;margin:12px 0;font-size:10px;color:#92400E;line-height:1.6}'
    + '.footer{font-size:9px;color:#94A3B8;margin-top:16px;border-top:1px solid #E2E8F0;padding-top:8px;line-height:1.6}'
    + '@media print{body{padding:10px}.result-box{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>'
    + '<div class="header"><div class="brand">Insurance Arena\u2122</div>'
    + '<div class="subtitle">Calculator Report &nbsp;|&nbsp; Generated: ' + date + ' &nbsp;|&nbsp; insurancearena.in</div></div>'
    + '<div class="calc-title">' + cfg.title + '</div>'
    + '<div class="calc-desc">' + cfg.desc + '</div>'
    + '<div class="section-title">\uD83D\uDCE5 YOUR INPUTS</div>'
    + '<table><tbody>' + inputRows.map(([l,v]) => '<tr><td>' + l + '</td><td><strong>' + v + '</strong></td></tr>').join('') + '</tbody></table>'
    + '<div class="section-title">\uD83D\uDCCA RESULTS</div>'
    + '<div class="result-box"><div class="result-main">' + mainVal + '</div><div class="result-label">' + mainLabel + '</div>'
    + '<div class="result-rows">' + resultRows.map(([l,v]) => '<div class="result-row"><span>' + l + '</span><span>' + v + '</span></div>').join('') + '</div></div>'
    + '<div class="disclaimer-box">\u26A0\uFE0F <strong>Important:</strong> This calculation is for illustration and educational purposes only. Results are based on your inputs and standard financial formulas. Actual returns, premiums or corpus may vary based on market conditions, insurer terms and other factors. This does not constitute financial advice. Consult a licensed financial advisor before making any financial decision.</div>'
    + '<div class="footer">Generated by Insurance Arena (insurancearena.in) | Free insurance intelligence platform for India | Educational use only</div>'
    + '</body></html>';
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
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

// ── TVM CALCULATOR (Full Financial Calculator) ──
function solveTVM(solve) {
  track('calculator_used', {calc_type: 'tvm', solve_for: solve});
  const n = parseFloat(document.getElementById('tvm-compound-new').value) || 12;
  const rateType = document.querySelector('input[name="tvmRateType"]:checked')?.value || 'nominal';
  const begin = document.querySelector('input[name="tvmPayMode"]:checked')?.value === 'beginning' ? 1 : 0;

  const pvEl = document.getElementById('tvm-pv');
  const fvEl = document.getElementById('tvm-fv');
  const pmtEl = document.getElementById('tvm-pmt');
  const rateEl = document.getElementById('tvm-rate-new');
  const perEl = document.getElementById('tvm-periods');

  const pv   = solve !== 'pv'      ? (parseFloat(pvEl.value)   || 0) : null;
  const fv   = solve !== 'fv'      ? (parseFloat(fvEl.value)   || 0) : null;
  const pmt  = solve !== 'pmt'     ? (parseFloat(pmtEl.value)  || 0) : null;
  const rate = solve !== 'rate'    ? (parseFloat(rateEl.value) || 0) : null;
  const N    = solve !== 'periods' ? (parseFloat(perEl.value)  || 0) : null;

  // Periodic rate
  let i = null;
  if (rate !== null) {
    if (rateType === 'nominal') {
      i = (rate / 100) / n;
    } else {
      i = Math.pow(1 + rate / 100, 1 / n) - 1;
    }
  }

  let result = null;
  const fmt2 = v => Math.round(v * 100) / 100;
  const fmt4 = v => Math.round(v * 10000) / 10000;

  // TVM equation: PV*(1+i)^N + PMT*[(1+i)^N-1]/i*(1+i*begin) + FV = 0
  // Annuity factor
  const annFactor = (i2, N2) => {
    if (Math.abs(i2) < 1e-12) return N2;
    return (Math.pow(1+i2, N2) - 1) / i2 * (1 + i2 * begin);
  };

  switch (solve) {
    case 'fv':
      if (N === null || N === 0) { showCalcError('tvm-result','Please enter Periods.'); return; }
      if (i === null) { showCalcError('tvm-result','Please enter Annual Rate.'); return; }
      result = -(pv * Math.pow(1+i, N) + pmt * annFactor(i, N));
      fvEl.value = fmt2(result);
      break;
    case 'pv':
      if (N === null || N === 0) { showCalcError('tvm-result','Please enter Periods.'); return; }
      if (i === null) { showCalcError('tvm-result','Please enter Annual Rate.'); return; }
      result = -(fv / Math.pow(1+i, N) + pmt * annFactor(i, N) / Math.pow(1+i, N));
      pvEl.value = fmt2(result);
      break;
    case 'pmt':
      if (N === null || N === 0) { showCalcError('tvm-result','Please enter Periods.'); return; }
      if (i === null) { showCalcError('tvm-result','Please enter Annual Rate.'); return; }
      const af = annFactor(i, N);
      if (Math.abs(af) < 1e-12) { showCalcError('tvm-result','Cannot solve PMT with these inputs.'); return; }
      result = -(pv * Math.pow(1+i, N) + fv) / af;
      pmtEl.value = fmt2(result);
      break;
    case 'rate':
      if (N === null || N === 0) { showCalcError('tvm-result','Please enter Periods.'); return; }
      if (pv === 0 && fv === 0 && pmt === 0) { showCalcError('tvm-result','Please enter at least one cash flow.'); return; }
      // Newton-Raphson for periodic rate
      let guess = 0.01;
      for (let iter = 0; iter < 200; iter++) {
        const pow = Math.pow(1+guess, N);
        const af2 = Math.abs(guess) < 1e-12 ? N : (pow-1)/guess*(1+guess*begin);
        const f = pv * pow + pmt * af2 + fv;
        const dPow = N * Math.pow(1+guess, N-1);
        const dAf = Math.abs(guess) < 1e-12 ? N*(N-1)/2 :
          ((N*Math.pow(1+guess,N-1)*guess - (pow-1))/(guess*guess)*(1+guess*begin) + (pow-1)/guess*begin);
        const df = pv * dPow + pmt * dAf;
        const next = guess - f / df;
        if (Math.abs(next - guess) < 1e-10) { guess = next; break; }
        guess = next;
        if (!isFinite(guess) || guess < -0.9999) { guess = 0.001; }
      }
      if (!isFinite(guess) || guess <= -1) { showCalcError('tvm-result','No valid rate found. Check inputs (signs matter).'); return; }
      // Convert periodic rate to annual
      let annRate;
      if (rateType === 'nominal') {
        annRate = guess * n * 100;
      } else {
        annRate = (Math.pow(1+guess, n) - 1) * 100;
      }
      result = fmt4(annRate);
      rateEl.value = result;
      i = guess;
      break;
    case 'periods':
      if (i === null) { showCalcError('tvm-result','Please enter Annual Rate.'); return; }
      if (pmt === 0 || Math.abs(i) < 1e-12) {
        if (pv === 0 || fv === 0) { showCalcError('tvm-result','Please enter PV and FV.'); return; }
        if (pv * fv > 0) { showCalcError('tvm-result','PV and FV must have opposite signs.'); return; }
        result = Math.log(-fv/pv) / Math.log(1+i);
      } else {
        // log formula for annuity
        const pmtAdj = pmt * (1 + i * begin);
        const num = pmtAdj - fv * i;
        const den = pmtAdj + pv * i;
        if (num <= 0 || den <= 0 || num/den <= 0) { showCalcError('tvm-result','Cannot solve Periods with these inputs.'); return; }
        result = Math.log(num/den) / Math.log(1+i);
      }
      result = fmt2(result);
      perEl.value = result;
      N === null && (perEl.value = result);
      break;
  }

  // Show summary
  const fields = {
    pv:  parseFloat(pvEl.value)  || 0,
    pmt: parseFloat(pmtEl.value) || 0,
    fv:  parseFloat(fvEl.value)  || 0,
    r:   parseFloat(rateEl.value)|| 0,
    N:   parseFloat(perEl.value) || 0,
  };
  const compLabel = {'1':'Annual','2':'Semi-Annual','4':'Quarterly','12':'Monthly','365':'Daily'}[n] || 'Monthly';
  const solveLabels = {pv:'Present Value',pmt:'Payment (PMT)',fv:'Future Value',rate:'Annual Rate',periods:'No. of Periods'};
  const solveUnits = {pv:'₹',pmt:'₹',fv:'₹',rate:'% p.a.',periods:'periods'};
  const displayResult = solve === 'rate' ? result + '% p.a.' :
    solve === 'periods' ? result + ' periods' : '₹ ' + Number(result).toLocaleString('en-IN');

  showCalcResult('tvm-result', displayResult, 'Solved for ' + solveLabels[solve], [
    ['Present Value', fields.pv ? '₹ '+Number(fields.pv).toLocaleString('en-IN') : '—'],
    ['Payments (PMT)', fields.pmt ? '₹ '+Number(fields.pmt).toLocaleString('en-IN') : '—'],
    ['Future Value', fields.fv ? '₹ '+Number(fields.fv).toLocaleString('en-IN') : '—'],
    ['Annual Rate', fields.r ? fields.r + '% ('+rateType+')' : '—'],
    ['Periods', fields.N ? fields.N + ' ('+compLabel+' compounding)' : '—'],
    ['Payment Mode', begin ? 'Beginning of period (Annuity Due)' : 'End of period (Ordinary Annuity)'],
  ]);
}

function resetTVMNew() {
  ['tvm-pv','tvm-pmt','tvm-fv','tvm-rate-new','tvm-periods'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('tvm-compound-new').value = '12';
  const nom = document.querySelector('input[name="tvmRateType"][value="nominal"]');
  const end = document.querySelector('input[name="tvmPayMode"][value="end"]');
  if (nom) nom.checked = true;
  if (end) end.checked = true;
  document.getElementById('tvm-result')?.classList.add('hidden');
}

function toggleTvmAdv(btn) {
  const adv = document.getElementById('tvm-adv-panel');
  if (adv) {
    adv.classList.toggle('hidden');
    btn.classList.toggle('active');
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
    tvm:['tvm-pv','tvm-pmt','tvm-fv','tvm-rate-new','tvm-periods'],
    emi:['emi-loan','emi-rate','emi-tenure'],
    ulip:['ulip-premium','ulip-ppt','ulip-term','ulip-return','ulip-fmc'],
  };
  const defaults={
    'hlv-growth':'5','hlv-inflation':'6','hlv-retire':'60',
    'sip-return':'12','ret-retire':'60','ret-inflation':'6','ret-return':'10','ret-life':'80',
    'tvm-rate-new':'8','ulip-return':'10','ulip-fmc':'1.35',
  };
  (panels[id]||[]).forEach(fid=>{
    const el=document.getElementById(fid);
    if(el){ el.value=defaults[fid]||''; }
  });
  const res=document.getElementById(id+'-result');
  if(res) res.classList.add('hidden');
  const am=document.getElementById(id+'-amort');
  if(am) am.classList.add('hidden');
  if(id==='tvm'){ resetTVMNew(); return; }
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
let ulipRendered   = false;
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
    const catEl = { par:'sec-par', nonpar:'sec-nonpar', ulip:'sec-ulip', annuity:'sec-annuity' }[activeCat];
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
  const isUlip    = cat === 'ulip';
  const isAnnuity = cat === 'annuity';

  ['controls-bar','results-meta'].forEach(cls => { const el = document.querySelector('.' + cls); if (el) el.classList.toggle('hidden', !isTerm); });
  ['cardsGrid','tableWrap','noResults'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', !isTerm); });

  const secPar    = document.getElementById('sec-par');
  const secNP     = document.getElementById('sec-nonpar');
  const secUlip   = document.getElementById('sec-ulip');
  const secAnn    = document.getElementById('sec-annuity');
  const secAvB    = document.getElementById('sec-avb');
  const secTk     = document.getElementById('sec-toolkit');

  if (secPar)  secPar.classList.toggle('hidden', !isPar);
  if (secNP)   secNP.classList.toggle('hidden', !isNonPar);
  if (secUlip) secUlip.classList.toggle('hidden', !isUlip);
  if (secAnn)  secAnn.classList.toggle('hidden', !isAnnuity);
  if (secAvB)  secAvB.classList.add('hidden');
  if (secTk)   secTk.classList.add('hidden');

  // Render on first show (skeleton flash for perceived speed)
  if (isPar && !parRendered)    { if (typeof showSkeletons==='function') showSkeletons('parWrap',3); setTimeout(renderPar, 120); }
  if (isNonPar && !nonparRendered) { if (typeof showSkeletons==='function') showSkeletons('nonparWrap',3); setTimeout(renderNonPar, 120); }
  if (isUlip && !ulipRendered)  { if (typeof showSkeletons==='function') showSkeletons('ulipWrap',3); setTimeout(renderULIP, 120); }
  if (isAnnuity && !annuityRendered) { if (typeof showSkeletons==='function') showSkeletons('annuityWrap',3); setTimeout(renderAnnuity, 120); }
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

  let html = `<div class="prod-note-bar">⚠️ All plans are <strong>Participating</strong> — bonus is non-guaranteed and depends on insurer performance each year.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    if (!p) return;
    if (p.notAvailable && !p.isBase) {
      html += `<div class="plan-card">
        <div class="card-header"><div class="card-company">${san(p.company)}</div><div class="card-plan-name">${san(p.plan)}</div></div>
        <div class="pc-na-block">❌ ${san(p.naReason || 'Structurally different — not directly comparable')}</div>
        ${p.uniqueFeature?`<div class="card-pitch"><div class="card-pitch-text">${san(p.uniqueFeature)}</div></div>`:''}
        <div class="card-footer">${p.productUrl?`<a href="${san(p.productUrl)}" target="_blank" rel="noopener noreferrer" class="btn-details">Product →</a>`:''}</div>
      </div>`;
      return;
    }

    const meta = getMeta ? getMeta(p.id) : {};
    const pills = [];
    pills.push('Participating');
    if (p.bonusType) pills.push(String(p.bonusType).split('+')[0].trim().slice(0,22) + ' ✓');
    if (p.isBase) { pills.push('Policy Loan ✓'); pills.push('4 Riders ✓'); pills.push('HER Benefits ✓'); }
    else if (p.features) {
      if (p.features.loan) pills.push('Policy Loan ✓');
      if (p.features.riders) pills.push('Riders ✓');
      if (p.features.jointLife) pills.push('Joint Life ✓');
    }
    if (p.hasGuaranteedMaturityBenefit) pills.push('Guaranteed Maturity ✓');

    const stats = p.isBase
      ? [{val:'85 yrs',lbl:'Maturity Age'},{val:'9',lbl:'PPT Options'},{val:String(p.saMultiple||11)+'×',lbl:'SA Multiple'}]
      : [{val:p.saMultiple?String(p.saMultiple)+'×':'—',lbl:'SA Multiple'},{val:p.dataDate||'—',lbl:'Data Year'},{val:'Par',lbl:'Type'}];

    const details = p.isBase ? [
      ['Entry Age','30 days – 60 yrs'],['Maturity Age','85 years'],
      ['PPT Options','Single Pay | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 years'],
      ['Policy Loan','✅ Up to 80% of Surrender Value'],
      ['Riders','Accidental Death | Critical Illness | Surgical Care | Hospital Care'],
      ['Bonus Type', p.bonusType]
    ] : [
      ['Bonus Type', p.bonusType],
      ['Riders', p.features && p.features.riders ? '✅ Available' : ''],
      ['Policy Loan', p.features && p.features.loan ? '✅ Available' : ''],
      ['Revival Period', p.features && p.features.revivalPeriod && !String(p.features.revivalPeriod).includes('Verify') ? p.features.revivalPeriod : '']
    ];

    const idx = ANMOL_PLANS.indexOf(p);
    const buttons = `
      ${p.productUrl?`<a href="${san(p.productUrl)}" target="_blank" rel="noopener noreferrer" class="btn-calc" onclick="event.stopPropagation()">Product →</a>`:''}
      ${p.brochureUrl&&String(p.brochureUrl).startsWith('http')?`<a href="${san(p.brochureUrl)}" target="_blank" rel="noopener noreferrer" class="btn-details" onclick="event.stopPropagation()">Brochure</a>`:''}
      <button class="btn-pdf" onclick="event.stopPropagation();generateSingleProductPDF(ANMOL_PLANS[${idx}],'par')">📄 PDF</button>`;

    const metaHL = (meta.keyHighlights && meta.keyHighlights[0]) || '';
    html += arenaCard({
      company: p.company, plan: p.plan,
      bestFor: metaHL || (p.uniqueFeature ? String(p.uniqueFeature).slice(0,80) : ''),
      uin: p.uin && !String(p.uin).includes('Verify') ? p.uin : '',
      isBase: p.isBase, pills, stats,
      pitch: p.pitch || '',
      details, buttons
    });
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
  const all   = [base, ...comps];

  let html = `<div class="prod-note-bar">ⓘ Non-Par guaranteed income plans where income starts DURING the premium payment term itself.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    if (!p) return;
    const pills = [];
    pills.push('Income ' + (String(p.incomeFrom).split(' ')[0] + ' ' + (String(p.incomeFrom).split(' ')[1]||'')).trim() + ' ✓');
    pills.push(String(p.incomeType).toLowerCase().includes('increas') ? 'Increasing Income ✓' : 'Level Income ✓');
    if (p.hasLumpSum) pills.push('Maturity Lump Sum ✓');
    if (p.cashbackFeature) pills.push('Instant Cashback ✓');
    if (p.ropOnDeath) pills.push('ROP on Death ✓');
    if (p.guaranteed) pills.push('100% Guaranteed ✓');
    if (p.policyContinuanceBenefit) pills.push('Policy Continuance ✓');

    const stats = [
      { val: String(p.incomeFrom).replace(/\(.*\)/,'').trim().slice(0,12), lbl: 'Income Starts' },
      { val: String(p.incomeType).toLowerCase().includes('increas') ? '5% ↑/yr' : 'Level', lbl: 'Income Type' },
      { val: 'Non-Par', lbl: 'Guaranteed' }
    ];

    const details = [
      ['Entry Age', p.entryAge], ['Income From', p.incomeFrom],
      ['Income Type', p.incomeType], ['Income Period', p.incomePeriod],
      ['PPT', p.ppt], ['Maturity Lump Sum', p.hasLumpSum ? '✅ ' + (p.lumpSumNote||'Guaranteed') : ''],
      ['Instant Cashback', p.cashbackFeature ? '✅ ' + (p.cashbackNote||'At issuance') : ''],
      ['Policy Continuance', p.policyContinuanceBenefitNote],
      ['Accidental Death Benefit', p.accidentalDeathBenefitNote]
    ];

    const idx = NISHCHIT_PLANS.filter(x=>!x.excluded).indexOf(p);
    const buttons = `
      ${p.productUrl?`<a href="${san(p.productUrl)}" target="_blank" rel="noopener noreferrer" class="btn-calc" onclick="event.stopPropagation()">Product →</a>`:''}
      <button class="btn-pdf" onclick="event.stopPropagation();generateSingleProductPDF(NISHCHIT_PLANS.filter(x=>!x.excluded)[${idx}],'early-income')">📄 PDF</button>`;

    html += arenaCard({
      company: p.company, plan: p.plan,
      bestFor: p.tag || '',
      uin: p.uin, isBase: p.isBase, pills, stats,
      pitch: p.pitch || p.uniqueFeature || '',
      details, buttons
    });
  });
  html += '</div>';
  wrap.innerHTML = html;
}

// ── SAVINGS + INCOME COMP (Feature cards — clean) ──
function renderSavingsComp(wrap) { renderFeatureCards(wrap, SAVINGS_PLANS, 'Guaranteed Savings Plans', 'Non-Linked Non-Par Savings | Benchmark: Age 35 | Male | ₹1L | 10 PPT | 20 PT'); }
function renderIncomeComp(wrap) { renderFeatureCards(wrap, INCOME_PLANS, 'Guaranteed Long Term Income Plans', 'Non-Linked Non-Par Income | Benefit Payout Period: 20/25/30 years'); }

function renderFeatureCards(wrap, plans, title, bench) {
  window._iaPlans = window._iaPlans || {};
  const base  = plans.find(p => p.isBase);
  const comps = plans.filter(p => !p.isBase);
  const all   = [base, ...comps];
  const isSavings = plans === (typeof SAVINGS_PLANS !== 'undefined' ? SAVINGS_PLANS : null);

  let html = `
  <div class="prod-note-bar">ⓘ Data from official insurer sources. Fields not publicly available are hidden.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    if (!p) return;
    const isTW  = p.typeWarning;
    const isRep = p.replacementNote;

    // Pills — quick feature scan
    const pills = [];
    pills.push(isTW ? 'Participating ⚠️' : 'Non-Par Guaranteed');
    if (p.guaranteedAdditions) pills.push('Guaranteed Additions ✓');
    if (p.loyaltyAdditions) pills.push('Loyalty Additions ✓');
    if (p.loan) pills.push('Policy Loan ✓');
    if (p.jointLife) pills.push('Joint Life ✓');
    if (p.incomePeriods?.length) pills.push('Income Plan ✓');
    if (p.maturityBenefit) pills.push('Maturity Benefit ✓');

    // Stats strip
    const stats = [];
    if (p.entryAge && !String(p.entryAge).includes('Verify')) stats.push({val: String(p.entryAge).split('–')[1]?.trim() || p.entryAge, lbl: 'Max Entry'});
    if (p.incomePeriods?.length) stats.push({val: p.incomePeriods.length + ' options', lbl: 'Income Periods'});
    else if (p.ppt && !String(p.ppt).includes('Verify')) stats.push({val: String(p.ppt).slice(0,12), lbl: 'PPT'});
    if (p.planOptions?.length) stats.push({val: String(p.planOptions.length), lbl: 'Plan Options'});
    if (stats.length < 3 && p.dataDate) stats.push({val: p.dataDate, lbl: 'Data Year'});

    // Details (collapsible)
    const details = [];
    if (p.entryAge) details.push(['Entry Age', p.entryAge]);
    if (p.ppt) details.push(['PPT', p.ppt]);
    if (p.incomePeriods?.length) details.push(['Income Period', p.incomePeriods.join(' / ')]);
    if (p.planOptions?.length) details.push(['Plan Options', p.planOptions.join(' | ')]);
    if (p.deathBenefit) details.push(['Death Benefit', p.deathBenefit]);
    if (p.riders) details.push(['Riders', p.riders]);
    if (p.maturityBenefit) details.push(['Maturity Benefit', typeof p.maturityBenefit==='string'?p.maturityBenefit:'✅ Yes']);
    if (p.guaranteedAdditions) details.push(['Guaranteed Additions', '✅ Yes']);
    if (p.loyaltyAdditions) details.push(['Loyalty Additions', '✅ Yes']);
    if (p.loan) details.push(['Policy Loan', '✅ Yes']);
    if (p.jointLife) details.push(['Joint Life', '✅ Yes']);

    const _pi = plans.indexOf(p);
    const _arr = isSavings ? 'SAVINGS_PLANS' : 'INCOME_PLANS';
    const _cat = p.incomePeriods ? 'income' : 'savings';
    const buttons = `
      ${p.url?`<a href="${san(p.url)}" target="_blank" rel="noopener noreferrer" class="btn-calc" onclick="event.stopPropagation()">Product →</a>`:''}
      ${p.brochure&&!String(p.brochure).startsWith('Verify')?`<a href="${san(p.brochure)}" target="_blank" rel="noopener noreferrer" class="btn-details" onclick="event.stopPropagation()">Brochure</a>`:''}
      <button class="btn-pdf" onclick="event.stopPropagation();generateSingleProductPDF(${_arr}[${_pi}],'${_cat}')">📄 PDF</button>`;

    let warnHtml = '';
    if (isTW) warnHtml += `<div class="pc-warn">⚠️ Participating plan — returns include non-guaranteed bonus. Different structure from Non-Par base plan.</div>`;
    if (isRep) warnHtml += `<div class="pc-rep-note">ⓘ ${san(isRep)}</div>`;

    const card = arenaCard({
      company: p.company, plan: p.plan,
      bestFor: p.uniqueFeature ? String(p.uniqueFeature).slice(0,90) : '',
      uin: p.uin && !String(p.uin).includes('Verify') ? p.uin : '',
      isBase: p.isBase, pills, stats,
      pitch: p.pitch || '',
      details, buttons
    });
    // Inject warnings right after card header if present
    html += warnHtml ? card.replace('</div>\n    ', '</div>' + warnHtml + '\n    ') : card;
  });
  html += '</div>';
  wrap.innerHTML = html;
}


// ══════════════════════════════════════════════════════════════
// UNIFIED TERM-STYLE CARD BUILDER — all categories share the Term UI
// cfg: {company, plan, bestFor, uin, isBase, type, pills[], stats[{val,lbl}],
//       pitch, details[[label,value]], buttons(html string)}
// ══════════════════════════════════════════════════════════════
function arenaCard(cfg) {
  const pills = (cfg.pills||[]).map(t => `<span class="feat-tag yes">${san(t)}</span>`).join('');
  const stats = (cfg.stats||[]).map(s => `<div><span class="card-stat-val">${san(s.val)}</span><span class="card-stat-lbl">${san(s.lbl)}</span></div>`).join('');
  const details = (cfg.details||[]).filter(d => d && d[1] && !String(d[1]).includes('Verify'));
  return `<div class="plan-card${cfg.isBase?' prod-card-base':''}" role="article">
    <div class="card-header">
      <div class="card-company">${san(cfg.company)}</div>
      <div class="card-plan-name">${san(cfg.plan)}</div>
      ${cfg.bestFor?`<div class="card-best-for">⭐ ${san(cfg.bestFor)}</div>`:''}
      ${cfg.isBase?'<span class="prod-base-tag">Base Plan</span>':''}
      ${cfg.uin?`<div class="card-uin">UIN: ${san(cfg.uin)}</div>`:''}
    </div>
    ${pills?`<div class="card-features">${pills}</div>`:''}
    ${stats?`<div class="card-stats">${stats}</div>`:''}
    ${cfg.pitch?`<div class="card-pitch"><div class="card-pitch-label">Why this plan?</div><div class="card-pitch-text">${san(cfg.pitch)}</div></div>`:''}
    ${details.length?`<details class="card-more"><summary>📋 Full Plan Features</summary><div class="pc-feature-list">${details.map(([l,v])=>`<div class="pc-feat"><span class="pc-fl">${san(l)}</span><span class="pc-fv">${san(v)}</span></div>`).join('')}</div></details>`:''}
    <div class="card-footer">${cfg.buttons||''}</div>
  </div>`;
}

// ════════════════════════════════════════════════════════════
// ULIP — CARD COMPARISON
// ════════════════════════════════════════════════════════════
function renderULIP() {
  ulipRendered = true;
  const wrap = document.getElementById('ulipWrap'); if (!wrap) return;
  const base  = ULIP_PLANS.filter(p => p.isBase);
  const comps = ULIP_PLANS.filter(p => !p.isBase);
  const all   = [...base, ...comps];

  let html = `<div class="prod-note-bar">ⓘ Market-linked returns — investment risk borne by policyholder. IRR and illustration figures are never shown; use the IRR Calculator tool with your own assumptions.</div>
  <div class="prod-cards">`;

  all.forEach(p => {
    const pills = [];
    if (p.romc) pills.push('Charge Return ✓');
    if (p.loyaltyAdditions) pills.push('Loyalty Boosters ✓');
    if (typeof p.fundOptions === 'number') pills.push(p.fundOptions + ' Funds');
    if (typeof p.portfolioStrategies === 'number') pills.push(p.portfolioStrategies + ' Strategies');
    if (p.planOptions && !String(p.planOptions).includes('Verify')) pills.push('Multi-Option ✓');
    if (p.riders && p.riders !== 'None' && !String(p.riders).includes('Verify')) pills.push('Riders ✓');

    const stats = [
      { val: String(p.fundOptions || '—'), lbl: 'Fund Options' },
      { val: String(p.portfolioStrategies || '—'), lbl: 'Strategies' },
      { val: p.romc ? '✓' : '—', lbl: 'Charge Return' }
    ];

    const details = [
      ['Entry Age', p.entryAge], ['Maturity Age', p.maturityAge],
      ['PPT', p.ppt], ['Policy Term', p.pt], ['SA Multiple', p.saMultiple],
      ['Plan Options', p.planOptions], ['Withdrawal Options', p.withdrawalOptions],
      ['Charge Return', p.romcNote], ['Loyalty/Boosters', p.loyaltyNote],
      ['Riders', p.riders]
    ];

    const idx = ULIP_PLANS.indexOf(p);
    const buttons = `
      ${p.url?`<a href="${san(p.url)}" target="_blank" rel="noopener noreferrer" class="btn-calc" onclick="event.stopPropagation()">Product →</a>`:''}
      ${p.brochure&&!String(p.brochure).startsWith('Verify')?`<a href="${san(p.brochure)}" target="_blank" rel="noopener noreferrer" class="btn-details" onclick="event.stopPropagation()">Brochure</a>`:''}
      ${p.fundPerformanceUrl?`<a href="${san(p.fundPerformanceUrl)}" target="_blank" rel="noopener noreferrer" class="btn-details" onclick="event.stopPropagation()">Fund NAVs</a>`:''}
      <button class="btn-pdf" onclick="event.stopPropagation();generateSingleProductPDF(ULIP_PLANS[${idx}],'ulip')">📄 PDF</button>`;

    html += arenaCard({
      company: p.company, plan: p.plan,
      bestFor: (p.keyHighlights && p.keyHighlights[0]) || '',
      uin: p.uin && !String(p.uin).includes('Verify') ? p.uin : '',
      isBase: p.isBase, pills, stats,
      pitch: p.pitch || p.uniqueFeature || '',
      details, buttons
    });
  });
  html += '</div>';
  wrap.innerHTML = html;
}


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
      ${p.uin?`<button class="ac-btn-pdf" onclick="generateSingleProductPDF(ANNUITY_PLANS.find(x=>x.uin==='${san(p.uin)}'),'annuity')">📄 PDF Report</button>`:''}
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


// ══════════════════════════════════════════════════════════════
// UPGRADED CALCULATORS — Release 4
// ══════════════════════════════════════════════════════════════

// ── ULIP CALCULATOR (slider-driven, live chart) ──
let ulipFreq = 12; // instalments per year (Monthly default)

function setUlipFreq(btn) {
  document.querySelectorAll('#ulipFreqToggle .freq-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ulipFreq = parseInt(btn.getAttribute('data-freq'), 10) || 12;
  calcULIPLive();
}

function syncUlip(field, value) {
  const num = document.getElementById('ulip-' + field);
  const sl  = document.getElementById('ulip-' + field + '-sl');
  if (num && String(num.value) !== String(value)) num.value = value;
  if (sl && String(sl.value) !== String(value)) sl.value = value;
  // PPT can never exceed Policy Term
  const ppt = parseFloat(document.getElementById('ulip-ppt')?.value) || 0;
  const term = parseFloat(document.getElementById('ulip-term')?.value) || 0;
  if (field === 'ppt' && ppt > term) { syncUlip('term', ppt); return; }
  if (field === 'term' && term < ppt) { syncUlip('ppt', term); return; }
  calcULIPLive();
}

function fmtLakh(v) {
  if (v >= 10000000) return '₹' + (v/10000000).toFixed(2) + ' Cr';
  if (v >= 100000)   return '₹' + (v/100000).toFixed(2) + ' Lakh';
  return '₹' + Math.round(v).toLocaleString('en-IN');
}

function calcULIPLive() {
  const amt   = parseFloat(document.getElementById('ulip-amt')?.value) || 0;
  const ppt   = parseInt(document.getElementById('ulip-ppt')?.value, 10) || 0;
  const term  = parseInt(document.getElementById('ulip-term')?.value, 10) || 0;
  const ret   = (parseFloat(document.getElementById('ulip-return')?.value) || 0) / 100;
  const fmc   = (parseFloat(document.getElementById('ulip-fmc')?.value) || 0) / 100;
  if (!amt || !ppt || !term || term < ppt) return;

  const netRate = ret - fmc;
  const perInstalment = netRate / ulipFreq;
  let fund = 0;
  const milestones = {};
  const marks = [2, Math.round(term*0.4), Math.round(term*0.6), term].filter((v,i,a)=>v>=1&&a.indexOf(v)===i).sort((a,b)=>a-b);

  for (let y = 1; y <= term; y++) {
    for (let m = 0; m < ulipFreq; m++) {
      if (y <= ppt) fund += amt;
      fund *= (1 + perInstalment);
    }
    if (marks.includes(y)) milestones[y] = { fund: Math.round(fund), invested: Math.min(y, ppt) * amt * ulipFreq };
  }

  const totalInvested = amt * ulipFreq * ppt;
  const finalFund = Math.round(fund);

  const invVal = document.getElementById('ulipInvVal'), getVal2 = document.getElementById('ulipGetVal');
  const invSub = document.getElementById('ulipInvSub'), getSub = document.getElementById('ulipGetSub');
  if (invVal) invVal.textContent = fmtLakh(totalInvested);
  if (getVal2) getVal2.textContent = fmtLakh(finalFund);
  if (invSub) invSub.textContent = 'Over ' + ppt + ' years';
  if (getSub) getSub.textContent = 'After ' + term + ' years (estimated)';

  const chart = document.getElementById('ulipChart');
  if (chart) {
    const maxV = Math.max(...Object.values(milestones).map(m => m.fund), 1);
    chart.innerHTML = marks.map(y => {
      const m = milestones[y]; if (!m) return '';
      const totalH = Math.max(8, (m.fund / maxV) * 100);
      const growth = Math.max(0, m.fund - m.invested);
      const growthPct = m.fund > 0 ? (growth / m.fund) * 100 : 0;
      return `<div class="uc-col">
        <div class="uc-total">${fmtLakh(m.fund)}</div>
        <div class="uc-bar" style="height:${totalH}%">
          <div class="uc-growth" style="height:${growthPct}%"></div>
          <div class="uc-principal" style="height:${100-growthPct}%"></div>
        </div>
        <div class="uc-year">Year ${y}</div>
      </div>`;
    }).join('');
  }
  track('calculator_used', {calc_type: 'ulip_live'});
}

// ── IRR: mode toggle + advanced irregular cash flows ──
function setIrrMode(mode) {
  document.getElementById('irrModeSimple')?.classList.toggle('active', mode === 'simple');
  document.getElementById('irrModeAdv')?.classList.toggle('active', mode === 'advanced');
  document.getElementById('irrSimplePane')?.classList.toggle('hidden', mode !== 'simple');
  document.getElementById('irrAdvPane')?.classList.toggle('hidden', mode !== 'advanced');
  document.getElementById('irr-result')?.classList.add('hidden');
  if (mode === 'advanced' && document.getElementById('cfRows')?.children.length === 0) addCfYears();
}

function addCfYears() {
  const rows = document.getElementById('cfRows'); if (!rows) return;
  const start = rows.children.length + 1;
  for (let y = start; y < start + 5 && y <= 60; y++) {
    const div = document.createElement('div');
    div.className = 'cf-row';
    div.innerHTML = `<span class="cf-year-lbl">Year ${y}</span><input type="number" id="cf-y${y}" placeholder="0"/>`;
    rows.appendChild(div);
  }
}

function resetIrrAdvanced() {
  const y0 = document.getElementById('cf-y0'); if (y0) y0.value = '';
  document.querySelectorAll('#cfRows input').forEach(i => i.value = '');
  document.getElementById('irr-result')?.classList.add('hidden');
}

function calcIRRAdvanced() {
  track('calculator_used', {calc_type: 'irr_advanced'});
  const cf = [parseFloat(document.getElementById('cf-y0')?.value) || 0];
  document.querySelectorAll('#cfRows input').forEach(i => cf.push(parseFloat(i.value) || 0));
  while (cf.length > 1 && cf[cf.length-1] === 0) cf.pop(); // trim trailing zeros

  const hasNeg = cf.some(v => v < 0), hasPos = cf.some(v => v > 0);
  if (cf.length < 2 || !hasNeg || !hasPos) {
    showCalcError('irr-result', 'Enter at least one negative (money paid) and one positive (money received) cash flow. Use negative values for premiums, positive for income/maturity.');
    return;
  }

  function npv(r) { return cf.reduce((s, c, t) => s + c / Math.pow(1 + r, t), 0); }
  let lo = -0.99, hi = 10.0;
  if (npv(lo) * npv(hi) > 0) {
    showCalcError('irr-result', 'No valid IRR found for these cash flows. Check that total received exceeds total paid (or vice versa) and values are correctly signed.');
    return;
  }
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (Math.abs(hi - lo) < 0.0000005) break;
    if (npv(lo) * npv(mid) < 0) hi = mid; else lo = mid;
  }
  const irr = ((lo + hi) / 2) * 100;
  const paid = cf.filter(v => v < 0).reduce((s, v) => s - v, 0);
  const recd = cf.filter(v => v > 0).reduce((s, v) => s + v, 0);
  showCalcResult('irr-result', irr.toFixed(2) + '% p.a.', 'Internal Rate of Return (Irregular Cash Flows)', [
    ['Total Money Paid (outflows)', fmtCr(paid)],
    ['Total Money Received (inflows)', fmtCr(recd)],
    ['Net Gain', fmtCr(Math.max(0, recd - paid))],
    ['Cash Flow Years', (cf.length - 1) + ' years'],
  ]);
}

// ── FINANCIAL PLANNING CALCULATOR ──
function switchFpc(btn, pane) {
  document.querySelectorAll('.fpc-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.fpc-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('fpc-' + pane)?.classList.add('active');
}

function fpcProfessionChange() {
  const sel = document.getElementById('fpc-profession');
  const cost = document.getElementById('fpc-edu-cost');
  if (!sel || !cost) return;
  if (sel.value === 'other') { cost.value = ''; cost.focus(); }
  else cost.value = sel.value;
}

function calcFpcEducation() {
  track('calculator_used', {calc_type: 'fpc_education'});
  const costL = parseFloat(document.getElementById('fpc-edu-cost')?.value) || 0;
  const childAge = parseFloat(document.getElementById('fpc-child-age')?.value);
  const eduAge = parseFloat(document.getElementById('fpc-edu-age')?.value) || 18;
  const infl = (parseFloat(document.getElementById('fpc-edu-infl')?.value) || 8) / 100;
  const ret = (parseFloat(document.getElementById('fpc-edu-ret')?.value) || 10) / 100;
  if (!costL || isNaN(childAge) || eduAge <= childAge) {
    showCalcError('fpc-edu-result', 'Please fill all fields. Education start age must be greater than child\'s current age.');
    return;
  }
  const yrs = eduAge - childAge;
  const cost = costL * 100000;
  const future = cost * Math.pow(1 + infl, yrs);
  // Monthly SIP needed
  const rm = ret / 12, n = yrs * 12;
  const sip = future * rm / (Math.pow(1 + rm, n) - 1);
  // One-time lump sum needed today
  const lump = future / Math.pow(1 + ret, yrs);
  const profSel = document.getElementById('fpc-profession');
  const profName = profSel && profSel.value !== 'other' ? profSel.options[profSel.selectedIndex].text.split(' — ')[0] : 'chosen profession';
  showCalcResult('fpc-edu-result', fmtLakh(future), 'Future Cost of ' + profName + ' (in ' + yrs + ' years)', [
    ['Today\'s Cost', fmtLakh(cost)],
    ['Years to Goal', yrs + ' years'],
    ['Education Inflation Assumed', (infl*100).toFixed(1) + '% p.a.'],
    ['Monthly SIP Needed (at ' + (ret*100).toFixed(0) + '% return)', fmtLakh(Math.ceil(sip))],
    ['OR One-time Investment Today', fmtLakh(Math.ceil(lump))],
  ]);
}

function calcFpcMarriage() {
  track('calculator_used', {calc_type: 'fpc_marriage'});
  const costL = parseFloat(document.getElementById('fpc-mar-cost')?.value) || 0;
  const age = parseFloat(document.getElementById('fpc-mar-age')?.value);
  const target = parseFloat(document.getElementById('fpc-mar-target')?.value) || 27;
  const infl = (parseFloat(document.getElementById('fpc-mar-infl')?.value) || 7) / 100;
  const ret = (parseFloat(document.getElementById('fpc-mar-ret')?.value) || 10) / 100;
  if (!costL || isNaN(age) || target <= age) {
    showCalcError('fpc-mar-result', 'Please fill all fields. Marriage age must be greater than current age.');
    return;
  }
  const yrs = target - age;
  const cost = costL * 100000;
  const future = cost * Math.pow(1 + infl, yrs);
  const rm = ret / 12, n = yrs * 12;
  const sip = future * rm / (Math.pow(1 + rm, n) - 1);
  const lump = future / Math.pow(1 + ret, yrs);
  showCalcResult('fpc-mar-result', fmtLakh(future), 'Future Marriage Cost (in ' + yrs + ' years)', [
    ['Today\'s Cost', fmtLakh(cost)],
    ['Years to Goal', yrs + ' years'],
    ['Inflation Assumed', (infl*100).toFixed(1) + '% p.a.'],
    ['Monthly SIP Needed (at ' + (ret*100).toFixed(0) + '% return)', fmtLakh(Math.ceil(sip))],
    ['OR One-time Investment Today', fmtLakh(Math.ceil(lump))],
  ]);
}

function calcFpcRetirement() {
  track('calculator_used', {calc_type: 'fpc_retirement'});
  const age = parseFloat(document.getElementById('fpc-ret-age')?.value);
  const target = parseFloat(document.getElementById('fpc-ret-target')?.value) || 60;
  const exp = parseFloat(document.getElementById('fpc-ret-exp')?.value) || 0;
  const infl = (parseFloat(document.getElementById('fpc-ret-infl')?.value) || 6) / 100;
  const life = parseFloat(document.getElementById('fpc-ret-life')?.value) || 85;
  const ret = (parseFloat(document.getElementById('fpc-ret-ret')?.value) || 10) / 100;
  if (isNaN(age) || !exp || target <= age || life <= target) {
    showCalcError('fpc-ret-result', 'Please fill all fields correctly (retirement age > current age, life expectancy > retirement age).');
    return;
  }
  const yrsToRetire = target - age;
  const yrsInRetire = life - target;
  const monthlyAtRetire = exp * Math.pow(1 + infl, yrsToRetire);
  // Corpus: present value of inflation-growing expenses during retirement at post-retirement real return
  const realRet = (1 + ret * 0.7) / (1 + infl) - 1; // conservative post-retirement return = 70% of accumulation return
  let corpus;
  if (Math.abs(realRet) < 0.0001) corpus = monthlyAtRetire * 12 * yrsInRetire;
  else corpus = monthlyAtRetire * 12 * (1 - Math.pow(1 + realRet, -yrsInRetire)) / realRet;
  const rm = ret / 12, n = yrsToRetire * 12;
  const sip = corpus * rm / (Math.pow(1 + rm, n) - 1);
  showCalcResult('fpc-ret-result', fmtLakh(Math.round(corpus)), 'Retirement Corpus Needed at Age ' + target, [
    ['Monthly Expenses Today', fmtLakh(exp)],
    ['Monthly Expenses at Retirement', fmtLakh(Math.round(monthlyAtRetire))],
    ['Years in Retirement', yrsInRetire + ' years'],
    ['Monthly SIP Needed (at ' + (ret*100).toFixed(0) + '% return)', fmtLakh(Math.ceil(sip))],
  ]);
}

// Initialise ULIP live calc on load
document.addEventListener('DOMContentLoaded', function() { setTimeout(calcULIPLive, 500); });
