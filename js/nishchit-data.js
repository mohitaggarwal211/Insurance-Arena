// ══════════════════════════════════════════════════════
// NISHCHIT AAYUSH — NON-PAR GUARANTEED INCOME COMPARISON
// Benchmark: Age 35 | Male | ₹1L AP | PPT 10 | PT 20 | 0 Deferment
// ══════════════════════════════════════════════════════

const NISHCHIT_BENCHMARK = {
  age: 35, gender: 'Male', ap: 100000, ppt: 10, pt: 20, deferment: 0,
  totalPremium: 1000000,
  incomeStart: 'Year 1 (0 deferment)',
  note: 'All figures from official benefit illustrations. Non-par plans offer fully guaranteed returns — no bonus element.'
};

const NISHCHIT_PLANS = [
  {
    id: 'absli',
    company: 'ABSLI',
    companyFull: 'Aditya Birla Sun Life Insurance',
    plan: 'Nishchit Aayush Plan',
    uin: 'Verify from current policy document',
    type: 'Non-Linked, Non-Participating',
    isBase: true,
    productUrl: 'https://lifeinsurance.adityabirlacapital.com/savings-plans/absli-nishchit-aayush-plan/',
    brochureUrl: 'https://lifeinsurance.adityabirlacapital.com/',
    incomeFrom: 'Year 1',
    incomeType: 'Level (fixed)',
    annualIncome: 35050,
    incomePeriod: 20,
    totalIncome: 701000,          // 35050 × 20
    lumpsum: 1100000,             // Maturity lump sum
    totalReturn: 1801000,         // 7,01,000 + 11,00,000
    irr: 5.51,
    sa: 1100000,                  // 10× AP
    guaranteed: true,
    ropOnDeath: true,
    dataSource: 'Verified — ABSLI Official Brochure',
    dataDate: '2025',
    uniqueFeature: 'Income from Year 1 (0 deferment). Guaranteed level income for 20 years. Large lump sum at maturity. 10× SA life cover.',
    pitch: 'Pay for 10 years, get ₹35,050 every year for 20 years + ₹11 lakh lump sum — fully guaranteed.',
    tag: 'Highest Total Return'
  },
  {
    id: 'icici',
    company: 'ICICI Pru',
    companyFull: 'ICICI Prudential Life Insurance',
    plan: 'GIFT Select (105N223V05)',
    uin: '105N223V05',
    type: 'Non-Linked, Non-Participating',
    isBase: false,
    productUrl: 'https://www.iciciprulife.com/protection-saving-plans/icici-pru-gift-select.html',
    brochureUrl: 'https://www.iciciprulife.com/',
    calcUrl: 'https://www.iciciprulife.com/protection-saving-plans/icici-pru-gift-select.html',
    incomeFrom: 'Year 2',
    incomeType: 'Increasing (5% compounding per year)',
    annualIncomeY2: 18180,        // Year 2 income (start)
    incomePeriod: 19,             // Years 2–20
    cashback: 50000,              // Instant cashback at inception
    totalIncome: 555199,          // ~19 payments increasing at 5%
    lumpsum: 1000000,             // 100% of premiums at maturity
    totalReturn: 1605199,         // 50K + 5.55L + 10L
    irr: 4.13,
    sa: 1000000,                  // 10× AP
    guaranteed: true,
    ropOnDeath: true,
    illustrationBasis: 'Female, Age 35 (male rate may differ marginally)',
    dataSource: 'Verified — ICICI Pru Official Brochure',
    dataDate: '2025',
    note: '⚠️ Illustration is for female (Age 35). Male rate may differ slightly. Income is increasing at 5% compounding — not level. Instant cashback of ₹50,000 reduces future income slightly.',
    uniqueFeature: 'Income from Year 2. Instant cashback ₹50,000 on policy issuance. Increasing income at 5% compounding. 100% maturity benefit.',
    pitch: 'Get ₹50,000 cashback immediately, then increasing income from Year 2 + full premiums back at end.',
    tag: 'Instant Cashback'
  },
  {
    id: 'axis',
    company: 'Axis Max Life',
    companyFull: 'Axis Max Life Insurance',
    plan: 'Smart Wealth Advantage Guarantee (Early Wealth, PT 20)',
    uin: '104N124V17',
    type: 'Non-Linked, Non-Participating',
    isBase: false,
    productUrl: 'https://www.axismaxlife.com/investment-plans/smart-wealth-advantage-guarantee-plan',
    brochureUrl: 'https://www.axismaxlife.com/',
    calcUrl: 'https://www.axismaxlife.com/investment-plans/smart-wealth-advantage-guarantee-plan',
    incomeFrom: 'Year 1',
    incomeType: 'Level (fixed)',
    annualIncome: null,           // PENDING
    incomePeriod: 20,
    lumpsum: null,                // PENDING
    totalReturn: null,            // PENDING
    irr: null,                    // PENDING
    sa: null,                     // PENDING
    guaranteed: true,
    ropOnDeath: true,
    pending: true,
    dataSource: 'Illustration pending from Mohit',
    dataDate: null,
    note: 'PT 20 + PPT 10 + Early Wealth + income from Year 1. Public illustration only available for PT 30. PT 20 data to be provided.',
    uniqueFeature: 'Income from Year 1 / Month 1. Multiple policy term options. Strong brand — Axis Max Life.',
    pitch: 'Income from the very first year — Axis Max Life guaranteed wealth plan.',
    tag: 'Income from Month 1'
  }
  ];

const NISHCHIT_IRR_NOTE = 'IRR calculated on advance annual premium (t=0 to t=9). Income received at year-end (arrears). Lump sum at t=20. ICICI GIFT Select: cashback at t=0 treated as income; increasing income computed at 5% compounding.';
