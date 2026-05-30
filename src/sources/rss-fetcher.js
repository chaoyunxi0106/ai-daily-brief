/**
 * ========================================
 *   📡 通用RSS订阅抓取器
 *   支持自定义RSS源列表
 * ========================================
 */
import https from 'https';

/**
 * 抓取自定义RSS源
 * @param {Array} feeds - [{ name: string, url: string }]
 * @returns {Promise<Array>} 文章列表
 */
export async function fetchRSSFeeds(feeds = []) {
  if (!feeds.length) {
    console.log('[RSS] 未配置RSS源，跳过');
    return [];
  }
  
  console.log(`[RSS] 正在抓取 ${feeds.length} 个RSS源...`);
  const results = [];

  for (const feed of feeds) {
    try {
      const xml = await httpsGet(feed.url);
      const items = parseRSS(xml);
      items.forEach(item => item.feedName = feed.name);
      results.push(...items);
      console.log(`  ✅ ${feed.name}: 获取 ${items.length} 条`);
    } catch (e) {
      console.log(`  ⚠️ ${feed.name}: 获取失败 - ${e.message}`);
    }
    await sleep(800);
  }

  return results.slice(0, 15);
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>[\\s\\S]*?<\\/item>/g;
  const matches = xml.match(itemRegex) || [];
  
  for (const item of matches) {
    try {
      const getTag = (tag) => {
        const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return m ? m[1].replace(/<!\\[CDATA\\[|\\]\\]>/g, '').trim() : '';
      };
      items.push({
        title: getTag('title') || '(无标题)',
        description: getTag('description').replace(/<[^>]+>/g, '').substring(0, 200),
        url: getTag('link'),
        pubDate: getTag('pubDate'),
      });
    } catch(e) {}
  }
  return items;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('请求超时'));
    });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export default fetchRSSFeeds;
