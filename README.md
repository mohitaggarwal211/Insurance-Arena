Insurance Arena — India's Insurance Intelligence Hub
> Built by Mohit Aggarwal · Free forever · No ads · No paywalls
Live App
https://insurance-arena.vercel.app
---
What Insurance Arena Does
Section	What it offers
🔍 Compare Plans	10 term insurance plans side-by-side with CSR, features, sales pitch and calculator links
📰 Insurance News	Latest insurance news from 9 trusted sources — auto-updated at 7 AM daily
📚 Finance Learning	IC38 exam content — 21 chapters, 147 topics, quiz on every topic
---
Tech Stack (100% Free, Forever)
Layer	Tool	Cost
Frontend	HTML + CSS + Vanilla JS	Free
Hosting	Vercel	Free
Version Control	GitHub	Free
News Automation	GitHub Actions	Free (2000 min/month)
Plan Update AI	Google Gemini API	Free tier
Email Alerts	Gmail SMTP via GitHub Actions	Free
---
Automation
Daily News (7 AM IST)
GitHub Actions fetches RSS from 9 sources
Saves to `data/news.json`
Vercel auto-deploys in ~30 seconds
Zero manual work
Monthly Plan Update (1st of every month, 9 AM IST)
GitHub Actions fetches all 10 company brochure PDFs
Gemini AI extracts and compares features
Validates all calculator and brochure URLs
Emails Mohit with diff report if changes found
Mohit reviews (2 min) → updates `js/data.js` → Vercel auto-deploys
---
One-Time GitHub Secrets Setup
Go to GitHub → Your Repo → Settings → Secrets and variables → Actions
Add these secrets:
Secret Name	Value	Purpose
`GEMINI_API_KEY`	Your Gemini API key	AI brochure extraction
`NOTIFY_EMAIL_USER`	your-gmail@gmail.com	Sender email
`NOTIFY_EMAIL_PASS`	Gmail App Password	Email auth
`NOTIFY_EMAIL_TO`	mohit@email.com	Your email for alerts
> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate
---
Project Structure
```
insurance-arena/
├── index.html                    ← Complete app (3 sections)
├── css/
│   └── style.css                 ← Complete stylesheet
├── js/
│   ├── data.js                   ← 10 term insurance plans (manually updated)
│   ├── learn-data.js             ← IC38 chapter structure + Ch.1 sample
│   └── app.js                    ← Complete app logic
├── data/
│   ├── news.json                 ← Auto-updated daily by GitHub Actions
│   └── plans-pending.json        ← Monthly diff report (for review)
├── scripts/
│   ├── fetch-news.js             ← Node.js RSS fetch script
│   └── update-plans.js           ← Gemini AI plan extraction script
├── .github/workflows/
│   ├── fetch-news.yml            ← Daily 7 AM IST cron
│   └── update-plans.yml          ← 1st of month 9 AM IST cron
└── README.md
```
---
Annual Manual Update (November)
When IRDAI Annual Report is published (~November):
Download report from irdai.gov.in
Update 10 CSR figures in `js/data.js`
Commit to GitHub → Vercel auto-deploys
That's it. Takes 30 minutes once a year.
---
Data Sources
Plan features: Official IRDAI-filed brochures (company websites)
CSR: IRDAI Annual Report FY 2024–25
News: Public RSS feeds (Livemint, ET, BS, Moneycontrol, HBL, FE, NDTV Profit, IRDAI, PIB)
IC38 content: Original content inspired by IC38 syllabus (not reproduced from III copyright)
---
Disclaimer
Insurance Arena is for reference and educational purposes only. Data sourced from official IRDAI-filed brochures. Premiums vary by individual profile. This is not financial advice or a solicitation to purchase insurance.
---
Built with ❤️ by Mohit Aggarwal
