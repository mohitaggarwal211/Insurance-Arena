// ══════════════════════════════════════════════════════
// ANMOL AKSHAYA — PARTICIPATING ENDOWMENT COMPARISON
// Benchmark: Age 35 | Male | ₹1L AP | PPT 10 | PT 20
// ══════════════════════════════════════════════════════

const ANMOL_BENCHMARK = {
  age: 35, gender: 'Male', ap: 100000, ppt: 10, pt: 20,
  totalPremium: 1000000,
  note: 'All figures from official benefit illustrations. Non-guaranteed bonuses shown at IRDAI-prescribed 4% and 8% assumed returns.'
};

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
    sa: 1100000,          // 11× AP
    saMultiple: 11,
    gmb: 1100000,        // Verified from official brochure        // Verified from official brochure00,000 + CRB ₹1,77,303 + TB ₹53,000',00,000 + CRB ₹8,86,722 + TB ₹1,15,000',
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
    sa: 1200000,          // 12× AP
    saMultiple: 12,
    gmb: 1050000,        // Verified — Official BI dated 21 Jun 2026        // Verified — Official BI dated 21 Jun 202650,000 + Rev Bonus ₹5,20,000',50,000 + Rev Bonus ₹8,40,000 + Terminal Bonus ₹8,19,930',
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
    sa: null, gmb: null,
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Illustration pending',
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
    sa: null, gmb: null,
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Illustration pending',
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
    sa: null, gmb: null,
    bonusType: 'Simple Reversionary Bonus + Final Additional Bonus',
    guaranteed: false,
    dataSource: 'NA — PPT 10 + PT 20 combination not available in LIC 714',
    dataDate: null,
    notAvailable: true,
    naReason: 'PPT 10 + PT 20 combination not available under LIC New Endowment Plan 714. The plan requires PPT = PT (Regular Pay only) for this term.',
    uniqueFeature: 'LIC brand trust. Sovereign guarantee. Widest distribution network.',
    pitch: 'India\'s most trusted insurer — guaranteed savings with life cover and bonus.',
    features: {
      jointLife: false, loan: true, riders: true,
      revivalPeriod: '5 years', surrender: 'After 3 years'
    }
  }
];

// IRR note: figures computed on advance premium, lump sum at year 20
const ANMOL_IRR_NOTE = 'IRR calculated on advance annual premium (t=0 to t=9) with lump sum maturity receipt at t=20. Non-guaranteed figures assume IRDAI-prescribed 4% / 8% portfolio returns.';
