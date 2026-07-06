
// ══════════════════════════════════════════════════════
// SINGLE PRODUCT PDF GENERATOR
// ══════════════════════════════════════════════════════

function generateSingleProductPDF(plan, cat) {
  if (!plan) return;
  cat = cat || plan.catKey || 'term'; // fallback to plan's own catKey
  const co = plan.companyFull || plan.company || '';
  const pl = plan.plan || plan.planName || '';

  function val(v) {
    if (v === null || v === undefined || v === '' || v === false) return '—';
    const s = String(v);
    if (s.toLowerCase().startsWith('verify') || s.toLowerCase().includes('verify from')) return '—';
    return s;
  }
  function feat(arr, keywords, fallback) {
    const kws = keywords.map(k => k.toLowerCase());
    const match = (arr||[]).find(f => kws.some(kw => f.toLowerCase().includes(kw)));
    return match || fallback;
  }
  function bool(v, y, n) { return v ? (y||'✅ Available') : (n||'❌ Not Available'); }

  const kf = plan.keyFeatures || plan.keyHighlights || plan.meta?.keyHighlights || [];
  const pitch = plan.salesPitch || plan.pitch || '';
  const bestFor = plan.meta?.bestFor || plan.bestFor || '';
  const productUrl = plan.productUrl || plan.calcUrl || plan.url || '';
  const brochureUrl = plan.brochureUrl || plan.brochure || '';

  // ── Build rows based on category ──
  let sections = [];

  // ── IDENTITY (all categories) ──
  sections.push({ title: '📋 PLAN IDENTITY', rows: [
    ['Company', val(co)],
    ['Plan Name', val(pl)],
    ['UIN (IRDAI Registration)', val(plan.uin)],
    ['Plan Type', val(plan.type)],
    ...(plan.csr ? [['Claim Settlement Ratio (FY 25-26)', plan.csr + '%']] : []),
    ...(plan.lastUpdated || plan.dataDate ? [['Data Last Verified', val(plan.lastUpdated || plan.dataDate)]] : []),
  ]});

  // ── TERM SPECIFIC ──
  if (cat === 'term') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maximum Maturity Age', val(plan.maxMaturity)],
      ['Minimum Sum Assured', val(plan.minSA)],
      ['Maximum Sum Assured', val(plan.maxSA)],
      ['Premium Payment Options', val(plan.premiumPay)],
      ['Limited Pay Terms Available', val(plan.limitedPayTerms)],
      ['Premium Modes', val(plan.premiumModes)],
    ]});
    sections.push({ title: '☠️ CORE DEATH BENEFIT', rows: [
      ['Death Benefit Options', val(plan.deathBenefit)],
      ['Whole Life Option', bool(plan.wholeLife, '✅ Available', '❌ Not Available')],
    ]});
    sections.push({ title: '🛡️ INBUILT PROTECTIONS', rows: [
      ['Terminal Illness Benefit', feat(kf, ['terminal illness'], bool(plan.terminalIllness, '✅ Inbuilt — accelerated payout on diagnosis', '❌ Not Available'))],
      ['Accidental Death Benefit', feat(kf, ['accidental death', 'adb'], bool(plan.accidentalDeath, '✅ Available', '❌ Not Available'))],
      ['Critical Illness Benefit', feat(kf, ['critical illness'], bool(plan.criticalIllness, '✅ Available', '❌ Not Available'))],
      ['Waiver of Premium on Disability', feat(kf, ['waiver of premium', 'wop', 'disability'], bool(plan.wopDisability, '✅ Inbuilt', '❌ Not Available'))],
      ['Return of Premium', feat(kf, ['return of premium', 'rop'], bool(plan.returnOfPremium, '✅ Available as option', '❌ Not Available'))],
    ]});
    sections.push({ title: '🔄 FLEXIBILITY & FEATURES', rows: [
      ['Premium Break Facility', feat(kf, ['premium break'], bool(plan.premiumBreak, '✅ Available after specified years', '❌ Not Available'))],
      ['Smart Exit / Zero Cost Withdrawal', feat(kf, ['smart exit', 'zero cost', 'zero-cost'], bool(plan.smartExit, '✅ Available after 25 policy years', '❌ Not Available'))],
      ['Life Stage Benefit', feat(kf, ['life stage'], bool(plan.lifeStage, '✅ Increase cover on key life events', '❌ Not Available'))],
      ['Spouse Cover', feat(kf, ['spouse'], bool(plan.spouseCover, '✅ Available — inbuilt or as option', '❌ Not Available'))],
      ['Joint Life Option', bool(plan.jointLife, '✅ Yes', '❌ Individual Plan Only')],
    ]});
    sections.push({ title: '💰 SPECIAL DISCOUNTS', rows: [
      ["Women's Discount", val(plan.womenDiscount)],
      ['Salaried / Non-Smoker Discount', val(plan.salariedDiscount)],
    ]});
  }

  // ── PAR SPECIFIC ──
  else if (cat === 'par') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maturity Age', val(plan.maturityAge)],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Policy Term', val(plan.pt)],
    ]});
    sections.push({ title: '🎯 BONUS STRUCTURE', rows: [
      ['Bonus Type', val(plan.bonusType)],
      ['Benefits Guaranteed', bool(plan.guaranteed, '✅ Yes — guaranteed benefits', '⚠️ Non-guaranteed (bonus-linked)')],
    ]});
    sections.push({ title: '🔧 PLAN FEATURES', rows: [
      ['Joint Life Cover', bool(plan.features?.jointLife, '✅ Yes', '❌ Individual Plan Only')],
      ['Policy Loan', bool(plan.features?.loan, '✅ Available', '❌ Not Available')],
      ['Riders Available', bool(plan.features?.riders, '✅ Yes', '❌ No riders')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── NON-PAR SAVINGS ──
  else if (cat === 'savings') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maturity Age', plan.maturityAge ? plan.maturityAge + ' years' : '—'],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Policy Term', val(plan.pt)],
    ]});
    sections.push({ title: '💎 MATURITY & DEATH BENEFIT', rows: [
      ['Death Benefit', val(plan.deathBenefit)],
      ['Maturity Benefit', bool(plan.maturityBenefit, '✅ Guaranteed Maturity Benefit (GMB)', '—')],
      ['Loyalty Additions', bool(plan.loyaltyAdditions, '✅ Accrues after PPT — boosts corpus each year', '❌ Not Available')],
      ['Guaranteed Additions', bool(plan.guaranteedAdditions, '✅ Yes', '❌ No')],
      ['Return of Premium', bool(plan.rop, '✅ Available', '❌ Not Available')],
    ]});
    sections.push({ title: '🔧 PLAN FEATURES', rows: [
      ['Joint Life Cover', bool(plan.jointLife, '✅ Yes — Spouse coverage available', '❌ Individual Plan Only')],
      ['Policy Loan', bool(plan.loan, '✅ Available', '❌ Not Available')],
      ['Riders', val(plan.riders)],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── NON-PAR INCOME ──
  else if (cat === 'income') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Income Periods Available', (plan.incomePeriods||[]).join(', ')||'—'],
      ['Plan Options', (plan.planOptions||[]).join(' / ')||'—'],
    ]});
    sections.push({ title: '💰 INCOME STRUCTURE', rows: [
      ['Income Payout Frequency', val(plan.incomePayout)],
      ['Increasing Income', bool(plan.increasingIncome, '✅ Yes — income increases over time', '❌ Level Income Only')],
      ['Loyalty Additions', bool(plan.loyaltyAdditions, '✅ Enhances income each year during payout period', '❌ Not Available')],
      ['Commutation Option', bool(plan.commutation, '✅ Take lumpsum of all future income anytime after policy term', '❌ Not Available')],
      ['Income After Death', bool(plan.incomeAfterDeath, '✅ Income continues to nominee', '❌ Not Available')],
      ['Policy Loan', bool(plan.loan, '✅ Available', '❌ Not Available')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── NON-PAR EARLY INCOME ──
  else if (cat === 'early-income') {
    sections.push({ title: '💰 INCOME STRUCTURE', rows: [
      ['Income Starts From', val(plan.incomeFrom)],
      ['Income Type', val(plan.incomeType)],
      ['Income Period', plan.incomePeriod ? plan.incomePeriod + ' years' : '—'],
      ['Guaranteed', bool(plan.guaranteed, '✅ 100% Non-Par Guaranteed', '—')],
      ['Maturity Benefit / Lumpsum', bool(plan.lumpsum, '✅ Guaranteed Lumpsum at maturity', '❌ Not Available')],
      ['Return of Premium on Death', bool(plan.ropOnDeath, '✅ Yes', '❌ No')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── ANNUITY ──
  else if (cat === 'annuity') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Minimum Premium', val(plan.minPremium)],
      ['Payout Frequency', val(plan.payout)],
    ]});
    sections.push({ title: '🔢 ANNUITY OPTIONS', rows: [
      ['Total Annuity Variants', val(plan.totalOptions)],
      ['Immediate Annuity', bool(plan.type?.includes('Immediate'), '✅ Available', '—')],
      ['Deferred Annuity', bool(plan.type?.includes('Deferred'), '✅ Available', '—')],
      ['Joint Life Annuity', bool(plan.jointLife, '✅ Yes', '❌ Not Available')],
      ['Limited Pay Option', bool(plan.limitedPay, '✅ ' + (plan.limitedPayNote||'Available'), '❌ Single Pay Only')],
      ['Policy Loan', val(plan.loan)],
      ['QROPS Eligible', bool(plan.qrops, '✅ Yes', '❌ No')],
      ['Top Up Facility', bool(plan.topUp, '✅ Yes', '❌ No')],
      ['Group Policy', bool(plan.groupPolicy, '✅ Available', '❌ Not Available')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── HTML GENERATION ──
  const html = `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><title>Insurance Arena — ${san(pl)} Plan Report</title>
<style>
*{box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:11.5px;color:#1E293B;max-width:800px;margin:0 auto;padding:24px}
.header{border-bottom:3px solid #00C4B4;padding-bottom:10px;margin-bottom:16px}
.brand{color:#00C4B4;font-weight:800;font-size:20px}
.subtitle{color:#64748B;font-size:10px;margin-top:3px}
.plan-title{font-size:16px;font-weight:800;color:#0F172A;margin:12px 0 4px}
.plan-co{font-size:11px;color:#64748B}
.section-title{font-size:11px;font-weight:800;color:#0F172A;margin:14px 0 4px;padding:5px 10px;background:#F1F5F9;border-left:4px solid #00C4B4}
table{border-collapse:collapse;width:100%;margin:0 0 2px}
td{padding:6px 10px;border-bottom:1px solid #E2E8F0;font-size:11px;vertical-align:top;line-height:1.5}
td:first-child{color:#475569;font-weight:600;width:38%}
.yes{color:#16A34A;font-weight:600}.no{color:#DC2626}
.hl-box{background:#FAFBFF;border:1px solid #E0E7FF;border-radius:6px;padding:10px 14px;margin:4px 0}
.hl-item{margin:3px 0;padding-left:14px;position:relative;font-size:11px;line-height:1.6}
.hl-item::before{content:"•";position:absolute;left:0;color:#00C4B4;font-weight:700}
.pitch-box{background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:12px;margin:4px 0;font-size:11px;line-height:1.7;font-style:italic;color:#14532D}
.best-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:10px 14px;margin:4px 0;font-size:11px;color:#92400E}
.link-row{margin:3px 0;font-size:10.5px}
.link-row a{color:#0369A1}
.footer{font-size:9px;color:#94A3B8;margin-top:20px;border-top:1px solid #E2E8F0;padding-top:8px;line-height:1.6}
@media print{body{padding:10px}.pitch-box,.hl-box,.best-box{break-inside:avoid}}
</style></head><body>

<div class="header">
  <div class="brand">Insurance Arena™</div>
  <div class="subtitle">Individual Plan Report &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})} &nbsp;|&nbsp; insurancearena.in &nbsp;|&nbsp; Educational use only</div>
</div>

<div class="plan-title">${san(pl)}</div>
<div class="plan-co">${san(co)}</div>

${sections.map(sec => `
<div class="section-title">${sec.title}</div>
<table><tbody>
${sec.rows.map(([l, v]) => {
  const cls = v?.startsWith('✅') ? 'yes' : v?.startsWith('❌') ? 'no' : '';
  return `<tr><td>${san(l)}</td><td class="${cls}">${san(v||'—')}</td></tr>`;
}).join('')}
</tbody></table>`).join('')}

${kf.length > 0 ? `
<div class="section-title">✨ KEY HIGHLIGHTS</div>
<div class="hl-box">${kf.map(h => `<div class="hl-item">${san(h)}</div>`).join('')}</div>` : ''}

${pitch ? `
<div class="section-title">💬 SALES STORY — ADVISOR PITCH</div>
<div class="pitch-box">"${san(pitch)}"</div>` : ''}

${bestFor ? `
<div class="section-title">🎯 BEST SUITABLE FOR</div>
<div class="best-box">${san(bestFor)}</div>` : ''}

${(productUrl || brochureUrl) ? `
<div class="section-title">🔗 OFFICIAL RESOURCES</div>
<table><tbody>
${productUrl ? `<tr><td style="width:38%;font-weight:600;color:#475569">Official Product Page</td><td><a href="${productUrl}">${san(co)} — ${san(pl)}</a></td></tr>` : ''}
${brochureUrl && !brochureUrl.includes('Verify') ? `<tr><td style="font-weight:600;color:#475569">Official Brochure</td><td><a href="${brochureUrl}">Download Brochure (PDF)</a></td></tr>` : ''}
</tbody></table>` : ''}

<div class="footer">
⚠️ <strong>Disclaimer:</strong> This report is generated by Insurance Arena (insurancearena.in) for educational and informational purposes only. It does not constitute financial advice or a recommendation to buy any insurance product. All data is sourced from verified official brochures and product pages. Product features, benefits, premiums, and terms are subject to change by the insurer at any time. Bonuses in participating plans are not guaranteed. Please read the official policy document and brochure before making any purchase decision. For personalised advice, consult a licensed insurance advisor. IRDAI Regn. details of all insurers available on their respective websites and irdai.gov.in.
</div>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
}

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
// SINGLE PRODUCT PDF GENERATOR
// ══════════════════════════════════════════════════════

function generateSingleProductPDF(plan, cat) {
  if (!plan) return;
  cat = cat || plan.catKey || 'term'; // fallback to plan's own catKey
  const co = plan.companyFull || plan.company || '';
  const pl = plan.plan || plan.planName || '';

  function val(v) {
    if (v === null || v === undefined || v === '' || v === false) return '—';
    const s = String(v);
    if (s.toLowerCase().startsWith('verify') || s.toLowerCase().includes('verify from')) return '—';
    return s;
  }
  function feat(arr, keywords, fallback) {
    const kws = keywords.map(k => k.toLowerCase());
    const match = (arr||[]).find(f => kws.some(kw => f.toLowerCase().includes(kw)));
    return match || fallback;
  }
  function bool(v, y, n) { return v ? (y||'✅ Available') : (n||'❌ Not Available'); }

  const kf = plan.keyFeatures || plan.keyHighlights || plan.meta?.keyHighlights || [];
  const pitch = plan.salesPitch || plan.pitch || '';
  const bestFor = plan.meta?.bestFor || plan.bestFor || '';
  const productUrl = plan.productUrl || plan.calcUrl || plan.url || '';
  const brochureUrl = plan.brochureUrl || plan.brochure || '';

  // ── Build rows based on category ──
  let sections = [];

  // ── IDENTITY (all categories) ──
  sections.push({ title: '📋 PLAN IDENTITY', rows: [
    ['Company', val(co)],
    ['Plan Name', val(pl)],
    ['UIN (IRDAI Registration)', val(plan.uin)],
    ['Plan Type', val(plan.type)],
    ...(plan.csr ? [['Claim Settlement Ratio (FY 25-26)', plan.csr + '%']] : []),
    ...(plan.lastUpdated || plan.dataDate ? [['Data Last Verified', val(plan.lastUpdated || plan.dataDate)]] : []),
  ]});

  // ── TERM SPECIFIC ──
  if (cat === 'term') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maximum Maturity Age', val(plan.maxMaturity)],
      ['Minimum Sum Assured', val(plan.minSA)],
      ['Maximum Sum Assured', val(plan.maxSA)],
      ['Premium Payment Options', val(plan.premiumPay)],
      ['Limited Pay Terms Available', val(plan.limitedPayTerms)],
      ['Premium Modes', val(plan.premiumModes)],
    ]});
    sections.push({ title: '☠️ CORE DEATH BENEFIT', rows: [
      ['Death Benefit Options', val(plan.deathBenefit)],
      ['Whole Life Option', bool(plan.wholeLife, '✅ Available', '❌ Not Available')],
    ]});
    sections.push({ title: '🛡️ INBUILT PROTECTIONS', rows: [
      ['Terminal Illness Benefit', feat(kf, ['terminal illness'], bool(plan.terminalIllness, '✅ Inbuilt — accelerated payout on diagnosis', '❌ Not Available'))],
      ['Accidental Death Benefit', feat(kf, ['accidental death', 'adb'], bool(plan.accidentalDeath, '✅ Available', '❌ Not Available'))],
      ['Critical Illness Benefit', feat(kf, ['critical illness'], bool(plan.criticalIllness, '✅ Available', '❌ Not Available'))],
      ['Waiver of Premium on Disability', feat(kf, ['waiver of premium', 'wop', 'disability'], bool(plan.wopDisability, '✅ Inbuilt', '❌ Not Available'))],
      ['Return of Premium', feat(kf, ['return of premium', 'rop'], bool(plan.returnOfPremium, '✅ Available as option', '❌ Not Available'))],
    ]});
    sections.push({ title: '🔄 FLEXIBILITY & FEATURES', rows: [
      ['Premium Break Facility', feat(kf, ['premium break'], bool(plan.premiumBreak, '✅ Available after specified years', '❌ Not Available'))],
      ['Smart Exit / Zero Cost Withdrawal', feat(kf, ['smart exit', 'zero cost', 'zero-cost'], bool(plan.smartExit, '✅ Available after 25 policy years', '❌ Not Available'))],
      ['Life Stage Benefit', feat(kf, ['life stage'], bool(plan.lifeStage, '✅ Increase cover on key life events', '❌ Not Available'))],
      ['Spouse Cover', feat(kf, ['spouse'], bool(plan.spouseCover, '✅ Available — inbuilt or as option', '❌ Not Available'))],
      ['Joint Life Option', bool(plan.jointLife, '✅ Yes', '❌ Individual Plan Only')],
    ]});
    sections.push({ title: '💰 SPECIAL DISCOUNTS', rows: [
      ["Women's Discount", val(plan.womenDiscount)],
      ['Salaried / Non-Smoker Discount', val(plan.salariedDiscount)],
    ]});
  }

  // ── PAR SPECIFIC ──
  else if (cat === 'par') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maturity Age', val(plan.maturityAge)],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Policy Term', val(plan.pt)],
    ]});
    sections.push({ title: '🎯 BONUS STRUCTURE', rows: [
      ['Bonus Type', val(plan.bonusType)],
      ['Benefits Guaranteed', bool(plan.guaranteed, '✅ Yes — guaranteed benefits', '⚠️ Non-guaranteed (bonus-linked)')],
    ]});
    sections.push({ title: '🔧 PLAN FEATURES', rows: [
      ['Joint Life Cover', bool(plan.features?.jointLife, '✅ Yes', '❌ Individual Plan Only')],
      ['Policy Loan', bool(plan.features?.loan, '✅ Available', '❌ Not Available')],
      ['Riders Available', bool(plan.features?.riders, '✅ Yes', '❌ No riders')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── NON-PAR SAVINGS ──
  else if (cat === 'savings') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maturity Age', plan.maturityAge ? plan.maturityAge + ' years' : '—'],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Policy Term', val(plan.pt)],
    ]});
    sections.push({ title: '💎 MATURITY & DEATH BENEFIT', rows: [
      ['Death Benefit', val(plan.deathBenefit)],
      ['Maturity Benefit', bool(plan.maturityBenefit, '✅ Guaranteed Maturity Benefit (GMB)', '—')],
      ['Loyalty Additions', bool(plan.loyaltyAdditions, '✅ Accrues after PPT — boosts corpus each year', '❌ Not Available')],
      ['Guaranteed Additions', bool(plan.guaranteedAdditions, '✅ Yes', '❌ No')],
      ['Return of Premium', bool(plan.rop, '✅ Available', '❌ Not Available')],
    ]});
    sections.push({ title: '🔧 PLAN FEATURES', rows: [
      ['Joint Life Cover', bool(plan.jointLife, '✅ Yes — Spouse coverage available', '❌ Individual Plan Only')],
      ['Policy Loan', bool(plan.loan, '✅ Available', '❌ Not Available')],
      ['Riders', val(plan.riders)],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── NON-PAR INCOME ──
  else if (cat === 'income') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Income Periods Available', (plan.incomePeriods||[]).join(', ')||'—'],
      ['Plan Options', (plan.planOptions||[]).join(' / ')||'—'],
    ]});
    sections.push({ title: '💰 INCOME STRUCTURE', rows: [
      ['Income Payout Frequency', val(plan.incomePayout)],
      ['Increasing Income', bool(plan.increasingIncome, '✅ Yes — income increases over time', '❌ Level Income Only')],
      ['Loyalty Additions', bool(plan.loyaltyAdditions, '✅ Enhances income each year during payout period', '❌ Not Available')],
      ['Commutation Option', bool(plan.commutation, '✅ Take lumpsum of all future income anytime after policy term', '❌ Not Available')],
      ['Income After Death', bool(plan.incomeAfterDeath, '✅ Income continues to nominee', '❌ Not Available')],
      ['Policy Loan', bool(plan.loan, '✅ Available', '❌ Not Available')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── NON-PAR EARLY INCOME ──
  else if (cat === 'early-income') {
    sections.push({ title: '💰 INCOME STRUCTURE', rows: [
      ['Income Starts From', val(plan.incomeFrom)],
      ['Income Type', val(plan.incomeType)],
      ['Income Period', val(plan.incomePeriod)],
      ['Guaranteed', bool(plan.guaranteed, '✅ 100% Non-Par Guaranteed', '—')],
      ['Maturity Benefit / Lump Sum', bool(plan.hasLumpSum, '✅ ' + (plan.lumpSumNote||'Guaranteed Lump Sum at maturity'), '❌ Not Available')],
      ['Instant Cashback', bool(plan.cashbackFeature, '✅ ' + (plan.cashbackNote||'Available at issuance'), '—')],
      ['Return of Premium on Death', bool(plan.ropOnDeath, '✅ Yes', '❌ No')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
  }

  // ── ANNUITY ──
  else if (cat === 'annuity') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Minimum Premium', val(plan.minPremium)],
      ['Payout Frequency', val(plan.payout)],
    ]});
    sections.push({ title: '🔢 ANNUITY OPTIONS', rows: [
      ['Total Annuity Variants', val(plan.totalOptions)],
      ['Immediate Annuity', bool(plan.type?.includes('Immediate'), '✅ Available', '—')],
      ['Deferred Annuity', bool(plan.type?.includes('Deferred'), '✅ Available', '—')],
      ['Joint Life Annuity', bool(plan.jointLife, '✅ Yes', '❌ Not Available')],
      ['Limited Pay Option', bool(plan.limitedPay, '✅ ' + (plan.limitedPayNote||'Available'), '❌ Single Pay Only')],
      ['Policy Loan', val(plan.loan)],
      ['QROPS Eligible', bool(plan.qrops, '✅ Yes', '❌ No')],
      ['Top Up Facility', bool(plan.topUp, '✅ Yes', '❌ No')],
      ['Group Policy', bool(plan.groupPolicy, '✅ Available', '❌ Not Available')],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }

  // ── ULIP ──
  else if (cat === 'ulip') {
    sections.push({ title: '📐 PRODUCT BOUNDARIES', rows: [
      ['Entry Age', val(plan.entryAge)],
      ['Maturity Age', val(plan.maturityAge)],
      ['Premium Payment Term (PPT)', val(plan.ppt)],
      ['Policy Term', val(plan.pt)],
      ['Sum Assured Multiple', val(plan.saMultiple)],
    ]});
    sections.push({ title: '📊 FUND & STRATEGY', rows: [
      ['Fund Options', val(plan.fundOptions)],
      ['Portfolio Strategies', val(plan.portfolioStrategies)],
      ['Plan Options', val(plan.planOptions)],
      ['Withdrawal Options', val(plan.withdrawalOptions)],
    ]});
    sections.push({ title: '💎 CHARGES & ADDITIONS', rows: [
      ['Return of Mortality/Admin Charges', bool(plan.romc, '✅ ' + (plan.romcNote||'Available'), '❌ Not Available')],
      ['Loyalty Additions / Wealth Boosters', bool(plan.loyaltyAdditions, '✅ ' + (plan.loyaltyNote||'Available'), '❌ Not Available')],
      ['Riders', val(plan.riders)],
    ]});
    if (plan.uniqueFeature) {
      sections.push({ title: '⭐ UNIQUE FEATURE', rows: [['Unique Advantage', val(plan.uniqueFeature)]] });
    }
    if (plan.fundPerformanceUrl) {
      sections.push({ title: '📈 FUND PERFORMANCE', rows: [['Check All Fund NAVs', val(plan.fundPerformanceUrl)]] });
    }
  }
  }

  // ── HTML GENERATION ──
  const html = `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><title>Insurance Arena — ${san(pl)} Plan Report</title>
<style>
*{box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:11.5px;color:#1E293B;max-width:800px;margin:0 auto;padding:24px}
.header{border-bottom:3px solid #00C4B4;padding-bottom:10px;margin-bottom:16px}
.brand{color:#00C4B4;font-weight:800;font-size:20px}
.subtitle{color:#64748B;font-size:10px;margin-top:3px}
.plan-title{font-size:16px;font-weight:800;color:#0F172A;margin:12px 0 4px}
.plan-co{font-size:11px;color:#64748B}
.section-title{font-size:11px;font-weight:800;color:#0F172A;margin:14px 0 4px;padding:5px 10px;background:#F1F5F9;border-left:4px solid #00C4B4}
table{border-collapse:collapse;width:100%;margin:0 0 2px}
td{padding:6px 10px;border-bottom:1px solid #E2E8F0;font-size:11px;vertical-align:top;line-height:1.5}
td:first-child{color:#475569;font-weight:600;width:38%}
.yes{color:#16A34A;font-weight:600}.no{color:#DC2626}
.hl-box{background:#FAFBFF;border:1px solid #E0E7FF;border-radius:6px;padding:10px 14px;margin:4px 0}
.hl-item{margin:3px 0;padding-left:14px;position:relative;font-size:11px;line-height:1.6}
.hl-item::before{content:"•";position:absolute;left:0;color:#00C4B4;font-weight:700}
.pitch-box{background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:12px;margin:4px 0;font-size:11px;line-height:1.7;font-style:italic;color:#14532D}
.best-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:6px;padding:10px 14px;margin:4px 0;font-size:11px;color:#92400E}
.link-row{margin:3px 0;font-size:10.5px}
.link-row a{color:#0369A1}
.footer{font-size:9px;color:#94A3B8;margin-top:20px;border-top:1px solid #E2E8F0;padding-top:8px;line-height:1.6}
@media print{body{padding:10px}.pitch-box,.hl-box,.best-box{break-inside:avoid}}
</style></head><body>

<div class="header">
  <div class="brand">Insurance Arena™</div>
  <div class="subtitle">Individual Plan Report &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})} &nbsp;|&nbsp; insurancearena.in &nbsp;|&nbsp; Educational use only</div>
</div>

<div class="plan-title">${san(pl)}</div>
<div class="plan-co">${san(co)}</div>

${sections.map(sec => `
<div class="section-title">${sec.title}</div>
<table><tbody>
${sec.rows.map(([l, v]) => {
  const cls = v?.startsWith('✅') ? 'yes' : v?.startsWith('❌') ? 'no' : '';
  return `<tr><td>${san(l)}</td><td class="${cls}">${san(v||'—')}</td></tr>`;
}).join('')}
</tbody></table>`).join('')}

${kf.length > 0 ? `
<div class="section-title">✨ KEY HIGHLIGHTS</div>
<div class="hl-box">${kf.map(h => `<div class="hl-item">${san(h)}</div>`).join('')}</div>` : ''}

${pitch ? `
<div class="section-title">💬 SALES STORY — ADVISOR PITCH</div>
<div class="pitch-box">"${san(pitch)}"</div>` : ''}

${bestFor ? `
<div class="section-title">🎯 BEST SUITABLE FOR</div>
<div class="best-box">${san(bestFor)}</div>` : ''}

${(productUrl || brochureUrl) ? `
<div class="section-title">🔗 OFFICIAL RESOURCES</div>
<table><tbody>
${productUrl ? `<tr><td style="width:38%;font-weight:600;color:#475569">Official Product Page</td><td><a href="${productUrl}">${san(co)} — ${san(pl)}</a></td></tr>` : ''}
${brochureUrl && !brochureUrl.includes('Verify') ? `<tr><td style="font-weight:600;color:#475569">Official Brochure</td><td><a href="${brochureUrl}">Download Brochure (PDF)</a></td></tr>` : ''}
</tbody></table>` : ''}

<div class="footer">
⚠️ <strong>Disclaimer:</strong> This report is generated by Insurance Arena (insurancearena.in) for educational and informational purposes only. It does not constitute financial advice or a recommendation to buy any insurance product. All data is sourced from verified official brochures and product pages. Product features, benefits, premiums, and terms are subject to change by the insurer at any time. Bonuses in participating plans are not guaranteed. Please read the official policy document and brochure before making any purchase decision. For personalised advice, consult a licensed insurance advisor. IRDAI Regn. details of all insurers available on their respective websites and irdai.gov.in.
</div>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
}

// ══════════════════════════════════════════════════════
// A vs B ENGINE
// ══════════════════════════════════════════════════════

function renderAvB(cat) {
  window.avbCat = cat; // store for PDF export
  lastCompareCat = cat;
  // Always rebuild registry when A vs B opens
  if (typeof buildProductRegistry === 'function') PRODUCT_REGISTRY = buildProductRegistry();
  if (typeof buildProductRegistry === 'function') PRODUCT_REGISTRY = buildProductRegistry();
  const wrap = document.getElementById('avbWrap');
  if (!wrap) return;

  const cats = ['Term Insurance','Participating Endowment','Guaranteed Early Income','Guaranteed Savings','Guaranteed Long Term Income','ULIP','Annuity'];
  const catMap = { term:'Term Insurance', par:'Participating Endowment', nonpar:'Guaranteed Savings', 'early-income':'Guaranteed Early Income', ulip:'ULIP', annuity:'Annuity' };
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
  // Ensure registry is built
  if ((!PRODUCT_REGISTRY||!PRODUCT_REGISTRY.length) && typeof buildProductRegistry==='function') {
    PRODUCT_REGISTRY = buildProductRegistry();
  }
  const planSel = document.getElementById('avbPlan' + side);
  const regId = planSel?.value;
  if (!regId) { if(side==='A'){avbProductA=null;window.avbProductA=null;} else{avbProductB=null;window.avbProductB=null;} }
  else {
    const p = PRODUCT_REGISTRY.find(x => x.regId === regId);
    if (side === 'A') { avbProductA = p; window.avbProductA = p; }
    else { avbProductB = p; window.avbProductB = p; }
  }
  checkAvBReady();
}

function checkAvBReady() {
  const btn = document.getElementById('avbRunBtn');
  if (btn) btn.disabled = !(avbProductA && avbProductB);
}

function runAvBComparison() {
  const a = avbProductA, b = avbProductB;
  if(a&&b) track('avb_comparison',{plan_a:a.plan,plan_b:b.plan,company_a:a.company,company_b:b.company});
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
    <button class="avb-share-btn" onclick="shareComparison()">📤 Share Comparison</button>
  </div>

  <div class="avb-disclaimer">⚠️ This comparison is for educational and informational purposes only. Not financial advice. All data sourced from verified product information. Please read official brochures before making any decision.</div>`;

  // Add save button + diff highlight after results render
  setTimeout(() => {
    if (typeof applyDiffHighlight === 'function') applyDiffHighlight();
    if (!document.getElementById('avbSaveBtn')) {
      const sb = document.createElement('button');
      sb.id = 'avbSaveBtn'; sb.className = 'avb-save-btn';
      sb.textContent = '📌 Save This Comparison';
      sb.onclick = function() { if(typeof saveCurrentComparison==='function') saveCurrentComparison(); };
      res.prepend(sb);
    }
    if (!document.getElementById('savedCompsWrap')) {
      const sd = document.createElement('div');
      sd.id = 'savedCompsWrap';
      const avbW = document.getElementById('avbWrap');
      if (avbW) avbW.prepend(sd);
    }
    if (typeof renderSavedComparisons === 'function') renderSavedComparisons();
  }, 200);
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
  const cat = a.catKey || window.avbCat || 'term'; // a.catKey is always correct from registry

  // ── Helper: extract descriptive text from keyFeatures/keyHighlights ──
  function feat(plan, keywords, fallback) {
    const arr = plan.keyFeatures || plan.keyHighlights || plan.meta?.keyHighlights || [];
    if (!arr.length) return fallback;
    const kws = keywords.map(k => k.toLowerCase());
    const match = arr.find(f => kws.some(kw => f.toLowerCase().includes(kw)));
    return match || fallback;
  }
  function bool(val, yesFeat, noText) {
    return val ? (yesFeat || '✅ Available') : (noText || '❌ Not Available');
  }
  function val(v) {
    if (v === null || v === undefined || v === '' || v === false) return '—';
    const s = String(v);
    if (s.toLowerCase().startsWith('verify') || s.toLowerCase().includes('verify from')) return '—';
    return s;
  }

  // ── Category-specific comparison rows ──
  function getRows() {

    // ════════════ TERM INSURANCE ════════════
    if (cat === 'term') {
      return [
        ['━━━ PLAN IDENTITY ━━━', '', ''],
        ['Company (Full)', val(a.company), val(b.company)],
        ['Plan Name', val(a.plan), val(b.plan)],
        ['UIN', val(a.uin), val(b.uin)],
        ['Plan Type', val(a.type||'Non-Linked Non-Par (Term)'), val(b.type||'Non-Linked Non-Par (Term)')],
        ['Claim Settlement Ratio', a.csr ? a.csr+'%' : '—', b.csr ? b.csr+'%' : '—'],
        ['Data Last Verified', val(a.lastUpdated), val(b.lastUpdated)],

        ['━━━ PRODUCT BOUNDARIES ━━━', '', ''],
        ['Entry Age', val(a.entryAge), val(b.entryAge)],
        ['Maximum Maturity Age', val(a.maxMaturity), val(b.maxMaturity)],
        ['Minimum Sum Assured', val(a.minSA), val(b.minSA)],
        ['Maximum Sum Assured', val(a.maxSA), val(b.maxSA)],
        ['Premium Payment Options', val(a.premiumPay), val(b.premiumPay)],
        ['Limited Pay Terms', val(a.limitedPayTerms), val(b.limitedPayTerms)],
        ['Premium Modes', val(a.premiumModes), val(b.premiumModes)],

        ['━━━ CORE DEATH BENEFIT ━━━', '', ''],
        ['Death Benefit Options', val(a.deathBenefit), val(b.deathBenefit)],
        ['Whole Life Option', bool(a.wholeLife,'✅ Yes','❌ No'), bool(b.wholeLife,'✅ Yes','❌ No')],

        ['━━━ INBUILT PROTECTIONS ━━━', '', ''],
        ['Terminal Illness Benefit',
          feat(a,['terminal illness','terminal ill'],bool(a.terminalIllness,'✅ Inbuilt','❌ Not Available')),
          feat(b,['terminal illness','terminal ill'],bool(b.terminalIllness,'✅ Inbuilt','❌ Not Available'))],
        ['Accidental Death Benefit',
          feat(a,['accidental death','adb'],bool(a.accidentalDeath,'✅ Inbuilt (Life Plus)','❌ Not Available')),
          feat(b,['accidental death','adb'],bool(b.accidentalDeath,'✅ Inbuilt (Life Plus)','❌ Not Available'))],
        ['Critical Illness Benefit',
          feat(a,['critical illness','ci cover'],bool(a.criticalIllness,'✅ Available','❌ Not Available')),
          feat(b,['critical illness','ci cover'],bool(b.criticalIllness,'✅ Available','❌ Not Available'))],
        ['Waiver of Premium — Disability',
          feat(a,['waiver of premium','wop'],bool(a.wopDisability,'✅ Inbuilt','❌ Not Available')),
          feat(b,['waiver of premium','wop'],bool(b.wopDisability,'✅ Inbuilt','❌ Not Available'))],
        ['Return of Premium',
          feat(a,['return of premium','rop'],bool(a.returnOfPremium,'✅ Available','❌ Not Available')),
          feat(b,['return of premium','rop'],bool(b.returnOfPremium,'✅ Available','❌ Not Available'))],

        ['━━━ FLEXIBILITY & FEATURES ━━━', '', ''],
        ['Premium Break',
          feat(a,['premium break'],bool(a.premiumBreak,'✅ Available','❌ Not Available')),
          feat(b,['premium break'],bool(b.premiumBreak,'✅ Available','❌ Not Available'))],
        ['Smart Exit / Zero Cost Withdrawal',
          feat(a,['smart exit','zero cost','zero-cost'],bool(a.smartExit,'✅ Available after 25 yrs','❌ Not Available')),
          feat(b,['smart exit','zero cost','zero-cost'],bool(b.smartExit,'✅ Available after 25 yrs','❌ Not Available'))],
        ['Life Stage Benefit',
          feat(a,['life stage'],bool(a.lifeStage,'✅ Available','❌ Not Available')),
          feat(b,['life stage'],bool(b.lifeStage,'✅ Available','❌ Not Available'))],
        ['Spouse Cover',
          feat(a,['spouse'],bool(a.spouseCover,'✅ Available','❌ Not Available')),
          feat(b,['spouse'],bool(b.spouseCover,'✅ Available','❌ Not Available'))],
        ['Joint Life Cover', bool(a.jointLife,'✅ Yes','❌ No'), bool(b.jointLife,'✅ Yes','❌ No')],

        ['━━━ SPECIAL DISCOUNTS ━━━', '', ''],
        ["Women's Discount", val(a.womenDiscount)||'—', val(b.womenDiscount)||'—'],
        ['Salaried Discount', val(a.salariedDiscount)||'—', val(b.salariedDiscount)||'—'],
      ];
    }

    // ════════════ PARTICIPATING ════════════
    if (cat === 'par') {
      return [
        ['━━━ PLAN IDENTITY ━━━', '', ''],
        ['Company', val(a.companyFull||a.company), val(b.companyFull||b.company)],
        ['Plan Name', val(a.plan), val(b.plan)],
        ['UIN', val(a.uin), val(b.uin)],
        ['Plan Type', val(a.type), val(b.type)],
        ['Data Source', val(a.dataSource), val(b.dataSource)],

        ['━━━ PRODUCT BOUNDARIES ━━━', '', ''],
        ['Entry Age', val(a.entryAge), val(b.entryAge)],
        ['Maturity Age', val(a.maturityAge), val(b.maturityAge)],
        ['PPT Options', val(a.ppt), val(b.ppt)],
        ['Policy Term', val(a.pt), val(b.pt)],

        ['━━━ BONUS STRUCTURE ━━━', '', ''],
        ['Bonus Type', val(a.bonusType), val(b.bonusType)],
        ['Guaranteed Benefits', bool(a.guaranteed,'✅ Yes','❌ No'), bool(b.guaranteed,'✅ Yes','❌ No')],

        ['━━━ PLAN FEATURES ━━━', '', ''],
        ['Joint Life Cover', bool(a.features?.jointLife,'✅ Yes','❌ No'), bool(b.features?.jointLife,'✅ Yes','❌ No')],
        ['Policy Loan', bool(a.features?.loan,'✅ Available','❌ Not Available'), bool(b.features?.loan,'✅ Available','❌ Not Available')],
        ['Riders Available', bool(a.features?.riders,'✅ Available','❌ Not Available'), bool(b.features?.riders,'✅ Available','❌ Not Available')],

        ['━━━ UNIQUE FEATURE ━━━', '', ''],
        ['Unique Advantage', val(a.uniqueFeature), val(b.uniqueFeature)],
      ];
    }

    // ════════════ NON-PAR ════════════
    if (cat === 'nonpar') {
      // Detect sub-category using reliable registry category field
      const subCat = (a.category || '').toLowerCase();
      const isEarlyIncome = subCat.includes('early income');
      const isIncome = !isEarlyIncome && subCat.includes('long term income');
      const isSavings = !isEarlyIncome && !isIncome;

      if (isEarlyIncome) {
        return [
          ['━━━ PLAN IDENTITY ━━━', '', ''],
          ['Company', val(a.companyFull||a.company), val(b.companyFull||b.company)],
          ['Plan Name', val(a.plan), val(b.plan)],
          ['UIN', val(a.uin), val(b.uin)],
          ['Plan Type', val(a.type), val(b.type)],

          ['━━━ INCOME STRUCTURE ━━━', '', ''],
          ['Income Starts From', val(a.incomeFrom), val(b.incomeFrom)],
          ['Income Type', val(a.incomeType), val(b.incomeType)],
          ['Income Period', a.incomePeriod ? a.incomePeriod+' years' : '—', b.incomePeriod ? b.incomePeriod+' years' : '—'],
          ['Maturity Benefit', bool(a.lumpsum,'✅ Guaranteed Lumpsum at Maturity','❌ No'), bool(b.lumpsum,'✅ Guaranteed Lumpsum at Maturity','❌ No')],
          ['ROP on Death', bool(a.ropOnDeath,'✅ Yes','❌ No'), bool(b.ropOnDeath,'✅ Yes','❌ No')],
          ['100% Guaranteed', bool(a.guaranteed,'✅ Fully Non-Par Guaranteed','❌ No'), bool(b.guaranteed,'✅ Fully Non-Par Guaranteed','❌ No')],

          ['━━━ UNIQUE FEATURE ━━━', '', ''],
          ['Unique Advantage', val(a.uniqueFeature), val(b.uniqueFeature)],
        ];
      }

      if (isIncome) {
        return [
          ['━━━ PLAN IDENTITY ━━━', '', ''],
          ['Company', val(a.company), val(b.company)],
          ['Plan Name', val(a.plan), val(b.plan)],
          ['UIN', val(a.uin), val(b.uin)],
          ['Plan Type', val(a.type), val(b.type)],

          ['━━━ PRODUCT BOUNDARIES ━━━', '', ''],
          ['Entry Age', val(a.entryAge), val(b.entryAge)],
          ['PPT Options', val(a.ppt), val(b.ppt)],
          ['Income Periods Available', (a.incomePeriods||[]).join(' / ')||'—', (b.incomePeriods||[]).join(' / ')||'—'],
          ['Plan Options', (a.planOptions||[]).join(' / ')||'—', (b.planOptions||[]).join(' / ')||'—'],

          ['━━━ INCOME FEATURES ━━━', '', ''],
          ['Income Payout Frequency', val(a.incomePayout), val(b.incomePayout)],
          ['Increasing Income', bool(a.increasingIncome,'✅ Yes','❌ Level Income Only'), bool(b.increasingIncome,'✅ Yes','❌ Level Income Only')],
          ['Loyalty Additions', bool(a.loyaltyAdditions,'✅ Enhances income each year during payout','❌ No'), bool(b.loyaltyAdditions,'✅ Enhances income each year during payout','❌ No')],
          ['Commutation Option', bool(a.commutation,'✅ Take lumpsum of future income anytime','❌ No'), bool(b.commutation,'✅ Take lumpsum of future income anytime','❌ No')],
          ['Income After Death', val(a.incomeAfterDeath||'—'), val(b.incomeAfterDeath||'—')],
          ['Policy Loan', bool(a.loan,'✅ Available','❌ Not Available'), bool(b.loan,'✅ Available','❌ Not Available')],
          ['Joint Life Cover', bool(a.jointLife,'✅ Yes','❌ Individual Plan Only'), bool(b.jointLife,'✅ Yes','❌ Individual Plan Only')],

          ['━━━ UNIQUE FEATURE ━━━', '', ''],
          ['Unique Advantage', val(a.uniqueFeature), val(b.uniqueFeature)],
        ];
      }

      // Savings
      return [
        ['━━━ PLAN IDENTITY ━━━', '', ''],
        ['Company', val(a.company), val(b.company)],
        ['Plan Name', val(a.plan), val(b.plan)],
        ['UIN', val(a.uin), val(b.uin)],
        ['Plan Type', val(a.type), val(b.type)],

        ['━━━ PRODUCT BOUNDARIES ━━━', '', ''],
        ['Entry Age', val(a.entryAge), val(b.entryAge)],
        ['Maturity Age', a.maturityAge ? a.maturityAge+' years' : '—', b.maturityAge ? b.maturityAge+' years' : '—'],
        ['PPT Options', val(a.ppt), val(b.ppt)],
        ['Policy Term', val(a.pt), val(b.pt)],

        ['━━━ MATURITY BENEFIT ━━━', '', ''],
        ['Death Benefit', val(a.deathBenefit), val(b.deathBenefit)],
        ['Maturity Benefit', bool(a.maturityBenefit,'✅ Guaranteed Maturity Benefit (GMB)','—'), bool(b.maturityBenefit,'✅ Guaranteed Maturity Benefit (GMB)','—')],
        ['Loyalty Additions', bool(a.loyaltyAdditions,'✅ Boosts corpus each year after PPT','❌ No'), bool(b.loyaltyAdditions,'✅ Boosts corpus each year after PPT','❌ No')],
        ['Guaranteed Additions', bool(a.guaranteedAdditions,'✅ Yes','❌ No'), bool(b.guaranteedAdditions,'✅ Yes','❌ No')],
        ['Return of Premium', bool(a.rop,'✅ Yes','❌ No'), bool(b.rop,'✅ Yes','❌ No')],

        ['━━━ PLAN FEATURES ━━━', '', ''],
        ['Joint Life Cover', bool(a.jointLife,'✅ Yes — Spouse coverage available','❌ Individual Plan Only'), bool(b.jointLife,'✅ Yes — Spouse coverage available','❌ Individual Plan Only')],
        ['Policy Loan', bool(a.loan,'✅ Available','❌ Not Available'), bool(b.loan,'✅ Available','❌ Not Available')],
        ['Riders', val(a.riders), val(b.riders)],

        ['━━━ UNIQUE FEATURE ━━━', '', ''],
        ['Unique Advantage', val(a.uniqueFeature), val(b.uniqueFeature)],
      ];
    }

    // ════════════ EARLY INCOME (NISHCHIT) ════════════
    if (cat === 'early-income') {
      return [
        ['━━━ PLAN IDENTITY ━━━', '', ''],
        ['Company', val(a.company), val(b.company)],
        ['Plan Name', val(a.plan), val(b.plan)],
        ['UIN', val(a.uin), val(b.uin)],
        ['Plan Type', val(a.type), val(b.type)],

        ['━━━ INCOME STRUCTURE ━━━', '', ''],
        ['Income Starts From', val(a.incomeFrom), val(b.incomeFrom)],
        ['Income Type', val(a.incomeType), val(b.incomeType)],
        ['Income Period', val(a.incomePeriod), val(b.incomePeriod)],
        ['Guaranteed', bool(a.guaranteed,'✅ 100% Non-Par Guaranteed','—'), bool(b.guaranteed,'✅ 100% Non-Par Guaranteed','—')],

        ['━━━ MATURITY & ADDITIONAL BENEFITS ━━━', '', ''],
        ['Maturity Lump Sum', bool(a.hasLumpSum,'✅ '+(a.lumpSumNote||'Guaranteed'),'❌ Not Available'), bool(b.hasLumpSum,'✅ '+(b.lumpSumNote||'Guaranteed'),'❌ Not Available')],
        ['Instant Cashback', bool(a.cashbackFeature,'✅ '+(a.cashbackNote||'Available'),'—'), bool(b.cashbackFeature,'✅ '+(b.cashbackNote||'Available'),'—')],
        ['Return of Premium on Death', bool(a.ropOnDeath,'✅ Yes','❌ No'), bool(b.ropOnDeath,'✅ Yes','❌ No')],

        ['━━━ UNIQUE FEATURE ━━━', '', ''],
        ['Unique Advantage', val(a.uniqueFeature), val(b.uniqueFeature)],
      ];
    }

    // ════════════ ANNUITY ════════════
    if (cat === 'annuity') {
      return [
        ['━━━ PLAN IDENTITY ━━━', '', ''],
        ['Company', val(a.companyFull||a.company), val(b.companyFull||b.company)],
        ['Plan Name', val(a.plan), val(b.plan)],
        ['UIN', val(a.uin), val(b.uin)],
        ['Plan Type', val(a.type), val(b.type)],

        ['━━━ PRODUCT BOUNDARIES ━━━', '', ''],
        ['Entry Age', val(a.entryAge), val(b.entryAge)],
        ['Min Premium', val(a.minPremium), val(b.minPremium)],
        ['Payout Frequency', val(a.payout), val(b.payout)],

        ['━━━ ANNUITY OPTIONS ━━━', '', ''],
        ['Total Annuity Variants', val(a.totalOptions), val(b.totalOptions)],
        ['Immediate Annuity', bool(a.type?.includes('Immediate')||a.immediateAnnuity,'✅ Available','❌ Not Available'), bool(b.type?.includes('Immediate')||b.immediateAnnuity,'✅ Available','❌ Not Available')],
        ['Deferred Annuity', bool(a.type?.includes('Deferred')||a.deferredAnnuity,'✅ Available','❌ Not Available'), bool(b.type?.includes('Deferred')||b.deferredAnnuity,'✅ Available','❌ Not Available')],
        ['Joint Life Annuity', bool(a.jointLife,'✅ Yes','❌ Not Available'), bool(b.jointLife,'✅ Yes','❌ Not Available')],
        ['Limited Pay Option', bool(a.limitedPay,'✅ '+(a.limitedPayNote||'Available'),'❌ Single Pay Only'), bool(b.limitedPay,'✅ '+(b.limitedPayNote||'Available'),'❌ Single Pay Only')],
        ['Policy Loan', val(a.loan), val(b.loan)],
        ['QROPS Eligible', bool(a.qrops,'✅ Yes','❌ No'), bool(b.qrops,'✅ Yes','❌ No')],
        ['Top Up Facility', bool(a.topUp,'✅ Yes','❌ No'), bool(b.topUp,'✅ Yes','❌ No')],
        ['Group Policy Available', bool(a.groupPolicy,'✅ Yes','❌ No'), bool(b.groupPolicy,'✅ Yes','❌ No')],

        ['━━━ UNIQUE FEATURE ━━━', '', ''],
        ['Unique Advantage', val(a.uniqueFeature||a.meta?.uniqueFeature), val(b.uniqueFeature||b.meta?.uniqueFeature)],
      ];
    }

    // ════════════ ULIP ════════════
    if (cat === 'ulip') {
      return [
        ['━━━ PLAN IDENTITY ━━━', '', ''],
        ['Company', val(a.company), val(b.company)],
        ['Plan Name', val(a.plan), val(b.plan)],
        ['UIN', val(a.uin), val(b.uin)],
        ['Plan Type', val(a.type), val(b.type)],

        ['━━━ PRODUCT BOUNDARIES ━━━', '', ''],
        ['Entry Age', val(a.entryAge), val(b.entryAge)],
        ['Maturity Age', val(a.maturityAge), val(b.maturityAge)],
        ['PPT Options', val(a.ppt), val(b.ppt)],
        ['Policy Term', val(a.pt), val(b.pt)],
        ['Sum Assured Multiple', val(a.saMultiple), val(b.saMultiple)],

        ['━━━ FUND & STRATEGY ━━━', '', ''],
        ['Fund Options', val(a.fundOptions), val(b.fundOptions)],
        ['Portfolio Strategies', val(a.portfolioStrategies), val(b.portfolioStrategies)],
        ['Plan Options', val(a.planOptions), val(b.planOptions)],
        ['Withdrawal Options', val(a.withdrawalOptions), val(b.withdrawalOptions)],

        ['━━━ CHARGES & ADDITIONS ━━━', '', ''],
        ['Return of Mortality/Admin Charges', bool(a.romc,'✅ '+(a.romcNote||'Available'),'❌ Not Available'), bool(b.romc,'✅ '+(b.romcNote||'Available'),'❌ Not Available')],
        ['Loyalty Additions / Wealth Boosters', bool(a.loyaltyAdditions,'✅ '+(a.loyaltyNote||'Available'),'❌ Not Available'), bool(b.loyaltyAdditions,'✅ '+(b.loyaltyNote||'Available'),'❌ Not Available')],
        ['Riders', val(a.riders), val(b.riders)],

        ['━━━ UNIQUE FEATURE ━━━', '', ''],
        ['Unique Advantage', val(a.uniqueFeature), val(b.uniqueFeature)],
      ];
    }

    return [['No comparison data', '—', '—']];
  }

  const rows = getRows();

  // ── Key Highlights ──
  const aHL = a.keyFeatures || a.keyHighlights || a.meta?.keyHighlights || [];
  const bHL = b.keyFeatures || b.keyHighlights || b.meta?.keyHighlights || [];
  const maxHL = Math.max(aHL.length, bHL.length);
  const hlRows = Array.from({length:maxHL},(_,i)=>[
    (i===0?'Key Highlights':''),
    aHL[i]||'',
    bHL[i]||''
  ]);

  const html = `<!DOCTYPE html><html>
<head><meta charset="UTF-8"><title>Insurance Arena — Comparison Report</title>
<style>
*{box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:11.5px;color:#1E293B;max-width:860px;margin:0 auto;padding:24px}
.header{border-bottom:3px solid #00C4B4;padding-bottom:10px;margin-bottom:16px}
.brand{color:#00C4B4;font-weight:800;font-size:20px}
.subtitle{color:#64748B;font-size:10px;margin-top:3px}
.vs-title{font-size:13px;color:#0F172A;font-weight:700;margin:12px 0 8px;background:#F1F5F9;padding:8px 10px;border-left:4px solid #00C4B4}
table{border-collapse:collapse;width:100%;margin:0 0 4px}
th{background:#1E293B;color:#fff;padding:9px 10px;text-align:left;font-size:11px;font-weight:700}
th:first-child{width:32%}
th:nth-child(2),th:nth-child(3){width:34%}
td{padding:6px 10px;border-bottom:1px solid #E2E8F0;font-size:11px;vertical-align:top;line-height:1.5}
td:first-child{color:#475569;font-weight:600;width:32%}
.section-hdr td{background:#F8FAFC;font-weight:800;color:#0F172A;font-size:10.5px;letter-spacing:.5px;padding:5px 10px;border-top:2px solid #E2E8F0}
.section-hdr td:nth-child(2),.section-hdr td:nth-child(3){color:#94A3B8}
.yes{color:#16A34A;font-weight:600}
.no{color:#DC2626}
.pitch-box{background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:12px;margin:4px 0;font-size:11px;line-height:1.6;font-style:italic;color:#14532D}
.pitch-label{font-weight:700;font-style:normal;color:#166534;margin-bottom:4px;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
.hl-box{background:#FAFBFF;border:1px solid #E0E7FF;border-radius:6px;padding:10px;margin:4px 0;font-size:10.5px;line-height:1.7}
.hl-label{font-weight:700;color:#3730A3;font-size:10px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.hl-item{margin:2px 0;padding-left:12px;position:relative}
.hl-item::before{content:"•";position:absolute;left:0;color:#00C4B4;font-weight:700}
.section-title{font-size:12px;font-weight:800;color:#0F172A;margin:14px 0 6px;padding:6px 10px;background:#F1F5F9;border-left:4px solid #00C4B4}
.footer{font-size:9px;color:#94A3B8;margin-top:20px;border-top:1px solid #E2E8F0;padding-top:10px;line-height:1.6}
.score-badge{display:inline-block;background:#00C4B4;color:#000;font-weight:700;padding:2px 8px;border-radius:10px;font-size:10px}
.link-row{margin:4px 0;font-size:10.5px}
.link-row a{color:#0369A1;text-decoration:none}
@media print{body{padding:10px}.pitch-box,.hl-box{break-inside:avoid}}
</style></head><body>

<div class="header">
  <div class="brand">Insurance Arena™</div>
  <div class="subtitle">Product Comparison Report &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})} &nbsp;|&nbsp; Source: insurancearena.in &nbsp;|&nbsp; For educational use only</div>
</div>

<div class="vs-title">${san(coA)} — ${san(plA)} &nbsp;&nbsp; vs &nbsp;&nbsp; ${san(coB)} — ${san(plB)}</div>

<table>
<thead><tr><th>Feature</th><th>${san(coA)}</th><th>${san(coB)}</th></tr></thead>
<tbody>
${rows.map(([l,va,vb]) => {
  if (l.startsWith('━━━')) {
    return `<tr class="section-hdr"><td>${san(l)}</td><td></td><td></td></tr>`;
  }
  const aC = va==='✅ Yes'||va?.startsWith('✅')?'yes':va==='❌ No'||va?.startsWith('❌')?'no':'';
  const bC = vb==='✅ Yes'||vb?.startsWith('✅')?'yes':vb==='❌ No'||vb?.startsWith('❌')?'no':'';
  return `<tr><td>${san(l)}</td><td class="${aC}">${san(va||'—')}</td><td class="${bC}">${san(vb||'—')}</td></tr>`;
}).join('')}
</tbody></table>

${maxHL > 0 ? `
<div class="section-title">✨ Key Highlights</div>
<table><tbody>
<tr>
  <td style="width:32%;font-weight:700;color:#475569;vertical-align:top">Key Features</td>
  <td style="width:34%;vertical-align:top">
    <div class="hl-box">
      <div class="hl-label">${san(coA)}</div>
      ${aHL.map(h=>`<div class="hl-item">${san(h)}</div>`).join('')}
    </div>
  </td>
  <td style="width:34%;vertical-align:top">
    <div class="hl-box">
      <div class="hl-label">${san(coB)}</div>
      ${bHL.map(h=>`<div class="hl-item">${san(h)}</div>`).join('')}
    </div>
  </td>
</tr>
</tbody></table>` : ''}

${(a.salesPitch||a.pitch) || (b.salesPitch||b.pitch) ? `
<div class="section-title">💬 Sales Story</div>
<table><tbody><tr>
  <td style="width:32%;font-weight:700;color:#475569;vertical-align:top">Advisor Pitch</td>
  <td style="width:34%;vertical-align:top">
    <div class="pitch-box">
      <div class="pitch-label">${san(coA)}</div>
      ${san(a.salesPitch||a.pitch||'—')}
    </div>
  </td>
  <td style="width:34%;vertical-align:top">
    <div class="pitch-box">
      <div class="pitch-label">${san(coB)}</div>
      ${san(b.salesPitch||b.pitch||'—')}
    </div>
  </td>
</tr></tbody></table>` : ''}

<div class="section-title">🎯 Best Suitable For</div>
<table><tbody>
<tr><td style="width:32%;font-weight:700;color:#475569">Best For</td>
  <td>${san(a.meta?.bestFor||a.bestFor||'—')}</td>
  <td>${san(b.meta?.bestFor||b.bestFor||'—')}</td>
</tr>
</tbody></table>

<div class="section-title">🔗 Official Resources</div>
<table><tbody>
<tr><td style="width:32%;font-weight:700;color:#475569">Product Page</td>
  <td><a href="${a.productUrl||a.calcUrl||a.url||'#'}">${san(coA)} Official Page</a></td>
  <td><a href="${b.productUrl||b.calcUrl||b.url||'#'}">${san(coB)} Official Page</a></td>
</tr>
<tr><td style="font-weight:700;color:#475569">Brochure</td>
  <td>${(a.brochureUrl||a.brochure)?`<a href="${a.brochureUrl||a.brochure}">Download Brochure</a>`:'Not Available'}</td>
  <td>${(b.brochureUrl||b.brochure)?`<a href="${b.brochureUrl||b.brochure}">Download Brochure</a>`:'Not Available'}</td>
</tr>
</tbody></table>

<div class="footer">
⚠️ <strong>Disclaimer:</strong> This report is generated by Insurance Arena (insurancearena.in) for educational and informational purposes only. It does not constitute financial advice or a recommendation to buy any insurance product. Data is sourced from verified official brochures and product pages. Product features, benefits, and terms are subject to change by the insurer. Please read the official brochure and policy document carefully before making any purchase decision. Insurance is the subject matter of the solicitation. IRDAI Registration details available on respective insurer websites.
</div>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
}

// ══════════════════════════════════════════════════════
// COMMUNICATION TOOLKIT
// ══════════════════════════════════════════════════════

function renderToolkit(cat) {
  lastCompareCat = cat;
  if (typeof buildProductRegistry === 'function') PRODUCT_REGISTRY = buildProductRegistry();
  const wrap = document.getElementById('toolkitWrap');
  if (!wrap) return;

  const catMap = { term:'Term Insurance', par:'Participating Endowment', nonpar:'Guaranteed Savings', 'early-income':'Guaranteed Early Income', ulip:'ULIP', annuity:'Annuity' };
  const defaultCat = catMap[cat] || 'Term Insurance';
  const cats = ['Term Insurance','Participating Endowment','Guaranteed Early Income','Guaranteed Savings','Guaranteed Long Term Income','ULIP','Annuity'];

  wrap.innerHTML = `
  <div class="tk-header">
    <div class="tk-title">📱 Communication Toolkit</div>
    <div class="tk-sub">Generate client-ready WhatsApp messages, emails and pitches</div>
  </div>

  <div class="tk-form">
    <div class="cp-bar">
      <div class="cp-head">
        <span class="cp-title">👥 Saved Clients</span>
        <button class="cp-save-btn" onclick="saveCurrentClientProfile()">💾 Save Client</button>
      </div>
      <div class="cp-chips" id="clientProfileChips"></div>
    </div>
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
  if (typeof renderClientProfileChips === 'function') renderClientProfileChips();
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
  track('toolkit_generate',{mode:tkMode,goal:document.getElementById('tkGoal')?.value||''});
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
    // Pull features — priority: keyFeatures > tags > metaHighlights > salesPitch
    const _rawF = p.keyFeatures || [];
    const _rawT = (p.tags||[]).filter(t=>['yes','unique'].includes(t.type)).map(t=>t.label.replace(/\s*✓$/,''));
    const _metaHL = (p.meta?.keyHighlights||[]).filter(h=>!h.includes('official insurer website') && !h.includes('Plan details available'));
    const _pitch = p.salesPitch || p.uniqueFeature || p.bestFor || '';
    let _hl = [];
    if (_rawF.length >= 2) {
      _hl = _rawF.slice(0,5).map(h=>`✅ ${h}`);
    } else if (_rawT.length >= 2) {
      _hl = _rawT.slice(0,5).map(t=>`✅ ${t}`);
    } else if (_metaHL.length >= 2) {
      _hl = _metaHL.slice(0,4).map(h=>`✅ ${h}`);
    }
    if (_pitch && !_pitch.includes('official') && _hl.length < 5) {
      _hl.unshift(`⭐ ${_pitch}`);
    }
    const highlights = _hl.slice(0,5).join('\n') || '✅ Refer official brochure for verified product features';

    wa = `Hi ${name} 👋\n\nHope you're doing well!\n\nAs we discussed your goal of *${goal}*, I wanted to share a plan that may be very relevant for you.\n\n📌 *${p.plan}*\n_${p.company} | ${p.type}_\n\n${highlights || '✅ Plan details from official brochure'}\n\n💡 ${getRiskNote(risk, goal)}\n\n📎 Brochure: ${bro}\n\n_For information only — not financial advice. Always read the official brochure before any decision._\n\n— ${advisorSignature('wa')}`;

    email = `Subject: ${subj}${p.plan} — Product Information\n\nDear ${name},\n\nThank you for the opportunity to share relevant financial planning information with you.\n\nBased on your goal of ${goal} and your ${risk.toLowerCase()} risk approach${age?`, considering your age of ${age} years`:''}${occ?` and occupation as ${occ}`:''}, I would like to share the following plan for your consideration.\n\n────────────────────────\nPlan: ${p.plan}\nCompany: ${p.company}\nType: ${p.type}\nCategory: ${p.category}\n────────────────────────\n\nKey Features:\n${(_hl.length? _hl : ['✅ Refer official brochure for complete verified features']).map(h=>`• ${h.replace(/^[✅⭐]\s*/,'')}`).join('\n')}\n\n${(_pitch||p.meta?.whySuit) ? 'Why This May Be Relevant:\n' + (_pitch||p.meta?.whySuit) + '\n\n' : ''}Official Brochure: ${bro}\nProduct Page: ${prodUrl}\n\n────────────────────────\nDISCLAIMER\nThis communication is for educational and informational purposes only. It does not constitute financial advice. Past performance is not indicative of future results. Please read the official product brochure carefully and consult a qualified advisor before making any decision.\n────────────────────────\n\nWarm regards,\n${advisorSignature('email')}`;

    pitch = getPitch(p, null, goal, risk);

  } else {
    const a = toolkitProduct, b = toolkitProductB;
    if (!a || !b) { alert('Please select both plans.'); return; }
    const aBro = a.brochureUrl || 'Official link unavailable';
    const bBro = b.brochureUrl || 'Official link unavailable';

    wa = `Hi ${name} 👋\n\nFollowing our discussion on *${goal}*, here is a quick comparison for your reference.\n\n🔵 *${a.plan}* — _${a.company}_\n${(a.meta?.keyHighlights||[]).slice(0,3).map(h=>`• ${h}`).join('\n')||'• Refer brochure'}\n\n🟢 *${b.plan}* — _${b.company}_\n${(b.meta?.keyHighlights||[]).slice(0,3).map(h=>`• ${h}`).join('\n')||'• Refer brochure'}\n\n*When ${a.company} may suit you:*\n${getCompReason(a, goal)}\n\n*When ${b.company} may suit you:*\n${getCompReason(b, goal)}\n\n📎 ${a.company} Brochure: ${aBro}\n📎 ${b.company} Brochure: ${bBro}\n\n_Educational information only. Not financial advice. Read official brochures carefully._`;

    email = `Subject: ${subj}Product Comparison — ${a.plan} vs ${b.plan}\n\nDear ${name},\n\nThank you for exploring your ${goal.toLowerCase()} planning options. Here is a comparison of two relevant plans for your reference.\n\n────────────────────────\nPlan A: ${a.plan}\nCompany: ${a.company} | Type: ${a.type}\n${(a.meta?.keyHighlights||[]).map(h=>`• ${h}`).join('\n')}\n\nWhen Plan A may be relevant:\n${getCompReason(a,goal)}\n\n────────────────────────\nPlan B: ${b.plan}\nCompany: ${b.company} | Type: ${b.type}\n${(b.meta?.keyHighlights||[]).map(h=>`• ${h}`).join('\n')}\n\nWhen Plan B may be relevant:\n${getCompReason(b,goal)}\n\n────────────────────────\nOfficial Links\n${a.company} Brochure: ${aBro}\n${b.company} Brochure: ${bBro}\n\nDISCLAIMER: This communication is for educational purposes only. Not financial advice. Read official brochures before any decision.\n\nWarm regards,\n${advisorSignature('email')}`;

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
  track('whatsapp_share',{source:'toolkit'});
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

