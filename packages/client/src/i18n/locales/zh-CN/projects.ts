/**
 * 简体中文 — projects 区域文案。
 *
 * 英文原文见 `../en/projects.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 项目名、路径、git URL、分支名、令牌前缀等技术标识保留原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const projects: DeepPartial<EnMessages["projects"]> = {
  sidebar: {
    new: "+ 新建",
    empty: "还没有项目。",
    dragToReorder: "拖动以调整项目顺序",
    newSession: "在此项目中新建会话",
    deleteProject: "删除项目（存在活跃会话时会被阻止）",
  },

  deleteDialog: {
    title: "删除项目",
    titleNamed: "删除项目“{name}”",
    removeSummary: "从 {appName} 移除“{name}”。",
    recordPrefix: "项目记录及其会话目录（",
    recordSuffix: "）将被删除。",
    liveSessionsFirst: { other: "将先释放 {count} 个活跃会话。" },
    workspaceUntouchedPrefix: "磁盘上的项目工作区文件夹",
    workspaceUntouchedNot: "不会",
    workspaceUntouchedSuffix: "被改动。",
    ackPrefix: "是的，我了解这会删除 ",
    ackSessions: { other: "{count} 个会话" },
    ackLiveAndOnDisk: "（{live} 个活跃，{onDisk} 个在磁盘）",
    ackLiveOnly: "（{live} 个活跃）",
    ackSuffix: "。此操作无法撤销。",
  },

  sessionList: {
    empty: "暂无会话。",
    selectedCount: "已选中 {count} 项",
    deleteTitle: { other: "删除 {count} 个会话" },
    deleteMessage: {
      other:
        "删除选中的 {count} 个会话？活跃会话会被终止，磁盘上的 JSONL 文件会被移除。此操作无法撤销。",
    },
    deleteAll: "全部删除",
  },

  sessionRow: {
    untitled: "会话 {id}",
    agentWorking: "代理正在工作",
    newResponse: "有新回复",
    childSessions: { other: "{count} 个子会话/工作会话" },
    collapseChildren: "折叠子会话",
    expandChildren: "展开子会话",
    rowTitle: "{id} — 双击重命名，Cmd/Ctrl+点击可多选以批量删除",
    childMarker: "子会话/工作会话",
    deleteArmedTitle: "再次点击以删除（按 Esc 取消）",
    deleteLiveTitle: "删除会话 —— 同时会终止活跃的 shell",
    deleteDiskTitle: "从磁盘删除会话 JSONL",
    confirmDelete: "确认删除",
    deleteSession: "删除会话",
    confirm: "确认",
  },

  picker: {
    titleClone: "克隆仓库",
    titleNew: "新建项目",
    titlePick: "为“{name}”选择文件夹",
    tabCreate: "创建 / 选择文件夹",
    tabClone: "克隆仓库",
    projectName: "项目名称",
    willCreate: "将创建 {path}",
    createProject: "创建项目",
    nextPickFolder: "下一步：选择文件夹",
    atWorkspaceRoot: "已在工作区根目录",
    upOneFolder: "上一级目录",
    up: "↑ 上一级",
    pathLoading: "（加载中）",
    emptyFolder: "（空）",
    select: "选择",
    folderNamePlaceholder: "文件夹名",
    createAndSelect: "创建并选择",
    back: "← 返回",
    newFolder: "+ 新建文件夹",
    selectThisFolder: "选择此文件夹",
    pickSubfolder: "请选择子文件夹 —— 工作区根目录本身不能作为项目。",
    useThisFolder: "将此文件夹用作项目根目录",
  },

  clone: {
    urlLabel: "仓库 URL",
    branchLabel: "分支（可选）",
    branchPlaceholder: "默认分支",
    folderLabel: "文件夹名称",
    folderPlaceholder: "根据 URL 自动生成",
    projectPlaceholder: "根据文件夹自动生成",
    willCloneInto: "将克隆到 {path}",
    tokenLabel: "访问令牌（可选，用于私有仓库）",
    tokenPlaceholder: "ghp_... / glpat_... 等",
    tokenHintPrefix: "通过 HTTPS 发送，以 ",
    tokenHintMiddle: " 的形式嵌入克隆 URL，并在成功后从 ",
    tokenHintSuffix: " 中移除。",
    insecureTlsLabel: "允许自签名 / 无效的 TLS 证书",
    insecureTlsHintPrefix:
      "⚠ 本次克隆将关闭 MITM 防护，并写入一条 URL 级别的本地 git 配置，供后续 fetch/pull/push 使用。仅建议用于使用已知自签名证书或私有 CA 的内部 Git 主机。服务端每次使用都会向 stderr 输出 ",
    insecureTlsHintSuffix: "。",
    phaseStarting: "正在开始…",
    phaseStartingClone: "正在开始克隆",
    phaseDone: "克隆完成，正在创建项目…",
    logCloning: "→ 正在克隆 {url}",
    rawOutput: "原始输出（{count}）",
    cancelClone: "取消克隆",
    cloning: "正在克隆…",
    submit: "克隆并创建项目",
  },

  error: {
    label: "错误：{code}",
    pathNotAllowed: "该文件夹位于工作区根目录之外。",
    notADirectory: "该路径不是文件夹。",
    alreadyExists: "已存在同名文件夹。",
    duplicatePath: "已有另一个项目指向该文件夹。",
    networkError: "无法连接到服务端。",
  },
};
