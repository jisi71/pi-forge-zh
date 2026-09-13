/**
 * projects — English strings.
 *
 * Project management: the sidebar project rows, the project-setup
 * picker (create / pick folder / clone repository), the per-project
 * session list and the delete-project confirmation.
 *
 * English is the reference language: the key set defined here is the
 * contract every other locale is checked against.
 */

export const projects = {
  sidebar: {
    new: "+ New",
    empty: "No projects yet.",
    dragToReorder: "Drag to reorder projects",
    newSession: "New session in this project",
    deleteProject: "Delete project (blocked while live sessions exist)",
  },

  deleteDialog: {
    title: "Delete project",
    titleNamed: 'Delete project "{name}"',
    removeSummary: 'Remove "{name}" from {appName}.',
    recordPrefix: "Project record + the project's session directory (",
    recordSuffix: ") will be deleted.",
    liveSessionsFirst: {
      one: "{count} live session will be disposed first.",
      other: "{count} live sessions will be disposed first.",
    },
    workspaceUntouchedPrefix: "The project's workspace folder on disk is ",
    workspaceUntouchedNot: "not",
    workspaceUntouchedSuffix: " touched.",
    ackPrefix: "Yes, I understand this will delete ",
    ackSessions: {
      one: "{count} session",
      other: "{count} sessions",
    },
    ackLiveAndOnDisk: " ({live} live, {onDisk} on disk)",
    ackLiveOnly: " ({live} live)",
    ackSuffix: ". This can't be undone.",
  },

  sessionList: {
    empty: "No sessions yet.",
    selectedCount: "{count} selected",
    deleteTitle: {
      one: "Delete {count} session",
      other: "Delete {count} sessions",
    },
    deleteMessage: {
      one: "Delete the {count} selected session? Live sessions are killed and on-disk JSONLs are removed. Cannot be undone.",
      other:
        "Delete the {count} selected sessions? Live sessions are killed and on-disk JSONLs are removed. Cannot be undone.",
    },
    deleteAll: "Delete all",
  },

  sessionRow: {
    untitled: "session {id}",
    agentWorking: "Agent is working",
    newResponse: "New response",
    childSessions: {
      one: "{count} child/worker session",
      other: "{count} child/worker sessions",
    },
    collapseChildren: "Collapse child sessions",
    expandChildren: "Expand child sessions",
    rowTitle: "{id} — double-click to rename, Cmd/Ctrl+click to select for bulk delete",
    childMarker: "child/worker session",
    deleteArmedTitle: "Click again to delete (Esc to cancel)",
    deleteLiveTitle: "Delete session — also kills the live shell",
    deleteDiskTitle: "Delete session JSONL from disk",
    confirmDelete: "Confirm delete",
    deleteSession: "Delete session",
    confirm: "Confirm",
  },

  picker: {
    titleClone: "Clone repository",
    titleNew: "New project",
    titlePick: 'Pick a folder for "{name}"',
    tabCreate: "Create / pick folder",
    tabClone: "Clone repository",
    projectName: "Project name",
    willCreate: "Will create {path}",
    createProject: "Create project",
    nextPickFolder: "Next: pick folder",
    atWorkspaceRoot: "At workspace root",
    upOneFolder: "Up one folder",
    up: "↑ up",
    pathLoading: "(loading)",
    emptyFolder: "(empty)",
    select: "Select",
    folderNamePlaceholder: "folder name",
    createAndSelect: "Create + select",
    back: "← Back",
    newFolder: "+ New folder",
    selectThisFolder: "Select this folder",
    pickSubfolder: "Pick a sub-folder — the workspace root itself can't be a project.",
    useThisFolder: "Use this folder as the project root",
  },

  clone: {
    urlLabel: "Repository URL",
    branchLabel: "Branch (optional)",
    branchPlaceholder: "default branch",
    folderLabel: "Folder name",
    folderPlaceholder: "auto from URL",
    projectPlaceholder: "auto from folder",
    willCloneInto: "Will clone into {path}",
    tokenLabel: "Access token (optional, for private repos)",
    tokenPlaceholder: "ghp_... / glpat_... / etc.",
    tokenHintPrefix: "Sent over HTTPS, embedded as ",
    tokenHintMiddle: " in the clone URL, and stripped from ",
    tokenHintSuffix: " after success.",
    insecureTlsLabel: "Allow self-signed / invalid TLS certificate",
    insecureTlsHintPrefix:
      "⚠ Disables MITM protection for this clone and persists a URL-scoped local git config entry for future fetch/pull/push. Use only for internal Git hosts with known self-signed certs/private CAs. The server logs ",
    insecureTlsHintSuffix: " to stderr on every use.",
    phaseStarting: "starting…",
    phaseStartingClone: "starting clone",
    phaseDone: "clone complete, creating project…",
    logCloning: "→ cloning {url}",
    rawOutput: "Raw output ({count})",
    cancelClone: "Cancel clone",
    cloning: "Cloning…",
    submit: "Clone + create project",
  },

  error: {
    label: "Error: {code}",
    pathNotAllowed: "That folder is outside the workspace root.",
    notADirectory: "That path is not a directory.",
    alreadyExists: "A folder with that name already exists.",
    duplicatePath: "Another project already points at that folder.",
    networkError: "Couldn't reach the server.",
  },
} as const;
