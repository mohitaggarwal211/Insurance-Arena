// ══════════════════════════════════════════════════════════
// INSURANCE ARENA — NEWS SYSTEM v6 (COMPLETE REBUILD)
// Single source: Google News RSS
// Extracts direct publisher URL when possible, else uses
// Google News redirect (which 302-redirects to the article)
// Runs: 7:00 AM IST + 4:00 PM IST via GitHub Actions
// ══════════════════════════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const MAX_ARTICLES   = 45;
const MAX_AGE_DAYS   = 30;
const MIN_VALID      = 7;   // never write if fewer than this many valid

// ── 7 CATEGORIES — Google News RSS only ──
const SOURCES = [
  { category:'insurance',       q:'insurance india' },
  { category:'irdai',           q:'IRDAI' },
  { category:'tax',             q:'income tax india' },
  { category:'mutualfunds',     q:'mutual funds india' },
  { category:'banking',         q:'banking india RBI' },
  { category:'markets',         q:'stock market sensex nifty india' },
  { category:'personalfinance', q:'personal finance investment india' },
];
const rssUrl = q => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;

// ── HTTP GET (follows redirects) ──
function get(url, timeout = 15000, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 5) return reject(new Error('Too many redirects'));
    const req = https.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsuranceArenaBot/6.0; +https://insurance-arena.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-IN,en;q=0.9',
      }
    }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        return get(res.headers.location, timeout, depth+1).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── DECODE: extract direct publisher URL from Google News CBMi token ──
// Returns publisher URL if decodable, else null (caller uses redirect URL)
function extractPublisherUrl(linkOrGuid) {
  try {
    let token = linkOrGuid;
    const m = linkOrGuid.match(/articles\/([A-Za-z0-9_\-]+)/);
    if (m) token = m[1];
    if (!token.startsWith('CBM')) return null;
    let b64 = token.replace(/^CBMi/, '').replace(/^CBM[a-zA-Z]/, '');
    b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    const urlMatch = decoded.match(/https?:\/\/[^\s\x00-\x1f"'<>]+/);
    if (urlMatch) {
      let url = urlMatch[0]
        .replace(/[^\x20-\x7e].*$/, '')
        .split('\u0012')[0].split('\u0001')[0]
        .replace(/[\x00-\x1f].*$/, '');
      if (url.startsWith('https://') && url.length > 15 && !url.includes('news.google.com')) {
        // sanity: must have a domain and a path
        try { const u = new URL(url); if (u.pathname.length > 1) return url; } catch(e) {}
      }
    }
    return null;
  } catch(e) { return null; }
}

// ── PARSE RSS ITEMS ──
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

    // Title: Google News appends " - Publisher" — split it
    let rawTitle = field('title');
    let title = rawTitle, publisher = '';
    const lastDash = rawTitle.lastIndexOf(' - ');
    if (lastDash > 20) { title = rawTitle.slice(0, lastDash).trim(); publisher = rawTitle.slice(lastDash + 3).trim(); }

    // Source name from <source> tag
    const srcMatch = b.match(/<source[^>]*>([^<]+)<\/source>/i);
    const source = (srcMatch && srcMatch[1].trim()) || publisher || 'Google News';

    // Link & guid
    const linkRaw = (b.match(/<link[^>]*>\s*(https?[^\s<]+)/i) || [])[1] || '';
    const guidRaw = (b.match(/<guid[^>]*>\s*([^<]+)/i) || [])[1] || '';

    // Try direct publisher URL, else fall back to Google News redirect
    const directUrl   = extractPublisherUrl(linkRaw) || extractPublisherUrl(guidRaw);
    const redirectUrl = linkRaw.startsWith('http') ? linkRaw : '';
    const finalUrl    = directUrl || redirectUrl;

    const pubDate = field('pubDate') || field('dc:date');
    const summary = field('description').substring(0, 200);

    if (title && title.length > 10 && finalUrl && finalUrl.startsWith('https://')) {
      items.push({
        title,
        summary: summary || `${title}. Tap to read the full article.`,
        source,
        category,
        publishedAt: toISO(pubDate),
        url: finalUrl,
        isDirect: !!directUrl,   // true = publisher URL, false = Google redirect
        isSeed: false,
      });
    }
  }
  return items;
}

// ── VALIDATION (Step 6) ──
function isValid(a) {
  if (!a.title || a.title.length < 10) return false;
  if (!a.source) return false;
  if (!a.publishedAt) return false;
  if (!a.url || typeof a.url !== 'string') return false;
  if (!a.url.startsWith('https://')) return false;
  if (a.url.includes('news.google.com/search')) return false;  // never a search page
  try { new URL(a.url); } catch(e) { return false; }
  return true;
}

function toISO(d) { try { const x = new Date(d); return isNaN(x) ? new Date().toISOString() : x.toISOString(); } catch(e) { return new Date().toISOString(); } }
function isExpired(iso) { return iso && (Date.now() - new Date(iso).getTime()) / 86400000 > MAX_AGE_DAYS; }
function norm(t) { return (t||'').toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,70); }

// ── MAIN ──
async function main() {
  console.log('\n📰 Insurance Arena News v6 — Google News RSS');
  console.log('🕐', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), 'IST');
  console.log('─'.repeat(55));

  const newsPath = path.join(__dirname, '..', 'data', 'news.json');
  let existing = [];
  try {
    const ex = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    existing = (ex.articles || []).filter(isValid);
    console.log(`📂 Existing valid: ${existing.length}`);
  } catch(e) { console.log('📂 No existing news.json'); }

  // Fetch all categories
  const fetched = [];
  const seen = new Set();
  let directCount = 0, redirectCount = 0;

  for (const src of SOURCES) {
    process.stdout.write(`   [${src.category}] `);
    try {
      const res = await get(rssUrl(src.q));
      if (res.status !== 200) { console.log(`❌ HTTP ${res.status}`); continue; }
      const items = parseItems(res.body, src.category);
      let added = 0;
      for (const item of items) {
        if (!isValid(item)) continue;
        const n = norm(item.title);
        if (seen.has(n)) continue;
        seen.add(n);
        fetched.push(item);
        item.isDirect ? directCount++ : redirectCount++;
        added++;
        if (added >= 8) break;  // cap per category
      }
      console.log(`✅ ${added}`);
    } catch(e) { console.log(`⚠️ ${e.message.substring(0,30)}`); }
  }

  console.log(`\n🆕 Fetched: ${fetched.length} (${directCount} direct publisher URLs, ${redirectCount} Google redirects)`);

  // Merge with existing (dedup), drop expired
  const allSeen = new Set(fetched.map(a => norm(a.title)));
  let preserved = 0;
  for (const old of existing) {
    const n = norm(old.title);
    if (!allSeen.has(n) && !isExpired(old.publishedAt)) {
      fetched.push(old); allSeen.add(n); preserved++;
    }
  }
  console.log(`🛡️  Preserved existing: ${preserved}`);

  // Sort latest first, cap at 45
  const final = fetched
    .filter(isValid)
    .sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ARTICLES);

  // FAIL-SAFE: never write empty/tiny
  if (final.length < MIN_VALID) {
    console.log(`⚠️  Only ${final.length} valid (< ${MIN_VALID}). NOT overwriting — keeping existing news.json.`);
    process.exit(0);
  }

  const byCat = {};
  final.forEach(a => byCat[a.category] = (byCat[a.category]||0)+1);
  console.log('📊 Categories:', byCat);

  const output = {
    lastUpdated:   new Date().toISOString(),
    articlesCount: final.length,
    liveCount:     final.filter(a => !a.isSeed).length,
    seedCount:     final.filter(a => a.isSeed).length,
    directUrls:    final.filter(a => a.isDirect).length,
    redirectUrls:  final.filter(a => !a.isDirect).length,
    source:        'Google News RSS',
    articles:      final,
  };

  fs.writeFileSync(newsPath, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved ${final.length} articles`);
  console.log(`📎 Sample: ${final[0].url.substring(0,70)}`);
}

main().catch(e => { console.error('❌ Fatal:', e.message); process.exit(1); });
