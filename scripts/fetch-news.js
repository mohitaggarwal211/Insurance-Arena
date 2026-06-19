// ══════════════════════════════════════
// INSURANCE ARENA — NEWS FETCH SCRIPT v3
// Runs at 7 AM + 4 PM IST via GitHub Actions
// Accumulates up to 45 articles
// Merges new + existing, deduplicates, 30-day expiry
// Free sources only — no paywalls
// ══════════════════════════════════════

const fs    = require('fs');
const path  = require('path');
const https = require('https');
const http  = require('http');

// ── SETTINGS ──
const MAX_ARTICLES    = 45;
const MAX_AGE_DAYS    = 30;
const MIN_PER_CATEGORY = 1; // keep at least 1 per category even if old

// ── FREE RSS SOURCES (no paywalls) ──
const RSS_SOURCES = [
  { name:'IRDAI Official',    category:'irdai',          url:'https://irdai.gov.in/web/guest/home/-/asset_publisher/oDLNs7nMKBgf/rss' },
  { name:'PIB India',         category:'insurance',      url:'https://pib.gov.in/RSSFeedDynamic.aspx?ModId=6' },
  { name:'Moneycontrol',      category:'insurance',      url:'https://www.moneycontrol.com/rss/insurance.xml' },
  { name:'NDTV Profit',       category:'markets',        url:'https://feeds.feedburner.com/ndtvprofit-latest' },
  { name:'GoodReturns',       category:'insurance',      url:'https://www.goodreturns.in/rss/goodreturns-latest-news.xml' },
  { name:'TaxGuru',           category:'tax',            url:'https://taxguru.in/feed' },
  { name:'ET Money Blog',     category:'personalfinance',url:'https://etmoney.com/learn/feed' },
  { name:'BankBazaar Blog',   category:'personalfinance',url:'https://blog.bankbazaar.com/feed' },
  { name:'Jagoinvestor',      category:'personalfinance',url:'https://jagoinvestor.com/feed' },
  { name:'Moneycontrol MF',   category:'mutualfunds',    url:'https://www.moneycontrol.com/rss/mutual_funds.xml' },
];

const ALL_CATEGORIES = ['insurance','irdai','mutualfunds','tax','banking','personalfinance','markets'];

// ── HELPERS ──
function fetchUrl(url, timeout=12000){
  return new Promise((resolve,reject)=>{
    const client=url.startsWith('https')?https:http;
    const req=client.get(url,{timeout,headers:{'User-Agent':'Insurance-Arena-NewsBot/3.0'}},res=>{
      const chunks=[];
      res.on('data',c=>chunks.push(c));
      res.on('end',()=>resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error',reject);
    req.on('timeout',()=>{req.destroy();reject(new Error('Timeout'));});
  });
}

function parseRSS(xml){
  const items=[];
  const re=/<item>([\s\S]*?)<\/item>/gi;
  let m;
  while((m=re.exec(xml))!==null && items.length<6){
    const b=m[1];
    const get=tag=>{
      const r=b.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`),'i')
              ||b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`),'i');
      if(!r) return '';
      return r[1].trim()
        .replace(/<[^>]+>/g,'')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
        .replace(/\s+/g,' ').trim();
    };
    const title=get('title'), desc=get('description');
    const pubDate=get('pubDate')||get('dc:date'), link=get('link');
    if(title && title.length>10)
      items.push({title,summary:desc.substring(0,230),date:pubDate,link});
  }
  return items;
}

function detectCategory(text,def){
  const t=text.toLowerCase();
  if(t.includes('irdai')||t.includes('circular')||t.includes('regulation')||t.includes('regulator')) return 'irdai';
  if(t.includes('mutual fund')||t.includes('sip')||t.includes('nfo')||t.includes('nav')||t.includes('elss')) return 'mutualfunds';
  if(t.includes('income tax')||t.includes('gst')||t.includes('tds')||t.includes('itr')||t.includes('section 80')||t.includes('budget')) return 'tax';
  if(t.includes('rbi')||t.includes('repo rate')||t.includes('bank ')||t.includes('interest rate')||t.includes('credit')) return 'banking';
  if(t.includes('insurance')||t.includes('premium')||t.includes('claim')||t.includes('insurer')||t.includes('term plan')||t.includes('health insurance')) return 'insurance';
  if(t.includes('sensex')||t.includes('nifty')||t.includes('stock ')||t.includes('market')||t.includes(' ipo')) return 'markets';
  if(t.includes('personal finance')||t.includes('financial planning')||t.includes('investment')||t.includes('savings')||t.includes('nps')||t.includes('ppf')||t.includes('retirement')) return 'personalfinance';
  return def;
}

function isFinanceRelevant(title,summary){
  const t=(title+' '+summary).toLowerCase();
  return t.includes('insurance')||t.includes('irdai')||t.includes('premium')||t.includes('claim')
      ||t.includes('mutual fund')||t.includes('sip')||t.includes('market')||t.includes('sensex')
      ||t.includes('income tax')||t.includes('gst')||t.includes('budget')||t.includes('rbi')
      ||t.includes('bank')||t.includes('investment')||t.includes('finance')||t.includes('savings')
      ||t.includes('nps')||t.includes('ppf')||t.includes('stock')||t.includes('ipo')
      ||t.includes('term plan')||t.includes('health insurance')||t.includes('policy');
}

function validateUrl(url){
  if(!url||typeof url!=='string') return false;
  const u=url.trim();
  if(!u.startsWith('http://') && !u.startsWith('https://')) return false;
  try{ new URL(u); return true; }catch(e){ return false; }
}

function normaliseTitle(t){
  return (t||'').toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,60);
}

function parseDateToISO(dateStr){
  if(!dateStr) return new Date().toISOString();
  try{
    const d=new Date(dateStr);
    if(!isNaN(d.getTime())) return d.toISOString();
  }catch(e){}
  return new Date().toISOString();
}

function isExpired(isoDate, maxDays){
  if(!isoDate) return false;
  const age=(Date.now()-new Date(isoDate).getTime())/(1000*60*60*24);
  return age>maxDays;
}

// ── MAIN ──
async function main(){
  console.log('\n📰 Insurance Arena — News Fetch v3');
  const runTime=new Date().toISOString();
  const isAM=new Date().getUTCHours()<12;
  console.log(`⏰ ${runTime} (${isAM?'7 AM':'4 PM'} IST run)`);

  // ── STEP 1: Load existing articles ──
  const newsPath=path.join(__dirname,'..','data','news.json');
  let existingArticles=[];
  try{
    const existing=JSON.parse(fs.readFileSync(newsPath,'utf8'));
    existingArticles=existing.articles||[];
    console.log(`📂 Loaded ${existingArticles.length} existing articles`);
  }catch(e){
    console.log('📂 No existing news.json — starting fresh');
  }

  // ── STEP 2: Fetch new articles from RSS ──
  const newArticles=[];
  const seenTitles=new Set();

  for(const source of RSS_SOURCES){
    try{
      console.log(`   Fetching: ${source.name}…`);
      const xml=await fetchUrl(source.url);
      const items=parseRSS(xml);
      let added=0;
      for(const item of items){
        if(!item.title||!isFinanceRelevant(item.title,item.summary)) continue;
        if(!validateUrl(item.link)) continue;
        const norm=normaliseTitle(item.title);
        if(seenTitles.has(norm)) continue;
        seenTitles.add(norm);
        newArticles.push({
          title:    item.title,
          source:   source.name,
          category: detectCategory(item.title+' '+item.summary, source.category),
          publishedAt: parseDateToISO(item.date),
          summary:  item.summary.substring(0,230),
          url:      item.link.trim(),
        });
        added++;
      }
      console.log(`   ✅ ${source.name}: ${added} new articles`);
    }catch(err){
      console.log(`   ⚠️  ${source.name}: ${err.message}`);
    }
  }
  console.log(`\n🆕 New articles fetched: ${newArticles.length}`);

  // ── STEP 3: Merge — new first, then existing not already seen ──
  // Add existing titles to seen set first (from new articles)
  newArticles.forEach(a=>seenTitles.add(normaliseTitle(a.title)));

  const merged=[...newArticles];
  for(const old of existingArticles){
    const norm=normaliseTitle(old.title);
    if(!seenTitles.has(norm)){
      seenTitles.add(norm);
      // Ensure old articles have publishedAt field
      if(!old.publishedAt) old.publishedAt=new Date().toISOString();
      merged.push(old);
    }
  }
  console.log(`🔀 Merged total: ${merged.length} articles`);

  // ── STEP 4: Remove expired (>30 days) but protect category minimums ──
  // Count per category before expiry
  const catCount={};
  ALL_CATEGORIES.forEach(c=>catCount[c]=0);

  const afterExpiry=merged.filter(a=>{
    const expired=isExpired(a.publishedAt, MAX_AGE_DAYS);
    if(!expired){ catCount[a.category]=(catCount[a.category]||0)+1; return true; }
    return false; // expired, will check if category needs protection
  });

  // Re-add expired articles if their category has 0 articles (category protection)
  const expired=merged.filter(a=>isExpired(a.publishedAt, MAX_AGE_DAYS));
  const protectedOld=[];
  for(const cat of ALL_CATEGORIES){
    if((catCount[cat]||0)===0){
      // Find most recent expired article for this category
      const best=expired
        .filter(a=>a.category===cat)
        .sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt))[0];
      if(best){
        protectedOld.push(best);
        catCount[cat]=1;
        console.log(`   🛡️  Category '${cat}' protected with 1 older article`);
      }
    }
  }

  const afterFilter=[...afterExpiry,...protectedOld];
  console.log(`📅 After 30-day expiry filter: ${afterFilter.length} articles`);

  // ── STEP 5: Sort newest first, cap at 45 ──
  afterFilter.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  const final=afterFilter.slice(0,MAX_ARTICLES);
  console.log(`✂️  After cap (max ${MAX_ARTICLES}): ${final.length} articles`);

  // ── STEP 6: Category summary ──
  const catSummary={};
  final.forEach(a=>{ catSummary[a.category]=(catSummary[a.category]||0)+1; });
  console.log('\n📊 Articles by category:');
  ALL_CATEGORIES.forEach(c=>console.log(`   ${c}: ${catSummary[c]||0}`));

  // ── STEP 7: Validate all URLs in final set ──
  const validated=final.filter(a=>validateUrl(a.url));
  if(validated.length<final.length)
    console.log(`⚠️  Removed ${final.length-validated.length} articles with invalid URLs`);

  // ── STEP 8: Save ──
  const output={
    lastUpdated: runTime,
    nextUpdate: isAM ? 'Today 4 PM IST' : 'Tomorrow 7 AM IST',
    totalArticles: validated.length,
    sources: RSS_SOURCES.map(s=>s.name),
    removedSources: ['Business Standard','Economic Times','Livemint','Financial Express','Hindu Business Line'],
    articles: validated,
  };

  fs.writeFileSync(newsPath, JSON.stringify(output,null,2));
  console.log(`\n✅ Saved ${validated.length} articles to data/news.json`);
}

main().catch(err=>{ console.error('❌ Fatal:',err.message); process.exit(1); });
