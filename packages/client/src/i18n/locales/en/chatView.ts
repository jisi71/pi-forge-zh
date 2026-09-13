/**
 * chatView — English strings.
 *
 * Conversation transcript rendering: message list, tool-call cards,
 * diffs inside the transcript, compaction summaries, turn diffs and the
 * ask-user-question prompt. English is the reference language: the key
 * set defined here is the contract every other locale is checked
 * against.
 *
 * Sections follow the component that owns the copy:
 *   toolbar / banner / empty      → ChatView.tsx chrome
 *   role / queued / activeTool …  → ChatView.tsx renderers
 *   diffBlock                     → DiffBlock.tsx
 *   compaction                    → CompactionCard.tsx
 *   turnDiff                      → TurnDiffPanel.tsx
 *   question                      → AskUserQuestionPanel.tsx
 *   markdown                      → ChatMarkdown.tsx
 *
 * Tool names ("read", "bash", "edit", …), model ids, paths, diffs and
 * anything produced by the agent or the user stay verbatim in every
 * locale.
 */

export const chatView = {
  // Toolbar -----------------------------------------------------------
  toolbar: {
    export: "Export",
    exportTitle: "Export this conversation",
    exportMarkdown: "Markdown",
    exportRawJsonl: "Raw JSONL",
    exportFailed: "Export failed: {error}",
    tree: "Tree",
    treeTitle: "Open session tree (navigate / fork from any prior point)",
    orch: "Orch",
    orchTitle: "Orchestration — supervisor / worker controls",
  },

  // Banners / empty states --------------------------------------------
  banner: {
    dismiss: "Dismiss banner",
  },
  extensionNotification: {
    /** `level` is an upstream enum value (info / warning / …) — kept verbatim. */
    levelLabel: "extension {level}",
    dismiss: "Dismiss extension notification",
  },
  empty: {
    noMessages: "No messages yet. Send a prompt to get started.",
  },
  streaming: {
    label: "assistant (streaming)",
  },
  unknownMessage: {
    summary: "unknown message ({type})",
  },
  message: {
    attachmentFallback: "attachment",
  },

  // Roles and copy affordances ----------------------------------------
  role: {
    you: "you",
    assistant: "assistant",
  },
  copy: {
    messageText: "Copy message text",
    assistantText: "Copy all text from this assistant message",
  },

  // Queued steering / follow-up messages ------------------------------
  queued: {
    title: "queued ({count})",
    steer: "steer",
    followUp: "follow-up",
    steerTitle: "Delivered at the agent's next decision point (often mid-tool)",
    followUpTitle: "Delivered after the agent goes fully idle",
  },

  // In-flight placeholders --------------------------------------------
  activeTool: {
    thinking: "Thinking",
    thinkingAria: "Agent is thinking",
    running: "running",
  },
  toolCallGeneration: {
    label: "generating tool call",
    aria: "Agent is generating a tool call",
  },

  // Inline edit diff in the transcript --------------------------------
  chatEditDiff: {
    copy: "Copy edit output",
    toUnified: "Switch chat diffs to unified view",
    toSplit: "Switch chat diffs to side-by-side view",
  },

  // File-reference badges ---------------------------------------------
  fileRef: {
    inlineTitle: "{path} — click to {action}",
    deferTitle:
      "{path} — model will load this on demand using its read tool (file is larger than the inline threshold)",
    onDemand: "on demand",
  },

  // Forge lifecycle / status notifications ----------------------------
  lifecycle: {
    process: {
      completed: "Process completed: {name}",
      failed: "Process failed: {name}",
      killed: "Process killed: {name}",
      watchMatched: "Process watch matched: {name}",
      update: "Process update: {name}",
      fallback: "process",
    },
    worker: {
      completed: "Worker completed: {id}",
      failed: "Worker failed: {id}",
      removed: "Worker removed: {id}",
      needsInput: "Worker needs input: {id}",
      update: "Worker update: {id}",
      fallback: "worker",
    },
  },

  // Assistant message chrome ------------------------------------------
  providerError: "Provider error: ",
  thinkingSummary: "Thinking…",
  blockSummary: "block ({type})",
  errorBadge: "error",

  // Batched tool calls ------------------------------------------------
  toolBatch: {
    childFailures: {
      one: "{count} child failed",
      other: "{count} children failed",
    },
    label: "tools",
    callCount: {
      one: "{count} call",
      other: "{count} calls",
    },
    inFlight: "{count} running…",
    childFailuresTitle:
      "One or more child tool calls failed; expand the batch to see the failed call.",
  },

  // Single tool call --------------------------------------------------
  toolCall: {
    running: "running…",
    input: "Input",
    output: "Output",
    empty: "(empty)",
    copyInput: "Copy {name} input",
    copyOutput: "Copy {name} output",
  },

  // Standalone tool results -------------------------------------------
  toolResult: {
    bashOutput: "bash output",
    copyRead: "Copy read output",
    copyBash: "Copy bash output",
    copyWrite: "Copy write output",
    copyGeneric: "Copy {name} output",
  },

  // Sub-agent cards ---------------------------------------------------
  subagent: {
    running: "Sub-agent running…",
    summaryAction: "action: {action}",
    summaryParallelTasks: {
      one: "{count} parallel task",
      other: "{count} parallel tasks",
    },
    summaryChain: "{count}-step chain",
    headlineSingle: "Sub-agent: {agent}",
    headlineMultiple: "{count} sub-agents ({mode})",
    headlineManagement: "Sub-agent management",
    contextFork: "Forked from parent context",
    contextFresh: "Fresh context",
    openTitle: "Open sub-agent session — {path}",
    copyInput: "Copy subagent input",
    copyOutput: "Copy subagent output",
  },
  subagentNotify: {
    label: "subagent",
    fallback: "Background subagent update",
  },

  // Bash execution cards ----------------------------------------------
  bashExecution: {
    localOnly: "local-only",
    localOnlyTitle: "!! prefix — kept out of LLM context on the next turn",
    timedOut: "timed out",
    truncated: "truncated",
    exitZeroTitle: "exit 0",
  },
  exitCode: "exit {code}",

  // Raw / rendered toggle ---------------------------------------------
  rawToggle: {
    rendered: "rendered",
    raw: "raw",
    showRendered: "Show rendered markdown",
    showRaw: "Show raw text",
  },

  // DiffBlock ---------------------------------------------------------
  diffBlock: {
    applyHunk: "Apply hunk",
    hunkLabel: "Hunk {number}",
    largeDiffTitle:
      "Showing ~{shown} of {total} lines — large diffs slow the renderer; click to render the rest.",
    showAll: "Show all ({lines} lines, {hunks} hunks)",
  },

  // ChatMarkdown ------------------------------------------------------
  markdown: {
    copyCode: "Copy code block",
  },

  // CompactionCard ----------------------------------------------------
  compaction: {
    collapse: "Collapse",
    collapseTitle: "Collapse archived messages",
    collapseAriaTop: "Collapse compaction summary from top",
    collapseAriaBottom: "Collapse compaction summary from bottom",
    hideTitle: "Hide archived messages",
    expandTitle: {
      one: "Expand {count} archived message",
      other: "Expand {count} archived messages",
    },
    fallbackTitle: "Compaction",
    meta: "{messages} msg · {tokens} tok · {time}",
  },

  // TurnDiffPanel -----------------------------------------------------
  turnDiff: {
    pickSession: "Pick a session to see its file changes.",
    lastTurn: "Last turn",
    toUnified: "Switch to unified view",
    toSplit: "Switch to side-by-side view",
    refresh: "Refresh diff",
    errorLoad: "Couldn't load the latest turn diff (see banner).",
    empty: "No file changes from the most recent turn.",
    newFile: "new",
  },

  // AskUserQuestionPanel ----------------------------------------------
  question: {
    header: "Agent question",
    progress: "{current} of {total}",
    chatAboutThis: "Chat about this",
    chatAboutThisTitle: "Abandon the structured questionnaire and reply in free-form chat",
    submitting: "Submitting…",
    noPreview: "No preview for this option.",
    typeSomething: "Type something",
    customPlaceholder: "Or type your own answer…",
  },
} as const;
