/**
 * webhooks — English strings.
 *
 * Settings → Webhooks tab: webhook list, create/edit form, delivery
 * history. English is the reference language: the key set defined here
 * is the contract every other locale is checked against.
 *
 * Kept verbatim in every locale: webhook `url`s, the `webhook.test`
 * event name, HTTP header names, `X-Pi-Forge-Signature`, the
 * `***REDACTED***` sentinel, error codes, and the raw `WebhookEvent`
 * identifiers rendered in monospace.
 */

export const webhooks = {
  introPrefix:
    "Webhooks fire HTTP POSTs to URLs you configure when agent or session events happen. Useful for Slack notifications, CI integrations, audit logs, etc. Stored at",
  introSuffix: ".",
  newWebhook: "+ New webhook",
  empty: "No webhooks configured.",

  /** Display labels for the raw `WebhookEvent` ids. The ids themselves
   *  are rendered next to these labels and are never translated. */
  events: {
    agentEnd: "Agent turn finished",
    askUserQuestion: "Agent asked a question (waiting on user)",
    processAlert: "Background process exited",
    autoRetryEnd: "Auto-retry exhausted (provider failure)",
    compactionEnd: "Context compaction completed",
    sessionCreated: "Session created",
    sessionDeleted: "Session deleted",
  },

  draft: {
    editTitle: "Edit webhook",
    newTitle: "New webhook",
    urlLabel: "URL (HTTPS only)",
    eventsLegend: "Events",
    scopeLegend: "Scope",
    scopeGlobal: "Global (every project)",
    scopeProject: "Specific project:",
    /** Trailing space is the separator before the optional hint below.
     *  Chinese needs no separator, so zh-CN omits it. */
    secretLabel: "HMAC secret (optional) ",
    secretKeepHint: "— leave blank to keep the existing secret",
    secretPlaceholderUnchanged: "(unchanged)",
    secretPlaceholder: "shared secret for X-Pi-Forge-Signature",
    headersLabelPrefix: "Custom headers (optional, one per line,",
    headersLabelSuffix: ")",
    headersMaskedPrefix: "Stored values are masked as",
    /** Rendered immediately after the `***REDACTED***` code element.
     *  The leading space is the separator there; Chinese punctuation
     *  attaches directly, so zh-CN omits it. */
    headersMaskedSuffix:
      " for safety. Leave any line with the sentinel intact to keep the original value; replace it to update; delete the line to remove the header.",
    insecureTlsLabel: "Allow self-signed / invalid TLS certificate",
    insecureTlsHint:
      "⚠ Disables MITM protection. Use only for internal hosts with known self-signed certs. Every fire logs to stderr so the relaxed security is visible in operator logs.",
    enabledLabel: "Enabled (disable to pause without losing config)",
    saveChanges: "Save changes",
    createWebhook: "Create webhook",
  },

  row: {
    scopeGlobal: "Global",
    scopeProject: "Project: {name}",
    signedBadge: "signed",
    insecureTlsBadge: "insecure TLS",
    insecureTlsBadgeTooltip: "TLS cert validation disabled for this webhook",
    testButton: "Test",
    testTooltip: "Fire a synthetic webhook.test event at this webhook",
    deleteTooltip: "Delete this webhook",
    hideDeliveries: "Hide deliveries",
    showDeliveries: "Show recent deliveries",
  },

  deliveries: {
    title: "Recent deliveries",
    titleWithCount: "Recent deliveries ({count})",
    empty: "No deliveries yet.",
  },
} as const;
