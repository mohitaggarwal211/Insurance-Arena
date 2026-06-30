// ══════════════════════════════════════════════════════
// ABSLI ASSURED SAVINGS PLAN — COMPETITOR COMPARISON
// Type: Non-Linked, Non-Participating, Savings (Lumpsum)
// ══════════════════════════════════════════════════════

const SAVINGS_PLANS = [
  {
    company: 'ABSLI', plan: 'Assured Savings Plan', uin: '109N134V13',
    isBase: true, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://lifeinsurance.adityabirlacapital.com/savings-plans/absli-assured-savings-plan/',
    brochure: 'https://lifeinsurance.adityabirlacapital.com/uploads/Assured_Savings_Plan_V13_Brochure_3e10c8b905.pdf',
    entryAge: '30 days–65 yrs (Single Life) | 18–50 yrs (Joint Life)',
    maturityAge: 85, jointLife: true, loan: true,
    ppt: 'Single Pay | 5–12 yrs', pt: 'Up to 35 yrs',
    guaranteedAdditions: true, loyaltyAdditions: true, booster: false,
    rop: true, maturityBenefit: true, incomeBenefit: false,
    riders: 'Accidental Death Benefit Rider Plus | Critical Illness Rider | Surgical Care Rider | Hospital Care Rider',
    deathBenefit: 'SA on Death + Loyalty Additions. After 25th yr: Higher of SA or GMB + Loyalty Additions',
    uniqueFeature: 'Joint Life Protection for spouse (20% SA coverage). Staggered Death Benefit as 5-yr instalments option. Enhanced GMB for Option 2 SA multiple. Loyalty Additions boost corpus year on year.',
    pitch: 'ABSLI Assured Savings Plan — guaranteed lumpsum at maturity with Loyalty Additions that grow corpus every year. Joint Life Protection available for spouse. Policy Term up to 35 years.',
    keyHighlights: [
      'Guaranteed Maturity Benefit (GMB): Lumpsum at end of policy term as % of total premiums payable',
      'Loyalty Additions: Accrue as % of total premiums paid each year after PPT until maturity — boosts corpus',
      'Joint Life Protection Option: Spouse covered at 20% of SA under same policy (Limited Pay only)',
      'Staggered Death Benefit: Nominee can receive death benefit over 5 years (annual or monthly instalments)',
      'Enhanced GMB: Option 2 SA multiple gives 4-7% additional GMB on top of standard GMB',
      'Flexible terms: Single Pay / 5-12 Pay | Policy Term 5-35 years | Min entry age 30 days'
    ],
    verification: 'Verified — Official Brochure V13'
  },
  {
    company: 'Tata AIA', plan: 'Fortune Guarantee Plus', uin: '110N158V11',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.tataaia.com/life-insurance-plans/savings-solutions/fortune-guarantee-plus.html',
    brochure: 'https://www.tataaia.com/content/dam/tataaialifeinsurancecompanylimited/pdf/download-centre/english/brochures/Fortune-Guarantee-Plus-Brochure.pdf',
    entryAge: '18 – 60 yrs', maturityAge: null, jointLife: null, loan: null,
    ppt: 'Single Pay | Limited Pay | Regular Pay', pt: 'Flexible — varies by variant and PPT',
    guaranteedAdditions: null, loyaltyAdditions: null, booster: null,
    rop: true, maturityBenefit: true, incomeBenefit: true,
    riders: 'Critical Illness Riders (Major CI, Cardiac, Cancer) — optional',
    deathBenefit: 'Higher of 7× Annualized Premium or 105% of total premiums paid',
    uniqueFeature: 'Income period up to 45 years post-maturity. CI accelerator (income starts on CI diagnosis). Commutation option.',
    pitch: 'Short-term saving, long-term income — guaranteed income for up to 45 years with CI protection built in.',
    keyHighlights: [
      'Two options at inception: Endowment (lumpsum at maturity) or Long Term Income (income for up to 45 years post-maturity)',
      'CI Accelerator: Income automatically starts on diagnosis of Critical Illness — even before maturity date',
      'Commutation Option: Surrender future income instalments anytime for a discounted lumpsum',
      '100% Non-Linked, Non-Participating — all benefits fully guaranteed',
      'Multiple PPT and Policy Term combinations for flexible planning',
      'Riders available for additional protection'
    ],
    verification: 'Partially Verified — Active product confirmed'
  },
  {
    company: 'HDFC Life', plan: 'Sanchay Fixed Maturity Plan', uin: '101N142V08',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.hdfclife.com/savings-plans/sanchay-fixed-maturity-plan',
    brochure: 'https://www.hdfclife.com/content/dam/hdfclifeinsurancecompany/products-page/brochure-pdf/Sanchay-Fixed-Maturity-Plan.pdf',
    entryAge: '30 days – 65 yrs', maturityAge: null, jointLife: true, loan: true,
    ppt: 'Single Pay | Limited Pay | Regular Pay', pt: 'Up to 40 years',
    guaranteedAdditions: null, loyaltyAdditions: null, booster: null,
    rop: null, maturityBenefit: true, incomeBenefit: false,
    riders: 'Waiver of Premium Rider | Accidental Death Benefit Rider',
    deathBenefit: 'Higher of DBM × Premium or 10× Annual Premium or 105% of total premiums paid',
    uniqueFeature: 'HDFC brand trust. Fixed maturity structure. Simple guaranteed lumpsum.',
    pitch: 'Invest once or for limited years — get a guaranteed lumpsum at maturity with full life cover.',
    verification: 'Partially Verified — URL and UIN confirmed'
  },
  ,
  {
    company: 'ICICI Pru', plan: 'Assured Savings Insurance Plan', uin: '105N144V13',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active (replacement)',
    url: 'https://www.iciciprulife.com/money-back-endowment-plans/assured-savings-plan.html',
    brochure: 'https://www.iciciprulife.com/content/dam/icicipru/brochures/ICICI%20Pru%20Assured%20Savings%20Insurance%20Plan.pdf',
    entryAge: '3 – 55 yrs (PT 10/15) | 3 – 60 yrs (PT 16/20)', maturityAge: null, jointLife: false, loan: true,
    ppt: '5 | 7 | 8 yrs', pt: '10 | 12 | 15 | 16 | 20 yrs',
    guaranteedAdditions: null, loyaltyAdditions: null, booster: null,
    rop: null, maturityBenefit: true, incomeBenefit: false,
    riders: 'Waiver of Premium Rider | Critical Illness Rider',
    deathBenefit: 'Higher of SA + accrued GAs or GMB + accrued GAs or 105% of premiums paid',
    uniqueFeature: 'ICICI Pru brand strength. Non-Par non-linked guaranteed returns.',
    pitch: 'Secure your savings goal with guaranteed returns and life protection.',
    replacementNote: '⚠️ Original product (ICICI Pru Guaranteed Wealth Protector) was a ULIP — wrong category. This is the correct Non-Linked Non-Par replacement.',
    verification: 'Replaced — URL confirmed, brochure access needed'
  },
  {
    company: 'SBI Life', plan: 'Smart Platina Assure', uin: '111N126V07',
    isBase: false, type: 'Non-Linked Non-Par (Endowment)', status: 'Active',
    url: 'https://www.sbilife.co.in/en/individual-life-insurance/traditional/smart-platina-assure',
    brochure: 'https://www.sbilife.co.in/smart-platina-assure-v08-brochure',
    entryAge: '30 days – 60 yrs', maturityAge: null, jointLife: false, loan: true,
    ppt: '6 yrs (PT 12) | 7 yrs (PT 15) | 10 yrs (PT 20)', pt: '12 | 15 | 20 years',
    guaranteedAdditions: true, loyaltyAdditions: false, booster: false,
    rop: true, maturityBenefit: true, incomeBenefit: false,
    riders: 'SBI Life Accident Benefit Rider available',
    deathBenefit: 'Higher of 10× AP or 105% of premiums paid + accrued Guaranteed Additions',
    uniqueFeature: 'SBI brand trust. Non-linked Non-Par with Guaranteed Additions. Simple lumpsum structure. Available online.',
    pitch: 'Guaranteed growth via additions — invest for limited years, receive guaranteed sum at maturity.',
    verification: 'Partially Verified — death benefit formula and GAs confirmed'
  },
  {
    company: 'Axis Max Life', plan: 'Smart Wealth Plan', uin: '104N116V15',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active (replacement)',
    url: 'https://www.axismaxlife.com/investment-plans/smart-wealth-plan',
    brochure: 'https://www.axismaxlife.com/static-page/assets/homepage/104N116V15_Smart%20Wealth%20Plan_Prospectus.pdf',
    entryAge: '0 – 65 yrs (varies by variant)', maturityAge: null, jointLife: true, loan: false,
    ppt: '6 | 8 | 10 | 12 yrs | Single Pay (Variant 4)', pt: 'Varies by variant and PPT',
    guaranteedAdditions: null, loyaltyAdditions: null, booster: null,
    rop: null, maturityBenefit: true, incomeBenefit: false,
    riders: 'Critical Illness and Disability Rider | Accidental Death Benefit Rider',
    deathBenefit: 'Higher of 7× Annualized Premium or 105% of total premiums paid or SA on death',
    uniqueFeature: 'Axis Max Life — India\'s leading private insurer. Guaranteed returns plan.',
    pitch: 'Axis Max Life guarantee — invest for short term, receive fully guaranteed wealth at maturity.',
    replacementNote: '⚠️ Company renamed from Max Life to Axis Max Life. Product "Smart Guaranteed Wealth Plan" not found — replaced with Smart Wealth Plan (104N116V15).',
    verification: 'Replaced — company name change noted'
  },
  {
    company: 'Kotak Life', plan: 'Assured Savings Plan', uin: '107N081V09',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.kotaklife.com/savings-plan/kotak-assured-savings-plan',
    brochure: 'https://www.kotaklife.com/savings-plan/kotak-assured-savings-plan',
    entryAge: '3 – 60 yrs', maturityAge: 75, jointLife: false, loan: true,
    ppt: '5 | 6 | 7 | 10 yrs', pt: 'Flexible — up to maturity age 75 yrs',
    guaranteedAdditions: null, loyaltyAdditions: null, booster: null,
    rop: null, maturityBenefit: true, incomeBenefit: null,
    riders: 'Kotak Term Benefit | Accidental Death | Permanent Disability | Critical Illness Plus',
    deathBenefit: 'Higher of 11× AP (age <50) or 7× AP (age ≥50) or 105% of premiums paid + accrued GYAs',
    uniqueFeature: 'Kotak brand strength. Non-Par non-linked guaranteed returns. Multiple rider options.',
    pitch: 'Kotak guaranteed savings — invest for short term, receive assured lumpsum with life cover.',
    verification: 'Partially Verified — Active product confirmed'
  },
  {
    company: 'Canara HSBC', plan: 'iSelect Guaranteed Future', uin: '136N081V07',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active (replacement)',
    url: 'https://www.canarahsbclife.com/savings-and-investment-plans/iselect-guaranteed-future',
    brochure: 'https://www.canarahsbclife.com/savings-and-investment-plans/iselect-guaranteed-future',
    entryAge: '0 – 65 yrs (varies by plan option)', maturityAge: null, jointLife: false, loan: true,
    ppt: 'Single Pay | Limited Pay (multiple options)', pt: 'Flexible — varies by PPT chosen',
    guaranteedAdditions: true, loyaltyAdditions: null, booster: null,
    rop: null, maturityBenefit: true, incomeBenefit: null,
    riders: 'Payor Premium Protection Cover (waiver of premium on policyholder death) | Accidental Death Benefit',
    deathBenefit: 'Payor Premium Protection: SA on death + premiums waived',
    uniqueFeature: '5 plan options. Guaranteed Additions in last 5 policy years. Payor Premium Protection. Canara HSBC partnership brand.',
    pitch: 'More options, one plan — choose your savings goal with guaranteed returns.',
    replacementNote: '⚠️ Original product (Guaranteed Savings Plan 136N066V02) WITHDRAWN — replaced with iSelect Guaranteed Future.',
    verification: 'Replaced — Original product withdrawn per official Canara HSBC withdrawn list'
  }
  ];

// ══════════════════════════════════════════════════════
// ABSLI ASSURED INCOME PLUS — COMPETITOR COMPARISON
// Type: Non-Linked, Non-Participating, Guaranteed Income
// ══════════════════════════════════════════════════════

const INCOME_PLANS = [
  {
    company: 'ABSLI', plan: 'Assured Income Plus Plan', uin: '109N127V19',
    isBase: true, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://lifeinsurance.adityabirlacapital.com/savings-plans/absli-assured-income-plus-plan/',
    brochure: 'https://lifeinsurance.adityabirlacapital.com/uploads/ABSLI_Assured_Income_Plus_V17_Brochure_Web_Version_da75c6e902.pdf',
    entryAge: '1 – 60 yrs (varies by PPT)', maturityAge: null, jointLife: null, loan: true,
    ppt: '8 yrs (case study — verify all options)', pt: '9 yrs cited (verify) + Benefit Payout Period',
    incomePeriods: ['20 years', '25 years', '30 years'],
    planOptions: ['Income Only Benefit', 'Income with Return of Premium'],
    loyaltyAdditions: true, booster: false,
    incomeBenefit: true, increasingIncome: false,
    incomePayout: 'Annual / Half-Yearly / Quarterly / Monthly',
    riders: 'Verify specific riders from current brochure',
    deathBenefit: 'SA on Death (lumpsum to nominee). Min = Higher of 10× AP or 105% premiums paid.',
    uniqueFeature: 'Guaranteed income for 20, 25 or 30 years with Loyalty Additions enhancing income each year. Commutation option: take lumpsum of future income anytime after policy term. Income continues to nominee after death.',
    pitch: 'Pay for 5-12 years, receive guaranteed income for 20, 25 or 30 years. Loyalty Additions increase income each year. Commutation option lets you take lumpsum of future income anytime.',
    keyHighlights: [
      'Two Options: Income Only Benefit or Income with Lumpsum Benefit (choose at inception)',
      'Guaranteed income for 20, 25 or 30 years (annual, semi-annual, quarterly or monthly)',
      'Loyalty Additions: Enhance Income Benefit each year during payout period (50-65% of annual income)',
      'Commutation Option: Take discounted lumpsum of all future income anytime after policy term',
      'Income continues to nominee after death during benefit payout period',
      'Guaranteed Lumpsum Benefit at end of income period under Income + Lumpsum option (55-60% of total premiums, enhanced 100%)'
    ],
    verification: 'Verified — Official product page + V17 brochure'
  },
  {
    company: 'Tata AIA', plan: 'Fortune Guarantee Plus (Income Variant)', uin: '110N158V11',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.tataaia.com/life-insurance-plans/savings-solutions/fortune-guarantee-plus.html',
    brochure: 'https://www.tataaia.com/content/dam/tataaialifeinsurancecompanylimited/pdf/download-centre/english/brochures/Fortune-Guarantee-Plus-Brochure.pdf',
    ppt: 'Single / Limited / Regular Pay', incomePeriods: ['20–45 years (post-PT)'],
    planOptions: ['Income Variant', 'Lumpsum Variant'],
    incomeBenefit: true, increasingIncome: null, rop: true,
    uniqueFeature: 'Longest income period in market — up to 45 years post-PT. CI accelerator: income starts on CI diagnosis during policy term. RoP at end of income period regardless of survival.',
    pitch: 'Short premium, lifetime-like income — up to 45 years with CI protection and RoP.',
    verification: 'Partially Verified'
  },
  {
    company: 'HDFC Life', plan: 'Sanchay Plus', uin: '101N134V27',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.hdfclife.com/savings-plans/sanchay-plus',
    brochure: 'https://www.hdfclife.com/savings-plans/sanchay-plus',
    ppt: 'Single Pay | 5 | 6 | 10 | 12 yrs',
    incomePeriods: ['10 or 12 years (Guaranteed Income)', 'Till age 99 (Life Long Income)', '25–30 years (Long-Term Income with RoP)'],
    planOptions: ['Guaranteed Maturity', 'Guaranteed Income (10/12 yr)', 'Life Long Income (till 99)', 'Long-Term Income (25-30 yr)'],
    incomeBenefit: true, increasingIncome: false, guaranteedAdditions: true,
    uniqueFeature: '4 options in one plan. Life Long Income (till age 99) is rare in market. Guaranteed Additions enhance corpus. HDFC brand trust.',
    pitch: 'One plan, four ways to receive money — choose income for 10 years, 25 years, or for life.',
    verification: 'Verified — UIN and 4 options confirmed'
  },
  {
    company: 'ICICI Pru', plan: 'Guaranteed Income For Tomorrow (GIFT)', uin: '105N182V13',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.iciciprulife.com/protection-saving-plans/icici-pru-guaranteed-income-for-tomorrow.html',
    brochure: 'https://www.iciciprulife.com/retirement-plans/guaranteed-income-for-tomorrow-gift.html',
    calcUrl: 'https://www.iciciprulife.com/protection-saving-plans/icici-pru-guaranteed-income-for-tomorrow-calculator.html',
    ppt: '10 yrs (confirmed) | multiple options',
    planOptions: ['Early Income (from Year 2)', 'Income', 'Lump Sum'],
    incomeBenefit: true, increasingIncome: false, loan: true,
    uniqueFeature: 'Early Income variant: income starts from 2nd policy year. GIFT Select (105N223V05) is newer with increasing income option.',
    pitch: 'Invest today, get guaranteed income from year 2 — or choose when you want the income to start.',
    note: 'GIFT Select (105N223V05) is the newer version with increasing income at 5% compounding and instant cashback.',
    verification: 'Verified — UIN 105N182V13 confirmed'
  },
  {
    company: 'Canara HSBC', plan: 'iSelect Guaranteed Future Plus', uin: '136N098V04',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active (replacement)',
    url: 'https://www.canarahsbclife.com/savings-and-investment-plans/iselect-guaranteed-future-plus',
    brochure: 'https://www.canarahsbclife.com/savings-and-investment-plans/iselect-guaranteed-future-plus',
    ppt: 'Single Pay | Limited Pay | Regular Pay (multiple options)',
    planOptions: ['4 plan options including income and lumpsum'],
    incomeBenefit: true, rop: null,
    uniqueFeature: '4 plan options. Accidental Death Benefit. Payor Premium Protection Cover.',
    pitch: 'iSelect flexibility — choose your benefit structure with guaranteed returns and life protection.',
    replacementNote: '⚠️ Original (Guaranteed Income4Life 136N074V01) WITHDRAWN — replaced with iSelect Guaranteed Future Plus.',
    verification: 'Replaced — Original withdrawn per official Canara HSBC list'
  },
  {
    company: 'Bajaj Life', plan: 'Guaranteed Income Goal Plan', uin: '116N157V10',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.bajajallianzlife.com/savings-plans',
    brochure: 'https://www.bajajlifeinsurance.com/content/dam/balic-web/pdf/ppt-pdf/GIG.pdf',
    ppt: '5 | 7 | 8 | 10 | 12 yrs (varies by PT)', planOptions: ['Income Benefit', 'Lumpsum Benefit'],
    incomeBenefit: true, increasingIncome: false,
    uniqueFeature: 'Income and lumpsum variants. Extended Life Cover option beyond policy term.',
    pitch: 'Bajaj Life guaranteed income — choose income or lumpsum at inception.',
    note: '⚠️ "Bajaj Allianz Guaranteed Wealth Goal" not found on official site. Closest: Bajaj Allianz Life Guaranteed Income Goal.',
    verification: 'Unable to Verify — product name mismatch'
  },
  {
    company: 'SBI Life', plan: 'Smart Platina Plus', uin: '111N133V06',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.sbilife.co.in/en/individual-life-insurance/traditional/smart-platina-plus',
    brochure: 'https://www.sbilife.co.in/documents/20118/909506/SBI+Life+-+Smart+Platina+Plus+Brochure_V03.pdf/c27931bf-62c1-4c2e-6d02-31a403116686',
    ppt: '10 | 15 yrs',
    planOptions: ['Life Income (stops on death)', 'Guaranteed Income (continues during payout period)'],
    incomeBenefit: true, rop: true, loan: true,
    maturityBenefit: '110% of Total Premiums Paid at end of Policy Term',
    uniqueFeature: '110% return of premiums at maturity (not just 100%). Two income options. Option to change payout frequency once before payout period. SBI brand trust.',
    pitch: 'Invest for short term, get guaranteed income + 110% of premiums back at end.',
    verification: 'Verified — UIN, 110% maturity, income options confirmed'
  },
  {
    company: 'Axis Max Life', plan: 'Smart Wealth Income Plan', uin: '104N120V04',
    isBase: false, type: '⚠️ Non-Linked PARTICIPATING (bonus not guaranteed)', status: 'Active',
    url: 'https://www.axismaxlife.com/investment-plans/smart-wealth-income-plan',
    brochure: 'https://www.axismaxlife.com/investment-plans/smart-wealth-plan',
    ppt: '6 | 8 | 10 | 12 yrs (varies by variant)',
    planOptions: ['Early Income', 'Early Income with Guaranteed Money Back (3 GMBs)', 'Deferred Income'],
    incomeBenefit: true, increasingIncome: false,
    incomePeriods: ['25 years or till end of Policy Term'],
    uniqueFeature: '3 income variants. Policy Continuance Benefit (premiums waived on death, income continues). Participating — bonus upside. Company now Axis Max Life.',
    pitch: 'Start receiving income earlier — 3 flexible variants with Policy Continuance Benefit.',
    typeWarning: true,
    verification: 'Partially Verified — UIN confirmed; PARTICIPATING noted'
  },
  {
    company: 'Kotak Life', plan: 'Guaranteed Fortune Builder', uin: '107N128V09',
    isBase: false, type: 'Non-Linked Non-Par', status: 'Active',
    url: 'https://www.kotaklife.com/savings-plan/kotak-guaranteed-fortune-builder',
    brochure: 'https://www.kotaklife.com/assets/images/uploads/insurance-plans/Kotak_Guaranteed_Fortune_Builder-Brochure_(Online).pdf',
    ppt: '10 | 12 | 15 yrs',
    incomeBenefit: true, increasingIncome: null,
    riders: 'Kotak Term Benefit | Accidental Death | Permanent Disability | Life Guardian | Critical Illness Plus',
    uniqueFeature: 'Non-Linked Non-Par guaranteed income. Multiple rider options. Kotak brand trust.',
    pitch: 'Kotak guaranteed income — flexible income with comprehensive rider options.',
    verification: 'Verified — UIN, URL, rider list confirmed'
  }
  ];
