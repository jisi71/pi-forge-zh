/**
 * 简体中文 — orchestration 区域文案。
 *
 * 英文原文见 `../en/orchestration.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 会话 id、模型与提供商 id、工具名、子代理输出、待办条目正文一律保持原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const orchestration: DeepPartial<EnMessages["orchestration"]> = {
  panel: {
    title: "协作",
    roles: {
      supervisor: "主管",
      worker: "工作会话",
      standalone: "独立会话",
    },
  },

  standalone: {
    descriptionPrefix: "当前会话处于独立模式。启用主管模式后，该会话将获得 ",
    descriptionSuffix: " 工具，可以创建、观察并协调同一项目中的其他工作会话。",
    enabling: "正在启用…",
    enable: "启用主管模式",
    toolListRefreshed: "代理的工具列表会立即刷新，无需重新加载。",
  },

  supervisor: {
    disableConfirm: "停用主管模式？已关联的工作会话将变为独立会话。",
    killConfirm: "终止工作会话 {id}？（记录仍保留在磁盘上。）",
    clearInboxConfirm: "清空工作会话事件历史？",
    workerCount: { other: "{count} 个工作会话" },
    disable: "停用主管模式",
    emptyPrefix: "暂无工作会话。代理可以通过 ",
    emptySuffix: " 创建一个。",
    messageCount: "（{count} 条消息）",
    resume: "恢复",
    detach: "解除关联",
    detachTooltip: "解除关联（该工作会话继续作为独立会话运行）",
    kill: "终止",
    killTooltip: "终止（释放运行中的会话，记录仍保留在磁盘上）",
    eventHistory: "工作会话事件历史（{count}）",
    noEvents: "暂无工作会话事件。",
    clearHistory: "清空事件历史",
  },

  inbox: {
    ended: "已结束",
    asked: "提问",
    retryFailed: "重试失败",
    process: "进程",
    deleted: "已删除",
    detached: "已解除关联",
  },

  workerState: {
    streaming: "流式输出中",
    idle: "空闲",
    cold: "已休眠",
  },

  worker: {
    ownedBySupervisor: "所属主管会话",
    handoffWithSummary: "（附带上下文摘要的交接）",
  },

  todos: {
    title: "待办",
    inProgressSuffix: " · {count} 项进行中",
    hideTooltip: "隐藏待办面板",
    loadFailed: "加载待办失败：{message}",
    empty: "暂无待办。代理规划多步任务时会在这里添加任务。",
    groups: {
      inProgress: "进行中",
      pending: "待处理",
      completed: "已完成",
    },
    blockedBy: "阻塞于：",
    owner: "负责人：",
    status: {
      pending: "待处理",
      inProgress: "进行中",
      completed: "已完成",
      deleted: "已删除",
    },
  },

  context: {
    selectSession: "请选择一个会话以查看其上下文。",
    title: "上下文检查器",
    noData: "暂无数据——试试刷新。",
    rawTitle: "消息 {index} — AgentMessage 原始 JSON",
    usageEstimate: "估算",
    usageCurrent: "当前",
    contextWindow: "上下文窗口（{label}）",
    lastTurn: "最近一轮",
    lastTurnTooltip:
      "新增 = 上一轮助手回复以来的用户消息 + 工具结果（估算值）。输出 = 助手生成的 Token。费用 = 该轮的计费金额。",
    lastTurnFormula: "约 {newTokens} 新增 · {outTokens} 输出 · {cost}",
    inputLifetime: "输入（累计）",
    inputLifetimeTooltip:
      "各轮 `usage.input` 之和——LLM 本次会话看到的“新增、未命中缓存”的输入，不含缓存部分（缓存单独列在下方）。",
    cacheServedLifetime: "缓存读取（累计）",
    cacheServedLifetimeTooltip:
      "各轮 `usage.cacheRead` 之和——由提示词缓存提供的既有上下文。每次 API 调用都会重新计入：每一轮都会重新读取相同的缓存内容并再次支付（折扣后的）读取费用，因此该数值随对话长度近似平方增长。多数提供商按输入价格的约 10% 计费。",
    cacheWrittenLifetime: "缓存写入（累计）",
    cacheWrittenLifetimeTooltip:
      "各轮 `usage.cacheWrite` 之和——为后续轮次复用而写入缓存的部分。按输入价格的约 125% 计费；先付少量溢价，换来缓存读取行的大幅节省。",
    outputLifetime: "输出（累计）",
    outputLifetimeTooltip: "各轮 `usage.output` 之和——助手生成的 Token。",
    totalCost: "总费用",
    perTurn: "按轮次（{count}）",
    inContext: "上下文构成",
    breakdownTooltip: "各分类估算值之和（按 字符数 ÷ 3 估算）",
    tokensApprox: "约 {tokens} tok",
    segmentTitle: "{label}：{tokens} tok（{percent}%）",
    categories: {
      systemAndTools: "系统提示词 + 工具",
      userPrompts: "用户消息",
      assistantText: "助手文本",
      thinking: "思考",
      toolCalls: "工具调用",
      toolResults: "工具结果",
      images: "图片",
    },
    columns: {
      new: "新增",
      prompt: "提示词",
      out: "输出",
      cost: "费用",
    },
    newColumnTooltip:
      "本轮估算新增的 Token——上一轮助手回复以来的用户消息 + 工具结果（按 字符数 ÷ 3 估算）。与「提示词」列含义不同。",
    promptColumnTooltip:
      "发送给 LLM 的完整提示词 = usage.input + cacheRead + cacheWrite。包含所有被重新发送的历史上下文——该数值随对话长度单调增长，这是 LLM 的正常行为。",
    outColumnTooltip: "本轮助手生成的 Token",
    costColumnTooltip: "本轮的计费金额",
    newContentTooltip: "新增内容（估算）",
    messages: "消息（{count}）",
    showThinking: "显示思考块",
    findPlaceholder: "在消息中查找…",
    streamingBadge: "助手（流式输出中）",
    compactedBadge: "已压缩",
    viewRawTooltip: "查看 AgentMessage 原始 JSON",
    toolPrefix: "工具：",
    toolCallPrefix: "工具调用：",
    errorSuffix: "（出错）",
    imageAttachment: "[图片附件]",
    roleLabels: {
      user: "用户",
      assistant: "助手",
      tool: "工具",
      toolResult: "工具结果",
      system: "系统",
      compactionSummary: "压缩摘要",
      unknown: "未知",
    },
  },
};
