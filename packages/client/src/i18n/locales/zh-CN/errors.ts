/**
 * errors — 简体中文文案。
 *
 * 英文原文见 `../en/errors.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 插值内容（错误码、服务端或 SDK 返回的原始 message、路径、HTTP 状态文本）
 * 一律原样保留，不做翻译。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const errors: DeepPartial<EnMessages["errors"]> = {
  session: {
    readOnlyExternal: "只读：pi-subagents 子代理正在由外部以 {state} 状态运行",
    readOnlySnapshotFailed: "只读快照加载失败：{code}",
    reconnecting: "正在重连（第 {attempt} 次，{seconds} 秒后）—— {reason}",
    streamError: "流式连接错误：{code}",
    promptRejected: "提示词被拒绝：{code}",
    promptRejectedWithMessage: "提示词被拒绝：{code} —— {message}",
    promptRejectedMessage: "提示词被拒绝：{message}",
    agentError: "代理错误：{message}",
    refreshAfterAgentFailed: "代理结束后无法刷新消息 —— 请重新加载以同步",
    compacting: "正在压缩上下文…",
    retrying: "正在重试（{attempt}/{max}）…",
  },

  file: {
    binaryFile: "二进制文件 —— 请在外部打开并编辑。",
  },

  terminal: {
    tabLabel: "终端 {index}",
  },

  api: {
    nonJsonErrorBody: "响应体不是 JSON（HTTP {status}）",
    nonJsonSuccessBody: "服务端返回了非 JSON 的 2xx 响应体",
  },

  sse: {
    serverClosedStream: "服务端关闭了连接",
  },

  crash: {
    title: "{brand}：渲染崩溃",
    noStack: "（无调用栈）",
    tip: "提示：更多细节请查看浏览器控制台。如果错误提示状态数据过期，可尝试清除 localStorage（开发者工具 → Application → Local Storage → Clear）后刷新页面。",
  },
};
