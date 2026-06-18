// ══════════════════════════════════════
// INSURANCE ARENA — PLAN AUTO-UPDATE SCRIPT
// Runs on 1st of every month via GitHub Actions
// Fetches brochure PDFs → Gemini AI extracts features
// Compares with live data → saves diff for review
// Emails Mohit if changes detected
// ══════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');

// ── PLAN BROCHURE URLs (from data.js) ──
const PLAN_SOURCES = [
  { id:1,  company:"ABSLI",          plan:"Super Term Plan",          brochureUrl:"https://lifeinsurance.adityabirlacapital.com/uploads/ABSLI_Super_Term_Plan_V01_Brochure_8b9b57ef0d.pdf" },
  { id:2,  company:"HDFC Life",      plan:"Click 2 Protect Supreme",  brochureUrl:"https://www.hdfclife.com/content/dam/hdfclife/pdf/brochures/click-2-protect-supreme-brochure.pdf" },
  { id:3,  company:"Axis Max Life",  plan:"Smart Term Plan Plus",     brochureUrl:"https://www.axismaxlife.com/content/dam/axis-max-life/pdf/brochure/smart-term-plan-plus-brochure.pdf" },
  { id:4,  company:"ICICI Pru",      plan:"iProtect Smart Plus",      brochureUrl:"https://www.iciciprulife.com/content/dam/iciciprulife/pdf/iprotect-smart-plus-brochure.pdf" },
  { id:5,  company:"SBI Life",       plan:"Smart Shield Plus",        brochureUrl:"https://www.sbilife.co.in/content/dam/sbilife/documents/brochure/Smart-Shield-Plus-Brochure.pdf" },
  { id:6,  company:"Tata AIA",       plan:"Sampoorna Raksha Promise",  brochureUrl:"https://www.tataaia.com/content/dam/tataaia/pdf/brochures/sampoorna-raksha-promise-brochure.pdf" },
  { id:7,  company:"Bajaj Allianz",  plan:"Smart Protect Goal",       brochureUrl:"https://www.bajajallianzlife.com/content/dam/bajaj-allianz-life/pdf/Smart-Protect-Goal-Brochure.pdf" },
  { id:8,  company:"Kotak Life",     plan:"e-Term Plan",              brochureUrl:"https://www.kotaklife.com/content/dam/kotak-life/pdf/kotak-e-term-plan-brochure.pdf" },
  { id:9,  company:"PNB MetLife",    plan:"Mera Term Plan Plus",      brochureUrl:"https://www.pnbmetlife.com/content/dam/pnbmetlife/pdf/mera-term-plan-plus-brochure.pdf" },
  { id:10, company:"LIC",            plan:"New Tech-Term Plan",       brochureUrl:"https://licindia.in/documents/36829/327984/LIC+New+Tech-Term+Plan+Brochure.pdf" },
];

// ── CALCULATOR URL VALIDATION ──
const CALC_URLS = [
  { id:1,  url:"https://lifeinsurance.adityabirlacapital.com/term-insurance/absli-super-term-plan/" },
  { id:2,  url:"https://www.hdfclife.com/term-insurance-plans/click-2-protect-supreme" },
  { id:3,  url:"https://www.axismaxlife.com/term-insurance-plans/smart-term-plan-plus" },
  { id:4,  url:"https://www.iciciprulife.com/term-insurance/iprotect-smart-plus-plan.html" },
  { id:5,  url:"https://www.sbilife.co.in/term-insurance/smart-shield-plus" },
  { id:6,  url:"https://www.tataaia.com/term-insurance-plan/sampoorna-raksha-promise" },
  { id:7,  url:"https://bajajallianzlife.com/term-insurance/smart-protect-goal-plan.html" },
  { id:8,  url:"https://www.kotaklife.com/online-term-plan" },
  { id:9,  url:"https://www.pnbmetlife.com/products/protection/mera-term-plan-plus.html" },
  { id:10, url:"https://licindia.in/products/term-assurance-plans/new-tech-term" },
];

// ── HELPERS ──
function fetchUrl(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout, headers: { 'User-Agent': 'Insurance-Arena-Bot/1.0' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function fetchUrlStatus(url) {
  return new Promise(resolve => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 10000, method: 'HEAD' }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
  });
}

// ── GEMINI API CALL ──
async function callGemini(prompt, pdfBase64, mimeType = 'application/pdf') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const body = JSON.stringify({
    contents: [{
      parts: [
        { inlineData: { mimeType, data: pdfBase64 } },
        { text: prompt }
      ]
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
  });
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(text);
        } catch(e) { reject(new Error('Gemini parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── EXTRACT FEATURES FROM PDF ──
async function extractFeaturesFromBrochure(company, plan, brochureUrl) {
  console.log(`   📄 Fetching brochure: ${company}…`);
  const res = await fetchUrl(brochureUrl);
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  const pdfBase64 = res.body.toString('base64');
  const prompt = `You are analyzing a life insurance term plan brochure PDF for ${company}'s ${plan}.
Extract the following information and return ONLY a valid JSON object with NO extra text:
{
  "entryAge": "string",
  "maxMaturity": "string",
  "minSA": "string",
  "maxSA": "string",
  "premiumPay": "string",
  "premiumModes": "string",
  "wholeLife": true/false,
  "terminalIllness": true/false,
  "criticalIllness": true/false,
  "returnOfPremium": true/false,
  "jointLife": true/false,
  "wopDisability": true/false,
  "premiumBreak": true/false,
  "smartExit": true/false,
  "spouseCover": true/false,
  "womenDiscount": "string or No"
}
Return only the JSON. No explanation.`;
  const response = await callGemini(prompt, pdfBase64);
  // Extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Gemini response');
  return JSON.parse(jsonMatch[0]);
}

// ── COMPARE WITH EXISTING DATA ──
function compareFeatures(existing, extracted) {
  const fields = ['entryAge','maxMaturity','minSA','maxSA','premiumPay',
    'wholeLife','terminalIllness','criticalIllness','returnOfPremium',
    'jointLife','wopDisability','premiumBreak','smartExit','spouseCover','womenDiscount'];
  const changes = [];
  for (const field of fields) {
    if (extracted[field] !== undefined && String(existing[field]) !== String(extracted[field])) {
      changes.push({ field, old: existing[field], new: extracted[field] });
    }
  }
  return changes;
}

// ── VALIDATE CALCULATOR URLS ──
async function validateCalcUrls() {
  console.log('\n🔗 Validating calculator URLs…');
  const broken = [];
  for (const item of CALC_URLS) {
    const status = await fetchUrlStatus(item.url);
    if (status === 0 || status === 404 || status === 403) {
      broken.push({ id: item.id, url: item.url, status });
      console.log(`   ❌ Company ${item.id}: HTTP ${status} — ${item.url}`);
    } else {
      console.log(`   ✅ Company ${item.id}: HTTP ${status}`);
    }
  }
  return broken;
}

// ── MAIN ──
async function main() {
  console.log('\n🔄 Insurance Arena — Monthly Plan Update');
  console.log(`📅 Running: ${new Date().toISOString()}`);

  // Step 1 — Validate calculator URLs
  const brokenUrls = await validateCalcUrls();

  // Step 2 — Fetch and extract from brochures (only if Gemini key available)
  const planDiffs = [];
  const errors    = [];

  if (!process.env.GEMINI_API_KEY) {
    console.log('\n⚠️  GEMINI_API_KEY not set — skipping feature extraction');
    console.log('   Set secret GEMINI_API_KEY in GitHub → Settings → Secrets to enable AI extraction');
  } else {
    console.log('\n🤖 Starting Gemini AI brochure extraction…');
    // Load current data
    const dataPath = path.join(__dirname, '..', 'js', 'data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    // Extract PLANS array (basic parse)
    const plansMatch = dataContent.match(/const PLANS\s*=\s*(\[[\s\S]*?\]);/);
    let existingPlans = [];
    if (plansMatch) {
      try { existingPlans = eval(plansMatch[1]); } catch(e) { console.log('⚠️ Could not parse PLANS array'); }
    }

    for (const src of PLAN_SOURCES) {
      try {
        const extracted = await extractFeaturesFromBrochure(src.company, src.plan, src.brochureUrl);
        const existing  = existingPlans.find(p => p.id === src.id) || {};
        const changes   = compareFeatures(existing, extracted);
        if (changes.length > 0) {
          planDiffs.push({ id: src.id, company: src.company, plan: src.plan, changes });
          console.log(`   🔄 ${src.company}: ${changes.length} change(s) detected`);
          changes.forEach(c => console.log(`      • ${c.field}: "${c.old}" → "${c.new}"`));
        } else {
          console.log(`   ✅ ${src.company}: No changes`);
        }
      } catch (err) {
        errors.push({ company: src.company, error: err.message });
        console.log(`   ⚠️  ${src.company}: ${err.message} — skipped`);
      }
      // Rate limit — wait 3 seconds between Gemini calls
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // Step 3 — Save pending update report
  const report = {
    runAt: new Date().toISOString(),
    brokenUrls,
    planDiffs,
    errors,
    hasChanges: brokenUrls.length > 0 || planDiffs.length > 0,
    summary: `${planDiffs.length} plan(s) with feature changes · ${brokenUrls.length} broken URL(s) · ${errors.length} error(s)`
  };

  const reportPath = path.join(__dirname, '..', 'data', 'plans-pending.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📋 Report saved to data/plans-pending.json`);
  console.log(`📊 Summary: ${report.summary}`);

  // Step 4 — Exit with appropriate code
  if (report.hasChanges) {
    console.log('\n🔔 Changes detected — GitHub Actions will send email notification');
    process.exit(2); // Non-zero triggers email in workflow
  } else {
    console.log('\n✅ No changes detected — all plans up to date');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
