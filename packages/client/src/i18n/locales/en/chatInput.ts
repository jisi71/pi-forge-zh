/**
 * chatInput — English strings.
 *
 * The composer: send/stop controls, slash-command palette, attachment
 * and popover affordances, quick-action menus. English is the reference
 * language: the key set defined here is the contract every other locale
 * is checked against.
 */

export const chatInput = {
  resizeHandle: "Resize chat input",
  resetHeight: "Reset chat input height to default",
  errorPrefix: "Error: {message}",

  fileRef: {
    title: "@{path} — model will use its read tool to load this file when it needs to",
    remove: "Remove @{path}",
  },

  // Slash-command palette. `name` values (/compact, /settings, …) and
  // the `/<cmd>` tokens inside the help text are command identifiers and
  // stay untranslated in every locale.
  slash: {
    compact: "Manually compact the session context",
    clear: "Compact context (alias for /compact)",
    abort: "Stop the agent (alias for the Abort button)",
    settings: "Open the Settings panel",
    skills: "Open Settings → Skills",
    mcp: "Open Settings → MCP",
    providers: "Open Settings → Providers",
    helpMinimal: "Show what `/` and `@` do in the input",
    helpFull: "Show what `/`, `!`, `@` do in the input",
    helpTextMinimal:
      "/<cmd> runs a {brand} command (compact, abort, settings, …). @<path> references a project file (autocomplete from the popover); type \\@ for a literal @.",
    helpTextFull:
      "/<cmd> runs a {brand} command (compact, abort, settings, …). !cmd runs bash (output → next LLM context); !!cmd runs bash local-only. @<path> references a project file (autocomplete from the popover); type \\@ for a literal @.",
    promptArgs: "{description} — args: {args}",
    unavailable: "{description} — unavailable right now",
    hint: "↑↓ navigate · Enter/Tab run · Esc cancel",
  },

  ac: {
    hint: "↑↓ navigate · Enter/Tab insert · Esc close",
  },

  placeholder: {
    readOnly: "Read-only while this pi-subagents child is running externally…",
    autoRetry:
      "Auto-retry in progress — your message will be queued and sent after the retry completes…",
    steeringMobile: "Steer the agent…",
    steering: "Steer the agent (Enter to send; Shift+Enter for newline)…",
    idleMinimalMobile:
      "Ask pi — Enter for newline; Send to submit; `/` runs commands, `@path` references files…",
    idleMobile:
      "Ask pi — Enter for newline; Send to submit; `/` runs commands, `!` runs bash, `@path` references files…",
    idleMinimal:
      "Ask pi (Enter to send; Shift+Enter for newline) — `/` runs commands, `@path` references files…",
    idle: "Ask pi (Enter to send; Shift+Enter for newline) — `/` runs commands, `!` runs bash, `@path` references files…",
    retryTitle:
      "The agent is auto-retrying after a provider error. New messages are queued and delivered when the retry succeeds.",
  },

  bang: {
    local: "bash · local",
    context: "bash · context",
    localTitle: "!! — runs bash; output stays local (excluded from LLM context)",
    contextTitle: "! — runs bash; output is added to the next turn's LLM context",
  },

  error: {
    readOnlyExternal: "This pi-subagents child is running externally and is read-only.",
    pasteWhileStreaming:
      "Images pasted while streaming aren't attached. Wait for the current run to finish.",
    modelsUnavailable: "models unavailable ({code})",
    setModelFailed: "set model failed: {code}",
    setThinkingLevelFailed: "set thinking level failed: {code}",
    compactFailed: "Compact failed: {code}",
    clearFailed: "Clear failed: {code}",
    unknownCommand: 'Unknown command "{command}". Type /help to see commands.',
    unknownCommandHint:
      'Unknown command "{command}". Type /help to see commands, or backspace the leading / to send as a prompt.',
    bashDisabled: "Bash exec is disabled in this deployment.",
    emptyBash: "Empty bash command. Type something after the `!`.",
    attachmentsBashCleared: "Attachments aren't sent with `!` exec. Cleared.",
    attachmentsSteerCleared: "Attachments aren't sent on steer (mid-turn). Cleared.",
    commandFailed: "Command failed: {code}",
  },

  attachment: {
    tooManyTotal: 'Up to {max} attachments per message; "{name}" dropped.',
    tooLarge: '"{name}" exceeds the 20 MB per-file limit.',
    tooManyImages: 'Up to {max} images per message; "{name}" dropped.',
    binary:
      '"{name}" is a binary format that the agent can\'t read directly. Convert to text/markdown (or to a PNG/JPEG screenshot for diagrams) and try again.',
    remove: "Remove {name}",
    label: "Attach",
    filesLabel: "Attach files",
    photo: "Photo",
    file: "File",
    steerWarning: "Attachments aren't sent on steer (mid-turn).",
    steerWarningLong:
      "Attachments aren't sent on steer (mid-turn). Wait for the current run to finish.",
    mobileTitle: "Attach a photo or a file",
    desktopTitle:
      "Attach files (images go into model context; text files are prepended to the prompt)",
  },

  // Model picker. Provider ids, model ids and names come from the server
  // and are never translated.
  model: {
    label: "model:",
    defaultModel: "default model",
    defaultSuffix: "{label} (default)",
    triggerTitle: "Override the model for this session (click to search)",
    searchPlaceholder: "Search provider or model…",
    useAgentDefault: "Use agent default",
    noMatch: "No models match. Add an API key in Settings → Providers.",
    footer: "{filtered} of {total} models — ↑↓ to move, Enter to pick, Esc to close",
  },

  // Thinking-level picker. The level ids (off/minimal/low/…/xhigh) are
  // SDK values sent to the API verbatim.
  thinking: {
    label: "thinking:",
    triggerTitle: "Override the thinking level for this session",
  },

  processes: {
    showList: "Show processes list",
    viewPanel: "View processes panel",
    titleMobile: {
      one: "{count} background process running — show list",
      other: "{count} background processes running — show list",
    },
    titleDesktop: {
      one: "{count} background process running — view processes panel",
      other: "{count} background processes running — view processes panel",
    },
    popoverTitle: "Processes ({count} running)",
    exitCode: "exit {code}",
    empty: "No processes.",
    finished: "Finished",
    kill: "Kill",
    killTitle: "Kill this process",
  },

  todos: {
    showList: "Show tasks list",
    toggle: "Toggle todo panel",
    hide: "Hide todo panel",
    show: "Show todo panel ({done} done{inProgress})",
    titleMobile: "Tasks: {done} done{inProgress}",
    inProgressComma: ", {count} in progress",
    inProgressDot: " · {count} in progress",
    popoverTitle: "Tasks",
    popoverTitleCount: "Tasks · {done}/{total}{inProgress}",
    empty: "No tasks.",
  },

  sendTitle: "Send (Enter or Cmd/Ctrl+Enter)",
  sendTitleStreaming:
    "Send (Enter or Cmd/Ctrl+Enter; Pi queues at the next agent break — steer or follow-up depending on agent state)",
  abort: "Abort",
  abortTitle: "Stop the agent (or press Esc twice in the textbox)",
  streamingHint:
    "Enter, Cmd/Ctrl+Enter, or Send queues at the next agent break — Pi picks steer or follow-up. Abort: stop the agent (or press Esc twice in the textbox).",

  quickActions: {
    runTitle: "Run a saved quick action",
    label: "Actions",
    runningCount: {
      one: "{count} action running",
      other: "{count} actions running",
    },
    insertPreview: "Insert: {text}",
    sendPreview: "Send: {text}",
  },

  // Inline card for a quick-action run. Stream names (stdout/stderr) and
  // the captured output itself are technical and stay verbatim.
  runCard: {
    statusRunning: "running",
    statusError: "error",
    statusTimedOut: "timed out",
    statusAborted: "aborted",
    statusExitZero: "exit 0",
    statusExitCode: "exit {code}",
    truncated: "truncated",
    truncatedTitle: "Output exceeded the per-stream cap and was cut off",
    stopTitle: "Stop waiting on this run (server-side abort coming later)",
    useAsContext: "Use as context",
    useAsContextTitle: "Insert the captured output into the composer for your next prompt",
    hideOutput: "Hide output",
    showOutput: "Show output",
  },

  /**
   * Shown while the operator has OTEL content capture enabled: sending a
   * message requires acknowledging that its content is exported.
   */
  telemetry: {
    ack: "I acknowledge that this message and related tool/model content will be included in telemetry because OTEL_CAPTURE_CONTENT is enabled.",
  },
} as const;
