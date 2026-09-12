/**
 * terminal — English strings.
 *
 * The bottom-anchored terminal panel (xterm + PTY websocket) and the
 * right-pane Processes tab. English is the reference language: the key
 * set defined here is the contract every other locale is checked
 * against.
 *
 * Kept verbatim in every locale: everything the shell or a managed
 * process prints, `PID`, `stdout` / `stderr` stream names, ws close
 * codes, and the `ms` / `s` / `m` / `h` runtime suffixes.
 *
 * The `notices.*` strings are pi-forge's own chrome, written into the
 * xterm buffer when the websocket drops — they are NOT shell output and
 * are translated. Interpolated values (`code`, `seconds`, `attempt`)
 * come from the code, never from the shell.
 */

export const terminal = {
  panel: {
    selectProject: "Select a project to open a terminal.",
    noTerminals: "No terminals open.",
    closeTabTooltip: "Close terminal (kills the PTY)",
    newTabTooltip: "New terminal",
    newTab: "New",
    newTabHint: 'Click "New" to open a terminal in {path}.',
  },

  notices: {
    closed: "[connection closed: {code}]",
    closedAuth:
      "[connection closed (4401): your session expired — refresh the page after logging back in]",
    closedProjectGone: "[connection closed (4404): project no longer exists]",
    reconnecting: "[connection lost ({code}) — reconnecting in {seconds}s, attempt {attempt}]",
  },

  processes: {
    title: "Processes",
    counts: "{running} running · {finished} finished",
    clearFinished: "Clear finished",
    clearFinishedTooltip: "Drop all FINISHED processes from the list (running ones stay)",
    watchMore: {
      one: "+{count} more watch match",
      other: "+{count} more watch matches",
    },
    clearWatchAlerts: "Clear watch alerts",
    empty:
      "No background processes yet. The agent will add them here when it starts dev servers, test watchers, builds, etc.",
    groupFinished: "Finished",
    footer: "In-memory only — processes don't survive a server restart.",
    exitCode: "exit {code}",
    kill: "Kill",
    killFailed: "kill failed",
    stdoutTail: "stdout (tail)",
    stderrTail: "stderr (tail)",
    fullLog: "full {stream} log",
    loadingLog: "loading…",
    popupBlocked: "popup blocked — allow popups for this site",
    /** Screen-reader labels for the per-row status icon. */
    status: {
      running: "running",
      terminating: "terminating",
      killed: "killed",
      exitedZero: "exited 0",
      exitedNonZero: "exited non-zero",
    },
  },
} as const;
