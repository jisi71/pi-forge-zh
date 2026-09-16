/**
 * 简体中文 — chatInput 区域文案。
 *
 * 英文原文见 `../en/chatInput.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 命令标识（/compact、/settings、!cmd、@path）、模型/提供商 id、
 * 思考等级 id 与 stdout/stderr 等流名称一律保留原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const chatInput: DeepPartial<EnMessages["chatInput"]> = {
  resizeHandle: "调整聊天输入框高度",
  resetHeight: "将聊天输入框高度恢复为默认值",
  errorPrefix: "错误：{message}",

  fileRef: {
    title: "@{path} — 模型会在需要时用 read 工具加载该文件",
    remove: "移除 @{path}",
  },

  slash: {
    compact: "手动压缩会话上下文",
    clear: "压缩上下文（/compact 的别名）",
    abort: "停止代理（等同于 Abort 按钮）",
    settings: "打开设置面板",
    skills: "打开 设置 → 技能",
    mcp: "打开 设置 → MCP",
    providers: "打开 设置 → 提供商",
    helpMinimal: "说明输入框中 `/` 与 `@` 的作用",
    helpFull: "说明输入框中 `/`、`!`、`@` 的作用",
    helpTextMinimal:
      "/<cmd> 执行 {brand} 命令（compact、abort、settings 等）。@<path> 引用项目文件（可在弹出面板中自动补全）；输入 \\@ 可获得字面量 @。",
    helpTextFull:
      "/<cmd> 执行 {brand} 命令（compact、abort、settings 等）。!cmd 执行 bash（输出进入下一轮 LLM 上下文）；!!cmd 执行 bash 仅保留在本地。@<path> 引用项目文件（可在弹出面板中自动补全）；输入 \\@ 可获得字面量 @。",
    promptArgs: "{description} — 参数：{args}",
    unavailable: "{description} — 当前不可用",
    hint: "↑↓ 导航 · Enter/Tab 运行 · Esc 取消",
  },

  ac: {
    hint: "↑↓ 导航 · Enter/Tab 插入 · Esc 关闭",
  },

  placeholder: {
    readOnly: "该 pi-subagents 子代理正在外部运行，当前为只读…",
    autoRetry: "正在自动重试 — 你的消息会先排队，重试完成后发送…",
    steeringMobile: "给代理补充指令…",
    steering: "给代理补充指令（Enter 发送；Shift+Enter 换行）…",
    idleMinimalMobile: "向 pi 提问 — Enter 换行；点发送提交；`/` 运行命令，`@path` 引用文件…",
    idleMobile:
      "向 pi 提问 — Enter 换行；点发送提交；`/` 运行命令，`!` 执行 bash，`@path` 引用文件…",
    idleMinimal: "向 pi 提问（Enter 发送；Shift+Enter 换行）— `/` 运行命令，`@path` 引用文件…",
    idle: "向 pi 提问（Enter 发送；Shift+Enter 换行）— `/` 运行命令，`!` 执行 bash，`@path` 引用文件…",
    retryTitle: "遇到提供商错误后代理正在自动重试。新消息会先排队，重试成功后发送。",
  },

  bang: {
    local: "bash · 本地",
    context: "bash · 上下文",
    localTitle: "!! — 执行 bash；输出仅保留在本地（不进入 LLM 上下文）",
    contextTitle: "! — 执行 bash；输出会加入下一轮的 LLM 上下文",
  },

  error: {
    readOnlyExternal: "该 pi-subagents 子代理正在外部运行，当前为只读。",
    pasteWhileStreaming: "流式输出期间粘贴的图片不会添加为附件。请等待当前运行结束。",
    modelsUnavailable: "模型列表不可用（{code}）",
    setModelFailed: "设置模型失败：{code}",
    setThinkingLevelFailed: "设置思考等级失败：{code}",
    compactFailed: "压缩失败：{code}",
    clearFailed: "清空失败：{code}",
    unknownCommand: "未知命令“{command}”。输入 /help 查看命令列表。",
    unknownCommandHint:
      "未知命令“{command}”。输入 /help 查看命令列表，或删掉开头的 / 作为普通提示词发送。",
    bashDisabled: "当前部署已禁用 bash 执行。",
    emptyBash: "bash 命令为空。请在 `!` 后输入内容。",
    attachmentsBashCleared: "`!` 执行不会发送附件，已清除。",
    attachmentsSteerCleared: "中途补充指令不会发送附件，已清除。",
    commandFailed: "命令执行失败：{code}",
  },

  attachment: {
    tooManyTotal: "每条消息最多 {max} 个附件；“{name}”已丢弃。",
    tooLarge: "“{name}”超过单个文件 20 MB 的上限。",
    tooManyImages: "每条消息最多 {max} 张图片；“{name}”已丢弃。",
    binary:
      "“{name}”是二进制格式，代理无法直接读取。请先转换为文本/markdown（图表可转为 PNG/JPEG 截图）后重试。",
    remove: "移除 {name}",
    label: "添加附件",
    filesLabel: "添加附件",
    photo: "照片",
    file: "文件",
    steerWarning: "中途补充指令不会发送附件。",
    steerWarningLong: "中途补充指令不会发送附件。请等待当前运行结束。",
    mobileTitle: "添加照片或文件",
    desktopTitle: "添加附件（图片进入模型上下文；文本文件会前置到提示词）",
  },

  model: {
    label: "模型：",
    defaultModel: "默认模型",
    defaultSuffix: "{label}（默认）",
    triggerTitle: "为当前会话覆盖模型（点击搜索）",
    searchPlaceholder: "搜索提供商或模型…",
    useAgentDefault: "使用代理默认模型",
    noMatch: "没有匹配的模型。请在 设置 → 提供商 中配置 API 密钥。",
    footer: "{filtered} / {total} 个模型 — ↑↓ 移动，Enter 选择，Esc 关闭",
  },

  thinking: {
    label: "思考等级：",
    triggerTitle: "为当前会话覆盖思考等级",
  },

  processes: {
    showList: "显示进程列表",
    viewPanel: "查看进程面板",
    titleMobile: { other: "{count} 个后台进程正在运行 — 显示列表" },
    titleDesktop: { other: "{count} 个后台进程正在运行 — 查看进程面板" },
    popoverTitle: "进程（{count} 个运行中）",
    exitCode: "退出码 {code}",
    empty: "没有进程。",
    finished: "已结束",
    kill: "终止",
    killTitle: "终止该进程",
  },

  todos: {
    showList: "显示任务列表",
    toggle: "切换待办面板",
    hide: "隐藏待办面板",
    show: "显示待办面板（已完成 {done}{inProgress}）",
    titleMobile: "任务：已完成 {done}{inProgress}",
    inProgressComma: "，{count} 个进行中",
    inProgressDot: " · {count} 个进行中",
    popoverTitle: "任务",
    popoverTitleCount: "任务 · {done}/{total}{inProgress}",
    empty: "没有任务。",
  },

  sendTitle: "发送（Enter 或 Cmd/Ctrl+Enter）",
  sendTitleStreaming:
    "发送（Enter 或 Cmd/Ctrl+Enter；Pi 会在下一个代理断点排队 — 视代理状态作为补充指令或后续消息）",
  abort: "中止",
  abortTitle: "停止代理（或在输入框中按两次 Esc）",
  streamingHint:
    "Enter、Cmd/Ctrl+Enter 或发送按钮会在下一个代理断点排队 — 由 Pi 决定作为补充指令还是后续消息。中止：停止代理（或在输入框中按两次 Esc）。",

  quickActions: {
    runTitle: "运行已保存的快捷操作",
    label: "快捷操作",
    runningCount: { other: "{count} 个操作正在运行" },
    insertPreview: "插入：{text}",
    sendPreview: "发送：{text}",
  },

  runCard: {
    statusRunning: "运行中",
    statusError: "错误",
    statusTimedOut: "已超时",
    statusAborted: "已中止",
    statusExitZero: "退出码 0",
    statusExitCode: "退出码 {code}",
    truncated: "已截断",
    truncatedTitle: "输出超过单流上限，已被截断",
    stopTitle: "不再等待本次运行（服务端中止将在后续版本提供）",
    useAsContext: "用作上下文",
    useAsContextTitle: "将捕获的输出插入输入框，作为下一条提示词的内容",
    hideOutput: "隐藏输出",
    showOutput: "显示输出",
  },

  telemetry: {
    ack: "我已知晓：由于 OTEL_CAPTURE_CONTENT 已启用，本条消息及相关工具/模型内容将被纳入遥测数据。",
  },
};
