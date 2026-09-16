# 验证方法

本地化只有「真的在浏览器里点一遍」才算验证过。这里记录四层验证，从便宜到贵。

## 第 1 层：键对齐（静态，秒级）

```bash
cd src && npm run i18n:audit          # 报告
npm run i18n:audit -- --strict        # 有缺口时非零退出
```

- `[gap]`：英文有、中文没有 → 运行时回退英文，属「可接受但要补」
- `[orphan]`：中文有、英文没有 → 上游删键，必须清理（**硬错误**）
- `[wiring]`：语言包文件与 `index.ts` 不一致（**硬错误**）
- `[literal]`：已迁移文件里疑似残留的英文界面文案（启发式，有误报）

`*.one` 复数键在中文里只写 `other`，审计脚本不会把它算作缺口。

## 第 2 层：类型检查（静态，10–30 秒）

```bash
cd src && npm run typecheck
```

关键点：`t()` 的键类型来自英文语言包。

- 组件里 `t("...")` 写错键名 → 报错
- 上游改了键名 → 调用点报错（升级时的主要发现手段）
- 中文包写了英文包里没有的键 → 报错

## 第 3 层：产物检查（构建后）

```bash
scripts/validate.sh --strict
```

包含：依赖零漂移、类型检查、i18n 审计、产物里同时存在中英字符串、
tarball 结构完整、预览 HTTP 探活、**正式数据目录 / `~/.pi/agent` /
3000 端口进程未被改动**。

## 第 4 层：真浏览器走查（最关键）

```bash
scripts/preview.sh
node tools/verify-ui.mjs --base http://127.0.0.1:3100 --lang zh-CN
node tools/verify-ui.mjs --base http://127.0.0.1:3100 --lang en
```

脚本用 Chromium 走遍：外壳与导航、项目管理（新建 / 选目录 / 克隆）、
会话列表与新建会话、输入框（含 `/` 命令面板）、右侧面板（文件 / 搜索 /
变更 / Git / 上下文 / 进程）、文件浏览与编辑器、终端、待办面板、
设置的全部 13 个标签页、全局搜索。

**定位方式与语言无关**：图标按钮按 lucide 图标类名定位，标签页按下标定位，
所以同一份脚本能同时跑中英两种语言。

每个界面产出：

- `build/verify/<lang>/NN-<name>.png` —— 截图（人工确认排版是否错位）
- `build/verify/<lang>/NN-<name>.txt` —— 可见文本（可 grep）
- `build/verify/<lang>/report.json` —— 每步是否成功

并自动做两件判断：

1. 该界面是否出现了非 ASCII 文本（即中文是否真的生效）；
2. `suspicious` —— 纯英文且不属于技术标识/品牌名的可见行，通常就是漏翻的
   文案。

### 怎么读报告

```
[zh-CN] settings-mcp  zh-present  suspicious=0
```

- `zh-present` 正常；`ALL-ASCII` 说明该面板整块没走到（或没翻译）
- `suspicious=0` 理想；有输出就逐条看，判断是漏翻还是误报

修正漏翻只需改 `src/packages/client/src/i18n/locales/zh-CN/<area>.ts`，
重新 `scripts/build.sh --fast` + `scripts/preview.sh`，再跑第 4 层。

### 升级专用：静态覆盖率预检（比 audit 更早一步）

rebase 完成、还没时间做浏览器走查时，先用这个脚本拿到「目标版本里有多少用户可见英文
尚未被语言包覆盖」：

```bash
npx tsx build/i18n-coverage.mts /path/to/upstream-1.5.4
```

它扫出目标树的字面量，再与 `locales/en/**` 的**值**集合做归一化比对（`{...}` 占位符
视为通配），输出「未覆盖文案 + 文件 + 行号」。v1.5.4 实测 22 条，其中 9 条是路径/命令等
技术串，**真正需要新翻译的只有 11 条**。

两个已知盲区（靠第 3/4 层兜底）：

- 多行 JSX 文本节点（脚本按行扫描）
- 由变量拼出来的文案（例如 `Install {appName} ...`）

### 工具自身的坑（踩过一次）

审计脚本原先只匹配 DOM 拼写 `aria-label=`，漏掉了本项目自有组件使用的 React 驼峰 prop
`ariaLabel=` —— 上游 v1.5.4 的 `ResizableDivider` 正好用的是后者
（`ariaLabel="Resize project sidebar"`），差点漏翻。现在 `COPY_ATTRIBUTES` 同时覆盖：

```
title | placeholder | aria-label | aria-description | alt
ariaLabel | ariaDescription | emptyHint | tooltip | hint
```

以后新增自定义的「带文案 prop」时，记得同步更新 `scripts/i18n-audit.mts` 的
`COPY_ATTRIBUTES`。

## 建议固化的回归基线

把每一版的 `build/verify/*/report.json`、`build/verify/*/*.txt`、
`build/i18n-audit.log`、`build/validate` 输出一起留存，下次升级直接对比
`suspicious` 行数与失败步骤数。
