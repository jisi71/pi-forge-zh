/**
 * 简体中文 — sessions 区域文案。
 *
 * 英文原文见 `../en/sessions.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 会话标题、消息预览等由代理或用户生成的内容一律保持原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const sessions: DeepPartial<EnMessages["sessions"]> = {
  tree: {
    title: "会话树",
    viewList: "列表",
    viewListTooltip: "纵向列表视图",
    viewGraph: "图形",
    viewGraphTooltip: "分支图形视图（按轮次分组）",
    refresh: "刷新会话树",
    loading: "正在加载会话树…",
    empty: "暂无条目。",
    hint: "点击任意一行可切换会话叶节点 · 用户消息上的分支图标可从此处创建分支",
    entryCount: { other: "{count} 个条目" },
    entryLabels: {
      message: "消息",
      user: "用户",
      assistant: "助手",
      tool: "工具",
      toolResult: "工具结果",
      system: "系统",
      compactionSummary: "压缩摘要",
      thinking: "思考",
      model: "模型",
      compact: "压缩",
      branch: "分支",
      label: "标签",
      info: "信息",
      custom: "自定义",
      extension: "扩展",
    },
    leafBadge: "叶节点",
    branchBadge: "分支 {level}",
    branchHeadTooltip: "该分支的首个条目",
    siblingsTooltip: { other: "{count} 个分支从此处分叉" },
    navigateTooltip: "将会话叶节点切换到该条目",
    currentLeafTooltip: "当前叶节点",
    forkTooltip: "在该消息之前创建分支——新会话会把这条消息载入输入框，便于改写。",
  },

  navigate: {
    title: "切换会话叶节点",
    streamingWarning: "代理正在运行。切换叶节点会中止当前这一轮。",
    abandonExplanation:
      "你将离开当前分支。分支末端仍保留在会话树中（随时可以切回），也可以先给它加标签并生成摘要。",
    labelLabel: "被放弃分支末端的标签",
    labelPlaceholder: "例如 wrong-approach",
    summarizePrefix: "让 pi 写入一条 ",
    summarizeSuffix: " 条目，记录该分支做过什么。会额外消耗一次 LLM 调用。",
    customInstructionsLabel: "自定义摘要指令",
    customInstructionsPlaceholder: "例如：重点说明改动了哪些文件以及为什么",
    confirm: "确认切换？",
    abortAndNavigate: "中止并切换",
    navigate: "切换",
  },

  graph: {
    noTurns: "没有可渲染的轮次。",
    navigateTooltip: "将会话叶节点切换到此轮次",
    currentLeafTooltip: "当前叶节点轮次",
    forkTooltip: "在该轮次之后创建分支——新会话包含这一轮的完整输出，可直接开始下一次提问。",
    childBranchesTooltip: { other: "{count} 个分支从此处分叉" },
    assistantCountTooltip: "本轮内的助手消息",
    toolCountTooltip: "本轮内的工具结果",
    thinkingCountTooltip: "思考块",
    metaCountTooltip: "元条目（model_change、branch_summary 等）",
    noText: "（无文本）",
  },
};
