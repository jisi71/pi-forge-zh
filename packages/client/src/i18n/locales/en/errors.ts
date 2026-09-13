/**
 * errors — English strings.
 *
 * Human-readable messages authored in non-React modules: the Zustand
 * stores (`store/*.ts`) and `lib/api-client`, `lib/sse-client`. Almost
 * all of this surfaces as a per-session banner, a status-bar hint or a
 * fallback error line — none of it is server copy.
 *
 * English is the reference language: the key set defined here is the
 * contract every other locale is checked against.
 *
 * Interpolated values are deliberately left verbatim: error codes,
 * provider/model ids, paths, HTTP status text and the raw `message`
 * field the server or the pi SDK produced.
 */

export const errors = {
  /**
   * Per-session banner text raised by `store/session-store.ts`.
   * `{code}` / `{message}` carry server or SDK text unchanged.
   */
  session: {
    readOnlyExternal: "Read-only: pi-subagents child is {state} externally",
    readOnlySnapshotFailed: "read-only snapshot failed: {code}",
    reconnecting: "Reconnecting (attempt {attempt}, {seconds}s) — {reason}",
    streamError: "stream error: {code}",
    promptRejected: "prompt rejected: {code}",
    promptRejectedWithMessage: "prompt rejected: {code} — {message}",
    promptRejectedMessage: "prompt rejected: {message}",
    agentError: "Agent error: {message}",
    refreshAfterAgentFailed: "Couldn't refresh messages after the agent finished — reload to sync",
    compacting: "Compacting context…",
    retrying: "Retrying ({attempt}/{max})…",
  },

  /** Editor banners raised by `store/file-store.ts`. */
  file: {
    binaryFile: "Binary file — open externally to edit.",
  },

  /** Terminal tab labels raised by `store/terminal-store.ts`. */
  terminal: {
    tabLabel: "Terminal {index}",
  },

  /**
   * Wire-shape diagnostics from `lib/api-client`. These fire only when
   * the server breaks its own response contract; the schema hints
   * ("expected { … }") stay in English because they describe JSON
   * payloads rather than prose.
   */
  api: {
    nonJsonErrorBody: "non-JSON {status} body",
    nonJsonSuccessBody: "server returned non-JSON 2xx body",
  },

  /** Reconnect reasons reported by `lib/sse-client.ts`. */
  sse: {
    serverClosedStream: "server closed stream",
  },

  /**
   * Last-resort screen rendered by the root error boundary in
   * `main.tsx` when a render throws. Kept intentionally small — if the
   * i18n runtime itself is what broke, the English string is still
   * readable.
   */
  crash: {
    title: "{brand}: render crash",
    noStack: "(no stack)",
    tip: "Tip: open the browser console for more detail. Try clearing localStorage (devtools → Application → Local Storage → Clear) and refreshing if the error mentions stale state.",
  },
} as const;
