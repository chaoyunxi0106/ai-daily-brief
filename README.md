# 📰 AI 每日简报

> 自动采集 GitHub 趋势、ArXiv 论文、HackerNews 热点、世界新闻
> 由 DeepSeek AI 智能总结，每天早上推送到你的手机！

---

## ✨ 它能做什么？

| 功能 | 说明 |
|:---|:---|
| 📈 **GitHub 趋势** | 每周最火的开源项目，看看大家都在关注什么 |
| 📄 **学术前沿** | ArXiv 最新 AI/ML 论文，保持技术敏感度 |
| 🔥 **技术热点** | HackerNews 热门讨论，跟上业界节奏 |
| 🌍 **世界新闻** | BBC/Reuters 国际要闻，不脱离大环境 |
| 📡 **自定义 RSS** | 支持36氪、InfoQ 等中文科技媒体 |
| 🧠 **AI 总结** | DeepSeek 智能提炼，每条信息1-2句话 |
| 📲 **手机推送** | 通过 PushDeer 推送到微信，零门槛查看 |

---

## 🚀 快速开始（3分钟搞定）

### 第一步：注册两个免费账号

#### ① DeepSeek API（用来做AI总结）
- 打开 [https://platform.deepseek.com/](https://platform.deepseek.com/)
- 注册账号 → 实名认证 → 创建 API Key
- **费用**：约 ¥0.14/百万字，每天只需 **几分钱** 🎉

#### ② PushDeer（用来推送到微信）
- 打开 [https://pushdeer.com/](https://pushdeer.com/) 
- 下载 App → 登录 → 获取 PushDeer Key
- **完全免费** ✅

### 第二步：把你的代码部署到 GitHub（免费服务器）

> 不需要自己的服务器！GitHub 提供免费的云服务器帮你每天自动运行。

**1️⃣ 创建 GitHub 账号**
- 去 [github.com](https://github.com) 注册一个账号（如果还没有）

**2️⃣ 创建仓库**
- 点击右上角 **+** → **New repository**
- 仓库名填：`ai-daily-brief`
- 选择 **Public** 或 **Private** 都可以
- 点击 **Create repository**

**3️⃣ 上传代码**

有两种方式（选一种）：

<details>
<summary><b>📦 方式A：直接上传文件夹（最简单）</b></summary>

1. 在你的电脑上找到代码文件夹：`ai-daily-brief`
2. 在 GitHub 新仓库页面，点击 **uploading an existing file**
3. 把整个 `ai-daily-brief` 文件夹拖进去
4. 滚动到底部，点 **Commit changes**
</details>

<details>
<summary><b>🖥️ 方式B：用命令行（更专业）</b></summary>

```bash
# 如果你安装了 Git
cd ai-daily-brief
git init
git add .
git commit -m "📰 AI每日简报 - 初始提交"
git branch -M main
git remote add origin https://github.com/你的用户名/ai-daily-brief.git
git push -u origin main
```
</details>

**4️⃣ 配置密钥（重要！）**

- 进入你的仓库 → **Settings** → **Secrets and variables** → **Actions**
- 点击 **New repository secret**
- 添加以下两个密钥：

| 密钥名 | 值 |
|:---|:---|
| `DEEPSEEK_API_KEY` | 你从 DeepSeek 平台复制的 API Key |
| `PUSHDEER_KEY` | 你从 PushDeer App 获取的 Key |

**5️⃣ 启动自动化！**

- 进入仓库的 **Actions** 选项卡
- 你会看到 **AI每日简报** 工作流
- 点击 **Run workflow** → **Run workflow** 手动跑一次测试
- 等待1-2分钟，绿色勾勾 ✅ 表示成功！

之后就会 **每天早上8:00 自动运行**，你可以安心睡觉，醒来就看简报！

---

## 📱 收到的简报长什么样？

你会在微信（PushDeer）收到类似这样的消息：

```markdown
# 📰 AI每日简报 | 2024-01-15

---

## 📈 GitHub 本周趋势

1. **microsoft/generative-ai-for-beginners** - 微软生成式AI入门教程，12k stars
   🔗 [链接](https://github.com/microsoft/generative-ai-for-beginners) | ⭐ 45k | 💻 Jupyter Notebook

2. **lobe-chat/lobe-chat** - 开源ChatGPT桌面应用，支持多模型
   🔗 [链接](https://github.com/lobe-chat/lobe-chat) | ⭐ 28k | 💻 TypeScript

## 📄 学术前沿

1. **RAG vs Fine-tuning: A Survey** - 对比两种大模型知识注入方法
   👨‍🔬 论文链接 | 🔗 [阅读原文](https://arxiv.org/abs/...)

## 🔥 技术热点

1. **OpenAI 发布 GPT-5 预告** - 推理能力大幅提升
   🔗 [讨论](https://news.ycombinator.com/item?id=...)

---

> ✨ 本简报由 AI 自动生成 | 使用 DeepSeek 驱动
```

---

## 🛠️ 本地测试运行（可选）

如果你懂一点技术，可以在自己电脑上先测试：

```bash
# 进入项目目录
cd ai-daily-brief

# 创建本地配置文件
cp config/config.local.example.js config/config.local.js

# 编辑 config.local.js，填入你的密钥
# （用记事本打开修改即可）

# 运行
node src/index.js
```

---

## ⚙️ 自定义配置

打开 `config/config.js`，你可以：

- ✅ 开启/关闭任意数据源
- ✅ 添加更多 RSS 订阅源
- ✅ 切换推送渠道（PushDeer / Server酱）
- ✅ 调整简报语言和风格
- ✅ 设置 GitHub 语言过滤（如只看 Python 项目）

---

## ❓ 常见问题

**Q: 需要付费吗？**
A: DeepSeek 每天只需几分钱，GitHub 和 PushDeer 完全免费。

**Q: 安全吗？我的 API Key 会泄露吗？**
A: 密钥存在 GitHub Secrets 里，代码里只读环境变量，绝对安全。

**Q: 可以用其他 AI 吗？比如 ChatGPT？**
A: 可以！修改 config.js 中的 `baseUrl` 和 `model` 即可切换任意 OpenAI 兼容 API。

**Q: 我想在中午和晚上也收到简报？**
A: 修改 `.github/workflows/daily-brief.yml` 中的 cron 表达式即可。

---

## 📜 技术栈

- **纯 Node.js** - 零外部依赖，无需 npm install
- **DeepSeek API** - 中国最便宜的 AI 大模型
- **GitHub Actions** - 免费云调度服务器
- **PushDeer** - 免费微信推送通道

---

## 📝 许可证

MIT License - 随意使用、修改、分享

---

> 🌟 如果这个项目对你有帮助，请在 GitHub 上点个 Star！
> 💡 有想法或问题？欢迎提交 Issue 或 Pull Request
