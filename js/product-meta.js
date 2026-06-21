// ══════════════════════════════════════════════════════
// PRODUCT META — Insurance Arena
// Key Highlights · Score Data · Limitations · Why Choose
// Keyed by plan id from data files
// ══════════════════════════════════════════════════════

const PRODUCT_META = {

  // ── ANMOL AKSHAYA PLANS ────────────────────────────
  'absli': {
    keyHighlights: [
      'Non-Linked Participating Endowment plan',
      'Compound Reversionary Bonus + Terminal Bonus at maturity',
      'Joint Life Protection — spouse covered at 20% of SA',
      'Extended Life Cover option up to age 75 or 85',
      'HER Benefits for women policyholders (₹75K+ premium)'
    ],
    whySuit: 'Choose ABSLI Anmol Akshaya if you want a savings plan that combines guaranteed maturity benefits with bonus upside, joint life protection for your spouse, and rider flexibility. The Extended Life Cover and HER Benefits make it particularly suited for family-oriented savings goals.',
    bestFor: 'Individuals aged 30–55 seeking a medium-to-long-term savings plan with life cover, who value bonus-linked growth and want joint life protection for their spouse.',
    limitations: [
      'Participating plan — bonus is not guaranteed and depends on insurer performance',
      'Lump sum maturity only (My Savings option) — no income stream',
      'Extended Life Cover available as an optional add-on, not built-in',
      'HER Benefits require minimum ₹75,000 annual premium'
    ],
    scoreData: { flexibility:8, protection:9, income:1, riders:9, loan:9, jointLife:10 }
  },
  'tata': {
    keyHighlights: [
      'Non-Linked Participating plan — 3 options: Endowment, Early Income, Deferred Income',
      'Cover Continuance Benefit and Waiver of Premium available',
      'Reversionary Bonus + Terminal Bonus structure',
      'Higher Sum Assured (12× AP) vs most competitors',
      'Flexible benefit payout option'
    ],
    whySuit: 'Choose Tata AIA Shubh Flexi Income (Endowment) if you want a participating savings plan with a slightly higher SA multiple (12×) and flexibility to choose between endowment, early income, or deferred income at inception.',
    bestFor: 'Individuals who want a participating savings plan with flexible output — either lump sum or income — and are comfortable with non-guaranteed bonus income.',
    limitations: [
      'Participating plan — bonus not guaranteed',
      'Bonus type is Reversionary (simpler structure vs ABSLI\'s Compound)',
      'Cover Continuance and WOP are optional add-ons at extra premium',
      'Limited brochure data available in public domain'
    ],
    scoreData: { flexibility:7, protection:8, income:5, riders:6, loan:5, jointLife:8 }
  },
  'bajaj': {
    keyHighlights: [
      'Non-Linked Participating plan with lump sum and income variants',
      'Income option includes increasing income at 5% p.a.',
      'Multiple PPT choices (5-12 years)',
      'Company renamed: Bajaj Life Insurance Ltd.'
    ],
    whySuit: 'Choose Bajaj Life ACE if you want a participating plan with an income option that increases at 5% p.a. — useful for inflation protection.',
    bestFor: 'Individuals comfortable with participating plans who want flexibility between lump sum and increasing income output.',
    limitations: [
      'Participating plan — bonus not guaranteed',
      'Illustration data pending — exact maturity values not confirmed',
      'Company recently renamed from Bajaj Allianz'
    ],
    scoreData: { flexibility:7, protection:6, income:6, riders:6, loan:4, jointLife:7 }
  },
  'pnb': {
    keyHighlights: [
      'Non-Linked Participating plan',
      'PNB MetLife joint venture — bank channel distribution',
      'Savings and income variants available',
      'Broad PNB bank network access'
    ],
    whySuit: 'Choose PNB MetLife Super Saver if you prefer banking with PNB or want PNB-linked insurance services.',
    bestFor: 'PNB bank customers seeking a savings plan with life cover through their existing banking relationship.',
    limitations: [
      'Participating plan — bonus not guaranteed',
      'Illustration data pending — exact maturity values not confirmed',
      'Limited public brochure data available'
    ],
    scoreData: { flexibility:6, protection:6, income:4, riders:5, loan:5, jointLife:6 }
  },
  'lic': {
    keyHighlights: [
      'LIC — India\'s most trusted insurer with sovereign backing',
      'Non-Linked Participating Endowment',
      'Simple Reversionary Bonus + Final Additional Bonus',
      'Widest distribution network in India'
    ],
    whySuit: 'Choose LIC New Endowment Plan 714 if brand trust and sovereign guarantee are your primary considerations.',
    bestFor: 'Conservative investors who prioritise brand safety and government backing over feature richness.',
    limitations: [
      'PPT 10 + PT 20 combination not available under LIC New Endowment Plan 714',
      'Regular Pay only (PPT = PT)',
      'Simple Reversionary Bonus (lower than compound for same premium)',
      'Fewer modern features vs private sector plans'
    ],
    scoreData: { flexibility:3, protection:7, income:0, riders:4, loan:8, jointLife:5 },
    notAvailable: true
  },

  // ── NISHCHIT AAYUSH PLANS ──────────────────────────
  'nishchit-absli': {
    keyHighlights: [
      'Non-Linked, Non-Participating — returns 100% guaranteed',
      'Guaranteed income from Year 1 (zero deferment)',
      'Level income of ₹35,050/year for 20 years',
      'Guaranteed lump sum of ₹11,00,000 at maturity',
      '10× Sum Assured life cover throughout the term'
    ],
    whySuit: 'Choose ABSLI Nishchit Aayush if you want guaranteed income starting immediately from Year 1, combined with a large maturity lump sum — all fully guaranteed with no market risk.',
    bestFor: 'Conservative individuals aged 30–50 who want guaranteed regular income alongside life cover, with certainty of returns from Day 1.',
    limitations: [
      'Level income — does not increase over time (no inflation protection)',
      'Lump sum is ₹11L on a ₹10L total premium — moderate maturity uplift',
      'No loan facility mentioned in brochure',
      'UIN pending confirmation from current policy document'
    ],
    scoreData: { flexibility:6, protection:8, income:10, riders:5, loan:4, jointLife:4 }
  },
  'icici': {
    keyHighlights: [
      'Non-Linked, Non-Participating — fully guaranteed',
      'Instant cashback of ₹50,000 at policy issuance',
      'Income increases at 5% compounding each year',
      '100% of premiums returned as maturity benefit',
      'GIFT Select — newer version with enhanced features'
    ],
    whySuit: 'Choose ICICI Pru GIFT Select if you want immediate liquidity (₹50K cashback) and prefer income that grows over time to counter inflation.',
    bestFor: 'Individuals who need immediate liquidity, prefer growing income over fixed income, or are concerned about inflation eroding their income stream.',
    limitations: [
      'Income starts from Year 2 (not Year 1) — one year gap',
      'Illustration based on Female (Age 35); male rates may differ slightly',
      'Increasing income means lower initial income vs ABSLI\'s level income',
      'Total return (₹16.05L) lower than ABSLI (₹18.01L) at same benchmark',
      'IRR of 4.13% vs ABSLI\'s 5.51%'
    ],
    scoreData: { flexibility:7, protection:7, income:9, riders:5, loan:7, jointLife:5 }
  },
  'axis': {
    keyHighlights: [
      'Non-Linked, Non-Participating — fully guaranteed',
      'Income from Year 1 (zero deferment)',
      'Multiple policy term options',
      'Axis Max Life — leading private insurer'
    ],
    whySuit: 'Choose Axis Max Life SWAG Early Wealth if you want guaranteed early income from Year 1 and trust the Axis Max Life brand.',
    bestFor: 'Individuals seeking early income plans from a large private insurer with strong brand recognition.',
    limitations: [
      'PT 20 illustration data pending — comparison based on PT 30 data only',
      'Company recently rebranded from Max Life to Axis Max Life'
    ],
    scoreData: { flexibility:6, protection:7, income:9, riders:5, loan:4, jointLife:4 },
    pending: true
  },

  // ── ANNUITY PLANS ──────────────────────────────────
  'absli-ann': {
    keyHighlights: [
      '10 annuity options — widest range in market',
      'UNIQUE: CI Enhancement — annuity increases 50% on first of 42 CIs',
      'UNIQUE: ROP at age 80 to living annuitant (annuity continues)',
      'UNIQUE: Joint Life Split ROP (50% + 50% structure)',
      'Deferred option with Guaranteed Additions (2%/month) + Limited Pay'
    ],
    whySuit: 'Choose ABSLI Guaranteed Annuity Plus if comprehensive option coverage, CI protection with annuity enhancement, and living benefits matter to you.',
    bestFor: 'Retirees or pre-retirees seeking the widest annuity option range with unique CI protection and living benefit features not available elsewhere.',
    limitations: [
      'Current rates (V17) not publicly available — must check official calculator',
      'CI Enhancement option has age cap of 70 for CI trigger',
      'Deferred + Limited Pay only available under Option 9'
    ],
    scoreData: { flexibility:10, protection:10, income:10, riders:7, loan:8, jointLife:10 }
  }
  // Additional plans added dynamically via scoreData defaults
};

// ── DEFAULT SCORE for plans without explicit meta ──
const DEFAULT_SCORE = { flexibility:5, protection:5, income:5, riders:5, loan:5, jointLife:5 };
const DEFAULT_HIGHLIGHTS = ['Plan details available from official insurer website'];
const DEFAULT_LIMITATIONS = ['Verify all features from official product brochure'];

function getMeta(planId) {
  return PRODUCT_META[planId] || {
    keyHighlights: DEFAULT_HIGHLIGHTS,
    whySuit: 'Check official brochure for full details.',
    bestFor: 'Verify from official insurer source.',
    limitations: DEFAULT_LIMITATIONS,
    scoreData: { ...DEFAULT_SCORE }
  };
}

// ── PRODUCT REGISTRY — unified list for A vs B ──
function buildProductRegistry() {
  const reg = [];

  // Term Insurance (from PLANS in data.js)
  if (typeof PLANS !== 'undefined') {
    PLANS.forEach(p => reg.push({
      regId: 'term_' + (p.id || p.company),
      category: 'Term Insurance', catKey: 'term',
      company: p.company, plan: p.planName || p.plan || 'Term Plan',
      type: 'Non-Linked Non-Par (Term)',
      entryAge: p.entryAge || '—', maturityAge: p.maxMaturity || '—',
      ppt: p.ppt || '—', pt: p.pt || '—',
      deathBenefit: p.deathBenefit || 'Sum Assured',
      riders: p.riders || '—', loan: p.loan || false,
      jointLife: p.jointLife || false,
      guaranteedAdditions: false, loyaltyAdditions: false,
      incomeBenefit: false, incomePeriod: '—', incomeFrequency: '—',
      bestFor: p.bestFor || '—', uniqueAdvantage: p.uniqueFeature || p.uniqueAdvantage || '—',
      productUrl: p.calcUrl || p.productUrl || null,
      brochureUrl: p.brochureUrl || null,
      meta: getMeta('term_' + (p.id || p.company))
    }));
  }

  // Anmol Akshaya (Participating Endowment)
  if (typeof ANMOL_PLANS !== 'undefined') {
    ANMOL_PLANS.forEach(p => {
      if (p.notAvailable) return;
      reg.push({
        regId: 'par_' + p.id,
        category: 'Participating Endowment', catKey: 'par',
        company: p.company, plan: p.plan,
        type: p.type || 'Non-Linked Participating',
        entryAge: '30 days – 65 yrs', maturityAge: '85 yrs',
        ppt: p.isBase ? 'Single Pay | 5–12 yrs' : (p.ppt || '—'),
        pt: p.isBase ? 'Up to 35 yrs' : '—',
        deathBenefit: p.isBase ? 'SA on Death + Accrued Bonuses' : '—',
        riders: p.isBase ? 'Accidental Death | CI | Surgical Care | Hospital Care' : (p.features?.riders || '—'),
        loan: p.isBase ? true : false,
        jointLife: p.isBase ? true : false,
        guaranteedAdditions: p.isBase ? true : false,
        loyaltyAdditions: p.isBase ? true : false,
        incomeBenefit: false, incomePeriod: '—', incomeFrequency: '—',
        bestFor: p.uniqueFeature || '—',
        uniqueAdvantage: p.uniqueFeature || '—',
        productUrl: p.productUrl || null,
        brochureUrl: p.brochureUrl || null,
        pending: p.pending || false,
        isBase: p.isBase || false,
        mat4: p.mat4, mat8: p.mat8, irr4: p.irr4, irr8: p.irr8,
        meta: getMeta(p.id)
      });
    });
  }

  // Nishchit Aayush (Guaranteed Early Income)
  if (typeof NISHCHIT_PLANS !== 'undefined') {
    NISHCHIT_PLANS.forEach(p => {
      if (p.excluded) return;
      reg.push({
        regId: 'ni_' + p.id,
        category: 'Guaranteed Early Income', catKey: 'nonpar',
        company: p.company, plan: p.plan,
        type: p.type || 'Non-Linked Non-Par',
        entryAge: '—', maturityAge: '—',
        ppt: '10 yrs', pt: '20 yrs',
        deathBenefit: p.isBase ? 'SA on Death (10× AP)' : '—',
        riders: '—', loan: false, jointLife: false,
        guaranteedAdditions: false, loyaltyAdditions: false,
        incomeBenefit: true,
        incomePeriod: p.incomePeriod ? p.incomePeriod + ' yrs' : '—',
        incomeFrequency: 'Annual / Half-Yearly / Quarterly / Monthly',
        bestFor: p.uniqueFeature || '—',
        uniqueAdvantage: p.uniqueFeature || '—',
        productUrl: p.productUrl || null,
        brochureUrl: p.brochureUrl || null,
        pending: p.pending || false,
        isBase: p.isBase || false,
        annualIncome: p.annualIncome, totalReturn: p.totalReturn, irr: p.irr,
        meta: getMeta(p.isBase ? 'nishchit-absli' : p.id)
      });
    });
  }

  // Assured Savings Plans
  if (typeof SAVINGS_PLANS !== 'undefined') {
    SAVINGS_PLANS.forEach(p => {
      reg.push({
        regId: 'sav_' + (p.company||'').replace(/\s/g,'_'),
        category: 'Guaranteed Savings', catKey: 'nonpar',
        company: p.company, plan: p.plan,
        type: p.type || 'Non-Linked Non-Par',
        entryAge: p.entryAge || '—', maturityAge: '—',
        ppt: p.ppt || '—', pt: '—',
        deathBenefit: p.deathBenefit || '—',
        riders: p.riders || '—',
        loan: p.loan || false, jointLife: p.jointLife || false,
        guaranteedAdditions: p.guaranteedAdditions || false,
        loyaltyAdditions: p.loyaltyAdditions || false,
        incomeBenefit: p.incomeBenefit || false,
        incomePeriod: '—', incomeFrequency: '—',
        bestFor: p.uniqueFeature || '—',
        uniqueAdvantage: p.uniqueFeature || '—',
        productUrl: p.url || null,
        brochureUrl: (!p.brochure || p.brochure.startsWith('Verify')) ? null : p.brochure,
        isBase: p.isBase || false,
        typeWarning: p.typeWarning || false,
        meta: getMeta('sav_' + (p.company||''))
      });
    });
  }

  // Assured Income Plus Plans
  if (typeof INCOME_PLANS !== 'undefined') {
    INCOME_PLANS.forEach(p => {
      reg.push({
        regId: 'inc_' + (p.company||'').replace(/\s/g,'_'),
        category: 'Guaranteed Long Term Income', catKey: 'nonpar',
        company: p.company, plan: p.plan,
        type: p.type || 'Non-Linked Non-Par',
        entryAge: '—', maturityAge: '—',
        ppt: p.ppt || '—', pt: '—',
        deathBenefit: '—', riders: p.riders || '—',
        loan: p.loan || false, jointLife: false,
        guaranteedAdditions: p.guaranteedAdditions || false,
        loyaltyAdditions: p.loyaltyAdditions || false,
        incomeBenefit: p.incomeBenefit || false,
        incomePeriod: p.incomePeriods ? p.incomePeriods.join(' / ') : '—',
        incomeFrequency: 'Annual / Half-Yearly / Quarterly / Monthly',
        bestFor: p.uniqueFeature || '—',
        uniqueAdvantage: p.uniqueFeature || '—',
        productUrl: p.url || null,
        brochureUrl: (!p.brochure || p.brochure.startsWith('Verify')) ? null : p.brochure,
        isBase: p.isBase || false,
        typeWarning: p.typeWarning || false,
        meta: getMeta('inc_' + (p.company||''))
      });
    });
  }

  // Annuity Plans
  if (typeof ANNUITY_PLANS !== 'undefined') {
    ANNUITY_PLANS.forEach(p => {
      reg.push({
        regId: 'ann_' + p.id,
        category: 'Annuity', catKey: 'annuity',
        company: p.company, plan: p.plan,
        type: p.type || 'Non-Linked Non-Par Annuity',
        entryAge: p.entryAge || '—', maturityAge: '—',
        ppt: p.limitedPayNote || (p.limitedPay ? 'Limited Pay available' : 'Single Pay'),
        pt: p.type || '—',
        deathBenefit: 'As per annuity option selected',
        riders: '—',
        loan: typeof p.loan === 'string' ? true : (p.loan || false),
        jointLife: p.jointLife || false,
        guaranteedAdditions: p.id === 'absli' ? true : false,
        loyaltyAdditions: false,
        incomeBenefit: true,
        incomePeriod: 'Lifelong', incomeFrequency: 'Annual / Half-Yearly / Quarterly / Monthly',
        bestFor: p.uniqueFeature || '—',
        uniqueAdvantage: p.uniqueFeature || '—',
        productUrl: p.calcUrl || null,
        brochureUrl: p.brochureUrl || null,
        isBase: p.isBase || false,
        totalOptions: p.totalOptions,
        meta: getMeta(p.isBase ? 'absli-ann' : 'ann_' + p.id)
      });
    });
  }

  return reg;
}

// Build registry once at load
let PRODUCT_REGISTRY = [];
document.addEventListener('DOMContentLoaded', () => {
  PRODUCT_REGISTRY = buildProductRegistry();
});
// Also build immediately in case DOM already loaded
if (document.readyState !== 'loading') {
  setTimeout(() => { PRODUCT_REGISTRY = buildProductRegistry(); }, 100);
}
