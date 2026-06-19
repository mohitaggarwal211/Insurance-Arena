// ══════════════════════════════════════════════════════════
// INSURANCE ARENA — NEWS SYSTEM v7 (FINAL)
// Source: Google News RSS ONLY
// URL strategy: RAW Google News redirect link (NO decoding)
//   → Google maintains the redirect, never hard-404s
//   → Opens the live article via Google's own resolver
// NO hardcoded article URLs anywhere (those caused 404s)
// Runs: 7:00 AM IST + 4:00 PM IST via GitHub Actions
// ══════════════════════════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const MAX_ARTICLES = 45;
const MAX_AGE_DAYS = 30;
const MIN_VALID    = 7;   // fail-safe: never overwrite if fewer than this

// 7 categories — Google News RSS search feeds
const SOURCES = [
  { category:'insurance',       q:'insurance india' },
  { category:'irdai',           q:'IRDAI insurance regulator india' },
  { category:'tax',             q:'income tax india' },
  { category:'mutualfunds',     q:'mutual funds india' },
  { category:'banking',         q:'banking RBI india' },
  { category:'markets',         q:'stock market sensex nifty india' },
  { category:'personalfinance', q:'personal finance investment india' },
];
const rssUrl = q => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;

function get(url, timeout = 15000, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) return reject(new Error('redirect loop'));
    const req = https.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsuranceArenaBot/7.0; +https://insurance-arena.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-IN,en;q=0.9',
      }
    }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location)
        return get(res.headers.location, timeout, depth+1).then(resolve).catch(reject);
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function parseItems(xml, category) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < 12) {
    const b = m[1];
    const field = tag => {
      const r = b.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)? *([\\s\\S]*?) *(?:\\]\\]>)?<\\/${tag}>`, 'i'));
      return r ? r[1].trim().replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim() : '';
    };

    // Title: Google appends " - Publisher" → split off the source
    let rawTitle = field('title');
    let title = rawTitle, publisher = '';
    const dash = rawTitle.lastIndexOf(' - ');
    if (dash > 20) { title = rawTitle.slice(0,dash).trim(); publisher = rawTitle.slice(dash+3).trim(); }

    const srcMatch = b.match(/<source[^>]*>([^<]+)<\/source>/i);
    const source = (srcMatch && srcMatch[1].trim()) || publisher || 'Google News';

    // RAW Google News redirect link — DO NOT decode, DO NOT transform
    const link = (b.match(/<link[^>]*>\s*(https?:\/\/news\.google\.com\/rss\/articles\/[^\s<]+)/i) || [])[1]
              || (b.match(/<link[^>]*>\s*(https?[^\s<]+)/i) || [])[1] || '';

    const pubDate = field('pubDate') || field('dc:date');
    const summary = field('description').substring(0, 200);

    if (title && title.length > 10 && link.startsWith('https://')) {
      items.push({
        title,
        summary: summary || `${title}.`,
        source,
        category,
        publishedAt: toISO(pubDate),
        url: link,         // raw Google News redirect — guaranteed to resolve
        isSeed: false,
      });
    }
  }
  return items;
}

// Validation (Step 6)
function isValid(a) {
  if (!a.title || a.title.length < 10) return false;
  if (!a.source) return false;
  if (!a.publishedAt) return false;
  if (!a.url || !a.url.startsWith('https://')) return false;
  if (a.url.includes('news.google.com/search')) return false; // never a search page
  try { new URL(a.url); return true; } catch(e) { return false; }
}

function toISO(d){ try{ const x=new Date(d); return isNaN(x)?new Date().toISOString():x.toISOString(); }catch(e){ return new Date().toISOString(); } }
function isExpired(iso){ return iso && (Date.now()-new Date(iso).getTime())/86400000 > MAX_AGE_DAYS; }
function norm(t){ return (t||'').toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,70); }

async function main() {
  console.log('\n📰 Insurance Arena News v7 — Google News RSS (raw redirect URLs)');
  console.log('🕐', new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}), 'IST');
  console.log('─'.repeat(55));

  const newsPath = path.join(__dirname, '..', 'data', 'news.json');
  let existing = [];
  try {
    const ex = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    existing = (ex.articles || []).filter(isValid);
    console.log(`📂 Existing valid: ${existing.length}`);
  } catch(e) { console.log('📂 No existing news.json — first run'); }

  const fetched = [];
  const seen = new Set();
  for (const src of SOURCES) {
    process.stdout.write(`   [${src.category}] `);
    try {
      const res = await get(rssUrl(src.q));
      if (res.status !== 200) { console.log(`❌ HTTP ${res.status}`); continue; }
      const items = parseItems(res.body, src.category);
      let added = 0;
      for (const it of items) {
        if (!isValid(it)) continue;
        const n = norm(it.title);
        if (seen.has(n)) continue;
        seen.add(n);
        fetched.push(it);
        if (++added >= 8) break;
      }
      console.log(`✅ ${added}`);
    } catch(e) { console.log(`⚠️ ${e.message}`); }
  }
  console.log(`\n🆕 Fetched: ${fetched.length}`);

  // Merge existing (dedup, drop expired)
  const allSeen = new Set(fetched.map(a => norm(a.title)));
  let preserved = 0;
  for (const old of existing) {
    const n = norm(old.title);
    if (!allSeen.has(n) && !isExpired(old.publishedAt)) { fetched.push(old); allSeen.add(n); preserved++; }
  }
  console.log(`🛡️  Preserved: ${preserved}`);

  const final = fetched.filter(isValid)
    .sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ARTICLES);

  // FAIL-SAFE: never overwrite with too little
  if (final.length < MIN_VALID) {
    console.log(`⚠️  Only ${final.length} valid (< ${MIN_VALID}) — keeping existing news.json untouched.`);
    process.exit(0);
  }

  const byCat = {};
  final.forEach(a => byCat[a.category] = (byCat[a.category]||0)+1);
  console.log('📊', byCat);

  const output = {
    lastUpdated:   new Date().toISOString(),
    articlesCount: final.length,
    source:        'Google News RSS (raw redirect URLs — always resolve)',
    articles:      final,
  };
  fs.writeFileSync(newsPath, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved ${final.length} articles`);
  console.log(`📎 Sample URL: ${final[0].url.substring(0,60)}...`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
