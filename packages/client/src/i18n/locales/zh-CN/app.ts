/**
 * 简体中文 — app 区域文案。
 *
 * 英文原文见 `../en/app.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const app: DeepPartial<EnMessages["app"]> = {
  nav: {
    openSidebar: "打开项目侧边栏",
    resizeSidebar: "调整项目侧栏宽度",
    closeSidebar: "关闭项目侧边栏",
    settingsTooltip: "设置（提供商、代理默认值、MCP、技能）",
  },

  // 服务端开启 OTEL 内容捕获时显示的红字警示
  telemetry: {
    badge: "OTEL 内容捕获已开启",
    badgeTitle: "OTEL_CAPTURE_CONTENT 已开启：消息与工具内容可能被导出到遥测数据中。",
  },

  panes: {
    chat: "对话",
    editor: "编辑器",
    toggleChat: "显示或隐藏对话面板",
    toggleEditor: "显示或隐藏编辑器面板（已打开的标签页在刷新后仍会保留）",
    toggleFiles: "显示或隐藏文件浏览树",
    toggleTerminal: "显示或隐藏集成终端",
  },

  tabs: {
    git: "Git",
    lastTurn: "上一轮",
  },

  empty: {
    newProject: "+ 新建项目",
    pickSession: "从侧边栏选择一个会话，或在此新建一个。",
    newSession: "+ 新建会话",
    selectProject: "请从侧边栏选择一个项目。",
  },

  installPrompt: {
    banner: "将 {appName} 安装为应用，获得全屏体验。",
    iosPrefix: "安装：点按 ",
    iosMiddle: " 分享，然后 ",
    addToHomeScreen: "添加到主屏幕",
    iosSuffix: "。",
    dismissAria: "关闭安装提示",
  },

  changedFiles: {
    tooltip: "打开“上一轮”面板，查看代理刚刚写入的内容",
    edited: { other: "{count} 个文件已修改" },
    review: "— 查看",
  },

  mcpBadge: {
    off: "MCP 已关闭",
    status: "MCP {connected}/{total}",
    offTooltip: "MCP 工具已禁用。点击打开 设置 → MCP。",
    connectedTooltip: { other: "{connected}/{total} 个 MCP 服务端已连接。点击打开 设置 → MCP。" },
  },
};
