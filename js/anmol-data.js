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
    uin: 'Verify from current policy document',
    type: 'Non-Linked Participating',
    isBase: true,
    productUrl: 'https://lifeinsurance.adityabirlacapital.com/savings-plans/anmol-akshaya/',
    brochureUrl: 'https://lifeinsurance.adityabirlacapital.com/',
    sa: 1100000,          // 11× AP
    saMultiple: 11,
    gmb: 1100000,
    mat4: 1530303,        // Verified from official brochure
    mat8: 2701722,        // Verified from official brochure
    irr4: 2.76,
    irr8: 6.51,
    breakup4: 'GMB ₹11,00,000 + CRB ₹1,77,303 + TB ₹53,000',
    breakup8: 'GMB ₹11,00,000 + CRB ₹8,86,722 + TB ₹1,15,000',
    bonusType: 'Compound Reversionary Bonus + Terminal Bonus',
    guaranteed: true,
    dataSource: 'Verified — ABSLI Official Brochure',
    dataDate: '2025',
    uniqueFeature: 'My Child option (income payouts). Extended Life Cover to 75/85. HER Benefits for women.',
    pitch: 'Guaranteed savings with life cover — lumpsum at 20 years with bonus uplift.',
    features: {
      jointLife: true, loan: true, riders: true,
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
    gmb: 1050000,
    mat4: 1570000,        // Verified — Official BI dated 21 Jun 2026
    mat8: 2709930,        // Verified — Official BI dated 21 Jun 2026
    irr4: 2.93,
    irr8: 6.53,
    breakup4: 'GMB ₹10,50,000 + Rev Bonus ₹5,20,000',
    breakup8: 'GMB ₹10,50,000 + Rev Bonus ₹8,40,000 + Terminal Bonus ₹8,19,930',
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Verified — Official Benefit Illustration, 21 Jun 2026',
    dataDate: 'Jun 2026',
    uniqueFeature: '3 plan options: Endowment, Early Income, Deferred Income. Flexible benefit structure.',
    pitch: 'Flexible participating plan — choose endowment or income at inception.',
    features: {
      jointLife: true, loan: false, riders: true,
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
    sa: null, gmb: null, mat4: null, mat8: null, irr4: null, irr8: null,
    breakup4: null, breakup8: null,
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Illustration pending',
    dataDate: null,
    pending: true,
    uniqueFeature: 'Income variant also available. Increasing income at 5% p.a. option.',
    pitch: 'Flexible participating plan with guaranteed + bonus income.',
    features: {
      jointLife: true, loan: false, riders: true,
      revivalPeriod: 'Verify from brochure', surrender: 'Verify from brochure'
    }
  },
  {
    id: 'pnb',
    company: 'PNB MetLife',
    companyFull: 'PNB MetLife India Insurance',
    plan: 'Super Saver (Savings option)',
    uin: 'Verify from current policy document',
    type: 'Non-Linked Participating',
    isBase: false,
    productUrl: 'https://www.pnbmetlife.com/insurance-plans/savings',
    brochureUrl: 'https://www.pnbmetlife.com/',
    sa: null, gmb: null, mat4: null, mat8: null, irr4: null, irr8: null,
    breakup4: null, breakup8: null,
    bonusType: 'Reversionary Bonus + Terminal Bonus (non-guaranteed)',
    guaranteed: false,
    dataSource: 'Illustration pending',
    dataDate: null,
    pending: true,
    uniqueFeature: 'Savings and income variants available.',
    pitch: 'Participating savings plan from PNB MetLife joint venture.',
    features: {
      jointLife: true, loan: false, riders: true,
      revivalPeriod: 'Verify from brochure', surrender: 'Verify from brochure'
    }
  },
  {
    id: 'lic',
    company: 'LIC',
    companyFull: 'Life Insurance Corporation of India',
    plan: 'New Endowment Plan 714',
    uin: 'Verify from LIC',
    type: 'Non-Linked Participating',
    isBase: false,
    productUrl: 'https://licindia.in/Products/Insurance-Plans/Endowment-Assurance-Plans/LIC-s-New-Endowment-Plan',
    brochureUrl: 'https://licindia.in/',
    sa: null, gmb: null, mat4: null, mat8: null, irr4: null, irr8: null,
    breakup4: null, breakup8: null,
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
