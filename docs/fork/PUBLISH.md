# 打包与发布（`pi-forge-zh`）

上游 `pi-forge` 已归档，本 fork 自己发版。整条链路都在本仓库里，可重复执行。

## 〇、先确认 registry：镜像站不能发布

```bash
npm config get registry
```

如果是 `https://registry.npmmirror.com`（或其它国内镜像），**`npm publish` 会失败** ——
镜像是上游 npmjs 的只读副本，没有发布能力。镜像可以继续用于**安装**，但发布必须显式指定官方源：

```bash
npm login --registry=https://registry.npmjs.org/          # 首次
cd src/publish && npm publish --registry=https://registry.npmjs.org/
```

**关于 `--tag`：** 本 fork 的版本号都是 semver **预发布版**（`1.5.4-zh.1` 里的 `-zh.1`），
npm 默认拒绝发布预发布版，除非显式给 dist-tag。`publishConfig` 里已经声明了
`tag: "latest"`（这个包没有稳定线，预发布版就是 latest），所以上面这条命令**原样可用**；
如果哪天去掉那个字段，就得写成 `npm publish --tag latest ...`。

`publishConfig.provenance` 显式设为 `false`：provenance 只有在 GitHub Actions 里用 OIDC
发布才有意义，本地发布会静默跳过 —— 将来若给本 fork 加了 release workflow，再改回 `true`。

发布前建议先干跑一遍（不会真的发布）：

```bash
cd src/publish && npm publish --dry-run --registry=https://registry.npmjs.org/
```

（不要为了发布把全局 registry 改成官方源 —— 那会让日常安装变慢。用 `--registry=` 按次指定即可。）

发完之后，国内镜像通常几分钟内同步；在那之前 `npx pi-forge-zh` 可能还拉不到，
可以先用下面的 Release tarball 方式。

### 完全不依赖 registry 的分发方式（已实测）

把构建出的 tarball 挂到 GitHub Release，用户直接用 URL 安装：

```bash
gh release upload v1.5.4-zh.1 build/pi-forge-zh-1.5.4-zh.1.tgz --clobber
# 用户侧：
npm i -g https://github.com/jisi71/pi-forge-zh/releases/download/v1.5.4-zh.1/pi-forge-zh-1.5.4-zh.1.tgz
```

这条路径验证过：安装后 `pi-forge-zh --version`、启动、`GET /` 200、版本号都对。

## 一、发一版到 npm

```bash
cd src
npm ci                                # 按 lockfile 安装（保证 pi SDK 版本就是你测过的那个）
npm run check                         # tsc + eslint + prettier
npm run test:ci -- --skip agent-tool-sandbox,git,orchestration,session-export
                                      # ↑ 这 4 个是本机 macOS 上的既有失败，与代码无关
                                      #   见 docs/VERIFY.md「服务端测试套件」
npm run build
node scripts/build-publish-dir.mjs    # 生成 publish/（扁平单包布局）
cd publish
npm publish                           # 首次需 npm login；包名 pi-forge-zh 未被占用
```

`npm publish` 时可加 `--tag next` 先发预览版；正式版不加参数即打 `latest`。

### 为什么用 `publish/` 这一层

`publish/` 是**扁平单包**产物：`bin/` + `dist/`（server + client）+ `package.json` +
`LICENSE` + 生成的 README。它由 `scripts/build-publish-dir.mjs` 合成 ——
package.json 里的 `dependencies` 直接从 `packages/server/package.json` 里**原样提升**，
所以不会有人手维护的依赖清单漂移。安装后的目录形状与 `npm i -g pi-forge-zh` 完全一致。

版本号取自 `src/package.json`；`1.5.4-zh.1` 的读法是「上游 `v1.5.4` 的第 1 个 fork 版本」。

### 构建标记

`scripts/build.sh` 会在 `publish/dist/i18n-build.json` 里写入：

```json
{
  "baseVersion": "1.5.4-zh.1",     // 本次构建的版本（= src/package.json）
  "upstreamTag": "v1.5.4",         // 基于哪个上游 tag
  "branch": "feat/i18n-zh-cn",
  "commit": "…",                   // 精确到提交
  "locales": ["en", "zh-CN"],
  "builtAt": "…"
}
```

`scripts/validate.sh` 会拿它和 `src/package.json`、`$ZH_BASE_TAG` 对账 ——
**「部署的到底是哪个提交」永远可回答**，这是上一次升级踩出来的检查。

## 二、本机安装/切换（不走 npm）

```bash
scripts/build.sh --fast          # 构建 + 打 tarball 到 build/
scripts/preview.sh               # 装进 build/preview-install 并在 :3100 起预览
node tools/verify-ui.mjs --base http://127.0.0.1:3100 --lang zh-CN   # 41 步走查
scripts/validate.sh --strict     # 上线前门禁
scripts/install-zh.sh --yes      # 装到全局并把 :3000 切过来
scripts/rollback.sh --yes        # 切回上游 pi-forge
```

## 三、跟进上游 / 跟进 pi SDK

上游冻结了，所以「合并上游提交」这件事基本不会再有。剩下的是**跟进 pi SDK**：
本 fork 锁 `0.84.3`，npm 上最新是 `0.85.1`。

```bash
cd src
# 改 packages/server/package.json 里三个 @earendil-works/pi-* 为同一版本
npm install
npm run check && npm run build
npm run test:ci -- --skip agent-tool-sandbox,git,orchestration,session-export
npm run i18n:audit
scripts/build.sh --fast && scripts/preview.sh
# 预览里真的聊一句（要花钱，但 SDK 升级只有真跑才验得出来）
scripts/install-zh.sh --yes
```

注意 `@earendil-works/pi-*` 三个包必须**同版本**，且 `docs/VERIFY.md` 里的浏览器走查
覆盖不到 SDK 行为 —— SDK 升级属于「必须真跑一次对话」的改动。

## 已知的发布后现象（无害）

`npx pi-forge-zh` 会在安装时打印一条（上游继承来的）传递依赖弃用警告：

```
npm warn deprecated uuid@8.3.2: uuid@10 and below is no longer supported...
```

它来自上游的依赖树（`exceljs` 一带），不影响功能；上游已归档，要消掉需要自己在
`overrides` 里指定 `uuid` 版本，属于可选清理，不值得为它单独发版。

## 四、发布前检查清单

- [ ] `npm run check` 全绿（允许上游自带的 2 条 react-refresh warning）
- [ ] `npm run build` 通过
- [ ] 测试套件通过（除了那 4 个 macOS 既有失败）
- [ ] `npm run i18n:audit -- --strict` 无缺口/孤儿/残留文案
- [ ] `scripts/validate.sh --strict` 全绿
- [ ] `node tools/verify-ui.mjs --lang zh-CN` 与 `--lang en` 都是 41/41
- [ ] 版本号已按 `X.Y.Z-zh.N` 递增
- [ ] `CHANGELOG.md` 加了对应条目
- [ ] 依赖集合没有意外漂移（`validate.sh` 第 1 项会自动比）
