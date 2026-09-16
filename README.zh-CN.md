**简体中文** | [English](./README.md)

<p align="center">
  <img src="docs/images/icon.png" alt="pi-forge-zh" width="120" height="120"/>
</p>

# pi-forge-zh

[![CI](https://github.com/jisi71/pi-forge-zh/actions/workflows/ci.yml/badge.svg)](https://github.com/jisi71/pi-forge-zh/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**pi 编码代理的中文网页工作台。** 在浏览器里跟 AI 结对写代码：聊天、看文件、开终端、审 diff、连 Git —— 全在一个页面里，界面是简体中文。

> 上游 [`Devin-Marks/pi-forge`](https://github.com/Devin-Marks/pi-forge) 已于 **2026-09-16 归档**（只读，不再维护）。本项目基于它最后一个版本 **`v1.5.4`**，加上了完整的简体中文界面。上游的 MIT 许可与版权声明原样保留（见 [LICENSE](./LICENSE)）。

---

## 目录

- [这是什么 / 它不做什么](#这是什么--它不做什么)
- [开始使用](#开始使用)
- [第一次打开是什么样](#第一次打开是什么样)
- [配置模型（必须做，否则聊不了）](#配置模型必须做否则聊不了)
- [界面导览](#界面导览)
- [中文界面说明](#中文界面说明)
- [常用配置](#常用配置)
- [常见问题](#常见问题)
- [数据存在哪里 / 怎么回退](#数据存在哪里--怎么回退)
- [关于本项目](#关于本项目)

---

## 这是什么 / 它不做什么

**这是**：一个跑在你自己电脑（或服务器）上的网页界面。它把 [pi 编码代理](https://github.com/earendil-works/pi) 包装成浏览器里的工作台 —— 你提供工作目录，它让 AI 在你的代码里读写文件、跑命令、改代码，并把过程展示给你看。

**这不是**：不是 AI 模型本身，也不是「装上就能用」的成品。它只是一个界面外壳：

- **模型能力来自 pi**，你要自己配置模型凭据（OpenAI / Anthropic / DeepSeek / 通义 / 本地 Ollama 等都可以，取决于 pi 支持的提供商）。
- **它在本机运行**，单用户设计（一个容器、一个工作区根目录、一个使用者），没有多租户和权限系统。
- **不联网也能启动**，但没配模型就只能看界面、聊不了。

## 开始使用

### 方式 A：一条命令（推荐先试）

```bash
npx pi-forge-zh
```

然后打开 <http://localhost:3000>。（`npx` 来自 Node.js，需要 Node ≥ 20；没装的话先去 <https://nodejs.org> 装。）

### 方式 B：全局安装

```bash
npm i -g pi-forge-zh
pi-forge-zh
```

### 方式 C：Docker

```bash
git clone https://github.com/jisi71/pi-forge-zh.git
cd pi-forge-zh
cp docker/.env.example docker/.env      # 需要改端口/路径/密码时再编辑
cd docker && docker compose up -d --build
```

容器默认映射 `127.0.0.1:3000`，并挂载三处：工作区、`~/.pi/agent`（pi 的配置与密钥）、数据目录。想让它只能本机访问就不用改（默认就是 `127.0.0.1`）。

### 方式 D：从源码跑

```bash
git clone https://github.com/jisi71/pi-forge-zh.git
cd pi-forge-zh
npm ci
npm run dev            # 后端 :3000，前端 :5173
```

## 第一次打开是什么样

1. **没有项目时**会自动弹出「新建项目」窗口，三个选项：
   - **创建 / 选择文件夹** → 先给项目起个名字，再在「工作区根目录」下面**选一个子文件夹**当项目。（根目录本身不能当项目，这是有意的安全限制。）
   - **克隆仓库** → 直接填 Git 地址克隆下来。
   - 关掉窗口也行，之后点左下角 **+ 新建** 再回来。
2. **建好项目后**点 **+ 新建会话**，就进入了对话界面。
3. **在底部输入框说话**：
   - `Enter` 发送，`Shift + Enter` 换行
   - `/` 打开命令面板（`/settings`、`/mcp`、`/skills` 等）
   - `!` 直接执行一条 shell 命令（不经过模型）
   - `@` 引用项目里的文件（把文件内容塞进上下文）
4. **顶部按钮**：对话 / 编辑器 / 文件 / 终端 —— 点一下显示或隐藏对应面板，这是纯前端开关，随便点。
5. **⌘K / Ctrl+K** 全局搜索：在所有历史会话里找内容。

## 配置模型（必须做，否则聊不了）

pi 需要知道用哪个模型、以及对应的 API 密钥。两种方式，**任选一种**：

### 方式 1：在网页里直接配置（中文界面，推荐）

1. 右上角 **设置** → **提供商**
2. 找到你要用的提供商（列表里有 `deepseek`、`openai`、`anthropic`、`google`、`amazon-bedrock`、`azure-openai-responses`、以及本地的 `ollama`/`vllm` 等），点 **添加密钥**
3. 粘上 API Key，保存。密钥会写入 pi 的配置文件 `~/.pi/agent/auth.json`（界面只显示"是否已配置"，**永远不回显密钥内容**）
4. 回到 **代理** 标签可以设默认模型和默认思考等级（也可以留空，在对话输入框上临时切）

### 方式 2：用 pi 命令行的登录流程

如果你已经装过 pi 本体（`npm i -g @earendil-works/pi-coding-agent` 之类），用它自己的登录命令配好即可 —— pi-forge 直接读同一份配置。

### 没配好会看到什么

聊天的请求会被拒绝，错误提示里会带这两个错误码之一：

| 错误码 | 意思 | 怎么办 |
|---|---|---|
| `no_model_configured` | 没有可用的模型 | 设置 → 代理 里选一个默认模型；或确认提供商下至少有一个带密钥的模型 |
| `no_api_key` | 模型有了，但该提供商没有密钥 | 设置 → 提供商 → 添加密钥 |

## 界面导览

页面分三栏，都能收起来：

```
┌──────────┬─────────────────────────┬──────────────────────────┐
│ 项目/会话 │        对话             │  文件 / 搜索 / 上一轮 /    │
│  侧栏     │  （聊天记录 + 输入框）    │  GIT / 进程 / 上下文       │
└──────────┴─────────────────────────┴──────────────────────────┘
```

**左侧**：项目列表（可拖动排序、双击重命名）＋ 每个项目下的会话列表。会话按项目分开保存。

**中间**：对话本身。这里能看到 AI 的思考过程、它调用了哪些工具（`bash`、`read`、`edit`、`write`…）、每个工具的输出，以及代码 diff。工具栏上还有：

| 按钮 | 作用 |
|---|---|
| **导出** | 把整段会话导出为 Markdown / 原始 JSONL |
| **会话树** | 查看会话的完整分支树，可以从任意历史节点跳回去、或分叉出新会话 |
| **协作** | 主管/工作代理面板：让一个会话当"主管"，去创建和调度同一项目里的其他会话 |

**右侧六个标签**：

| 标签 | 作用 |
|---|---|
| 文件 | 文件树 + 文件查看器，支持新建/重命名/删除/上传/下载整个项目 |
| 搜索 | 在项目源码里全文搜索（支持正则、Glob 过滤） |
| 上一轮 | 只看 AI 刚刚那一轮改了什么（diff） |
| GIT | 暂存/提交/推送/拉取、分支、提交历史、远端管理、逐块暂存 |
| 进程 | AI 启起来的后台进程（开发服务器等），可以看日志、杀掉 |
| 上下文 | Token 用量明细：系统提示词、工具定义、消息、附件各占多少 |

底部还可以展开**集成终端**（真 PTY）和**待办面板**。

## 中文界面说明

- **默认跟随浏览器语言**：中文系统 + 中文浏览器打开就是中文，英文浏览器是英文。
- **强制指定语言**：网址后面加参数即可（会被记住）
  - <http://localhost:3000/?lang=zh-CN> —— 强制中文
  - <http://localhost:3000/?lang=en> —— 强制英文
- **随时切换**：**设置 → 外观 → 语言**，三个选项：跟随浏览器 / English / 简体中文。切换立即生效，不用刷新页面。
- **语言设置只存在浏览器里**，不写服务端、不碰你的项目数据。

### 以下内容**故意不翻译**

这些是技术标识，翻译了反而会出错（比如没法复制粘贴、`@` 引用失效）：

- 模型名与提供商 id（`deepseek-flash`、`amazon-bedrock`…）
- 命令与参数（`/compact`、`--port`、`@path`、`!cmd`）
- 文件路径与文件名、Git 分支名、提交哈希
- JSON 字段名、环境变量名、接口路径
- 协议与品牌名（`MCP`、`GIT`、`OpenAPI`、`pi`、`pi-forge`）
- 代码、diff 内容、终端输出
- **AI 和你的对话内容**（那是数据，不是界面）
- 你自己的**技能（Skill）说明**、快捷操作名称 —— 这些来自你的配置

少数地方（例如服务端返回的错误码）也保持英文，方便你拿去搜索。

### 翻译有问题？

发现漏翻、错译、或者中文排版不对劲，欢迎直接开 [Issue](https://github.com/jisi71/pi-forge-zh/issues)（贴截图最好）。想自己改也很简单：

```
packages/client/src/i18n/locales/zh-CN/<区域>.ts
```

找到对应的键改中文即可，英文原文在同名目录 `en/` 下。改完跑 `npm run i18n:audit` 会检查两个语言包的键是否对齐。**加一门新语言**（比如日语）也不需要动任何组件代码 —— 复制 `locales/zh-CN/` 整个目录改名，再在 `packages/client/src/i18n/index.ts` 的 `LOCALES` 里加一行就行。

## 常用配置

所有配置都能写成 `--参数` 或环境变量（**同时存在时命令行参数优先**）。完整列表跑 `pi-forge-zh --help`。

```bash
pi-forge-zh --port 4000 --workspace-path ~/Code
pi-forge-zh --ui-password @~/secrets/pw      # @文件 的写法避免密码进 shell 历史
```

| 参数 | 环境变量 | 默认值 | 作用 |
|---|---|---|---|
| `--port` | `PORT` | `3000` | 网页端口 |
| `--host` | `HOST` | `127.0.0.1` | 监听地址（想局域网访问才改 `0.0.0.0`，**记得同时设密码**） |
| `--workspace-path` | `WORKSPACE_PATH` | `~/.pi-forge/workspace` | 工作区根目录（项目都建在它下面） |
| `--pi-config-dir` | `PI_CONFIG_DIR` | `~/.pi/agent` | pi 的配置与密钥目录（auth.json / models.json） |
| `--forge-data-dir` | `FORGE_DATA_DIR` | `~/.pi-forge` | 本程序自己的数据（项目列表、缓存、登录密钥） |
| `--app-name` | `APP_NAME` | `pi-forge` | 界面上显示的名字，想改成别的就改这里 |
| `--ui-password` | `UI_PASSWORD` | 未设置 | 设了就启用网页登录（本机自用可以不设） |
| `--api-key` | `API_KEY` | 未设置 | 给程序化调用用的 `Authorization: Bearer` |
| `--minimal-ui` | `MINIMAL_UI` | 关 | 精简模式：隐藏提供商/代理等标签，适合部署给不懂技术的人用 |

## 常见问题

**端口被占用（`EADDRINUSE`）**
换个端口：`pi-forge-zh --port 3100`。

**界面还是英文**
说明这个浏览器被判定成了英文环境。手动锁定：打开 <http://localhost:3000/?lang=zh-CN>，或在 **设置 → 外观 → 语言** 里选「简体中文」（会记住）。

**终端打不开 / 报 `posix_spawnp failed.`**
这是 `node-pty` 原生模块的执行权限问题（上游已知）。在安装目录里跑一次：

```bash
node "$(npm root -g)/pi-forge-zh/bin/fix-pty-perms.mjs"
```

**我想同时保留官方的英文版**
两个包可以共存（包名不同：`pi-forge-zh` / `pi-forge`）。注意默认数据目录都是 `~/.pi-forge`，想彻底分开就显式指定：

```bash
pi-forge-zh --port 3100 --forge-data-dir ~/.pi-forge-zh
```

**局域网/手机上访问**
`--host 0.0.0.0 --ui-password yourpassword`。**不要**在没有密码的情况下暴露到公网 —— 这个工作台能让 AI 在你的机器上执行命令。

**想让 AI 用某个特定模型**
两种：**设置 → 代理** 设全局默认；或者在对话输入框上方直接切当前会话的模型和思考等级（不改全局）。自定义提供商（vLLM / LiteLLM / Ollama 等）在 **设置 → 提供商 → 自定义 JSON** 里加。

## 数据存在哪里 / 怎么回退

| 位置 | 内容 |
|---|---|
| `~/.pi-forge/`（数据目录） | `projects.json`（项目列表）、缓存、`jwt-secret`、`password-hash` |
| `<工作区>/.pi/sessions/<项目ID>/` | 每个项目的会话记录（JSONL，可直接备份） |
| `~/.pi/agent/` | pi 的配置与密钥（**本程序只读取，除非你在设置里改配置**） |

- **备份**：整个数据目录 + 工作区里的 `.pi/sessions/` 拷走即可。设置 → 备份 也提供了导出/导入。
- **卸载**：`npm rm -g pi-forge-zh`（不会删你的数据）
- **换回官方英文版**：`npm rm -g pi-forge-zh && npm i -g pi-forge`

## 关于本项目

- **上游已归档**：`Devin-Marks/pi-forge` 于 2026-09-16 停止维护（本项目提交 PR 后不久，上游把整个仓库归档了 —— 所以那个 PR 是被「关停」一起关闭的，不是内容被否决）。
- **本 fork 只改界面**：所有 i18n 代码在 `packages/client/src/i18n/`，加上 42 个客户端文件把界面文案改成可翻译的形式。服务端只有几行**显示用字符串**不同（命令名、启动日志、OpenAPI 标题、OTEL 服务名默认值）；服务端逻辑、接口、SSE 事件、数据格式、所有环境变量与命令行参数、浏览器存储键**都与上游 `v1.5.4` 一致**。
- **验证**：`npm run check`（类型+lint+格式）· `npm run i18n:audit`（中英键对齐、漏翻检测）· `tests/test-i18n.ts` · 56 个集成测试（CI 上全过）· 中文/英文各 41 步真浏览器走查。详见 [docs/fork/VERIFY.md](./docs/fork/VERIFY.md)。
- **许可**：MIT。上游版权归 Devin Marks 与 pi-forge 贡献者；本 fork 的改动以同一许可发布。
- **参与**：欢迎 [Issue](https://github.com/jisi71/pi-forge-zh/issues) 与 PR（尤其是翻译修正、以及跟着 pi SDK 升级）。维护相关文档在 [docs/fork/](./docs/fork/README.md)。
