// ══════════════════════════════════════
// INSURANCE ARENA — NEWS FETCH SCRIPT v2
// Daily 7 AM IST · Free sources only · No paywall
// Covers: Insurance, IRDAI, Mutual Funds, Tax,
//         Banking, Personal Finance, Markets
// ══════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');

// ── FREE RSS SOURCES ONLY (verified no paywall) ──
const RSS_SOURCES = [
  { name:"IRDAI Official",     category:"irdai",           url:"https://irdai.gov.in/web/guest/home/-/asset_publisher/oDLNs7nMKBgf/rss" },
  { name:"PIB India",          category:"insurance",       url:"https://pib.gov.in/RSSFeedDynamic.aspx?ModId=6" },
  { name:"Moneycontrol",       category:"insurance",       url:"https://www.moneycontrol.com/rss/insurance.xml" },
  { name:"NDTV Profit",        category:"markets",         url:"https://feeds.feedburner.com/ndtvprofit-latest" },
  { name:"GoodReturns",        category:"insurance",       url:"https://www.goodreturns.in/rss/goodreturns-latest-news.xml" },
  { name:"TaxGuru",            category:"tax",             url:"https://taxguru.in/feed" },
  { name:"ET Money Blog",      category:"personalfinance", url:"https://etmoney.com/learn/feed" },
  { name:"BankBazaar Blog",    category:"personalfinance", url:"https://blog.bankbazaar.com/feed" },
  { name:"Jagoinvestor",       category:"personalfinance", url:"https://jagoinvestor.com/feed" },
  { name:"Moneycontrol MF",    category:"mutualfunds",     url:"https://www.moneycontrol.com/rss/mutual_funds.xml" },
];

// ── CATEGORY DETECTION ──
function detectCategory(text, defaultCat){
  const t = text.toLowerCase();
  if (t.includes('irdai') || t.includes('circular') || t.includes('regulation') || t.includes('regulator')) return 'irdai';
  if (t.includes('mutual fund') || t.includes('sip') || t.includes('nfo') || t.includes('elss') || t.includes('nav')) return 'mutualfunds';
  if (t.includes('income tax') || t.includes('gst') || t.includes('tds') || t.includes('itr') || t.includes('section 80') || t.includes('budget')) return 'tax';
  if (t.includes('rbi') || t.includes('repo rate') || t.includes('bank') || t.includes('interest rate') || t.includes('credit')) return 'banking';
  if (t.includes('insurance') || t.includes('premium') || t.includes('claim') || t.includes('insurer') || t.includes('policyholder') || t.includes('term plan') || t.includes('health insurance')) return 'insurance';
  if (t.includes('sensex') || t.includes('nifty') || t.includes('stock') || t.includes('market') || t.includes('share price') || t.includes('ipo')) return 'markets';
  if (t.includes('personal finance') || t.includes('financial planning') || t.includes('investment') || t.includes('savings') || t.includes('retirement') || t.includes('nps') || t.includes('ppf')) return 'personalfinance';
  return defaultCat;
}

function relativeTime(dateStr){
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Recent';
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 30) return 'Today';
  const days = Math.floor(hours / 24);
  if (days <= 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  return `${Math.floor(days/7)} weeks ago`;
}

function fetchUrl(url, timeout = 12000){
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout, headers: { 'User-Agent': 'Insurance-Arena-NewsBot/2.0' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseRSS(xml){
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < 5){
    const block = match[1];
    const get = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
               || block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      if (!m) return '';
      return m[1].trim()
        .replace(/<[^>]+>/g,'')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
        .replace(/\s+/g,' ').trim();
    };
    const title = get('title');
    const desc  = get('description');
    const date  = get('pubDate') || get('dc:date');
    const link  = get('link');
    if (title && title.length > 10)
      items.push({ title, summary: desc.substring(0, 220), date, link });
  }
  return items;
}

function isFinanceRelevant(title, summary){
  const t = (title + ' ' + summary).toLowerCase();
  return t.includes('insurance') || t.includes('irdai') || t.includes('premium') || t.includes('claim')
      || t.includes('mutual fund') || t.includes('sip') || t.includes('market') || t.includes('sensex')
      || t.includes('income tax') || t.includes('gst') || t.includes('budget') || t.includes('rbi')
      || t.includes('bank') || t.includes('investment') || t.includes('finance') || t.includes('savings')
      || t.includes('nps') || t.includes('ppf') || t.includes('stock') || t.includes('ipo')
      || t.includes('term plan') || t.includes('health insurance') || t.includes('policy');
}

async function main(){
  console.log('\n📰 Insurance Arena — Finance News Fetch v2');
  console.log(`⏰ ${new Date().toISOString()}`);
  const articles = [];
  const seen = new Set();

  for (const source of RSS_SOURCES){
    try {
      console.log(`   Fetching: ${source.name}…`);
      const xml = await fetchUrl(source.url);
      const items = parseRSS(xml);
      let added = 0;
      for (const item of items){
        if (seen.has(item.title)) continue;
        if (!isFinanceRelevant(item.title, item.summary)) continue;
        seen.add(item.title);
        articles.push({
          title:    item.title,
          source:   source.name,
          category: detectCategory(item.title + ' ' + item.summary, source.category),
          date:     relativeTime(item.date),
          summary:  item.summary.substring(0, 250),
          url:      item.link || '',
        });
        added++;
      }
      console.log(`   ✅ ${source.name}: ${added} relevant articles`);
    } catch(err){
      console.log(`   ⚠️  ${source.name}: ${err.message} — skipped`);
    }
  }

  if (articles.length === 0){
    console.log('\n❌ No articles fetched — keeping existing news.json');
    process.exit(0);
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    source: 'Auto-generated by GitHub Actions at 7 AM IST daily — free sources only',
    totalArticles: articles.length,
    articles,
  };

  const outPath = path.join(__dirname, '..', 'data', 'news.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n✅ Saved ${articles.length} articles to data/news.json`);
}

main().catch(err => { console.error('❌ Fatal:', err.message); process.exit(1); });
