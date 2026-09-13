/**
 * 简体中文 — terminal 区域文案。
 *
 * 英文原文见 `../en/terminal.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 保留原文不译：shell 与托管进程自身输出的内容、`PID`、
 * `stdout` / `stderr` 流名称、WebSocket 关闭码，以及 `ms` / `s` / `m` / `h`
 * 运行时长后缀。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const terminal: DeepPartial<EnMessages["terminal"]> = {
  panel: {
    selectProject: "请先选择一个项目，再打开终端。",
    noTerminals: "暂无打开的终端。",
    closeTabTooltip: "关闭终端（会终止对应的 PTY）",
    newTabTooltip: "新建终端",
    newTab: "新建",
    newTabHint: "点击“新建”，即可在 {path} 中打开终端。",
  },

  notices: {
    closed: "[连接已关闭：{code}]",
    closedAuth: "[连接已关闭（4401）：登录状态已过期 — 请重新登录后刷新页面]",
    closedProjectGone: "[连接已关闭（4404）：项目已不存在]",
    reconnecting: "[连接已断开（{code}）— {seconds} 秒后重连，第 {attempt} 次尝试]",
  },

  processes: {
    title: "进程",
    counts: "{running} 个运行中 · {finished} 个已结束",
    clearFinished: "清除已结束",
    clearFinishedTooltip: "从列表中移除所有已结束的进程（运行中的进程会保留）",
    watchMore: { other: "另有 {count} 条监听匹配" },
    clearWatchAlerts: "清除监听提醒",
    empty: "暂无后台进程。当代理启动开发服务器、测试监听、构建等任务时，相关进程会显示在这里。",
    groupFinished: "已结束",
    footer: "仅保存在内存中 — 服务器重启后进程不会保留。",
    exitCode: "退出码 {code}",
    kill: "终止",
    killFailed: "终止失败",
    stdoutTail: "stdout（末尾）",
    stderrTail: "stderr（末尾）",
    fullLog: "完整 {stream} 日志",
    loadingLog: "加载中…",
    popupBlocked: "弹出窗口被拦截 — 请允许本站弹出窗口",
    status: {
      running: "运行中",
      terminating: "正在终止",
      killed: "已终止",
      exitedZero: "已退出（退出码 0）",
      exitedNonZero: "已退出（退出码非 0）",
    },
  },
};
