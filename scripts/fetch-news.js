// ══════════════════════════════════════
// INSURANCE ARENA — NEWS FETCH SCRIPT
// Runs daily at 7 AM IST via GitHub Actions
// Fetches from 9 RSS sources → saves news.json
// ══════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

// ── RSS SOURCES ──
const RSS_SOURCES = [
  { name:"Livemint",           category:"product", url:"https://www.livemint.com/rss/insurance" },
  { name:"Economic Times",     category:"market",  url:"https://economictimes.indiatimes.com/articlelistfeed/13358578.cms" },
  { name:"Business Standard",  category:"irdai",   url:"https://www.business-standard.com/rss/finance/insurance-news-104.rss" },
  { name:"Moneycontrol",       category:"market",  url:"https://www.moneycontrol.com/rss/insurance.xml" },
  { name:"Hindu Business Line",category:"product", url:"https://www.thehindubusinessline.com/feeder/default.rss" },
  { name:"Financial Express",  category:"irdai",   url:"https://www.financialexpress.com/feed/" },
  { name:"NDTV Profit",        category:"market",  url:"https://profit.ndtv.com/feed" },
  { name:"IRDAI Official",     category:"irdai",   url:"https://irdai.gov.in/web/guest/home/-/asset_publisher/oDLNs7nMKBgf/rss" },
  { name:"PIB India",          category:"irdai",   url:"https://pib.gov.in/RSSFeedDynamic.aspx?ModId=6" },
];

// ── CATEGORY DETECTION ──
function detectCategory(text, defaultCat) {
  const t = text.toLowerCase();
  if (t.includes('irdai') || t.includes('circular') || t.includes('regulation') || t.includes('regulator')) return 'irdai';
  if (t.includes('claim') || t.includes('settlement') || t.includes('rejection')) return 'claims';
  if (t.includes('premium') || t.includes('term plan') || t.includes('ulip') || t.includes('product') || t.includes('policy launch')) return 'product';
  if (t.includes('market') || t.includes('growth') || t.includes('premium collection') || t.includes('sector')) return 'market';
  return defaultCat;
}

// ── RELATIVE TIME ──
function relativeTime(dateStr) {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Recent';
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 6) return 'Today';
  if (hours < 30) return 'Today';
  const days = Math.floor(hours / 24);
  if (days <= 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 21) return '2 weeks ago';
  return `${Math.floor(days/7)} weeks ago`;
}

// ── FETCH URL ──
function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── PARSE RSS ──
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
               || block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? m[1].trim().replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'") : '';
    };
    const title   = get('title');
    const desc    = get('description');
    const pubDate = get('pubDate') || get('dc:date');
    const link    = get('link');
    if (title && title.length > 10) {
      items.push({ title, summary: desc.substring(0, 200), date: pubDate, link });
    }
    if (items.length >= 5) break; // Max 5 per source
  }
  return items;
}

// ── INSURANCE FILTER ──
function isInsuranceRelevant(title, summary) {
  const t = (title + ' ' + summary).toLowerCase();
  return t.includes('insurance') || t.includes('irdai') || t.includes('premium')
      || t.includes('claim') || t.includes('insurer') || t.includes('policyholder')
      || t.includes('life insurance') || t.includes('health insurance')
      || t.includes('term plan') || t.includes('ulip') || t.includes('annuity');
}

// ── MAIN ──
async function main() {
  console.log(`\n📰 Insurance Arena — News Fetch`);
  console.log(`⏰ Running at: ${new Date().toISOString()}`);
  const articles = [];
  const seen = new Set(); // Dedup by title

  for (const source of RSS_SOURCES) {
    try {
      console.log(`   Fetching: ${source.name}…`);
      const xml = await fetchUrl(source.url);
      const items = parseRSS(xml);
      for (const item of items) {
        if (seen.has(item.title)) continue;
        if (!isInsuranceRelevant(item.title, item.summary)) continue;
        seen.add(item.title);
        articles.push({
          title:    item.title,
          source:   source.name,
          category: detectCategory(item.title + ' ' + item.summary, source.category),
          date:     relativeTime(item.date),
          summary:  item.summary.replace(/\s+/g,' ').trim().substring(0,250),
          url:      item.link || '',
        });
      }
      console.log(`   ✅ ${source.name}: ${items.length} items fetched`);
    } catch (err) {
      console.log(`   ⚠️  ${source.name}: ${err.message} — skipped`);
    }
  }

  if (articles.length === 0) {
    console.log('\n❌ No articles fetched — keeping existing news.json');
    process.exit(0);
  }

  // Sort: most recent first (limited date info, keep source order as proxy)
  const output = {
    lastUpdated: new Date().toISOString(),
    source: 'Auto-generated by GitHub Actions at 7 AM IST daily',
    totalArticles: articles.length,
    articles,
  };

  const outPath = path.join(__dirname, '..', 'data', 'news.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved ${articles.length} articles to data/news.json`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
