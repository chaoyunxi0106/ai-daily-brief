/**
 * ========================================
 *   📈 GitHub 趋势项目抓取器
 *   获取 GitHub Trending Weekly 榜单
 * ========================================
 */
import https from 'https';
import { URL } from 'url';

/**
 * 获取 GitHub 趋势项目
 * @param {Object} options - { language: string, since: 'daily'|'weekly'|'monthly' }
 * @returns {Promise<Array>} 趋势项目列表
 */
export async function fetchGitHubTrending(options = {}) {
  const { language = '', since = 'weekly' } = options;
  
  const url = language 
    ? `https://github.com/trending/${language}?since=${since}`
    : `https://github.com/trending?since=${since}`;

  console.log(`[GitHub] 正在获取趋势项目... (${url})`);
  
  const html = await httpsGet(url);
  const projects = parseTrendingHtml(html, language);
  
  console.log(`[GitHub] 成功获取 ${projects.length} 个趋势项目`);
  return projects;
}

/**
 * 解析 GitHub Trending 页面 HTML
 */
function parseTrendingHtml(html, language) {
  const projects = [];
  
  // 使用正则提取每个项目卡片
  const articleRegex = /<article class="Box-row"[\s\S]*?<\/article>/g;
  const articles = html.match(articleRegex) || [];
  
  for (const article of articles) {
    try {
      // 提取仓库名
      const repoMatch = article.match(/href="\/([^"]+\/[^"]+)"/);
      if (!repoMatch) continue;
      const fullName = repoMatch[1];
      
      // 提取描述
      const descMatch = article.match(/<p class="col-9[^"]*"[\s\S]*?>([\s\S]*?)<\/p>/);
      const description = descMatch 
        ? descMatch[1].replace(/<[^>]+>/g, '').trim() 
        : '';
      
      // 提取编程语言
      const langMatch = article.match(/<span itemprop="programmingLanguage">([^<]+)<\/span>/);
      const progLang = langMatch ? langMatch[1].trim() : (language || '未知');
      
      // 提取 stars
      const starsMatch = article.match(/<a[^>]*href="\/[^"]+\/stargazers"[^>]*>[\s\S]*?([\d,]+[KMk]?)[\s\S]*?<\/a>/);
      const stars = starsMatch ? starsMatch[1].trim() : '?';
      
      // 提取 today's stars
      const todayStarsMatch = article.match(/([\d,]+)\s*stars\s*today/);
      const todayStars = todayStarsMatch ? todayStarsMatch[1].trim() : '?';
      
      // 提取 fork 数
      const forksMatch = article.match(/<a[^>]*href="\/[^"]+\/forks"[^>]*>[\s\S]*?([\d,]+)[\s\S]*?<\/a>/);
      const forks = forksMatch ? forksMatch[1].trim() : '?';
      
      projects.push({
        name: fullName,
        url: `https://github.com/${fullName}`,
        description: description || '(暂无描述)',
        language: progLang,
        stars: stars,
        forks: forks,
        todayStars: todayStars,
        source: 'GitHub Trending',
      });
    } catch (e) {
      // 跳过解析失败的项目
    }
  }
  
  return projects.slice(0, 15); // 最多返回15个
}

/**
 * 简单的 HTTPS GET 请求
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 15000,
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() {
      this.destroy();
      reject(new Error('请求超时'));
    });
  });
}

export default fetchGitHubTrending;
