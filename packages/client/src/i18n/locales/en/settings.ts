/**
 * settings — English strings.
 *
 * Strings for this area. English is the reference language: the key set
 * defined here is the contract every other locale is checked against.
 *
 * Sections are grouped per Settings tab. Keep keys grouped so the
 * zh-CN file can be reviewed side by side with this one.
 */

export const settings = {
  /**
   * `AuthStatus.source` from the pi SDK's auth-storage (a closed union:
   * "stored" | "runtime" | "environment" | "fallback" | "models_json_key" |
   * "models_json_command"). English keeps the raw SDK token; other locales
   * describe where the credential comes from.
   */
  credentialSource: {
    stored: "stored",
    runtime: "runtime",
    environment: "environment",
    fallback: "fallback",
    modelsJsonKey: "models.json key",
    modelsJsonCommand: "models.json command",
  },

  telemetry: {
    title: "Telemetry content capture",
    description:
      "Controls OTEL_CAPTURE_CONTENT at runtime. When enabled, full user and assistant message content plus tool inputs/results may be exported to OpenTelemetry.",
    includeContent: "Include message and tool content in telemetry",
    warning:
      "Enable only with an approved data-retention policy. Captured content can include source code, credentials, personal data, attachment text, and MCP/tool responses.",
    on: "On",
    off: "Off",
  },

  panel: {
    title: "Settings",
    apiDocs: "API Docs ↗",
    apiDocsTooltip:
      "Open the OpenAPI / Swagger UI in a new tab. Carries your auth token automatically.",
    closeTooltip: "Close (Esc)",
    tabs: {
      providers: "Providers",
      agent: "Agent",
      mcp: "MCP",
      tools: "Tools",
      sandbox: "Sandbox",
      skills: "Skills",
      prompts: "Prompts",
      systemPrompt: "System Prompt",
      quickActions: "Quick Actions",
      webhooks: "Webhooks",
      appearance: "Appearance",
      backup: "Backup",
      general: "General",
    },
  },

  /** Error-banner prefixes. `{code}` is a machine error code from the
   *  server and is never translated. */
  errors: {
    loadProviders: "Failed to load providers: {code}",
    saveKey: "Save key failed: {code}",
    removeKey: "Remove key failed: {code}",
    loadModelsJson: "Load models.json failed: {code}",
    saveFailed: "Save failed: {code}",
    loadSettings: "Failed to load settings: {code}",
    loadSkills: "Failed to load skills: {code}",
    toggleFailed: "Toggle failed: {code}",
    overrideWriteFailed: "Override write failed: {code}",
    loadPrompts: "Failed to load prompts: {code}",
    loadTools: "Failed to load tools: {code}",
    loadSystemPrompt: "Failed to load system prompt: {code}",
    clearFailed: "Clear failed: {code}",
    deleteFailed: "Delete failed: {code}",
    exportFailed: "Export failed: {code}",
    importFailed: "Import failed: {code}",
    skillsExportFailed: "Skills export failed: {code}",
    skillsImportFailed: "Skills import failed: {code}",
    loadToolListing: "Failed to load tool listing: {code}",
    loadMcpConfig: "Failed to load MCP config: {code}",
    toggleMcpFailed: "Failed to toggle MCP: {code}",
    updateMcpTruncation: "Failed to update MCP truncation: {code}",
    updateServerFailed: "Failed to update server: {code}",
    saveServerFailed: "Failed to save server: {code}",
    removeServerFailed: "Failed to remove server: {code}",
    probeFailed: "Probe failed for '{name}': {code}",
    grantTrustFailed: "Failed to grant trust: {code}",
    revokeTrustFailed: "Failed to revoke trust: {code}",
  },

  /** Shared vocabulary for the per-project override cascade used by the
   *  Skills, Prompts, Tools and MCP tabs. */
  overrides: {
    name: "Overrides",
    showTitle: "Show per-project overrides",
    globalState: "Global: {state}",
    inherit: "Inherit",
    empty: "No project overrides yet — every project inherits the global state.",
    addFor: "+ Add override for…",
    pickProject: "Pick project…",
    enableHere: "Enable here",
    disableHere: "Disable here",
    noProjects: "No projects exist yet. Create a project first to add per-project overrides.",
    effectiveTitle: "Effective for {name}: {state}",
    projectBadge: "Project: {state}",
    projectOverrideTitle: "Active project ('{name}') has an override",
    noDescription: "(no description)",
    /** Lowercase state words used inside "Global: {state}" / "Project: {state}"
     *  labels, where the raw server value ("enabled"/"disabled") used to be
     *  interpolated directly. */
    stateEnabled: "enabled",
    stateDisabled: "disabled",
  },

  /** Shared form chrome. */
  fields: {
    unset: "(unset)",
  },

  // ---------------- Providers tab ----------------

  providers: {
    loading: "Loading providers…",
    empty: "No providers configured.",
    introPrefix: "Built-in providers and anything in ",
    introSuffix:
      ". Stored API keys are presence-only — actual values are never sent to the browser.",
    keySet: "key set",
    noKey: "no key",
    viaSource: "via {source}",
    addKey: "Add key",
    replaceKey: "Replace key",
    keyPlaceholder: "Paste API key",
    confirmRemoveKey: 'Remove the stored key for "{provider}"?',
    modelCount: {
      one: "{count} model",
      other: "{count} models",
    },
    contextWindow: "ctx {count}k",
    customSummary: "Custom providers (models.json)",
    customHint:
      "Raw JSON editor. Add vLLM / LiteLLM / Ollama / OpenAI-compatible endpoints here. The SDK validates on next session creation.",
    customInvalidJson: "models.json: invalid JSON",
    customInvalidTopLevel: 'models.json: top-level must be { "providers": { ... } }',
  },

  // ---------------- Agent tab ----------------

  agent: {
    loading: "Loading settings…",
    intro:
      "Defaults for new sessions. The form covers common keys; switch to JSON to edit anything the SDK accepts.",
    editAsJson: "Edit as JSON",
    defaultProvider: "Default provider",
    defaultProviderHint: "e.g. anthropic, openai, google, custom",
    defaultModel: "Default model",
    defaultModelHint: "model id from the chosen provider",
    thinkingLevel: "Thinking level",
    thinkingLevelHint: "off, low, medium, high (provider-dependent)",
  },

  jsonEditor: {
    invalidJson: "settings.json: invalid JSON",
    invalidTopLevel: "settings.json: top-level must be an object",
    introPrefix: "Raw ",
    introMid: ". Keys removed here are deleted on save (mapped to ",
    introSuffix: " in the merge patch). The SDK validates on next session creation.",
    backToForm: "Back to form",
  },

  // ---------------- Skills tab ----------------

  skills: {
    pickProject: "Pick a project from the header to manage its skills.",
    loading: "Loading skills for {name}…",
    introPrefix: "Skills discovered in ",
    introMid: " and ",
    introMid2: ". The global toggle writes to pi's ",
    introMid3: "; per-project overrides write to the {brand}-private file at ",
    introSuffix: ".",
    warningPrefix: "Skill changes apply to the ",
    warningStrong: "next session",
    warningSuffix:
      " you start in the affected project. Live sessions keep the skill set they booted with — start a new session to use a freshly enabled skill.",
    empty: "No skills found for this project.",
    globalToggleTitle: "Global enable in pi's settings.skills",
  },

  // ---------------- Prompts tab ----------------

  prompts: {
    pickProject: "Pick a project from the header to manage its prompts.",
    loading: "Loading prompts for {name}…",
    introPrefix: "Pi prompt templates discovered in ",
    introMid: " and ",
    introMid2: ". Invoke from the chat input via ",
    introMid3: "; the global toggle writes to pi's ",
    introMid4: "; per-project overrides write to ",
    introSuffix: ".",
    warningPrefix: "Prompt changes apply to the ",
    warningStrong: "next session",
    warningSuffix:
      " you start in the affected project. Live sessions keep the prompt set they booted with — start a new session to use a freshly enabled prompt.",
    empty: "No prompts found for this project.",
    argumentHintTitle: "Argument hint from the prompt's frontmatter",
    globalToggleTitle: "Global enable in pi's settings.prompts",
  },

  diagnostics: {
    notLoaded: {
      one: "{count} skill file was not loaded:",
      other: "{count} skill files were not loaded:",
    },
    loser: "loser:",
    winner: "winner:",
    fixPrefix: "Add ",
    fixMid: " to the loser's frontmatter, or move it to ",
    fixSuffix: " so the parent dir name disambiguates.",
  },

  // ---------------- Sandbox tab ----------------

  sandbox: {
    title: "Sandbox mode",
    description:
      "Configure environment variables injected into future agent tool calls. Sandbox enablement, UID/GID, and tool HOME are deploy-time settings; changes here take effect for new or refreshed sessions.",
    loading: "Loading sandbox settings…",
    disabledNotice:
      "Sandbox tool overrides are disabled. Saved variables are persisted, but only injected into forge-managed tool shells; full filesystem sandboxing requires AGENT_TOOL_SANDBOX_ENABLED=true.",
    toolEnvironment: "Tool environment",
    addVariable: "Add variable",
    emptyEnv: "No sandbox tool environment variables configured.",
    envNameAria: "Environment variable name",
    envValueAria: "Environment variable value",
    valuePlaceholder: "value",
    hide: "Hide",
    reveal: "Reveal",
    secretsHint:
      "Values are masked by default and only revealed per row. They are still stored in {brand} data and passed to tool processes, so avoid secrets unless that storage is protected.",
    saveButton: "Save sandbox env",
    invalidEnvName: "Row {row}: invalid environment variable name",
  },

  // ---------------- Tools tab ----------------

  tools: {
    loading: "Loading tools…",
    introPrefix:
      "Toggle individual built-in tools the agent can call. The global toggle on the right is the default for every project. Use ",
    introMid:
      " to enable/disable a tool per project — explicit project overrides win over the global default. Changes apply to the next session — already-running sessions keep the tool set they started with. MCP server tools live under their respective server in the ",
    introSuffix: " tab.",
    builtinTitle: "Built-in tools",
    extensionTitle: "Extension tools",
    extensionIntroPrefix: "Tools registered programmatically by pi extensions installed under ",
    extensionIntroMid: " or a project's ",
    extensionIntroSuffix:
      ". Disabled tools are dropped from the allowlist passed to the next session — the extension itself remains loaded.",
    packageLabel: "Package: ",
  },

  toolCascade: {
    globalDefaultTitle: "Global default: {state}",
    bridgedNameTitle: "Bridged tool name pi sees on the wire",
    globalToggleTitle: "Global default for every project that doesn't override",
  },

  // ---------------- System Prompt tab ----------------

  systemPrompt: {
    pickProject: "Pick a project from the header to edit its system prompt addendum.",
    loading: "Loading system prompt for {name}…",
    saved: "Saved. Applies to the next session you start in this project.",
    cleared: "Cleared. Applies to the next session you start in this project.",
    confirmClear: 'Clear the system prompt addendum for "{name}"?',
    introPrefix: "Free-form text appended to the agent's base system prompt for sessions in ",
    introSuffix:
      ". Use this to layer project-specific behavior on top of pi's defaults — coding conventions, domain context, persona, etc.",
    appendOnlyPrefix:
      "Append-only — the base prompt (which defines the tool-calling protocol) is not editable. Changes apply to the ",
    appendOnlyStrong: "next session",
    appendOnlySuffix:
      " you start in this project; running sessions keep the prompt they were built with.",
    placeholder:
      "e.g. This project uses TypeScript strict mode and never uses default exports. Always run `npm run check` before declaring a task complete.",
    byteCounter: "{used} / {limit} bytes",
    overBudget: " — too long, please trim before saving",
    revert: "Revert",
  },

  // ---------------- Quick Actions tab ----------------

  quickActions: {
    title: "Quick action chips",
    introPrefix: "One-click buttons on the chat toolbar. Two kinds: ",
    introCommand: "command",
    introMid: " chips run a shell snippet in the active project's folder; ",
    introPrompt: "prompt",
    introSuffix:
      " chips either send a templated prompt to the agent or insert it into the composer so you can tweak it before sending. Chips are stored globally (not per-project) — they're your personal toolbox.",
    minimalNotice:
      "MINIMAL_UI is enabled. Command chips are listed below but are hidden from the toolbar and the server refuses to run them. Prompt chips are unaffected.",
    empty: "No chips defined yet. Click “New” below to add one.",
    badgeCommand: "cmd",
    badgePrompt: "prompt",
    hiddenByMinimal: "hidden by MINIMAL_UI",
    newChip: "+ New chip",
    nameLabel: "Name",
    namePlaceholder: "e.g. Run tests",
    kindLabel: "Kind",
    kindPrompt: "Prompt",
    kindCommand: "Command",
    commandDisabledByMinimal: " (disabled by MINIMAL_UI)",
    commandDisabledTitle:
      "Command chips are disabled by MINIMAL_UI. The server refuses to run them.",
    commandLabel: "Command",
    commandHintPrefix: "Runs in the active project's folder via ",
    commandHintMid: ". Multi-line is fine (",
    commandHintMid2: ", ",
    commandHintSuffix:
      ", etc.). Environment is scrubbed of {brand} and provider secrets (same as the integrated terminal).",
    timeoutLabel: "Timeout (seconds)",
    timeoutHint: "Max 300 (five minutes). Past that, use the integrated terminal.",
    promptTextLabel: "Prompt text",
    promptPlaceholder: "Review the staged changes for security issues.",
    modeLabel: "Mode",
    modeSend: "Send immediately",
    modeInsert: "Insert into composer",
    enabledLabel: "Enabled (visible in the menu)",
    nameRequired: "Name is required",
    commandRequired: "Command is required",
    promptRequired: "Prompt text is required",
  },

  // ---------------- Appearance tab ----------------

  appearance: {
    themeTitle: "Theme",
    themeDescription:
      "Sets the base color palette for the chrome, editor, and terminal. Persisted in this browser only — open in another browser to use a different base theme there.",
    themes: {
      dark: "Dark (default)",
      light: "Light",
      dracula: "Dracula",
      "solarized-dark": "Solarized Dark",
      "catppuccin-mocha": "Catppuccin Mocha",
      "high-contrast": "High contrast",
    },
    customColorsTitle: "Global custom colors",
    customColorsDescription:
      "Server-side overrides for broad UI surfaces: app background, chat bubbles, text, highlights and selection. Applies to every browser once saved.",
    customColorsLoadFailed: "Could not load the server theme",
    customColorsSave: "Save",
    customColorsReset: "Reset",
    customColorsExport: "Export",
    customColorsImport: "Import",
    customColorsEnabled: "Enable global custom colors",
    customColorsBaseFrom: "Load palette from",
    customColorsInvalidFile: "That file is not a pi-forge server theme export",
    customColorsSaved: "Global custom colors saved",
    customColorsResetDone: "Global custom colors reset",
    customColorsLoading: "Loading custom colors…",
    customColorsStartFrom: "Start from appearance",
    customColorsCopy: "Copy colors",
    customColorsSaveButton: "Save custom colors",
    customColorsExportTheme: "Export theme",
    customColorsImportTheme: "Import theme",
    customColorsDefaultValue: "Default {value}",
    customColorsImportRootError: "Theme import must be a JSON object with colors.",
    customColorsImportColorError: "{label} must be a 6-digit hex color like #0a0a0a.",
    colorLabels: {
      appBackground: "App background",
      panelBackground: "Panel background",
      userBubbleBackground: "User bubble",
      assistantBubbleBackground: "Assistant bubble",
      primaryText: "Text 1 — primary",
      secondaryText: "Text 2 — secondary",
      mutedText: "Text 3 — muted",
      highlightBackground: "Highlight background",
      highlightText: "Highlight text",
      selectionBackground: "Selection background",
    },
  },

  // ---------------- Backup tab ----------------

  backup: {
    exportConfigTitle: "Export config",
    exportIntroA: "Downloads a ",
    exportIntroB: " with ",
    listSep: ", ",
    listSepLast: ", and ",
    exportAuthPrefix: ". Provider auth (",
    exportAuthMid: " — API keys, OAuth tokens) is ",
    notWord: "not",
    exportAuthSuffix: " included; re-authenticate providers after restoring on a new install.",
    downloadConfig: "Download config archive",
    exporting: "Exporting…",
    exportedPrefix: "Exported ",
    exportedMid: " (",
    exportedSuffix: ")",
    noFilesOnDisk: "no files were on disk",
    includedFiles: "included: {files}",
    importConfigTitle: "Import config",
    importIntroPrefix:
      "Restores a previously-exported archive. Each file is parsed before any disk write — if any file fails validation, ",
    nothingWord: "nothing",
    importIntroSuffix:
      " is imported. Existing live agent sessions keep their original settings until restarted.",
    importedLabel: "Imported: ",
    skippedLabel: "Skipped (not in allow-list): ",
    errorsLabel: "Errors — nothing was written:",
    archiveEmpty: "Archive was empty.",
    exportSkillsTitle: "Export skills",
    skillsExportIntroA: "Downloads a ",
    skillsExportIntroB: " of every file under ",
    skillsExportIntroC: " — both single-file (",
    skillsExportIntroD: ") and directory skills (",
    skillsExportIntroSuffix: " + assets) round-trip verbatim.",
    downloadSkills: "Download skills archive",
    working: "Working…",
    skillsEmpty: "No skills to export — your skills directory is empty.",
    skillsPacked: {
      one: "{count} file packed",
      other: "{count} files packed",
    },
    importSkillsTitle: "Import skills",
    skillsImportIntro: "Restore skills from a previously-exported ",
    skillsImportMid:
      ", OR upload a folder of skill files directly. Existing files at the same path are ",
    overwrittenWord: "overwritten",
    skillsImportSuffix: "; new files are added. Path traversal and absolute paths are rejected.",
    fromTarGz: "From tar.gz",
    fromFolder: "From folder (Chromium / WebKit only)",
    skillsImportedCount: {
      one: "Imported {count} file:",
      other: "Imported {count} files:",
    },
    skippedCount: {
      one: "Skipped {count} entry:",
      other: "Skipped {count} entries:",
    },
    noneImported: "No files were imported.",
  },

  // ---------------- MCP tab ----------------

  mcp: {
    loading: "Loading MCP config…",
    introPrefix:
      "MCP servers extend the agent with custom tools. Servers configured here are loaded by every new session. Project-scoped servers in ",
    introSuffix:
      " at the project root are also loaded for sessions in that project (project entries override globals on name collision).",
    masterTitle: "MCP tools",
    masterHint:
      "Master switch. When off, no MCP tools reach the agent regardless of per-server state.",
    truncationTitle: "Result truncation",
    truncationHint:
      "Caps total text returned by each MCP tool before it enters agent context. Images pass through unchanged. Disable only for trusted, bounded tools.",
    maxChars: "Max chars",
    truncating: "Truncating",
    passThrough: "Pass-through",
    spoolingSaveFailed: "Failed to update MCP spooling: {code}",
    spoolingTitle: "Result spooling",
    spoolingHint:
      "Writes oversized successful MCP results to workspace files before truncation. Default:",
    spoolingHintSuffix: ".",
    spoolingThresholdLabel: "Threshold chars",
    spoolingDirectoryLabel: "Directory",
    spoolingOn: "Spooling",
    spoolingOff: "Inline only",
    globalServers: "Global servers",
    noGlobalServers: "No global MCP servers configured. Click 'Add server' to add one.",
    projectServers: "Project servers ({name})",
    noProjectServersPrefix: "No project servers. Add a ",
    noProjectServersMid: " file at the project root to define some — supports both ",
    noProjectServersMid2: " and the standard ",
    noProjectServersSuffix: " shape.",
    addServer: "+ Add server",
    nameRequired: "Name is required.",
    urlRequired: "URL is required for remote servers.",
    commandRequired: "Command is required for stdio servers.",
    confirmRemove: "Remove MCP server '{name}' from the global registry?",
    confirmRevokeTrust:
      'Revoke stdio MCP trust for "{name}"? This disconnects every running project-scoped MCP server.',
  },

  mcpList: {
    showTools: "Show tools",
    hideTools: "Hide tools",
    noTools: "No tools to show (server not connected or empty)",
    toolCount: {
      one: "{count} tool",
      other: "{count} tools",
    },
    probe: "Probe",
    probing: "Probing…",
    probeTitle: "Reconnect and refresh tool list",
    toolsHeader: "Tools",
  },

  mcpTrust: {
    grantedPrefix: "Stdio MCP trust granted for ",
    grantedMid: ". Project-local stdio MCP servers from ",
    grantedSuffix: " will spawn on session create.",
    revoke: "Revoke",
    revokeTitle: "Disconnects every running project-scoped MCP server",
    wantsSpawn: {
      one: "This project wants to spawn {count} stdio MCP server.",
      other: "This project wants to spawn {count} stdio MCP servers.",
    },
    declaresVerb: "'s ",
    declaresServers: {
      one: " declares {count} MCP server",
      other: " declares {count} MCP servers",
    },
    launchSuffix: {
      one: " that {brand} would launch as a local subprocess.",
      other: " that {brand} would launch as local subprocesses.",
    },
    runsWarningPrefix:
      " Stdio MCP runs arbitrary commands on this machine with whatever env you've passed through — only trust projects whose ",
    runsWarningSuffix:
      " you've reviewed and approve of. Remote (URL) entries in this project are unaffected by this gate.",
    granting: "Granting…",
    trustProject: "Trust this project",
  },

  mcpForm: {
    editTitle: "Edit '{name}'",
    addTitle: "Add MCP server",
    kindLabel: "Type",
    kindRemote: "Remote URL",
    kindStdio: "Local subprocess (stdio)",
    kindLocked: "Locked while editing — delete and re-add to change type.",
    transport: "Transport",
    transportAuto: "auto (StreamableHTTP, fall back to SSE)",
    commandPlaceholder: "npx (or absolute path to a binary)",
    args: "Args",
    cwdPlaceholder: "(blank ↦ default: project path for project servers)",
    disabledHint: "Disabled servers don't connect or contribute tools.",
    headers: "Headers",
    addHeader: "+ Header",
    noHeadersLiteral:
      "No headers. Add literal auth headers or reference an env var such as MY_MCP_TOKEN.",
    removeHeader: "Remove header",
    envBackedNote:
      "Env-backed headers store only the variable name; {brand} resolves the value when sending MCP requests.",
    httpsCerts: "HTTPS certs",
    headerSingular: "Header",
    noHeaders: "No headers. Add `Authorization: Bearer …` here for auth.",
    env: "Env",
    envSingular: "Env",
    noEnv:
      "No env. Add API keys / config your subprocess needs (PATH / HOME / locale are inherited automatically).",
  },

  secretRows: {
    keepStoredValue: "leave blank to keep stored value",
    removeTitle: "Remove {label}",
    sentinelHint: "Values with the redaction sentinel keep their stored value when you save.",
  },

  // ---------------- General tab ----------------

  general: {
    aboutTitle: "pi-forge",
    aboutPrefix: "Browser interface for the ",
    aboutSuffix: ".",
    agentLinkLabel: "pi coding agent",
    versionTitle: "Version",
    linksTitle: "Links",
    changelog: "Changelog",
    security: "Security",
  },

  changePassword: {
    title: "Change password",
    description: "Updates the scrypt hash on disk; existing browser sessions stay signed in.",
    current: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    tooShort: "New password must be at least {count} characters.",
    mismatch: "New password and confirmation do not match.",
    unchanged: "New password must differ from the current one.",
    updated: "Password updated.",
    submit: "Update password",
    errorInvalid: "Current password is incorrect.",
    errorNotConfigured: "Password auth is not configured on this server.",
    errorAuthRequired: "Session expired — sign in again.",
    errorUnknown: "Could not change password: {code}",
  },
} as const;
