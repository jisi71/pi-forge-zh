/**
 * files — English strings.
 *
 * File browser / viewer panel, project-wide file search, the global
 * session search bar and the editor shell (tabs, status bar,
 * external-change banner). English is the reference language: the key
 * set defined here is the contract every other locale is checked
 * against.
 *
 * File names, paths, globs and language ids always stay verbatim.
 */

export const files = {
  browser: {
    selectProject: "Select a project to browse its files.",
    newFile: "New file",
    newFolder: "New folder",
    uploadTooltip: "Upload files into project root (drag-and-drop also works on any folder)",
    downloadProjectTooltip: "Download project as .tar.gz (skips node_modules, .git, dist, etc.)",
  },

  upload: {
    hashing: {
      one: "Hashing {count} file ({size})…",
      other: "Hashing {count} files ({size})…",
    },
    hashingProgress: "Hashing {done} / {total} ({percent}%)…",
    uploading: {
      one: "Uploading {count} file ({size})…",
      other: "Uploading {count} files ({size})…",
    },
    uploaded: {
      one: "Uploaded {count} file.",
      other: "Uploaded {count} files.",
    },
  },

  download: {
    preparing: "Preparing download…",
  },

  selection: {
    count: "{count} selected",
    hint: "(Cmd/Ctrl+click rows to add or remove)",
    deleteSelected: "Delete selected",
  },

  tree: {
    notLoaded: "Tree not loaded.",
    newFileInFolder: "New file in this folder",
    newSubfolder: "New subfolder in this folder",
    uploadIntoFolder: "Upload into this folder",
    downloadFolder: "Download folder as .tar.gz",
    downloadFile: "Download file",
  },

  create: {
    title: "New {noun}",
    titleIn: "New {noun} in {path}/",
    fileNoun: "file",
    folderNoun: "folder",
    fileName: "File name",
    folderName: "Folder name",
    label: "{noun} (relative to project root)",
    labelIn: "{noun} (in {path}/)",
  },

  delete: {
    fileTitle: "Delete file",
    directoryTitle: "Delete directory",
    notEmptyTitle: '"{name}" is not empty',
    kindFile: "file",
    kindDirectory: "directory",
    body: 'Delete {kind} "{name}"? This cannot be undone.',
    notEmptyBody:
      '"{name}" contains files. Delete the directory and ALL its contents? This cannot be undone.',
    confirmContents: "Delete contents",
  },

  deleteMany: {
    title: {
      one: "Delete {count} item",
      other: "Delete {count} items",
    },
    body: {
      one: "Delete the {count} selected file / folder? Folders are deleted recursively. This cannot be undone.",
      other:
        "Delete the {count} selected files / folders? Folders are deleted recursively. This cannot be undone.",
    },
    confirm: "Delete all",
  },

  context: {
    addAsContext: "Add as @ context",
    addAsContextFolderTitle:
      "Append @<path>/ to the chat input so the model can ls / grep this folder",
    addAsContextFileTitle:
      "Append @<path> to the chat input so the file's content is sent with the next prompt",
    addFile: "Add file",
    addFileInFolderTitle: "Create a new file inside this folder",
    addFileInRootTitle: "Create a new file at the project root",
    addFolder: "Add folder",
    addFolderInFolderTitle: "Create a new subfolder inside this folder",
    addFolderInRootTitle: "Create a new folder at the project root",
    renameTitle: "Rename this file or folder",
    deleteTitle: "Delete this file or folder",
  },

  search: {
    selectProject: "Select a project to search its files.",
    placeholder: "Search project…",
    placeholderRegex: "Regex…",
    regex: "Regex",
    caseSensitive: "Case sensitive",
    includeIgnored: "+ignored",
    includeIgnoredTitle: "Include files that .gitignore would normally skip",
    globs: "Globs",
    includeGlobPlaceholder: "include glob — e.g. **/*.ts",
    excludeGlobPlaceholder: "exclude glob — e.g. **/dist/**",
    errorUnexpectedResponse: "server returned an unexpected response",
    errorFailed: "search failed",
    emptyHint: "Type to search across project files.",
    emptySubHint: "Min {min} chars · Click a result to jump to that line.",
    keepTyping: "Keep typing — at least {min} characters.",
    searching: "Searching…",
    noMatches: "No matches.",
    resultCount: {
      one: "{count} match in {files}",
      other: "{count} matches in {files}",
    },
    truncated: "· truncated at {limit}",
    fallbackBadge: "fallback",
    fallbackTitle: "ripgrep was not found on this host — using the slower in-process fallback",
  },

  globalSearch: {
    placeholder: "Search sessions…  ⌘K",
    ariaLabel: "Search across all sessions",
    clearAria: "Clear search",
    resultsAria: "Search results",
    kindYou: "you",
    kindAgent: "agent",
    kindTool: "tool",
  },

  editor: {
    empty: "No file open. Click a file in the tree to start editing.",
    binary: "Binary file.",
    loading: "Loading editor…",
    closeAllConfirm: {
      one: "Close {count} tab?",
      other: "Close {count} tabs?",
    },
    closeAllWarning: {
      one: "{count} of them has unsaved changes that will be lost.",
      other: "{count} of them have unsaved changes that will be lost.",
    },
    closeAllTitle: {
      one: "Close all {count} tab",
      other: "Close all {count} tabs",
    },
    externalChangeTabTitle:
      "{path}\n\nExternal change while you have unsaved edits — open the tab to review.",
    unsaved: "Unsaved changes",
    closeTabTitle: "Close (any unsaved changes are lost)",
    externalChange:
      "File changed externally — local edits in this tab are stale. Reload from disk?",
    keepMine: "Keep mine",
    saveFailed: "Save failed ({error}) — Cmd/Ctrl+S or Save to retry",
    savedAt: "Saved {time}",
    upToDate: "Up to date",
    wrapOnTitle: "Wrap on (click to switch to horizontal scroll, persisted per file extension)",
    wrapOffTitle: "Wrap off (click to enable wrap, persisted per file extension)",
    wrapOn: "wrap",
    wrapOff: "no wrap",
    saveTitle: "Save (Cmd/Ctrl+S)",
  },
} as const;
