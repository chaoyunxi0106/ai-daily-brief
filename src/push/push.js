/**
 * ========================================
 *   📲 消息推送模块
 *   支持 PushDeer / Server酱 / 本地文件
 * ========================================
 */
import https from 'https';
import fs from 'fs';
import path from 'path';

/**
 * 推送简报到所有配置的渠道
 * @param {string} brief - 简报内容
 * @param {Object} config - 推送配置
 * @returns {Promise<Array>} 推送结果
 */
export async function pushBrief(brief, config) {
  const results = [];
  const { pushdeer, serverChan, saveToFile } = config;

  // 1. PushDeer 推送 (推荐)
  if (pushdeer?.enabled && pushdeer?.key && pushdeer.key !== 'YOUR_PUSHDEER_KEY_HERE') {
    try {
      await pushToPushDeer(brief, pushdeer);
      results.push('✅ PushDeer 推送成功');
      console.log('✅ [Push] PushDeer 推送成功');
    } catch (e) {
      results.push(`❌ PushDeer 推送失败: ${e.message}`);
      console.log(`❌ [Push] PushDeer 失败: ${e.message}`);
    }
  }

  // 2. Server酱推送 (备选)
  if (serverChan?.enabled && serverChan?.sendKey) {
    try {
      await pushToServerChan(brief, serverChan);
      results.push('✅ Server酱 推送成功');
      console.log('✅ [Push] Server酱 推送成功');
    } catch (e) {
      results.push(`❌ Server酱 推送失败: ${e.message}`);
    }
  }

  // 3. 保存到本地文件 (始终执行)
  if (saveToFile?.enabled) {
    try {
      const filePath = saveToLocalFile(brief, saveToFile.outputDir);
      results.push(`✅ 简报已保存到: ${filePath}`);
      console.log(`✅ [Push] 已保存到: ${filePath}`);
    } catch (e) {
      results.push(`❌ 文件保存失败: ${e.message}`);
    }
  }

  return results;
}

/**
 * 推送至 PushDeer (免费，推送到微信)
 */
function pushToPushDeer(brief, config) {
  return new Promise((resolve, reject) => {
    // 截取前2000字符作为推送内容 (PushDeer有长度限制)
    const title = '📰 AI每日简报';
    const content = brief.substring(0, 4000);
    
    const data = JSON.stringify({
      pushkey: config.key,
      text: title,
      desp: content,
      type: 'markdown',
    });

    const url = new URL(config.apiUrl || 'https://api2.pushdeer.com/message/push');

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.code === 0 || json.result?.length > 0) {
            resolve(json);
          } else {
            reject(new Error(`${json.error || JSON.stringify(json)}`));
          }
        } catch (e) {
          resolve(body); // 非JSON响应也视为成功
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('超时')); });
    req.write(data);
    req.end();
  });
}

/**
 * 推送至 Server酱 (微信推送)
 */
function pushToServerChan(brief, config) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: '📰 AI每日简报',
      desp: brief,
    });

    const url = new URL(`https://sctapi.ftqq.com/${config.sendKey}.send`);

    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 10000,
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { resolve(body); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('超时')); });
    req.write(data);
    req.end();
  });
}

/**
 * 保存简报到本地文件
 */
function saveToLocalFile(brief, outputDir) {
  const dir = path.resolve(outputDir || './output');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const filePath = path.join(dir, `daily-brief-${dateStr}.md`);
  
  fs.writeFileSync(filePath, brief, 'utf-8');
  return filePath;
}

export default pushBrief;
