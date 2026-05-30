/**
 * ========================================
 *   🎯 AI每日简报 - 配置中心
 *   修改这里的配置即可定制你的简报
 * ========================================
 * 
 * 使用说明：
 * 1. 复制本文件为 config.local.js 并填入你的密钥
 * 2. config.local.js 不会被上传到GitHub（已在.gitignore中）
 * 3. 在GitHub Actions中通过 Secrets 设置环境变量
 */

const config = {
  // ========== DeepSeek API 配置 ==========
  // 在这里填入你的 DeepSeek API Key
  // 注册地址: https://platform.deepseek.com/
  // 费用: 约 ¥0.14/百万token，每天只需几分钱
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || 'YOUR_DEEPSEEK_API_KEY_HERE',
    model: 'deepseek-chat',   // DeepSeek-V3 模型
    baseUrl: 'https://api.deepseek.com/v1',
    temperature: 0.3,          // 较低温度=更准确的事实性总结
  },

  // ========== 推送渠道配置 ==========
  // 推荐使用 PushDeer (免费) 推送到微信
  // PushDeer 教程: https://github.com/easychen/pushdeer
  push: {
    // --- PushDeer (推荐) ---
    pushdeer: {
      enabled: true,
      // 你的 PushDeer Key (在 PushDeer App 中获取)
      key: process.env.PUSHDEER_KEY || 'YOUR_PUSHDEER_KEY_HERE',
      apiUrl: 'https://api2.pushdeer.com/message/push',
    },

    // --- Server酱 (备选) ---
    // 注册: https://sct.ftqq.com/
    serverChan: {
      enabled: false,
      sendKey: process.env.SERVERCHAN_KEY || '',
    },

    // --- 本地文件保存 (始终开启) ---
    saveToFile: {
      enabled: true,
      outputDir: './output',
    }
  },

  // ========== 数据来源配置 ==========
  sources: {
    // --- GitHub 趋势 (中文或英文) ---
    githubTrending: {
      enabled: true,
      language: '',           // 可选: 'javascript', 'python', 'rust', ''=全部
      since: 'weekly',        // 'daily', 'weekly', 'monthly'
    },

    // --- ArXiv 学术论文 ---
    arxiv: {
      enabled: true,
      categories: ['cs.AI', 'cs.CL', 'cs.LG'],  // AI/自然语言/机器学习
      maxResults: 10,                             // 每次拉取最多论文数
    },

    // --- Hacker News 技术热点 ---
    hackerNews: {
      enabled: true,
      topStories: 10,   // 获取前N条热门
    },

    // --- 世界新闻 ---
    worldNews: {
      enabled: true,
      sources: ['bbc-news', 'reuters'],  // 新闻来源
      // 注意: 使用NewsAPI需要免费API Key (https://newsapi.org/)
      apiKey: process.env.NEWSAPI_KEY || '',
    },

    // --- RSS 订阅源 (可自定义) ---
    rss: {
      enabled: true,
      feeds: [
        { name: '36氪', url: 'https://36kr.com/feed' },
        { name: 'InfoQ', url: 'https://www.infoq.cn/feed' },
      ]
    }
  },

  // ========== 简报风格配置 ==========
  style: {
    language: 'zh-CN',           // 简报语言
    maxSummaryLength: 2000,      // 总字数上限
    includeOriginalLinks: true,  // 是否附上原文链接
    dateFormat: 'YYYY-MM-DD',   // 日期格式
  }
};

export default config;
