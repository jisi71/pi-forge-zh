/**
 * 简体中文 — git 区域文案。
 *
 * 英文原文见 `../en/git.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 分支名、引用、提交哈希与提交信息、远端 URL、作者名、porcelain
 * 状态码以及 git 的原始输出一律保留原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const git: DeepPartial<EnMessages["git"]> = {
  pickProject: "请选择一个项目以查看其 Git 状态。",

  target: {
    configuredUpstream: "已配置的上游",
  },

  init: {
    notARepo: "{name} 不是 Git 仓库。",
    title: "在项目根目录执行 `git init -b main`",
    initializing: "正在初始化…",
    action: "初始化 Git 仓库",
    defaultBranchPrefix: "默认分支将为 ",
    defaultBranchSuffix: "。",
    failed: "git init 失败：{error}",
  },

  header: {
    worktree: "工作树",
    worktreeTitle: "正在查看 {path} 的 Git 信息",
    loadingWorktrees: "正在加载 Git 工作树",
    noWorktrees: "没有工作树",
    switchToUnified: "将 Git 差异切换为统一视图",
    switchToSplit: "将 Git 差异切换为并排视图",
  },

  status: {
    clean: "工作区干净。",
    porcelainTitle: "porcelain 状态码：{code}",
    revert: "还原",
    revertTitle: "还原：放弃此文件的本地修改",
    revertConfirmTitle: "再次点击以放弃本地修改（此操作无法撤销）",
    confirm: "确认？",
    diffFailed: "加载差异失败。",
    diffEmpty: "（无差异 — 文件为二进制或未发生变化）",
  },

  revert: {
    doneOne: "已还原 {path}",
    doneMany: { other: "已还原 {count} 个文件" },
  },

  hunk: {
    applyFailed: "应用代码块失败：{error}",
  },

  group: {
    staged: "已暂存",
    unstaged: "未暂存",
    untracked: "未跟踪",
    stageAll: "全部暂存",
    unstageAll: "全部取消暂存",
    stage: "暂存",
    unstage: "取消暂存",
    stageHunk: "暂存该代码块",
    unstageHunk: "取消暂存该代码块",
  },

  commit: {
    heading: "提交",
    placeholder: "提交信息…",
    stagedCount: "已暂存 {count} 项",
    done: "已提交 {hash}",
  },

  push: {
    heading: "推送",
    hideOptions: "收起选项",
    configuredUpstream: "已配置的上游",
    currentBranch: "当前分支",
    current: "当前分支",
    setUpstream: "设置上游分支（新分支首次推送时使用）",
    fetch: "抓取",
    fetching: "正在抓取…",
    fetchTitleRemote: "从 {remote} 抓取远端跟踪更新，不会改动工作区。",
    fetchTitleUpstream: "从已配置的上游抓取远端跟踪更新，不会改动工作区。",
    pull: "拉取",
    pulling: "正在拉取…",
    pullTitle: "抓取并合并选定的上游到当前工作树。冲突会显示在错误提示条中，请在集成终端里解决。",
    push: "推送",
    pushed: "已推送",
    pushTitleUpstream: "git push（已配置的上游）",
    pushTitleArgs: "git push {remote}{branch}",
  },

  sync: {
    fetching: "正在从 {target} 抓取…",
    pulling: "正在从 {target} 拉取…",
    fetchSuccessNoDetail: "已从 {target} 抓取完成，未报告远端更新。",
    fetchSuccess: "已从 {target} 抓取完成。最新更新：{detail}",
    pullUpToDate: "已是最新。本地分支与 {target} 一致。",
    pullSuccessNoDetail: "已从 {target} 拉取完成，正在刷新工作区状态。",
    pullSuccess: "已从 {target} 拉取完成。最新更新：{detail}",
    fetchFailed: "抓取失败：{message}。请检查远端名称、网络连接与 Git 凭据。",
    pullFailed: "拉取失败：{message}。若存在冲突，请在终端中解决后刷新 Git 状态。",
  },

  log: {
    heading: "提交历史",
    empty: "暂无提交。",
  },

  branches: {
    heading: "分支",
    remoteTag: "远端",
    checkout: "切换",
    checkoutTitle: "切换到 {branch}",
    checkoutRemoteTitle: "切换（从 {branch} 创建跟踪分支）",
    deleteTitle: "删除分支",
    deleteConfirm:
      "删除分支“{name}”？若未合并进 HEAD 会被拒绝；如确需删除，请在终端中使用强制删除。",
    new: "新建分支",
    nameLabel: "分支名",
    createCheckout: "创建并切换",
  },

  remotes: {
    heading: "远端",
    empty: "尚未配置远端。",
    diverged: "fetch ≠ push",
    ignoreTls: "忽略 TLS",
    ignoreTlsTitle: "本地 git 配置中已对该远端 URL 关闭 TLS 证书校验",
    ignoreTlsLabel: "对此远端忽略 SSL/TLS 校验（仅写入本地仓库配置）",
    ignoreTlsLabelShort: "对此远端忽略 SSL/TLS 校验",
    ignoreTlsHelp:
      "只以 URL 级 git 配置的形式保存在当前仓库中。仅适用于使用已知自签名证书或私有 CA 的内部 Git 服务。",
    pushUrl: "推送 → {url}",
    add: "添加远端",
    remove: "移除远端",
    removeTitle: "移除远端“{name}”",
    removeConfirm: "移除远端“{name}”？本地仓库会丢失对该 URL 的引用，已有提交不受影响。",
  },
};
