// Data verified: July 2026 (monthly review protocol)
// ANMOL AKSHAYA — PARTICIPATING ENDOWMENT COMPARISON
// Compliance rule: NO benchmark-tied rupee figures, NO IRR. Only structural features
// that hold true regardless of the customer's chosen age/PPT/PT/premium/SA.
// ══════════════════════════════════════════════════════

const ANMOL_PLANS = [
  {
    id: 'absli',
    company: 'ABSLI',
    companyFull: 'Aditya Birla Sun Life Insurance',
    plan: 'Anmol Akshaya',
    uin: '109N183V01',
    type: 'Non-Linked Participating',
    isBase: true,
    productUrl: 'https://lifeinsurance.adityabirlacapital.com/savings-plans/anmol-akshaya/',
    brochureUrl: 'https://lifeinsurance.adityabirlacapital.com/',
    saMultiple: 11,       // Sum Assured = 11× Annualized Premium (structural multiple)
    hasGuaranteedMaturityBenefit: true,
    bonusType: 'Compound Reversionary Bonus + Terminal Bonus',
    guaranteed: true,
    dataSource: 'Verified — ABSLI Official Brochure',
    dataDate: '2025',
    uniqueFeature: 'My Child option (income payouts). Extended Life Cover to 75/85. HER Benefits for women.',
    pitch: 'Guaranteed savings with life cover — lumpsum at 20 years with bonus uplift.',
    features: {
      jointLife: false, loan: true, riders: true,
      revivalPeriod: '5 years', surrender: 'After 1 policy year'
    }
  },
  {
    id: 'tata',
    company: 'Tata AIA',
    companyFull: 'Tata AIA Life Insurance',
    plan: 'Shubh Flexi Income (Option 1 – Endowment)',
    uin: '110N207V02',
    type: 'Non-Linked Participating',
    isBase: false,
    productUrl: 'https://www.tataaia.com/life-insurance-plans/savings-solutions/shubh-flexi-income-plan.html',
    brochureUrl: 'https://www.tataaia.com/',
    saMultiple: 12,       // Sum Assured = 12× Annualized Premium (structural multiple)
    hasGuaranteedMaturityBenefit: true,
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Verified — Official Benefit Illustration, 21 Jun 2026',
    dataDate: 'Jun 2026',
    uniqueFeature: 'Sub-Wallet: accumulate cash bonus, earns interest at SDF rate (6% p.a. compounding). Unique in Par segment.',
    pitch: 'Flexible participating plan with 3 income options. Sub-Wallet earns bonus interest daily. Cover continues to nominee even after life assured dies.',
    keyHighlights: [
      '3 Options: Endowment (lumpsum at maturity) / Early Income (cash bonus from Yr 1) / Deferred Income (cash bonus after PPT ends)',
      'Sub-Wallet: Accumulate cash bonus, earns interest at SDF rate (currently 6% p.a. compounding monthly)',
      'Cover Continuance Benefit: Policy + future bonuses + maturity benefit continue to nominee even after life assured dies',
      'Waiver of Premium Benefit: Future premiums waived on proposer death (when proposer ≠ life insured)',
      'Smart Lady Benefit: Premium discounts for female policyholders',
      'Family Discount: Additional discounts for family members and nominees of existing policyholders'
    ],
    features: {
      jointLife: false, loan: false, riders: true,
      revivalPeriod: 'Verify from brochure', surrender: 'Verify from brochure'
    }
  },
  {
    id: 'bajaj',
    company: 'Bajaj Life',
    companyFull: 'Bajaj Life Insurance Ltd.',
    plan: 'ACE (Lump Sum option)',
    uin: '116N186V03',
    type: 'Non-Linked Participating',
    isBase: false,
    productUrl: 'https://www.bajajallianzlife.com/savings-plans/bajaj-allianz-life-ace.html',
    brochureUrl: 'https://buyonline.bajajallianzlife.com/content/dam/balic/pdf/savings-plans/ace-brochure.pdf',
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Structural features verified; detailed brochure pass pending',
    dataDate: null,
    pending: true,
    uniqueFeature: 'Income variant also available. Increasing income at 5% p.a. option.',
    pitch: 'Flexible participating plan with guaranteed + bonus income.',
    features: {
      jointLife: false, loan: false, riders: true,
      revivalPeriod: 'Verify from brochure', surrender: 'Verify from brochure'
    }
  },
  {
    id: 'pnb',
    company: 'PNB MetLife',
    companyFull: 'PNB MetLife India Insurance',
    plan: 'Super Saver (Savings option)',
    uin: '117N123V03',
    type: 'Non-Linked Participating',
    isBase: false,
    productUrl: 'https://www.pnbmetlife.com/insurance-plans/savings',
    brochureUrl: 'https://www.pnbmetlife.com/',
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Structural features verified; detailed brochure pass pending',
    dataDate: null,
    pending: true,
    uniqueFeature: 'Savings + Health Care option: WOP for 35 Critical Illnesses. Savings + Family Care: premium waived after death, all benefits continue.',
    keyHighlights: [
      '3 Plan Options: Savings / Savings + Family Care / Savings + Health Care',
      'Savings + Family Care: Future premiums waived after death; maturity benefit (SA + bonuses) still paid',
      'Savings + Health Care: Waiver of Premium for 35 Critical Illnesses (90-day waiting period)',
      '2 Bonus Payout Options: Accumulation (lumpsum at maturity) or Liquidity (cash bonus yearly after PPT)',
      'Simple Reversionary Bonus + Terminal Bonus (if declared)',
      'Flexible PPT: 5, 7, 10, 12 or 15 years'
    ],
    pitch: 'Three plan options for different needs — pure savings, family income protection, or critical illness coverage, all with participating bonus structure.',
    features: {
      jointLife: false, loan: false, riders: true,
      revivalPeriod: 'Verify from brochure', surrender: 'Verify from brochure'
    }
  },
  {
    id: 'lic',
    company: 'LIC',
    companyFull: 'Life Insurance Corporation of India',
    plan: 'New Endowment Plan 714',
    uin: '512N277V03',
    type: 'Non-Linked Participating',
    isBase: false,
    productUrl: 'https://licindia.in/Products/Insurance-Plans/Endowment-Assurance-Plans/LIC-s-New-Endowment-Plan',
    brochureUrl: 'https://licindia.in/',
    bonusType: 'Simple Reversionary Bonus + Final Additional Bonus',
    guaranteed: false,
    dataSource: 'Structural review — LIC Official',
    dataDate: null,
    notAvailable: true,
    naReason: 'LIC New Endowment Plan 714 is Regular Pay only (PPT must equal Policy Term) — it has no limited premium payment option, so it is structurally different from the limited-pay Participating plans in this comparison.',
    uniqueFeature: 'LIC brand trust. Sovereign guarantee. Widest distribution network.',
    pitch: 'India\'s most trusted insurer — guaranteed savings with life cover and bonus.',
    features: {
      jointLife: false, loan: true, riders: true,
      revivalPeriod: '5 years', surrender: 'After 3 years'
    }
  }
];
