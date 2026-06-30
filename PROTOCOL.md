Insurance Arena — AI Update Protocol
Version 1.0 | Effective: June 2026

THIS FILE MUST BE READ BY AI BEFORE EVERY SINGLE CHANGE TO INSURANCE ARENA.
Non-compliance = wrong data in a compliance-reviewed platform.
---
CONTEXT
Insurance Arena (insurancearena.in) is under active compliance and marketing review at ABSLI.
Data errors = compliance violations. There is zero tolerance for wrong product data.
Owner: Mohit Aggarwal, Sales Coach, ABSLI North Zone.
---
RULE 1 — BEFORE TOUCHING ANY FILE
Run a full-scope grep FIRST. Share the output in chat. Never assume you know all instances.
```bash
grep -rn "[term being changed]" js/
```
Example: Before changing "Joint Life" → grep -rn "Joint Life|jointLife" js/
The output must be shown to Mohit before any edit is made.
---
RULE 2 — NO HARDCODED DATA WITHOUT BROCHURE SOURCE
Every hardcoded value in app.js must cite its source explicitly in chat:
✅ CORRECT: "From ABSLI Anmol Akshaya brochure — max entry age: 60 years"
❌ WRONG:   Typing "65 yrs" from general knowledge or assumption
If source cannot be confirmed → write "Verify from brochure" in the data, never guess.
---
RULE 3 — FIX = VERIFY EVERYWHERE, NOT JUST WHERE POINTED
When fixing an issue (e.g. remove rupee amount):
grep ALL occurrences across ALL js files
Fix every instance
Confirm zero remaining instances before closing the fix
The "I fixed it in one place" error has caused multiple compliance-risk mistakes.
---
RULE 4 — 4-LAYER VERIFICATION BEFORE EVERY PACKAGE
Layer 1: node --check js/[file].js          → syntax
Layer 2: vm.runInContext(...)               → runtime
Layer 3: 50-plan audit (toolkit test)       → data integrity
Layer 4: grep for known risk patterns       → compliance check
Risk patterns to grep before every package:
```bash
grep -n "₹[0-9]\|irr\b\|IRR\|Joint Life.*Yes\|65 yrs\|Verify from brochure" js/app.js js/product-meta.js
```
Output must be pasted in chat. Mohit confirms. Then package.
---
RULE 5 — NO PACKAGING WITHOUT EXPLICIT INSTRUCTION
Never create a zip/package unless Mohit says "ready to upload."
All changes stay in working files until that instruction.
One final zip. One upload. No patch1, patch2, patch3 churn.
---
RULE 6 — DATA FIELDS THAT MUST NEVER SHOW RUPEE AMOUNTS IN UI
These fields exist in data files for internal use but must NEVER display ₹ amounts:
annualIncome, annualIncomeY2 (Nishchit section)
lumpsum (Nishchit section)
sa / cashback (Par/Nishchit plan features)
irr, irr4, irr8, mat4, mat8 (ALL sections — IRR fully banned)
Allowed in UI: percentages that are structural product features (e.g. "5% p.a.", "110% of premiums")
NOT allowed: specific rupee figures based on benchmark assumptions
---
RULE 7 — PRODUCT DATA ACCURACY CHECKLIST
Before adding/updating any product field, verify:
[ ] Plan name matches current IRDAI-registered brochure exactly
[ ] UIN matches current version (VXX suffix matters)
[ ] Entry age / maturity age from official brochure only
[ ] Joint life: confirmed per plan (many plans are Individual only)
[ ] IRR: never in any field, anywhere
[ ] Features: only from latest published brochure
---
KNOWN ERRORS ALREADY FIXED (do not reintroduce)
Error	Status
ABSLI Anmol Akshaya jointLife: true	Fixed → false
ABSLI Anmol Akshaya entry age "65 yrs"	Fixed → 60 yrs
ABSLI Anmol Akshaya "Joint Life" in keyHighlights	Fixed → removed
IRR fields in Par/Nishchit data	Fixed → removed
Income/SA rupee amounts in Nishchit UI	Fixed → removed
Bajaj ACE in Non-Par Savings	Fixed → removed
HDFC "Click 2 Protect Supreme"	Fixed → Supreme Plus
Tata AIA/Bajaj/PNB/LIC jointLife: true	Fixed → false
Raw feature keys showing in Tata AIA UI	Fixed → smart display
---
CURRENT PLATFORM STATE
URL: insurancearena.in (also insurance-arena.vercel.app)
GitHub: github.com/mohitaggarwal211/Insurance-Arena
Stack: Pure HTML/CSS/JS → GitHub → Vercel auto-deploy
Plans: 50 plans | 10 companies | 6 categories
Status: L1 manager review → compliance → marketing → full rollout
Analytics: GA4 G-6GP0N6QYWB + Microsoft Clarity xax2o9x9ex
---
FILE STRUCTURE
```
index.html
css/style.css
js/
  data.js              → Term Insurance (10 plans)
  anmol-data.js        → Participating Par (5 plans)
  nishchit-data.js     → Non-Par Early Income (3 plans)
  savings-income-data.js → Non-Par Savings (8) + Income (9)
  annuity-data.js      → Annuity (15 plans)
  product-meta.js      → keyHighlights, whySuit, scoreData for all 50
  app.js               → Main render logic
  avb-toolkit.js       → A vs B + Toolkit
  new-features.js      → Share, flashcard
  calcs-extra.js       → Calculators
  learn-data.js        → Learning Hub
PROTOCOL.md            → This file (read before every change)
```
---
SCRIPT LOAD ORDER (critical — do not change)
data.js → annuity-data.js → anmol-data.js → nishchit-data.js → savings-income-data.js → learn-data.js → product-meta.js → avb-toolkit.js → new-features.js → app.js

---
RULE 8 — CATEGORY CLASSIFICATION GUARD
Before placing any plan in a category, verify the plan type matches:
Category	Must Be
Participating (Par)	Non-Linked Participating only
Non-Par Savings	Non-Linked Non-Participating only
Non-Par Income	Non-Linked Non-Participating only
Non-Par Early Income	Non-Linked Non-Participating only
Annuity	Individual Annuity / Deferred Annuity only
Term Insurance	Pure Risk / Term only
If plan type contains "Participating" → it cannot be in Non-Par category.
If plan type contains "Linked" → it cannot be in any Non-Par or Par category here.
Always state the plan type from brochure before placing it.
---
RULE 9 — WHEN FIXING DATA, FIX ALL 3 LAYERS
Every product fact exists in potentially 3 places:
Layer	Location	Example
1. Raw data	js/[category]-data.js field	jointLife: true
2. UI display	js/app.js render function	hardcoded "Joint Life ✅ Yes"
3. Meta/highlights	js/product-meta.js keyHighlights	"Joint Life Protection — spouse..."
A fix is ONLY complete when all 3 layers are checked and corrected.
Checklist to paste in chat before closing any data fix:
```
[ ] Layer 1: Data file field updated
[ ] Layer 2: app.js render — grep confirmed clean
[ ] Layer 3: product-meta.js keyHighlights — grep confirmed clean
```
---
RULE 10 — PYTHON STRING REPLACEMENT SAFETY
All Python replace() operations must account for both quote styles.
Before any replacement, grep the actual file to see which quotes are used:
```bash
grep -n "term to replace" js/[file].js | head -3
```
Then match exactly. A failed replace() returns no error — it silently does nothing.
After every replace(), grep again to confirm the old text is gone.
```python
# ALWAYS verify after replacement:
if 'old_text' in code:
    code = code.replace('old_text', 'new_text')
    print("✅ replaced")
    # Then confirm:
    assert 'old_text' not in code, "Replace failed — text still present"
else:
    print("❌ Pattern not found — check quotes and spacing")
```
---
RULE 11 — CSS VARIABLE FAILURE ZONES
CSS variables (`var(--name)`) do NOT work reliably inside:
`position: fixed` elements
Inline styles injected via JavaScript
Shadow DOM
In these contexts, always use hardcoded hex values:
```css
/* WRONG in fixed popup: */
background: var(--navy);

/* CORRECT: */
background: #0F172A;
```
Known failure zones in IA:
`.ann-matrix-popup` — use hardcoded colors only
Any `position: fixed` overlay created in JS
---
RULE 12 — AFTER EVERY UI FIX, CHECK PITCH + UNIQUE FEATURE + NOTE FIELDS
When removing data from UI display, also check these data file fields:
`pitch` — often contains same figures in narrative form
`uniqueFeature` — often contains same data in different phrasing
`note` — footnote field, often has specific amounts
`salesPitch` — sales narrative, may contain amounts
grep pattern:
```bash
grep -n "pitch\|uniqueFeature\|note\b" js/nishchit-data.js | head -20
```
---
RULE 13 — JOINT LIFE: DEFAULT ASSUMPTION IS FALSE
For all insurance plans unless explicitly confirmed from brochure:
`jointLife: false` is the safe default
"Individual plan" in the plan type description = No joint life
Only mark `jointLife: true` when brochure explicitly states joint life option
When updating joint life for one plan in a group (Par, Savings etc.),
grep ALL plans in that category file and verify each one individually.
Never change one plan and assume others are correct.
---
RULE 14 — UIN VERSION MUST BE CURRENT
When recording a UIN:
Always use the latest version (highest VXX number from official sources)
Older versions on third-party sites are unreliable
Source priority: Insurer's own website > IRDAI website > Bank partner pages > Aggregators
After writing a UIN, grep to confirm no other plan has the same UIN
```bash
grep -rn "101N189V03" js/   # Should appear exactly once
```
Duplicate UINs = data error. Each plan has a unique UIN.
---
RULE 15 — SYNTAX VERIFICATION AFTER EVERY PYTHON EDIT
After every Python file manipulation, immediately run:
```bash
node --check js/[file].js
```
Common Python insertion errors:
Double commas `,,` — from inserting after existing trailing comma
Missing comma after `]` before next field
Quote style mismatch breaking JS parsing
Unclosed template literals
Run node --check BEFORE moving to the next file, not at the end of all edits.
---
RULE 16 — NEVER PACKAGE INCREMENTALLY
Wrong approach: patch1 → patch2 → patch3 → patch4...
Right approach: Work in files → "ready to upload" → ONE final zip
Reason: Mohit may not upload every patch. Cumulative changes
get lost or confused. One package = one source of truth.
If packaging is needed mid-session to show a demo, clearly label it
"DEMO ONLY — not for upload" and produce the final package separately.
---
RULE 17 — PLAN COUNT INTEGRITY
Current plan counts (do not change without explicit instruction):
Term Insurance: 10 plans
Participating: 5 plans
Non-Par Early Income: 3 plans
Non-Par Savings: 8 plans
Non-Par Income: 9 plans
Annuity: 15 plans
TOTAL: 50 plans
After any data change, run the 50-plan audit:
```
RESULT: 50 ✅ PASS | 0 ❌ FAIL | Total: 50
```
If total ≠ 50, a plan was accidentally removed or duplicated. Fix before proceeding.
---
RULE 18 — IRR IS PERMANENTLY BANNED
IRR (Internal Rate of Return) must not appear ANYWHERE in:
Data files (irr, irr4, irr8, mat4, mat8, totalReturn fields)
UI display
Key Highlights
Sales Story / Pitch
Toolkit messages
Comparison tables
This is a compliance requirement, not a preference.
grep to confirm before every package:
```bash
grep -rn "\birr\b\|irr4\|irr8\|mat4\|mat8" js/ | grep -v "//\|calcIRR\|irr-"
```
Result must be empty (only the IRR calculator tool is permitted).
---
COMPLIANCE PRE-FLIGHT CHECKLIST
Run before every final package. Paste results in chat.
```bash
echo "=== IRR check ===" && grep -rn "\birr\b\|irr4\|irr8" js/ | grep -v "calcIRR\|irr-\|//"
echo "=== Rupee amounts in UI ===" && grep -n "₹[0-9]" js/app.js | grep -v "//\|minSA\|maxSA\|75K\|₹1L\|₹5L\|₹2Cr\|₹50L\|₹1Cr"
echo "=== Joint Life Yes check ===" && grep -n "Joint Life.*Yes\|jointLife.*true" js/app.js js/product-meta.js
echo "=== Verify strings in UIns ===" && grep -rn "uin.*[Vv]erify\|uin.*onfirm\|uin.*ending" js/
echo "=== Plan count ===" && node -e "eval(require('fs').readFileSync('js/data.js','utf8').replace(/const /g,'var ')); eval(require('fs').readFileSync('js/anmol-data.js','utf8').replace(/const /g,'var ')); eval(require('fs').readFileSync('js/nishchit-data.js','utf8').replace(/const /g,'var ')); eval(require('fs').readFileSync('js/savings-income-data.js','utf8').replace(/const /g,'var ')); eval(require('fs').readFileSync('js/annuity-data.js','utf8').replace(/const /g,'var ')); console.log('Term:',PLANS.length,'Par:',ANMOL_PLANS.length,'EI:',NISHCHIT_PLANS.filter(p=>!p.excluded).length,'Sav:',SAVINGS_PLANS.filter(Boolean).length,'Inc:',INCOME_PLANS.filter(Boolean).length,'Ann:',ANNUITY_PLANS.length);"
```
All checks must return clean/expected results before packaging.
