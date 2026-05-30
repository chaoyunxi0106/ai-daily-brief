/**
 * ========================================
 *   🎯 AI每日简报 - 主入口
 *   聚合多源信息 → AI总结 → 推送到手机
 *   运行方式: node src/index.js
 * ========================================
 */



import fetchGitHubTrending from './sources/github-trending.js';
import fetchArxivPapers from './sources/arxiv.js';
import fetchHackerNews from './sources/hackernews.js';
import fetchWorldNews from './sources/world-news.js';
import fetchRSSFeeds from './sources/rss-fetcher.js';

import generateDailyBrief from './processors/summarizer.js';
import pushBrief from './push/push.js';


import config from '../config/config.js';

/**
 * 主函数 - 运行完整的每日简报流程
 */
async function main() {
  // ✅ 第一步：异步加载配置
  const config = await loadConfig();

  console.log('\n');
  console.log('╔══════════════════════════════════════╗');
  console.log('║     📰 AI 每日简报 · 启动           ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const startTime = Date.now();
  const results = {
    github: [],
    arxiv: [],
    hackernews: [],
    worldNews: [],
    rss: [],
  };

  // ====== 数据采集（后续代码不变）======
  console.log('┌─────────── 第一阶段：数据采集 ───────────┐');
  
  const fetchTasks = [];

  if (config.sources.githubTrending.enabled) {
    fetchTasks.push(
      fetchGitHubTrending(config.sources.githubTrending)
        .then(data => { results.github = data; })
        .catch(e => console.log('⚠️ GitHub 趋势获取失败:', e.message))
    );
  }

  if (config.sources.arxiv.enabled) {
    fetchTasks.push(
      fetchArxivPapers(config.sources.arxiv)
        .then(data => { results.arxiv = data; })
        .catch(e => console.log('⚠️ ArXiv 论文获取失败:', e.message))
    );
  }

  if (config.sources.hackerNews.enabled) {
    fetchTasks.push(
      fetchHackerNews(config.sources.hackerNews)
        .then(data => { results.hackernews = data; })
        .catch(e => console.log('⚠️ HackerNews 获取失败:', e.message))
    );
  }

  if (config.sources.worldNews.enabled) {
    fetchTasks.push(
      fetchWorldNews(config.sources.worldNews)
        .then(data => { results.worldNews = data; })
        .catch(e => console.log('⚠️ 世界新闻获取失败:', e.message))
    );
  }

  if (config.sources.rss.enabled && config.sources.rss.feeds?.length > 0) {
    fetchTasks.push(
      fetchRSSFeeds(config.sources.rss.feeds)
        .then(data => { results.rss = data; })
        .catch(e => console.log('⚠️ RSS 获取失败:', e.message))
    );
  }

  await Promise.all(fetchTasks);
  console.log('└──────────────────────────────────────────┘\n');

  // ====== 统计 ======
  const totalItems = results.github.length + results.arxiv.length + 
                     results.hackernews.length + results.worldNews.length + 
                     results.rss.length;

  console.log(`📊 共获取 ${totalItems} 条信息`);
  if (results.github.length) console.log(`   📈 GitHub: ${results.github.length} 个项目`);
  if (results.arxiv.length) console.log(`   📄 ArXiv: ${results.arxiv.length} 篇论文`);
  if (results.hackernews.length) console.log(`   🔥 HN: ${results.hackernews.length} 篇热点`);
  if (results.worldNews.length) console.log(`   🌍 新闻: ${results.worldNews.length} 条`);
  if (results.rss.length) console.log(`   📡 RSS: ${results.rss.length} 条`);

  if (totalItems === 0) {
    console.log('\n⚠️ 没有获取到任何数据，请检查网络连接或配置。');
    return;
  }

  // ====== AI 总结 ======
  console.log('\n┌─────────── 第二阶段：AI 智能总结 ─────────┐');
  
  let brief;
  try {
    brief = await generateDailyBrief(results, config.deepseek);
    console.log('└──────────────────────────────────────────┘\n');
  } catch (e) {
    console.log('\n❌ AI 总结失败:', e.message);
    console.log('\n💡 提示: 请确保已在 config/config.local.js 中配置 DeepSeek API Key');
    console.log('   注册地址: https://platform.deepseek.com/');
    return;
  }

  // ====== 简报预览 ======
  console.log('┌─────────── 生成的简报预览 ─────────┐');
  console.log(brief.substring(0, 800) + '...');
  console.log('└────────────────────────────────────┘\n');

  // ====== 推送 ======
  console.log('┌─────────── 第三阶段：消息推送 ───────────┐');
  
  const pushResults = await pushBrief(brief, config.push);
  
  console.log('└──────────────────────────────────────────┘\n');

  // ====== 最终报告 ======
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('╔══════════════════════════════════════╗');
  console.log('║     ✅ 每日简报完成！                ║');
  console.log(`║     耗时: ${elapsed}秒                ║`);
  console.log(`║     数据: ${totalItems}条             ║`);
  pushResults.forEach(r => console.log(`║     ${r.padEnd(30,' ')}║`));
  console.log('╚══════════════════════════════════════╝');
  console.log('');
}

main().catch(e => {
  console.error('\n❌ 程序异常:', e.message);
  process.exit(1);
});
