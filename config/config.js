/**
 * ========================================
 *   🎯 AI每日简报 - 配置中心
 *   本地：export KEY=xxx && node src/index.js
 *   线上：通过 GitHub Secrets 注入环境变量
 * ========================================
 *
 * 必需的环境变量：
 *   DEEPSEEK_API_KEY   — DeepSeek API 密钥
 *   PUSHDEER_KEY       — PushDeer 推送密钥
 *
 * 可选的环境变量：
 *   NEWSAPI_KEY        — NewsAPI 密钥
 *   SERVERCHAN_KEY     — Server酱 SendKey
 */

const config = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/v1',
    temperature: 0.3,
  },

  push: {
    pushdeer: {
      enabled: true,
      key: process.env.PUSHDEER_KEY || '',
      apiUrl: 'https://api2.pushdeer.com/message/push',
    },
    serverChan: {
      enabled: false,
      sendKey: process.env.SERVERCHAN_KEY || '',
    },
    saveToFile: {
      enabled: true,
      outputDir: './output',
    },
  },

  sources: {
    githubTrending: {
      enabled: true,
      language: '',
      since: 'weekly',
    },
    arxiv: {
      enabled: true,
      categories: ['cs.AI', 'cs.CL', 'cs.LG'],
      maxResults: 10,
    },
    hackerNews: {
      enabled: true,
      topStories: 10,
    },
    worldNews: {
      enabled: true,
      sources: ['bbc-news', 'reuters'],
      apiKey: process.env.NEWSAPI_KEY || '',
    },
    rss: {
      enabled: true,
      feeds: [
        { name: '36氪', url: 'https://36kr.com/feed' },
        { name: 'InfoQ', url: 'https://www.infoq.cn/feed' },
      ],
    },
  },

  style: {
    language: 'zh-CN',
    maxSummaryLength: 2000,
    includeOriginalLinks: true,
    dateFormat: 'YYYY-MM-DD',
  },
};

export default config;
