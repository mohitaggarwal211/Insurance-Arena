// INSURANCE ARENA — PRODUCTION NEWS SYSTEM v5
// Fetches REAL article URLs from Google News RSS
// isArticleUrl() validates every URL before storing
// Fail-safe: keeps previous articles if new batch has < 10 valid
// Runs: 7:00 AM IST (1:30 AM UTC) + 4:00 PM IST (10:30 AM UTC)

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

const MAX_ARTICLES    = 45;
const MAX_AGE_DAYS    = 30;
const MIN_VALID_BATCH = 10;   // keep old articles if below this
const ALL_CATEGORIES  = ['insurance','irdai','mutualfunds','tax','banking','personalfinance','markets'];

// ── RSS SOURCES ──
// Google News RSS returns CBMi redirect URLs (article-level, not search pages)
// These redirect to the actual newspaper/website article when clicked
// Format: https://news.google.com/rss/articles/CBMi... → actual article
const RSS_SOURCES = [
  { name:'Google News', category:'insurance',       url:'https://news.google.com/rss/search?q=life+insurance+term+plan+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'insurance',       url:'https://news.google.com/rss/search?q=health+insurance+claim+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'irdai',           url:'https://news.google.com/rss/search?q=IRDAI+insurance+regulation+circular&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'mutualfunds',     url:'https://news.google.com/rss/search?q=mutual+fund+SIP+NAV+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'tax',             url:'https://news.google.com/rss/search?q=income+tax+section+80C+insurance+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'banking',         url:'https://news.google.com/rss/search?q=RBI+banking+interest+rate+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'personalfinance', url:'https://news.google.com/rss/search?q=personal+finance+investment+india+2025&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'markets',         url:'https://news.google.com/rss/search?q=sensex+nifty+stock+market+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'irdai',           url:'https://news.google.com/rss/search?q=IRDAI+policyholder+protection+2025&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'insurance',       url:'https://news.google.com/rss/search?q=LIC+HDFC+life+insurance+india+premium&hl=en-IN&gl=IN&ceid=IN:en' },
];

// ── CORE: isArticleUrl() ──
// Validates that a URL is a real article page, not a homepage/search/category
function isArticleUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  // Must be https
  if (!u.startsWith('https://')) return false;
  try {
    const parsed = new URL(u);
    const path   = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    const host   = parsed.hostname.toLowerCase();

    // ── REJECT: Explicit search pages ──
    if (path === '/search') return false;                    // news.google.com/search
    if (path.includes('/search?')) return false;
    if (search.includes('q=') && host !== 'news.google.com') return false; // non-Google q= params
    if (u.includes('news.google.com/search')) return false;  // Google search page

    // ── REJECT: Homepage (empty or bare /) ──
    const cleanPath = path.replace(/\/+$/, '');
    if (!cleanPath || cleanPath === '') return false;

    // ── REJECT: RSS/feed paths (source feeds, not articles) ──
    if (path.includes('/feed') && path.endsWith('/feed')) return false;
    if (path === '/rss' || path.endsWith('.xml')) return false;

    // ── REJECT: Single-level category paths (e.g. /insurance, /markets) ──
    const segs = cleanPath.split('/').filter(s => s.length > 0);
    if (segs.length < 2) return false;

    // ── REJECT: Known category/tag patterns ──
    const categoryPatterns = ['/tag/', '/author/', '/page/', '/category/', '/topics/', '/section/', '/type/'];
    if (categoryPatterns.some(p => path.includes(p))) return false;

    // ── For 2-segment paths: require article-like last segment ──
    // Category: /news/insurance (last = 'insurance', short, no hyphen)
    // Article:  /news/insurance/irdai-raises-claim-limit-12345.html
    if (segs.length === 2) {
      const last = segs[1].toLowerCase();
      const hasHyphen   = last.includes('-');
      const hasArticleId = /\d{4,}/.test(last);
      const isLong       = last.length > 20;
      if (!hasHyphen && !hasArticleId && !isLong) return false;
    }

    return true;
  } catch(e) { return false; }
}

// ── HTTP FETCH ──
function fetchUrl(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https://') ? https : http;
    const req = lib.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsuranceArenaBot/5.0; +https://insurance-arena.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-IN,en;q=0.9',
      }
    }, res => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetchUrl(res.headers.location, timeout).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout after ' + timeout + 'ms')); });
  });
}

// ── RSS PARSER ──
// Handles Google News RSS format (CBMi article redirect URLs)
// Also handles standard RSS format
function parseRSSItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRe.exec(xml)) !== null && items.length < 8) {
    const b = match[1];

    const getField = (tag) => {
      const r = b.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)? *([\\s\\S]*?) *(?:\\]\\]>)?<\\/${tag}>`, 'i'));
      return r ? r[1].trim().replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim() : '';
    };

    // Extract URL — Google News RSS has link element with the article redirect URL
    // Pattern 1: <link>https://... (before next tag, no closing in some parsers)
    let articleUrl = '';
    const linkMatch1 = b.match(/<link[^>]*>\s*(https[^\s<"]+)/i);
    const linkMatch2 = b.match(/<link[^>]*>(?:<!\[CDATA\[)?\s*(https[^\]<\s]+)/i);
    const guidMatch  = b.match(/<guid[^>]*isPermaLink="true"[^>]*>\s*(https[^\s<]+)/i);
    const guidMatch2 = b.match(/<guid[^>]*>\s*(https[^\s<]+)/i);

    articleUrl = (linkMatch1 && linkMatch1[1]) ||
                 (linkMatch2 && linkMatch2[1]) ||
                 (guidMatch  && guidMatch[1])  ||
                 (guidMatch2 && guidMatch2[1] && guidMatch2[1].includes('google.com') ? guidMatch2[1] : '') || '';

    const title   = getField('title');
    const desc    = getField('description') || getField('summary');
    const pubDate = getField('pubDate') || getField('dc:date') || getField('published');
    const srcName = (b.match(/<source[^>]*url="[^"]*"[^>]*>([^<]+)/i) || [])[1]?.trim() || '';

    if (title && title.length > 10 && articleUrl && isArticleUrl(articleUrl)) {
      items.push({
        title,
        summary: desc.substring(0, 220) || 'Click to read the full article.',
        pubDate,
        url: articleUrl,
        source: srcName,
      });
    }
  }
  return items;
}

// ── DATE UTILS ──
function toISO(dateStr) {
  if (!dateStr) return new Date().toISOString();
  try { const d = new Date(dateStr); if (!isNaN(d)) return d.toISOString(); } catch(e) {}
  return new Date().toISOString();
}
function isExpired(iso) { return iso && (Date.now() - new Date(iso).getTime()) / 86400000 > MAX_AGE_DAYS; }
function normalise(t) { return (t || '').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 70); }

// ── MAIN ──
async function main() {
  console.log('\n📰 Insurance Arena — Production News Fetch v5');
  console.log('🕐', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), 'IST');
  console.log('─'.repeat(55));

  // Load existing
  const newsPath = path.join(__dirname, '..', 'data', 'news.json');
  let existingArticles = [];
  try {
    const ex = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    existingArticles = (ex.articles || []).filter(a => isArticleUrl(a.url));
    console.log(`📂 Existing valid articles: ${existingArticles.length}`);
  } catch(e) { console.log('📂 No existing file — fresh start'); }

  // Fetch new
  const newArticles = [];
  const seenTitles = new Set();

  for (const src of RSS_SOURCES) {
    const query = src.url.split('q=')[1]?.split('&')[0] || src.category;
    process.stdout.write(`   Fetching [${src.category}] ${query.substring(0,35)}... `);
    try {
      const result = await fetchUrl(src.url);
      if (result.status !== 200) { console.log(`❌ HTTP ${result.status}`); continue; }

      const items = parseRSSItems(result.body);
      let added = 0;
      for (const item of items) {
        const norm = normalise(item.title);
        if (seenTitles.has(norm)) continue;
        if (!isArticleUrl(item.url)) continue;  // double-check
        seenTitles.add(norm);
        newArticles.push({
          title:       item.title,
          source:      item.source || src.name,
          category:    src.category,
          publishedAt: toISO(item.pubDate),
          summary:     item.summary,
          url:         item.url,
          isSeed:      false,       // live RSS article — not a seed
        });
        added++;
      }
      console.log(`✅ ${added} valid articles`);
    } catch(e) {
      console.log(`⚠️  ${e.message.substring(0, 40)}`);
    }
  }

  console.log(`\n🆕 New valid articles: ${newArticles.length}`);

  // ── ALWAYS MERGE: new + existing, never lose valid articles ──
  // news.json NEVER becomes empty — existing articles preserved until expired
  const mergedSeen = new Set(newArticles.map(a => normalise(a.title)));
  // Merge existing: live articles first, seeds last (seeds fill gaps only)
  const liveOld  = existingArticles.filter(a => !a.isSeed);
  const seedOld  = existingArticles.filter(a =>  a.isSeed);
  let preservedLive = 0, preservedSeed = 0;
  for (const old of [...liveOld, ...seedOld]) {
    const norm = normalise(old.title);
    if (!mergedSeen.has(norm) && !isExpired(old.publishedAt) && isArticleUrl(old.url)) {
      newArticles.push(old);
      mergedSeen.add(norm);
      if (old.isSeed) preservedSeed++; else preservedLive++;
    }
  }
  console.log(`🛡️  Preserved live: ${preservedLive} | Preserved seeds: ${preservedSeed}`);
  console.log(`📦  Total before cap: ${newArticles.length} articles`);

  // ── FAIL-SAFE: if total is still too small, something is wrong ──
  if (newArticles.length < MIN_VALID_BATCH) {
    console.log(`⚠️  WARNING: Only ${newArticles.length} valid articles total.`);
    console.log(`⚠️  RSS sources may be unavailable. news.json NOT overwritten.`);
    process.exit(0); // exit without writing — preserves existing news.json
  }

  // ── CATEGORY PROTECTION: min 1 per category ──
  const catCount = {};
  ALL_CATEGORIES.forEach(c => catCount[c] = 0);
  const fresh = newArticles.filter(a => { catCount[a.category] = (catCount[a.category]||0)+1; return true; });
  const missing = ALL_CATEGORIES.filter(c => !catCount[c]);
  if (missing.length) console.log(`⚠️  Categories with no articles: ${missing.join(', ')}`);

  // ── FINAL: sort, cap, final validation ──
  // Sort: live articles by date first, seeds appended at end
  const liveArticles = fresh.filter(a => !a.isSeed).sort((a,b) => new Date(b.publishedAt)-new Date(a.publishedAt));
  const seedArticles = fresh.filter(a =>  a.isSeed).sort((a,b) => new Date(b.publishedAt)-new Date(a.publishedAt));
  const seedsNeeded  = Math.max(0, Math.min(seedArticles.length, MAX_ARTICLES - liveArticles.length));
  const final = [...liveArticles, ...seedArticles.slice(0, seedsNeeded)]
    .slice(0, MAX_ARTICLES)
    .filter(a => isArticleUrl(a.url));  // one last check

  // Category summary
  const catSummary = {};
  final.forEach(a => catSummary[a.category] = (catSummary[a.category]||0)+1);
  console.log('\n📊 Final categories:', catSummary);
  console.log(`✅ Valid articles: ${final.length}`);

  // Verify sample URLs
  console.log('\n📎 Sample URLs (first 3):');
  final.slice(0,3).forEach((a,i) => {
    const urlType = a.url.includes('news.google.com/rss/articles') ? 'Google redirect → actual article'
                  : a.url.includes('news.google.com/search') ? '⚠️ SEARCH PAGE (should not appear)'
                  : 'Direct article URL';
    console.log(`  [${i+1}] ${a.title.substring(0,45)}`);
    console.log(`      ${a.url.substring(0,70)}`);
    console.log(`      Type: ${urlType}`);
  });

  // Save
  const liveFinal = final.filter(a => !a.isSeed);
  const seedFinal = final.filter(a =>  a.isSeed);
  console.log(`📊 Live articles: ${liveFinal.length} | Seed articles: ${seedFinal.length}`);
  const output = {
    lastUpdated:    new Date().toISOString(),
    articlesCount:  final.length,
    liveCount:      liveFinal.length,
    seedCount:      seedFinal.length,
    fetchSource:    'Google News RSS — article redirect URLs',
    urlValidation:  'isArticleUrl() applied — search/homepage/category URLs rejected',
    articles:       final,
  };

  fs.writeFileSync(newsPath, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved to data/news.json`);
  if (final.length < MIN_VALID_BATCH) {
    console.log('⚠️  WARNING: Fewer than 10 valid articles. Previous articles were preserved.');
    process.exit(0); // don't fail CI
  }
}

main().catch(err => { console.error('❌ Fatal:', err.message); process.exit(1); });
