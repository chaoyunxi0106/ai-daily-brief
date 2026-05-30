/**
 * ========================================
 *   🧠 AI 大脑 - DeepSeek 总结器
 *   用 DeepSeek API 对所有原始数据进行智能总结
 *   API 兼容 OpenAI 格式，极其便宜
 * ========================================
 */
import https from 'https';

/**
 * 使用 DeepSeek 生成每日简报
 * @param {Object} allData - 所有来源的原始数据
 * @param {Object} config - DeepSeek 配置
 * @returns {Promise<string>} 格式化的简报文本
 */
export async function generateDailyBrief(allData, config) {
  const { apiKey, model, baseUrl, temperature } = config;
  
  if (!apiKey || apiKey === 'YOUR_DEEPSEEK_API_KEY_HERE') {
    throw new Error('⚠️ 请先配置 DeepSeek API Key！
   注册: https://platform.deepseek.com/
   然后在 config.local.js 中填入你的密钥');
  }

  console.log('🧠 正在调用 DeepSeek API 生成智能简报...');
  
  // 构造系统提示词 - 告诉AI如何总结
  const systemPrompt = `你是一位资深科技编辑，擅长从大量信息中提炼精华。
你的任务是将今天收集到的所有信息整理成一份简洁、易读的每日简报。

【输出要求】
1. 语言：中文，语气亲切但不失专业
2. 结构：按来源分段，每段附上emoji标题
3. 每个条目用1-2句话总结核心亮点
4. 对于技术项目，说明它解决了什么问题、为什么重要
5. 对于学术论文，用通俗语言解释核心贡献
6. 整体长度控制在 1500-2000 字以内
7. 必须包含原文链接，方便用户点击查看详情

【输出格式 - 请严格按照以下 markdown 格式】
---
# 📰 AI每日简报 | {{日期}}

---

## 📈 GitHub 本周趋势
1. **项目名** - 一句话亮点
   🔗 [链接](url) | ⭐ stars数 | 💻 语言

## 📄 学术前沿
1. **论文标题** - 通俗解释
   👨‍🔬 作者 | 🔗 [论文链接](url)

## 🔥 技术热点 (HackerNews)
1. **标题** - 为什么值得关注
   🔗 [链接](url)

## 🌍 今日世界要闻
1. **标题** - 一句话总结
   🔗 [来源](url)

---

> ✨ 本简报由 AI 自动生成 | 使用 DeepSeek 驱动
`;

  // 构造用户消息 - 把原始数据喂给AI
  const userMessage = buildUserMessage(allData);
  
  // 调用 DeepSeek API
  const brief = await callDeepSeek(systemPrompt, userMessage, { apiKey, model, baseUrl, temperature });
  
  console.log('✅ DeepSeek 简报生成完成！');
  return brief;
}

/**
 * 将原始数据组装成 AI 可理解的格式
 */
function buildUserMessage(data) {
  let msg = '【请根据以下原始信息生成今日简报】\n\n';
  
  // GitHub 趋势
  if (data.github && data.github.length > 0) {
    msg += '=== GitHub 本周趋势项目 ===\n';
    data.github.slice(0, 10).forEach((p, i) => {
      msg += `${i+1}. ${p.name}\n   ⭐ ${p.stars} | 今日+${p.todayStars} | 💻 ${p.language}\n   描述: ${p.description}\n   链接: ${p.url}\n\n`;
    });
  }
  
  // ArXiv 论文
  if (data.arxiv && data.arxiv.length > 0) {
    msg += '=== ArXiv 最新论文 ===\n';
    data.arxiv.slice(0, 8).forEach((p, i) => {
      msg += `${i+1}. ${p.title}\n   作者: ${(p.authors||[]).slice(0,3).join(', ')} et al.\n   摘要: ${p.summary?.substring(0, 200)}...\n   链接: ${p.url}\n\n`;
    });
  }
  
  // Hacker News
  if (data.hackernews && data.hackernews.length > 0) {
    msg += '=== HackerNews 技术热点 ===\n';
    data.hackernews.forEach((s, i) => {
      msg += `${i+1}. ${s.title} (👍${s.score} | 💬${s.comments})\n   链接: ${s.url}\n\n`;
    });
  }
  
  // 世界新闻
  if (data.worldNews && data.worldNews.length > 0) {
    msg += '=== 世界新闻 ===\n';
    data.worldNews.slice(0, 10).forEach((n, i) => {
      msg += `${i+1}. [${n.source}] ${n.title}\n   ${n.description}\n   链接: ${n.url}\n\n`;
    });
  }
  
  // RSS 订阅
  if (data.rss && data.rss.length > 0) {
    msg += '=== 订阅RSS ===\n';
    data.rss.slice(0, 8).forEach((r, i) => {
      msg += `${i+1}. [${r.feedName}] ${r.title}\n   链接: ${r.url}\n\n`;
    });
  }
  
  return msg;
}

/**
 * 调用 DeepSeek API (兼容 OpenAI 格式)
 */
function callDeepSeek(systemPrompt, userMessage, { apiKey, model, baseUrl, temperature }) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: temperature || 0.3,
      max_tokens: 4096,
    });

    const url = new URL(baseUrl + '/chat/completions');
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 60000, // 1分钟超时
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) {
            reject(new Error(`DeepSeek API 错误: ${json.error.message || JSON.stringify(json.error)}`));
            return;
          }
          const content = json.choices?.[0]?.message?.content;
          if (!content) {
            reject(new Error('DeepSeek 返回为空'));
            return;
          }
          resolve(content);
        } catch (e) {
          reject(new Error(`解析DeepSeek响应失败: ${e.message}\n原始响应: ${body.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('DeepSeek API 请求超时 (60s)'));
    });

    req.write(data);
    req.end();
  });
}

export default generateDailyBrief;
