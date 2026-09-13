/**
 * 简体中文 — chatView 区域文案。
 *
 * 英文原文见 `../en/chatView.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 工具名（read / bash / edit ...）、模型 id、路径、差异内容以及来自
 * 代理或用户的一切文本都保持原样，不在这里翻译。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const chatView: DeepPartial<EnMessages["chatView"]> = {
  // 工具栏 -------------------------------------------------------------
  toolbar: {
    export: "导出",
    exportTitle: "导出此会话",
    exportMarkdown: "Markdown",
    exportRawJsonl: "原始 JSONL",
    exportFailed: "导出失败：{error}",
    tree: "会话树",
    treeTitle: "打开会话树（可从任意历史节点跳转 / 分叉）",
    orch: "协作",
    orchTitle: "协作面板 — 主管 / 工作代理控制",
  },

  // 横幅 / 空状态 ------------------------------------------------------
  banner: {
    dismiss: "关闭此提示",
  },
  extensionNotification: {
    levelLabel: "扩展 {level}",
    dismiss: "关闭扩展通知",
  },
  empty: {
    noMessages: "还没有消息。发送一条提示词即可开始。",
  },
  streaming: {
    label: "助手（流式输出）",
  },
  unknownMessage: {
    summary: "未知消息（{type}）",
  },
  message: {
    attachmentFallback: "附件",
  },

  // 角色与复制 ---------------------------------------------------------
  role: {
    you: "你",
    assistant: "助手",
  },
  copy: {
    messageText: "复制消息文本",
    assistantText: "复制此助手消息的全部文本",
  },

  // 排队中的引导 / 后续消息 ---------------------------------------------
  queued: {
    title: "已排队（{count}）",
    steer: "引导",
    followUp: "后续",
    steerTitle: "在代理的下一个决策点投递（通常位于工具调用中途）",
    followUpTitle: "在代理完全空闲后投递",
  },

  // 进行中的占位提示 ---------------------------------------------------
  activeTool: {
    thinking: "思考中",
    thinkingAria: "代理正在思考",
    running: "正在运行",
  },
  toolCallGeneration: {
    label: "正在生成工具调用",
    aria: "代理正在生成工具调用",
  },

  // 对话内的 edit 差异 -------------------------------------------------
  chatEditDiff: {
    copy: "复制 edit 输出",
    toUnified: "将对话中的差异切换为统一视图",
    toSplit: "将对话中的差异切换为并排视图",
  },

  // 文件引用徽标 -------------------------------------------------------
  fileRef: {
    inlineTitle: "{path} — 点击{action}",
    deferTitle: "{path} — 模型将按需使用 read 工具加载（文件大于内联阈值）",
    onDemand: "按需加载",
  },

  // 生命周期 / 状态通知 -------------------------------------------------
  lifecycle: {
    process: {
      completed: "进程已完成：{name}",
      failed: "进程失败：{name}",
      killed: "进程已终止：{name}",
      watchMatched: "进程监视命中：{name}",
      update: "进程更新：{name}",
      fallback: "进程",
    },
    worker: {
      completed: "工作代理已完成：{id}",
      failed: "工作代理失败：{id}",
      removed: "工作代理已移除：{id}",
      needsInput: "工作代理需要输入：{id}",
      update: "工作代理更新：{id}",
      fallback: "工作代理",
    },
  },

  // 助手消息的界面元素 -------------------------------------------------
  providerError: "提供商错误：",
  thinkingSummary: "思考中…",
  blockSummary: "区块（{type}）",
  errorBadge: "错误",

  // 批量工具调用 -------------------------------------------------------
  toolBatch: {
    childFailures: { other: "{count} 个子调用失败" },
    label: "工具",
    callCount: { other: "{count} 次调用" },
    inFlight: "{count} 个运行中…",
    childFailuresTitle: "有一个或多个子工具调用失败；展开该批处理即可看到失败的调用。",
  },

  // 单个工具调用 -------------------------------------------------------
  toolCall: {
    running: "运行中…",
    input: "输入",
    output: "输出",
    empty: "（空）",
    copyInput: "复制 {name} 输入",
    copyOutput: "复制 {name} 输出",
  },

  // 独立的工具结果 -----------------------------------------------------
  toolResult: {
    bashOutput: "bash 输出",
    copyRead: "复制 read 输出",
    copyBash: "复制 bash 输出",
    copyWrite: "复制 write 输出",
    copyGeneric: "复制 {name} 输出",
  },

  // 子代理卡片 ---------------------------------------------------------
  subagent: {
    running: "子代理运行中…",
    summaryAction: "操作：{action}",
    summaryParallelTasks: { other: "{count} 个并行任务" },
    summaryChain: "{count} 步链路",
    headlineSingle: "子代理：{agent}",
    headlineMultiple: "{count} 个子代理（{mode}）",
    headlineManagement: "子代理管理",
    contextFork: "继承父级上下文",
    contextFresh: "全新上下文",
    openTitle: "打开子代理会话 — {path}",
    copyInput: "复制子代理输入",
    copyOutput: "复制子代理输出",
  },
  subagentNotify: {
    label: "子代理",
    fallback: "后台子代理更新",
  },

  // bash 执行卡片 ------------------------------------------------------
  bashExecution: {
    localOnly: "仅本地",
    localOnlyTitle: "!! 前缀 — 下一轮不会进入 LLM 上下文",
    timedOut: "已超时",
    truncated: "已截断",
    exitZeroTitle: "退出码 0",
  },
  exitCode: "退出码 {code}",

  // 渲染 / 原文切换 ----------------------------------------------------
  rawToggle: {
    rendered: "渲染",
    raw: "原文",
    showRendered: "显示渲染后的 Markdown",
    showRaw: "显示原始文本",
  },

  // DiffBlock ---------------------------------------------------------
  diffBlock: {
    applyHunk: "应用此片段",
    hunkLabel: "片段 {number}",
    largeDiffTitle:
      "当前渲染 {total} 行中的约 {shown} 行 — 大型差异会拖慢渲染，点击可渲染其余部分。",
    showAll: "显示全部（{lines} 行，{hunks} 个片段）",
  },

  // ChatMarkdown ------------------------------------------------------
  markdown: {
    copyCode: "复制代码块",
  },

  // CompactionCard ----------------------------------------------------
  compaction: {
    collapse: "折叠",
    collapseTitle: "折叠已归档消息",
    collapseAriaTop: "折叠顶部的上下文压缩摘要",
    collapseAriaBottom: "折叠底部的上下文压缩摘要",
    hideTitle: "隐藏已归档消息",
    expandTitle: { other: "展开 {count} 条已归档消息" },
    fallbackTitle: "上下文压缩",
    meta: "{messages} 条消息 · {tokens} tok · {time}",
  },

  // TurnDiffPanel -----------------------------------------------------
  turnDiff: {
    pickSession: "选择一个会话以查看其文件变更。",
    lastTurn: "最近一轮",
    toUnified: "切换为统一视图",
    toSplit: "切换为并排视图",
    refresh: "刷新差异",
    errorLoad: "无法加载最近一轮的差异（见上方提示）。",
    empty: "最近一轮没有文件变更。",
    newFile: "新增",
  },

  // AskUserQuestionPanel ----------------------------------------------
  question: {
    header: "代理提问",
    progress: "第 {current} / {total} 题",
    chatAboutThis: "在对话中讨论",
    chatAboutThisTitle: "放弃结构化问卷，改用自由对话回复",
    submitting: "正在提交…",
    noPreview: "该选项没有预览。",
    typeSomething: "输入自定义内容",
    customPlaceholder: "或直接输入你的回答…",
  },
};
