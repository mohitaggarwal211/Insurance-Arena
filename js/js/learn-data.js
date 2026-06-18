// INSURANCE ARENA — FINANCE LEARNING DATA
// 147 Topics · All subjects built-in · No external dependency

const ALL_TOPICS = [
  {
    id:'CH01-T01', ch:1, subject:'Insurance Fundamentals',
    title:'History of Insurance',
    nutshell:`Insurance started 5,000 years ago when communities realised sharing each other's losses makes everyone stronger. From Babylonian traders to Lloyd's Coffee House — the idea of pooling risk is ancient.`,
    hinglish:`Bolo toh... 'Ek akele nahi, saath milke jhelte hain!'`,
    example:`5 friends share tiffin — if anyone forgets lunch, others share a bite. Nobody starves! Ancient traders did the same with ships and goods.`,
    quiz:`True or False: Insurance is a modern invention from the 20th century?`,
    opts:['True', 'False', 'Insurance started in 1900s', 'Insurance is 500 years old'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH01-T02', ch:1, subject:'Insurance Fundamentals',
    title:'Lloyd\'s Coffee House & First Insurance Company',
    nutshell:`Modern commercial insurance began at Lloyd's Coffee House in London where traders agreed to share losses from ship perils. The Amicable Society (1706) was the world's first life insurance company.`,
    hinglish:`Bolo toh... 'Chai pe charcha se insurance ka janm hua!'`,
    example:`Your colony's WhatsApp group where neighbours agree: 'If anyone's house gets damaged in rain, we all chip in ₹100.' That WhatsApp group in 1688 London was Lloyd's Coffee House!`,
    quiz:`Where did modern commercial insurance begin?`,
    opts:['A bank in Mumbai', 'Lloyd\'s Coffee House in London', 'A Greek temple', 'The Indian Parliament'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH01-T03', ch:1, subject:'Insurance Fundamentals',
    title:'History of Insurance in India',
    nutshell:`India's insurance journey began around 1800 with foreign insurers, followed by Indian companies, nationalisation (LIC 1956), and finally privatisation with IRDAI formation in 2000.`,
    hinglish:`Bolo toh... 'Pehle angrezi company, phir sarkar ka haath, ab 24 companies ka saath!'`,
    example:`Insurance in India like school canteen: First foreign shop ran it (1800s). Then government took over (LIC 1956). Then many private shops allowed in 2000 — now lots of choices!`,
    quiz:`Which was India's FIRST insurance company owned by Indians?`,
    opts:['LIC', 'Oriental Life Insurance', 'Bombay Mutual Assurance Society', 'National Insurance Company'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH01-T04', ch:1, subject:'Insurance Fundamentals',
    title:'How Insurance Works',
    nutshell:`Many people contribute small premiums into a pool. When any few suffer a loss, they are compensated from this pool. The insurer organises and manages this pooling process.`,
    hinglish:`Bolo toh... 'Thoda thoda milake, bahut bada ban jaata hai!'`,
    example:`40 students put ₹10 each = ₹400 total. If anyone loses geometry box, class fund buys new one. Nobody feels ₹10 pinch but the one who lost gets full help. That box = insurance pool!`,
    quiz:`In insurance, what is the money you pay regularly called?`,
    opts:['Salary', 'Premium', 'Tax', 'Installment'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH01-T05', ch:1, subject:'Insurance Fundamentals',
    title:'Primary and Secondary Burden of Risk',
    nutshell:`Primary burden = actual financial losses suffered when bad event occurs (measurable, compensated by insurance). Secondary burden = mental anxiety and money set aside as reserve even when no loss occurs.`,
    hinglish:`Bolo toh... 'Dukh do tarah ka — jo hua uska, aur jo hoga uske darr ka!'`,
    example:`You keep ₹500 under pillow 'just in case' cycle gets stolen = secondary burden (money locked + worry). If cycle actually gets stolen = primary burden (real loss).`,
    quiz:`Setting aside money every month for a possible future loss is called what kind of burden?`,
    opts:['Primary Burden', 'Secondary Burden', 'Financial Burden', 'Insurance Burden'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH01-T06', ch:1, subject:'Insurance Fundamentals',
    title:'Risk Management Techniques',
    nutshell:`Insurance is just ONE of five risk management methods: Risk Avoidance (don't do it), Risk Reduction (reduce impact), Risk Retention (handle yourself), Risk Financing, and Risk Transfer (insurance).`,
    hinglish:`Bolo toh... 'Risk se nikalne ke paanch raaste hain — insurance sirf ek hai!'`,
    example:`Riding a cycle: Avoidance = don't ride. Reduction = wear helmet. Retention = 'Main dekh lunga.' Transfer = buy cycle insurance. Company pays if you fall!`,
    quiz:`Which risk technique means 'I'll handle any loss myself without help'?`,
    opts:['Risk Transfer', 'Risk Avoidance', 'Risk Retention', 'Risk Reduction'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH01-T07', ch:1, subject:'Insurance Fundamentals',
    title:'Insurance vs Assurance',
    nutshell:`Insurance covers events that MIGHT happen (fire, accident). Assurance covers events that WILL DEFINITELY happen (like death — certain, just uncertain WHEN). Life cover = life assurance.`,
    hinglish:`Bolo toh... 'Insurance = Shayad hoga · Assurance = Zaroor hoga, bas kab pata nahi!'`,
    example:`Insurance = carrying umbrella because it MIGHT rain. Assurance = knowing monsoon WILL come every year — 100% guaranteed. Life insurance is actually life ASSURANCE!`,
    quiz:`Life insurance is technically called life _____ because death is certain?`,
    opts:['Insurance', 'Assurance', 'Guarantee', 'Security'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH01-T08', ch:1, subject:'Insurance Fundamentals',
    title:'Insurance as a Tool for Managing Risk',
    nutshell:`Best insurance situations: LOW probability of loss but VERY HIGH financial impact if it occurs. Don't insure a ₹5 pen. DO insure a factory worth ₹50 crores. Never risk more than you can afford to lose.`,
    hinglish:`Bolo toh... 'Choti baat pe mat rona, badi museebat ke liye bachao — yahi hai smart insurance!'`,
    example:`Three situations: ₹5 pen lost → don't insure (premium costs more). Factory worth ₹50Cr burns → MUST insure. Space satellite worth ₹500Cr malfunctions → MUST insure. Probability vs impact!`,
    quiz:`Which scenario is the BEST candidate for insurance?`,
    opts:['Losing a ₹10 eraser', 'Breadwinner\'s untimely death leaving family with no income', 'Stock prices falling', 'Natural wear and tear on a house'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH01-T09', ch:1, subject:'Insurance Fundamentals',
    title:'Role of Insurance in Society',
    nutshell:`Insurance companies invest premiums into the economy, protect capital for industry, generate employment, earn foreign exchange, and support government social security schemes like PMJBY and PMSBY.`,
    hinglish:`Bolo toh... 'Insurance sirf protection nahi — ye desh ki economic backbone hai!'`,
    example:`10 crore Indians pay premiums → Insurance companies invest in roads, hospitals, businesses → Economy grows → City gets better infrastructure. Everyone benefits even those who never claimed!`,
    quiz:`Which government scheme provides insurance cover to farmers for crop loss?`,
    opts:['PMJBY', 'RSBY', 'RKBY', 'ESIC'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH01-T10', ch:1, subject:'Insurance Fundamentals',
    title:'Government Insurance Schemes — Social Security',
    nutshell:`PMJBY (Pradhan Mantri Jeevan Jyoti Bima Yojana) and PMSBY provide low-cost life and accident cover. RKBY covers farmers. Jan Arogya is run by insurers commercially (not government sponsored).`,
    hinglish:`Bolo toh... 'Sarkar bhi leta hai insurance — apne logon ke liye!'`,
    example:`Government as caring parent: Can't afford insurance? Government pays part of premium OR runs special cheap schemes — making sure even daily-wage worker has protection if sick or injured.`,
    quiz:`Jan Arogya insurance scheme is run by?`,
    opts:['Government', 'Private Insurer', 'Both equally', 'World Health Organisation'],
    correct:1, difficulty:'Hard'
  },
  {
    id:'CH02-T01', ch:2, subject:'Customer Service',
    title:'Why Customer Service Matters in Insurance',
    nutshell:`Insurance is an intangible product — customers buy a service experience, not a physical item. If the experience is below expectations, there's dissatisfaction. If it exceeds expectations, the customer is delighted.`,
    hinglish:`Bolo toh... 'Insurance mein product nahi, experience bikta hai!'`,
    example:`Two medical shops sell same medicine. Shop A rude and slow. Shop B remembers your name, calls when medicine is running out. Which shop will you return to? That's customer service in insurance!`,
    quiz:`The goal of every insurance company should be to _____ its customers?`,
    opts:['Confuse', 'Delight', 'Ignore', 'Rush'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH02-T02', ch:2, subject:'Customer Service',
    title:'SERVQUAL — 5 Pillars of Service Quality',
    nutshell:`SERVQUAL model defines great service with 5 dimensions: Reliability (dependable), Responsiveness (prompt), Assurance (knowledge+trust), Empathy (caring), and Tangibles (physical environment).`,
    hinglish:`Bolo toh... 'Ye paanch cheezein hain toh customer kabhi nahi jayega!'`,
    example:`Think of favourite teacher: Always on time (Reliability). Answers doubts immediately (Responsiveness). Knows subject deeply (Assurance). Cares if you understood (Empathy). Clean classroom (Tangibles).`,
    quiz:`'The human touch' — caring attitude and personal attention — is called what in SERVQUAL?`,
    opts:['Reliability', 'Tangibles', 'Empathy', 'Assurance'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH02-T03', ch:2, subject:'Customer Service',
    title:'Customer Lifetime Value (CLV)',
    nutshell:`Customer Lifetime Value is the sum of economic benefits that can be derived from a long-term customer relationship. One happy customer = years of renewals + referrals + new policies.`,
    hinglish:`Bolo toh... 'Ek customer — ek sale nahi, ek khazana hai!'`,
    example:`Make one friend in school → invited to birthday → meet 10 more friends. One happy insurance customer refers 5 families → each buys policies → each renews for 20 years = CLV of one relationship!`,
    quiz:`Customer Lifetime Value is defined as?`,
    opts:['Total sales in one year', 'Sum of economic benefits from a long-term customer relationship', 'Number of policies sold', 'Commission earned in one month'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH02-T04', ch:2, subject:'Customer Service',
    title:'Agent\'s Role at Point of Sale — Best Advice',
    nutshell:`At point of sale, the agent's most important duty is giving BEST ADVICE — especially recommending the correct Sum Assured based on the customer's actual need, not the agent's commission interest.`,
    hinglish:`Bolo toh... 'Sahi advice = sahi product = khush customer = lamba rishta!'`,
    example:`Doctor doesn't give most expensive medicine — gives RIGHT medicine for YOUR illness. Insurance agent is like a doctor: diagnose what customer needs, prescribe right plan — not highest commission one!`,
    quiz:`At the Point of Sale, the most critical issue the agent must address is?`,
    opts:['Fastest claim settlement', 'Determining the right amount of Sum Assured', 'Collecting premium', 'Filing nomination form'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH02-T05', ch:2, subject:'Customer Service',
    title:'Agent\'s Role — Proposal to Claims',
    nutshell:`An agent's role spans 4 stages: Proposal (filling form), Acceptance (FPR + policy delivery), Premium payment reminders, and Claim settlement support. The job never truly ends after selling!`,
    hinglish:`Bolo toh... 'Agent sirf salesperson nahi — lifetime ka saathi hai!'`,
    example:`Travel agent doesn't just book ticket — helps pack, reminds about visa, helps if flight cancelled, welcomes you back. Insurance agent same across 4 stages: Proposal → Acceptance → Premiums → Claims.`,
    quiz:`True or False: Once a policy is sold, the agent's job is complete?`,
    opts:['True', 'False', 'Only for first 2 years', 'Only until premium is paid'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH02-T06', ch:2, subject:'Customer Service',
    title:'Communication — Verbal, Written, Non-Verbal',
    nutshell:`Insurance agents communicate through oral, written, and non-verbal means. Non-verbal communication (body language, posture, eye contact) accounts for majority of the impression created with a customer.`,
    hinglish:`Bolo toh... 'Shabd zyada nahi, andaaz zyada bolta hai!'`,
    example:`Two agents say 'Namaste, aapka swagat hai!' — one says it while looking at phone, slouching. Other stands tall with eye contact and warm smile. Same words, totally different experience. Second agent already won!`,
    quiz:`Which type of communication uses body language, gestures and facial expressions?`,
    opts:['Oral', 'Written', 'Non-verbal', 'Digital'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH02-T07', ch:2, subject:'Customer Service',
    title:'Active Listening — The Superpower of Great Agents',
    nutshell:`Active listening means understanding the complete message — not just hearing words. It involves paying attention, demonstrating understanding, giving feedback, not judging, and responding with empathy.`,
    hinglish:`Bolo toh... 'Sunna sabko aata hai, samajhna sirf acche agents ko!'`,
    example:`Friend tells you a problem. You keep looking at phone saying 'haan haan' = HEARING. But you put phone down, look at them, nod, ask 'aur phir kya hua?' = ACTIVE LISTENING. Customer feels valued!`,
    quiz:`Active Listening means?`,
    opts:['Hearing words only', 'Recording the conversation', 'Understanding the complete message, not just the words', 'Talking more than the customer'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH03-T01', ch:3, subject:'Grievance & Redressal',
    title:'Why Grievance Redressal Exists',
    nutshell:`Insurance customers can't inspect what they're buying before purchase — disputes arise. IRDAI created a strong 3-tier complaint system: Insurance company → Consumer Forum / IGMS → Insurance Ombudsman.`,
    hinglish:`Bolo toh... 'IRDAI kehta hai — agar koi galat kare, hum hain na!'`,
    example:`Buy lunchbox online → arrives broken → seller ignores. Complain to Amazon → resolved in 2 days. IRDAI is like Amazon's customer support — the final referee when your insurer doesn't listen!`,
    quiz:`Who launched the Integrated Grievance Management System (IGMS)?`,
    opts:['LIC', 'IRDAI', 'Ministry of Finance', 'RBI'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH03-T02', ch:3, subject:'Grievance & Redressal',
    title:'IGMS — Integrated Grievance Management System',
    nutshell:`IGMS is IRDAI's online portal at policyholder.gov.in where any policyholder can register complaints against their insurer. It tracks complaints and mandates response within specified turnaround times (TAT).`,
    hinglish:`Bolo toh... 'Online complaint karo, IRDAI track karega — company ko jawab dena hi padega!'`,
    example:`School complaint box — any student can drop a note. Principal reads every note and makes teachers respond. IGMS is that complaint box for all of India's insurance customers, online, 24/7.`,
    quiz:`IGMS is a central repository for?`,
    opts:['Insurance premium data', 'Insurance grievance data', 'Agent licensing', 'Policy documents'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH03-T03', ch:3, subject:'Grievance & Redressal',
    title:'Consumer Protection Act 1986 — Three Tiers',
    nutshell:`Consumer Protection Act 1986 gives every insurance customer legal rights. Three-tier system: District Forum (up to ₹20 Lakhs), State Commission (₹20L to ₹1 Crore), National Commission (above ₹1 Crore).`,
    hinglish:`Bolo toh... 'Consumer ka haq hai — koi bhi company, kuch bhi kare, court mein jawab dena padega!'`,
    example:`Buy branded water bottle — it leaks. Company ignores you. Consumer law lets you walk into District Forum (like small court), file FREE complaint, get money back + compensation. Same for insurance claim rejection!`,
    quiz:`District Forum handles complaints where claim value is up to?`,
    opts:['₹5 Lakh', '₹10 Lakh', '₹20 Lakh', '₹1 Crore'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH03-T04', ch:3, subject:'Grievance & Redressal',
    title:'Insurance Ombudsman — The Final Referee',
    nutshell:`Insurance Ombudsman is an independent, free, fast complaint resolution authority. If insurer ignores or rejects your complaint, Ombudsman steps in as neutral referee. Max award ₹20 Lakh. Decision in 3 months.`,
    hinglish:`Bolo toh... 'Ombudsman = insurance ka supreme judge — free, fast, fair!'`,
    example:`Cricket match — players argue about catch. Third umpire watches replay and gives final decision — nobody can argue. Ombudsman = third umpire of insurance disputes. Decision is final; company must comply.`,
    quiz:`Maximum award the Ombudsman can give is?`,
    opts:['₹5 Lakh', '₹10 Lakh', '₹20 Lakh', '₹50 Lakh'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH03-T05', ch:3, subject:'Grievance & Redressal',
    title:'When and How to Approach the Ombudsman',
    nutshell:`First complain to insurance company. If they reject or don't reply within 1 month → approach Ombudsman. Must file within 1 year of insurer rejection. Complaint must not be pending in court/consumer forum.`,
    hinglish:`Bolo toh... 'Pehle company se maango, agar nahi mila — tab Ombudsman ke paas jao!'`,
    example:`School canteen overcharges. Step 1: Complain to canteen owner. Step 2: Ignored for a month → complain to Principal. Step 3: Principal gives decision in 3 months. Same 3-step process with insurance!`,
    quiz:`Ombudsman recommendations must be made within how many months of receiving the complaint?`,
    opts:['1 month', '2 months', '3 months', '6 months'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH04-T01', ch:4, subject:'Agent Regulations',
    title:'Why Insurance Regulations Exist',
    nutshell:`Insurance regulations primarily protect policyholders — ensuring companies are financially sound, legally valid, pay claims promptly, cover rural areas, and license all intermediaries properly.`,
    hinglish:`Bolo toh... 'Regulation hai toh guarantee hai — warna sab wild west ho jaata!'`,
    example:`Highway with no traffic rules = chaos! IRDAI is the traffic control system of the insurance highway — making sure every company drives safely and customers reach their destination (claim) safely.`,
    quiz:`The prime purpose of insurance regulation is to?`,
    opts:['Collect taxes', 'Protect the policyholder', 'Increase company profits', 'Reduce competition'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH04-T02', ch:4, subject:'Agent Regulations',
    title:'Insurance Act 1938 — The Foundation Law',
    nutshell:`Insurance Act 1938 is the mother law of Indian insurance. Effective 1st July 1939. Key sections: Sec 3 (registration), Sec 41 (no rebates), Sec 42 (agent licensing), Sec 45 (3-year incontestability), Sec 64V (solvency).`,
    hinglish:`Bolo toh... '1938 mein bana tha, aaj bhi zinda hai — ye hai Insurance ka Constitution!'`,
    example:`India's Constitution written in 1949 — still supreme law with amendments. Insurance Act 1938 is same for insurance world — India's first proper insurance rulebook, still running the show!`,
    quiz:`The Insurance Act 1938 came into effect on?`,
    opts:['1st Jan 1938', '1st July 1939', '1st Sep 1956', '1st April 2000'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH04-T03', ch:4, subject:'Agent Regulations',
    title:'IRDAI Act 1999 — The Modern Regulator',
    nutshell:`IRDAI (Insurance Regulatory and Development Authority of India) formed in April 2000 by IRDA Act 1999 — independent statutory body to protect policyholders, regulate, promote and ensure orderly growth of insurance.`,
    hinglish:`Bolo toh... 'IRDAI = Insurance ka RBI — independent, powerful, policyholder ka dost!'`,
    example:`RBI controls banks — makes sure they don't cheat customers, don't go bankrupt, follow rules. IRDAI does same for insurance companies. Created in 2000 when private companies entered — somebody had to be watchdog!`,
    quiz:`IRDAI was established in which year?`,
    opts:['1938', '1956', '1999', '2000'],
    correct:3, difficulty:'Easy'
  },
  {
    id:'CH04-T04', ch:4, subject:'Agent Regulations',
    title:'How to Become a Licensed Insurance Agent',
    nutshell:`To get an agent license: Minimum 12th pass (urban, pop >5000) or 10th pass (rural), complete 50 hours practical training, pass IC38 exam, apply with ₹250 fee. License valid 3 years. Renewal needs 25 hrs training.`,
    hinglish:`Bolo toh... 'License ke bina insurance bechna = bina licence ke gaadi chalana — illegal!'`,
    example:`Getting insurance agent license like driving license: Study rules (training), Give test (IC38 exam), Get license (3-year validity), Renew it (25 hrs training + fee). Drive without license = illegal!`,
    quiz:`First-time applicant for insurance agent license must complete how many hours of practical training?`,
    opts:['25 hours', '50 hours', '75 hours', '100 hours'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH04-T05', ch:4, subject:'Agent Regulations',
    title:'Agent\'s Code of Conduct — Do\'s and Don\'ts',
    nutshell:`IRDAI mandates strict code of conduct for agents. MUST DO: Show license, disclose commission, help in claims, advise nomination. MUST NOT DO: Sell without license, offer rebates, induce wrong information, misrepresent.`,
    hinglish:`Bolo toh... 'Agent ka dhandha trust pe chalta hai — code of conduct hi uski neev hai!'`,
    example:`Doctor has Hippocratic Oath — rules to never harm a patient. Agent has Code of Conduct — rules to never mislead, cheat, or harm a customer. Both are sacred professional promises!`,
    quiz:`An agent offering rebates (discounts) on premium is?`,
    opts:['A great sales strategy', 'Perfectly legal', 'Illegal under Sec 41 of Insurance Act', 'Encouraged by IRDAI'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH04-T06', ch:4, subject:'Agent Regulations',
    title:'Adverse Selection — What Agents Must Watch For',
    nutshell:`Adverse selection (anti-selection) occurs when an applicant at greater-than-normal risk conceals information to get insurance at standard rates. This harms the insurance pool. Agents must report adverse habits via confidential report.`,
    hinglish:`Bolo toh... 'Beemar hokar healthy batao, insurance lo — ye dhoka hai, ye anti-selection hai!'`,
    example:`School picnic: everyone pays ₹100. One student secretly knows they'll eat 10× more but still pays ₹100. Unfair! Adverse selection in insurance = same. Agent must report suspicious signs to insurer.`,
    quiz:`Adverse selection means?`,
    opts:['Agent selecting best products to sell', 'Insurer rejecting high-risk customers', 'Applicant hiding risk information to get insurance', 'IRDAI cancelling agent licenses'],
    correct:2, difficulty:'Hard'
  },
  {
    id:'CH05-T01', ch:5, subject:'Legal Principles',
    title:'Utmost Good Faith (Uberrimae Fidei)',
    nutshell:`Insurance contracts require COMPLETE honesty from both parties. The insured must voluntarily disclose all material facts — even if not asked. Hiding facts = insurer's liability becomes void. Latin: Uberrimae Fidei.`,
    hinglish:`Bolo toh... 'Insurance mein poori sachhai — kuch bhi chupaoge toh claim nahi milega!'`,
    example:`You go to doctor and hide that you smoke 20 cigarettes/day. Doctor prescribes wrong medicine. You get sicker. Same in insurance — hide diabetes, later claim for it = company can legally reject your claim. Honesty = protection.`,
    quiz:`If a customer hides a pre-existing illness while buying insurance, the company can?`,
    opts:['Still pay the claim', 'Void the policy and reject the claim', 'Reduce the premium', 'Give a warning only'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH05-T02', ch:5, subject:'Legal Principles',
    title:'Insurable Interest',
    nutshell:`You can only insure what you have a financial stake in. If the insured item/person is destroyed or dies, you must suffer a FINANCIAL LOSS. You automatically have insurable interest in your own life, spouse, children, employer.`,
    hinglish:`Bolo toh... 'Apna loss hoga tabhi insurance milega — doosre ka nahi!'`,
    example:`YOUR cycle stolen = financial loss for you → can insure it. Friend's cycle stolen = you don't lose money → CANNOT insure it. In life insurance: own life, spouse, children, business partner = insurable.`,
    quiz:`A person ALWAYS has insurable interest in?`,
    opts:['Neighbour\'s property', 'Their own life', 'Friend\'s business', 'Colleague\'s car'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH05-T03', ch:5, subject:'Legal Principles',
    title:'Principle of Indemnity',
    nutshell:`Insurance pays ONLY the actual loss — nothing more. Purpose is to RESTORE the insured to pre-loss financial position, not to make a profit. Indemnity does NOT apply to life insurance (life has no market value).`,
    hinglish:`Bolo toh... 'Insurance se paisa nahi kamao — sirf nuksan ki bhaarpai karo!'`,
    example:`3-year-old phone worth ₹8,000 stolen. Insured for ₹15,000 (original price). Company pays only ₹8,000 (current value) — not ₹15,000. Because insurance restores you to pre-loss position, not upgrades you!`,
    quiz:`The Principle of Indemnity ensures that?`,
    opts:['Insured profits from insurance', 'Insured is restored to pre-loss position', 'Insured gets more than actual loss', 'Company profits from every claim'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH05-T04', ch:5, subject:'Legal Principles',
    title:'Principle of Subrogation',
    nutshell:`After insurer pays the claim, they step into the insured's shoes and can recover money from the party that caused the loss. This prevents the insured from getting double compensation. Doesn't apply to life insurance.`,
    hinglish:`Bolo toh... 'Company ne tumhara paisa diya — ab company hi uss galti wale se paisa vasool karegi!'`,
    example:`Reckless driver crashes your car. Insurer pays ₹1 lakh to repair it. Now insurer can sue the reckless driver to recover ₹1 lakh — they've taken over your legal rights against that driver. No double profit!`,
    quiz:`After paying a claim, the insurer's right to recover money from the party that caused the loss is called?`,
    opts:['Indemnity', 'Contribution', 'Subrogation', 'Good faith'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH05-T05', ch:5, subject:'Legal Principles',
    title:'Principle of Contribution',
    nutshell:`If the same asset is insured with two or more companies, each company shares the loss proportionately — you cannot collect full amount from each. Total payout never exceeds actual loss.`,
    hinglish:`Bolo toh... 'Do companies se ek hi cheez ka double paisa — impossible! Dono milke denge, magar sirf actual loss!'`,
    example:`Shop worth ₹10L insured with Company A (₹10L) AND Company B (₹10L). Shop burns. Loss = ₹10L. Cannot claim ₹10L from A AND ₹10L from B (= ₹20L profit!). Each pays ₹5L = ₹10L total = exact loss.`,
    quiz:`Principle of Contribution applies when?`,
    opts:['One insurer pays excess amount', 'Same risk is insured with more than one insurer', 'Insured hides information', 'Claim is rejected'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH05-T06', ch:5, subject:'Legal Principles',
    title:'Principle of Proximate Cause',
    nutshell:`When a loss occurs, insurers look for the NEAREST and most DIRECT cause. Only if that proximate cause is covered in the policy will the claim be paid. Remote causes are not considered.`,
    hinglish:`Bolo toh... 'Claim milega sirf tabhi jab direct aur main reason policy mein covered ho!'`,
    example:`Man falls from bike (accident) → breaks leg → hospital → infection → dies. PROXIMATE (nearest) cause = accident. If policy covers accidents, claim paid. If only illness covered — claim complicated.`,
    quiz:`Proximate Cause in insurance means?`,
    opts:['Most remote cause of loss', 'Most indirect cause', 'Nearest and most direct cause of loss', 'Any cause that led to loss'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH06-T01', ch:6, subject:'Life Insurance Concepts',
    title:'Human Life Value (HLV)',
    nutshell:`Human Life Value is the economic value of a person's future earning potential. HLV = total future income the person would have earned minus personal expenses. This determines the ideal life insurance cover needed.`,
    hinglish:`Bolo toh... 'Tumhari life ki economic value = HLV — yahi amount insure karo!'`,
    example:`Rahul earns ₹5L/year. Has 25 working years left. HLV ≈ ₹1.25 crore. If Rahul dies tomorrow, family loses ₹1.25 crore of future income. Life insurance replaces that lost income!`,
    quiz:`HLV (Human Life Value) helps determine?`,
    opts:['Premium amount', 'How much life insurance cover you need', 'Policy term', 'Company\'s profit'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH06-T02', ch:6, subject:'Life Insurance Concepts',
    title:'The Concept of Mutuality in Life Insurance',
    nutshell:`Life insurance works on mutuality — thousands of people pool premiums together. The few who die receive compensation while the many who survive keep the pool funded. This sharing mechanism is called mutuality.`,
    hinglish:`Bolo toh... 'Hum sab milke premium bharte hain — jisko zaroorat padti hai use milta hai!'`,
    example:`1,000 people each pay ₹10,000/year → pool = ₹1 crore/year. Statistically 5 people die. Each dead person's family gets ₹20 lakh. The pool makes it possible! No single person could save ₹20L alone.`,
    quiz:`The concept of Mutuality in life insurance means?`,
    opts:['Only one person benefits', 'The insurer keeps all premiums', 'Many contribute to protect the few who suffer loss', 'Government funds the claims'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH06-T03', ch:6, subject:'Life Insurance Concepts',
    title:'Level Premiums — Why They Stay the Same',
    nutshell:`In life insurance, the premium remains constant throughout the policy term even though the risk of death increases with age. Early years the insured overpays (building reserve). Later years they underpay (using reserve).`,
    hinglish:`Bolo toh... 'Umar badhti hai, risk badhta hai — par premium nahi badhta! Ye hai level premium ki kamal!'`,
    example:`Gym charges ₹1,000/month for all members — young and old — though older members use physiotherapy more. Life insurance same: at 25 you're low risk but pay fixed amount. At 55 still pay same fixed amount.`,
    quiz:`Level premium means?`,
    opts:['Premium increases with age', 'Premium decreases with age', 'Premium remains constant throughout the policy', 'Premium is paid only once'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH07-T01', ch:7, subject:'Financial Planning',
    title:'What is Financial Planning and Why It Matters',
    nutshell:`Financial planning is a process to identify goals, assess current net worth, estimate future needs, and create a strategy to meet them. Insurance is the contingency component — protection against the unexpected.`,
    hinglish:`Bolo toh... 'Paisa khud nahi bolta — tu plan karo, paisa sunegaa!'`,
    example:`Planning a road trip: Know starting point (current savings), destination (retirement goal), fuel needed (monthly savings), backup plan (insurance if car breaks down). Financial planning = money's road trip plan!`,
    quiz:`The RIGHT time to start financial planning is?`,
    opts:['At age 40', 'After marriage', 'When you receive your first salary', 'At retirement'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH07-T02', ch:7, subject:'Financial Planning',
    title:'The Individual Life Cycle — Needs Change With Age',
    nutshell:`Financial needs change dramatically across life stages: 20s (protection focus), 30s (savings+protection), 40s (education planning), 60s (retirement income). Different insurance products suit each stage.`,
    hinglish:`Bolo toh... 'Umar ke saath zaroorat badalti hai — plan bhi badlo!'`,
    example:`At 22 need term insurance. At 30 endowment for home. At 45 money back for children's education. At 60 pension/annuity for retirement income. One product never fits all stages!`,
    quiz:`Which product is most suitable for retirement income planning?`,
    opts:['Term Insurance', 'Health Insurance', 'Annuity/Pension Plan', 'Money Back Plan'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH07-T03', ch:7, subject:'Financial Planning',
    title:'Types of Financial Products — Where Insurance Fits',
    nutshell:`Financial products serve specific needs: Transactional (daily cash - bank deposits), Contingency (unexpected events - insurance), Wealth Accumulation (long-term - shares/bonds), Capital Appreciation (real estate). Insurance = contingency product.`,
    hinglish:`Bolo toh... 'Insurance = protection ka product — investment nahi! Dono alag cheezein hain!'`,
    example:`Kitchen tools: knife (cutting), spoon (eating), plate (serving). Similarly: FD = transactional (daily cash). Insurance = contingency (unexpected). Shares = wealth creation. Real Estate = capital growth.`,
    quiz:`Insurance is classified as which type of financial product?`,
    opts:['Transactional', 'Wealth Accumulation', 'Contingency', 'Capital Appreciation'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH08-T01', ch:8, subject:'Life Insurance Products',
    title:'Term Insurance — Pure Protection',
    nutshell:`Term insurance is the purest and cheapest life insurance — maximum cover at minimum premium. Death during term = family gets sum assured. Survival at term end = nothing paid (basic plans). No cash value.`,
    hinglish:`Bolo toh... 'Seedha sauda — maro toh paisa milega, jiyo toh safety milegi!'`,
    example:`Renting a security guard: you pay monthly. If something goes wrong, guard handles it. If nothing goes wrong for 10 years — guard leaves, payments done, but you had peace of mind. Term insurance = the security guard!`,
    quiz:`Term insurance is called 'pure protection plan' because?`,
    opts:['It has investment returns', 'It provides only death benefit with no survival benefit', 'It\'s the most expensive plan', 'It covers health too'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH08-T02', ch:8, subject:'Life Insurance Products',
    title:'Whole Life Insurance',
    nutshell:`Whole life insurance covers the policyholder for their ENTIRE life. The sum assured is paid whenever death occurs — whether at 45 or 95. The claim is CERTAIN (only timing is uncertain). Higher premium than term.`,
    hinglish:`Bolo toh... 'Poori zindagi coverage — kabhi bhi maro, family ko paisa zaroor milega!'`,
    example:`Term insurance = renting a house (fixed period). Whole life = buying a house (permanent protection). The 'rent' (premium) may stop at 65, but you own the house (coverage) forever!`,
    quiz:`In whole life insurance, when is the claim paid?`,
    opts:['Only if death occurs within 30 years', 'Only at maturity', 'Whenever death occurs — guaranteed', 'Only if premium is paid for 20 years'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH08-T03', ch:8, subject:'Life Insurance Products',
    title:'Endowment Plans — Protection + Savings',
    nutshell:`Endowment plans combine life cover with savings. Death during term = family gets sum assured immediately. Survival to end of term = policyholder gets maturity amount (SA + bonus). Win-win structure.`,
    hinglish:`Bolo toh... 'Jiyo toh paisa — maro toh paisa — har haal mein paisa!'`,
    example:`Recurring deposit where bank ALSO insures your life. Put ₹5,000/month for 20 years. Die in year 5 → family gets ₹10L immediately. Survive 20 years → you get ₹10L + bonus at maturity. Can't lose!`,
    quiz:`In an endowment plan, if the policyholder survives the full term?`,
    opts:['No benefit paid', 'Nominee gets amount', 'Policyholder receives maturity amount', 'Premium is refunded only'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH08-T04', ch:8, subject:'Life Insurance Products',
    title:'Money Back Plans — Periodic Payouts',
    nutshell:`Money back plans pay a percentage of sum assured at regular intervals DURING the policy term (survival benefits). Full life cover continues throughout. Final payout at maturity includes remaining SA + bonus.`,
    hinglish:`Bolo toh... 'Beech beech mein paisa milta rehta hai — rukna nahi padta!'`,
    example:`Fixed deposit that pays interest every quarter instead of at the end — that's money back plan. Periodic survival benefits every 4-5 years + full death cover throughout + final payout at maturity.`,
    quiz:`Money back plans are best suited for?`,
    opts:['People who want lump sum only at end', 'People with no immediate cash needs', 'People wanting periodic payouts for planned expenses', 'People who want no life cover'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH08-T05', ch:8, subject:'Life Insurance Products',
    title:'Participating vs Non-Participating Plans',
    nutshell:`Participating (PAR/with-profits) plans share insurer's profits via bonus additions. Non-participating (Non-PAR/without-profits) plans offer fixed guaranteed benefits with no bonus. Term = Non-PAR. Endowment = PAR (usually).`,
    hinglish:`Bolo toh... 'PAR mein company ka munafa share milta hai — Non-PAR mein nahi!'`,
    example:`Restaurant A (PAR) — you're a partner, when profits good you get extra food free! Restaurant B (Non-PAR) — fixed menu, fixed price, no extras but guaranteed. PAR = potentially more rewarding. Non-PAR = guaranteed.`,
    quiz:`Term insurance is which type of plan?`,
    opts:['Participating', 'Non-Participating', 'Both', 'Neither'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH09-T01', ch:9, subject:'ULIPs & Modern Products',
    title:'Limitations of Traditional Plans',
    nutshell:`Traditional insurance plans (endowment, money back) have key weaknesses: opaque investment returns (you can't see how money grows), low returns, no control over investment mix, and rigid structure.`,
    hinglish:`Bolo toh... 'Traditional plan = safe hai par boring hai — returns pata nahi, control nahi!'`,
    example:`Give ₹1,000/month to friend to invest — can NEVER see what he's doing, he never tells returns, can't change investment style. Frustrating! Traditional insurance felt exactly this — until ULIPs arrived.`,
    quiz:`The biggest limitation of traditional insurance plans is?`,
    opts:['Very high premium', 'Lack of transparency in returns and investment', 'No life cover', 'Too many options'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH09-T02', ch:9, subject:'ULIPs & Modern Products',
    title:'Unit Linked Insurance Plans (ULIPs)',
    nutshell:`ULIPs combine life insurance + market-linked investment. Part of premium buys life cover (mortality charge); the rest is invested in funds (equity/debt/balanced) chosen by the policyholder. Fully transparent.`,
    hinglish:`Bolo toh... 'ULIP = Insurance + Investment — do kaam ek product mein!'`,
    example:`Thali (plate): Term insurance = just the dal (protection). ULIP = full thali (protection + rice/sabzi/investment). You can even choose the proportion — want more rice (equity)? Less dal? You decide!`,
    quiz:`ULIP stands for?`,
    opts:['Universal Life Insurance Plan', 'Unit Linked Insurance Plan', 'Unified Life Interest Policy', 'Universal Linked Investment Product'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH09-T03', ch:9, subject:'ULIPs & Modern Products',
    title:'ULIP Fund Types — Equity, Debt, Balanced',
    nutshell:`ULIPs offer multiple fund options: Equity funds (high risk, high potential return — stocks), Debt funds (low risk, stable return — bonds), Balanced/Hybrid funds (mix of both). Policyholder can switch anytime.`,
    hinglish:`Bolo toh... 'Risk lena ho toh equity, safe rehna ho toh debt, dono chahiye toh balanced!'`,
    example:`Cricket batting strategies: Equity Fund = aggressive opener (hits sixes — may get out early). Debt Fund = defensive number 3 (steady, scores slowly). Balanced = all-rounder (moderate risk, moderate return).`,
    quiz:`Which ULIP fund type is most suitable for a conservative, near-retirement investor?`,
    opts:['Equity Fund', 'Balanced Fund', 'Debt Fund', 'Any fund — all are same'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH10-T01', ch:10, subject:'Insurance Applications',
    title:'Life Insurance for Individuals — Key Needs',
    nutshell:`Life insurance serves multiple individual needs: income replacement (family breadwinner), loan protection (home/education loans), children's education, retirement planning, and estate planning.`,
    hinglish:`Bolo toh... 'Insurance ek hai, zarooratein kai hain — sahi plan sahi zaroorat ke liye!'`,
    example:`House without foundation = looks fine today but one earthquake (untimely death) and everything collapses. Insurance = the foundation that holds the family even when the main pillar falls.`,
    quiz:`Which type of insurance directly protects a home loan in case of borrower's death?`,
    opts:['Health Insurance', 'Mortgage/Home Loan Protection Plan', 'Money Back Plan', 'ULIP'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH10-T02', ch:10, subject:'Insurance Applications',
    title:'Keyman Insurance — Protecting Businesses',
    nutshell:`Keyman insurance is taken by a company on the life of its most critical employee. The COMPANY is both policyholder and beneficiary. If the keyman dies, company gets claim to manage financial disruption.`,
    hinglish:`Bolo toh... 'Jo company ko sabse zyada chalata hai, uski life insure karo — kyunki uske bina company ruk sakti hai!'`,
    example:`Cricket team: if Virat Kohli unavailable, team's performance and sponsorship revenue crashes. Keyman insurance = team insuring Virat's performance value. If he can't play, insurance compensates team's financial loss!`,
    quiz:`In Keyman Insurance, who is the beneficiary of the claim?`,
    opts:['Key employee\'s family', 'The company/employer', 'IRDAI', 'The insurance agent'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH10-T03', ch:10, subject:'Insurance Applications',
    title:'Partnership Insurance and Other Applications',
    nutshell:`Partnership insurance protects a business when a partner dies — remaining partners buy the deceased's share using insurance proceeds. Mortgage protection uses decreasing term plan matching reducing loan balance.`,
    hinglish:`Bolo toh... 'Partner chala gaya — insurance se uska hissa kharid lo — business chalta rahega!'`,
    example:`Three friends run a bakery together (₹30L value = ₹10L each). One friend dies. His family needs ₹10L to be bought out. Partnership insurance pays exactly this — business survives without forced sale!`,
    quiz:`In partnership insurance, the insurance payout is primarily used to?`,
    opts:['Pay off business debts', 'Buy out the deceased partner\'s share', 'Fund business expansion', 'Pay employee salaries'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH11-T01', ch:11, subject:'Pricing & Valuation',
    title:'How Premiums are Calculated — The 3 Factors',
    nutshell:`Life insurance premium is calculated scientifically using 3 factors: Mortality rate (probability of dying at each age), Interest rate (expected investment return on premiums), and Expense loading (company's operating costs).`,
    hinglish:`Bolo toh... 'Premium = Marne ka darr + Company ka kharcha + Return on money — sab milake ek number!'`,
    example:`Samosa stall pricing: Cost of ingredients (mortality) + electricity/rent (expenses) + profit margin (interest) = samosa price. Insurance premium = same formula! Actuary is the chef who calculates the exact recipe.`,
    quiz:`The three main factors in calculating life insurance premium are?`,
    opts:['Age, gender, smoking status', 'Mortality, interest, expenses', 'SA, term, riders', 'Company size, location, agent commission'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH11-T02', ch:11, subject:'Pricing & Valuation',
    title:'Mortality Tables — The Science of Life Expectancy',
    nutshell:`Mortality tables show how many out of 1,00,000 people alive at a given age die before reaching the next age. Built from massive historical data, they form the foundation of all life insurance premium calculations.`,
    hinglish:`Bolo toh... 'Mortality table = data se pata chalata hai — iss umar mein itne log marte hain, toh premium ye hoga!'`,
    example:`School attendance register tracked for every age group across millions of people over decades. At age 25 — very few die (low premium). At age 55 — more die (higher premium). Table tells insurer exact risk!`,
    quiz:`Mortality tables are primarily used to?`,
    opts:['Count hospital patients', 'Calculate life insurance premiums', 'Determine health insurance benefits', 'Measure company profits'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH11-T03', ch:11, subject:'Pricing & Valuation',
    title:'Bonus in Life Insurance — Reversionary and Terminal',
    nutshell:`PAR (participating) policies earn two types of bonus: Reversionary bonus declared annually and added to sum assured each year. Terminal bonus is a one-time additional amount paid only at maturity or death claim.`,
    hinglish:`Bolo toh... 'Har saal thoda bonus milta hai — aur last mein ek bada bonus — ye hai participating plan ki mithaas!'`,
    example:`Company employee gets annual appraisal bonus (Reversionary) every year. When retiring gets big final bonus (Terminal). Same in insurance PAR plans — policy earns extra every year + final reward when policy ends!`,
    quiz:`Reversionary bonus in a participating policy is?`,
    opts:['Paid every month', 'Declared annually and added to sum assured', 'Paid only at death', 'Same as terminal bonus'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH12-T01', ch:12, subject:'Policy Documentation',
    title:'The Proposal Form — Your First Legal Document',
    nutshell:`The proposal form is the first official legal document in the insurance journey. Filled by the applicant, it captures all information the insurer needs for underwriting. Every answer carries legal binding weight and is the basis of Utmost Good Faith.`,
    hinglish:`Bolo toh... 'Proposal form = insurance ka pehla kadam aur sabse important kadam — galat likha toh claim nahi milega!'`,
    example:`School admission form: name, age, previous school, marks, medical history. School uses it to decide whether to admit you. Insurance proposal form = same legal weight. Lies = policy cancelled = no claim!`,
    quiz:`The proposal form is the basis for which legal principle?`,
    opts:['Indemnity', 'Subrogation', 'Utmost Good Faith', 'Contribution'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH12-T02', ch:12, subject:'Policy Documentation',
    title:'Prospectus — Know Before You Buy',
    nutshell:`A prospectus is a document the insurer must provide BEFORE the customer fills the proposal form. It explains all features, benefits, exclusions, premiums, terms, and conditions of the insurance plan.`,
    hinglish:`Bolo toh... 'Prospectus = policy ka menu card — kharidne se pehle zaroor padho!'`,
    example:`Restaurant menu: price, ingredients, what's included, what's extra. The prospectus is the insurance menu. It tells you exactly what the policy covers, exclusions, cost, fine print. Agent MUST share it before proposal form signature.`,
    quiz:`A prospectus must be given to the customer?`,
    opts:['After policy issuance', 'Before the proposal form is filled', 'At the time of claim', 'Only if customer asks'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH12-T03', ch:12, subject:'Policy Documentation',
    title:'KYC — Know Your Customer',
    nutshell:`KYC (Know Your Customer) is the mandatory identity verification before issuing an insurance policy. Documents required: Proof of identity (Aadhaar/PAN), Address proof, Age proof, Income proof (high SA), Photographs.`,
    hinglish:`Bolo toh... 'Insurer pehle tumhare baare mein janegaa — tab policy dega. KYC = insurance ka Aadhaar check!'`,
    example:`Bank asks for Aadhaar, PAN, photo, address proof before opening account. That's KYC. Insurance does same — verify identity before legally issuing policy. Without KYC, anyone could buy policy in fake name and commit fraud!`,
    quiz:`KYC stands for?`,
    opts:['Know Your Company', 'Know Your Customer', 'Know Your Contract', 'Know Your Claim'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH12-T04', ch:12, subject:'Policy Documentation',
    title:'AML — Anti-Money Laundering in Insurance',
    nutshell:`PMLA (Prevention of Money Laundering Act) 2002 requires insurance companies to detect and report suspicious transactions to FIU-IND. Criminals sometimes use insurance to 'launder' black money by paying premium then surrendering.`,
    hinglish:`Bolo toh... 'Kala paisa safed karne ke liye insurance use kiya? AML pakad lega!'`,
    example:`Criminal earns ₹1 crore illegally. Pays it as insurance premium. Immediately surrenders for refund cheque. Now has ₹1 crore in legal cheque — 'washed' clean! AML rules detect and report such transactions to FIU-IND.`,
    quiz:`PMLA stands for?`,
    opts:['Premium Money Laundering Act', 'Prevention of Money Laundering Act', 'Policy Money Liability Act', 'Public Money Lending Act'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH12-T05', ch:12, subject:'Policy Documentation',
    title:'Free Look Period — Your Right to Return',
    nutshell:`After receiving the policy document, the policyholder has 15 days (regular policies) or 30 days (online/distance marketing policies) to review and return the policy for a refund if not satisfied.`,
    hinglish:`Bolo toh... 'Policy aayi, pasand nahi aayi — 15–30 din mein wapas karo, paisa wapas lo!'`,
    example:`Buy new phone online. Don't like it. Return within 7 days for full refund. Insurance's 'return policy' = Free Look Period. 15 days regular, 30 days online. If mis-sold, this is your legal right!`,
    quiz:`Free Look Period for online insurance policies is?`,
    opts:['7 days', '15 days', '30 days', '45 days'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH12-T06', ch:12, subject:'Policy Documentation',
    title:'Different Reports at Proposal Stage',
    nutshell:`Besides the proposal form, the insurer may require: Medical examination report (age/SA based), Confidential agent report, Existing policy details, Financial documents (for high SA). Higher SA = more reports needed.`,
    hinglish:`Bolo toh... 'Proposal form ke saath aur bhi reports manga sakta hai insurer — ek baar submit karo, policy jaldi milegi!'`,
    example:`Government job application: beyond the form they ask medical certificate, character certificate, previous employer reference. Insurance same — for large SA cases, medical examination, blood tests, ECG. Higher SA = more scrutiny!`,
    quiz:`A confidential report in insurance is submitted by?`,
    opts:['The customer\'s doctor', 'The insurance agent', 'IRDAI', 'The nominee'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH13-T01', ch:13, subject:'Policy Conditions',
    title:'First Premium Receipt (FPR) — The Risk Cover Begins Here',
    nutshell:`When first premium is paid, insurer issues First Premium Receipt (FPR). This is NOT the policy document but IS proof that risk cover has officially started. Date on FPR = date insurance begins. Policy document follows within 30 days.`,
    hinglish:`Bolo toh... 'FPR milte hi protection shuru — policy baad mein aayegi, par cover abhi se hai!'`,
    example:`Hotel booking confirmation email: not at hotel yet, but have confirmed room. FPR = that booking confirmation for insurance — cover has started even though formal policy document will arrive within 30 days!`,
    quiz:`When does life insurance risk cover officially begin?`,
    opts:['When proposal form is submitted', 'When the policy document arrives', 'From the date of First Premium Receipt', 'After medical examination'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH13-T02', ch:13, subject:'Policy Conditions',
    title:'The Policy Document — Your Master Agreement',
    nutshell:`The policy document is the complete legal contract between insurer and insured. It contains: Schedule (personal details), Standard Provisions (IRDAI-mandated clauses), Specific Provisions (plan features), and Exclusions.`,
    hinglish:`Bolo toh... 'Policy document = insurance ka constitution — isme likha hai toh hoga, nahi likha toh claim reject!'`,
    example:`House rental agreement: every condition written — rent, notice period, repairs. Policy document = same legal agreement with insurer. Never lose it. Always read the exclusions section first!`,
    quiz:`The section of a policy document that mentions what is NOT covered is called?`,
    opts:['Schedule', 'Endorsement', 'Exclusions', 'Standard Provisions'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH13-T03', ch:13, subject:'Policy Conditions',
    title:'Standard Provisions in Every Policy',
    nutshell:`IRDAI mandates standard provisions in ALL life insurance policies that no company can remove: Grace period, Policy revival, Loan against policy, Nomination rights, Assignment rights, Duplicate policy right.`,
    hinglish:`Bolo toh... 'Ye provisions IRDAI ne diye hain — company chahe toh bhi hata nahi sakti!'`,
    example:`Every vehicle sold in India MUST have seat belts and ABS by law. Similarly, every life insurance policy MUST have standard provisions like grace period, free look, nomination, revival. These are your non-negotiable rights!`,
    quiz:`Grace period for annual premium payment is?`,
    opts:['7 days', '15 days', '30 days', '60 days'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH14-T01', ch:14, subject:'Policy Rights & Benefits',
    title:'Grace Period — Your Extra Time to Pay',
    nutshell:`Grace period is the extra time given to pay premium after due date: 30 days for annual/half-yearly/quarterly modes, 15 days for monthly mode. Policy remains in force during grace period. Death during grace period: claim paid minus unpaid premium.`,
    hinglish:`Bolo toh... 'Premium miss ho gaya? Tension mat lo — grace period mein bhi cover hai!'`,
    example:`Electricity bill due on 1st. Don't pay till 5th — they don't immediately cut connection (grace period). Annual insurance premium due in January, forgot until late January = still covered! But claim during grace = full claim minus unpaid premium.`,
    quiz:`If a policyholder dies during the grace period before paying premium, the insurer will?`,
    opts:['Reject the claim', 'Pay full claim without deduction', 'Pay claim minus unpaid premium', 'Pay only half the claim'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH14-T02', ch:14, subject:'Policy Rights & Benefits',
    title:'Policy Lapse and Revival',
    nutshell:`If premium is not paid even during grace period, policy LAPSES — cover stops. Lapsed policy can be REVIVED within 2 years by paying all overdue premiums + interest + submitting health declaration. After 2 years, fresh policy needed.`,
    hinglish:`Bolo toh... 'Policy lapse ho gayi? 2 saal ke andar wapas zinda kar sakte ho — revival karo!'`,
    example:`Mobile SIM deactivated after no recharge for 90 days. Reactivate within window by paying pending dues + reactivation fee. Policy revival = same — pay missed premiums + interest + fresh health declaration. Policy comes back to life!`,
    quiz:`A lapsed policy can be revived within how many years?`,
    opts:['1 year', '2 years', '3 years', '5 years'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH14-T03', ch:14, subject:'Policy Rights & Benefits',
    title:'Non-Forfeiture Provisions — Policy Value After 3 Years',
    nutshell:`After paying premiums for at least 3 years, if you stop paying, the policy doesn't become worthless. It converts to PAID-UP policy (reduced SA, no more premiums) OR you can get SURRENDER VALUE (cash back, less than premiums paid if early).`,
    hinglish:`Bolo toh... '3 saal ke baad premium band karo — phir bhi kuch milega! Ya Paid-Up ya Surrender Value!'`,
    example:`Paying EMI on gold loan for 3 years then can't continue. Bank doesn't take everything — gives gold proportional to what you paid. Non-forfeiture in insurance = same. After 3 years premiums, you still get something!`,
    quiz:`Non-forfeiture provisions apply only after how many years of premium payment?`,
    opts:['1 year', '2 years', '3 years', '5 years'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH14-T04', ch:14, subject:'Policy Rights & Benefits',
    title:'Nomination — Choosing Your Beneficiary',
    nutshell:`Nomination is appointing a person (nominee) to receive the death claim. Without nomination, claim process becomes complicated. Nominee can be changed anytime. If nominee is a minor, an appointee must be named to receive claim on their behalf.`,
    hinglish:`Bolo toh... 'Nominee = woh insaan jise tumhara paisa milega jab tum nahi rahoge — soch samajhkar choose karo!'`,
    example:`You have a locker at home. Tell your son: 'If anything happens to me, the key is yours.' Son = your nominee. Insurance: legally designate person to receive death claim. Update after marriage, children!`,
    quiz:`If the nominee is a minor, who is appointed to receive the claim on their behalf?`,
    opts:['Insurance agent', 'Bank manager', 'Appointee', 'IRDAI officer'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH14-T05', ch:14, subject:'Policy Rights & Benefits',
    title:'Assignment — Transferring Policy Ownership',
    nutshell:`Assignment (under Section 38 of Insurance Act) is the complete transfer of policy rights to an assignee. Types: Absolute (permanent, no conditions) and Conditional (for specific purpose like loan). Most common use: as collateral for home loan.`,
    hinglish:`Bolo toh... 'Assignment = policy ke saare rights doosre ko de do — usually bank ke liye home loan lene par!'`,
    example:`You pledge gold chain to goldsmith as loan security — goldsmith holds gold till you repay. Assignment = same for insurance policy. Bank (assignee) gets all policy rights. Fully repay loan → bank re-assigns policy back to you!`,
    quiz:`Assignment of a life insurance policy is governed by Section __ of the Insurance Act?`,
    opts:['Section 38', 'Section 41', 'Section 45', 'Section 64'],
    correct:0, difficulty:'Hard'
  },
  {
    id:'CH14-T06', ch:14, subject:'Policy Rights & Benefits',
    title:'Policy Loan, Duplicate Policy & Alterations',
    nutshell:`Three important policy privileges: Policy Loan (up to 90% of surrender value after 3 years, interest charged). Duplicate Policy (on loss of original — FIR + affidavit + fee). Alterations (changes to premium mode, SA with fresh underwriting).`,
    hinglish:`Bolo toh... 'Policy ek, kaam teen — loan lo, duplicate lo, ya badlaav karo!'`,
    example:`Your house is both home AND asset you can borrow against. Similarly, life insurance = both protection AND financial asset to borrow against in emergencies! No credit check needed — loan against your own policy value.`,
    quiz:`Policy loan can be availed up to what percentage of the surrender value?`,
    opts:['50%', '75%', '90%', '100%'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH15-T01', ch:15, subject:'Underwriting',
    title:'What is Underwriting and Why It Exists',
    nutshell:`Underwriting is the insurer's process of evaluating a proposal to decide: accept/reject, at what premium, with what conditions. Primary purpose: prevent anti-selection and ensure equity among risks — similar risks pay similar premiums.`,
    hinglish:`Bolo toh... 'Underwriting = insurer ka background check — kya ye life insure karne layak hai, aur kitne premium par?'`,
    example:`Lending library: before lending rare book, check if person is trustworthy, returned books before, might damage it. Charge higher deposit for 'risky' borrowers. Underwriting = same process for insurance. Higher risk = higher premium OR rejection.`,
    quiz:`The primary purpose of underwriting is?`,
    opts:['Maximise company profits', 'Prevent anti-selection and ensure equity among risks', 'Train agents', 'Process claims faster'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH15-T02', ch:15, subject:'Underwriting',
    title:'Risk Classification — Standard, Preferred, Sub-Standard, Declined',
    nutshell:`Underwriters classify applicants into 4 categories: Preferred lives (lower than standard premium — very healthy), Standard lives (normal published rates — majority), Sub-Standard (accepted with extra premium loading), Declined (too risky to accept).`,
    hinglish:`Bolo toh... 'Sabka risk alag alag hota hai — insurer 4 categories mein baanta hai!'`,
    example:`Banks rate credit cards: Excellent score = Platinum card (best terms). Good = Gold card. Average = Basic card with limits. Poor = No card. Insurance underwriting works same — your 'risk score' determines category!`,
    quiz:`Preferred lives in underwriting get?`,
    opts:['Higher premium', 'Policy declined', 'Lower than standard premium', 'Same premium as standard lives'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH15-T03', ch:15, subject:'Underwriting',
    title:'Non-Medical vs Medical Underwriting',
    nutshell:`Non-medical underwriting: decision based on proposal form only — used for younger applicants with smaller SA. Medical underwriting: involves physical examination, blood/urine tests, ECG — required for older applicants or high sum assured.`,
    hinglish:`Bolo toh... 'Chota SA, kam umar — medical exam nahi · Bada SA, zyada umar — doctor ke paas jaana padega!'`,
    example:`Library card vs home loan. Library card: just note your details (non-medical). Home loan: check income, CIBIL, property, everything (medical-equivalent). Higher stakes = more scrutiny. Same in insurance!`,
    quiz:`Non-medical proposals are accepted based primarily on?`,
    opts:['Agent\'s recommendation', 'The information given in the proposal form', 'Doctor\'s certificate only', 'Company\'s profit targets'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH15-T04', ch:15, subject:'Underwriting',
    title:'Hazard Types — Moral, Physical, Occupational',
    nutshell:`Three types of hazards assessed in underwriting: Moral hazard (character, intentions, lifestyle habits — e.g. criminal background). Physical hazard (body conditions — diabetes, obesity, hypertension). Occupational hazard (job risks — miners, drivers, stuntmen).`,
    hinglish:`Bolo toh... 'Hazard teen prakar — character ka, body ka, aur kaam ka — teeno dekha jaata hai underwriting mein!'`,
    example:`Three types of risky car renters: Moral = person who previously faked accident claim. Physical = person with bad eyesight who hasn't told anyone. Occupational = person who drives in a quarry all day. Insurance checks ALL three!`,
    quiz:`A deep-sea diver is an example of which type of hazard?`,
    opts:['Moral hazard', 'Physical hazard', 'Occupational hazard', 'Financial hazard'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH15-T05', ch:15, subject:'Underwriting',
    title:'Agent as Primary Underwriter',
    nutshell:`IRDAI calls agents the 'field underwriters' or 'primary underwriters' because they are the first to assess a proposer at ground level. Agents can observe risk factors that don't appear on paper and must report these via confidential report.`,
    hinglish:`Bolo toh... 'Agent = pehla underwriter — woh dekhta hai jo form pe nahi likha hota!'`,
    example:`Hospital front desk nurse checks temperature and basic vitals before doctor sees you — she's the first screener. Insurance agent is exactly this: meets customer, notices health red flags, checks if story adds up, writes confidential report.`,
    quiz:`Why is an insurance agent called the primary underwriter?`,
    opts:['They calculate premiums', 'They are the first to assess the proposer and screen for risk', 'They issue the policy', 'They approve all claims'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH16-T01', ch:16, subject:'Claims & Payments',
    title:'Types of Claims in Life Insurance',
    nutshell:`Four types of life insurance claims: Maturity Claim (policy term completed, SA+bonus paid to policyholder), Survival Benefit (periodic payout in money-back plans), Surrender Claim (early exit), Death Claim (most critical — nominee/assignee receives).`,
    hinglish:`Bolo toh... 'Life insurance mein paisa sirf marne par nahi milta — jiyo toh bhi milta hai, surrender karo toh bhi!'`,
    example:`Cricket match claims: Maturity = match completed fully (everyone gets share). Survival Benefit = hitting six at specific overs (periodic payouts). Surrender = retiring mid-game (less payout). Death = player leaves unexpectedly (family gets full amount).`,
    quiz:`Death claim under a life insurance policy is payable to?`,
    opts:['Policyholder', 'Nominee or Assignee', 'IRDAI', 'The insurance agent'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH16-T02', ch:16, subject:'Claims & Payments',
    title:'Death Claim Process — Step by Step',
    nutshell:`Death claim process: Intimate insurer immediately → Fill claim form → Submit documents (death certificate, policy, claimant ID, medical records/FIR) → Insurer verifies within 30 days → Payment by NEFT to nominee. Agent must proactively support the family.`,
    hinglish:`Bolo toh... 'Death claim mein ghabrana nahi — documents sahi se jama karo, 30 din mein paisa milega!'`,
    example:`Government employee family files for pension/gratuity after retirement: specific forms + documents needed. Insurance death claim similar. Nominee collects forms, submits with proof, company processes in 30 days. Good agent STAYS with family through entire process!`,
    quiz:`How many days does an insurer have to settle a life insurance death claim after receiving all documents?`,
    opts:['7 days', '15 days', '30 days', '60 days'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH16-T03', ch:16, subject:'Claims & Payments',
    title:'Early Death Claims and Section 45',
    nutshell:`If death occurs within 3 years of policy issuance or revival, insurer conducts special investigation. After 3 years, Section 45 protects the policyholder — insurer CANNOT reject claim unless they prove FRAUD. After 3 years = only fraud can void policy.`,
    hinglish:`Bolo toh... '3 saal ke andar death claim? Insurer zyada jaanch karega — yahi niyam hai! Aur 3 saal ke baad — Section 45 tumhari raksha karega!'`,
    example:`Someone buys car insurance knowing car is already in accident. Claims immediately. Companies know this pattern! Early death claim investigation catches similar insurance fraud. After 3 years, Section 45 protects honest policyholders.`,
    quiz:`Under Section 45 of the Insurance Act, after how many years cannot a policy be called in question?`,
    opts:['1 year', '2 years', '3 years', '5 years'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH16-T04', ch:16, subject:'Claims & Payments',
    title:'Surrender Value — Exiting Early',
    nutshell:`Surrendering = voluntarily terminating policy before maturity for cash. Two types: Guaranteed Surrender Value (minimum guaranteed in policy document) and Special Surrender Value (usually higher, declared by insurer). Zero SV in first 2 years.`,
    hinglish:`Bolo toh... 'Surrender karna padega? Theek hai — kuch paisa toh milega — par sab nahi!'`,
    example:`Break FD before maturity: bank gives money back but charges penalty (lower interest). Policy surrender same — get money back but less than if you stayed. Earlier you surrender, less you get. Never surrender in first 3 years — minimum value!`,
    quiz:`Which surrender value is the MINIMUM guaranteed in the policy document?`,
    opts:['Special Surrender Value', 'Guaranteed Surrender Value', 'Paid-up Value', 'Extended Term Value'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH16-T05', ch:16, subject:'Claims & Payments',
    title:'Role of Agent in Claims — The Final Service',
    nutshell:`The agent's role during a death claim is critical — proactively visiting the family, bringing claim forms, helping collect documents, submitting to insurer, and following up until settlement. This is the ultimate test of an agent's professionalism and the moment that creates lifetime customer loyalty.`,
    hinglish:`Bolo toh... 'Claim ke waqt agent sabse zyada zaroori hota hai — yahi hai asli test of character!'`,
    example:`Lawyer helps draft will but disappears when you need court help — useless! Insurance agent who sells but doesn't help family during claim = same. BEST agents proactively visit family on hearing of death, bring claim form, collect documents, follow up till paid!`,
    quiz:`The agent's role in claim settlement is?`,
    opts:['Not required — claims are company\'s job', 'Only needed if claim is rejected', 'Critical — agent must proactively help family with documentation and follow-up', 'Limited to notifying the company'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH17-T01', ch:17, subject:'Health Insurance Basics',
    title:'Why Health Insurance Is Different from Life Insurance',
    nutshell:`Life insurance pays when you DIE. Health insurance pays when you GET SICK or INJURED but SURVIVE. Health insurance covers medical treatment costs so your savings aren't drained for healthcare. Both are needed for complete protection.`,
    hinglish:`Bolo toh... 'Life insurance = marne ke baad · Health insurance = jeete ji hospital ka bill bharega!'`,
    example:`Life insurance = safety net below tightrope walker (catches you if you fall forever). Health insurance = first-aid kit + ambulance (helps when you stumble but can still recover). Both needed!`,
    quiz:`Health insurance primarily covers?`,
    opts:['Death of policyholder', 'Medical treatment expenses', 'Permanent disability only', 'Loss of income only'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH17-T02', ch:17, subject:'Health Insurance Basics',
    title:'Third Party Administrator (TPA) — The Claims Coordinator',
    nutshell:`A TPA is a company appointed by the insurer (for a fee) to manage health insurance claims. TPA services: health ID cards, pre-authorisation for cashless, claim processing, 24/7 medical helpline, coordinating with network hospitals.`,
    hinglish:`Bolo toh... 'TPA = Insurance company ka health claim manager — aap hospital mein rahoge, woh papers handle karega!'`,
    example:`When you order food online, Swiggy delivers for the restaurant. TPA = 'Swiggy' of health insurance. Insurer = restaurant, you = customer, TPA connects them. When hospitalised, call TPA's 24/7 helpline — they arrange cashless payment!`,
    quiz:`TPA full form in health insurance?`,
    opts:['Total Premium Amount', 'Third Party Administrator', 'Total Policy Assessment', 'Treatment Processing Agency'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH17-T03', ch:17, subject:'Health Insurance Basics',
    title:'Key Organizations in the Health Insurance Ecosystem',
    nutshell:`Health insurance ecosystem includes: IRDAI (regulator), IIB/Insurance Information Bureau (data analytics), NIA/III (education and training), Hospitals (service providers), TPAs (claims coordinators), Medical practitioners (risk assessment), Consumer courts/Ombudsman (dispute resolution).`,
    hinglish:`Bolo toh... 'Health insurance ek team sport hai — insurer sirf ek khiladi hai!'`,
    example:`Hospital itself has many departments: Medical Council sets standards (IRDAI). Data analytics department (IIB). Medical colleges train staff (NIA/III). Service providers are hospitals. Admin coordinators are TPAs. Everyone works for one goal — protecting your health!`,
    quiz:`IIB in the insurance context stands for?`,
    opts:['Insurance Institute of Bengal', 'Insurance Information Bureau of India', 'International Insurance Body', 'Indian Insurance Board'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH18-T01', ch:18, subject:'Health Policy Documentation',
    title:'Health Insurance Proposal Form — What\'s Different',
    nutshell:`Health insurance proposal form focuses heavily on: current medications, past hospitalisation history, family medical history (diabetes/heart in parents), lifestyle (smoking/alcohol/exercise), and complete pre-existing disease (PED) declaration. PED must always be declared.`,
    hinglish:`Bolo toh... 'Health proposal mein poori health history batao — kuch chupaaya toh claim mein dhoka milega!'`,
    example:`Hospital takes complete medical history: previous diseases, surgeries, allergies, current medications. Health insurance proposal does same — insurer needs to know exactly what they're taking on for fair pricing and no claim-time surprises!`,
    quiz:`Hiding a pre-existing disease in a health insurance proposal can result in?`,
    opts:['Higher premium only', 'Policy cancellation and claim rejection', 'A warning letter', 'Nothing — old diseases don\'t matter'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH18-T02', ch:18, subject:'Health Policy Documentation',
    title:'Health Policy Document — Key Sections and Exclusions',
    nutshell:`Health policy document sections: Coverage (what hospitalisation expenses are covered), Sum Insured (total annual limit), Exclusions (what is NOT covered — most critical to read), Waiting periods, Sub-limits (per-disease or per-procedure caps).`,
    hinglish:`Bolo toh... 'Health policy mein exclusions sabse zaroor padho — yahi batata hai claim kab nahi milega!'`,
    example:`Combo meal at McDonald's: 'Free refills' in tiny print — 'not valid for milkshakes.' Health insurance exclusions are that tiny print — maternity (basic plans), cosmetic treatment, dental (often), outpatient, PED in first 1-4 years. Always read them!`,
    quiz:`Sub-limits in a health insurance policy refer to?`,
    opts:['Minimum sum insured', 'Maximum sum insured', 'Caps on specific expenses within overall sum insured', 'Limit on number of claims'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH18-T03', ch:18, subject:'Health Policy Documentation',
    title:'Conditions, Warranties and Endorsements',
    nutshell:`Conditions = rules both parties must follow (e.g., inform insurer within 24 hours of hospitalisation). Warranties = policyholder's promises about facts (e.g., 'I am a non-smoker'). Endorsements = written changes to existing policy (adding family members, address change, SA increase).`,
    hinglish:`Bolo toh... 'Condition = rule · Warranty = promise · Endorsement = policy mein badlaav — teeno jaano!'`,
    example:`Condition: 'Must inform insurer within 24 hours of hospitalisation' (break this = claim may be rejected!). Warranty: 'I am non-smoker' (false = fraud). Endorsement: 'Add my wife to family floater plan' (written change to existing policy).`,
    quiz:`Adding a family member to an existing health policy is done through?`,
    opts:['New proposal form only', 'A phone call to TPA', 'An endorsement', 'A letter to IRDAI'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH19-T01', ch:19, subject:'Health Insurance Products',
    title:'Indemnity Plans — Mediclaim / Hospitalisation Cover',
    nutshell:`Indemnity plans (Mediclaim) pay ACTUAL hospitalisation expenses up to the sum insured. If bill = ₹2L and SI = ₹5L, insurer pays ₹2L. If bill = ₹6L and SI = ₹5L, insurer pays only ₹5L — you pay the ₹1L excess. Cashless at network hospitals; reimbursement at others.`,
    hinglish:`Bolo toh... 'Jitna kharcha hua — utna milega, par SI se zyada nahi — yahi hai indemnity plan!'`,
    example:`School reimburses bus pass whatever it costs, up to ₹500/month. Spent ₹400 → get ₹400. Spent ₹600 → get only ₹500. Mediclaim = same for hospital bills. The 'bus pass limit' = your Sum Insured.`,
    quiz:`In an indemnity-based health plan, if hospital bill is ₹8L and SI is ₹5L, how much does insurer pay?`,
    opts:['₹8 Lakh', '₹3 Lakh (balance)', '₹5 Lakh', 'Nothing — claim rejected'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH19-T02', ch:19, subject:'Health Insurance Products',
    title:'Fixed Benefit Plans — Critical Illness and Hospital Cash',
    nutshell:`Critical Illness (CI) plan pays a LUMP SUM on diagnosis of a covered critical illness (cancer, heart attack, stroke, kidney failure, etc.) after a survival period (usually 30 days). Hospital Cash pays a fixed daily amount for each day of hospitalisation, regardless of actual expenses.`,
    hinglish:`Bolo toh... 'Fixed benefit mein bill nahi dekhte — diagnosis ke baad ya bed par rehne par fixed paisa milta hai!'`,
    example:`Cancer diagnosis: Mediclaim pays ₹4L hospital bill only. Critical Illness pays ₹25L lump sum ON DIAGNOSIS — use for ANY purpose: treatment + EMI + income replacement + travel. CI pays regardless of actual treatment cost!`,
    quiz:`Critical Illness benefit is paid when?`,
    opts:['On hospitalisation', 'On diagnosis of a covered critical illness (after survival period)', 'On death due to critical illness', 'On any illness diagnosis'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH19-T03', ch:19, subject:'Health Insurance Products',
    title:'Group Health Insurance — Protection for Teams',
    nutshell:`Group health insurance covers all employees under a single policy. No individual medical exam needed (for basic coverage). PED often covered from Day 1. Premium lower than individual policies (bulk discount). Employer pays premium (or shares with employee).`,
    hinglish:`Bolo toh... 'Office ne ek group mein sab employees ko insure kar diya — individual se sasta aur easy!'`,
    example:`School orders 100 uniforms at once — bulk discount! Group health insurance same: employer insures all employees together, better rate per person than individual policies. Insurer benefits too — one contract, massive customer base!`,
    quiz:`In group health insurance, medical examination is?`,
    opts:['Mandatory for all', 'Not required for basic coverage', 'Required only for senior members', 'Same as individual policy'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH19-T04', ch:19, subject:'Health Insurance Products',
    title:'Waiting Periods in Health Insurance',
    nutshell:`Types of waiting periods: Initial waiting period (30 days — no claims except accidents), Specific disease waiting (1-2 years for conditions like hernia, cataract), Pre-existing disease waiting (2-4 years), Maternity waiting (9 months to 3 years in plans that cover it). ACCIDENTS are covered from Day 1 always.`,
    hinglish:`Bolo toh... 'Health insurance mein patience chahiye — waiting period khatam hone ke baad hi kuch conditions cover hongi!'`,
    example:`New gym member: first 30 days only basic equipment — pool and sauna unlocked after 3 months. Health insurance waiting periods similar. When you first buy policy, certain things aren't immediately covered!`,
    quiz:`What is typically covered from Day 1 even during the initial waiting period?`,
    opts:['Pre-existing diseases', 'Maternity expenses', 'Accidents', 'Cataract surgery'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH19-T05', ch:19, subject:'Health Insurance Products',
    title:'Co-payment, Sub-limits, Room Rent Cap',
    nutshell:`Three important health policy features that cause surprise at claim time: Co-payment (policyholder pays a fixed % of every claim). Sub-limit (max cap per specific procedure). Room rent cap (staying in expensive room proportionately reduces entire claim settlement).`,
    hinglish:`Bolo toh... 'Policy ki fine print mein co-pay, sub-limit aur room rent cap chhupta hai — claim se pehle samjho!'`,
    example:`Three hospital surprises: CO-PAY '20% co-pay policy. Bill ₹5L. You pay ₹1L. Insurer pays ₹4L.' ROOM RENT 'Policy covers room up to 1% of SI = ₹3,000/day. You chose ₹8,000 room. Entire claim gets proportionate deduction!' SUB-LIMIT 'Knee replacement ₹1.5L actual. Policy sub-limit ₹50K. You pay ₹1L.'`,
    quiz:`Co-payment in health insurance means?`,
    opts:['Insurer pays everything', 'Policyholder shares a percentage of every claim', 'Premium is paid monthly', 'Two insurers share the claim'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH20-T01', ch:20, subject:'Health Underwriting',
    title:'Health Underwriting — Morbidity vs Mortality',
    nutshell:`Health underwriting assesses MORBIDITY risk (probability of getting sick and needing treatment) vs life insurance which assesses MORTALITY risk (probability of dying). Key factors: current health conditions, BMI, lifestyle, family history, occupation.`,
    hinglish:`Bolo toh... 'Life underwriting = marne ka risk · Health underwriting = beemar padne ka risk!'`,
    example:`Life insurance asks: 'How likely is this person to die?' Health insurance asks: 'How likely to get sick, how often, how expensive?' Same 70-year-old has high mortality AND high morbidity risk. 25-year-old with diabetes = low mortality but high health risk!`,
    quiz:`Health underwriting primarily focuses on which type of risk?`,
    opts:['Mortality risk', 'Morbidity risk', 'Market risk', 'Operational risk'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH20-T02', ch:20, subject:'Health Underwriting',
    title:'File and Use Guidelines — How Health Products Are Approved',
    nutshell:`IRDAI's 'File and Use' system allows health insurers to file new products and start selling immediately without waiting for prior approval. However, IRDAI can direct modification or withdrawal if it finds issues with the product.`,
    hinglish:`Bolo toh... 'File karo aur shuru ho jao — health insurance products ke liye IRDAI ka yahi niyam hai!'`,
    example:`Restaurant adds new item to menu — informs food authority rather than waiting for approval. If authority objects, item removed. File and Use = similar. Health insurer files product with IRDAI → starts selling → IRDAI reviews → can direct withdrawal if needed.`,
    quiz:`Under IRDAI's 'File and Use' guideline, when can a health insurer start selling a new product?`,
    opts:['Only after IRDAI approves', 'After filing with IRDAI, without waiting for approval', 'Only after 6 months of filing', 'Never — all products need prior approval'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH20-T03', ch:20, subject:'Health Underwriting',
    title:'Group Health Insurance Underwriting',
    nutshell:`Group health underwriting assesses the GROUP as a whole, not individual members. Factors: average age, industry type (mining vs IT — very different risk profiles), previous year claims history (loss ratio), group size, whether family members are included.`,
    hinglish:`Bolo toh... 'Group mein har vyakti ki medical nahi hoti — poore group ka profile dekha jaata hai!'`,
    example:`Mutual fund investing in a company: doesn't interview every employee — assesses company as whole. Group health underwriting same: insurer looks at average age, industry, last year's claims. The answer = GROUP premium rate per member per year.`,
    quiz:`In group health underwriting, the primary assessment is based on?`,
    opts:['Each member\'s individual health', 'The group\'s overall profile and claims history', 'The employer\'s financial strength', 'IRDAI guidelines only'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH21-T01', ch:21, subject:'Health Claims',
    title:'Two Types of Health Claims — Cashless vs Reimbursement',
    nutshell:`Cashless claim: TPA/insurer pays hospital DIRECTLY at network hospital — policyholder pays nothing (or just co-pay). Reimbursement claim: policyholder pays hospital first, then claims money back from insurer with all original bills within 30 days.`,
    hinglish:`Bolo toh... 'Cashless = hospital ko company ne diya · Reimbursement = tumne diya, company ne wapas diya!'`,
    example:`Two restaurant experiences: CASHLESS — company tie-up with restaurant. You eat, show ID, walk out — company pays. REIMBURSEMENT — no tie-up. You pay restaurant bill. Submit receipt to company. Money back in 30 days. Prefer cashless always!`,
    quiz:`In a cashless health claim, who pays the hospital?`,
    opts:['Policyholder pays first, then gets refund', 'TPA/Insurer pays hospital directly', 'Government pays', 'Employer pays'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH21-T02', ch:21, subject:'Health Claims',
    title:'Pre-Authorisation — The Permission Letter for Cashless Claims',
    nutshell:`For cashless treatment, the hospital must get pre-authorisation from the TPA BEFORE or DURING treatment. Emergency pre-auth: within 4 hours. Planned admission pre-auth: within 24 hours. Pre-auth approval ≠ final claim approval.`,
    hinglish:`Bolo toh... 'Cashless ke liye pehle TPA se permission chahiye — isse pehle bill generate mat karo!'`,
    example:`Renovating rented apartment: MUST get written permission from landlord first. Without permission, landlord won't pay renovation costs. Pre-authorisation in health insurance = this written permission from TPA. Without it, no cashless — must pay and reimburse!`,
    quiz:`Pre-authorisation in health insurance is issued by?`,
    opts:['The policyholder', 'The hospital', 'The TPA on behalf of insurer', 'IRDAI'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH21-T03', ch:21, subject:'Health Claims',
    title:'Documents Required for Health Claims',
    nutshell:`Essential health claim documents: Duly filled claim form, Original itemised hospital bills, Original pharmacy receipts, Doctor's prescription, Diagnostic reports+bills, Discharge summary (most critical), Health card/Policy copy, Bank details for NEFT, Pre-hospitalisation expenses (30 days) and Post-hospitalisation (60 days).`,
    hinglish:`Bolo toh... 'Claim ke liye documents sabse zaroori — hospital se niklo, documents leke niklo!'`,
    example:`Car accident: police won't register FIR without written complaint. Hospital won't give treatment summary without formal request. Insurance claim = every step requires documentation. Prepared policyholder = smooth claim!`,
    quiz:`The most critical document from the hospital for a health insurance claim is?`,
    opts:['Hospital menu', 'Admission form', 'Discharge summary', 'Pharmacy bag'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH21-T04', ch:21, subject:'Health Claims',
    title:'Claim Settlement Timeline and Grievance',
    nutshell:`IRDAI timelines: Emergency cashless pre-auth within 4 hours. Planned cashless pre-auth within 24 hours. Reimbursement settlement within 30 days of all documents. Claim rejection must be in writing with reasons. Grievance path: IGMS → Ombudsman → Consumer Forum.`,
    hinglish:`Bolo toh... 'Cashless = 4 ya 24 ghante mein decision · Reimbursement = 30 din mein paisa — nahi aaya toh IRDAI ko batao!'`,
    example:`Order with 24-hour delivery: if it doesn't arrive, you complain to platform. IRDAI = platform — sets delivery timeline for insurance claims and acts as complaint authority if companies don't meet it. IRDAI has LEGAL TEETH — can penalise companies for delays!`,
    quiz:`Emergency cashless pre-authorisation must be provided within?`,
    opts:['30 minutes', '2 hours', '4 hours', '24 hours'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH21-T05', ch:21, subject:'Health Claims',
    title:'Fraud in Health Insurance — Types and Prevention',
    nutshell:`Common health insurance fraud: fake/inflated bills, claiming for treatment that never happened, hiding PED at proposal, misrepresenting diagnosis (claiming more expensive disease), collusion between doctor/hospital and patient. Fraud = higher premiums for ALL honest policyholders.`,
    hinglish:`Bolo toh... 'Health insurance fraud = poore pool ka nuksaan — ek ke dhoke se sabka premium badhta hai!'`,
    example:`Few students copy in exams → school sets harder papers for EVERYONE. Insurance fraud same — few people submitting fake bills forces insurers to investigate everyone more and raise premiums for all genuine policyholders. Fraud is NOT victimless!`,
    quiz:`Insurance fraud ultimately harms?`,
    opts:['Only the insurer', 'Only the fraudster if caught', 'All honest policyholders through higher premiums', 'Only the government'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH02-T08', ch:2, subject:'Customer Service',
    title:'Ethical Behaviour — The Foundation of Trust',
    nutshell:`Ethical behaviour means always acting in the customer's best interest — being honest, transparent, avoiding mis-selling, and never letting personal commission override the customer's genuine need. Ethics is what separates a trusted advisor from a mere salesperson.`,
    hinglish:`Bolo toh... 'Commission ke liye galat policy bechi? Ye unethical hai — aur career khatam karne ka seedha raasta!'`,
    example:`Doctor who prescribes expensive medicines only because they get a commission from pharma company — that's unethical! An insurance agent who sells a ULIP to a 60-year-old retiree who needs term insurance — just for higher commission — is doing exactly the same thing. Ethical agents sleep well at night. Unethical ones get complaints!`,
    quiz:`Which of the following is an example of ETHICAL behaviour by an insurance agent?`,
    opts:['Recommending a plan with highest commission', 'Recommending the plan that best meets customer\'s need', 'Hiding policy exclusions to close the sale', 'Pressuring customer to buy before policy details are read'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH04-T07', ch:4, subject:'Agent Regulations',
    title:'Key Definitions — Individual Agent, Corporate Agent, Composite Agent',
    nutshell:`Individual Agent: a natural person licensed to represent one insurer. Corporate Agent: a company/firm/bank licensed as an agent. Composite Agent: an agent holding dual license — for both life AND general insurance — requiring 75 hours training.`,
    hinglish:`Bolo toh... 'Individual agent = ek insaan, ek company · Corporate agent = bank ya firm · Composite agent = dono — life bhi, general bhi!'`,
    example:`Imagine a restaurant waiter (individual agent — serves one table/company). A catering company (corporate agent — serves many at once as a firm). A buffet server who handles both veg and non-veg stations (composite agent — covers both life and general insurance).`,
    quiz:`An agent who holds license for both life AND general insurance is called?`,
    opts:['Individual Agent', 'Corporate Agent', 'Composite Agent', 'Universal Agent'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH04-T08', ch:4, subject:'Agent Regulations',
    title:'Disqualifications to Act as an Insurance Agent',
    nutshell:`A person CANNOT become an insurance agent if they are: a minor, of unsound mind, convicted of criminal misappropriation/fraud/cheating/forgery, found guilty of fraud against insurer or insured, violated code of conduct, or had their license cancelled within the last 5 years.`,
    hinglish:`Bolo toh... 'Criminal record hai? Fraud kiya hai? Minor ho? — Agent nahi ban sakte!'`,
    example:`Just like a government job won't accept an applicant with a criminal record, IRDAI won't grant an insurance agent license to someone who has cheated customers, committed forgery, or been caught in insurance fraud. Clean hands = license. Dirty hands = rejected.`,
    quiz:`A person whose insurance agent license was previously cancelled must wait how long before applying afresh?`,
    opts:['1 year', '2 years', '3 years', '5 years'],
    correct:3, difficulty:'Medium'
  },
  {
    id:'CH04-T09', ch:4, subject:'Agent Regulations',
    title:'Suspension and Cancellation of Agent Licence',
    nutshell:`The Designated Person (insurer's authorised officer) can SUSPEND an agent's license during investigation. After due process, if found guilty, the license can be CANCELLED. The agent has the right to be heard before cancellation. Cancellation = 5-year ban on fresh license.`,
    hinglish:`Bolo toh... 'Galat kiya toh pehle suspend, jaanch ke baad cancel — aur 5 saal tak naya license nahi!'`,
    example:`A government officer who is found taking bribes is first suspended (can't work) and then dismissed after enquiry. An insurance agent who violates the code of conduct similarly faces: Complaint → Designated Person investigates → Suspension → Hearing → Cancellation if proven guilty.`,
    quiz:`Who has the authority to cancel an insurance agent's license?`,
    opts:['IRDAI directly', 'The policyholder', 'The Designated Person of the insurer', 'The Insurance Ombudsman'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH04-T10', ch:4, subject:'Agent Regulations',
    title:'Resignation and Surrender of Agent Appointment',
    nutshell:`An agent who wishes to voluntarily stop being an agent must follow a formal procedure: give written notice to the insurer, settle all outstanding obligations, and return the license certificate. The insurer notifies IRDAI. The agent's business then transfers to the insurer directly.`,
    hinglish:`Bolo toh... 'Agent kaam chodna chahta hai? Theek hai — par sahi tarike se khatam karo, bhaago mat!'`,
    example:`When an employee resigns from a job, they give a notice period, complete handover, return laptop and access cards. An insurance agent resigning similarly gives written notice, settles all dues with existing policyholders' servicing arrangements, and returns the license document properly.`,
    quiz:`After voluntarily surrendering an agent's license, the agent can apply for a fresh license?`,
    opts:['Never again', 'After 5 years only', 'After 2 years only', 'At any time — no cooling period for voluntary resignation'],
    correct:3, difficulty:'Hard'
  },
  {
    id:'CH05-T07', ch:5, subject:'Legal Principles',
    title:'Elements of a Valid Contract',
    nutshell:`An insurance policy is a legally binding contract. For any contract to be VALID in India (under the Indian Contract Act 1872), it must have: Offer + Acceptance + Consideration (premium) + Capacity to contract + Free Consent + Lawful Object. Missing any one = contract void.`,
    hinglish:`Bolo toh... 'Insurance contract valid hone ke 6 conditions hain — ek bhi missing toh contract shunya!'`,
    example:`Buying a house: The seller makes an OFFER (proposal). You ACCEPT it. You pay money (CONSIDERATION = premium). Both parties must be adults of sound mind (CAPACITY). No force or fraud (FREE CONSENT). Purpose must be legal (LAWFUL OBJECT — can't insure illegal goods). Same 6 elements in insurance!`,
    quiz:`Which element makes an insurance contract void if the policyholder was forced/threatened to sign?`,
    opts:['Lack of Consideration', 'Lack of Capacity', 'Absence of Free Consent', 'Unlawful Object'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH05-T08', ch:5, subject:'Legal Principles',
    title:'Breach of Utmost Good Faith — Misrepresentation vs Non-Disclosure',
    nutshell:`Breach of Utmost Good Faith happens in two ways: Misrepresentation (stating a FALSE fact — actively lying) or Non-Disclosure (HIDING a material fact that was never asked but should have been disclosed). Both can make the policy voidable by the insurer.`,
    hinglish:`Bolo toh... 'Jhooth bola = Misrepresentation · Sachchi baat chupayi = Non-Disclosure · Dono mein policy cancel ho sakti hai!'`,
    example:`MISREPRESENTATION: On health form, you tick 'Non-Smoker' when you smoke 10 cigarettes daily. Active lie. NON-DISCLOSURE: You had a kidney operation 3 years ago but the form didn't ask about it, so you didn't mention it. You didn't lie — but you SHOULD have disclosed it. Both are breaches!`,
    quiz:`A policyholder did NOT mention a past kidney operation because the form didn't ask about it. This is called?`,
    opts:['Misrepresentation', 'Non-Disclosure', 'Fraud', 'Contract breach'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH05-T09', ch:5, subject:'Legal Principles',
    title:'Contract of Adhesion — Take It or Leave It',
    nutshell:`An insurance contract is a 'Contract of Adhesion' — the insurer prepares ALL the terms and the customer can only ACCEPT or REJECT it. The customer has no power to negotiate specific clauses. This is why insurance policy wordings must be clear and any ambiguity is interpreted in the customer's FAVOUR.`,
    hinglish:`Bolo toh... 'Insurance contract mein terms insurer ki hoti hain — tum bas haan ya nahi bol sakte ho!'`,
    example:`When you buy a train ticket, you cannot negotiate with Indian Railways: 'Can I change the refund policy?' No. You accept their terms or don't travel. Insurance policy is the same — insurer writes all the terms; you accept or don't buy. BUT if any clause is unclear, the court interprets it in YOUR favour!`,
    quiz:`In a Contract of Adhesion, if there is ambiguity in a clause, how is it interpreted?`,
    opts:['In the insurer\'s favour', 'In IRDAI\'s favour', 'In the policyholder\'s favour', 'By a court appointed arbitrator'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH05-T10', ch:5, subject:'Legal Principles',
    title:'Gambling vs Insurance — Key Differences',
    nutshell:`Insurance and gambling both involve uncertainty, but they are fundamentally different. Insurance: covers an EXISTING risk you already have (your house might burn). Gambling: CREATES a new risk that didn't exist (betting on a cricket match). Insurance reduces financial uncertainty; gambling creates it.`,
    hinglish:`Bolo toh... 'Insurance = pehle se hai risk, uspe cover · Gambling = naya risk khud banana · Dono mein fark samajho!'`,
    example:`You own a house (existing risk of fire). You buy insurance to protect against financial loss IF fire happens. That's insurance. But betting ₹1,000 on whether India wins tomorrow's match — that risk didn't exist before your bet. You CREATED it. That's gambling. Insurance = risk management. Gambling = risk creation.`,
    quiz:`What is the KEY legal difference between insurance and gambling?`,
    opts:['Insurance involves more money', 'Insurance requires insurable interest; gambling creates a new risk that didn\'t exist before', 'Insurance is regulated; gambling is not', 'Insurance always pays; gambling might not'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH07-T04', ch:7, subject:'Financial Planning',
    title:'Risk Profile and Investment Decisions',
    nutshell:`Every person's risk profile determines how they should invest. Risk profile depends on: age, income stability, dependants, existing assets, and psychological tolerance for loss. Young + no dependants = high risk tolerance. Old + many dependants = low risk tolerance.`,
    hinglish:`Bolo toh... 'Risk profile = kitna jokhim uthaa sakte ho — isi ke hisab se invest karo!'`,
    example:`3 investors with same ₹10,000 to invest: RAHUL (25, single, stable job) → can afford to lose if market falls → HIGH risk profile → Equity ULIP. PRIYA (45, 2 kids in school, home loan) → can't afford big losses → MEDIUM risk profile → Balanced fund. SURESH (60, retired) → needs steady income → LOW risk profile → Debt fund / Pension plan.`,
    quiz:`Which factor MOST influences an individual's risk profile for investment?`,
    opts:['The brand of the insurance company', 'Age, income stability, dependants and psychological loss tolerance', 'The premium amount', 'The agent\'s recommendation'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH07-T05', ch:7, subject:'Financial Planning',
    title:'Cash Planning — Managing Day to Day Financial Needs',
    nutshell:`Cash planning is the foundation of all financial planning. It involves budgeting monthly income vs expenses, maintaining an emergency fund (3-6 months of expenses), and ensuring enough liquid money for daily needs BEFORE investing or buying insurance.`,
    hinglish:`Bolo toh... 'Pehle roz ka paisa sambhalo, phir future ki sochna — cash planning sabse pehle!'`,
    example:`Building a house: you need a strong foundation before building walls. Cash planning = your financial foundation. Without emergency fund of ₹50,000-₹1,00,000 for unexpected car repair, medical emergency or job loss, even a great insurance plan can't help you if you can't pay premium next month!`,
    quiz:`An emergency fund in cash planning should ideally cover how many months of expenses?`,
    opts:['1 month', '2 months', '3 to 6 months', '12 months'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH07-T06', ch:7, subject:'Financial Planning',
    title:'Investment Planning and Key Parameters',
    nutshell:`Investment planning involves systematically growing wealth over time through various instruments. Key investment parameters to evaluate: Safety (will I get my money back?), Liquidity (can I access money when needed?), Returns (how much will it grow?), and Tax efficiency (what are the tax implications?).`,
    hinglish:`Bolo toh... 'Investment karte waqt 4 sawaal poochho — Safe hai? Liquid hai? Return kaisa? Tax kaisa?'`,
    example:`Choosing where to keep ₹1 lakh: Under mattress (safe, liquid, zero return, no tax). Bank FD (safe, semi-liquid, moderate return, taxable). Stock market (not safe, liquid, high potential return, taxable). ELSS Mutual Fund (market risk, locked 3 years, high return, tax benefit under 80C). Each has different safety-liquidity-return-tax profile!`,
    quiz:`Which of the following is NOT a key parameter for evaluating an investment?`,
    opts:['Safety', 'Liquidity', 'Agent\'s commission', 'Returns'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH07-T07', ch:7, subject:'Financial Planning',
    title:'Retirement Planning — Planning for Life After Work',
    nutshell:`Retirement planning means building a corpus that provides regular income after you stop working. Two key calculations: How much corpus needed? (monthly expenses × 12 × number of post-retirement years) and How to build it? (systematic investments in pension plans, PPF, NPS, annuity plans over working life).`,
    hinglish:`Bolo toh... 'Retirement ki taiyari aaj se shuru karo — kal ka Suresh aaj ke Suresh ki mehnat khaayega!'`,
    example:`Suresh is 30. He wants to retire at 60 with ₹50,000/month for 25 years. He needs ₹1.5 crore corpus at retirement. If he starts SIP now at 30, he needs ₹3,000/month for 30 years. But if he waits till 45 to start, he needs ₹25,000/month for 15 years — same goal, 8× harder! Starting early = the magic of compounding.`,
    quiz:`Which insurance product is specifically designed to provide regular income after retirement?`,
    opts:['Term Insurance', 'Endowment Plan', 'Annuity/Pension Plan', 'Money Back Plan'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH08-T06', ch:8, subject:'Life Insurance Products',
    title:'Riders in Life Insurance — Enhancing Your Base Policy',
    nutshell:`Riders are additional benefits attached to a base life insurance policy for a small extra premium. Common riders: Accidental Death Benefit (ADB) rider — extra SA if accidental death. Waiver of Premium (WOP) rider — premiums waived on disability. Critical Illness rider — lump sum on diagnosis. Term rider — adds extra life cover.`,
    hinglish:`Bolo toh... 'Rider = base policy ka upgrade — thode extra premium mein zyada protection!'`,
    example:`You buy a basic car. Then add optional features: sunroof (ADB rider), automatic parking (WOP rider), premium sound system (CI rider). Each feature costs extra but makes the car much more valuable. Insurance riders work exactly the same — base policy + riders = comprehensive protection!`,
    quiz:`A Waiver of Premium (WOP) rider means?`,
    opts:['All premiums are returned at maturity', 'Future premiums are waived if policyholder becomes permanently disabled', 'The premium is reduced every year', 'Premiums can be skipped any time'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH08-T07', ch:8, subject:'Life Insurance Products',
    title:'Variants of Term Assurance',
    nutshell:`Term insurance has multiple variants: Level Term (SA stays same throughout), Decreasing Term (SA reduces over time — used for home loan protection), Increasing Term (SA increases with inflation), Return of Premium Term (all premiums refunded if survived), Convertible Term (can convert to whole life/endowment later).`,
    hinglish:`Bolo toh... 'Term insurance ek nahi, many types — level, decreasing, increasing, ROP, convertible!'`,
    example:`5 different umbrellas: LEVEL TERM = same-size umbrella throughout 20 years. DECREASING TERM = umbrella that gets smaller each year (as your home loan reduces). INCREASING TERM = umbrella that grows each year (to match inflation). ROP TERM = umbrella you get back after 20 years (premiums refunded). CONVERTIBLE TERM = umbrella that can transform into a raincoat (whole life policy)!`,
    quiz:`Which term insurance variant is BEST suited for protecting a home loan?`,
    opts:['Level Term', 'Decreasing Term', 'Increasing Term', 'Return of Premium Term'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH08-T08', ch:8, subject:'Life Insurance Products',
    title:'Dividend Method of Profit Participation (Bonus)',
    nutshell:`In PAR (participating) plans, the insurer shares its profits with policyholders through bonuses declared annually. Methods of allocating bonus: Cash bonus (paid directly), Reversionary bonus (added to sum assured), Paid-up addition (buys additional paid-up insurance), Reduction in premium (reduces future premium payments).`,
    hinglish:`Bolo toh... 'PAR policy mein profit share milta hai — alag alag tarike se de sakte hain company!'`,
    example:`Company makes profit and distributes dividends to shareholders in different ways: some get cash, some get additional shares, some get lower fees next year. Insurance PAR policies distribute bonus in exactly the same 4 ways — cash, added to SA, additional cover, or lower premium. Policyholder can usually choose their preference!`,
    quiz:`The most common method of distributing bonus in participating life insurance policies in India is?`,
    opts:['Cash bonus paid directly', 'Reversionary bonus added to sum assured', 'Reduction in future premiums', 'Paid-up addition'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH09-T04', ch:9, subject:'ULIPs & Modern Products',
    title:'ULIP Charges — What Reduces Your Investment',
    nutshell:`ULIPs have multiple charges that reduce the actual amount invested: Premium Allocation Charge (deducted upfront before investing), Mortality Charge (cost of life cover), Fund Management Charge (for managing investment funds), Policy Administration Charge (operational costs). Post-2010 IRDAI regulations capped total charges significantly.`,
    hinglish:`Bolo toh... 'ULIP mein charge samjho — premium dala ₹10,000 par sab invest nahi hoga!'`,
    example:`You deposit ₹10,000 in a ULIP. After charges: Allocation charge (₹500) deducted first. Then on remaining ₹9,500: Fund management charge (₹47.50 = 0.5%). Mortality charge for life cover (₹80). Policy admin charge (₹50). Net invested in fund = ₹9,322.50. As policy matures, charges reduce. Understanding this is critical for customers!`,
    quiz:`Which ULIP charge is deducted from the premium BEFORE the remaining amount is invested in funds?`,
    opts:['Mortality Charge', 'Fund Management Charge', 'Premium Allocation Charge', 'Policy Administration Charge'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH09-T05', ch:9, subject:'ULIPs & Modern Products',
    title:'ULIP Regulations — Lock-in and IRDAI Guidelines',
    nutshell:`IRDAI 2010 ULIP regulations introduced major consumer protections: Minimum lock-in period of 5 years (cannot surrender before 5 years). Cap on total charges. Minimum life cover = 10× annual premium (for below 45 years). Free switching between funds. Detailed NAV disclosure. These regulations made ULIPs more transparent and fair.`,
    hinglish:`Bolo toh... '2010 ke baad ULIP completely badal gaya — 5 saal lock-in, charge cap, aur puri transparency!'`,
    example:`Before 2010 ULIPs were like 'mystery boxes' — high charges hidden in fine print, you could exit in year 1 with almost nothing left. After IRDAI's 2010 regulations, ULIPs became like transparent glass boxes — every charge visible, minimum 5-year commitment, charges capped, minimum life cover guaranteed. Much safer for customers!`,
    quiz:`Minimum lock-in period for ULIPs as per IRDAI regulations is?`,
    opts:['1 year', '3 years', '5 years', '7 years'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH10-T04', ch:10, subject:'Insurance Applications',
    title:'Married Women\'s Property Act (MWP Act) — Protection for Wife and Children',
    nutshell:`Section 6 of the Married Women's Property Act 1874 allows a married man to take a life insurance policy specifically for the benefit of his WIFE and/or CHILDREN. This policy is held in a TRUST — it cannot be claimed by the husband's creditors, business partners, or relatives. Only the wife/children can receive the benefit.`,
    hinglish:`Bolo toh... 'MWP Act ke under policy lo — creditors haath nahi laga sakte, sirf biwi aur bachche ko milega!'`,
    example:`Rajesh runs a business. He takes a ₹1 crore life insurance policy. Without MWP: if business fails and creditors attach his assets, they may even attach his life insurance proceeds — family gets nothing! WITH MWP Act policy: The ₹1 crore is protected in a LEGAL TRUST. No creditor, court, or relative can touch it. Only his wife and children receive it.`,
    quiz:`Under the MWP Act, who can be named as beneficiaries of a life insurance policy?`,
    opts:['Business partners and creditors', 'Wife and/or children only', 'Any family member including parents', 'IRDAI as trustee'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH10-T05', ch:10, subject:'Insurance Applications',
    title:'Mortgage Redemption Insurance (MRI) — Protecting Your Home Loan',
    nutshell:`Mortgage Redemption Insurance (MRI) is a DECREASING TERM plan linked to a home loan. The Sum Assured reduces in line with the outstanding loan balance. If the borrower dies, the insurer pays off the remaining loan directly to the bank. Family keeps the home debt-free. Also called 'Credit Life Insurance'.`,
    hinglish:`Bolo toh... 'Home loan liya hai? MRI lo — marne ke baad bank ka loan insurer bhhar dega, family ka ghar safe!'`,
    example:`Amit takes ₹50L home loan for 20 years. He buys MRI for ₹50L. Year 1: outstanding loan ₹50L — MRI cover ₹50L. Year 10: loan repaid to ₹25L — MRI cover now ₹25L. If Amit dies in Year 10, insurer pays ₹25L directly to bank. Amit's family keeps the house — no debt burden!`,
    quiz:`Mortgage Redemption Insurance (MRI) is a type of?`,
    opts:['Whole life insurance', 'Level term insurance', 'Decreasing term insurance', 'Endowment plan'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH11-T04', ch:11, subject:'Pricing & Valuation',
    title:'Components of Premium — Net Premium and Gross Premium',
    nutshell:`Net Premium (Pure Premium) = cost of mortality only — the mathematical amount needed purely to pay future death claims. Gross Premium = Net Premium + Loading. Loading covers: expenses (commissions, salaries, rent), contingency reserve, profit margin. Gross premium = what policyholders actually pay.`,
    hinglish:`Bolo toh... 'Net premium = maut ka hisab · Gross premium = net + company ka kharcha + thoda faayda!'`,
    example:`Running a bus service: BARE COST = fuel only (Net Premium). ACTUAL TICKET PRICE = fuel + driver salary + bus maintenance + profit (Gross Premium/Loading). If you charged only fuel cost, the bus company would shut down! Similarly, insurers can't charge only net premium — they need loading to operate and survive.`,
    quiz:`The ACTUAL premium a policyholder pays is called?`,
    opts:['Net Premium', 'Pure Premium', 'Gross Premium', 'Mortality Premium'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH11-T05', ch:11, subject:'Pricing & Valuation',
    title:'Rebates in Life Insurance — What\'s Allowed and What\'s Not',
    nutshell:`A rebate in insurance means giving the policyholder any part of the commission or offering any discount not officially sanctioned by the insurer. Rebating is STRICTLY PROHIBITED under Section 41 of the Insurance Act 1938. Neither agent NOR insurer can offer rebates. Violation = license cancellation + fine.`,
    hinglish:`Bolo toh... 'Agent ne commission ka hissa diya wapas? ILLEGAL! Yahi hai rebate — aur iska matlab license cancel!'`,
    example:`Agent earns ₹5,000 commission on your policy. He says 'Main aapko ₹1,000 wapas doonga — secret mein.' This is REBATING — and it is a criminal offence under insurance law! Why? Because it creates unfair competition and can lead agents to sell wrong products just to give bigger cashbacks. Section 41 punishes this with cancellation of license.`,
    quiz:`Offering rebate on insurance premium is prohibited under which Section of Insurance Act?`,
    opts:['Section 38', 'Section 41', 'Section 45', 'Section 64V'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH11-T06', ch:11, subject:'Pricing & Valuation',
    title:'Determination of Surplus and Types of Reversionary Bonus',
    nutshell:`Surplus = excess of assets over liabilities after actuarial valuation. Surplus is distributed as bonus to PAR policyholders. Three types of Reversionary Bonus: Simple Reversionary (fixed ₹ per ₹1000 SA each year), Compound Reversionary (calculated on SA + accumulated bonuses — faster growth), Super Compound (calculated on both SA and accumulated bonuses at different rates).`,
    hinglish:`Bolo toh... 'Simple = seedha · Compound = upar se bhi bonus · Super Compound = sabse zyada growth!'`,
    example:`₹1,00,000 SA policy, 5% bonus rate: SIMPLE: ₹5,000 added year 1, ₹5,000 year 2, ₹5,000 year 3 (same amount every year). COMPOUND: Year 1 ₹5,000 added. Year 2 bonus on ₹1,05,000 = ₹5,250. Year 3 on ₹1,10,250 = ₹5,512. SUPER COMPOUND: Even faster — bonus on SA plus bonus on previously earned bonus at separate rate. Each type grows more than the previous!`,
    quiz:`Which type of reversionary bonus grows FASTEST because it is calculated on SA plus all accumulated previous bonuses?`,
    opts:['Simple Reversionary Bonus', 'Compound Reversionary Bonus', 'Super Compound Reversionary Bonus', 'Terminal Bonus'],
    correct:2, difficulty:'Hard'
  },
  {
    id:'CH11-T07', ch:11, subject:'Pricing & Valuation',
    title:'Expenses, Reserves and Valuation of Assets',
    nutshell:`Insurance companies must hold sufficient RESERVES (money set aside) to pay all future claims. Actuarial valuation determines if reserves are adequate. Assets held against liabilities are valued conservatively. Solvency Margin (Section 64V) ensures companies always have 150% of required solvency — extra cushion above minimum.`,
    hinglish:`Bolo toh... 'Reserve = kal ke claims ke liye aaj ka paisa · Solvency margin = extra cushion — company doobi nahi toh customers safe!'`,
    example:`A hospital must keep emergency medicine stock at ALL times — can't run out when patient is critical. Insurance reserves = same concept. The company holds money set aside specifically to pay future claims. If a company's reserves run low, IRDAI steps in — just like a health inspector who checks medicine stock and shuts down a dangerously low-stocked hospital.`,
    quiz:`Under Section 64V of the Insurance Act, what is the minimum solvency margin an insurance company must maintain?`,
    opts:['100% of required solvency', '120% of required solvency', '150% of required solvency', '200% of required solvency'],
    correct:2, difficulty:'Hard'
  },
  {
    id:'CH13-T04', ch:13, subject:'Policy Conditions',
    title:'Specific Policy Provisions — Riders and Special Clauses',
    nutshell:`Besides standard provisions, every policy has SPECIFIC provisions unique to that plan: Rider conditions (ADB, WOP, CI rider rules), Suicide clause (80% premiums returned if death within 1 year due to suicide — no claim), War and aviation exclusion clause (some policies exclude death during war or as aircrew).`,
    hinglish:`Bolo toh... 'Standard provisions IRDAI ki hain — Specific provisions plan ki apni hoti hain — dono padho!'`,
    example:`Standard terms apply to ALL restaurants: no fighting, pay before leaving. Specific terms vary by restaurant: 'No outside food allowed' (one restaurant), 'Only vegetarian' (another), 'Formal dress required' (premium restaurant). Insurance standard provisions = apply to all. Specific provisions = unique to each plan.`,
    quiz:`The suicide clause in life insurance policies typically provides for?`,
    opts:['Full sum assured payment', 'No payment whatsoever', '80% of premiums paid returned if death by suicide within first year', 'Claim rejected without any refund'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH15-T06', ch:15, subject:'Underwriting',
    title:'Medical Factors That Influence Underwriter\'s Decision',
    nutshell:`Key medical factors assessed in life insurance underwriting: BMI/obesity (increases mortality risk), Blood pressure (hypertension), Blood sugar levels (diabetes), ECG results (heart condition), Family medical history (hereditary diseases), Current medications (chronic conditions), Past surgeries/hospitalisation.`,
    hinglish:`Bolo toh... 'Doctor jaise check karta hai, underwriter bhi wahi dekhta hai — BMI, BP, sugar, ECG sab!'`,
    example:`Think of underwriting as a medical board examination for insurance. A doctor checks your vitals before clearing you for physical labour. An underwriter checks your medical vitals before clearing you for insurance. High BP = red flag (might need extra premium). Diabetes = loading applied. Family history of heart disease = closer examination. All factors together determine your risk class.`,
    quiz:`Which of the following medical conditions would typically result in EXTRA PREMIUM loading in life insurance underwriting?`,
    opts:['Normal BMI with no past illness', 'Controlled diabetes with medication', 'Age below 30 with clean medical history', 'Non-smoker with no family history of disease'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH15-T07', ch:15, subject:'Underwriting',
    title:'Rating Methods — Numerical Rating and Judgement Rating',
    nutshell:`Two methods for rating sub-standard risks: NUMERICAL RATING METHOD — assigns positive/negative points to each risk factor, total score determines extra premium. JUDGEMENT RATING — underwriter uses professional experience and judgement (without a strict formula) to assess unusual or complex cases not covered by tables.`,
    hinglish:`Bolo toh... 'Numerical = points ka hisab · Judgement = underwriter ki samajh — dono mein substandard life ki extra premium nikalte hain!'`,
    example:`Scoring in a cricket match: NUMERICAL = runs scored (objective, countable). JUDGEMENT = selectors choosing a player based on form, fitness, temperament (subjective, expert opinion). Numerical rating = objective points system for common risk factors. Judgement rating = expert underwriter opinion for complex/unusual cases.`,
    quiz:`The Numerical Rating Method in underwriting assigns what to each risk factor?`,
    opts:['A fixed rejection decision', 'Positive or negative rating points to determine extra premium', 'A flat 25% extra premium to all', 'A judgement based decision'],
    correct:1, difficulty:'Hard'
  },
  {
    id:'CH16-T06', ch:16, subject:'Claims & Payments',
    title:'Survival Benefit Payments — Money Back in Action',
    nutshell:`Survival benefits are periodic cash payments made to the living policyholder at specified intervals during the policy term in money-back plans. They are NOT claims — they are scheduled payments that are guaranteed as per policy terms. The death cover continues FULLY even after each survival benefit payment.`,
    hinglish:`Bolo toh... 'Survival benefit = jeete ji milta hai, scheduled hai, claim nahi — aur life cover kam nahi hoti!'`,
    example:`Imagine a 20-year savings scheme where bank deposits ₹20,000 into your account every 5 years WHILE your money is growing. Year 5 — ₹20,000 paid (you're alive). Year 10 — ₹20,000 paid. Year 15 — ₹20,000 paid. Year 20 — Remaining ₹40,000 + bonus paid. But if you die at any point — FULL ₹1,00,000 goes to family regardless of what you already received!`,
    quiz:`In a money-back plan, if the policyholder dies after receiving some survival benefits, the death claim paid is?`,
    opts:['Full Sum Assured (survival benefits already paid do NOT reduce it)', 'Sum Assured minus survival benefits already paid', 'Only the balance survival benefits remaining', 'Nothing — plan is over after survival benefits'],
    correct:0, difficulty:'Medium'
  },
  {
    id:'CH16-T07', ch:16, subject:'Claims & Payments',
    title:'Rider Benefit Claims — How They Work',
    nutshell:`Rider benefits are claimed separately from the base policy claim. ADB (Accidental Death Benefit) rider: additional SA paid if death is due to an accident. WOP (Waiver of Premium) rider: triggered by permanent total disability — all future premiums waived, base cover continues free. CI rider: lump sum on diagnosis, after survival period.`,
    hinglish:`Bolo toh... 'Rider claim base claim se alag hota hai — accident hua toh ADB extra milega, disability par WOP!'`,
    example:`Base policy = your main safety harness when climbing. ADB Rider = extra rescue rope if the harness fails due to accident. WOP Rider = if you break your hand and can't hold on, someone else holds for free. CI Rider = emergency helicopter arrives if you're critically ill (not the harness itself). Each rider activates on its OWN specific trigger event!`,
    quiz:`For an Accidental Death Benefit (ADB) rider claim, which document is specifically required beyond normal death claim documents?`,
    opts:['Nominee\'s Aadhaar card', 'FIR and accident/postmortem report', 'Agent\'s recommendation letter', 'Insurer\'s internal medical report'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH17-T04', ch:17, subject:'Health Insurance Basics',
    title:'What is Health — Definition and Determinants',
    nutshell:`WHO defines Health as 'a state of complete physical, mental and social well-being, and not merely the absence of disease.' Determinants of health: Lifestyle factors (diet, exercise, smoking), Environmental factors (clean water, sanitation, pollution), Biological factors (age, gender, genetic predisposition), Healthcare access.`,
    hinglish:`Bolo toh... 'Health sirf beemar na hona nahi — body, mind aur society teeno theek hona chahiye — WHO ki definition yahi hai!'`,
    example:`Three rings overlapping like Olympic rings: PHYSICAL HEALTH (body works well — can climb stairs, no pain). MENTAL HEALTH (mind is calm — no depression, handles stress). SOCIAL HEALTH (good relationships, contributing to community). Only when all THREE rings overlap completely = TRUE HEALTH as per WHO definition. Insurance covers only medical/physical dimension!`,
    quiz:`According to WHO, health is defined as?`,
    opts:['Absence of disease only', 'A state of complete physical, mental and social well-being — not merely absence of disease', 'Being able to work without fatigue', 'Having no chronic illness'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH17-T05', ch:17, subject:'Health Insurance Basics',
    title:'Levels of Healthcare — Primary, Secondary, Tertiary',
    nutshell:`Healthcare is organised in 3 levels: PRIMARY (first point of contact — PHC, sub-centres, family doctor — handles common illnesses, preventive care, immunisation). SECONDARY (district hospitals, community health centres — handles more complex cases needing specialists). TERTIARY (teaching hospitals, AIIMS — highly specialised care, advanced surgery, rare diseases).`,
    hinglish:`Bolo toh... 'Primary = mohalle ka doctor · Secondary = sheher ka hospital · Tertiary = bade city ka specialist hospital!'`,
    example:`Army hierarchy: SOLDIER (primary care — handles daily issues). CAPTAIN (secondary care — handles serious issues that soldier can't). GENERAL (tertiary care — handles the most critical, complex battles). Healthcare works same way. Your local PHC doctor handles fever — if serious, refers to district hospital — if very complex, refers to AIIMS or specialty centre.`,
    quiz:`AIIMS (All India Institute of Medical Sciences) represents which level of healthcare?`,
    opts:['Primary care', 'Secondary care', 'Tertiary care', 'Community care'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH17-T06', ch:17, subject:'Health Insurance Basics',
    title:'ESIS and CGHS — Government Employee Health Schemes',
    nutshell:`ESIS (Employees State Insurance Scheme) under ESI Act 1948: covers factory/industrial workers earning below ₹21,000/month — provides medical, sickness, maternity, disability and death benefits. CGHS (Central Government Health Scheme): covers Central Government employees and pensioners — provides OPD, IPD, specialist care at CGHS wellness centres.`,
    hinglish:`Bolo toh... 'Factory worker = ESIS · Central government servant = CGHS — sarkar apne logon ka khayal rakhti hai!'`,
    example:`Two government offices: OFFICE 1 (factory with workers) = ESIS covers workers. They contribute % of salary, employer contributes too. If sick, ESIS pays medical bills + sickness benefit cash. OFFICE 2 (government ministry) = CGHS covers civil servants. They pay ₹250-₹1,000/month based on salary grade. CGHS card used at CGHS wellness centres for treatment.`,
    quiz:`ESIS (Employees State Insurance Scheme) is governed by which Act?`,
    opts:['Insurance Act 1938', 'Employees State Insurance Act 1948', 'IRDAI Act 1999', 'Employees Compensation Act 1923'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH17-T07', ch:17, subject:'Health Insurance Basics',
    title:'Evolution of Health Insurance in India and Health Insurance Market',
    nutshell:`Health insurance in India evolved from: ESIS (1948, govt workers) → Mediclaim (1986, first commercial product by nationalised insurers) → Private players entry (2000, post-IRDAI) → Standalone health insurers (2007, Star Health first) → Standardisation (2013, IRDAI guidelines) → Government schemes (RSBY, PMJAY 2018). Market now has life insurers, general insurers, and standalone health insurers.`,
    hinglish:`Bolo toh... 'Health insurance India mein pehle sirf sarkari logon ke liye tha — ab sab ke liye available hai!'`,
    example:`India's health insurance story is like a river: small stream in 1948 (ESIS only). Bigger flow in 1986 (Mediclaim launched — first commercial product). Tributaries joining in 2000 (private companies). Major tributaries in 2007 (standalone health insurers like Star Health). Now a mighty river in 2024 (₹1 lakh crore+ premium industry).`,
    quiz:`India's first commercial health insurance product was?`,
    opts:['PMJAY', 'ESIS', 'Mediclaim (1986)', 'CGHS'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH18-T04', ch:18, subject:'Health Policy Documentation',
    title:'Standard Form of Declaration and Medical Questionnaire',
    nutshell:`Health insurance proposals include a Standard Declaration where the applicant signs confirming all statements are true and complete. The Medical Questionnaire asks specific health questions: height/weight/BMI, blood pressure readings, blood sugar levels, past hospitalisation, current medications, family medical history.`,
    hinglish:`Bolo toh... 'Declaration = main sach bol raha hoon, sign kiya · Medical questionnaire = apni health ki poori report deni hai!'`,
    example:`Job application form has two parts: Skills/Experience section (what you can do) AND a declaration at the end (I confirm everything above is true, signature). Health insurance proposal = same. Medical questionnaire = skills section (your health details). Declaration = your signature confirming everything is honest. Both carry legal weight!`,
    quiz:`The Standard Declaration in a health insurance proposal is signed by the applicant to confirm?`,
    opts:['That they have read the policy document', 'That all statements in the proposal are true and complete', 'That they accept all IRDAI regulations', 'That they agree to pay all future premiums'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH18-T05', ch:18, subject:'Health Policy Documentation',
    title:'Premium Receipts, Payment of Premium in Advance, and Renewal Notice',
    nutshell:`Premium receipt = acknowledgment of premium paid — insurer must issue it. Advance premium: Section 64VB of Insurance Act requires premium to be paid IN ADVANCE before risk begins (insurer cannot assume risk without receiving premium first). Renewal notice: insurer must send renewal reminder before policy expiry, typically 30 days in advance.`,
    hinglish:`Bolo toh... 'Pehle premium bharo, tabhi cover milega — Section 64VB yahi kehta hai. Renewal notice aaye toh dhyan dena!'`,
    example:`Like a prepaid mobile recharge: you pay FIRST, then get the service. You can't make calls and pay later. Section 64VB says same for insurance — premium must be paid (in advance) before the risk period starts. The insurer CANNOT give you coverage on credit. Renewal notice = the 'your recharge is expiring in 7 days' SMS from your telecom operator.`,
    quiz:`Section 64VB of the Insurance Act requires that?`,
    opts:['Claims must be paid within 30 days', 'Premium must be paid in advance before the risk commences', 'Agents must renew their licenses every 3 years', 'Insurers must publish their financials annually'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH19-T06', ch:19, subject:'Health Insurance Products',
    title:'Top-up and Super Top-up Health Plans',
    nutshell:`Top-up plan: pays claims ONLY when a single hospitalisation bill EXCEEDS the deductible/threshold (e.g., bills above ₹3L covered — one bill must cross ₹3L). Super Top-up plan: pays when total annual hospitalisation expenses EXCEED the threshold (multiple bills combined can cross ₹3L in a year). Super top-up is more comprehensive.`,
    hinglish:`Bolo toh... 'Top-up = ek bill ₹3L se zyada hua toh milega · Super top-up = saare bills milake ₹3L paar kiya toh milega!'`,
    example:`TOP-UP: Three visits to hospital in year — ₹1.5L, ₹1L, ₹2.5L. No single bill crossed ₹3L threshold. TOP-UP pays NOTHING. SUPER TOP-UP: Same three visits — ₹1.5L+₹1L+₹2.5L = ₹5L total. Total crosses ₹3L threshold. Super top-up pays ₹2L (excess over ₹3L). Super top-up = much better protection at very low extra cost!`,
    quiz:`Which type of plan covers hospitalisation expenses when the TOTAL annual medical bills exceed the threshold?`,
    opts:['Regular Mediclaim', 'Top-up plan', 'Super Top-up plan', 'Critical Illness plan'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH19-T07', ch:19, subject:'Health Insurance Products',
    title:'Senior Citizen Health Policies — Special Features',
    nutshell:`Senior citizen health policies cover persons above 60 years. Special features: No medical test mandatory for entry (varies), Higher premium due to age/risk, Co-payment mandatory (typically 20-30%), Pre-existing disease coverage after shorter waiting period, Sub-limits may apply, Separate IRDAI grievance channel for senior citizens.`,
    hinglish:`Bolo toh... 'Budhape mein health insurance mehenga hoga, co-pay bhi hoga — par zaroor lo, tab aur zyada zaroori hai!'`,
    example:`Getting car insurance for an old vintage car: premium is higher, some components may not be covered, there are special conditions. Senior citizen health insurance works similarly — higher premium (age risk), co-payment (shared responsibility), some sub-limits, but absolutely essential at this stage of life when hospitalisation frequency increases.`,
    quiz:`For senior citizen health insurance policies, co-payment is typically?`,
    opts:['Not applicable — no co-payment for seniors', 'Lower than regular policies', 'Mandatory and typically 20-30% of claim', 'Only applicable for in-patient claims'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH19-T08', ch:19, subject:'Health Insurance Products',
    title:'Personal Accident Insurance — Coverage and Benefits',
    nutshell:`Personal Accident (PA) Insurance covers ACCIDENTAL death and disability. Benefits: Accidental Death (100% SA to nominee), Permanent Total Disability (100% SA), Permanent Partial Disability (% of SA as per schedule — e.g., loss of one eye = 50%), Temporary Total Disability (weekly compensation). PA is NOT health insurance — it covers accidents, not illness.`,
    hinglish:`Bolo toh... 'Personal Accident = sirf durghatna ka cover — beemar padne par nahi milega!'`,
    example:`PA insurance is like a safety net specifically for falls: Died in accident (100% net). Lost both hands permanently (100% net). Lost one eye permanently (50% net). Broke arm, can't work for 3 months (weekly compensation for 3 months). BUT got cancer = ZERO from PA insurance (cancer is illness, not accident). PA covers only accident-related events!`,
    quiz:`Personal Accident insurance covers which of the following?`,
    opts:['Hospitalisation due to illness', 'Death due to cancer', 'Permanent disability caused by an accident', 'Pre-existing disease treatment'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH19-T09', ch:19, subject:'Health Insurance Products',
    title:'Overseas Travel Insurance — Cover When You Travel Abroad',
    nutshell:`Overseas Travel Insurance covers medical emergencies abroad (where costs can be extremely high), emergency evacuation, trip cancellation/interruption, loss of baggage, loss of passport, personal liability. Medical cover abroad can be ₹50 lakhs to ₹2 crore — critical since a single surgery in USA can cost ₹30-₹50 lakhs.`,
    hinglish:`Bolo toh... 'Videsh gaye aur beemar pade — ek surgery ₹30-₹50 lakh ki padti hai! Travel insurance zaroori!'`,
    example:`Rohit travels to USA for 2 weeks. Day 3: he gets appendicitis. Emergency surgery in American hospital: ₹35 lakh bill! WITHOUT travel insurance: Rohit's family must arrange ₹35 lakh immediately — sells assets, borrows everywhere. WITH travel insurance: Insurer pays ₹35 lakh directly to hospital. Travel insurance saved Rohit's family from financial ruin for just ₹3,000 premium!`,
    quiz:`The MOST important benefit of overseas travel insurance is?`,
    opts:['Coverage for baggage loss', 'Medical emergency coverage abroad (where costs can be extremely high)', 'Trip cancellation refund', 'Personal liability protection'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH19-T10', ch:19, subject:'Health Insurance Products',
    title:'Micro Insurance and Government Health Schemes for Poor',
    nutshell:`Micro insurance provides affordable health and life cover to Below Poverty Line (BPL) and low-income populations. RSBY (Rashtriya Swasthya Bima Yojana): ₹30,000 annual hospitalisation cover for BPL families, smart card based, cashless at empanelled hospitals, premium shared by Central + State governments. PMJAY (Ayushman Bharat): ₹5 lakh/family/year for BPL families — world's largest government health scheme.`,
    hinglish:`Bolo toh... 'Garib ke liye bhi insurance — RSBY aur PMJAY — sarkar bhar rahi hai unka premium!'`,
    example:`A vegetable vendor earning ₹5,000/month cannot afford ₹15,000 annual health insurance premium. Without RSBY/PMJAY, one hospitalisation can destroy his family financially. With PMJAY: Government pays the premium. Smart card given. He can go to any empanelled hospital. Gets ₹5 lakh cover completely FREE. That's the power of government micro insurance for the poor!`,
    quiz:`Under PM-JAY (Ayushman Bharat), what is the annual health cover provided per eligible family?`,
    opts:['₹30,000', '₹1 lakh', '₹5 lakh', '₹10 lakh'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH19-T11', ch:19, subject:'Health Insurance Products',
    title:'Key Terms in Health Insurance Policies',
    nutshell:`Essential health insurance terminology: Sum Insured (SI) = maximum annual benefit. Premium = cost of cover. Deductible = amount YOU pay before insurance kicks in. Cashless = hospital paid directly. Reimbursement = you pay first, claim back. Network hospital = empanelled with insurer. Pre-authorisation = written permission from TPA. Exclusion = what's NOT covered. Waiting period = time before certain conditions covered.`,
    hinglish:`Bolo toh... 'Health insurance ki apni zubaan hai — ye 9 terms yaad kar lo toh sab samajh aayega!'`,
    example:`Health insurance is like a cricket scoreboard with its own terminology — runs=SI, extras=bonus benefits, wide=exclusion (doesn't count), no-ball=pre-authorisation required, boundary=cashless treatment, duck=deductible you pay first, partnership=co-payment sharing. Learn the language of the game to play it well!`,
    quiz:`In health insurance, a 'Deductible' means?`,
    opts:['The premium amount paid annually', 'The amount the policyholder must pay themselves before insurance coverage begins', 'The maximum amount insurer will pay', 'The co-payment percentage'],
    correct:1, difficulty:'Easy'
  },
  {
    id:'CH20-T04', ch:20, subject:'Health Underwriting',
    title:'IRDAI Health Insurance Regulations — Key Guidelines',
    nutshell:`IRDAI has issued specific health insurance regulations covering: Standardisation of exclusions (certain conditions cannot be excluded), Portability (right to switch insurer without losing accumulated waiting period credit), Renewal guarantee (insurer cannot deny renewal except for fraud), Pre-existing disease coverage mandate after waiting period.`,
    hinglish:`Bolo toh... 'IRDAI ne health insurance mein kuch rights diye hain — portability, renewal guarantee, standardised exclusions!'`,
    example:`IRDAI health regulations are like a tenant's rights charter: Landlord (insurer) CANNOT throw you out for no reason (renewal guarantee). If you move houses (portability), your rental history (waiting period) moves with you. Standard repairs are landlord's duty (standard exclusions are standardised — can't vary wildly). These rights protect health insurance customers!`,
    quiz:`Health insurance portability right means the policyholder can?`,
    opts:['Switch to any hospital network freely', 'Switch health insurer without losing credit for waiting periods already served', 'Claim from two different insurers for same illness', 'Cancel policy anytime without penalty'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH20-T05', ch:20, subject:'Health Underwriting',
    title:'Underwriting of Personal Accident Insurance',
    nutshell:`PA insurance underwriting is simpler than health insurance. Key factors assessed: Occupation (major factor — miner vs office worker), Age (younger = lower risk), Past accidents/claims history, Dangerous hobbies (racing, mountaineering), Disability status. NO medical examination needed usually. Premium = occupation class × age factor × sum insured.`,
    hinglish:`Bolo toh... 'PA underwriting mein occupation sabse bada factor hai — miner zyada premium dega, officer kam!'`,
    example:`Three people apply for PA insurance: SOFTWARE ENGINEER (low risk occupation, desk job, premium = ₹500 for ₹10L cover). CONSTRUCTION WORKER (high risk, works at height, premium = ₹2,500 for ₹10L cover). PROFESSIONAL STUNTMAN (very high risk, premium = ₹10,000+ for ₹10L cover OR declined). Same SA, same age, same health — but occupation changes everything!`,
    quiz:`In Personal Accident insurance underwriting, the MOST important rating factor is?`,
    opts:['Age', 'Gender', 'Occupation', 'Medical history'],
    correct:2, difficulty:'Medium'
  },
  {
    id:'CH20-T06', ch:20, subject:'Health Underwriting',
    title:'Underwriting of Overseas Travel Insurance',
    nutshell:`Overseas travel insurance underwriting considers: Destination country (USA/Europe = expensive = higher premium, Southeast Asia = cheaper). Trip duration (longer = higher premium). Age (senior citizens pay more). Purpose of travel (business = standard, adventure sports = higher). Pre-existing medical conditions (may require declaration, exclusion or loading). No medical exam usually required.`,
    hinglish:`Bolo toh... 'Videsh ka insurance — destination + kitne din + umar + purpose sab milake premium banta hai!'`,
    example:`Two travellers buying travel insurance: PERSON A (25 years, 7-day trip to Thailand, leisure, no PED) — Premium ₹800. PERSON B (65 years, 21-day trip to USA, business, diabetic) — Premium ₹8,500. Age is higher (risk), destination is more expensive (USA treatment costs), duration is longer, has PED. All factors combined = 10× difference in premium!`,
    quiz:`Which destination typically results in the HIGHEST travel insurance premium?`,
    opts:['Southeast Asia (Thailand/Bali)', 'UK/Europe', 'USA/Canada', 'Middle East'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH21-T06', ch:21, subject:'Health Claims',
    title:'Stakeholders in Health Insurance Claims Process',
    nutshell:`Multiple parties are involved in health claim settlement: Policyholder/Patient (makes claim), Hospital/Treating Doctor (provides treatment and documents), TPA (coordinates, processes, settles cashless), Insurance Company (ultimate payer, sets guidelines), IRDAI (regulator ensuring timely settlement), Court/Ombudsman (dispute resolution if needed).`,
    hinglish:`Bolo toh... 'Health claim mein sirf customer aur company nahi — TPA, hospital, doctor, IRDAI sab ek team hain!'`,
    example:`Cricket match has many stakeholders: Players (policyholder), Ground staff (hospital team), Umpires (TPA — neutral decision makers), Match referee (insurance company — final authority), BCCI (IRDAI — rule setter), ICC (courts/ombudsman — final appeal). All play different roles. If any fails their role, the match (claim) suffers!`,
    quiz:`In a health insurance cashless claim, who is responsible for coordinating between the hospital and the insurance company?`,
    opts:['The policyholder', 'The attending doctor', 'The TPA (Third Party Administrator)', 'IRDAI'],
    correct:2, difficulty:'Easy'
  },
  {
    id:'CH21-T07', ch:21, subject:'Health Claims',
    title:'Challenges in Health Insurance Claims Management',
    nutshell:`Key challenges: Fraud (fake bills, inflated claims — 10-15% of all health claims may be fraudulent). Moral hazard (insured becomes careless about health — 'insurance hai toh chalta hai'). Adverse selection (unhealthy people buy more insurance). Claim inflation (gold-plating treatment for insured patients). Rising medical inflation (12-15% annually in India).`,
    hinglish:`Bolo toh... 'Health insurance ki 5 badi mushkilein — fraud, moral hazard, adverse selection, claim inflation, medical cost increase!'`,
    example:`Running a school canteen: 5 problems: 1. Fake receipts (fraud). 2. Students eat more than needed because it's subsidised (moral hazard). 3. Only sick kids buy the canteen subscription (adverse selection). 4. Canteen charges more when meals are subsidised (claim inflation). 5. Food costs rising every year (medical inflation). Health insurance faces ALL FIVE simultaneously!`,
    quiz:`When insured patients receive more expensive treatment than they would need otherwise, this is called?`,
    opts:['Fraud', 'Moral Hazard', 'Claim Inflation (gold-plating)', 'Adverse Selection'],
    correct:2, difficulty:'Hard'
  },
  {
    id:'CH21-T08', ch:21, subject:'Health Claims',
    title:'Claims Reserving in Health Insurance',
    nutshell:`Claims Reserving means setting aside money NOW for claims that have occurred but NOT yet been settled. Types: IBNR (Incurred But Not Reported — claims that have happened but policyholder hasn't filed yet), IBNER (Incurred But Not Enough Reserved — claims filed but final amount not yet known). Adequate reserves = company always able to pay claims.`,
    hinglish:`Bolo toh... 'Reserve = kal ke claim ke liye aaj ka paisa — IBNR aur IBNER — actuary ka kaam!'`,
    example:`Restaurant at end of day: 50 bills paid and closed. But 3 tables haven't paid yet (IBNR — happened but not reported). 5 bills are paid partially — final amount uncertain (IBNER — reported but amount not yet certain). Restaurant must RESERVE money for both. Insurance company does the same — holds money for claims that exist but aren't yet in the system.`,
    quiz:`IBNR in health insurance claims reserving stands for?`,
    opts:['Insured But Not Reimbursed', 'Incurred But Not Reported', 'Insurance Benefit Not Received', 'Inpatient Bill Not Reviewed'],
    correct:1, difficulty:'Hard'
  },
  {
    id:'CH21-T09', ch:21, subject:'Health Claims',
    title:'Personal Accident Claims Management',
    nutshell:`PA (Personal Accident) claims require specific documentation: For Accidental Death — FIR, Postmortem Report, Death Certificate, Accident Proof (witness statement/police report). For Disability — Medical certificate from authorised doctor, Disability certificate. For Temporary Disability — Doctor's certificate of incapacity + duration. Settlement must occur within 30 days of documents.`,
    hinglish:`Bolo toh... 'PA claim mein FIR aur postmortem zaroori hain accidental death ke liye — bina iske claim atka sakta hai!'`,
    example:`Car accident → police arrives → FIR registered → if death: postmortem done → hospital death certificate → these documents go to insurer → insurer verifies accident was genuine (not self-inflicted) → claim settled. The reason for all these documents: PA insurance only pays for ACCIDENTAL events — insurer must verify the event was truly accidental!`,
    quiz:`Which document is specifically required for an Accidental Death Benefit claim but NOT for a maturity claim?`,
    opts:['Discharge summary', 'FIR and Postmortem Report', 'Policy document', 'Premium payment receipts'],
    correct:1, difficulty:'Medium'
  },
  {
    id:'CH21-T10', ch:21, subject:'Health Claims',
    title:'Overseas Travel Insurance Claims Process',
    nutshell:`Overseas travel insurance claims: For medical emergency abroad — contact 24/7 emergency helpline (provided in policy card) immediately. Insurer arranges direct billing with hospital wherever possible. If paid out of pocket → collect ALL original bills, medical reports, diagnosis documents → submit within 30 days of return. Currency conversion at RBI rate on date of treatment.`,
    hinglish:`Bolo toh... 'Videsh mein emergency? Pehle policy card pe diya 24/7 helpline call karo — baaki insurer sambhaalega!'`,
    example:`Priya has a medical emergency in Paris. Step 1: Calls 24/7 helpline number on her travel insurance card (not her Indian insurer's number — a global assistance company). Step 2: Assistance company contacts Paris hospital and arranges direct billing. Step 3: Priya shows insurance card, gets treatment, pays zero (or minimal upfront). Step 4: If paid out of pocket — collects all documents → submits to insurer within 30 days of return.`,
    quiz:`The FIRST thing a traveller should do when facing a medical emergency abroad is?`,
    opts:['Rush to the nearest hospital and pay', 'Call the 24/7 emergency helpline number on their travel insurance card', 'Contact IRDAI for guidance', 'Email their insurance company in India'],
    correct:1, difficulty:'Easy'
  },
];

const SUBJECTS = [
  'All Topics',
  'Insurance Fundamentals',
  'Customer Service',
  'Grievance & Redressal',
  'Agent Regulations',
  'Legal Principles',
  'Life Insurance Concepts',
  'Financial Planning',
  'Life Insurance Products',
  'ULIPs & Modern Products',
  'Insurance Applications',
  'Pricing & Valuation',
  'Policy Documentation',
  'Policy Conditions',
  'Policy Rights & Benefits',
  'Underwriting',
  'Claims & Payments',
  'Health Insurance Basics',
  'Health Policy Documentation',
  'Health Insurance Products',
  'Health Underwriting',
  'Health Claims',
];