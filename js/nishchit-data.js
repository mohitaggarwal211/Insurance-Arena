// Data verified: July 2026 (monthly review protocol)
// NISHCHIT AAYUSH — NON-PAR GUARANTEED INCOME COMPARISON
// Compliance rule: NO benchmark-tied rupee figures, NO IRR. Only structural features
// that hold true regardless of the customer's chosen age/PPT/PT/premium/SA.
// Category-defining feature: guaranteed income starts DURING the Premium Payment Term
// itself (Year 1 or 2) — not after PPT ends, unlike most guaranteed-income plans in market.
// ══════════════════════════════════════════════════════

const NISHCHIT_PLANS = [
  {
    id: 'absli',
    company: 'ABSLI',
    companyFull: 'Aditya Birla Sun Life Insurance',
    plan: 'Nishchit Aayush Plan', entryAge: '30 days – 65 yrs',
    uin: '109N137V13',
    type: 'Non-Linked, Non-Participating',
    isBase: true,
    productUrl: 'https://lifeinsurance.adityabirlacapital.com/savings-plans/absli-nishchit-aayush-plan/',
    brochureUrl: 'https://lifeinsurance.adityabirlacapital.com/',
    incomeFrom: 'Year 1 (0 deferment)',
    incomeType: 'Level (fixed amount every year — does not increase or decrease)',
    incomePeriod: 'Equal to Policy Term',
    saMultiple: 'Varies by age band and PPT — refer brochure for exact multiple',
    guaranteed: true,
    ropOnDeath: true,
    hasLumpSum: true,
    dataSource: 'Verified — ABSLI Official Brochure',
    dataDate: '2025',
    uniqueFeature: 'Income starts from Year 1 — no deferment period. Guaranteed level income for the full Policy Term. Guaranteed lump sum also payable at maturity, in addition to the yearly income.',
    pitch: 'Pay for a limited number of years, then receive guaranteed level income every single year for the rest of the Policy Term — plus a guaranteed lump sum at maturity. 100% Non-Par, fully guaranteed.',
    keyHighlights: [
      'Income starts from Year 1 of the policy — zero deferment',
      'Level (fixed) income — same guaranteed amount every year, no fluctuation',
      'Income period runs for the full Policy Term',
      'Guaranteed lump sum paid at maturity, in addition to yearly income already received',
      'Return of Premium on death — guaranteed'
    ],
    tag: 'Income from Year 1'
  },
  {
    id: 'icici',
    company: 'ICICI Pru',
    companyFull: 'ICICI Prudential Life Insurance',
    plan: 'GIFT Select', entryAge: '18 – 60 yrs',
    uin: '105N223V05',
    type: 'Non-Linked, Non-Participating',
    isBase: false,
    productUrl: 'https://www.iciciprulife.com/protection-saving-plans/icici-pru-gift-select.html',
    brochureUrl: 'https://www.iciciprulife.com/',
    calcUrl: 'https://www.iciciprulife.com/protection-saving-plans/icici-pru-gift-select.html',
    incomeFrom: 'Year 2',
    incomeType: 'Increasing — grows at a fixed 5% compounding rate every year (this 5% rate is fixed regardless of age/premium/PPT/PT chosen)',
    incomePeriod: 'Years 2 through end of Policy Term',
    cashbackFeature: true, cashbackNote: 'Instant Cashback paid at policy issuance (Year 0) — amount depends on premium chosen, not a fixed figure',
    saMultiple: 'Varies by age band and PPT — refer brochure for exact multiple',
    guaranteed: true,
    ropOnDeath: true,
    hasLumpSum: true, lumpSumNote: '100% of premiums paid, returned at maturity',
    dataSource: 'Verified — ICICI Pru Official Brochure',
    dataDate: '2025',
    uniqueFeature: 'Instant Cashback paid immediately at policy issuance — before any premium payment cycle completes. Income from Year 2 onward grows at a fixed 5% compounding rate every year. Full return of premiums at maturity.',
    pitch: 'Get an Instant Cashback the moment your policy is issued, then guaranteed income from Year 2 that grows every year — plus full return of premiums at maturity.',
    keyHighlights: [
      'Instant Cashback at policy issuance — income starts before Year 1 even completes',
      'Income from Year 2 increases at a fixed 5% compounding rate annually',
      'Income continues through the end of the Policy Term',
      '100% of premiums paid returned as maturity benefit',
      'Return of Premium on death — guaranteed'
    ],
    tag: 'Instant Cashback at Issuance'
  },
  {
    id: 'axis',
    company: 'Axis Max Life',
    companyFull: 'Axis Max Life Insurance',
    plan: 'Smart Wealth Advantage Guarantee Plan (Early Wealth Variant)', entryAge: '91 days – 65 yrs (18 yrs min if Policy Continuance Benefit opted)',
    uin: '104N124V17',
    type: 'Non-Linked, Non-Participating',
    isBase: false,
    productUrl: 'https://www.axismaxlife.com/investment-plans/smart-wealth-advantage-guarantee-plan',
    brochureUrl: 'https://www.axismaxlife.com/',
    calcUrl: 'https://www.axismaxlife.com/investment-plans/smart-wealth-advantage-guarantee-plan',
    incomeFrom: 'Year 1 / Month 1 (Early Wealth Variant only — other variants of this plan defer income until after PPT)',
    incomeType: 'Level (fixed amount every year)',
    incomePeriod: 'Equal to Policy Term',
    ppt: '5, 6, 7, 8, 10, 12, 15, or 20 yrs (Early Wealth Variant)',
    policyContinuanceBenefit: true, policyContinuanceBenefitNote: 'On death, nominee continues receiving Income/Survival and Maturity Benefits without paying future premiums — available on Early Wealth Variant',
    accidentalDeathBenefit: true, accidentalDeathBenefitNote: 'Inbuilt Additional Accidental Death Benefit equal to 50% of Sum Assured on Death (non-single-premium variants)',
    saMultiple: 'Varies by age band and PPT — refer brochure for exact multiple',
    guaranteed: true,
    ropOnDeath: true,
    hasLumpSum: true,
    dataSource: 'Verified — Axis Max Life Official Product Page',
    dataDate: '2026',
    uniqueFeature: '5 plan variants under one product — Early Wealth Variant is the one offering income from Year 1/Month 1. Optional Policy Continuance Benefit ensures nominee keeps receiving all future income/maturity benefits without paying further premiums if the life assured dies. Inbuilt Accidental Death Benefit adds 50% extra on accidental death.',
    pitch: 'Choose the Early Wealth Variant for guaranteed income from Month 1 — with the option to add Policy Continuance Benefit so your family keeps receiving the full benefit even if you\'re not there to pay future premiums.',
    keyHighlights: [
      'Early Wealth Variant: income starts from Year 1 / Month 1 — flexible PPT from 5 to 20 years',
      'Optional Policy Continuance Benefit — future income/maturity benefits continue for nominee without further premium payment on death',
      'Inbuilt Accidental Death Benefit — additional 50% of Sum Assured on Death',
      '5 total plan variants available under this one product for different income-timing needs',
      'Return of Premium on death — guaranteed'
    ],
    tag: 'Policy Continuance Benefit Option'
  }
];
