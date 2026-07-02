#!/usr/bin/env node
/**
 * Insurance Arena — News Fetcher (v3)
 * Publisher-direct RSS only. Free-to-read sources only. Direct article URLs only.
 * Zero dependencies. Runs in GitHub Actions every 6 hours.
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

// ── SOURCES — publisher-direct feeds, verified free-to-read ──
// Each source: multiple fallback URLs (first working one wins)
const SOURCES = [
  {
    name: 'NDTV Profit', category: 'markets',
    urls: ['https://feeds.feedburner.com/ndtvprofit-latest',
           'https://www.ndtvprofit.com/feed'],
    domain: 'ndtvprofit.com'
  },
  {
    name: 'Business Today', category: 'markets',
    urls: ['https://www.businesstoday.in/rssfeeds/?id=225346',
           'https://www.businesstoday.in/rss/markets'],
    domain: 'businesstoday.in'
  },
  {
    name: 'Zee Business', category: 'markets',
    urls: ['https://www.zeebiz.com/rss/india-markets.xml',
           'https://www.zeebiz.com/rss/markets.xml',
           'https://zeenews.india.com/rss/business.xml'],
    domain: 'zeebiz.com|zeenews.india.com'
  },
  {
    name: 'CNBC TV18', category: 'markets',
    urls: ['https://www.cnbctv18.com/commonfeeds/v1/cne/rss/market.xml',
           'https://www.cnbctv18.com/commonfeeds/v1/cne/rss/business.xml'],
    domain: 'cnbctv18.com'
  },
  {
    name: 'Financial Express', category: 'insurance',
    urls: ['https://www.financialexpress.com/money/insurance/feed/',
           'https://www.financialexpress.com/money/feed/'],
    domain: 'financialexpress.com'
  },
  {
    name: 'Moneycontrol', category: 'markets',
    urls: ['https://www.moneycontrol.com/rss/marketreports.xml',
           'https://www.moneycontrol.com/rss/latestnews.xml'],
    domain: 'moneycontrol.com'
  },
  {
    name: 'Times of India Business', category: 'markets',
    urls: ['https://timesofindia.indiatimes.com/rssfeeds/1898055.cms'],
    domain: 'timesofindia.indiatimes.com'
  },
  {
    name: 'News18 Business', category: 'markets',
    urls: ['https://www.news18.com/commonfeeds/v1/eng/rss/business.xml',
           'https://www.news18.com/rss/business.xml'],
    domain: 'news18.com'
  },
  {
    name: 'PIB Finance Ministry', category: 'regulatory',
    urls: ['https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3'],
    domain: 'pib.gov.in'
  },
];

// ── PAYWALL BLOCKLIST — never allow these domains through ──
const BLOCKED_DOMAINS = [
  'livemint.com', 'business-standard.com', 'economictimes.indiatimes.com/prime',
  'thehindubusinessline.com', 'bloomberg.com', 'ft.com', 'wsj.com',
  'bloombergquint.com', 'moneycontrol.com/pro'
];

// Insurance keywords — reclassify any article as 'insurance' if matched
const INSURANCE_KEYWORDS = /insur|irdai|lic\b|premium|policyhold|term plan|ulip|annuity|actuar|life cover|health cover|claim settle/i;
const REGULATORY_KEYWORDS = /irdai|rbi\b|sebi\b|ministry of finance|regulator|gazette|circular|notification|budget/i;

function fetchUrl(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsuranceArenaBot/1.0; +https://insurancearena.in)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      timeout: 12000
    }, res => {
      if (res.statusCode >= 301 && res.statusCode <= 308 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        res.resume();
        return resolve(fetchUrl(next, redirects + 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

function stripTags(s) {
  return (s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;[^&]*&gt;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(n))
    .replace(/\s+/g, ' ').trim();
}

function extractItems(xml) {
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRegex.exec(xml)) !== null && items.length < 30) {
    const block = m[1];
    const get = tag => {
      const r = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
      const mm = block.match(r);
      return mm ? mm[1].trim() : '';
    };
    const title = stripTags(get('title'));
    let link = stripTags(get('link'));
    // Some feeds put URL in guid
    if (!link || !link.startsWith('http')) {
      const guid = stripTags(get('guid'));
      if (guid.startsWith('http')) link = guid;
    }
    const desc = stripTags(get('description')) || stripTags(get('summary'));
    const pubDate = get('pubDate') || get('dc:date') || '';
    if (title && link && link.startsWith('http')) {
      items.push({ title, link, desc, pubDate });
    }
  }
  return items;
}

function isBlocked(url) {
  return BLOCKED_DOMAINS.some(d => url.includes(d));
}

function makeSummary(desc, title) {
  if (!desc || desc.length < 30 || desc === title) return '';
  // Truncate at sentence boundary near 260 chars
  if (desc.length <= 280) return desc;
  const cut = desc.slice(0, 280);
  const lastPeriod = cut.lastIndexOf('. ');
  return (lastPeriod > 120 ? cut.slice(0, lastPeriod + 1) : cut.slice(0, 260) + '…');
}

function categorize(source, title, desc) {
  const text = title + ' ' + desc;
  if (REGULATORY_KEYWORDS.test(text)) return 'regulatory';
  if (INSURANCE_KEYWORDS.test(text)) return 'insurance';
  return source.category;
}

async function main() {
  const allArticles = [];
  const sourceStatus = [];

  for (const source of SOURCES) {
    let fetched = false;
    for (const url of source.urls) {
      try {
        const xml = await fetchUrl(url);
        const items = extractItems(xml);
        if (items.length === 0) throw new Error('No items parsed');
        let added = 0;
        for (const item of items) {
          if (isBlocked(item.link)) continue;
          const summary = makeSummary(item.desc, item.title);
          const ts = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
          if (isNaN(ts)) continue;
          // Only last 48 hours of news
          if (Date.now() - ts > 48 * 3600 * 1000) continue;
          allArticles.push({
            title: item.title.slice(0, 200),
            summary,
            url: item.link,
            source: source.name,
            category: categorize(source, item.title, item.desc),
            publishedAt: new Date(ts).toISOString(),
            ts
          });
          added++;
        }
        sourceStatus.push({ source: source.name, status: 'ok', articles: added, feedUsed: url });
        fetched = true;
        break; // first working URL wins
      } catch (e) {
        // try next fallback URL
      }
    }
    if (!fetched) sourceStatus.push({ source: source.name, status: 'failed', articles: 0 });
  }

  // Dedupe by normalized title
  const seen = new Set();
  const deduped = allArticles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort newest first, cap 60
  deduped.sort((a, b) => b.ts - a.ts);
  const final = deduped.slice(0, 60).map(({ ts, ...rest }) => rest);

  const okSources = sourceStatus.filter(s => s.status === 'ok').length;

  // SAFETY: never wipe existing news with an empty/thin result
  const outPath = path.join(__dirname, '..', 'data', 'news.json');
  if (final.length < 5) {
    console.error('❌ Only ' + final.length + ' articles fetched from ' + okSources + ' sources. Keeping previous news.json.');
    console.error(JSON.stringify(sourceStatus, null, 2));
    process.exit(1); // non-zero = workflow skips commit
  }

  const output = {
    lastUpdated: new Date().toISOString(),
    articlesCount: final.length,
    sourcesOk: okSources,
    sourcesTotal: SOURCES.length,
    sourceStatus,
    articles: final
  };

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log('✅ ' + final.length + ' articles from ' + okSources + '/' + SOURCES.length + ' sources');
  console.log(JSON.stringify(sourceStatus, null, 2));
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
