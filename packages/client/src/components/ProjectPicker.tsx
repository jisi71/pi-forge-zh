import { useEffect, useRef, useState } from "react";
import { api, ApiError, parseCloneEventStream, type BrowseEntry } from "../lib/api-client";
import { useProjectStore } from "../store/project-store";
import { useUiConfigStore } from "../store/ui-config-store";
import { useT } from "../i18n";

interface Props {
  onClose: () => void;
  /** When true, the picker cannot be dismissed without creating a project. */
  required?: boolean;
}

/**
 * Project-setup picker. Three flows:
 *   - "Create new"  — type a name, browse to a folder (or auto-mkdir
 *                     `<workspaceRoot>/<name>` under MINIMAL_UI).
 *   - "Pick existing" — same browser, no mkdir.
 *   - "Clone repo"  — URL + optional branch + optional token; streams
 *                     `git clone` progress and creates the project on
 *                     success.
 *
 * The picker remembers the typed name across mode switches, since the
 * cost of retyping it is the most common UX regret in pickers like
 * this.
 */
type Mode = "create" | "clone";
type Step = "name" | "browse";

export function ProjectPicker({ onClose, required = false }: Props) {
  const t = useT();
  const create = useProjectStore((s) => s.create);
  const minimal = useUiConfigStore((s) => s.minimal);
  const workspaceRoot = useUiConfigStore((s) => s.workspaceRoot);
  const loadProjects = useProjectStore((s) => s.load);
  const setActiveProject = useProjectStore((s) => s.setActive);

  const [mode, setMode] = useState<Mode>("create");
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [path, setPath] = useState<string | undefined>();
  const [parentPath, setParentPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<BrowseEntry[]>([]);
  const [loadingBrowse, setLoadingBrowse] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  useEffect(() => {
    if (mode !== "create" || step !== "browse") return;
    let cancelled = false;
    setLoadingBrowse(true);
    setError(undefined);
    api
      .browse(path)
      .then((res) => {
        if (cancelled) return;
        setPath(res.path);
        setParentPath(res.parentPath);
        setEntries(res.entries);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.code : (err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoadingBrowse(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, step, path]);

  /**
   * Default flow: take the typed name, advance to the folder
   * browser, let the user pick or create a destination dir.
   * Minimal flow (`MINIMAL_UI=1`): skip browsing entirely — mkdir
   * `<workspaceRoot>/<name>` and use it as the project path. The
   * server's mkdir route already 409s on conflict, which we surface
   * as a normal error code on the form.
   */
  const onSubmitName = async (): Promise<void> => {
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    if (!minimal) {
      setStep("browse");
      return;
    }
    if (workspaceRoot.length === 0) {
      // ui-config hasn't loaded yet (rare — load fires in App).
      // Surface the error rather than silently doing nothing.
      setError("workspace_not_loaded");
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      const { path: created } = await api.mkdir(workspaceRoot, trimmed);
      await create(trimmed, created);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
      setSubmitting(false);
    }
  };

  const select = async (selected: string): Promise<void> => {
    if (submitting) return;
    // Refuse the workspace root itself as a project folder. pi-forge
    // expects each project to be a sub-tree of WORKSPACE_PATH; the
    // root is the boundary, not a project. Picking it would let the
    // agent see every other project's files in one session.
    if (workspaceRoot.length > 0 && selected === workspaceRoot) {
      setError("workspace_root_not_allowed");
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await create(name.trim(), selected);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
      setSubmitting(false);
    }
  };

  const goUp = (): void => {
    if (parentPath !== null) setPath(parentPath);
  };

  const createFolder = async (): Promise<void> => {
    if (!path || newFolderInput.trim().length === 0) return;
    setError(undefined);
    try {
      const { path: created } = await api.mkdir(path, newFolderInput.trim());
      setNewFolderInput("");
      setShowNewFolder(false);
      await select(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            {mode === "clone"
              ? t("projects.picker.titleClone")
              : step === "name"
                ? t("projects.picker.titleNew")
                : t("projects.picker.titlePick", { name: name.trim() })}
          </h2>
          {!required && (
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800"
            >
              {t("common.cancel")}
            </button>
          )}
        </header>

        {step === "name" && (
          <div className="mb-3 flex gap-1 border-b border-neutral-800">
            <ModeTab active={mode === "create"} onClick={() => setMode("create")}>
              {t("projects.picker.tabCreate")}
            </ModeTab>
            <ModeTab active={mode === "clone"} onClick={() => setMode("clone")}>
              {t("projects.picker.tabClone")}
            </ModeTab>
          </div>
        )}

        {step === "name" && mode === "create" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmitName();
            }}
            className="space-y-4"
          >
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-neutral-300">
                {t("projects.picker.projectName")}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
              />
              {minimal && workspaceRoot.length > 0 && (
                <span className="block font-mono text-[11px] text-neutral-500">
                  {t("projects.picker.willCreate", {
                    path: `${workspaceRoot}/${name.trim().length > 0 ? name.trim() : "<name>"}`,
                  })}
                </span>
              )}
            </label>
            {error !== undefined && (
              <p className="text-xs text-red-400 light:text-red-700">
                {t("projects.error.label", { code: error })}
              </p>
            )}
            <button
              type="submit"
              disabled={name.trim().length === 0 || submitting}
              className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
            >
              {minimal
                ? submitting
                  ? t("common.creating")
                  : t("projects.picker.createProject")
                : t("projects.picker.nextPickFolder")}
            </button>
          </form>
        )}

        {step === "name" && mode === "clone" && (
          <CloneForm
            initialName={name}
            workspaceRoot={workspaceRoot}
            onProjectCreated={async (projectId) => {
              // Drop the picker; reload project list so the new
              // project lands in the sidebar, then activate it.
              await loadProjects();
              setActiveProject(projectId);
              onClose();
            }}
            onCancel={onClose}
          />
        )}

        {mode === "create" && step === "browse" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <button
                onClick={goUp}
                disabled={parentPath === null}
                className="rounded-md border border-neutral-700 px-2 py-1 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  parentPath === null
                    ? t("projects.picker.atWorkspaceRoot")
                    : t("projects.picker.upOneFolder")
                }
              >
                {t("projects.picker.up")}
              </button>
              <code className="truncate font-mono text-neutral-300">
                {path ?? t("projects.picker.pathLoading")}
              </code>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-950">
              {loadingBrowse && (
                <div className="px-3 py-2 text-sm text-neutral-400">{t("common.loading")}</div>
              )}
              {!loadingBrowse && entries.length === 0 && (
                <div className="px-3 py-2 text-sm text-neutral-400">
                  {t("projects.picker.emptyFolder")}
                </div>
              )}
              {!loadingBrowse &&
                entries.map((e) => (
                  <div
                    key={e.path}
                    className="flex items-center justify-between gap-2 border-b border-neutral-800 px-3 py-2 text-sm last:border-b-0"
                  >
                    <button
                      onClick={() => setPath(e.path)}
                      className="flex flex-1 items-center gap-2 text-left text-neutral-200 hover:text-white"
                    >
                      <span>📁</span>
                      <span className="truncate">{e.name}</span>
                      {e.isGitRepo && (
                        <span className="rounded-sm bg-neutral-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-neutral-300">
                          git
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => void select(e.path)}
                      disabled={submitting}
                      className="rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {t("projects.picker.select")}
                    </button>
                  </div>
                ))}
            </div>

            {showNewFolder ? (
              <div className="flex gap-2">
                <input
                  value={newFolderInput}
                  onChange={(e) => setNewFolderInput(e.target.value)}
                  placeholder={t("projects.picker.folderNamePlaceholder")}
                  className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => void createFolder()}
                  className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900"
                >
                  {t("projects.picker.createAndSelect")}
                </button>
                <button
                  onClick={() => {
                    setShowNewFolder(false);
                    setNewFolderInput("");
                  }}
                  className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300"
                >
                  {t("common.cancel")}
                </button>
              </div>
            ) : (
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setStep("name")}
                  className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300"
                >
                  {t("projects.picker.back")}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewFolder(true)}
                    className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300"
                  >
                    {t("projects.picker.newFolder")}
                  </button>
                  <button
                    onClick={() => path && void select(path)}
                    disabled={
                      !path || submitting || (workspaceRoot.length > 0 && path === workspaceRoot)
                    }
                    className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
                    title={
                      workspaceRoot.length > 0 && path === workspaceRoot
                        ? t("projects.picker.pickSubfolder")
                        : t("projects.picker.useThisFolder")
                    }
                  >
                    {t("projects.picker.selectThisFolder")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {error !== undefined && (
          <p className="mt-3 text-sm text-red-400 light:text-red-700">
            {error === "path_not_allowed"
              ? t("projects.error.pathNotAllowed")
              : error === "workspace_root_not_allowed"
                ? t("projects.picker.pickSubfolder")
                : error === "not_a_directory"
                  ? t("projects.error.notADirectory")
                  : error === "already_exists"
                    ? t("projects.error.alreadyExists")
                    : error === "duplicate_path"
                      ? t("projects.error.duplicatePath")
                      : error === "network_error"
                        ? t("projects.error.networkError")
                        : t("projects.error.label", { code: error })}
          </p>
        )}
      </div>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
        active
          ? "border-neutral-200 text-neutral-100"
          : "border-transparent text-neutral-400 hover:text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Clone form + streaming-progress display. Lives inside ProjectPicker
 * so it can share the workspace-root validation rules and project-
 * creation handoff. Default folder name is derived from the URL's
 * last path segment (e.g. `https://github.com/foo/bar.git` →
 * `bar`).
 */
function CloneForm({
  initialName,
  workspaceRoot,
  onProjectCreated,
  onCancel,
}: {
  initialName: string;
  workspaceRoot: string;
  onProjectCreated: (projectId: string) => Promise<void>;
  onCancel: () => void;
}) {
  const t = useT();
  const [url, setUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [token, setToken] = useState("");
  const [folderName, setFolderName] = useState("");
  const [projectName, setProjectName] = useState(initialName);
  const [insecureTls, setInsecureTls] = useState(false);
  const [folderTouched, setFolderTouched] = useState(false);
  const [projectTouched, setProjectTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [phase, setPhase] = useState<string | undefined>();
  const [percent, setPercent] = useState<number | null>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [showRawLog, setShowRawLog] = useState(false);
  const abortRef = useRef<AbortController | undefined>(undefined);

  // Derive folder name from the URL's last path segment unless the
  // user has typed something themselves. Strip a trailing `.git`.
  useEffect(() => {
    if (folderTouched) return;
    try {
      const u = new URL(url);
      const segs = u.pathname.split("/").filter((s) => s.length > 0);
      const last = segs[segs.length - 1] ?? "";
      const stripped = last.replace(/\.git$/i, "");
      if (stripped.length > 0) setFolderName(stripped);
    } catch {
      // Invalid URL — don't touch the field.
    }
  }, [url, folderTouched]);

  // Project name defaults to the folder name unless the user typed
  // something. initialName from the parent picker takes precedence
  // (lets you start typing in the Create tab, switch to Clone, and
  // keep your name).
  useEffect(() => {
    if (projectTouched) return;
    if (initialName.trim().length > 0) return;
    if (folderName.length > 0) setProjectName(folderName);
  }, [folderName, initialName, projectTouched]);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (submitting) return;
    if (url.trim().length === 0) {
      setError("url_required");
      return;
    }
    if (folderName.trim().length === 0) {
      setError("folder_required");
      return;
    }
    if (projectName.trim().length === 0) {
      setError("name_required");
      return;
    }
    if (workspaceRoot.length === 0) {
      setError("workspace_not_loaded");
      return;
    }
    setSubmitting(true);
    setError(undefined);
    setPhase(t("projects.clone.phaseStarting"));
    setPercent(null);
    setLogLines([]);

    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const body: {
        url: string;
        parentPath: string;
        folderName: string;
        projectName: string;
        branch?: string;
        token?: string;
        insecureTls?: boolean;
      } = {
        url: url.trim(),
        parentPath: workspaceRoot,
        folderName: folderName.trim(),
        projectName: projectName.trim(),
      };
      if (branch.trim().length > 0) body.branch = branch.trim();
      if (token.length > 0) body.token = token;
      if (insecureTls) body.insecureTls = true;

      const res = await api.cloneProject(body, ac.signal);
      let createdProjectId: string | undefined;
      let sawError = false;
      let errorMessage = "";
      for await (const ev of parseCloneEventStream(res)) {
        switch (ev.type) {
          case "started":
            setPhase(t("projects.clone.phaseStartingClone"));
            setLogLines((prev) => [
              ...prev,
              t("projects.clone.logCloning", { url: ev.cloneUrlForDisplay }),
            ]);
            break;
          case "progress":
            setPhase(ev.phase);
            setPercent(ev.percent);
            break;
          case "stderr":
            setLogLines((prev) => {
              const next = [...prev, ev.line];
              return next.length > 200 ? next.slice(next.length - 200) : next;
            });
            break;
          case "done":
            setPhase(t("projects.clone.phaseDone"));
            setPercent(100);
            break;
          case "project_created":
            createdProjectId = ev.project.id;
            break;
          case "error":
            sawError = true;
            errorMessage = ev.message;
            break;
        }
      }
      if (createdProjectId !== undefined) {
        await onProjectCreated(createdProjectId);
        return;
      }
      if (sawError) {
        setError(errorMessage);
      } else {
        setError("clone_ended_without_project");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("cancelled");
      } else {
        setError(
          err instanceof ApiError ? `${err.code}: ${err.message ?? ""}` : (err as Error).message,
        );
      }
    } finally {
      setSubmitting(false);
      abortRef.current = undefined;
    }
  };

  const onCancelClone = (): void => {
    if (abortRef.current !== undefined) {
      abortRef.current.abort();
    } else {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void onSubmit(e);
      }}
      className="space-y-3"
    >
      <label className="block space-y-1">
        <span className="text-sm font-medium text-neutral-300">{t("projects.clone.urlLabel")}</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo.git"
          disabled={submitting}
          autoFocus
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs outline-none focus:border-neutral-500 disabled:opacity-60"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-neutral-300">
            {t("projects.clone.branchLabel")}
          </span>
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder={t("projects.clone.branchPlaceholder")}
            disabled={submitting}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs outline-none focus:border-neutral-500 disabled:opacity-60"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-neutral-300">
            {t("projects.clone.folderLabel")}
          </span>
          <input
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              setFolderTouched(true);
            }}
            placeholder={t("projects.clone.folderPlaceholder")}
            disabled={submitting}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs outline-none focus:border-neutral-500 disabled:opacity-60"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-neutral-300">
          {t("projects.picker.projectName")}
        </span>
        <input
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            setProjectTouched(true);
          }}
          placeholder={t("projects.clone.projectPlaceholder")}
          disabled={submitting}
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500 disabled:opacity-60"
        />
        {workspaceRoot.length > 0 && folderName.length > 0 && (
          <span className="block font-mono text-[11px] text-neutral-500">
            {t("projects.clone.willCloneInto", {
              path: `${workspaceRoot}/${folderName}`,
            })}
          </span>
        )}
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-neutral-300">
          {t("projects.clone.tokenLabel")}
        </span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t("projects.clone.tokenPlaceholder")}
          disabled={submitting}
          className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-xs outline-none focus:border-neutral-500 disabled:opacity-60"
        />
        <span className="block text-[11px] text-neutral-500">
          {t("projects.clone.tokenHintPrefix")}
          <code>x-access-token:&lt;token&gt;</code>
          {t("projects.clone.tokenHintMiddle")}
          <code>.git/config</code>
          {t("projects.clone.tokenHintSuffix")}
        </span>
      </label>

      <label className="flex items-start gap-2 rounded border border-amber-900/40 bg-amber-950/30 px-2 py-1.5 text-xs light:border-amber-300 light:bg-amber-50">
        <input
          type="checkbox"
          checked={insecureTls}
          onChange={(e) => setInsecureTls(e.target.checked)}
          disabled={submitting}
          className="mt-0.5"
        />
        <span>
          <span className="text-amber-200 light:text-amber-800">
            {t("projects.clone.insecureTlsLabel")}
          </span>
          <br />
          <span className="text-[11px] text-amber-300/70 light:text-amber-700/80">
            {t("projects.clone.insecureTlsHintPrefix")}
            <code>git-clone-insecure-tls</code>
            {t("projects.clone.insecureTlsHintSuffix")}
          </span>
        </span>
      </label>

      {(submitting || phase !== undefined) && (
        <div className="space-y-1 rounded-md border border-neutral-800 bg-neutral-950 p-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300">{phase ?? t("projects.clone.phaseStarting")}</span>
            <span className="font-mono text-neutral-500">
              {percent !== null ? `${percent}%` : ""}
            </span>
          </div>
          {percent !== null && (
            <div className="h-1 w-full overflow-hidden rounded bg-neutral-800">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
              />
            </div>
          )}
          {logLines.length > 0 && (
            <details
              open={showRawLog}
              onToggle={(e) => setShowRawLog((e.target as HTMLDetailsElement).open)}
              className="pt-1"
            >
              <summary className="cursor-pointer text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-300">
                {t("projects.clone.rawOutput", { count: logLines.length })}
              </summary>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-snug text-neutral-400">
                {logLines.join("\n")}
              </pre>
            </details>
          )}
        </div>
      )}

      {error !== undefined && (
        <p className="text-xs text-red-400 light:text-red-700">
          {t("projects.error.label", { code: error })}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancelClone}
          className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300"
        >
          {submitting ? t("projects.clone.cancelClone") : t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={
            submitting ||
            url.trim().length === 0 ||
            projectName.trim().length === 0 ||
            workspaceRoot.length === 0
          }
          className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
        >
          {submitting ? t("projects.clone.cloning") : t("projects.clone.submit")}
        </button>
      </div>
    </form>
  );
}
