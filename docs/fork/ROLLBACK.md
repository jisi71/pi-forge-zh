# 回退方案

`pi-forge-zh` 和上游 `pi-forge` 是**两个独立的全局 npm 包**，所以回退就是「停服务 → 确认上游包是原样 → 用上游命令重启服务」。本机现在两个都装着：

```
~/.nvm/versions/node/v24.14.1/lib/node_modules/
├── pi-forge-zh    1.5.4-zh.1   ← 本 fork（:3000 正在跑）
└── pi-forge       1.4.6        ← 上游原样（保留作退路，未被改动）
```

## A. 只关预览

```bash
scripts/preview-stop.sh
```

## B. 把 :3000 切回上游

```bash
scripts/rollback.sh --yes
```

做四件事：

1. 停掉 :3000；
2. `ensure_pristine_upstream`：确认 `pi-forge` 是**真正的上游构建**（版本 = `1.4.6` 且客户端产物里没有中文字符串）。若之前被覆盖过，就从 `backup/pi-forge-1.4.6-upstream.tgz` 还原（那是首次切换前 `npm pack` 出来的原样副本，**离线可用**）；没有备份则从 npm 装 `pi-forge@1.4.6`；
3. 确认还原后的产物里已不含中文字符串；
4. 用与之前**完全相同**的参数把服务以 `pi-forge` 重启（`--host 127.0.0.1 --port 3000 --forge-data-dir …/data --workspace-path …/workspace`），并做 200 探活。

`pi-forge-zh` 仍然装着，所以随时可以 `scripts/install-zh.sh --yes` 切回来。

数据目录、工作区、`~/.pi/agent` 全程不变，会话与项目记录不会丢。

## C. 只回退源码改动（不重新构建）

```bash
cd src
git log --oneline                 # 看提交
git checkout v1.5.4                # 回到上游 tag（detached）
# 或针对单个文件：git checkout v1.5.4 -- packages/server/src/cli.ts
```

`src/` 是独立检出，`git checkout` 不影响正在运行的服务；要生效仍需 `scripts/build.sh` + `scripts/install-zh.sh --yes`。

分支名与用途：

| 分支 | 内容 |
|---|---|
| `feat/i18n-zh-cn`（当前） | 全部工作：3 个 i18n 提交 + 1 个 rebrand 提交 |
| `backup/pre-restructure-v1.5.4` | 提交重构前的 5 提交版本（中间态备份） |
| `zh-cn-backup-pre-v1.5.4` | rebase 到 v1.5.4 之前的 1.4.6 中文版 |
| `i18n-screenshots` | PR 正文用的截图（可删） |

## D. 完全卸载

```bash
npm rm -g pi-forge-zh        # 只删 fork
npm rm -g pi-forge           # 连上游也删掉
rm -rf ~/.pi-forge           # 数据（projects.json / caches / jwt-secret）—— 慎用
```

## 什么时候需要回退

| 症状 | 处理 |
|---|---|
| 页面白屏 / 渲染崩溃 | B（先回退保可用），再在 3100 排查（看 `build/preview.log` 与控制台） |
| 某个面板文案错乱、按钮错位 | 不用回退：改 `locales/zh-CN/*.ts` → `scripts/build.sh` → 预览确认 → 切换 |
| 终端 / PTY 不可用 | 先跑上游自带的 `node bin/fix-pty-perms.mjs`（node-pty 的 exec 位问题） |
| 想让 :3000 恢复英文 | B；或者只切语言：`http://127.0.0.1:3000/?lang=en`（或设置 → 外观 → 语言） |

## 快速自检

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/      # 期望 200
curl -s http://127.0.0.1:3000/api/v1/ui-config \
  | python3 -c 'import json,sys;print("版本:", json.load(sys.stdin)["version"])'
#   1.5.4-zh.1 → 正在跑 fork；1.4.6 / 1.5.4 → 正在跑上游

scripts/live-service.sh status          # 看进程与启动参数
npm ls -g --depth=0 | grep pi-forge     # 看两个包各自的版本
```
