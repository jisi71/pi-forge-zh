# 上游升级流程

目标：上游发布新版（例如 `v1.4.7`）时，用最小人工成本把中文构建更新到新版本，
**先在预览端口验证，确认后才替换正式服务**。

## 为什么冲突可控

本地化改动集中在两类文件：

1. `packages/client/src/i18n/**` —— 纯新增，上游不会碰，永不冲突。
2. 各组件里「英文文案 → `t("...")`」的那一行 —— 只有上游**同时改到同一行**
   才会冲突。

所以升级成本 ≈ 上游新增/改动的文案数量，而不是整个项目规模。

## 前置条件：必须是**完整** git 历史（踩过一次坑）

```bash
cd ~/Documents/Codex/pi-forge-zh/src
git rev-parse --is-shallow-repository     # 必须是 false
```

如果当初是 `git clone --depth 1` 拉下来的，**必须先补全历史**：

```bash
git fetch --unshallow origin
```

原因：浅克隆里 `git merge-base <新tag> <我们的分支>` 找不到共同祖先，`git rebase` 会把整个
旧版本的树当成「新增内容」重放一遍，于是几乎所有文件都「冲突」。实测对比：

| 仓库状态 | rebase 到 v1.5.4 的冲突 |
|---|---|
| 浅克隆（`--depth 1`） | **114 个文件 / 940 块** ← 完全是假象 |
| 完整历史（`--unshallow` 后） | **10 个文件 / 33 块**，全在客户端；服务端/测试/文档 0 冲突 |

看到「上百个文件冲突、连没改过的 docker/kubernetes 都冲突」就应该先怀疑这一点，
而不是开始手工解冲突。

## 步骤

```bash
# 0. 前提：工作区干净（先把翻译改动提交到 zh-cn 分支）
cd ~/Documents/Codex/pi-forge-zh/src && git status

# 1. 拉取新 tag，rebase，构建，起预览
cd ~/Documents/Codex/pi-forge-zh
git -C src fetch --tags origin
scripts/upgrade.sh v1.5.4
```

`upgrade.sh` 第 1 步会建立 `zh-cn-backup-pre-<tag>` 备份分支（已存在则保留、不覆盖），
这是升级失败时的回退锚点：

```bash
git -C src reset --hard zh-cn-backup-pre-v1.5.4    # 回到升级前
```

脚本会：备份当前分支 → rebase 到新 tag → `npm ci` → 类型检查 → i18n 审计 →
构建打包 → 在 3100 端口起预览。

### 若有 rebase 冲突

冲突文件必然是「上游改过、我们也改过」的组件。处理原则：

- 保留**上游的新逻辑/结构**；
- 把被改动段落里的英文字面量重新包成 `t("...")`；
- 不要恢复我们版本的旧逻辑。

```bash
cd src
git status                     # 看冲突文件
$EDITOR <冲突文件>
git add <冲突文件>
git rebase --continue
cd .. && scripts/upgrade.sh v1.4.7    # 重新走一遍类型检查/审计/构建
```

放弃：`git -C src rebase --abort`、或 `git -C src reset --hard zh-cn-backup-pre-v1.4.7`。

### 类型检查会告诉你缺哪些键

`t()` 的键类型来自英文语言包，所以上游**重命名或删除**文案键时，
`tsc` 会在调用点直接报错。三种处理方式：

| 情况 | 处理 |
|---|---|
| 上游改了英文原文 | 同步改 `locales/en/<area>.ts`，中文键不变 |
| 上游新增文案 | 在 `locales/en/<area>.ts` 加键并用 `t()` 引用；再加中文（可留空，回退英文） |
| 上游删除文案 | 从 `locales/en` 与 `locales/zh-CN` 同时删键（审计会报 orphan） |

### 两类「字符串没变但必须改」的坑（只有 rebase 后才会暴露）

字符串 diff 看不出这两类问题，必须靠 rebase + 类型检查 + 审计：

1. **文案被变量化**。上游 v1.5.4 引入「可配置品牌」，把原本写死的 `pi-forge` 换成
   `appName`：

   ```diff
   - Install pi-forge as an app for a fullscreen experience.
   + Install {appName} as an app for a fullscreen experience.       // t(..., { appName })
   - <h1>pi-forge: render crash</h1>
   + <h1>{(document.title || "pi-forge") + ": render crash"}</h1>    // t("errors.crash.title", { brand })
   ```

   处理原则：**保留上游的结构，把值做成 `{placeholder}`**；而 `appName` / 品牌名
   **本身绝不能翻译**（那是运维配置的值）。
   `errors.crash.title` 已从固定串改成 `"{brand}: render crash"` / `"{brand}：渲染崩溃"`。

2. **枚举/联合类型新增成员**。上游新增了 `high-contrast` 主题，于是 `SettingsPanel` 里
   `Record<ThemeId, TranslateKey>` 形状的标签表会**编译失败**，直到两个语言包都补上
   `settings.appearance.themes.high-contrast`。这是设计使然 —— 编译期拦住，
   而不是运行时少一个标签。

### 审计会告诉你缺哪些翻译

```bash
npm run i18n:audit          # 报告
npm run i18n:audit -- --strict   # 有缺口时非零退出
```

输出含义：

- `[gap]` 英文有、中文没有的键 → 需要补翻译（不补也能跑，只是显示英文）
- `[orphan]` 中文有、英文没有的键 → 上游删了键，中文包要同步删除
- `[wiring]` 语言包文件与 `index.ts` 接线不一致
- `[literal]` 已迁移文件里残留的英文界面文案（启发式，含少量误报）

补翻译时只改 `locales/zh-CN/<area>.ts`，不用动组件。

### 验证与切换

```bash
# 运行时验证：走遍所有面板 + 截图 + 检测残留英文
node tools/verify-ui.mjs --base http://127.0.0.1:3100 --lang zh-CN
node tools/verify-ui.mjs --base http://127.0.0.1:3100 --lang en

# 上线前校验（含正式数据/进程未被改动）
scripts/validate.sh --strict

# 用户确认预览后
scripts/install-zh.sh --yes
```

`install-zh.sh` 会先把**当前正式安装包** `npm pack` 到 `backup/`，因此从坏升级
回退到「升级前的正式版本」也是离线可用的：`scripts/rollback.sh --yes`。

## 实战记录：v1.4.6 → v1.5.4（2026-09-13）

第一次真正跑完这套流程，数据留档：

| 项目 | 实测 |
|---|---|
| 上游跨度 | 41 个提交，客户端 35 个文件、+2004/−289 行；pi SDK `0.79.10` → `0.84.3` |
| rebase 冲突 | **10 个文件 / 33 块 / 406 行**，全在客户端；服务端、测试、文档、docker、CI **0 冲突** |
| 需要新翻译的文案 | **11 条**（`i18n-coverage` 静态预检报 22 条，其中 9 条是路径/命令等技术串） |
| 需要改结构的文案 | 3 处：`appName` 品牌变量化（InstallPrompt / ChangePassword / 设置里的品牌名）、崩溃页标题 `${document.title}: render crash`、`high-contrast` 新主题 |
| 补译后 | en/zh 各 1533 键，0 缺口 / 0 孤儿 / 0 残留文案 |
| 解冲突耗时 | 3 个并行代理，约 4 分钟（33 块） |
| 最终 review 面 | 81 个文件、+8133/−1577（相对 v1.5.4） |

解冲突的方法（可复用）：冲突两侧固定是「HEAD = 上游新代码」vs「我们 = 同一段
代码 + `t()`」，所以规则很机械 —— **取上游的结构，把 `t()` 重新套回去**；遇到
字符串被变量化时改成 `{placeholder}`。派 3 个代理并行解，父级用 `tsc` + `i18n:audit`
收口。

### 这次踩到的 4 个坑（都已修）

1. **浅克隆造成假冲突**：见上文「前置条件」。940 块 → 33 块。
2. **预览跑 `publish/` 目录不可靠**：monorepo 里版本冲突的依赖会被 npm 嵌套到
   `packages/server/node_modules/`，不在 `publish/dist/server/index.js` 的解析路径上
   → `ERR_MODULE_NOT_FOUND`。1.5.4 的 `@fastify/static@10` 正好触发。
   现在 `preview.sh` 先把 tarball 装进 `build/preview-install/` 再运行，
   等价于 `npm i -g`。
3. **审计脚本的两个盲区**：只认 DOM 拼写 `aria-label=`、只按行扫描。于是
   `ariaLabel="Resize project sidebar"` 和 Prettier 折行的 OTEL 提示都漏了。
   现在改成整文件扫描 + `COPY_ATTRIBUTES` 覆盖驼峰 prop + 模板字符串句子检测。
4. **构建标记用错变量**：`build.sh` 原先写 `$UPSTREAM_VERSION`（= 已安装的
   1.4.6）。分支 rebase 到 1.5.4 后该变量在 env.sh 里已改名，`set -u` 直接让
   heredoc 失败、产出 0 字节标记。现在版本取自**被构建的源码树**，
   校验脚本也会拿标记和基线 tag 对账。

### 校验脚本的基线也跟着变了

`validate.sh` 第 1 项不再拿「已安装的全局包」当基准（它可能合法地更旧），
改为对 `$ZH_BASE_TAG`（现在 `v1.5.4`）比较，并新增一条更强的约束：

```
git diff v1.5.4 HEAD -- packages/server tests docker kubernetes .github   == 0 个文件
```

即**汉化分支只允许碰客户端 + i18n 工具**。这条一旦报错，就说明分支里混进了
功能性改动，必须人工细看。

## 每次升级后建议固化的检查

1. `npm run typecheck` 全绿
2. `npm run i18n:audit -- --strict` 无 `[orphan]` / `[wiring]`
3. `node tools/verify-ui.mjs --lang zh-CN` 所有步骤 `ok`，且各面板
   `suspicious` 行数不高于上一版本
4. `node tools/verify-ui.mjs --lang en` 同样全绿（英文界面不能回归）
5. `scripts/validate.sh --strict` 全绿
6. 把升级前后的 `build/verify/*/report.json` 与 `build/i18n-audit.log` 一起留存
