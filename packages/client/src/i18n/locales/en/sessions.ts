/**
 * sessions — English strings.
 *
 * The session tree viewer (list + branching graph views) and its
 * navigate-confirm dialog. English is the reference language: the key
 * set defined here is the contract every other locale is checked
 * against.
 *
 * Session titles, message previews and any other agent/user-generated
 * text are NOT translated — they render verbatim in every locale.
 */

export const sessions = {
  tree: {
    title: "Session tree",
    viewList: "List",
    viewListTooltip: "Vertical list view",
    viewGraph: "Graph",
    viewGraphTooltip: "Branching graph view (turn-grouped)",
    refresh: "Refresh tree",
    loading: "Loading tree…",
    empty: "No entries yet.",
    hint: "Click a row to navigate · fork icon on user messages to branch from that point",
    entryCount: {
      one: "{count} entry",
      other: "{count} entries",
    },
    /** Badge text for an entry's role / type, keyed by the raw
     *  discriminator the component computes (`user`, `assistant`,
     *  `tool`, `compact`, …). Unknown values render verbatim. */
    entryLabels: {
      message: "message",
      user: "user",
      assistant: "assistant",
      tool: "tool",
      toolResult: "toolResult",
      system: "system",
      compactionSummary: "compactionSummary",
      thinking: "thinking",
      model: "model",
      compact: "compact",
      branch: "branch",
      label: "label",
      info: "info",
      custom: "custom",
      extension: "extension",
    },
    leafBadge: "leaf",
    branchBadge: "branch {level}",
    branchHeadTooltip: "First entry of a divergent branch",
    siblingsTooltip: {
      one: "{count} branch diverges from this point",
      other: "{count} branches diverge from this point",
    },
    navigateTooltip: "Navigate the session leaf to this entry",
    currentLeafTooltip: "Current leaf",
    forkTooltip:
      "Fork BEFORE this message — opens a new session with the message text loaded into the input for editing.",
  },

  navigate: {
    title: "Navigate session leaf",
    streamingWarning: "The agent is currently running. Navigating will abort the in-progress turn.",
    abandonExplanation:
      "You're leaving the current branch behind. The tip stays on the tree (you can navigate back to it any time), but you can also bookmark + summarize it before moving on.",
    labelLabel: "Label for the abandoned branch tip ",
    labelPlaceholder: "e.g. wrong-approach",
    summarizePrefix: "Have pi write a ",
    summarizeSuffix: " entry capturing what this branch did. Costs one extra LLM call.",
    customInstructionsLabel: "Custom summarizer instructions ",
    customInstructionsPlaceholder: "e.g. Focus on what files were changed and why",
    confirm: "Confirm navigation?",
    abortAndNavigate: "Abort & navigate",
    navigate: "Navigate",
  },

  graph: {
    noTurns: "No turns to render.",
    navigateTooltip: "Navigate to this turn",
    currentLeafTooltip: "Current leaf turn",
    forkTooltip:
      "Fork AFTER this turn — opens a new session that includes this turn's full output, ready for the next prompt.",
    childBranchesTooltip: {
      one: "{count} branch diverges from here",
      other: "{count} branches diverge from here",
    },
    assistantCountTooltip: "Assistant messages within this turn",
    toolCountTooltip: "Tool results within this turn",
    thinkingCountTooltip: "Thinking blocks",
    metaCountTooltip: "Meta entries (model_change, branch_summary, etc.)",
    noText: "(no text)",
  },
} as const;
