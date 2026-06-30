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
      'Guaranteed level income every year for 20 years',
      'Guaranteed lump sum at maturity',
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
      'Instant Cashback at policy issuance — reduces future income marginally',
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
  },


  // ── SAVINGS PLANS ────────────────────────────────────────
  'sav_ABSLI': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed lump sum at maturity','Joint Life Protection — spouse covered at 20% of Sum Assured','Loyalty Additions boost maturity benefit at end of term','Flexible PPT: 5 to 12 years (8 options)','Riders: Accidental Death, CI, Surgical Care, Hospital Care'], whySuit: 'Choose ABSLI Assured Savings for guaranteed savings with joint life protection and loyalty additions.', bestFor: 'Working individuals who want guaranteed savings with spouse cover and rider flexibility.', limitations: ['Lump sum only — no income stream','Loyalty Additions paid at maturity only'], scoreData: { flexibility:8, protection:9, income:0, riders:9, loan:9, jointLife:10 } },
  'sav_Tata AIA': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed returns','Income for up to 45 years — one of longest income periods','Critical Illness protection option available','Return of Premium option at end of income period','Choose Savings or Income payout at inception'], whySuit: 'Choose Tata AIA Fortune Guarantee Plus for flexibility between savings and long-term income.', bestFor: 'Individuals who want to choose between lump sum and long-term income at inception.', limitations: ['Savings and income are same plan — features vary by option chosen'], scoreData: { flexibility:8, protection:7, income:4, riders:6, loan:5, jointLife:6 } },
  'sav_HDFC Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed lump sum at maturity','Single Pay or Limited Pay options for flexibility','Guaranteed Additions to enhance corpus during policy term','HDFC Life — largest private life insurer by AUM in India','Simple, transparent, fixed maturity structure'], whySuit: 'Choose HDFC Life Sanchay Fixed Maturity for a straightforward guaranteed lump sum from the largest private insurer.', bestFor: 'Customers who prefer simplicity and strong brand backing.', limitations: ['Limited PPT options vs competitors','Fewer riders'], scoreData: { flexibility:5, protection:7, income:0, riders:4, loan:5, jointLife:5 } },
  'sav_Bajaj Life': { keyHighlights: ['Participating plan — guaranteed amount plus potential bonus upside','Flexibility between lump sum and income at inception','Bonus linked to company performance','Life cover throughout the policy term','Multiple PPT options available'], whySuit: 'Choose Bajaj Life ACE Savings for bonus upside potential alongside guaranteed savings.', bestFor: 'Individuals comfortable with participating structure who want bonus growth potential.', limitations: ['Participating — bonus NOT guaranteed','Different structure from Non-Par benchmark'], scoreData: { flexibility:7, protection:6, income:3, riders:5, loan:4, jointLife:5 } },
  'sav_ICICI Pru': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed savings','Guaranteed Additions throughout the premium paying term','Lump sum payout at maturity with full life cover','ICICI Pru — top 3 private life insurer by market share','Policy loan facility available after PPT completion'], whySuit: 'Choose ICICI Pru Assured Savings for guaranteed savings with Guaranteed Additions from a top-tier insurer.', bestFor: 'Customers who value brand reliability and want guaranteed additions during savings period.', limitations: ['Lump sum only','Limited PPT options vs ABSLI'], scoreData: { flexibility:5, protection:7, income:0, riders:5, loan:7, jointLife:5 } },
  'sav_SBI Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed maturity benefit','Guaranteed Additions accrue throughout the premium term','Backed by SBI — largest bank in India','Life cover equal to Sum Assured throughout','Surrender value available after 2 policy years'], whySuit: 'Choose SBI Life Smart Platina Assure for guaranteed savings with the trust of State Bank of India.', bestFor: 'SBI account holders seeking guaranteed savings through their bank.', limitations: ['No joint life option','No loan facility in brochure','Limited riders'], scoreData: { flexibility:5, protection:7, income:0, riders:3, loan:0, jointLife:0 } },
  'sav_Axis Max Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed wealth at maturity','Short premium term, long maturity benefit period','Guaranteed Additions during PPT to enhance corpus','Axis Max Life — strong claim settlement track record','Life cover throughout the policy term'], whySuit: 'Choose Axis Max Life Smart Wealth Plan for guaranteed savings with short premium commitment.', bestFor: 'Young earners who want to invest for a short period and receive guaranteed lump sum at a future milestone.', limitations: ['No income option','Limited PPT flexibility'], scoreData: { flexibility:5, protection:7, income:0, riders:5, loan:4, jointLife:5 } },
  'sav_Kotak Life': { keyHighlights: ['Non-Linked, Non-Participating — fully assured maturity benefit','Know your exact return at policy inception','Short premium paying terms available','Kotak Life — consistently top-ranked private insurer','Life cover equal to Sum Assured throughout'], whySuit: 'Choose Kotak Life Assured Savings Plan for complete transparency — you know your exact maturity amount upfront.', bestFor: 'Customers who value complete transparency and predictability in savings plans.', limitations: ['Lump sum only','Verify current rates from official Kotak calculator'], scoreData: { flexibility:5, protection:7, income:0, riders:4, loan:5, jointLife:5 } },
  'sav_Canara HSBC': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed returns','Multiple goal options — choose savings objective at inception','Canara HSBC Life — backed by Canara Bank and HSBC','Guaranteed Additions during the premium paying period','Life cover throughout the policy term'], whySuit: 'Choose Canara HSBC iSelect Guaranteed Future for flexible savings goals with bank-backed insurer trust.', bestFor: 'Canara Bank or HSBC customers seeking guaranteed savings through existing banking relationship.', limitations: ['Verify current product availability periodically'], scoreData: { flexibility:6, protection:7, income:3, riders:4, loan:4, jointLife:5 } },

  // ── LONG TERM INCOME PLANS ──────────────────────────────
  'inc_ABSLI': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed income for 20, 25 or 30 years','Pay for just 5 to 12 years, receive income for up to 30 years','Option 2: Income plus 100% Return of All Premiums at end of income period','Loyalty Additions enhance income in later years of policy','Joint Life option — income continues for surviving spouse'], whySuit: 'Choose ABSLI Assured Income Plus for long guaranteed income with joint life protection and loyalty additions.', bestFor: 'Individuals planning post-retirement income with joint life protection for their spouse.', limitations: ['Income starts after PPT ends — not immediate','Income only — no lump sum option'], scoreData: { flexibility:8, protection:9, income:10, riders:8, loan:8, jointLife:10 } },
  'inc_Tata AIA': { keyHighlights: ['Non-Linked, Non-Participating — income for up to 45 years','Longest guaranteed income period available in Indian market','Critical Illness option — serious illness covered','Return of Premium at end of full income period','Choice of immediate or deferred income start'], whySuit: 'Choose Tata AIA Fortune Guarantee Plus Income for the longest guaranteed income period — up to 45 years.', bestFor: 'Young customers aged 30 to 40 who want guaranteed income covering their entire retirement period.', limitations: ['CI option at additional premium','Longer income period means lower annual income amount'], scoreData: { flexibility:8, protection:8, income:10, riders:7, loan:5, jointLife:6 } },
  'inc_HDFC Life': { keyHighlights: ['Non-Linked, Non-Participating — 4 variants in one plan','Option 1: Income for 10 years | Option 2: Income for 25 years','Option 3: Lifelong Income to age 99 | Option 4: Guaranteed Maturity','HDFC Life — largest private life insurer in India','Lifelong Income option is rare and unique in guaranteed category'], whySuit: 'Choose HDFC Life Sanchay Plus for maximum flexibility — including a rare Lifelong Income option to age 99.', bestFor: 'Individuals who want to choose between short, medium or truly lifelong guaranteed income.', limitations: ['Lower annual income on longer variants','Verify current rates at official calculator'], scoreData: { flexibility:9, protection:7, income:10, riders:5, loan:5, jointLife:6 } },
  'inc_ICICI Pru': { keyHighlights: ['Non-Linked, Non-Participating — fully guaranteed income','Flexible income start date — choose when income begins','Multiple income period options to match your life plan','ICICI Pru — top 3 private life insurer','Option to receive lump sum at maturity instead of income'], whySuit: 'Choose ICICI Pru GIFT for flexibility on income start date — align income with a future life milestone.', bestFor: 'Customers who want to align income start with future event — retirement, child education, home loan payoff.', limitations: ['Income from Year 2 in standard variant','Verify income period options from official brochure'], scoreData: { flexibility:8, protection:7, income:9, riders:5, loan:7, jointLife:5 } },
  'inc_Canara HSBC': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed income','iSelect flexibility — choose benefit structure at inception','Canara HSBC Life — Canara Bank plus HSBC joint venture','Guaranteed Additions during premium paying period','Multiple income duration options'], whySuit: 'Choose Canara HSBC iSelect Guaranteed Future Plus for flexible income with bank-backed insurer.', bestFor: 'Canara Bank or HSBC customers who want long-term income through banking relationship.', limitations: ['Verify current availability periodically'], scoreData: { flexibility:7, protection:6, income:9, riders:4, loan:4, jointLife:5 } },
  'inc_Bajaj Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed income','Choose Income or Lump Sum benefit at inception','Guaranteed income for fixed period post premium payment','Bajaj Life — part of Bajaj Finserv Group','Life cover throughout the policy term'], whySuit: 'Choose Bajaj Life Insurance Guaranteed Income Goal Plan for income flexibility — Non-Par guaranteed income with lumpsum or income option and Extended Life Cover.', bestFor: 'Customers who want guaranteed income or lumpsum from a Bajaj Finserv group insurer with Extended Life Cover option.', limitations: ['Verify current product name — recently renamed from Bajaj Allianz'], scoreData: { flexibility:7, protection:6, income:9, riders:5, loan:4, jointLife:5 } },
  'inc_SBI Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed income plus premium return','110% of total premiums returned at end of income period','Short premium paying term — invest for limited years only','Backed by SBI — most trusted public bank brand in India','Life cover equal to Sum Assured throughout'], whySuit: 'Choose SBI Life Smart Platina Plus for guaranteed income AND 110% premium return at the end.', bestFor: 'SBI customers who want guaranteed income with full premium refund plus 10% extra at the end.', limitations: ['No joint life option','Limited riders vs private sector plans'], scoreData: { flexibility:5, protection:7, income:9, riders:3, loan:3, jointLife:0 } },
  'inc_Axis Max Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed income','3 variants: Short Income, Long Income, Lump Sum','Policy Continuance Benefit — policy active even if premium missed','Income start from Year 1 in select variants','Axis Max Life — strong claim settlement ratio'], whySuit: 'Choose Axis Max Life Smart Wealth Income Plan for 3 income variants with Policy Continuance Benefit as safety net.', bestFor: 'Customers who want guaranteed income with a safety net in case of premium default.', limitations: ['Verify current variant details from official brochure'], scoreData: { flexibility:8, protection:7, income:9, riders:6, loan:4, jointLife:5 } },
  'inc_Kotak Life': { keyHighlights: ['Non-Linked, Non-Participating — guaranteed income','Flexible income period options to match your retirement goal','Comprehensive rider options for complete protection','Kotak Life — top-ranked for claim settlement','Life cover throughout the policy and income period'], whySuit: 'Choose Kotak Life Guaranteed Fortune Builder for guaranteed income with comprehensive riders.', bestFor: 'Customers who want guaranteed income with strong rider coverage for complete protection.', limitations: ['Verify income period options from official Kotak brochure'], scoreData: { flexibility:7, protection:8, income:9, riders:7, loan:5, jointLife:5 } },

  // ── ANNUITY PLANS ────────────────────────────────────────
  'ann_lic-jak': { keyHighlights: ['LIC Jeevan Akshay VII — government-backed sovereign guarantee','10 annuity options across single and joint life','Annuity Certain option: guaranteed payout for 5 to 20 years even if annuitant dies','Joint Life — 50% annuity continues to spouse on primary death','100% Return of Purchase Price option available on death'], whySuit: 'Choose LIC Jeevan Akshay VII for the ultimate security of government-backed lifetime annuity.', bestFor: 'Retirees who prioritise absolute security and sovereign guarantee above all features.', limitations: ['No Deferred option','No NPS variant','No CI Enhancement'], scoreData: { flexibility:7, protection:8, income:10, riders:3, loan:5, jointLife:9 } },
  'ann_lic-smart': { keyHighlights: ['LIC Smart Pension Plan 879 — newest LIC annuity plan launched Feb 2025','E-series: Return of Purchase Price at age 75 or 80 to living annuitant','NPS-compatible option for NPS subscribers','10 plus annuity variants including joint life','LIC government backing with modern plan features'], whySuit: 'Choose LIC Smart Pension Plan 879 for LIC newest annuity with living benefits and NPS compatibility.', bestFor: 'NPS subscribers who want LIC government backing with more modern annuity features.', limitations: ['E-series ROP structure differs from ABSLI living annuitant benefit','No CI Enhancement option'], scoreData: { flexibility:8, protection:8, income:10, riders:3, loan:5, jointLife:9 } },
  'ann_lic-njs': { keyHighlights: ['LIC New Jeevan Shanti 758 — deferred annuity specialist','Guaranteed Additions during the deferment period','Choose deferment period from 1 to 12 years','Joint Life and Single Life options','LIC sovereign guarantee throughout accumulation and payout'], whySuit: 'Choose LIC New Jeevan Shanti 758 to lock in annuity rates now and start income after several years.', bestFor: 'Pre-retirees aged 45 to 60 who want to plan annuity income in advance with government backing.', limitations: ['Deferred annuity only — not suitable for immediate income requirement'], scoreData: { flexibility:7, protection:7, income:9, riders:3, loan:4, jointLife:8 } },
  'ann_hdfc-pgp': { keyHighlights: ['HDFC Life Pension Guaranteed Plan — deferred plus immediate options','Guaranteed Additions during accumulation phase','HDFC Life — largest private life insurer in India','Multiple annuity payout frequency options','Joint Life annuity with ROP option'], whySuit: 'Choose HDFC Life Pension Guaranteed Plan for deferred annuity from India largest private insurer.', bestFor: 'Pre-retirees wanting guaranteed corpus growth before converting to lifetime income.', limitations: ['Verify current annuity rates at HDFC Life official calculator'], scoreData: { flexibility:7, protection:7, income:9, riders:3, loan:4, jointLife:8 } },
  'ann_hdfc-niap': { keyHighlights: ['HDFC Life New Immediate Annuity Plan — lifelong guaranteed income','Multiple options: Single Life, Joint Life, ROP on death','CI option: Return of Purchase Price on 6 critical illnesses','HDFC Life — strongest brand in private life insurance','Joint Life annuity continues to spouse after primary death'], whySuit: 'Choose HDFC Life New Immediate Annuity for immediate lifelong income with the largest private insurer.', bestFor: 'Retirees who want immediate income with joint life protection and strong brand assurance.', limitations: ['CI option: annuity ceases on CI trigger vs ABSLI where annuity increases by 50%','Only 6 CIs covered vs ABSLI 42 CIs'], scoreData: { flexibility:6, protection:8, income:10, riders:3, loan:4, jointLife:9 } },
  'ann_icici': { keyHighlights: ['ICICI Pru Guaranteed Pension Plan — immediate and deferred annuity','Multiple options: Single Life, Joint Life, Certain Period','ICICI Pru — top 3 private life insurer by market share','Deferred variant with growing corpus during deferment','Return of Purchase Price option on death'], whySuit: 'Choose ICICI Pru Guaranteed Pension Plan for reliable lifetime annuity from a top private insurer.', bestFor: 'Retirees who want immediate annuity income from a financially strong top-brand private insurer.', limitations: ['Verify current annuity rates from official ICICI Pru calculator'], scoreData: { flexibility:7, protection:7, income:10, riders:3, loan:5, jointLife:8 } },
  'ann_sbi': { keyHighlights: ['SBI Life Saral Pension — IRDAI standardised annuity product','Mandatory 100% Return of Purchase Price on death as per IRDAI rules','Joint Life — 50% annuity continues to surviving spouse','SBI Life — backed by the largest bank in India','Policy loan available after just 6 months'], whySuit: 'Choose SBI Life Saral Pension for IRDAI standardised simplicity with SBI bank backing.', bestFor: 'SBI customers who want a simple no-frills annuity with mandatory ROP and bank trust.', limitations: ['Very limited options — only 2 variants as IRDAI Saral standard','No CI, no deferred, no NPS option'], scoreData: { flexibility:3, protection:7, income:10, riders:2, loan:8, jointLife:8 } },
  'ann_tata': { keyHighlights: ['Tata AIA Smart Annuity Plan — comprehensive annuity options','Single Life and Joint Life variants with ROP on death','Annuity Certain: guaranteed for chosen period even if annuitant dies','Tata AIA — joint venture of Tata Group and AIA the largest Asian insurer','Strong claim settlement ratio consistently maintained'], whySuit: 'Choose Tata AIA Smart Annuity Plan for comprehensive annuity with Tata and AIA combined strength.', bestFor: 'Retirees who value international insurer backing alongside the trusted Tata brand.', limitations: ['Fewer unique features vs ABSLI Guaranteed Annuity Plus'], scoreData: { flexibility:7, protection:7, income:10, riders:3, loan:4, jointLife:8 } },
  'ann_bajaj': { keyHighlights: ['Bajaj Life Guaranteed Pension Goal II — immediate annuity plan','Multiple variants: Single Life, Joint Life, ROP options','Bajaj Finserv Group — one of the largest financial conglomerates in India','Guaranteed lifelong income with no market risk','Return of Purchase Price option on death'], whySuit: 'Choose Bajaj Life Guaranteed Pension Goal II for lifetime annuity from the Bajaj Finserv group.', bestFor: 'Bajaj brand customers seeking guaranteed annuity income with conglomerate backing.', limitations: ['Company renamed from Bajaj Allianz to Bajaj Life — verify current brochure'], scoreData: { flexibility:6, protection:7, income:10, riders:3, loan:4, jointLife:8 } },
  'ann_kotak': { keyHighlights: ['Kotak Life Assured Pension — immediate annuity plan','Joint Life, Single Life, Annuity Certain variants','CI Option available: ROP on critical illness or death','Kotak Life — consistently top-ranked for service quality','Deferred annuity option with growing corpus'], whySuit: 'Choose Kotak Life Assured Pension for guaranteed annuity with top-ranked customer service.', bestFor: 'Retirees who value service quality and claim responsiveness alongside guaranteed lifetime income.', limitations: ['CI option: annuity ceases on CI trigger vs ABSLI enhancement of 50%'], scoreData: { flexibility:7, protection:7, income:10, riders:4, loan:4, jointLife:8 } },
  'ann_pnb': { keyHighlights: ['PNB MetLife Immediate Annuity — bank-backed annuity plan','Multiple options: Single Life, Joint Life, Certain Period','PNB MetLife — joint venture of Punjab National Bank and MetLife USA','Guaranteed lifelong income with no market risk whatsoever','Available through PNB bank branches across India'], whySuit: 'Choose PNB MetLife Immediate Annuity for guaranteed lifetime income through PNB bank network.', bestFor: 'PNB bank customers who want annuity through their existing banking relationship.', limitations: ['Fewer unique features vs market leaders'], scoreData: { flexibility:5, protection:6, income:10, riders:3, loan:4, jointLife:0 } },
  'ann_axis': { keyHighlights: ['Axis Max Life Guaranteed Lifetime Income Plan — immediate annuity','Single Life and Joint Life options with ROP variants','Axis Max Life — strong claim settlement ratio among private insurers','Guaranteed lifelong income with no market dependency whatsoever','Return of Purchase Price on death option available'], whySuit: 'Choose Axis Max Life Guaranteed Lifetime Income Plan for reliable lifetime annuity from a performance-focused insurer.', bestFor: 'Retirees who want guaranteed income with strong claim settlement assurance.', limitations: ['Fewer unique options vs market leaders','Verify current rates from official calculator'], scoreData: { flexibility:6, protection:7, income:10, riders:3, loan:4, jointLife:8 } },
  'ann_canara-p4l': { keyHighlights: ['Canara HSBC Pension4Life — bank-backed annuity plan','Multiple annuity variants including Joint Life option','NPS-compatible option for NPS subscribers','Canara HSBC Life — backed by Canara Bank and HSBC','Guaranteed lifelong income from first payout'], whySuit: 'Choose Canara HSBC Pension4Life for NPS-compatible annuity through a bank-backed insurer.', bestFor: 'NPS subscribers or Canara Bank customers who want guaranteed annuity at retirement.', limitations: ['Verify current annuity rates and options from official brochure'], scoreData: { flexibility:6, protection:6, income:10, riders:3, loan:4, jointLife:0 } },
  'ann_canara-sgp': { keyHighlights: ['Canara HSBC Smart Guaranteed Pension — deferred plus immediate annuity','Guaranteed Additions during the deferment period','Canara HSBC Life — trusted bank-backed insurer in India','Flexible deferment period options for pre-retirement planning','Converts accumulated corpus to guaranteed lifetime income at retirement'], whySuit: 'Choose Canara HSBC Smart Guaranteed Pension for deferred annuity with guaranteed growth during accumulation.', bestFor: 'Pre-retirees who want bank-backed plan to accumulate corpus now and start income at retirement.', limitations: ['Verify current product features from official brochure'], scoreData: { flexibility:6, protection:6, income:9, riders:3, loan:4, jointLife:0 } },

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
      company: p.company, plan: p.planName || p.plan || 'Term Plan', uin: p.uin || '—',
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
      keyFeatures: p.keyFeatures || [],
      tags: p.tags || [],
      keyStats: p.keyStats || [],
      salesPitch: p.salesPitch || p.bestFor || '',
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
        company: p.company, plan: p.plan, uin: p.uin || '—',
        type: p.type || 'Non-Linked Participating',
        entryAge: '30 days – 60 yrs', maturityAge: '85 yrs',
        ppt: p.isBase ? 'Single Pay | 5–12 yrs' : (p.ppt || '—'),
        pt: p.isBase ? 'Up to 35 yrs' : '—',
        deathBenefit: p.isBase ? 'SA on Death + Accrued Bonuses' : '—',
        riders: p.isBase ? 'Accidental Death | CI | Surgical Care | Hospital Care' : (p.features?.riders || '—'),
        loan: p.isBase ? true : false,
        jointLife: false, // Anmol Akshaya is Individual — no joint life
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
        keyFeatures: p.keyHighlights || p.keyFeatures || [],
        salesPitch: p.pitch || p.uniqueFeature || '',
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
        company: p.company, plan: p.plan, uin: p.uin || '—',
        type: p.type || 'Non-Linked Non-Par',
        entryAge: p.entryAge || '—', maturityAge: '—',
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
        keyFeatures: p.keyHighlights || p.keyFeatures || [],
        salesPitch: p.pitch || p.uniqueFeature || '',
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
        company: p.company, plan: p.plan, uin: p.uin || '—',
        type: p.type || 'Non-Linked Non-Par',
        entryAge: p.entryAge || '—', maturityAge: p.maturityAge ? p.maturityAge+' years' : '—',
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
        keyFeatures: p.keyHighlights || p.keyFeatures || [],
        salesPitch: p.pitch || p.uniqueFeature || '',
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
        company: p.company, plan: p.plan, uin: p.uin || '—',
        type: p.type || 'Non-Linked Non-Par',
        entryAge: p.entryAge || '—', maturityAge: '—',
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
        keyFeatures: p.keyHighlights || p.keyFeatures || [],
        salesPitch: p.pitch || p.uniqueFeature || '',
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
        company: p.company, plan: p.plan, uin: p.uin || '—',
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
        keyFeatures: p.keyHighlights || p.keyFeatures || [],
        salesPitch: p.pitch || p.uniqueFeature || '',
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
