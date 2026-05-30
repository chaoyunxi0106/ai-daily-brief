/**
 * ========================================
 *   📄 ArXiv 学术论文抓取器
 *   获取最新 AI/ML/NLP 论文
 * ========================================
 */
import https from 'https';

/**
 * 获取 ArXiv 最新论文
 * @param {Object} options - { categories: string[], maxResults: number }
 * @returns {Promise<Array>} 论文列表
 */
export async function fetchArxivPapers(options = {}) {
  const { categories = ['cs.AI', 'cs.CL', 'cs.LG'], maxResults = 10 } = options;
  
  // 使用 ArXiv API 查询
  const query = categories.map(cat => `cat:${cat}`).join('+OR+');
  const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;
  
  console.log(`[ArXiv] 正在获取最新论文... (分类: ${categories.join(', ')})`);
  
  const xml = await httpsGet(url);
  const papers = parseArxivXml(xml);
  
  console.log(`[ArXiv] 成功获取 ${papers.length} 篇论文`);
  return papers;
}

/**
 * 解析 ArXiv API 返回的 XML
 */
function parseArxivXml(xml) {
  const papers = [];
  
  // 提取每个 entry
  const entryRegex = /<entry>[\s\S]*?<\/entry>/g;
  const entries = xml.match(entryRegex) || [];
  
  for (const entry of entries) {
    try {
      const getId = (tag) => {
        const match = entry.match(new RegExp(`<${tag}>([\s\S]*?)<\/${tag}>`));
        return match ? match[1].trim() : '';
      };
      
      const title = getId('title').replace(/\s+/g, ' ');
      const summary = getId('summary').replace(/\s+/g, ' ').substring(0, 300);
      const published = getId('published');
      const linkMatch = entry.match(/<id>[^<]*<\/id>/);
      const link = linkMatch ? linkMatch[0].replace(/<\/?id>/g, '').trim() : '';
      
      // 提取作者
      const authorRegex = /<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g;
      let authorMatch;
      const authors = [];
      while ((authorMatch = authorRegex.exec(entry)) !== null) {
        authors.push(authorMatch[1].trim());
      }
      
      // 提取分类
      const catRegex = /<category term="([^"]+)"\s*\/>/g;
      let catMatch;
      const categories = [];
      while ((catMatch = catRegex.exec(entry)) !== null) {
        categories.push(catMatch[1]);
      }
      
      papers.push({
        title: title || '(无标题)',
        authors: authors.slice(0, 5),
        summary: summary || '(无摘要)',
        url: link || `https://arxiv.org/abs/${getId('id').split('/').pop()}`,
        published: published,
        categories: categories,
        source: 'ArXiv',
      });
    } catch (e) {
      // 跳过解析失败
    }
  }
  
  return papers;
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

export default fetchArxivPapers;
