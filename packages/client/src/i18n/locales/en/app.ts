/**
 * app — English strings.
 *
 * The application shell: header chrome and pane toggles, the right-pane
 * tab strip, the empty/loading states, the PWA install banner, the
 * changed-files badge and the MCP status badge.
 *
 * English is the reference language: the key set defined here is the
 * contract every other locale is checked against.
 */

export const app = {
  nav: {
    openSidebar: "Open project sidebar",
    resizeSidebar: "Resize project sidebar",
    closeSidebar: "Close project sidebar",
    settingsTooltip: "Settings (providers, agent defaults, MCP, skills)",
  },

  /** Warning badge shown while OTEL content capture is enabled server-side. */
  telemetry: {
    badge: "OTEL content capture on",
    badgeTitle:
      "OTEL_CAPTURE_CONTENT is on: message and tool content may be exported in telemetry.",
  },

  panes: {
    chat: "Chat",
    editor: "Editor",
    toggleChat: "Toggle the chat pane",
    toggleEditor: "Toggle the editor pane (open tabs persist across reloads)",
    toggleFiles: "Toggle the file browser tree",
    toggleTerminal: "Toggle the integrated terminal",
  },

  tabs: {
    // "Git" is a product name — identical in every locale, listed here so
    // the decision is explicit rather than an accidental untranslated
    // literal.
    git: "Git",
    lastTurn: "Last turn",
  },

  empty: {
    newProject: "+ New project",
    pickSession: "Pick a session from the sidebar — or start a new one here.",
    newSession: "+ New session",
    selectProject: "Select a project from the sidebar.",
  },

  installPrompt: {
    banner: "Install {appName} as an app for a fullscreen experience.",
    iosPrefix: "Install: tap ",
    iosMiddle: " Share, then ",
    addToHomeScreen: "Add to Home Screen",
    iosSuffix: ".",
    dismissAria: "Dismiss install prompt",
  },

  changedFiles: {
    tooltip: "Open the Last turn pane to review what the agent just wrote",
    edited: {
      one: "{count} file edited",
      other: "{count} files edited",
    },
    review: "— review",
  },

  mcpBadge: {
    off: "MCP off",
    status: "MCP {connected}/{total}",
    offTooltip: "MCP tools disabled. Click to open Settings → MCP.",
    connectedTooltip: {
      one: "{connected} of {total} MCP server connected. Click to open Settings → MCP.",
      other: "{connected} of {total} MCP servers connected. Click to open Settings → MCP.",
    },
  },
} as const;
