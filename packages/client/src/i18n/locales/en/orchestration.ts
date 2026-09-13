/**
 * orchestration — English strings.
 *
 * Three collaborating surfaces:
 *   - the session orchestration panel (supervisor / worker / standalone),
 *   - the to-do panel (bottom strip of the right pane),
 *   - the context & token inspector.
 *
 * English is the reference language: the key set defined here is the
 * contract every other locale is checked against.
 *
 * Worker ids, session ids, model/provider ids, tool names, sub-agent
 * output and to-do item text are NOT translated.
 */

export const orchestration = {
  panel: {
    title: "Orchestration",
    roles: {
      supervisor: "Supervisor",
      worker: "Worker",
      standalone: "Standalone",
    },
  },

  standalone: {
    descriptionPrefix:
      "This session is standalone. Enable supervisor mode to give this session the ",
    descriptionSuffix:
      " tools — letting it spawn, observe, and coordinate other worker sessions in the same project.",
    enabling: "Enabling…",
    enable: "Enable supervisor mode",
    toolListRefreshed: "The agent's tool list refreshes immediately — no reload needed.",
  },

  supervisor: {
    disableConfirm: "Disable supervisor mode? Linked workers become standalone sessions.",
    killConfirm: "Kill worker {id}? (Transcript stays on disk.)",
    clearInboxConfirm: "Clear worker event history?",
    workerCount: {
      one: "{count} worker",
      other: "{count} workers",
    },
    disable: "Disable supervisor mode",
    emptyPrefix: "No workers yet. The agent can spawn one with ",
    emptySuffix: ".",
    messageCount: "({count} msgs)",
    resume: "Resume",
    detach: "Detach",
    detachTooltip: "Detach (worker continues as standalone)",
    kill: "Kill",
    killTooltip: "Kill (dispose live session; transcript stays on disk)",
    eventHistory: "Worker event history ({count})",
    noEvents: "No worker events.",
    clearHistory: "Clear event history",
  },

  /** Worker event-history badges, keyed by the raw inbox item type. */
  inbox: {
    ended: "ended",
    asked: "asked",
    retryFailed: "retry failed",
    process: "process",
    deleted: "deleted",
    detached: "detached",
  },

  /** Live-state tooltip on the worker status dot, keyed by state. */
  workerState: {
    streaming: "streaming",
    idle: "idle",
    cold: "cold",
  },

  worker: {
    ownedBySupervisor: "Owned by supervisor",
    handoffWithSummary: "(handoff with context summary)",
  },

  todos: {
    title: "Todos",
    inProgressSuffix: " · {count} in progress",
    hideTooltip: "Hide todo panel",
    loadFailed: "Failed to load todos: {message}",
    empty: "No todos yet. The agent will add tasks here when it's planning multi-step work.",
    groups: {
      inProgress: "In Progress",
      pending: "Pending",
      completed: "Completed",
    },
    blockedBy: "blocked by:",
    owner: "owner:",
    /** Accessible names for the status icons, keyed by task status. */
    status: {
      pending: "pending",
      inProgress: "in progress",
      completed: "completed",
      deleted: "deleted",
    },
  },

  context: {
    selectSession: "Select a session to inspect its context.",
    title: "Context inspector",
    noData: "No data — try refresh.",
    rawTitle: "Message {index} — raw AgentMessage JSON",
    usageEstimate: "estimate",
    usageCurrent: "current",
    contextWindow: "Context window ({label})",
    lastTurn: "Last turn",
    lastTurnTooltip:
      "New = user message + tool results since the prior assistant turn (estimate). Out = assistant output tokens. Cost = that turn's billed cost.",
    lastTurnFormula: "~{newTokens} new · {outTokens} out · {cost}",
    inputLifetime: "Input (lifetime)",
    inputLifetimeTooltip:
      "Sum of `usage.input` per turn — NEW non-cached input the LLM saw across the session. Excludes cached portions (tracked separately below).",
    cacheServedLifetime: "Cache served (lifetime)",
    cacheServedLifetimeTooltip:
      "Sum of `usage.cacheRead` per turn — prior context served from the prompt cache. Counted ONCE PER API CALL: every turn re-reads the same cached content and re-pays the (discounted) read fee, so this number grows ~quadratically with conversation length. Billed at ~10% of input rate on most providers.",
    cacheWrittenLifetime: "Cache written (lifetime)",
    cacheWrittenLifetimeTooltip:
      "Sum of `usage.cacheWrite` per turn — portions cached for reuse on subsequent turns. Billed at ~125% of input rate; small premium up front for big savings on the cache-served line.",
    outputLifetime: "Output (lifetime)",
    outputLifetimeTooltip: "Sum of `usage.output` per turn — assistant tokens generated.",
    totalCost: "Total cost",
    perTurn: "Per-turn ({count})",
    inContext: "What's in the context",
    breakdownTooltip: "Sum of category estimates (~chars/3)",
    tokensApprox: "~{tokens} tok",
    segmentTitle: "{label}: {tokens} tok ({percent}%)",
    /** Breakdown categories, keyed by the raw bucket name. */
    categories: {
      systemAndTools: "System + tools",
      userPrompts: "User prompts",
      assistantText: "Assistant text",
      thinking: "Thinking",
      toolCalls: "Tool calls",
      toolResults: "Tool results",
      images: "Images",
    },
    columns: {
      new: "New",
      prompt: "Prompt",
      out: "Out",
      cost: "Cost",
    },
    newColumnTooltip:
      "Estimated new tokens this turn — user message + tool results since the prior assistant turn (~chars/3 estimate). Distinct from Prompt.",
    promptColumnTooltip:
      "Full prompt sent to the LLM = usage.input + cacheRead + cacheWrite. Includes ALL re-sent prior context — this grows monotonically with conversation length, which is normal LLM behavior.",
    outColumnTooltip: "Assistant output tokens this turn",
    costColumnTooltip: "Cost billed for this turn",
    newContentTooltip: "New content (estimate)",
    messages: "Messages ({count})",
    showThinking: "Show thinking blocks",
    findPlaceholder: "Find in messages…",
    streamingBadge: "assistant (streaming)",
    compactedBadge: "compacted",
    viewRawTooltip: "View raw AgentMessage JSON",
    toolPrefix: "tool:",
    toolCallPrefix: "tool call:",
    errorSuffix: "(error)",
    imageAttachment: "[image attachment]",
    /** Message role badges, keyed by the raw `message.role` value. */
    roleLabels: {
      user: "user",
      assistant: "assistant",
      tool: "tool",
      toolResult: "toolResult",
      system: "system",
      compactionSummary: "compactionSummary",
      unknown: "unknown",
    },
  },
} as const;
