// ══════════════════════════════════════
// IC38 LEARNING DATA — Insurance Arena
// 21 Chapters · 147 Topics
// ══════════════════════════════════════

const CHAPTERS = [
  {id:1, title:"Introduction to Insurance", section:"Common", topics:10},
  {id:2, title:"Customer Service", section:"Common", topics:8},
  {id:3, title:"Grievance Redressal Mechanism", section:"Common", topics:5},
  {id:4, title:"Regulatory Aspects of Insurance Agents", section:"Common", topics:10},
  {id:5, title:"Legal Principles of an Insurance Contract", section:"Common", topics:10},
  {id:6, title:"What Life Insurance Involves", section:"Life Insurance", topics:3},
  {id:7, title:"Financial Planning", section:"Life Insurance", topics:7},
  {id:8, title:"Life Insurance Products — I", section:"Life Insurance", topics:8},
  {id:9, title:"Life Insurance Products — II", section:"Life Insurance", topics:5},
  {id:10, title:"Applications of Life Insurance", section:"Life Insurance", topics:5},
  {id:11, title:"Pricing and Valuation in Life Insurance", section:"Life Insurance", topics:7},
  {id:12, title:"Documentation — Proposal Stage", section:"Life Insurance", topics:6},
  {id:13, title:"Documentation — Policy Condition I", section:"Life Insurance", topics:4},
  {id:14, title:"Documentation — Policy Condition II", section:"Life Insurance", topics:6},
  {id:15, title:"Underwriting", section:"Life Insurance", topics:7},
  {id:16, title:"Payments Under a Life Insurance Policy", section:"Life Insurance", topics:7},
  {id:17, title:"Introduction to Health Insurance", section:"Health Insurance", topics:7},
  {id:18, title:"Insurance Documentation (Health)", section:"Health Insurance", topics:5},
  {id:19, title:"Health Insurance Products", section:"Health Insurance", topics:11},
  {id:20, title:"Health Insurance Underwriting", section:"Health Insurance", topics:6},
  {id:21, title:"Health Insurance Claims", section:"Health Insurance", topics:10},
];

const SECTION_COLORS = {
  "Common": "#1B4F72",
  "Life Insurance": "#145A32",
  "Health Insurance": "#6C3483"
};

// Chapter 1 — full sample content
// Remaining chapters load from Google Sheets (data/learn-content.json)
const SAMPLE_TOPICS = {
  1: [
    { id:"CH01-T01", num:1, title:"History of Insurance",
      nutshell:"Insurance started 5,000 years ago when communities realised sharing losses makes everyone stronger. From Babylonian traders to Lloyd's Coffee House — the idea of pooling risk is ancient.",
      hinglish:"Bolo toh... 'Ek akele nahi, saath milke jhelte hain!'",
      example:"5 friends share tiffin — if anyone forgets lunch, others share a bite. Nobody starves! Ancient traders did the same with ships and goods across the seas 5,000 years ago.",
      quiz:"True or False: Insurance is a modern invention from the 20th century?",
      options:["True — insurance started in 1900s","False — insurance existed since 3000 BC","Insurance started in 1800s","Insurance started with LIC in 1956"],
      correct:1, difficulty:"Easy" },
    { id:"CH01-T02", num:2, title:"Lloyd's Coffee House & First Insurance Company",
      nutshell:"Modern commercial insurance began at Lloyd's Coffee House in London where traders agreed to share losses from ship perils. The Amicable Society (1706) was the world's first life insurance company.",
      hinglish:"Bolo toh... 'Chai pe charcha se insurance ka janm hua!'",
      example:"Your colony WhatsApp group where neighbours agree: if house damaged, all chip in ₹100. That 1688 London group was Lloyd's Coffee House!",
      quiz:"Where did modern commercial insurance begin?",
      options:["A bank in Mumbai","Lloyd's Coffee House in London","A Greek temple","The Indian Parliament"],
      correct:1, difficulty:"Easy" },
    { id:"CH01-T03", num:3, title:"History of Insurance in India",
      nutshell:"India's insurance journey: 1800s foreign insurers → 1870 first Indian company → 1938 Insurance Act → 1956 LIC (nationalisation) → 2000 IRDAI + private players. Today 24 life insurers operate.",
      hinglish:"Bolo toh... 'Pehle angrezi company, phir sarkar ka haath, ab 24 companies ka saath!'",
      example:"Like school canteen: First foreign shop. Then government took over (LIC 1956). Then many private shops opened in 2000 — now lots of choices!",
      quiz:"Which was India's FIRST insurance company owned by Indians?",
      options:["LIC","Oriental Life Insurance","Bombay Mutual Assurance Society","National Insurance Company"],
      correct:2, difficulty:"Medium" },
    { id:"CH01-T04", num:4, title:"How Insurance Works",
      nutshell:"Many people contribute small premiums into a pool. When any few suffer a loss, they are compensated from this pool. The insurer organises and manages this pooling process on behalf of all members.",
      hinglish:"Bolo toh... 'Thoda thoda milake, bahut bada ban jaata hai!'",
      example:"40 students put ₹10 each = ₹400 total pool. If anyone loses their geometry box, the pool buys a new one. Nobody feels ₹10 pinch but the one who lost gets full help!",
      quiz:"In insurance, what is the money you pay regularly to the insurer called?",
      options:["Salary","Premium","Tax","Installment"],
      correct:1, difficulty:"Easy" },
    { id:"CH01-T05", num:5, title:"Primary and Secondary Burden of Risk",
      nutshell:"Primary burden = actual financial loss when bad event occurs. Secondary burden = mental anxiety and money set aside as reserve even when no loss occurs. Insurance removes both.",
      hinglish:"Bolo toh... 'Dukh do tarah ka — jo hua uska, aur jo hoga uske darr ka!'",
      example:"You keep ₹500 under pillow 'just in case' cycle gets stolen = secondary burden (money locked + worry). If cycle actually gets stolen = primary burden (real loss). Insurance removes both!",
      quiz:"Setting aside money every month for a possible future loss is called what kind of burden?",
      options:["Primary Burden","Secondary Burden","Financial Burden","Insurance Burden"],
      correct:1, difficulty:"Medium" },
    { id:"CH01-T06", num:6, title:"Risk Management Techniques",
      nutshell:"Insurance is just ONE of five risk management methods: Risk Avoidance, Risk Reduction, Risk Retention (self-insurance), Risk Financing, and Risk Transfer through insurance.",
      hinglish:"Bolo toh... 'Risk se nikalne ke paanch raaste hain — insurance sirf ek hai!'",
      example:"Riding a cycle: Avoidance = don't ride. Reduction = wear helmet. Retention = 'Main dekh lunga.' Transfer = buy cycle insurance. Company pays if you fall!",
      quiz:"Which risk technique means 'I'll handle any loss myself without help'?",
      options:["Risk Transfer","Risk Avoidance","Risk Retention","Risk Reduction"],
      correct:2, difficulty:"Easy" },
    { id:"CH01-T07", num:7, title:"Insurance vs Assurance",
      nutshell:"Insurance covers events that MIGHT happen (fire, accident — uncertain). Assurance covers events that WILL definitely happen (death — certain, only timing uncertain). Life cover = technically life assurance.",
      hinglish:"Bolo toh... 'Insurance = Shayad hoga · Assurance = Zaroor hoga, bas kab pata nahi!'",
      example:"Insurance = carrying umbrella because it MIGHT rain. Assurance = knowing monsoon WILL come every year. Life insurance is actually life ASSURANCE!",
      quiz:"Life insurance is technically called life _____ because death is certain?",
      options:["Insurance","Assurance","Guarantee","Security"],
      correct:1, difficulty:"Medium" },
    { id:"CH01-T08", num:8, title:"Insurance as a Tool for Managing Risk",
      nutshell:"Best insurance situations: LOW probability of loss but VERY HIGH financial impact if it occurs. Don't insure a ₹5 pen. DO insure a factory worth ₹50 crores. Never risk more than you can afford to lose.",
      hinglish:"Bolo toh... 'Choti baat pe mat rona, badi museebat ke liye bachao — yahi hai smart insurance!'",
      example:"₹5 pen lost → don't insure (premium costs more!). Factory worth ₹50Cr burns → MUST insure. Probability vs impact is the key question.",
      quiz:"Which scenario is the BEST candidate for insurance?",
      options:["Losing a ₹10 eraser","Breadwinner's untimely death leaving family with no income","Stock prices falling","Natural wear and tear on a house"],
      correct:1, difficulty:"Medium" },
    { id:"CH01-T09", num:9, title:"Role of Insurance in Society",
      nutshell:"Insurance companies invest premiums into the economy, protect capital for industry expansion, generate employment, earn foreign exchange, and support government social security schemes.",
      hinglish:"Bolo toh... 'Insurance sirf protection nahi — ye desh ki economic backbone hai!'",
      example:"10 crore Indians pay premiums → Insurance companies invest in roads, hospitals, businesses → Economy grows. Everyone benefits even those who never claimed!",
      quiz:"Which government scheme provides insurance cover to farmers for crop loss?",
      options:["PMJBY","RSBY","RKBY","ESIC"],
      correct:2, difficulty:"Medium" },
    { id:"CH01-T10", num:10, title:"Government Insurance Schemes",
      nutshell:"PMJBY provides ₹2L life cover for ₹436/year. PMSBY provides ₹2L accident cover for ₹20/year. RKBY covers farmers. Jan Arogya is run commercially by insurers — NOT government sponsored.",
      hinglish:"Bolo toh... 'Sarkar bhi leta hai insurance — apne logon ke liye!'",
      example:"Government as caring parent: Can't afford insurance? Government pays part of premium OR runs special cheap schemes. Daily-wage worker can have protection through PMJBY for just ₹436/year!",
      quiz:"Jan Arogya insurance scheme is run by?",
      options:["Government","Private Insurer","Both equally","World Health Organisation"],
      correct:1, difficulty:"Hard" },
  ]
};

// Build flat search index for all chapters
const SEARCH_INDEX = [];
CHAPTERS.forEach(ch => {
  SEARCH_INDEX.push({
    chId: ch.id, chTitle: ch.title, chSec: ch.section,
    id: '_ch_' + ch.id, title: ch.title, isChapter: true, n: ch.topics
  });
  (SAMPLE_TOPICS[ch.id] || []).forEach(t => {
    SEARCH_INDEX.push({
      chId: ch.id, chTitle: ch.title, chSec: ch.section, ...t, isChapter: false
    });
  });
});
