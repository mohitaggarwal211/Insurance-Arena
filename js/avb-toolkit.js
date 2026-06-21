// ══════════════════════════════════════════════════════
// A vs B COMPARISON ENGINE + COMMUNICATION TOOLKIT
// Insurance Arena — Client-side only, no API
// ══════════════════════════════════════════════════════

// ── SHARED STATE ──
let avbProductA = null;
let avbProductB = null;
let toolkitProduct = null;
let toolkitProductB = null;
let lastCompareCat = 'term';

// ══════════════════════════════════════════════════════
// A vs B ENGINE
// ══════════════════════════════════════════════════════

function renderAvB(cat) {
  lastCompareCat = cat;
  const wrap = document.getElementById('avbWrap');
  if (!wrap) return;

  const cats = ['Term Insurance','Participating Endowment','Guaranteed Early Income','Guaranteed Savings','Guaranteed Long Term Income','Annuity'];
  const catMap = { term:'Term Insurance', par:'Participating Endowment', nonpar:'Guaranteed Savings', annuity:'Annuity' };
  const defaultCat = catMap[cat] || 'Term Insurance';

  wrap.innerHTML = `
  <div class="avb-header">
    <div class="avb-title">⚡ Product A vs Product B</div>
    <div class="avb-sub">Compare any two plans from Insurance Arena's verified dataset</div>
  </div>

  <div class="avb-selectors">
    <div class="avb-selector-col">
      <div class="avb-sel-label">Product A</div>
      <select class="avb-cat-sel" id="avbCatA" onchange="updateAvBPlans('A')">
        ${cats.map(c=>`<option${c===defaultCat?' selected':''}>${san(c)}</option>`).join('')}
      </select>
      <select class="avb-plan-sel" id="avbPlanA" onchange="selectAvBPlan('A')">
        <option value="">— Select Plan —</option>
      </select>
    </div>
    <div class="avb-vs-divider">VS</div>
    <div class="avb-selector-col">
      <div class="avb-sel-label">Product B</div>
      <select class="avb-cat-sel" id="avbCatB" onchange="updateAvBPlans('B')">
        ${cats.map(c=>`<option${c===defaultCat?' selected':''}>${san(c)}</option>`).join('')}
      </select>
      <select class="avb-plan-sel" id="avbPlanB" onchange="selectAvBPlan('B')">
        <option value="">— Select Plan —</option>
      </select>
    </div>
  </div>

  <button class="avb-compare-btn" onclick="runAvBComparison()" id="avbRunBtn" disabled>⚡ Compare Now</button>

  <div class="avb-results hidden" id="avbResults"></div>`;

  updateAvBPlans('A');
  updateAvBPlans('B');
}

function updateAvBPlans(side) {
  const catSel = document.getElementById('avbCat' + side);
  const planSel = document.getElementById('avbPlan' + side);
  if (!catSel || !planSel) return;
  const cat = catSel.value;
  const plans = PRODUCT_REGISTRY.filter(p => p.category === cat);
  planSel.innerHTML = '<option value="">— Select Plan —</option>' +
    plans.map(p => `<option value="${san(p.regId)}">${san(p.company)} — ${san(p.plan)}</option>`).join('');
  if (side === 'A') avbProductA = null;
  else avbProductB = null;
  checkAvBReady();
}

function selectAvBPlan(side) {
  const planSel = document.getElementById('avbPlan' + side);
  const regId = planSel?.value;
  if (!regId) { if(side==='A') avbProductA=null; else avbProductB=null; }
  else {
    const p = PRODUCT_REGISTRY.find(x => x.regId === regId);
    if (side === 'A') avbProductA = p; else avbProductB = p;
  }
  checkAvBReady();
}

function checkAvBReady() {
  const btn = document.getElementById('avbRunBtn');
  if (btn) btn.disabled = !(avbProductA && avbProductB);
}

function runAvBComparison() {
  const a = avbProductA, b = avbProductB;
  if (!a || !b) return;
  const res = document.getElementById('avbResults');
  if (!res) return;
  res.classList.remove('hidden');

  const compFields = [
    ['Company', a.company, b.company],
    ['Plan Name', a.plan, b.plan],
    ['Category', a.category, b.category],
    ['Product Type', a.type, b.type],
    ['Entry Age', a.entryAge, b.entryAge],
    ['Maturity Age', a.maturityAge, b.maturityAge],
    ['Premium Paying Term', a.ppt, b.ppt],
    ['Policy Term', a.pt, b.pt],
    ['Death Benefit', a.deathBenefit, b.deathBenefit],
    ['Riders Available', a.riders, b.riders],
    ['Loan Facility', a.loan?'✅ Yes':'❌ No', b.loan?'✅ Yes':'❌ No'],
    ['Joint Life', a.jointLife?'✅ Yes':'❌ No', b.jointLife?'✅ Yes':'❌ No'],
    ['Guaranteed Additions', a.guaranteedAdditions?'✅ Yes':'❌ No', b.guaranteedAdditions?'✅ Yes':'❌ No'],
    ['Loyalty Additions', a.loyaltyAdditions?'✅ Yes':'❌ No', b.loyaltyAdditions?'✅ Yes':'❌ No'],
    ['Income Benefit', a.incomeBenefit?'✅ Yes':'❌ No', b.incomeBenefit?'✅ Yes':'❌ No'],
    ['Income Period', a.incomePeriod, b.incomePeriod],
    ['Income Frequency', a.incomeFrequency, b.incomeFrequency],
    ['Best Suitable For', a.bestFor, b.bestFor],
    ['Unique Advantage', a.uniqueAdvantage, b.uniqueAdvantage],
  ];

  const tableRows = compFields.map(([label, va, vb]) => {
    const aV = va||'—'; const bV = vb||'—';
    const aMatch = aV === bV;
    return `<tr>
      <td class="avb-field">${san(label)}</td>
      <td class="avb-val-a${aV==='✅ Yes'?' avb-yes':aV==='❌ No'?' avb-no':''}">${san(aV)}</td>
      <td class="avb-val-b${bV==='✅ Yes'?' avb-yes':bV==='❌ No'?' avb-no':''}">${san(bV)}</td>
    </tr>`;
  }).join('');

  // Score calculation
  const aScore = calcAvBScore(a);
  const bScore = calcAvBScore(b);

  // Limitations
  const aLims = (a.meta?.limitations || []).slice(0,4);
  const bLims = (b.meta?.limitations || []).slice(0,4);
  const limRows = Math.max(aLims.length, bLims.length);
  let limTable = '';
  for(let i=0;i<limRows;i++){
    limTable += `<tr>
      <td class="avb-lim-val">${aLims[i] ? '• ' + san(aLims[i]) : ''}</td>
      <td class="avb-lim-val">${bLims[i] ? '• ' + san(bLims[i]) : ''}</td>
    </tr>`;
  }

  // URL buttons
  const aUrl  = a.productUrl ? `<a href="${san(a.productUrl)}" target="_blank" rel="noopener noreferrer" class="avb-url-btn">🔗 Product Details</a>` : `<span class="avb-url-na">Official link unavailable</span>`;
  const aBro  = a.brochureUrl ? `<a href="${san(a.brochureUrl)}" target="_blank" rel="noopener noreferrer" class="avb-url-btn sec">📄 Brochure</a>` : '';
  const bUrl  = b.productUrl ? `<a href="${san(b.productUrl)}" target="_blank" rel="noopener noreferrer" class="avb-url-btn">🔗 Product Details</a>` : `<span class="avb-url-na">Official link unavailable</span>`;
  const bBro  = b.brochureUrl ? `<a href="${san(b.brochureUrl)}" target="_blank" rel="noopener noreferrer" class="avb-url-btn sec">📄 Brochure</a>` : '';

  res.innerHTML = `
  <!-- COMPARISON TABLE -->
  <div class="avb-section">
    <div class="avb-sec-title">📋 Side-by-Side Comparison</div>
    <div class="avb-tbl-scroll">
      <table class="avb-tbl">
        <thead><tr>
          <th class="avb-th-field">Feature</th>
          <th class="avb-th-a">${san(a.company)}<br/><small>${san(a.plan)}</small></th>
          <th class="avb-th-b">${san(b.company)}<br/><small>${san(b.plan)}</small></th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  </div>

  <!-- VISUAL SCORECARD -->
  <div class="avb-section">
    <div class="avb-sec-title">📊 Visual Scorecard</div>
    <div class="avb-score-note">Based on verified product attributes only — not financial advice</div>
    ${buildScorecard(a, aScore, b, bScore)}
  </div>

  <!-- WHY CHOOSE -->
  <div class="avb-section avb-why-grid">
    <div class="avb-why-box a">
      <div class="avb-why-title">Why Choose ${san(a.company)} ${san(a.plan)}</div>
      <div class="avb-why-text">${san(a.meta?.whySuit || 'Refer to official brochure for suitability details.')}</div>
      <div class="avb-why-best"><strong>Best For:</strong> ${san(a.meta?.bestFor || '—')}</div>
    </div>
    <div class="avb-why-box b">
      <div class="avb-why-title">Why Choose ${san(b.company)} ${san(b.plan)}</div>
      <div class="avb-why-text">${san(b.meta?.whySuit || 'Refer to official brochure for suitability details.')}</div>
      <div class="avb-why-best"><strong>Best For:</strong> ${san(b.meta?.bestFor || '—')}</div>
    </div>
  </div>

  <!-- THINGS TO CONSIDER -->
  <div class="avb-section">
    <div class="avb-sec-title">⚠️ Things To Consider</div>
    <div class="avb-tbl-scroll">
      <table class="avb-lim-tbl">
        <thead><tr>
          <th>${san(a.company)} — ${san(a.plan)}</th>
          <th>${san(b.company)} — ${san(b.plan)}</th>
        </tr></thead>
        <tbody>${limTable}</tbody>
      </table>
    </div>
  </div>

  <!-- PRODUCT ACCESS -->
  <div class="avb-section avb-access-grid">
    <div class="avb-access-col">
      <div class="avb-access-label">${san(a.company)} — ${san(a.plan)}</div>
      <div class="avb-access-btns">${aUrl}${aBro}</div>
    </div>
    <div class="avb-access-col">
      <div class="avb-access-label">${san(b.company)} — ${san(b.plan)}</div>
      <div class="avb-access-btns">${bUrl}${bBro}</div>
    </div>
  </div>

  <!-- TOOLKIT SHORTCUT -->
  <div class="avb-section">
    <div class="avb-toolkit-cta">
      <div class="avb-cta-text">Generate client-ready WhatsApp, Email or Pitch for this comparison</div>
      <button class="avb-cta-btn" onclick="openToolkitFromAvB()">📱 Open Communication Toolkit →</button>
    </div>
  </div>

  <!-- PDF -->
  <div class="avb-section">
    <button class="avb-pdf-btn" onclick="downloadAvBPDF('${san(a.company)}','${san(a.plan)}','${san(b.company)}','${san(b.plan)}')">📄 Download Comparison PDF</button>
  </div>

  <div class="avb-disclaimer">⚠️ This comparison is for educational and informational purposes only. Not financial advice. All data sourced from verified product information. Please read official brochures before making any decision.</div>`;

  res.scrollIntoView({ behavior:'smooth', block:'start' });
}

function calcAvBScore(p) {
  if (p.meta?.scoreData) return p.meta.scoreData;
  // Auto-derive score from available fields
  return {
    flexibility: Math.min(10, (p.ppt && p.ppt !== '—' ? 5 : 2) + (p.pt && p.pt !== '—' ? 3 : 1)),
    protection:  p.deathBenefit && p.deathBenefit !== '—' ? 7 : 4,
    income:      p.incomeBenefit ? 8 : 1,
    riders:      p.riders && p.riders !== '—' ? 7 : 2,
    loan:        p.loan ? 10 : 0,
    jointLife:   p.jointLife ? 10 : 0
  };
}

function buildScorecard(a, aS, b, bS) {
  const attrs = [
    { key:'flexibility', label:'Flexibility', icon:'🔄' },
    { key:'protection',  label:'Protection',  icon:'🛡️' },
    { key:'income',      label:'Income Features', icon:'💰' },
    { key:'riders',      label:'Rider Options',   icon:'➕' },
    { key:'loan',        label:'Loan Facility',   icon:'🏦' },
    { key:'jointLife',   label:'Joint Life',      icon:'👥' },
  ];
  const aTotal = (Object.values(aS).reduce((s,v)=>s+v,0)/Object.keys(aS).length).toFixed(1);
  const bTotal = (Object.values(bS).reduce((s,v)=>s+v,0)/Object.keys(bS).length).toFixed(1);

  const rows = attrs.map(({ key, label, icon }) => {
    const av = aS[key] ?? 5;
    const bv = bS[key] ?? 5;
    const aColor = av>=8?'#22C55E':av>=5?'#00C4B4':'#FBBF24';
    const bColor = bv>=8?'#22C55E':bv>=5?'#3B82F6':'#FBBF24';
    return `<div class="sc-row">
      <div class="sc-attr">${icon} ${san(label)}</div>
      <div class="sc-bars">
        <div class="sc-bar-row a">
          <span class="sc-co">${san(a.company)}</span>
          <div class="sc-track"><div class="sc-fill" style="width:${av*10}%;background:${aColor}"></div></div>
          <span class="sc-val">${av.toFixed(1)}</span>
        </div>
        <div class="sc-bar-row b">
          <span class="sc-co">${san(b.company)}</span>
          <div class="sc-track"><div class="sc-fill" style="width:${bv*10}%;background:${bColor}"></div></div>
          <span class="sc-val">${bv.toFixed(1)}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  return `<div class="scorecard">
    ${rows}
    <div class="sc-total-row">
      <div class="sc-total-label">Overall Score</div>
      <div class="sc-totals">
        <div class="sc-total-a">${san(a.company)}: <strong>${aTotal}</strong>/10</div>
        <div class="sc-total-b">${san(b.company)}: <strong>${bTotal}</strong>/10</div>
      </div>
    </div>
  </div>`;
}

// ── PDF Download (print-based, zero libraries) ──
function downloadAvBPDF(coA, plA, coB, plB) {
  const a = avbProductA, b = avbProductB;
  if (!a || !b) return;
  const aS = calcAvBScore(a), bS = calcAvBScore(b);

  const html = `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><title>Insurance Arena — Comparison</title>
<style>
body{font-family:Arial,sans-serif;font-size:12px;color:#1E293B;max-width:800px;margin:0 auto;padding:20px}
h1{color:#0F172A;font-size:18px;border-bottom:2px solid #00C4B4;padding-bottom:6px}
h2{font-size:13px;color:#0F172A;margin:14px 0 6px}
table{border-collapse:collapse;width:100%;margin:8px 0}
th{background:#1E293B;color:#fff;padding:8px;text-align:left;font-size:11px}
td{padding:7px 8px;border-bottom:1px solid #E2E8F0;font-size:11px}
.label{color:#64748B;font-weight:600;width:35%}
.yes{color:#16A34A}.no{color:#DC2626}
.footer{font-size:9px;color:#94A3B8;margin-top:16px;border-top:1px solid #E2E8F0;padding-top:8px}
.brand{color:#00C4B4;font-weight:700}
</style></head><body>
<h1><span class="brand">Insurance Arena™</span> — Product Comparison Report</h1>
<p style="color:#64748B;font-size:11px">Generated: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})} | Source: insurance-arena.vercel.app</p>
<h2>${san(coA)} — ${san(plA)} &nbsp; vs &nbsp; ${san(coB)} — ${san(plB)}</h2>
<table>
<thead><tr><th>Feature</th><th>${san(coA)}</th><th>${san(coB)}</th></tr></thead>
<tbody>
${[['Company',a.company,b.company],['Plan',a.plan,b.plan],['Type',a.type,b.type],['Category',a.category,b.category],
  ['Entry Age',a.entryAge,b.entryAge],['PPT',a.ppt,b.ppt],['PT / Plan Term',a.pt,b.pt],
  ['Death Benefit',a.deathBenefit,b.deathBenefit],['Loan',a.loan?'Yes':'No',b.loan?'Yes':'No'],
  ['Joint Life',a.jointLife?'Yes':'No',b.jointLife?'Yes':'No'],
  ['Guaranteed Additions',a.guaranteedAdditions?'Yes':'No',b.guaranteedAdditions?'Yes':'No'],
  ['Income Benefit',a.incomeBenefit?'Yes':'No',b.incomeBenefit?'Yes':'No'],
  ['Income Period',a.incomePeriod,b.incomePeriod],
  ['Best Suitable For',a.bestFor,b.bestFor]
].map(([l,va,vb])=>`<tr><td class="label">${l}</td><td>${va||'—'}</td><td>${vb||'—'}</td></tr>`).join('')}
</tbody></table>
<h2>Official Links</h2>
<p>${san(coA)}: ${a.productUrl||'Official link unavailable'}</p>
<p>${san(coB)}: ${b.productUrl||'Official link unavailable'}</p>
<div class="footer">⚠️ This report is for educational and informational purposes only. It does not constitute financial advice. Data sourced from verified product information available in the public domain. Please read official brochures before making any decision.</div>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 400);
}

// ══════════════════════════════════════════════════════
// COMMUNICATION TOOLKIT
// ══════════════════════════════════════════════════════

function renderToolkit(cat) {
  lastCompareCat = cat;
  const wrap = document.getElementById('toolkitWrap');
  if (!wrap) return;

  const catMap = { term:'Term Insurance', par:'Participating Endowment', nonpar:'Guaranteed Savings', annuity:'Annuity' };
  const defaultCat = catMap[cat] || 'Term Insurance';
  const cats = ['Term Insurance','Participating Endowment','Guaranteed Early Income','Guaranteed Savings','Guaranteed Long Term Income','Annuity'];

  wrap.innerHTML = `
  <div class="tk-header">
    <div class="tk-title">📱 Communication Toolkit</div>
    <div class="tk-sub">Generate client-ready WhatsApp messages, emails and pitches</div>
  </div>

  <div class="tk-form">
    <div class="tk-row-2">
      <div class="tk-field">
        <label class="tk-label">Customer Name</label>
        <input type="text" id="tkName" class="tk-input" placeholder="e.g. Rahul Sharma">
      </div>
      <div class="tk-field">
        <label class="tk-label">Age</label>
        <input type="number" id="tkAge" class="tk-input" placeholder="e.g. 35" min="18" max="70">
      </div>
    </div>
    <div class="tk-field">
      <label class="tk-label">Occupation</label>
      <input type="text" id="tkOccupation" class="tk-input" placeholder="e.g. IT Professional, Business Owner">
    </div>

    <div class="tk-field">
      <label class="tk-label">Financial Goal</label>
      <div class="tk-chips" id="tkGoalChips">
        ${['Child Education','Retirement Planning','Wealth Creation','Guaranteed Income','Family Protection'].map((g,i)=>
          `<button class="tk-chip${i===0?' active':''}" onclick="selectChip('tkGoalChips',this,'${g}')">${g}</button>`
        ).join('')}
      </div>
      <input type="hidden" id="tkGoal" value="Child Education">
    </div>

    <div class="tk-field">
      <label class="tk-label">Risk Profile</label>
      <div class="tk-chips" id="tkRiskChips">
        ${['Conservative','Moderate','Aggressive'].map((r,i)=>
          `<button class="tk-chip${i===0?' active':''}" onclick="selectChip('tkRiskChips',this,'${r}')">${r}</button>`
        ).join('')}
      </div>
      <input type="hidden" id="tkRisk" value="Conservative">
    </div>

    <div class="tk-field">
      <label class="tk-label">Message Type</label>
      <div class="tk-chips" id="tkTypeChips">
        <button class="tk-chip active" onclick="selectTkType('single',this)">Single Product</button>
        <button class="tk-chip" onclick="selectTkType('comparison',this)">Product Comparison</button>
      </div>
    </div>

    <!-- Single product selector -->
    <div id="tkSingleSel">
      <div class="tk-row-2">
        <div class="tk-field">
          <label class="tk-label">Category</label>
          <select class="tk-select" id="tkCatA" onchange="updateTkPlans('A')">
            ${cats.map(c=>`<option${c===defaultCat?' selected':''}>${san(c)}</option>`).join('')}
          </select>
        </div>
        <div class="tk-field">
          <label class="tk-label">Plan</label>
          <select class="tk-select" id="tkPlanA" onchange="selectTkPlan('A')">
            <option value="">— Select —</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Comparison selector -->
    <div id="tkCompSel" class="hidden">
      <div class="tk-row-2">
        <div class="tk-field">
          <label class="tk-label">Plan A Category</label>
          <select class="tk-select" id="tkCatC_A" onchange="updateTkPlans('C_A')">
            ${cats.map(c=>`<option${c===defaultCat?' selected':''}>${san(c)}</option>`).join('')}
          </select>
        </div>
        <div class="tk-field">
          <label class="tk-label">Plan A</label>
          <select class="tk-select" id="tkPlanC_A" onchange="selectTkPlan('C_A')">
            <option value="">— Select —</option>
          </select>
        </div>
      </div>
      <div class="tk-row-2">
        <div class="tk-field">
          <label class="tk-label">Plan B Category</label>
          <select class="tk-select" id="tkCatC_B" onchange="updateTkPlans('C_B')">
            ${cats.map(c=>`<option${c===defaultCat?' selected':''}>${san(c)}</option>`).join('')}
          </select>
        </div>
        <div class="tk-field">
          <label class="tk-label">Plan B</label>
          <select class="tk-select" id="tkPlanC_B" onchange="selectTkPlan('C_B')">
            <option value="">— Select —</option>
          </select>
        </div>
      </div>
    </div>

    <button class="tk-gen-btn" onclick="generateMessages()">🚀 Generate Messages</button>
  </div>

  <!-- OUTPUT AREA -->
  <div class="tk-outputs hidden" id="tkOutputs"></div>`;

  // Init selects
  updateTkPlans('A');
  updateTkPlans('C_A');
  updateTkPlans('C_B');
}

let tkMode = 'single';

function selectChip(groupId, el, value) {
  document.querySelectorAll('#' + groupId + ' .tk-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const inputId = groupId === 'tkGoalChips' ? 'tkGoal' : 'tkRisk';
  const inp = document.getElementById(inputId);
  if (inp) inp.value = value;
}

function selectTkType(mode, el) {
  tkMode = mode;
  document.querySelectorAll('#tkTypeChips .tk-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tkSingleSel').classList.toggle('hidden', mode !== 'single');
  document.getElementById('tkCompSel').classList.toggle('hidden', mode !== 'comparison');
}

function updateTkPlans(side) {
  const catEl = document.getElementById('tkCat' + side);
  const planEl = document.getElementById('tkPlan' + side);
  if (!catEl || !planEl) return;
  const plans = PRODUCT_REGISTRY.filter(p => p.category === catEl.value);
  planEl.innerHTML = '<option value="">— Select —</option>' +
    plans.map(p => `<option value="${san(p.regId)}">${san(p.company)} — ${san(p.plan)}</option>`).join('');
}

function selectTkPlan(side) {
  const planEl = document.getElementById('tkPlan' + side);
  const p = PRODUCT_REGISTRY.find(x => x.regId === planEl?.value);
  if (side === 'A') toolkitProduct = p;
  else if (side === 'C_A') toolkitProduct = p;
  else toolkitProductB = p;
}

function generateMessages() {
  const name = document.getElementById('tkName')?.value?.trim() || 'Valued Customer';
  const age  = document.getElementById('tkAge')?.value?.trim() || '';
  const occ  = document.getElementById('tkOccupation')?.value?.trim() || '';
  const goal = document.getElementById('tkGoal')?.value || 'Financial Planning';
  const risk = document.getElementById('tkRisk')?.value || 'Conservative';

  const outputs = document.getElementById('tkOutputs');
  if (!outputs) return;

  let wa = '', email = '', pitch = '';
  const subj = name ? `${name}'s ${goal} — ` : '';

  if (tkMode === 'single') {
    const p = toolkitProduct;
    if (!p) { alert('Please select a plan.'); return; }
    const bro = p.brochureUrl ? p.brochureUrl : 'Official link unavailable';
    const prodUrl = p.productUrl || 'Official link unavailable';
    const highlights = (p.meta?.keyHighlights || []).slice(0,4).map(h=>`✅ ${h}`).join('\n');

    wa = `Hi ${name} 👋\n\nHope you're doing well!\n\nAs we discussed your goal of *${goal}*, I wanted to share a plan that may be relevant for you.\n\n📌 *${p.plan}*\n_${p.company} | ${p.type}_\n\n${highlights || '✅ Plan details from official brochure'}\n\n💡 ${getRiskNote(risk, goal)}\n\n📎 Brochure: ${bro}\n\n_This message is for educational purposes only and does not constitute financial advice. Please read the official brochure before making any decision._\n\n— [Advisor Name]`;

    email = `Subject: ${subj}${p.plan} — Product Information\n\nDear ${name},\n\nThank you for the opportunity to share relevant financial planning information with you.\n\nBased on your goal of ${goal} and your ${risk.toLowerCase()} risk approach${age?`, considering your age of ${age} years`:''}${occ?` and occupation as ${occ}`:'`'}, I would like to share the following plan for your consideration.\n\n────────────────────────\nPlan: ${p.plan}\nCompany: ${p.company}\nType: ${p.type}\nCategory: ${p.category}\n────────────────────────\n\nKey Features:\n${(p.meta?.keyHighlights||[]).map(h=>`• ${h}`).join('\n')||'• Refer official brochure for complete features'}\n\n${p.meta?.whySuit ? 'Why This May Be Relevant:\n' + p.meta.whySuit + '\n\n' : ''}Official Brochure: ${bro}\nProduct Page: ${prodUrl}\n\n────────────────────────\nDISCLAIMER\nThis communication is for educational and informational purposes only. It does not constitute financial advice. Past performance is not indicative of future results. Please read the official product brochure carefully and consult a qualified advisor before making any decision.\n────────────────────────\n\nWarm regards,\n[Advisor Name]`;

    pitch = getPitch(p, null, goal, risk);

  } else {
    const a = toolkitProduct, b = toolkitProductB;
    if (!a || !b) { alert('Please select both plans.'); return; }
    const aBro = a.brochureUrl || 'Official link unavailable';
    const bBro = b.brochureUrl || 'Official link unavailable';

    wa = `Hi ${name} 👋\n\nFollowing our discussion on *${goal}*, here is a quick comparison for your reference.\n\n🔵 *${a.plan}* — _${a.company}_\n${(a.meta?.keyHighlights||[]).slice(0,3).map(h=>`• ${h}`).join('\n')||'• Refer brochure'}\n\n🟢 *${b.plan}* — _${b.company}_\n${(b.meta?.keyHighlights||[]).slice(0,3).map(h=>`• ${h}`).join('\n')||'• Refer brochure'}\n\n*When ${a.company} may suit you:*\n${getCompReason(a, goal)}\n\n*When ${b.company} may suit you:*\n${getCompReason(b, goal)}\n\n📎 ${a.company} Brochure: ${aBro}\n📎 ${b.company} Brochure: ${bBro}\n\n_Educational information only. Not financial advice. Read official brochures carefully._`;

    email = `Subject: ${subj}Product Comparison — ${a.plan} vs ${b.plan}\n\nDear ${name},\n\nThank you for exploring your ${goal.toLowerCase()} planning options. Here is a comparison of two relevant plans for your reference.\n\n────────────────────────\nPlan A: ${a.plan}\nCompany: ${a.company} | Type: ${a.type}\n${(a.meta?.keyHighlights||[]).map(h=>`• ${h}`).join('\n')}\n\nWhen Plan A may be relevant:\n${getCompReason(a,goal)}\n\n────────────────────────\nPlan B: ${b.plan}\nCompany: ${b.company} | Type: ${b.type}\n${(b.meta?.keyHighlights||[]).map(h=>`• ${h}`).join('\n')}\n\nWhen Plan B may be relevant:\n${getCompReason(b,goal)}\n\n────────────────────────\nOfficial Links\n${a.company} Brochure: ${aBro}\n${b.company} Brochure: ${bBro}\n\nDISCLAIMER: This communication is for educational purposes only. Not financial advice. Read official brochures before any decision.\n\nWarm regards,\n[Advisor Name]`;

    pitch = getPitch(a, b, goal, risk);
  }

  outputs.classList.remove('hidden');
  outputs.innerHTML = `
  <div class="tk-out-block">
    <div class="tk-out-title">📱 WhatsApp Message</div>
    <pre class="tk-out-text" id="waText">${san(wa)}</pre>
    <div class="tk-out-btns">
      <button class="tk-copy-btn" onclick="copyText('waText','Copied!')">📋 Copy</button>
      <button class="tk-share-btn" onclick="shareWA('waText')">📤 Share via WhatsApp</button>
    </div>
  </div>

  <div class="tk-out-block">
    <div class="tk-out-title">📧 Email Draft</div>
    <pre class="tk-out-text" id="emailText">${san(email)}</pre>
    <div class="tk-out-btns">
      <button class="tk-copy-btn" onclick="copyText('emailText','Copied!')">📋 Copy Email</button>
    </div>
  </div>

  <div class="tk-out-block">
    <div class="tk-out-title">🎤 30-Second Advisor Pitch</div>
    <div class="tk-pitch-box" id="pitchText">${san(pitch)}</div>
    <div class="tk-out-btns">
      <button class="tk-copy-btn" onclick="copyPitch()">📋 Copy Pitch</button>
    </div>
  </div>

  <div class="tk-disclaimer">⚠️ All generated messages are for educational and informational purposes only. They do not constitute financial advice. No return or IRR figures are included. Always direct clients to read official brochures before making any decision.</div>`;

  outputs.scrollIntoView({ behavior:'smooth', block:'start' });
}

function getRiskNote(risk, goal) {
  const notes = {
    Conservative: `Since you prefer a low-risk approach, this plan's guaranteed benefit structure may align well with your ${goal.toLowerCase()} objective.`,
    Moderate: `For someone with a balanced approach, this plan combines security with meaningful long-term benefits for ${goal.toLowerCase()}.`,
    Aggressive: `While you're open to growth-oriented options, this plan's guaranteed foundation can serve as a stable base for your ${goal.toLowerCase()} strategy.`
  };
  return notes[risk] || `This plan may align with your ${goal.toLowerCase()} objective.`;
}

function getCompReason(p, goal) {
  const highlights = (p.meta?.keyHighlights||[]).slice(0,2);
  if (highlights.length) return highlights.map(h=>`• ${h}`).join('\n');
  return `• Refer to the official brochure for ${p.company}'s key differentiators`;
}

function getPitch(a, b, goal, risk) {
  if (!b) {
    const highlights = (a.meta?.keyHighlights||[]).slice(0,2).join('; ');
    return `"Sir/Ma'am, based on your objective of ${goal.toLowerCase()}, this plan from ${a.company} may be relevant for you.\n\nIt is a ${a.type.toLowerCase()} plan${highlights ? ' — ' + highlights + '.' : '.'}\n\nFor someone with a ${risk.toLowerCase()} approach, ${risk==='Conservative'?'the guaranteed nature of benefits provides certainty without market dependency':'this structure balances security with meaningful long-term value'}.\n\nI would recommend going through the official brochure for complete details before making any decision."`;
  }
  const sameType = a.type === b.type ? 'similar product types' : 'different product structures';
  return `"Sir/Ma'am, you're exploring options for ${goal.toLowerCase()} and I have two plans worth considering.\n\n${a.plan} from ${a.company} — ${(a.meta?.keyHighlights||['see brochure'])[0]}.\n\n${b.plan} from ${b.company} — ${(b.meta?.keyHighlights||['see brochure'])[0]}.\n\nBoth are ${sameType} — the right fit depends on your specific priorities. I'd be happy to walk you through both brochures so you can make an informed choice."`;
}

function copyText(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard?.writeText(el.textContent).then(() => {
    const btns = el.nextElementSibling?.querySelectorAll('.tk-copy-btn');
    if (btns) btns.forEach(b => { b.textContent = '✓ ' + msg; setTimeout(() => b.textContent = b.textContent.replace('✓ ','📋 '), 2000); });
  }).catch(() => {
    const range = document.createRange(); range.selectNode(el);
    window.getSelection().removeAllRanges(); window.getSelection().addRange(range);
    document.execCommand('copy');
  });
}

function copyPitch() {
  const el = document.getElementById('pitchText');
  if (!el) return;
  navigator.clipboard?.writeText(el.textContent);
}

function shareWA(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = encodeURIComponent(el.textContent);
  window.open('https://wa.me/?text=' + text, '_blank');
}

function openToolkitFromAvB() {
  // Pre-populate toolkit with current A vs B selection
  toolkitProduct = avbProductA;
  toolkitProductB = avbProductB;
  // Switch to toolkit mode
  const catBtn = document.querySelector('[data-mode="toolkit"]');
  if (catBtn) catBtn.click();
}

// ── PATCH: Save button + Diff highlight wired into runAvBComparison ──
const _origRunAvB = runAvBComparison;
function runAvBComparison() {
  _origRunAvB();
  // After results render, apply diff highlight and save button
  setTimeout(() => {
    applyDiffHighlight();
    // Add Save button if not present
    const res = document.getElementById('avbResults');
    if (res && !document.getElementById('avbSaveBtn')) {
      const saveBtn = document.createElement('button');
      saveBtn.id = 'avbSaveBtn';
      saveBtn.className = 'avb-save-btn';
      saveBtn.textContent = '📌 Save This Comparison';
      saveBtn.onclick = saveCurrentComparison;
      res.prepend(saveBtn);
    }
    // Render saved comparisons above selectors
    const wrap = document.getElementById('avbWrap');
    if (wrap && !document.getElementById('savedCompsWrap')) {
      const scDiv = document.createElement('div');
      scDiv.id = 'savedCompsWrap';
      wrap.prepend(scDiv);
    }
    renderSavedComparisons();
  }, 150);
}
