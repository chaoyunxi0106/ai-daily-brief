/**
 * ========================================
 *   🌍 世界新闻抓取器 (RSS方式，无需API Key)
 *   从多个免费RSS源聚合新闻
 * ========================================
 */
import https from 'https';

/**
 * 新闻RSS源列表 (全部免费，无需API Key)
 */
const RSS_SOURCES = [
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    lang: 'en',
  },
  {
    name: 'Reuters',
    url: 'https://www.reutersagency.com/feed/',
    lang: 'en',
  },
  {
    name: 'NPR News',
    url: 'https://feeds.npr.org/1001/rss.xml',
    lang: 'en',
  },
];

/**
 * 获取世界新闻
 * @param {Object} options
 * @returns {Promise<Array>} 新闻列表
 */
export async function fetchWorldNews(options = {}) {
  console.log('[WorldNews] 正在获取世界新闻...');

  const results = [];
  
  for (const source of RSS_SOURCES) {
    try {
      const xml = await httpsGet(source.url);
      const items = parseRSS(xml, source);
      results.push(...items);
      console.log(`  ✅ ${source.name}: 获取 ${items.length} 条`);
    } catch (e) {
      console.log(`  ⚠️ ${source.name}: 获取失败 - ${e.message}`);
    }
    // 间隔避免被限流
    await sleep(1000);
  }

  // 按时间排序，取前20条
  results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const top = results.slice(0, 20);
  
  console.log(`[WorldNews] 共获取 ${top.length} 条新闻`);
  return top;
}

/**
 * 简单的RSS XML解析器
 */
function parseRSS(xml, source) {
  const items = [];
  
  // 提取 <item> 标签
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const matches = xml.match(itemRegex) || [];
  
  for (const item of matches) {
    try {
      const getTag = (tag) => {
        const match = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)) ||
                      item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return match ? match[1].trim() : '';
      };
      
      items.push({
        title: getTag('title') || '(无标题)',
        description: getTag('description').replace(/<[^>]+>/g, '').substring(0, 200),
        url: getTag('link'),
        pubDate: getTag('pubDate') || getTag('dc:date') || new Date().toISOString(),
        source: source.name,
      });
    } catch (e) {
      // 跳过解析失败的条目
    }
  }
  
  return items;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('请求超时'));
    });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export default fetchWorldNews;
