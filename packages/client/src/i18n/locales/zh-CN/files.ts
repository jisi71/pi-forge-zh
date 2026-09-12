/**
 * 简体中文 — files 区域文案。
 *
 * 英文原文见 `../en/files.ts`。漏译的键自动回退英文；
 * 写错的键会被 `tsc` 拒绝（类型来自英文文件）。
 *
 * 文件名、路径、glob 与语言标识一律保留原文。
 */

import type { DeepPartial } from "../../types";
import type { EnMessages } from "../en";

export const files: DeepPartial<EnMessages["files"]> = {
  browser: {
    selectProject: "请选择一个项目以浏览其中的文件。",
    newFile: "新建文件",
    newFolder: "新建文件夹",
    uploadTooltip: "上传文件到项目根目录（也可直接把文件拖放到任意文件夹上）",
    downloadProjectTooltip: "把项目下载为 .tar.gz（会跳过 node_modules、.git、dist 等）",
  },

  upload: {
    hashing: { other: "正在计算 {count} 个文件的哈希（{size}）…" },
    hashingProgress: "正在计算哈希 {done} / {total}（{percent}%）…",
    uploading: { other: "正在上传 {count} 个文件（{size}）…" },
    uploaded: { other: "已上传 {count} 个文件。" },
  },

  download: {
    preparing: "正在准备下载…",
  },

  selection: {
    count: "已选中 {count} 项",
    hint: "（Cmd/Ctrl+点击可增减选中项）",
    deleteSelected: "删除选中项",
  },

  tree: {
    notLoaded: "文件树尚未加载。",
    newFileInFolder: "在此文件夹中新建文件",
    newSubfolder: "在此文件夹中新建子文件夹",
    uploadIntoFolder: "上传到此文件夹",
    downloadFolder: "下载文件夹为 .tar.gz",
    downloadFile: "下载文件",
  },

  create: {
    title: "新建{noun}",
    titleIn: "在 {path}/ 中新建{noun}",
    fileNoun: "文件",
    folderNoun: "文件夹",
    fileName: "文件名",
    folderName: "文件夹名",
    label: "{noun}（相对于项目根目录）",
    labelIn: "{noun}（位于 {path}/ 中）",
  },

  delete: {
    fileTitle: "删除文件",
    directoryTitle: "删除文件夹",
    notEmptyTitle: "“{name}”非空",
    kindFile: "文件",
    kindDirectory: "文件夹",
    body: "删除{kind}“{name}”？此操作无法撤销。",
    notEmptyBody: "“{name}”中包含文件。确定要删除该文件夹及其全部内容吗？此操作无法撤销。",
    confirmContents: "删除文件夹内容",
  },

  deleteMany: {
    title: { other: "删除 {count} 项" },
    body: { other: "删除选中的 {count} 个文件/文件夹？文件夹会被递归删除，且此操作无法撤销。" },
    confirm: "全部删除",
  },

  context: {
    addAsContext: "作为 @ 上下文添加",
    addAsContextFolderTitle: "将 @<path>/ 追加到对话输入框，模型即可对该文件夹执行 ls / grep",
    addAsContextFileTitle: "将 @<path> 追加到对话输入框，该文件的内容会随下一次提问一并发送",
    addFile: "新建文件",
    addFileInFolderTitle: "在此文件夹中新建文件",
    addFileInRootTitle: "在项目根目录新建文件",
    addFolder: "新建文件夹",
    addFolderInFolderTitle: "在此文件夹中新建子文件夹",
    addFolderInRootTitle: "在项目根目录新建文件夹",
    renameTitle: "重命名此文件或文件夹",
    deleteTitle: "删除此文件或文件夹",
  },

  search: {
    selectProject: "请选择一个项目以搜索其中的文件。",
    placeholder: "搜索项目内文件…",
    placeholderRegex: "正则表达式…",
    regex: "正则",
    caseSensitive: "区分大小写",
    includeIgnored: "+忽略项",
    includeIgnoredTitle: "包含 .gitignore 通常会跳过的文件",
    globs: "Glob",
    includeGlobPlaceholder: "包含 glob — 例如 **/*.ts",
    excludeGlobPlaceholder: "排除 glob — 例如 **/dist/**",
    errorUnexpectedResponse: "服务端返回了异常的响应",
    errorFailed: "搜索失败",
    emptyHint: "输入关键字即可在项目文件中搜索。",
    emptySubHint: "至少 {min} 个字符 · 点击结果可跳转到对应行。",
    keepTyping: "请继续输入 — 至少需要 {min} 个字符。",
    searching: "正在搜索…",
    noMatches: "没有匹配结果。",
    resultCount: { other: "{count} 处匹配，共 {files}" },
    truncated: "· 已在 {limit} 处截断",
    fallbackBadge: "降级模式",
    fallbackTitle: "本机未找到 ripgrep — 正在使用较慢的内置回退实现",
  },

  globalSearch: {
    placeholder: "搜索会话…  ⌘K",
    ariaLabel: "在所有会话中搜索",
    clearAria: "清空搜索",
    resultsAria: "搜索结果",
    kindYou: "你",
    kindAgent: "代理",
    kindTool: "工具",
  },

  editor: {
    empty: "尚未打开文件。在文件树中点击文件即可开始编辑。",
    binary: "二进制文件。",
    loading: "正在加载编辑器…",
    closeAllConfirm: { other: "关闭 {count} 个标签页？" },
    closeAllWarning: { other: "其中有 {count} 个标签页存在未保存的修改，将会丢失。" },
    closeAllTitle: { other: "关闭全部 {count} 个标签页" },
    externalChangeTabTitle:
      "{path}\n\n该文件已在外部被修改，而你还有未保存的编辑 — 打开此标签页查看。",
    unsaved: "未保存的修改",
    closeTabTitle: "关闭（未保存的修改将丢失）",
    externalChange: "文件已在外部被修改 — 此标签页中的本地编辑已过期。是否从磁盘重新加载？",
    keepMine: "保留我的修改",
    saveFailed: "保存失败（{error}）— 按 Cmd/Ctrl+S 或点击“保存”重试",
    savedAt: "已于 {time} 保存",
    upToDate: "已是最新",
    wrapOnTitle: "自动换行已开启（点击改为横向滚动，按文件扩展名分别记忆）",
    wrapOffTitle: "自动换行已关闭（点击开启换行，按文件扩展名分别记忆）",
    wrapOn: "自动换行",
    wrapOff: "不换行",
    saveTitle: "保存 (Cmd/Ctrl+S)",
  },
};
