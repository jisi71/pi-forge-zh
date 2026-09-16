#!/usr/bin/env node
/**
 * Assemble `publish/` — the staging directory we ship to npm as the
 * `pi-forge` package.
 *
 * What this does:
 *   1. Sanity-checks that both server and client builds exist (caller
 *      must have already run `npm run build`).
 *   2. Wipes any prior `publish/` dir.
 *   3. Copies built server + client artifacts into `publish/dist/`.
 *   4. Copies the bin shim into `publish/bin/`.
 *   5. Synthesizes `publish/package.json` by reading the root version,
 *      hoisting the SERVER's runtime `dependencies` (the server's
 *      package.json is the source of truth — no manual duplication),
 *      and adding `bin`, `engines`, `files`, `repository`, etc.
 *   6. Copies `LICENSE` and writes a focused `README.md` that explains
 *      the npm consumer flow (different from the repo's contributor
 *      README, which assumes you cloned).
 *
 * Why a staging dir instead of flipping the root `private: false`:
 * keeps the source tree clean. The published artifact is a flat
 * single-package layout; the dev-time monorepo layout stays as it is.
 * No drift risk from manually keeping a hoisted-deps list in sync —
 * we read the server's deps fresh on every build.
 *
 * Run via: `npm run build:publish` (which depends on `npm run build`).
 *
 * The CI release workflow runs this between `npm run build` and
 * `npm publish ./publish`. Locally you can also run it for a smoke
 * test or to inspect the tarball with `npm pack` from `publish/`.
 */
import { existsSync } from "node:fs";
import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLISH_DIR = resolve(REPO_ROOT, "publish");

const SERVER_DIST = resolve(REPO_ROOT, "packages/server/dist");
const CLIENT_DIST = resolve(REPO_ROOT, "packages/client/dist");
const BIN_SRC = resolve(REPO_ROOT, "bin/pi-forge-zh.mjs");
const POSTINSTALL_SRC = resolve(REPO_ROOT, "bin/fix-pty-perms.mjs");

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function main() {
  // 1. Sanity-check inputs
  for (const [label, path] of [
    ["server dist", SERVER_DIST],
    ["client dist", CLIENT_DIST],
    ["bin shim", BIN_SRC],
    ["postinstall script", POSTINSTALL_SRC],
  ]) {
    if (!existsSync(path)) {
      console.error(
        `[build-publish-dir] missing ${label} at ${path}\n` +
          `  Run 'npm run build' first to produce server + client artifacts.`,
      );
      process.exit(1);
    }
  }

  const rootPkg = await readJson(resolve(REPO_ROOT, "package.json"));
  const serverPkg = await readJson(resolve(REPO_ROOT, "packages/server/package.json"));

  // 2. Reset the staging dir
  await rm(PUBLISH_DIR, { recursive: true, force: true });
  await mkdir(PUBLISH_DIR, { recursive: true });

  // 3. Copy artifacts
  // recursive copy with `cp` (Node >=16.7) preserves directory structure
  // including nested `core/`, `mcp/`, `routes/` etc. under the server dist.
  await cp(SERVER_DIST, resolve(PUBLISH_DIR, "dist/server"), { recursive: true });
  await cp(CLIENT_DIST, resolve(PUBLISH_DIR, "dist/client"), { recursive: true });

  // 4. Bin shim + postinstall fix-pty-perms script
  await mkdir(resolve(PUBLISH_DIR, "bin"), { recursive: true });
  await copyFile(BIN_SRC, resolve(PUBLISH_DIR, "bin/pi-forge-zh.mjs"));
  await copyFile(POSTINSTALL_SRC, resolve(PUBLISH_DIR, "bin/fix-pty-perms.mjs"));

  // 5. Synthetic package.json
  // Hoist the server's runtime deps verbatim — the server is the only
  // thing the bin actually loads, and its package.json is the
  // authoritative dep list. If a dep is added there, it's automatically
  // picked up by the next publish; nothing manual to edit here.
  if (serverPkg.dependencies === undefined) {
    console.error("[build-publish-dir] packages/server/package.json has no dependencies field");
    process.exit(1);
  }
  const publishPkg = {
    name: "pi-forge-zh",
    version: rootPkg.version,
    description:
      "Browser UI for the pi coding agent with a Simplified Chinese interface — fork of pi-forge (upstream archived), embedded HTTP server with a React workbench (chat, file browser, terminal, git, MCP).",
    keywords: [
      "pi",
      "coding-agent",
      "ai",
      "llm",
      "agent",
      "workbench",
      "fastify",
      "i18n",
      "zh-CN",
      "chinese",
    ],
    homepage: "https://github.com/jisi71/pi-forge-zh#readme",
    bugs: { url: "https://github.com/jisi71/pi-forge-zh/issues" },
    repository: {
      type: "git",
      url: "git+https://github.com/jisi71/pi-forge-zh.git",
    },
    license: "MIT",
    // Upstream MIT copyright is retained in LICENSE; the fork author is added
    // here so the published metadata reflects both.
    author: "Devin Marks (pi-forge); jisi71 (pi-forge-zh fork)",
    type: "module",
    bin: { "pi-forge-zh": "bin/pi-forge-zh.mjs" },
    files: ["bin/", "dist/", "README.md", "LICENSE"],
    // Same node target as the server workspace + CI matrix.
    engines: { node: ">=20" },
    // node-pty's tarball ships `prebuilds/<platform>/spawn-helper`
    // without a reliable executable bit (the upstream postinstall
    // only fixes `build/Release/`, not `prebuilds/`). Without an
    // exec bit, every PTY spawn fails with `posix_spawnp failed.`
    // Our postinstall walks every prebuild and chmod +x's the
    // spawn-helper. Idempotent + failure-tolerant — see
    // bin/fix-pty-perms.mjs for the full story.
    scripts: { postinstall: "node bin/fix-pty-perms.mjs" },
    dependencies: serverPkg.dependencies,
    // `publishConfig.provenance: true` makes `npm publish` attach a
    // sigstore-signed provenance attestation tying this version to the
    // GitHub Actions run that produced it. Free with the trusted-
    // publisher OIDC flow we use in `.github/workflows/release.yml`.
    publishConfig: { access: "public", provenance: true },
  };
  await writeFile(resolve(PUBLISH_DIR, "package.json"), JSON.stringify(publishPkg, null, 2) + "\n");

  // 6. LICENSE + README
  await copyFile(resolve(REPO_ROOT, "LICENSE"), resolve(PUBLISH_DIR, "LICENSE"));
  await writeFile(resolve(PUBLISH_DIR, "README.md"), buildPublishReadme(rootPkg.version));

  // Friendly summary
  console.log(`[build-publish-dir] assembled publish/ for ${publishPkg.name}@${rootPkg.version}`);
  console.log(`  server dist: ${relativeFromRoot(SERVER_DIST)} → publish/dist/server/`);
  console.log(`  client dist: ${relativeFromRoot(CLIENT_DIST)} → publish/dist/client/`);
  console.log(`  bin: bin/pi-forge-zh.mjs → publish/bin/pi-forge-zh.mjs`);
  console.log(`  ${Object.keys(publishPkg.dependencies).length} runtime deps hoisted from server`);
  console.log(`Inspect with: cd publish && npm pack --dry-run`);
}

function relativeFromRoot(p) {
  return p.startsWith(REPO_ROOT) ? p.slice(REPO_ROOT.length + 1) : p;
}

function buildPublishReadme(version) {
  // npm only renders README.md, and the audience for this package is Chinese
  // speakers, so the published readme leads with Chinese and ends with a short
  // English summary. The in-repo README.zh-CN.md is the same material with more
  // screenshots and detail.
  return `# pi-forge-zh

**pi 编码代理的中文网页工作台。** 在浏览器里跟 AI 结对写代码：聊天、看文件、开终端、审 diff、连 Git —— 全在一个页面里，界面是简体中文。

> **这是社区 fork。** 上游 [pi-forge](https://github.com/Devin-Marks/pi-forge) 已于 2026-09-16 归档、不再维护。本包基于上游最后一个版本 (\`v1.5.4\`)，加上完整简体中文界面。当前版本 \`pi-forge-zh@${version}\`。上游 MIT 版权与许可原样保留（见 LICENSE）。

## 安装

\`\`\`bash
npx pi-forge-zh            # 一条命令试用

npm i -g pi-forge-zh       # 或全局安装
pi-forge-zh
\`\`\`

打开 <http://localhost:3000>，选一个工作目录就能用。（需要 Node ≥ 20。）

## 必须先配置模型

它只是界面，模型能力来自 pi —— 不配模型就只能看界面、聊不了。最省事的方式是在网页里配置：

**设置 → 提供商 → 添加密钥**（选提供商、粘 API Key、保存）

密钥写入 pi 的配置目录 \`~/.pi/agent/auth.json\`，界面只显示"已配置"，**永不回显密钥**。然后在 **设置 → 代理** 里选默认模型即可。

没配好时请求会被拒绝，错误码是 \`no_model_configured\`（没选模型）或 \`no_api_key\`（提供商缺密钥）。

## 中文界面

- 默认**跟随浏览器语言**（中文系统打开即中文）
- 强制指定：\`?lang=zh-CN\` / \`?lang=en\`（会被记住）
- 随时切换：**设置 → 外观 → 语言**（立即生效，不用刷新）

模型名、命令、文件路径、JSON 字段、协议名等技术标识**故意不翻译**，AI 的回复内容也不翻译（那是数据不是界面）。翻译有问题欢迎提 Issue。

## 常用配置

所有配置都可以写成 \`--参数\` 或环境变量（参数优先）。完整列表：\`pi-forge-zh --help\`。

| 参数 | 环境变量 | 默认值 | 作用 |
|---|---|---|---|
| \`--port\` | \`PORT\` | \`3000\` | 网页端口 |
| \`--host\` | \`HOST\` | \`127.0.0.1\` | 监听地址（局域网访问改成 \`0.0.0.0\`，**并务必设密码**） |
| \`--workspace-path\` | \`WORKSPACE_PATH\` | \`~/.pi-forge/workspace\` | 工作区根目录（项目建在它下面） |
| \`--pi-config-dir\` | \`PI_CONFIG_DIR\` | \`~/.pi/agent\` | pi 的配置与密钥目录 |
| \`--forge-data-dir\` | \`FORGE_DATA_DIR\` | \`~/.pi-forge\` | 本程序自己的数据（项目列表、缓存） |
| \`--app-name\` | \`APP_NAME\` | \`pi-forge\` | 界面显示的名字 |
| \`--ui-password\` | \`UI_PASSWORD\` | 未设置 | 设了就启用网页登录 |
| \`--api-key\` | \`API_KEY\` | 未设置 | 程序化调用用的 Bearer 令牌 |
| \`--minimal-ui\` | \`MINIMAL_UI\` | 关 | 精简界面，适合部署给非技术用户 |

\`--ui-password\`、\`--api-key\`、\`--jwt-secret\` 支持 \`@文件\` 写法（避免密钥进 shell 历史）。两个都没设时**不做任何鉴权** —— 只在本机自用时可以这样。

## 常见问题

**端口被占用** → \`pi-forge-zh --port 3100\`

**界面还是英文** → 打开 \`http://localhost:3000/?lang=zh-CN\`，或在 设置 → 外观 → 语言 里选「简体中文」

**终端报 \`posix_spawnp failed.\`** → node-pty 的执行权限问题，跑一次：
\`\`\`bash
node "$(npm root -g)/pi-forge-zh/bin/fix-pty-perms.mjs"
\`\`\`

**和官方英文版共存** → 两个包名不同，可同时装。默认数据目录相同（\`~/.pi-forge\`），要分开就显式指定：
\`\`\`bash
pi-forge-zh --port 3100 --forge-data-dir ~/.pi-forge-zh
\`\`\`

**数据在哪 / 怎么卸载**
数据在 \`--forge-data-dir\`（默认 \`~/.pi-forge\`）与工作区里的 \`.pi/sessions/\`；卸载 \`npm rm -g pi-forge-zh\` **不会删数据**。

## 这个 fork 改了什么

只改界面：i18n 代码全在 \`packages/client/src/i18n/\`（\`en\` + \`zh-CN\` 语言包、语言选择器、审计工具、测试），加上 42 个客户端文件把文案改成可翻译形式。服务端只有几行**显示用字符串**不同（命令名、启动日志、OpenAPI 标题、OTEL 服务名默认值）；服务端逻辑、接口、SSE 事件、数据格式、全部环境变量与命令行参数都与上游 \`v1.5.4\` 一致。

## 许可

MIT —— 见 [LICENSE](./LICENSE)。上游 \`pi-forge\` © 2026 Devin Marks 与 pi-forge 贡献者；简体中文本地化及本 fork 的改动以同一许可发布。

---

## For English readers

\`pi-forge-zh\` is a community fork of the archived
[pi-forge](https://github.com/Devin-Marks/pi-forge) — a self-hosted browser UI for the
[pi coding agent](https://github.com/earendil-works/pi) — adding a source-level i18n layer
with \`en\` and \`zh-CN\` locales. Install with \`npx pi-forge-zh\`; the UI follows your browser
language, and can be forced with \`?lang=en\`. Model ids, commands, paths, JSON keys and
protocol names are intentionally not translated. Everything else (server behaviour,
routes, SSE events, config, CLI flags) is unchanged from upstream \`v1.5.4\`. MIT; upstream
copyright retained. See the repository README for the English documentation.
`;
}


main().catch((err) => {
  console.error("[build-publish-dir] failed:", err);
  process.exit(1);
});
