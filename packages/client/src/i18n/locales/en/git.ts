/**
 * git — English strings.
 *
 * Git panel: header/worktree picker, staged-unstaged-untracked file
 * groups, commit box, fetch/pull/push controls, log graph, branches and
 * remotes sections, plus the dialogs behind them.
 *
 * Branch names, refs, commit hashes and messages, remote URLs, author
 * names, porcelain codes and raw git output always stay verbatim.
 */

export const git = {
  pickProject: "Pick a project to see its git status.",

  target: {
    configuredUpstream: "the configured upstream",
  },

  init: {
    notARepo: "{name} isn't a git repository.",
    title: "Run `git init -b main` in the project root",
    initializing: "Initializing…",
    action: "Initialize git repo",
    defaultBranchPrefix: "Default branch will be ",
    defaultBranchSuffix: ".",
    failed: "git init failed: {error}",
  },

  header: {
    worktree: "Worktree",
    worktreeTitle: "Viewing git info for {path}",
    loadingWorktrees: "Loading git worktrees",
    noWorktrees: "No worktrees",
    switchToUnified: "Switch git diffs to unified view",
    switchToSplit: "Switch git diffs to side-by-side view",
  },

  status: {
    clean: "Working tree clean.",
    porcelainTitle: "porcelain code: {code}",
    revert: "Revert",
    revertTitle: "Revert: discard local changes for this file",
    revertConfirmTitle: "Click again to discard local changes (this cannot be undone)",
    confirm: "Confirm?",
    diffFailed: "Failed to load diff.",
    diffEmpty: "(no diff — file is binary or unchanged)",
  },

  revert: {
    doneOne: "Reverted {path}",
    doneMany: {
      one: "Reverted {count} file",
      other: "Reverted {count} files",
    },
  },

  hunk: {
    applyFailed: "Hunk apply failed: {error}",
  },

  group: {
    staged: "Staged",
    unstaged: "Unstaged",
    untracked: "Untracked",
    stageAll: "Stage all",
    unstageAll: "Unstage all",
    stage: "Stage",
    unstage: "Unstage",
    stageHunk: "Stage hunk",
    unstageHunk: "Unstage hunk",
  },

  commit: {
    heading: "Commit",
    placeholder: "Commit message…",
    stagedCount: "{count} staged",
    done: "Committed {hash}",
  },

  push: {
    heading: "Push",
    hideOptions: "Hide options",
    configuredUpstream: "configured upstream",
    currentBranch: "current branch",
    current: "current",
    setUpstream: "Set upstream (first push of a new branch)",
    fetch: "Fetch",
    fetching: "Fetching…",
    fetchTitleRemote:
      "Fetch remote-tracking updates from {remote}; the working tree is not changed.",
    fetchTitleUpstream:
      "Fetch remote-tracking updates from the configured upstream; the working tree is not changed.",
    pull: "Pull",
    pulling: "Pulling…",
    pullTitle:
      "Fetch and merge the selected upstream into this worktree. Conflicts are shown in the error banner; resolve them in the integrated terminal.",
    push: "Push",
    pushed: "Pushed",
    pushTitleUpstream: "git push (configured upstream)",
    pushTitleArgs: "git push {remote}{branch}",
  },

  sync: {
    fetching: "Fetching from {target}…",
    pulling: "Pulling from {target}…",
    fetchSuccessNoDetail: "Fetch complete from {target}. No remote updates were reported.",
    fetchSuccess: "Fetch complete from {target}. Latest update: {detail}",
    pullUpToDate: "Already up to date. Your local branch matches {target}.",
    pullSuccessNoDetail: "Pull complete from {target}. Refreshing the working tree status now.",
    pullSuccess: "Pull complete from {target}. Latest update: {detail}",
    fetchFailed:
      "Fetch failed: {message}. Check the remote name, network connection, and Git credentials.",
    pullFailed:
      "Pull failed: {message}. If there are conflicts, resolve them in the terminal, then refresh git status.",
  },

  log: {
    heading: "Log",
    empty: "No commits yet.",
  },

  branches: {
    heading: "Branches",
    remoteTag: "remote",
    checkout: "checkout",
    checkoutTitle: "Checkout {branch}",
    checkoutRemoteTitle: "Checkout (creates a tracking branch from {branch})",
    deleteTitle: "Delete branch",
    deleteConfirm:
      'Delete branch "{name}"? Refused if not merged into HEAD; force-delete from the terminal if you really mean it.',
    new: "New branch",
    nameLabel: "Branch name",
    createCheckout: "Create + checkout",
  },

  remotes: {
    heading: "Remotes",
    empty: "No remotes configured.",
    diverged: "fetch ≠ push",
    ignoreTls: "ignore tls",
    ignoreTlsTitle: "TLS certificate verification disabled for this remote URL in local git config",
    ignoreTlsLabel: "Ignore SSL/TLS verification for this remote (local repo config only)",
    ignoreTlsLabelShort: "Ignore SSL/TLS verification for this remote",
    ignoreTlsHelp:
      "Persists only in this repository as URL-scoped git config. Use only for internal Git hosts with a known self-signed/private-CA certificate.",
    pushUrl: "push → {url}",
    add: "Add remote",
    remove: "Remove remote",
    removeTitle: 'Remove remote "{name}"',
    removeConfirm:
      'Remove remote "{name}"? The local repo loses its reference to this URL; existing commits aren\'t affected.',
  },
} as const;
