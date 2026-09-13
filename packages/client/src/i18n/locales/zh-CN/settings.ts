/**
 * 简体中文 — settings 区域文案。
 *
 * 英文原文见 `../en/settings.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 技术标识（provider id、模型名、工具名、环境变量、文件名、JSON 字段、
 * transport 取值、命令片段）一律保留原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const settings: DeepPartial<EnMessages["settings"]> = {
  // pi SDK `AuthStatus.source` 的取值说明（来源：本地保存 / 环境变量 / 运行时注入…）
  credentialSource: {
    stored: "本地保存",
    runtime: "运行时注入",
    environment: "环境变量",
    fallback: "内置回退",
    modelsJsonKey: "models.json 密钥",
    modelsJsonCommand: "models.json 命令",
  },

  telemetry: {
    title: "遥测内容捕获",
    description:
      "运行时控制 OTEL_CAPTURE_CONTENT。启用后，完整的用户与助手消息内容、以及工具输入与结果都可能被导出到 OpenTelemetry。",
    includeContent: "将消息与工具内容纳入遥测",
    warning:
      "仅在已获批准的数据留存策略下启用。被捕获的内容可能包含源代码、凭据、个人数据、附件文本以及 MCP / 工具返回结果。",
    on: "已开启",
    off: "已关闭",
  },

  panel: {
    title: "设置",
    apiDocs: "API 文档 ↗",
    apiDocsTooltip: "在新标签页打开 OpenAPI / Swagger UI，会自动携带当前登录凭据。",
    closeTooltip: "关闭 (Esc)",
    tabs: {
      providers: "提供商",
      agent: "代理",
      mcp: "MCP",
      tools: "工具",
      sandbox: "沙箱",
      skills: "技能",
      prompts: "提示词",
      systemPrompt: "系统提示词",
      quickActions: "快捷操作",
      webhooks: "Webhook",
      appearance: "外观",
      backup: "备份",
      general: "通用",
    },
  },

  /** 错误提示前缀。{code} 是服务端返回的错误码，保持原文。 */
  errors: {
    loadProviders: "加载提供商失败：{code}",
    saveKey: "保存密钥失败：{code}",
    removeKey: "移除密钥失败：{code}",
    loadModelsJson: "加载 models.json 失败：{code}",
    saveFailed: "保存失败：{code}",
    loadSettings: "加载设置失败：{code}",
    loadSkills: "加载技能失败：{code}",
    toggleFailed: "切换失败：{code}",
    overrideWriteFailed: "写入覆盖失败：{code}",
    loadPrompts: "加载提示词失败：{code}",
    loadTools: "加载工具失败：{code}",
    loadSystemPrompt: "加载系统提示词失败：{code}",
    clearFailed: "清空失败：{code}",
    deleteFailed: "删除失败：{code}",
    exportFailed: "导出失败：{code}",
    importFailed: "导入失败：{code}",
    skillsExportFailed: "导出技能失败：{code}",
    skillsImportFailed: "导入技能失败：{code}",
    loadToolListing: "加载工具列表失败：{code}",
    loadMcpConfig: "加载 MCP 配置失败：{code}",
    toggleMcpFailed: "切换 MCP 失败：{code}",
    updateMcpTruncation: "更新 MCP 截断设置失败：{code}",
    updateServerFailed: "更新服务器失败：{code}",
    saveServerFailed: "保存服务器失败：{code}",
    removeServerFailed: "移除服务器失败：{code}",
    probeFailed: "探测 '{name}' 失败：{code}",
    grantTrustFailed: "授予信任失败：{code}",
    revokeTrustFailed: "撤销信任失败：{code}",
  },

  /** 技能 / 提示词 / 工具 / MCP 四个标签页共用的按项目覆盖级联文案。 */
  overrides: {
    name: "覆盖",
    showTitle: "查看按项目的覆盖设置",
    globalState: "全局：{state}",
    inherit: "继承",
    empty: "还没有任何项目覆盖——所有项目都继承全局状态。",
    addFor: "+ 为下列项目添加覆盖…",
    pickProject: "选择项目…",
    enableHere: "在此项目启用",
    disableHere: "在此项目禁用",
    noProjects: "还没有项目。请先创建项目，再添加按项目的覆盖设置。",
    effectiveTitle: "在 {name} 中的生效状态：{state}",
    projectBadge: "项目：{state}",
    projectOverrideTitle: "当前项目（'{name}'）设置了覆盖",
    noDescription: "（无描述）",
    stateEnabled: "已启用",
    stateDisabled: "已禁用",
  },

  /** 共用表单元素。 */
  fields: {
    unset: "（未设置）",
  },

  // ---------------- 提供商 ----------------

  providers: {
    loading: "正在加载提供商…",
    empty: "没有配置任何提供商。",
    introPrefix: "内置提供商，以及 ",
    introSuffix: " 中定义的任意提供商。已保存的 API 密钥仅显示是否存在——实际值绝不会发送到浏览器。",
    keySet: "已配置密钥",
    noKey: "未配置密钥",
    viaSource: "来源：{source}",
    addKey: "添加密钥",
    replaceKey: "替换密钥",
    keyPlaceholder: "粘贴 API 密钥",
    confirmRemoveKey: "移除 “{provider}” 已保存的密钥？",
    modelCount: { other: "{count} 个模型" },
    contextWindow: "上下文 {count}k",
    customSummary: "自定义提供商（models.json）",
    customHint:
      "原始 JSON 编辑器。可在此添加 vLLM / LiteLLM / Ollama / OpenAI 兼容端点。SDK 会在下次创建会话时校验。",
    customInvalidJson: "models.json：JSON 格式无效",
    customInvalidTopLevel: 'models.json：顶层必须是 { "providers": { ... } }',
  },

  // ---------------- 代理 ----------------

  agent: {
    loading: "正在加载设置…",
    intro: "新会话的默认值。表单涵盖常用键；如需编辑 SDK 接受的其他内容，请切换到 JSON。",
    editAsJson: "以 JSON 编辑",
    defaultProvider: "默认提供商",
    defaultProviderHint: "例如 anthropic、openai、google、custom",
    defaultModel: "默认模型",
    defaultModelHint: "所选提供商的模型 id",
    thinkingLevel: "思考等级",
    thinkingLevelHint: "off、low、medium、high（取决于提供商）",
  },

  jsonEditor: {
    invalidJson: "settings.json：JSON 格式无效",
    invalidTopLevel: "settings.json：顶层必须是一个对象",
    introPrefix: "原始 ",
    introMid: "。在此删除的键会在保存时一并删除（在合并补丁中映射为 ",
    introSuffix: "）。SDK 会在下次创建会话时校验。",
    backToForm: "返回表单",
  },

  // ---------------- 技能 ----------------

  skills: {
    pickProject: "请先在顶部选择一个项目，以管理它的技能。",
    loading: "正在加载 {name} 的技能…",
    introPrefix: "在 ",
    introMid: " 和 ",
    introMid2: " 中发现的技能。全局开关写入 pi 的 ",
    introMid3: "；按项目的覆盖写入 {brand} 私有文件 ",
    introSuffix: "。",
    warningPrefix: "技能变更将在",
    warningStrong: "下一个会话",
    warningSuffix:
      "生效——即你在受影响项目中新启动的会话。正在运行的会话会保留启动时的技能集合，启动新会话即可使用新启用的技能。",
    empty: "没有找到该项目可用的技能。",
    globalToggleTitle: "在 pi 的 settings.skills 中的全局启用状态",
  },

  // ---------------- 提示词 ----------------

  prompts: {
    pickProject: "请先在顶部选择一个项目，以管理它的提示词。",
    loading: "正在加载 {name} 的提示词…",
    introPrefix: "在 ",
    introMid: " 和 ",
    introMid2: " 中发现的 pi 提示词模板。可在聊天输入框中通过 ",
    introMid3: " 调用；全局开关写入 pi 的 ",
    introMid4: "；按项目的覆盖写入 ",
    introSuffix: "。",
    warningPrefix: "提示词变更将在",
    warningStrong: "下一个会话",
    warningSuffix:
      "生效——即你在受影响项目中新启动的会话。正在运行的会话会保留启动时的提示词集合，启动新会话即可使用新启用的提示词。",
    empty: "没有找到该项目可用的提示词。",
    argumentHintTitle: "来自提示词 frontmatter 的参数提示",
    globalToggleTitle: "在 pi 的 settings.prompts 中的全局启用状态",
  },

  diagnostics: {
    notLoaded: { other: "有 {count} 个技能文件未能加载：" },
    loser: "被覆盖：",
    winner: "胜出：",
    fixPrefix: "把 ",
    fixMid: " 加到被覆盖方的 frontmatter 中，或将它改为 ",
    fixSuffix: "，让父目录名起到区分作用。",
  },

  // ---------------- 沙箱 ----------------

  sandbox: {
    title: "沙箱模式",
    description:
      "配置注入到后续代理工具调用中的环境变量。沙箱开关、UID/GID 与工具 HOME 属于部署期设置；此处的改动对新建或刷新后的会话生效。",
    loading: "正在加载沙箱设置…",
    disabledNotice:
      "沙箱工具覆盖当前处于禁用状态。保存的变量仍会持久化，但只会注入 pi-forge 托管的工具 shell；完整的文件系统沙箱需要 AGENT_TOOL_SANDBOX_ENABLED=true。",
    toolEnvironment: "工具环境变量",
    addVariable: "添加变量",
    emptyEnv: "尚未配置任何沙箱工具环境变量。",
    envNameAria: "环境变量名",
    envValueAria: "环境变量值",
    valuePlaceholder: "值",
    hide: "隐藏",
    reveal: "显示",
    secretsHint:
      "变量值默认打码，需逐行显示。它们仍会保存在 {brand} 数据中并传给工具进程，因此除非该存储受到妥善保护，请避免存放密钥。",
    saveButton: "保存沙箱环境变量",
    invalidEnvName: "第 {row} 行：环境变量名不合法",
  },

  // ---------------- 工具 ----------------

  tools: {
    loading: "正在加载工具…",
    introPrefix: "逐个开关代理可调用的内置工具。右侧的全局开关是所有项目的默认值。使用 ",
    introMid:
      " 按项目启用/禁用工具——显式的项目覆盖优先于全局默认值。变更会在下一个会话生效——正在运行的会话会保留启动时的工具集合。MCP 服务器工具位于各个服务器下的 ",
    introSuffix: " 标签页中。",
    builtinTitle: "内置工具",
    extensionTitle: "扩展工具",
    extensionIntroPrefix: "由安装在 ",
    extensionIntroMid: " 或项目 ",
    extensionIntroSuffix:
      " 下的 pi 扩展以编程方式注册的工具。被禁用的工具会从传给下一个会话的允许列表中移除——扩展本身仍保持加载。",
    packageLabel: "包：",
  },

  toolCascade: {
    globalDefaultTitle: "全局默认值：{state}",
    bridgedNameTitle: "pi 在通信层看到的桥接工具名",
    globalToggleTitle: "对所有未覆盖的项目的全局默认值",
  },

  // ---------------- 系统提示词 ----------------

  systemPrompt: {
    pickProject: "请先在顶部选择一个项目，以编辑它的系统提示词附加内容。",
    loading: "正在加载 {name} 的系统提示词…",
    saved: "已保存。对你在此项目中启动的下一个会话生效。",
    cleared: "已清空。对你在此项目中启动的下一个会话生效。",
    confirmClear: "清空 “{name}” 的系统提示词附加内容？",
    introPrefix: "附加到代理基础系统提示词之后的自由文本，作用于 ",
    introSuffix:
      " 中的会话。可用它在 pi 的默认行为之上叠加项目专属行为——编码约定、领域背景、角色设定等。",
    appendOnlyPrefix:
      "仅支持追加——基础提示词（定义了工具调用协议）不可编辑。变更对你在此项目中启动的",
    appendOnlyStrong: "下一个会话",
    appendOnlySuffix: "生效；正在运行的会话会保留创建时使用的提示词。",
    placeholder:
      "例如：本项目使用 TypeScript 严格模式，且从不使用默认导出。在宣布任务完成前务必先运行 `npm run check`。",
    byteCounter: "{used} / {limit} 字节",
    overBudget: "——过长，请在保存前精简",
    revert: "还原",
  },

  // ---------------- 快捷操作 ----------------

  quickActions: {
    title: "快捷操作芯片",
    introPrefix: "聊天工具栏上的一键按钮。共两种类型：",
    introCommand: "command",
    introMid: " 芯片会在当前项目目录中执行 shell 片段；",
    introPrompt: "prompt",
    introSuffix:
      " 芯片会把模板化的提示词发送给代理，或插入到输入框，让你在发送前再作调整。芯片全局保存（不按项目）——它们是你个人的工具箱。",
    minimalNotice:
      "已启用 MINIMAL_UI。command 芯片仍列在下方，但不会出现在工具栏中，且服务端会拒绝运行它们。prompt 芯片不受影响。",
    empty: "还没有定义任何芯片。点击下方的“新建”添加一个。",
    badgeCommand: "cmd",
    badgePrompt: "prompt",
    hiddenByMinimal: "已被 MINIMAL_UI 隐藏",
    newChip: "+ 新建芯片",
    nameLabel: "名称",
    namePlaceholder: "例如：运行测试",
    kindLabel: "类型",
    kindPrompt: "提示词",
    kindCommand: "命令",
    commandDisabledByMinimal: "（MINIMAL_UI 已禁用）",
    commandDisabledTitle: "MINIMAL_UI 已禁用 command 芯片，服务端会拒绝运行它们。",
    commandLabel: "命令",
    commandHintPrefix: "在当前项目目录中通过 ",
    commandHintMid: " 执行。支持多行（",
    commandHintMid2: "、",
    commandHintSuffix: " 等）。环境变量已清除 {brand} 与提供商的密钥（与集成终端一致）。",
    timeoutLabel: "超时（秒）",
    timeoutHint: "最大 300（五分钟）。更长的任务请使用集成终端。",
    promptTextLabel: "提示词内容",
    promptPlaceholder: "检查暂存的改动是否存在安全问题。",
    modeLabel: "模式",
    modeSend: "立即发送",
    modeInsert: "插入到输入框",
    enabledLabel: "启用（显示在菜单中）",
    nameRequired: "名称必填",
    commandRequired: "命令必填",
    promptRequired: "提示词内容必填",
  },

  // ---------------- 外观 ----------------

  appearance: {
    themeTitle: "主题",
    themeDescription:
      "设置界面框架、编辑器与终端的基础配色。仅保存在当前浏览器，其他浏览器可各自选择不同主题。",
    themes: {
      dark: "深色（默认）",
      light: "浅色",
      dracula: "Dracula",
      "solarized-dark": "Solarized Dark",
      "catppuccin-mocha": "Catppuccin Mocha",
      "high-contrast": "高对比度",
    },
    customColorsTitle: "全局自定义配色",
    customColorsDescription:
      "由服务端下发的整体界面配色覆盖：应用背景、对话气泡、文字、高亮与选中色。保存后对所有浏览器生效。",
    customColorsLoadFailed: "加载服务端主题失败",
    customColorsSave: "保存",
    customColorsReset: "重置",
    customColorsExport: "导出",
    customColorsImport: "导入",
    customColorsEnabled: "启用全局自定义配色",
    customColorsBaseFrom: "以下列主题为基准",
    customColorsInvalidFile: "该文件不是 pi-forge 主题导出文件",
    customColorsSaved: "全局自定义配色已保存",
    customColorsResetDone: "全局自定义配色已重置",
    customColorsLoading: "正在加载自定义配色…",
    customColorsStartFrom: "以现有外观为起点",
    customColorsCopy: "复制配色",
    customColorsSaveButton: "保存自定义配色",
    customColorsExportTheme: "导出主题",
    customColorsImportTheme: "导入主题",
    customColorsDefaultValue: "默认 {value}",
    customColorsImportRootError: "导入的主题必须是包含 colors 的 JSON 对象。",
    customColorsImportColorError: "{label} 必须是形如 #0a0a0a 的 6 位十六进制颜色。",
    colorLabels: {
      appBackground: "应用背景",
      panelBackground: "面板背景",
      userBubbleBackground: "用户气泡",
      assistantBubbleBackground: "助手气泡",
      primaryText: "文字 1 — 主要",
      secondaryText: "文字 2 — 次要",
      mutedText: "文字 3 — 弱化",
      highlightBackground: "高亮背景",
      highlightText: "高亮文字",
      selectionBackground: "选中背景",
    },
  },

  // ---------------- 备份 ----------------

  backup: {
    exportConfigTitle: "导出配置",
    exportIntroA: "下载一个 ",
    exportIntroB: " 归档，包含 ",
    listSep: "、",
    listSepLast: " 和 ",
    exportAuthPrefix: "。提供商的鉴权信息（",
    exportAuthMid: "——API 密钥、OAuth 令牌）",
    notWord: "不会",
    exportAuthSuffix: "被包含；在新环境恢复后请重新完成各提供商的鉴权。",
    downloadConfig: "下载配置归档",
    exporting: "正在导出…",
    exportedPrefix: "已导出 ",
    exportedMid: "（",
    exportedSuffix: "）",
    noFilesOnDisk: "磁盘上没有文件",
    includedFiles: "包含：{files}",
    importConfigTitle: "导入配置",
    importIntroPrefix:
      "恢复之前导出的归档。每个文件在写入磁盘前都会先解析；只要有一个文件校验失败，",
    nothingWord: "任何内容都不会",
    importIntroSuffix: "被导入。正在运行的代理会话会保留原有设置，直到重启。",
    importedLabel: "已导入：",
    skippedLabel: "已跳过（不在允许列表中）：",
    errorsLabel: "错误——没有写入任何内容：",
    archiveEmpty: "归档是空的。",
    exportSkillsTitle: "导出技能",
    skillsExportIntroA: "下载一个 ",
    skillsExportIntroB: " 归档，包含 ",
    skillsExportIntroC: " 下的全部文件——单文件形式（",
    skillsExportIntroD: "）与目录形式（",
    skillsExportIntroSuffix: " + 附件）都能原样往返。",
    downloadSkills: "下载技能归档",
    working: "正在处理…",
    skillsEmpty: "没有可导出的技能——技能目录为空。",
    skillsPacked: { other: "已打包 {count} 个文件" },
    importSkillsTitle: "导入技能",
    skillsImportIntro: "从之前导出的 ",
    skillsImportMid: " 恢复技能，也可以直接上传技能文件所在的文件夹。同一路径下已存在的文件会被",
    overwrittenWord: "覆盖",
    skillsImportSuffix: "；新文件会被添加。路径穿越与绝对路径会被拒绝。",
    fromTarGz: "从 tar.gz 导入",
    fromFolder: "从文件夹导入（仅 Chromium / WebKit）",
    skillsImportedCount: { other: "已导入 {count} 个文件：" },
    skippedCount: { other: "已跳过 {count} 项：" },
    noneImported: "没有文件被导入。",
  },

  // ---------------- MCP ----------------

  mcp: {
    loading: "正在加载 MCP 配置…",
    introPrefix:
      "MCP 服务器为代理扩展自定义工具。在此配置的服务器会被每个新会话加载。项目根目录下 ",
    introSuffix: " 中的项目级服务器也会在对应项目的会话中加载（同名时项目条目优先于全局条目）。",
    masterTitle: "MCP 工具",
    masterHint: "总开关。关闭后，无论各服务器自身状态如何，代理都不会获得任何 MCP 工具。",
    truncationTitle: "结果截断",
    truncationHint:
      "限制每个 MCP 工具在进入代理上下文之前返回的总文本量。图片不受影响。仅对可信且输出有界的工具关闭此限制。",
    maxChars: "最大字符数",
    truncating: "已启用截断",
    passThrough: "不截断",
    spoolingSaveFailed: "更新 MCP 结果暂存设置失败：{code}",
    spoolingTitle: "结果暂存",
    spoolingHint: "在截断前，把体积过大的成功 MCP 结果写入工作区文件。默认路径：",
    spoolingHintSuffix: "。",
    spoolingThresholdLabel: "阈值字符数",
    spoolingDirectoryLabel: "目录",
    spoolingOn: "已启用暂存",
    spoolingOff: "仅内联",
    globalServers: "全局服务器",
    noGlobalServers: "尚未配置全局 MCP 服务器。点击“添加服务器”新增一个。",
    projectServers: "项目服务器（{name}）",
    noProjectServersPrefix: "没有项目级服务器。在项目根目录添加一个 ",
    noProjectServersMid: " 文件即可定义——同时支持 ",
    noProjectServersMid2: " 和标准的 ",
    noProjectServersSuffix: " 形式。",
    addServer: "+ 添加服务器",
    nameRequired: "名称必填。",
    urlRequired: "远程服务器必须填写 URL。",
    commandRequired: "stdio 服务器必须填写命令。",
    confirmRemove: "从全局注册表中移除 MCP 服务器 '{name}'？",
    confirmRevokeTrust:
      "撤销项目 “{name}” 的 stdio MCP 信任？这会断开所有正在运行的项目级 MCP 服务器。",
  },

  mcpList: {
    showTools: "显示工具",
    hideTools: "隐藏工具",
    noTools: "没有可显示的工具（服务器未连接或为空）",
    toolCount: { other: "{count} 个工具" },
    probe: "探测",
    probing: "正在探测…",
    probeTitle: "重新连接并刷新工具列表",
    toolsHeader: "工具",
  },

  mcpTrust: {
    grantedPrefix: "已授予 ",
    grantedMid: " 的 stdio MCP 信任。来自 ",
    grantedSuffix: " 的项目级 stdio MCP 服务器会在创建会话时启动。",
    revoke: "撤销",
    revokeTitle: "会断开所有正在运行的项目级 MCP 服务器",
    wantsSpawn: { other: "该项目希望启动 {count} 个 stdio MCP 服务器。" },
    declaresVerb: " 的 ",
    declaresServers: { other: " 声明了 {count} 个 MCP 服务器" },
    launchSuffix: { other: "，{brand} 会将其作为本地子进程启动。" },
    runsWarningPrefix:
      "stdio MCP 会以你透传的环境变量在本机执行任意命令——只应信任你已审阅并认可的项目的 ",
    runsWarningSuffix: "。该项目中的远程（URL）条目不受此限制。",
    granting: "正在授予…",
    trustProject: "信任该项目",
  },

  mcpForm: {
    editTitle: "编辑 '{name}'",
    addTitle: "添加 MCP 服务器",
    kindLabel: "类型",
    kindRemote: "远程 URL",
    kindStdio: "本地子进程（stdio）",
    kindLocked: "编辑期间不可更改——如需换类型请删除后重新添加。",
    transport: "传输方式",
    transportAuto: "auto（StreamableHTTP，失败时回退到 SSE）",
    commandPlaceholder: "npx（或二进制文件的绝对路径）",
    args: "参数",
    cwdPlaceholder: "（留空则用默认值：项目级服务器为项目路径）",
    disabledHint: "被禁用的服务器不会连接，也不会贡献工具。",
    headers: "请求头",
    addHeader: "+ 请求头",
    noHeadersLiteral: "暂无请求头。可以直接填写鉴权请求头，或引用环境变量，例如 MY_MCP_TOKEN。",
    removeHeader: "移除该请求头",
    envBackedNote: "引用环境变量的请求头只保存变量名，{brand} 在发送 MCP 请求时才解析其值。",
    httpsCerts: "HTTPS 证书",
    headerSingular: "请求头",
    noHeaders: "没有请求头。需要鉴权时在此添加 `Authorization: Bearer …`。",
    env: "环境变量",
    envSingular: "环境变量",
    noEnv:
      "没有环境变量。可在此添加子进程需要的 API 密钥 / 配置（PATH / HOME / locale 会自动继承）。",
  },

  secretRows: {
    keepStoredValue: "留空表示保留已保存的值",
    removeTitle: "移除{label}",
    sentinelHint: "带有打码标记的值在保存时会保留原值。",
  },

  // ---------------- 通用 ----------------

  general: {
    aboutTitle: "pi-forge",
    aboutPrefix: "面向 ",
    aboutSuffix: " 的浏览器界面。",
    agentLinkLabel: "pi 编码代理",
    versionTitle: "版本",
    linksTitle: "相关链接",
    changelog: "更新日志",
    security: "安全说明",
  },

  changePassword: {
    title: "修改密码",
    description: "更新磁盘上的 scrypt 哈希；已登录的浏览器会话保持登录状态。",
    current: "当前密码",
    newPassword: "新密码",
    confirmPassword: "确认新密码",
    tooShort: "新密码至少需要 {count} 个字符。",
    mismatch: "两次输入的新密码不一致。",
    unchanged: "新密码必须与当前密码不同。",
    updated: "密码已更新。",
    submit: "更新密码",
    errorInvalid: "当前密码不正确。",
    errorNotConfigured: "该服务端未配置密码登录。",
    errorAuthRequired: "会话已过期——请重新登录。",
    errorUnknown: "无法修改密码：{code}",
  },
};
