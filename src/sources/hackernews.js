/**
 * ========================================
 *   🔥 Hacker News 热点抓取器
 *   使用官方 Firebase API (无需API Key)
 * ========================================
 */
import https from 'https';

const HN_BASE = 'https://hacker-news.firebaseio.com/v0';

/**
 * 获取 Hacker News 热门文章
 * @param {Object} options - { topStories: number }
 * @returns {Promise<Array>} 文章列表
 */
export async function fetchHackerNews(options = {}) {
  const { topStories = 10 } = options;

  console.log('[HackerNews] 正在获取热门文章...');

  // 获取 top stories IDs
  const ids = await httpsGet(`${HN_BASE}/topstories.json`);
  const storyIds = JSON.parse(ids).slice(0, topStories);

  // 并行获取每篇文章详情
  const stories = await Promise.all(
    storyIds.map(id => 
      httpsGet(`${HN_BASE}/item/${id}.json`)
        .then(JSON.parse)
        .catch(() => null)
    )
  );

  const validStories = stories.filter(s => s && s.title)
    .map(story => ({
      title: story.title || '(无标题)',
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      score: story.score || 0,
      author: story.by || 'anonymous',
      comments: story.descendants || 0,
      source: 'HackerNews',
    }));

  console.log(`[HackerNews] 成功获取 ${validStories.length} 篇热门文章`);
  return validStories;
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('请求超时'));
    });
  });
}

export default fetchHackerNews;
