// INSURANCE ARENA — NEWS FETCH v4
// Source: Google News RSS (free, legal, real article links)
// Runs: 7 AM + 4 PM IST daily via GitHub Actions
// Accumulates up to 45 articles, 30-day expiry

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const MAX_ARTICLES    = 45;
const MAX_AGE_DAYS    = 30;
const ALL_CATEGORIES  = ['insurance','irdai','mutualfunds','tax','banking','personalfinance','markets'];

// ── GOOGLE NEWS RSS SOURCES ──
// Google News RSS: free, legal, real article links, no paywall
const RSS_SOURCES = [
  { name:'Google News', category:'insurance',      url:'https://news.google.com/rss/search?q=life+insurance+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'insurance',      url:'https://news.google.com/rss/search?q=term+insurance+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'irdai',          url:'https://news.google.com/rss/search?q=IRDAI+insurance+regulation&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'mutualfunds',    url:'https://news.google.com/rss/search?q=mutual+fund+SIP+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'tax',            url:'https://news.google.com/rss/search?q=income+tax+india+section+80C&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'banking',        url:'https://news.google.com/rss/search?q=RBI+banking+india+interest+rate&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'personalfinance',url:'https://news.google.com/rss/search?q=personal+finance+investment+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'markets',        url:'https://news.google.com/rss/search?q=sensex+nifty+stock+market+india&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'insurance',      url:'https://news.google.com/rss/search?q=health+insurance+india+claim&hl=en-IN&gl=IN&ceid=IN:en' },
  { name:'Google News', category:'irdai',          url:'https://news.google.com/rss/search?q=IRDAI+circular+guidelines+2024+2025&hl=en-IN&gl=IN&ceid=IN:en' },
];

function fetchUrl(url, timeout=15000){
  return new Promise((resolve,reject)=>{
    const req=https.get(url,{
      timeout,
      headers:{
        'User-Agent':'Mozilla/5.0 (compatible; InsuranceArenaBot/4.0)',
        'Accept':'application/rss+xml, application/xml, text/xml, */*'
      }
    },res=>{
      // Handle redirects
      if(res.statusCode===301||res.statusCode===302){
        const loc=res.headers.location;
        if(loc) return fetchUrl(loc,timeout).then(resolve).catch(reject);
      }
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
        .replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
        .replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
    };
    const title=get('title');
    const desc=get('description');
    const pubDate=get('pubDate')||get('dc:date');
    const link=get('link');
    // Google News RSS puts link after closing tag — try alternate extraction
    const linkMatch=b.match(/<link[^>]*>([^<]+)/i);
    const articleUrl=link||(linkMatch?linkMatch[1].trim():'');
    if(title&&title.length>10&&articleUrl&&articleUrl.startsWith('http'))
      items.push({title,summary:desc.substring(0,220),date:pubDate,link:articleUrl});
  }
  return items;
}

function validateUrl(url){
  if(!url||typeof url!=='string') return false;
  const u=url.trim();
  if(!u.startsWith('http://') && !u.startsWith('https://')) return false;
  try{ new URL(u); return true; }catch(e){ return false; }
}

function parseDateToISO(dateStr){
  if(!dateStr) return new Date().toISOString();
  try{ const d=new Date(dateStr); if(!isNaN(d.getTime())) return d.toISOString(); }catch(e){}
  return new Date().toISOString();
}

function isExpired(iso,maxDays){ return iso&&((Date.now()-new Date(iso).getTime())/(86400000))>maxDays; }
function normaliseTitle(t){ return (t||'').toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,60); }

async function main(){
  console.log('\n📰 Insurance Arena — Google News RSS Fetch v4');
  console.log('⏰',new Date().toISOString());

  // Load existing
  const newsPath=path.join(__dirname,'..','data','news.json');
  let existingArticles=[];
  try{
    const ex=JSON.parse(fs.readFileSync(newsPath,'utf8'));
    existingArticles=ex.articles||[];
    console.log(`📂 Existing: ${existingArticles.length} articles`);
  }catch(e){ console.log('📂 No existing file'); }

  // Fetch new
  const newArticles=[];
  const seen=new Set();

  for(const source of RSS_SOURCES){
    try{
      console.log(`   Fetching: ${source.url.split('q=')[1]?.split('&')[0]||source.category}...`);
      const xml=await fetchUrl(source.url);
      const items=parseRSS(xml);
      let added=0;
      for(const item of items){
        if(!item.title||!validateUrl(item.link)) continue;
        const norm=normaliseTitle(item.title);
        if(seen.has(norm)) continue;
        seen.add(norm);
        newArticles.push({
          title:item.title,
          source:'Google News',
          category:source.category,
          publishedAt:parseDateToISO(item.date),
          summary:item.summary.substring(0,230)||'Click to read the full article on the original source.',
          url:item.link,
        });
        added++;
      }
      console.log(`   ✅ ${added} articles`);
    }catch(err){
      console.log(`   ⚠️  ${source.category}: ${err.message}`);
    }
  }
  console.log(`\n🆕 New: ${newArticles.length} articles`);

  // Merge
  newArticles.forEach(a=>seen.add(normaliseTitle(a.title)));
  const merged=[...newArticles];
  for(const old of existingArticles){
    const norm=normaliseTitle(old.title);
    if(!seen.has(norm)){ seen.add(norm); if(!old.publishedAt) old.publishedAt=new Date().toISOString(); merged.push(old); }
  }

  // Expiry + category protection
  const catCount={};
  ALL_CATEGORIES.forEach(c=>catCount[c]=0);
  const fresh=merged.filter(a=>{const exp=isExpired(a.publishedAt,MAX_AGE_DAYS);if(!exp){catCount[a.category]=(catCount[a.category]||0)+1;}return!exp;});
  const expired=merged.filter(a=>isExpired(a.publishedAt,MAX_AGE_DAYS));
  const protected_=[];
  for(const cat of ALL_CATEGORIES){
    if(!catCount[cat]){
      const best=expired.filter(a=>a.category===cat).sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt))[0];
      if(best){ protected_.push(best); console.log(`🛡️  Protected: ${cat}`); }
    }
  }

  // Sort + cap + validate URLs
  const final=[...fresh,...protected_]
    .sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt))
    .slice(0,MAX_ARTICLES)
    .filter(a=>validateUrl(a.url));

  // Category summary
  const cats={};
  final.forEach(a=>{cats[a.category]=(cats[a.category]||0)+1;});
  console.log('\n📊 Categories:',cats);

  const output={
    lastUpdated:new Date().toISOString(),
    source:'Google News RSS — free, legal, real article links',
    totalArticles:final.length,
    articles:final,
  };

  fs.writeFileSync(newsPath,JSON.stringify(output,null,2));
  console.log(`\n✅ Saved ${final.length} articles to data/news.json`);
}

main().catch(err=>{console.error('❌',err.message);process.exit(1);});
