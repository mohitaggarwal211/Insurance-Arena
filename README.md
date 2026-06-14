# 🛡️ Insurance Arena — India's Insurance Intelligence Hub

A free, professional-grade insurance intelligence platform for India. Compare plans, read news, learn concepts — all in one place.
Built with pure HTML + CSS + JavaScript. Hosted free on GitHub + Vercel. Zero ongoing cost.

---

## 📁 Project Structure

```
insurance-app/
├── index.html          ← Main app page
├── css/
│   └── style.css       ← All styling
├── js/
│   ├── data.js         ← All plan data (edit this to add/update plans)
│   └── app.js          ← App logic (search, filter, sort, modal)
└── README.md           ← This file
```

---

## 🚀 DEPLOYMENT GUIDE (One-Time Setup — ~20 Minutes)

### STEP 1 — Create a GitHub Account
1. Go to https://github.com
2. Click "Sign Up" → enter email, password, username
3. Verify your email

---

### STEP 2 — Create a New Repository
1. After login, click the green **"New"** button (top left)
2. Repository name: `insurance-arena` (or any name you like)
3. Set to **Public** ✅ (required for free GitHub Pages)
4. Check **"Add a README file"**
5. Click **"Create repository"**

---

### STEP 3 — Upload Your Files
1. In your new repository, click **"Add file"** → **"Upload files"**
2. Upload ALL files maintaining the folder structure:
   - `index.html`
   - `css/style.css`
   - `js/data.js`
   - `js/app.js`
3. Scroll down → Click **"Commit changes"**

---

### STEP 4 — Create a Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

---

### STEP 5 — Deploy on Vercel
1. After Vercel login, click **"Add New Project"**
2. You'll see your GitHub repositories listed
3. Find `insurance-arena` → Click **"Import"**
4. Leave all settings as default
5. Click **"Deploy"**
6. Wait 30 seconds → Your app is LIVE! 🎉

---

### STEP 6 — Get Your App URL
Vercel gives you a free URL like:
```
https://insurance-arena.vercel.app
```
Share this link anywhere — WhatsApp, email, QR code, LinkedIn.

---

## 🔄 HOW TO UPDATE DATA (Future Maintenance)

### Adding a New Plan or Updating Existing Data:
1. Open `js/data.js` in GitHub (click the file → pencil icon to edit)
2. Add a new object to the `PLANS` array following the existing format
3. Click **"Commit changes"**
4. Vercel auto-deploys within 30 seconds — app updates instantly ✅

### Updating CSR Figures (Every November):
1. Open `js/data.js`
2. Find each company's `csr:` field
3. Update the number → Commit → Done

---

## ✏️ HOW TO ADD A NEW PLAN (Template)

Copy this template and add it to the `PLANS` array in `js/data.js`:

```javascript
{
  id: 11,                          // Next sequential number
  company: "Full Company Name",
  companyShort: "Short Name",
  plan: "Plan Name",
  uin: "UIN Number",
  csr: 99.00,                      // From IRDAI Annual Report
  csrPending: false,               // Set true if CSR not yet available
  entryAge: "18 – 65 yrs",
  maxMaturity: "85 yrs",
  minSA: "₹25 Lakh",
  maxSA: "Unlimited",
  premiumPay: "Regular / Limited / Single",
  limitedPayTerms: "5, 10, 15 yrs",
  premiumModes: "Annual / Half-yearly / Monthly",
  deathBenefit: "Lump Sum / Income",

  // Feature flags — true/false only
  wholeLife: false,
  terminalIllness: true,
  accidentalDeath: true,
  criticalIllness: false,
  wopDisability: false,
  returnOfPremium: false,
  jointLife: false,
  premiumBreak: false,
  smartExit: false,
  spouseCover: false,
  lifeStage: false,

  // Tags shown on card (max 6)
  tags: [
    { label: "Feature 1 ✓", type: "yes" },   // yes = green
    { label: "Feature 2 ✓", type: "amber" },  // amber = orange
    { label: "Missing ✗",   type: "no" },     // no = red
  ],

  // 3 key stats shown on card
  keyStats: [
    { val: "85 yrs", lbl: "Max Cover" },
    { val: "99%",    lbl: "CSR FY25" },
    { val: "3 Types", lbl: "Variants" },
  ],

  // Sales pitch (shown on card + modal)
  salesPitch: "Why a sales professional should recommend this plan...",

  // Detailed bullet points (shown in modal)
  keyFeatures: [
    "Feature point 1",
    "Feature point 2",
  ],

  womenDiscount: "15% on base premium",
  salariedDiscount: "10% on first year",

  calcUrl: "https://company-calculator-url.com",
  brochureUrl: "https://company-brochure-url.pdf",
  lastUpdated: "June 2025"
}
```

---

## 📋 FUTURE EXPANSION PLAN

When you add 20+ plans across 10-12 companies:

1. **Add product categories** — duplicate `index.html` as `ulip.html`, `endowment.html`
2. **Add category tabs** — add navigation links in the header
3. **Each category** gets its own data file: `data-ulip.js`, `data-endowment.js`
4. Data structure stays identical — zero relearning needed

---

## ⚠️ DISCLAIMER

This tool is for reference and educational purposes only.
Data sourced from official IRDAI-filed brochures and company websites.
Premiums vary based on individual profile, underwriting, and plan variant.
This is not a solicitation or financial advice.

---

## 📅 DATA LAST UPDATED
June 2025 | IRDAI Regulated | GST = 0% w.e.f. 22 Sep 2025
