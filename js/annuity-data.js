// Data verified: July 2026 (monthly review protocol)
// ANNUITY DATA — Insurance Arena
// Base plan: ABSLI Guaranteed Annuity Plus
// Compared against: 14 competitor plans
// ══════════════════════════════════════════════

// ── STATUS CODES ──
// 'yes'    = Available (equivalent or comparable)
// 'no'     = Not available in this plan
// 'sim'    = Similar but structurally different — see note
// 'unique' = ABSLI unique feature; no competitor matches
// 'na'     = Not applicable (plan type mismatch e.g. deferred-only)

// ── ABSLI'S 10 OPTIONS — Reference Rows ──
const ANNUITY_OPTION_ROWS = [
  {
    id: 'opt1a',
    group: 'OPT 1',
    label: 'Life Annuity — Level',
    desc: 'Fixed annuity payable for life. No corpus returned on death.',
    category: 'Life Annuity'
  },
  {
    id: 'opt1b',
    group: 'OPT 1',
    label: 'Life Annuity — Increasing +3% p.a.',
    desc: 'Annuity increases at 3% simple interest per year. Inflation shield.',
    category: 'Life Annuity'
  },
  {
    id: 'opt1c',
    group: 'OPT 1',
    label: 'Life Annuity — Increasing +5% p.a.',
    desc: 'Annuity increases at 5% simple interest per year. Higher growth.',
    category: 'Life Annuity'
  },
  {
    id: 'opt2',
    group: 'OPT 2',
    label: 'Annuity Certain (5/10/15/20 yr) + Life',
    desc: 'Guaranteed payout for chosen certain period even if annuitant dies; continues for life thereafter.',
    category: 'Certain Period'
  },
  {
    id: 'opt3',
    group: 'OPT 3',
    label: 'Life + Return of Balance PP',
    desc: 'Purchase price minus total annuity already paid returned to nominee. Protects unspent corpus.',
    category: 'Corpus Protection'
  },
  {
    id: 'opt4',
    group: 'OPT 4',
    label: 'Joint Life — 50% Annuity to Secondary',
    desc: 'On primary annuitant\'s death, secondary (spouse) receives 50% of annuity for life. No ROP.',
    category: 'Joint Life'
  },
  {
    id: 'opt5a',
    group: 'OPT 5',
    label: 'Life + 100% Return of Purchase Price',
    desc: '100% of purchase price returned to nominee on death. Full corpus protection.',
    category: 'Full ROP'
  },
  {
    id: 'opt5b',
    group: 'OPT 5',
    label: 'Life + 75% Return of Purchase Price',
    desc: '75% of purchase price returned to nominee on death.',
    category: 'Partial ROP'
  },
  {
    id: 'opt5c',
    group: 'OPT 5',
    label: 'Life + 50% Return of Purchase Price',
    desc: '50% of purchase price returned to nominee on death.',
    category: 'Partial ROP'
  },
  {
    id: 'opt6',
    group: 'OPT 6',
    label: '★ CI Enhancement (+50% Annuity) + ROP',
    desc: 'On first of 42 CIs or Accidental Permanent Disability (before age 70): annuity INCREASES by 50% for life. 100% ROP on death. ABSLI UNIQUE: only insurer that enhances the annuity amount on CI.',
    category: 'CI Cover',
    unique: true
  },
  {
    id: 'opt7',
    group: 'OPT 7',
    label: '★ ROP at Age 80 to Annuitant (Living Benefit)',
    desc: '100% purchase price returned to the ANNUITANT on surviving age 80 — not to nominee, not on death. Annuity continues even after this ROP. RARE in market.',
    category: 'Living Benefit',
    unique: true
  },
  {
    id: 'opt8',
    group: 'OPT 8',
    label: '★ Joint Life — Split ROP (50% + 50%)',
    desc: '50% of purchase price paid to SURVIVING annuitant at first death; remaining 50% paid to NOMINEE at last death. ABSLI UNIQUE: no competitor offers split ROP structure.',
    category: 'Joint Life',
    unique: true
  },
  {
    id: 'opt9',
    group: 'OPT 9',
    label: 'Deferred Annuity + Guaranteed Additions + ROP',
    desc: 'Pay now, receive annuity after deferment period (1–15 yrs). Guaranteed Additions = 2% of annual annuity per month during deferment. Limited Pay (2–10 yr PPT) available.',
    category: 'Deferred'
  },
  {
    id: 'opt10',
    group: 'OPT 10',
    label: 'NPS Family Income (Cascade)',
    desc: 'NPS subscribers only. On annuitant\'s death: purchase price used to buy annuity for dependent mother → dependent father → surviving children → nominee, in order.',
    category: 'NPS Special'
  }
];

// ── ANNUITY PLANS DATA ──
const ANNUITY_PLANS = [

  // ─────────────────────────────────────────────
  // 1. ABSLI — BASE PLAN
  // ─────────────────────────────────────────────
  {
    id: 'absli',
    company: 'ABSLI',
    companyFull: 'Aditya Birla Sun Life Insurance',
    plan: 'Guaranteed Annuity Plus',
    uin: '109N132V17',
    isBase: true,
    uniqueFeature: '15+ annuity variants — widest selection in market. QROPS eligible (NRI pension transfer). Top-Up facility to increase corpus anytime. Group annuity for corporates.',
    type: 'Immediate + Deferred',
    totalOptions: 10,
    limitedPay: true,
    limitedPayNote: 'Option 9 only | PPT 2–10 yrs',
    jointLife: true,
    topUp: true,
    loan: 'Options 5, 6, 7, 8, 9, 10',
    groupPolicy: true,
    qrops: true,
    minPremium: '₹1,50,000 (Single Pay)',
    entryAge: 'Immediate: 40–90 yrs | Deferred: 40–75 yrs',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://lifeinsurance.adityabirlacapital.com/retirement-and-pension-plans/absli-guaranteed-annuity-plus/',
    brochureUrl: 'https://lifeinsurance.adityabirlacapital.com/uploads/ABSLI_Guaranteed_Annuity_Plus_V17_Brochure_Web_Version_e8e39d1903.pdf',
    benchmarkNote: 'Age 60 | ₹10L | Life Annuity: ~₹87,314–89,496/yr (older versions; check current calculator)',
    benchmark60: null, // actual current rate — check calculator
    // Options matrix
    options: {
      opt1a: 'yes', opt1b: 'yes', opt1c: 'yes',
      opt2: 'yes',   opt3: 'yes',
      opt4: 'yes',   opt5a: 'yes', opt5b: 'yes', opt5c: 'yes',
      opt6: 'unique', opt7: 'unique', opt8: 'unique',
      opt9: 'yes',   opt10: 'yes'
    },
    optionNotes: {
      opt6: 'Annuity enhanced by 50% on first of 42 specified CIs or Accidental Permanent Disability (before age 70) + 100% ROP on death. ONLY insurer to enhance the annuity — all others give ROP on CI but stop or reduce the annuity.',
      opt7: '100% purchase price returned to the LIVING ANNUITANT on surviving age 80. Annuity continues even after this payment. Not a death benefit — a living benefit.',
      opt8: '50% of purchase price to surviving annuitant at first death + remaining 50% to nominee at last death. Unique split structure found in no other Indian insurer.',
      opt10: 'NPS cascade: after annuitant\'s death, purchase price flows to buy fresh annuity for dependent mother → dependent father → then returns to nominee.'
    }
  },

  // ─────────────────────────────────────────────
  // 2. LIC — Jeevan Akshay VII (Plan 857)
  // ─────────────────────────────────────────────
  {
    id: 'lic-jak',
    company: 'LIC',
    companyFull: 'Life Insurance Corporation of India',
    plan: 'Jeevan Akshay VII',
    planNo: 'Plan No. 857',
    uin: '512N337V04',
    uniqueFeature: 'Sovereign guarantee — Government of India backed. 10 annuity variants. Highest brand trust in India. Widest physical distribution (1 lakh+ agents). IRDAI-mandated minimum annuity rates.',
    type: 'Immediate Only',
    totalOptions: 10,
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: false,
    loan: 'Available (3 months post-policy)',
    groupPolicy: false,
    qrops: false,
    minPremium: '₹1,00,000',
    entryAge: '30–85 yrs (Option F: up to 100 yrs)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://licindia.in/Products/Pension-Plans/LIC-s-Jeevan-Akshay-VII',
    brochureUrl: 'https://licindia.in/Products/Pension-Plans/LIC-s-Jeevan-Akshay-VII',
    benchmarkNote: 'Age 60 | ₹10L | Life Annuity (Option A): ₹92,650/yr · Life + ROP (Option F): ~₹59,900/yr',
    benchmark60: { lifeAnnuity: 92650, lifeROP: 59900, dataDate: 'Feb 2024' },
    options: {
      opt1a: 'yes',
      opt1b: 'yes',  // Option G = +3%
      opt1c: 'no',   // No 5% option; offers 3% only
      opt2: 'yes',   // Options B/C/D/E = 5/10/15/20 yr certain
      opt3: 'no',    // No return of balance option
      opt4: 'yes',   // Option H = 50% to spouse
      opt5a: 'yes',  // Option F = 100% ROP
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',    // No ROP at age 80 in Jeevan Akshay VII
      opt8: 'no',
      opt9: 'na',    // Separate product (New Jeevan Shanti) — not this plan
      opt10: 'no'
    },
    optionNotes: {
      opt1b: 'Option G: Annuity increasing at 3% simple interest p.a. (same as ABSLI)',
      opt2: 'Options B (5yr), C (10yr), D (15yr), E (20yr) — all four certain periods available. Same as ABSLI.',
      opt4: 'Option H (50% to spouse) + Option I (100% to spouse) + Option J (100% to spouse + 100% ROP) — three joint life variants.',
      opt9: 'LIC\'s deferred annuity is a separate plan: New Jeevan Shanti (Plan 758). Single pay only.'
    }
  },

  // ─────────────────────────────────────────────
  // 3. LIC — Smart Pension Plan 879 (Current Flagship)
  // ─────────────────────────────────────────────
  {
    id: 'lic-smart',
    company: 'LIC',
    companyFull: 'Life Insurance Corporation of India',
    plan: 'Smart Pension Plan',
    planNo: 'Plan No. 879',
    uin: '512N386V01',
    uniqueFeature: 'Deferred + Immediate annuity in one. QROPS eligible. Flexible deferral period to time annuity start. Accumulation phase with guaranteed additions before payout begins.',
    badge: 'New Feb 2025',
    type: 'Immediate Only',
    totalOptions: '10+',
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: false,
    loan: 'Available (liquidity options)',
    groupPolicy: true,
    qrops: false,
    minPremium: '₹1,00,000',
    entryAge: '18–65/100 yrs (varies by option)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://licindia.in/Products/Pension-Plans/Smart-Pension-Plan',
    brochureUrl: 'https://licindia.in/Products/Pension-Plans/Smart-Pension-Plan',
    benchmarkNote: 'Current (Feb 2025). Rate data not yet in public domain. Check LIC calculator for exact rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',
      opt1b: 'yes',   // C1 = +3% p.a.
      opt1c: 'sim',   // C2 = +6% p.a. (similar concept, different rate)
      opt2: 'yes',    // Annuity Certain with guaranteed period
      opt3: 'yes',    // Return of Balance option (Option D)
      opt4: 'yes',    // Joint life with 50% to secondary
      opt5a: 'yes',   // 100% ROP
      opt5b: 'sim',   // E1/E2: partial ROP options at age 75 or 80 (similar concept)
      opt5c: 'sim',   // Various partial ROP percentages via E-series
      opt6: 'no',     // No CI enhancement feature
      opt7: 'sim',    // E3/E4: ROP at age 80 options exist, but to nominee/different structure
      opt8: 'no',
      opt9: 'na',     // New Jeevan Shanti is the deferred product
      opt10: 'yes'    // NPS subscriber provision
    },
    optionNotes: {
      opt1c: 'LIC Smart Pension offers +6% p.a. increasing annuity (C2), not +5% like ABSLI. Higher escalation rate.',
      opt5b: 'E-series offers partial ROP at age 75 (50% or 100%) and age 80 (50% or 100%), plus E5 = 5% of PP annually from age 76–95. Different structure from ABSLI\'s straightforward 75% or 50% ROP on death.',
      opt7: 'LIC Smart Pension Option E3 (50% at 80) and E4 (100% at 80) are similar. Key difference: ABSLI returns PP to the LIVING annuitant; annuity continues. LIC\'s E-series structure details pending official brochure verification.',
      opt10: 'NPS subscriber provision available; cascade-to-parents feature confirmation pending LIC official documentation.',
      opt9: 'Deferred annuity is covered by LIC\'s separate New Jeevan Shanti (Plan 758).'
    }
  },

  // ─────────────────────────────────────────────
  // 4. LIC — New Jeevan Shanti 758 (Deferred Only)
  // ─────────────────────────────────────────────
  {
    id: 'lic-njs',
    company: 'LIC',
    companyFull: 'Life Insurance Corporation of India',
    plan: 'New Jeevan Shanti',
    planNo: 'Plan No. 758',
    uin: '512N338V08',
    uniqueFeature: 'Lock in today annuity rates for future payouts — deferred annuity. Guaranteed income enhancement each year during deferral. Joint life with last survivor option.',
    type: 'Deferred Only',
    totalOptions: 2,
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: false,
    loan: 'Not available',
    groupPolicy: false,
    qrops: false,
    minPremium: '₹1,50,000',
    entryAge: '30–79 yrs',
    deferment: '1–5 yrs (Vesting age max 80)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://licindia.in/Products/Pension-Plans/LIC-New-Jeevan-Shanti',
    brochureUrl: 'https://licindia.in/Products/Pension-Plans/LIC-New-Jeevan-Shanti',
    benchmarkNote: 'DEFERRED PLAN ONLY. Not directly comparable for immediate annuity benchmark.',
    benchmark60: null,
    options: {
      opt1a: 'yes',  // Deferred single life annuity for life
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'no',
      opt3: 'no',
      opt4: 'yes',   // Joint life deferred annuity
      opt5a: 'no',   // Death benefit ≥ PP, but no separate ROP option — death benefit = higher of PP or PP+GA-annuity paid
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',
      opt8: 'no',
      opt9: 'sim',   // This IS a deferred plan, but Single Pay only (no limited pay). Guaranteed Additions accrue.
      opt10: 'no'
    },
    optionNotes: {
      opt1a: 'Two options: Single Life deferred annuity (Option 1) and Joint Life deferred annuity (Option 2). Level annuity only.',
      opt4: 'Option 2: Joint Life deferred annuity — payable while at least one annuitant alive.',
      opt5a: 'No explicit ROP option. Death benefit = higher of [110% PP] or [PP + GA – annuity paid]. Not a clean ROP.',
      opt9: 'SINGLE PAY ONLY — no limited pay option. Deferment up to 5 years. Guaranteed Additions accrue monthly during deferment. ABSLI allows limited pay (PPT 2–10 yrs) for its Option 9.'
    }
  },

  // ─────────────────────────────────────────────
  // 5. HDFC Life — Pension Guaranteed Plan
  // ─────────────────────────────────────────────
  {
    id: 'hdfc-pgp',
    company: 'HDFC Life',
    companyFull: 'HDFC Life Insurance Co. Ltd.',
    plan: 'Pension Guaranteed Plan',
    uin: '101N118V12',
    uniqueFeature: 'Deferred annuity with Guaranteed Additions during accumulation — corpus grows before payout. Flexibility to choose payout start date. HDFC brand trust with strong solvency.',
    type: 'Immediate + Deferred',
    totalOptions: 3,
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: true,
    loan: 'Not specified',
    groupPolicy: true,
    qrops: false,
    minPremium: 'Min annuity based',
    entryAge: 'Immediate: 30 yrs+ | Deferred: 45 yrs+',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.hdfclife.com/retirement-and-pension-plans/pension-guaranteed-plan',
    brochureUrl: 'https://www.hdfclife.com/retirement-and-pension-plans/pension-guaranteed-plan',
    benchmarkNote: 'Very limited product (3 options). Check HDFC Life New Immediate Annuity Plan for wider options.',
    benchmark60: null,
    options: {
      opt1a: 'yes',   // Immediate Life Annuity
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'no',
      opt3: 'no',
      opt4: 'yes',    // Joint life basis available for all options
      opt5a: 'yes',   // Immediate Life Annuity with ROP
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',
      opt8: 'no',
      opt9: 'sim',    // Deferred Life Annuity with ROP (1–10 yr deferment, Single Pay only)
      opt10: 'no'
    },
    optionNotes: {
      opt1a: 'Option 1: Immediate Life Annuity (level, no ROP). Available Single and Joint Life.',
      opt5a: 'Option 2: Immediate Life Annuity with Return of Purchase Price. Single and Joint Life.',
      opt9: 'Option 3: Deferred Life Annuity with ROP (1–10 yr deferment). Single Pay only. No limited pay. No Guaranteed Additions during deferment unlike ABSLI.',
      opt4: 'All 3 plan options available for both Single and Joint Life basis.'
    }
  },

  // ─────────────────────────────────────────────
  // 6. HDFC Life — New Immediate Annuity Plan
  // ─────────────────────────────────────────────
  {
    id: 'hdfc-niap',
    company: 'HDFC Life',
    companyFull: 'HDFC Life Insurance Co. Ltd.',
    plan: 'New Immediate Annuity Plan',
    uin: '101N084V27',
    uniqueFeature: 'Immediate annuity from day one. Joint Life with Last Survivor option. Return of Purchase Price variants available. Systematic withdrawal facility for extra liquidity.',
    type: 'Immediate Only',
    totalOptions: '~8',
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: false,
    loan: 'Not available',
    groupPolicy: false,
    qrops: false,
    minPremium: '~₹1,15,875 (age 50, 8.63% rate)',
    entryAge: '18–99 yrs (most options; 85 yrs for CI option)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.hdfclife.com/retirement-and-pension-plans/new-immediate-annuity-plan',
    brochureUrl: 'https://www.hdfclife.com/retirement-and-pension-plans/new-immediate-annuity-plan',
    benchmarkNote: 'Age 60 | ₹10L | Life Annuity: ₹89,600/yr · Life + ROP: 5.7–6.4% (₹57K–64K/yr) — May 2025 data',
    benchmark60: { lifeAnnuity: 89600, lifeROP: '57,000–64,000', dataDate: 'May 2025' },
    options: {
      opt1a: 'yes',
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'no',     // No annuity certain option
      opt3: 'yes',    // Life Annuity with Return of Purchase Price in parts (balance)
      opt4: 'yes',    // Joint life with 50% to secondary
      opt5a: 'yes',   // Life + 100% ROP on death
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'sim',    // Life + ROP on CI (6 CIs) or death — annuity ceases on CI
      opt7: 'no',
      opt8: 'no',
      opt9: 'no',     // No deferred option in this plan
      opt10: 'no'
    },
    optionNotes: {
      opt3: 'Life Annuity with Return of Purchase Price in parts (remaining balance of PP returned at death).',
      opt4: 'Joint Life variants: 50% annuity to secondary (with and without ROP), 100% annuity to secondary (with and without ROP) — 4 joint life options.',
      opt6: 'Life Annuity with ROP on first of 6 critical illnesses (cancer, heart attack, CABG, kidney failure, stroke, major organ transplant) or death, before age 85. Key difference from ABSLI: annuity CEASES on CI (PP returned); ABSLI ENHANCES the annuity by 50% and it continues. Only 6 CIs vs ABSLI\'s 42.'
    }
  },

  // ─────────────────────────────────────────────
  // 7. ICICI Pru — Guaranteed Pension Plan
  // ─────────────────────────────────────────────
  {
    id: 'icici',
    company: 'ICICI Pru',
    companyFull: 'ICICI Prudential Life Insurance',
    plan: 'Guaranteed Pension Plan',
    uin: '105N181V04',
    uniqueFeature: 'Immediate + Deferred annuity options. ICICI group financial strength. Multiple annuity variants with joint life. iProtect Smart integration for holistic retirement.',
    type: 'Immediate + Deferred',
    totalOptions: '~7',
    limitedPay: true,
    limitedPayNote: 'Available for deferred option',
    jointLife: true,
    topUp: true,
    loan: 'Available (80% SV)',
    groupPolicy: true,
    qrops: false,
    minPremium: '₹50,000 (Income/Early Income) | ₹12,000 (Lump Sum)',
    entryAge: '45–100 yrs (varies by option)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.iciciprulife.com/retirement-pension-plans/guaranteed-pension-plan-calculator.html',
    brochureUrl: 'https://www.iciciprulife.com/content/dam/icicipru/brochures/ICICI_Pru_Guaranteed_Pension_Plan.pdf',
    benchmarkNote: 'Rate data not publicly available. Use ICICI Pru calculator for current rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'yes',    // Annuity certain period options available
      opt3: 'yes',    // Return of balance PP option
      opt4: 'yes',    // Joint life options
      opt5a: 'yes',   // 100% ROP on death
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'sim',    // Life + ROP on 7 CIs or death — annuity ceases on CI (not enhanced)
      opt7: 'sim',    // 50% return of PP at age 80 — ICICI specific variant
      opt8: 'no',
      opt9: 'yes',    // Deferred annuity with limited pay available
      opt10: 'sim'    // NPS annuity option available, cascade specifics unconfirmed
    },
    optionNotes: {
      opt6: 'Life Annuity with ROP on first of 7 critical illnesses or death (before age 80). Annuity ceases on CI. ABSLI has 42 CIs and ENHANCES the annuity instead of stopping it.',
      opt7: '50% Return of Purchase Price at age 80 (ICICI variant). ABSLI returns 100% to the LIVING annuitant; ICICI returns 50%. Annuity treatment post-return also differs.',
      opt9: 'Deferred annuity available with limited/regular pay. Guaranteed Additions accrue during deferment.',
      opt10: 'NPS annuity provision available; specific cascade-to-parents structure pending verification against ABSLI\'s Option 10.'
    }
  },

  // ─────────────────────────────────────────────
  // 8. SBI Life — Saral Pension
  // ─────────────────────────────────────────────
  {
    id: 'sbi',
    company: 'SBI Life',
    companyFull: 'SBI Life Insurance Co. Ltd.',
    plan: 'Saral Pension',
    uin: '111N130V03',
    uniqueFeature: 'Simplest IRDAI-mandated annuity — only 2 variants. Mandatory Return of Purchase Price on death (inbuilt, no premium loading). SBI State Bank trust and branch network.',
    badge: 'IRDAI Standard',
    type: 'Immediate Only',
    totalOptions: 2,
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: false,
    loan: 'Yes (max 50% of annual annuity)',
    groupPolicy: false,
    qrops: false,
    minPremium: 'Min annuity based',
    entryAge: '40–80 yrs',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.sbilife.co.in/en/individual-life-insurance/traditional/saral-pension',
    brochureUrl: 'https://www.sbilife.co.in/en/individual-life-insurance/traditional/saral-pension',
    benchmarkNote: 'IRDAI-standardized plan with only 2 options. SBI also has other annuity plans with more options.',
    benchmark60: null,
    options: {
      opt1a: 'no',    // No level annuity without ROP — both options have 100% ROP
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'no',
      opt3: 'no',
      opt4: 'yes',    // Joint Life Last Survivor Annuity with 100% ROP
      opt5a: 'yes',   // Life Annuity with 100% ROP — Option 1
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',
      opt8: 'no',
      opt9: 'no',
      opt10: 'no'
    },
    optionNotes: {
      opt1a: 'Saral Pension includes 100% ROP by default in both options. No pure level annuity without ROP available.',
      opt5a: 'Option 1: Life Annuity with Return of 100% of Purchase Price on death.',
      opt4: 'Option 2: Joint Life Last Survivor Annuity with 100% ROP on death of last survivor.',
      general: 'This is IRDAI\'s standardized immediate annuity plan — all insurers must offer it. Very limited feature set. For wider options, check SBI Life\'s other annuity plans.'
    }
  },

  // ─────────────────────────────────────────────
  // 9. Tata AIA — Smart Annuity Plan
  // ─────────────────────────────────────────────
  {
    id: 'tata',
    company: 'Tata AIA',
    companyFull: 'Tata AIA Life Insurance Co. Ltd.',
    plan: 'Smart Annuity Plan',
    uin: '110N150V08',
    uniqueFeature: 'AIA Group global insurance backing. Guaranteed annuity with joint life and RoP options. Competitive annuity rates backed by strong international reinsurer relationships.',
    type: 'Immediate + Deferred',
    totalOptions: '~6',
    limitedPay: true,
    limitedPayNote: 'Limited + Regular Pay for deferred options',
    jointLife: true,
    topUp: true,
    loan: 'Available (deferred: 80% SV)',
    groupPolicy: false,
    qrops: false,
    minPremium: 'Min annuity based',
    entryAge: 'Immediate: 45–85 yrs | Deferred: 45–84 yrs',
    deferment: 'Up to 10 years',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.tataaia.com/life-insurance-plans/retirement-and-pension-solutions/smart-annuity-plan.html',
    brochureUrl: 'https://www.tataaia.com/life-insurance-plans/retirement-and-pension-solutions/smart-annuity-plan.html',
    benchmarkNote: 'Rate data not publicly available. Use Tata AIA calculator for current rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',
      opt1b: 'no',    // Increasing annuity options details unconfirmed from public sources
      opt1c: 'no',
      opt2: 'no',     // No annuity certain from available data
      opt3: 'no',
      opt4: 'yes',    // Joint life available
      opt5a: 'yes',   // Life + ROP option available
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',
      opt8: 'no',
      opt9: 'yes',    // Deferred options (Guaranteed Additions I & II with Single/Limited/Regular Pay)
      opt10: 'no'
    },
    optionNotes: {
      opt1b: 'Tata AIA Fortune Guarantee Pension Plan (separate plan) offers deferred variants with Guaranteed Additions. Smart Annuity Plan\'s increasing annuity option details not confirmed in public domain.',
      opt9: 'Deferred Life Annuity available as Guaranteed Additions (GA-I and GA-II) options. GA-I: GA = 1/12 of yearly annuity per month. GA-II: GA = 1/12 of 6% of total premiums paid per month. Limited and Regular Pay available.'
    }
  },

  // ─────────────────────────────────────────────
  // 10. Bajaj Life — Guaranteed Pension Goal II
  // ─────────────────────────────────────────────
  {
    id: 'bajaj',
    company: 'Bajaj Life',
    companyFull: 'Bajaj Life Insurance Ltd.',
    plan: 'Guaranteed Pension Goal II',
    uin: '116N187V07',
    uniqueFeature: 'Bajaj Finserv conglomerate trust. Deferred + Immediate annuity in one plan. Top-Up facility. Competitive annuity rates with Bajaj Allianz General risk management expertise.',
    type: 'Immediate + Deferred',
    totalOptions: '9 Immediate + Deferred',
    limitedPay: true,
    limitedPayNote: 'Regular/Limited Pay up to 12 yrs (deferred)',
    jointLife: true,
    topUp: true,
    loan: 'Not available',
    groupPolicy: false,
    qrops: false,
    minPremium: 'Min annuity based',
    entryAge: '30–85 yrs',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.bajajlifeinsurance.com/retirement-pension-plans/guaranteed-pension-goal.html',
    brochureUrl: 'https://www.bajajlifeinsurance.com/retirement-pension-plans/guaranteed-pension-goal.html',
    benchmarkNote: 'Rate data not publicly available. Use Bajaj Life calculator for current rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',  // Option A
      opt1b: 'no',   // No increasing annuity variant confirmed
      opt1c: 'no',
      opt2: 'no',    // No annuity certain confirmed
      opt3: 'no',    // No return of balance confirmed
      opt4: 'yes',   // Option E: Joint Life with 50% annuity to spouse | Option I: 50% to spouse
      opt5a: 'yes',  // Option B: Life + ROP (flexible 50-100%)
      opt5b: 'yes',  // ROP range 50-100% customer choice — 75% possible
      opt5c: 'yes',  // 50% ROP available
      opt6: 'no',
      opt7: 'sim',   // Option G: ROP on death OR survival at 25 policy years or age 85 (whichever later)
      opt8: 'no',
      opt9: 'yes',   // Deferred option available with Regular/Limited Pay
      opt10: 'no'
    },
    optionNotes: {
      opt5a: 'Option B: Life Annuity with ROP on death — uniquely the ROP% can be chosen from 50% to 100% (customer selects at inception). Under Single Pay deferred option, ROP is mandatorily 100%.',
      opt7: 'Option G: Life Annuity with ROP on death OR on survival at policy anniversary after 25 policy years or age 85 (whichever is later). Similar concept to ABSLI\'s Option 7 but: trigger is age 85 (vs ABSLI\'s age 80), and requires 25 policy years minimum. ABSLI gives 100% PP at exactly age 80, annuity continues. Bajaj: survival-based PP at later of 25yr/age 85 on a single-pay policy.',
      opt4: 'Joint Life options include 50% and 100% annuity to spouse variants with and without ROP.',
      opt9: 'Deferred annuity available with Regular/Limited Pay up to 12 years PPT. Deferment 1–10 years.'
    }
  },

  // ─────────────────────────────────────────────
  // 11. Kotak — Assured Pension
  // ─────────────────────────────────────────────
  {
    id: 'kotak',
    company: 'Kotak Life',
    companyFull: 'Kotak Mahindra Life Insurance',
    plan: 'Assured Pension',
    uin: '107N123V10',
    uniqueFeature: 'Multiple annuity options with joint life. Kotak banking ecosystem — easy integration with Kotak savings and investment portfolio. Competitive returns with strong solvency ratio.',
    type: 'Immediate + Deferred',
    totalOptions: '8 Immediate + 2 Deferred = 10',
    limitedPay: true,
    limitedPayNote: 'Limited/Regular Pay for deferred Option 7 only',
    jointLife: true,
    topUp: true,
    loan: 'Available (deferred only)',
    groupPolicy: true,
    qrops: true,
    minPremium: 'Min ₹1,000/month annuity',
    entryAge: '0–99 yrs (Immediate) | 0–70 yrs (Deferred)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.kotaklife.com/retirement-and-pension-plans/kotak-assured-pension',
    brochureUrl: 'https://www.kotaklife.com/retirement-and-pension-plans/kotak-assured-pension',
    benchmarkNote: 'Rate data not publicly available. Use Kotak Life calculator for current rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',  // Lifetime Income (level)
      opt1b: 'yes',  // Lifetime Income with Annual Increase (3%)
      opt1c: 'no',   // No 5% option
      opt2: 'yes',   // Lifetime Income with Term Guarantee (5/10 yr guaranteed period)
      opt3: 'no',    // Return of balance not specifically confirmed
      opt4: 'yes',   // Last Survivor Lifetime Income (Joint Life)
      opt5a: 'yes',  // Lifetime Income with Cash-Back on Death (100% ROP)
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'sim',   // Lifetime Income with Cash-Back on Death or Critical Illness (ROP on CI — annuity ceases)
      opt7: 'no',    // No specific age-80 ROP option in immediate options
      opt8: 'no',
      opt9: 'yes',   // Deferred annuity options (2 variants) with Limited/Regular Pay
      opt10: 'no'
    },
    optionNotes: {
      opt2: 'Lifetime Income with Term Guarantee: annuity guaranteed for chosen period (e.g. 10 years) even if annuitant dies; continues for life thereafter. E.g. Age 45, ₹10L: ₹63,100/year for min 10 years then for life.',
      opt6: 'Lifetime Income with Cash-Back on Death or Critical Illness (Option 6b, max entry age 80). Key difference: on CI, annuity STOPS and 100% PP returned. ABSLI enhances annuity by 50% and continues it. CI trigger age: ABSLI before 70, Kotak before 80.',
      opt9: 'Two deferred variants available. Guaranteed Additions accrue during deferment. Limited/Regular Pay available. Deferment 1–10 years.'
    }
  },

  // ─────────────────────────────────────────────
  // 12. PNB MetLife — Immediate Annuity Plan
  // ─────────────────────────────────────────────
  {
    id: 'pnb',
    company: 'PNB MetLife',
    companyFull: 'PNB MetLife India Insurance Co.',
    plan: 'Immediate Annuity Plan',
    uin: '117N095V10',
    uniqueFeature: 'MetLife global reinsurance backing + PNB bank distribution. Simple immediate annuity with joint life option. Ideal for PNB account holders seeking single-window retirement solution.',
    type: 'Immediate Only',
    totalOptions: '~8',
    limitedPay: false,
    limitedPayNote: 'Single Pay only',
    jointLife: true,
    topUp: false,
    loan: 'Not available',
    groupPolicy: false,
    qrops: false,
    minPremium: '₹3,00,000',
    entryAge: 'Min 40 yrs | Max varies by option',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.pnbmetlife.com/insurance-plans/retirement/immediate-annuity-plan.html',
    brochureUrl: 'https://www.pnbmetlife.com/insurance-plans/retirement/immediate-annuity-plan.html',
    benchmarkNote: 'Rate data partially available. Check PNB MetLife calculator for exact rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',
      opt1b: 'yes',  // Increasing annuity at 3% available
      opt1c: 'no',   // No 5% option
      opt2: 'yes',   // Annuity Certain period option
      opt3: 'yes',   // Return of balance / decreasing protection option
      opt4: 'yes',   // Joint life options
      opt5a: 'yes',  // 100% ROP on death
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',
      opt8: 'no',
      opt9: 'no',    // Deferred product is Grand Assured Income Plan (separate)
      opt10: 'no'
    },
    optionNotes: {
      opt1b: 'Increasing annuity option available at 3% p.a.',
      opt2: 'Annuity Certain for a specified period + life thereafter.',
      opt3: 'Life Annuity with Return of Balance of Purchase Price option available.',
      opt9: 'PNB MetLife has a separate deferred plan: Grand Assured Income Plan with limited pay options.'
    }
  },

  // ─────────────────────────────────────────────
  // 13. Axis Max Life — Guaranteed Lifetime Income Plan
  // ─────────────────────────────────────────────
  {
    id: 'axis',
    company: 'Axis Max Life',
    companyFull: 'Axis Max Life Insurance Ltd.',
    plan: 'Guaranteed Lifetime Income Plan',
    uin: '104N076V22',
    uniqueFeature: 'Highest CSR among private insurers (99.65%). Immediate + Deferred annuity. Multiple joint life options. Max group ecosystem integration for comprehensive retirement planning.',
    type: 'Immediate + Deferred',
    totalOptions: 6,
    limitedPay: false,
    limitedPayNote: 'Single Pay only (Deferred available)',
    jointLife: true,
    topUp: false,
    loan: 'Not available',
    groupPolicy: false,
    qrops: true,
    minPremium: 'Min ₹12,000/yr annuity',
    entryAge: '0–85 yrs (Immediate) | up to 85 yrs (Deferred)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.axismaxlife.com/retirement-plans/guaranteed-lifetime-income-plan',
    brochureUrl: 'https://www.axismaxlife.com/retirement-plans/guaranteed-lifetime-income-plan',
    benchmarkNote: 'Rate data not publicly available. Use Axis Max Life calculator for current rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',  // Single Life Immediate Annuity for life (with death benefit = 100% ROP)
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'no',    // No annuity certain option
      opt3: 'no',
      opt4: 'yes',   // Joint Life Immediate Annuity (with and without death benefit)
      opt5a: 'yes',  // Single Life Immediate Annuity with Death Benefit (100% PP to nominee)
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'no',
      opt7: 'no',
      opt8: 'no',
      opt9: 'yes',   // Single and Joint Life Deferred Annuity (with 105% PP death benefit)
      opt10: 'no'
    },
    optionNotes: {
      opt1a: 'Note: All immediate annuity options in GLIP include 100% ROP on death as default. No pure level annuity without death benefit is available (unlike ABSLI Option 1).',
      opt5a: 'Immediate Life Annuity with Death Benefit: 100% of single premium paid to nominee on death.',
      opt4: 'Joint Life Immediate Annuity with Death Benefit + Joint Life without death benefit (annuity ceases on last survivor\'s death).',
      opt9: 'Single and Joint Life Deferred Annuity — Single Pay. Guaranteed Additions accrue. Min 105% of premiums on death during deferment.'
    }
  },

  // ─────────────────────────────────────────────
  // 14. Canara HSBC — Pension4Life Plan
  // ─────────────────────────────────────────────
  {
    id: 'canara-p4l',
    company: 'Canara HSBC',
    companyFull: 'Canara HSBC Life Insurance',
    plan: 'Pension4Life Plan',
    uin: '136N071V07',
    uniqueFeature: 'HSBC global insurance expertise + Canara Bank trust. NPS integration — purchase annuity directly via NPS exit corpus. Multiple annuity variants with joint life protection.',
    type: 'Immediate + Deferred',
    totalOptions: 7,
    limitedPay: false,
    limitedPayNote: 'Single Pay (except Smart Guaranteed Pension)',
    jointLife: true,
    topUp: false,
    loan: 'Available (deferred: after SV acquired)',
    groupPolicy: false,
    qrops: false,
    minPremium: '₹2,00,000',
    entryAge: 'Option 4/6: 45–80 yrs | Others: No max specified',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.canarahsbclife.com/retirement-plans/pension-for-life-plan',
    brochureUrl: 'https://www.canarahsbclife.com/retirement-plans/pension-for-life-plan',
    benchmarkNote: 'Rate data not publicly available. Use Canara HSBC calculator for current rates.',
    benchmark60: null,
    options: {
      opt1a: 'yes',  // Option 1: Immediate Life Annuity
      opt1b: 'sim',  // Increasing annuity available (% not confirmed from public sources)
      opt1c: 'no',
      opt2: 'no',    // No annuity certain option confirmed
      opt3: 'no',
      opt4: 'yes',   // Option 5: Joint Life Annuity with ROP
      opt5a: 'yes',  // Option 2: Life Annuity with ROP
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'sim',   // Option 4: Life Annuity with ROP on CI (7 CIs)/ATPD/Death — annuity ceases on CI
      opt7: 'no',
      opt8: 'no',
      opt9: 'yes',   // Option 6: Deferred Life Annuity with ROP
      opt10: 'yes'   // Option 7: NPS Family Income — same structure as ABSLI Option 10
    },
    optionNotes: {
      opt1b: 'Increasing annuity option mentioned in plan description but escalation rate not confirmed from official brochure in public domain.',
      opt6: 'Option 4: Immediate Life Annuity with ROP on CI (7 CIs: cancer, MI, CABG, kidney failure, stroke, organ transplant, paralysis) or ATPD or death, max entry age 80. Annuity CEASES on CI/ATPD (PP returned). ABSLI has 42 CIs and ENHANCES the annuity by 50% — it continues.',
      opt10: 'Option 7: NPS Family Income — same cascade structure as ABSLI Option 10. Available to NPS subscribers. Purchase price cascades to dependent mother → father → nominee after annuitant\'s death.',
      opt9: 'Option 6: Deferred Life Annuity with ROP. Single Pay only — no limited pay in Pension4Life itself (see Smart Guaranteed Pension for limited pay deferred).'
    }
  },

  // ─────────────────────────────────────────────
  // 15. Canara HSBC — Smart Guaranteed Pension
  // ─────────────────────────────────────────────
  {
    id: 'canara-sgp',
    company: 'Canara HSBC',
    companyFull: 'Canara HSBC Life Insurance',
    plan: 'Smart Guaranteed Pension',
    uin: '136N086V03',
    uniqueFeature: 'Deferred annuity with Guaranteed Additions — accumulate and grow corpus before payouts. Lock in today annuity rates for future income. Bank-backed reliability with HSBC global standards.',
    badge: 'Deferred + LP',
    type: 'Deferred Only',
    totalOptions: 2,
    limitedPay: true,
    limitedPayNote: 'PPT 4–10 years',
    jointLife: false,
    topUp: false,
    loan: 'Not available',
    groupPolicy: false,
    qrops: false,
    minPremium: 'Min annuity based',
    entryAge: '30–80 yrs',
    deferment: 'Deferred only (GA = 6% p.a. on total premiums)',
    payout: 'Annual / Half-Yearly / Quarterly / Monthly',
    calcUrl: 'https://www.canarahsbclife.com/retirement-plans/smart-guaranteed-pension',
    brochureUrl: 'https://www.canarahsbclife.com/retirement-plans/smart-guaranteed-pension',
    benchmarkNote: 'DEFERRED PLAN ONLY. Limited Pay 4–10 years with 6% p.a. Guaranteed Additions.',
    benchmark60: null,
    options: {
      opt1a: 'yes',  // Option 1: Single Life Annuity with Return of Premiums
      opt1b: 'no',
      opt1c: 'no',
      opt2: 'no',
      opt3: 'no',
      opt4: 'no',    // No joint life in Smart Guaranteed Pension
      opt5a: 'yes',  // Option 1: Single Life Annuity with Return of Premiums (=100% ROP on death post-deferment)
      opt5b: 'no',
      opt5c: 'no',
      opt6: 'sim',   // Option 2: Annuity with ROP on CI/ATPD/Death (7 CIs)
      opt7: 'no',
      opt8: 'no',
      opt9: 'sim',   // This IS a deferred plan with LP, but GA = 6% p.a. flat (not 2%/mth like ABSLI)
      opt10: 'no'
    },
    optionNotes: {
      opt5a: 'Option 1: Single Life Annuity with Return of Premiums — all premiums paid (excluding taxes) returned to nominee on death.',
      opt6: 'Option 2: Single Life Annuity with ROP on Critical Illness (7 CIs) or ATPD or death. On CI/ATPD: 100% of premiums paid returned; annuity ceases.',
      opt9: 'LIMITED PAY DEFERRED PLAN: PPT 4–10 years. Guaranteed Additions = 6% p.a. on total premiums paid during PPT (vs ABSLI: 2% per month = 24% p.a. of the ANNUITY amount — different calculation base). No joint life option in this plan.'
    }
  }
];

// ── BENCHMARK RATES DATA ──
const ANNUITY_BENCHMARK = {
  params: 'Age 60 | Male | ₹10,00,000 Single Pay | Annual Mode',
  note: 'Annuity rates change periodically. Figures are for reference only — use each company\'s official calculator for current rates. Rates shown are for Life Annuity (no ROP) unless stated.',
  confirmed: [
    {
      company: 'LIC',
      plan: 'Jeevan Akshay VII (Plan 857)',
      lifeAnnuity: '₹92,650',
      lifeAnnuityRate: '9.265%',
      lifeROP: '~₹59,900',
      lifeROPRate: '~5.99%',
      dataDate: 'Feb 2024',
      source: 'freefincal.com — LIC official calculator data'
    },
    {
      company: 'HDFC Life',
      plan: 'New Immediate Annuity Plan (101N084V27)',
      lifeAnnuity: '₹89,600',
      lifeAnnuityRate: '8.96%',
      lifeROP: '₹57,000–64,000',
      lifeROPRate: '5.7–6.4%',
      dataDate: 'May 2025',
      source: 'Policybazaar.com article'
    },
    {
      company: 'ABSLI',
      plan: 'Guaranteed Annuity Plus (V17 — current)',
      lifeAnnuity: '~₹87,314–89,496',
      lifeAnnuityRate: '~8.73–8.95%',
      lifeROP: 'Use calculator',
      lifeROPRate: '—',
      dataDate: '2022–23 (older versions)',
      source: 'ABSLI website illustrations (V07, V09). Current V17 rates may differ.'
    }
  ],
  limitedPayBenchmark: {
    params: 'Age 60 | Male | ₹1,00,000/yr | PPT 5 yrs | Deferment 5 yrs | Annual Mode',
    note: 'Annuity commences at age 65. Limited pay rates not available in public domain for most companies. Use official calculators. ABSLI Option 9 illustration: Age 45, ₹1L/month (×12), PPT5, Deferment 5yr → ₹4,01,923/yr. Scale to ₹1L/yr is approximate only.'
  }
};
