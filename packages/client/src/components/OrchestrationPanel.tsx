import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Users, X } from "lucide-react";
import { useT, type TranslateKey } from "../i18n";
import {
  api,
  ApiError,
  type InboxItemType,
  type InboxItemWire,
  type SessionLink,
  type WorkerSummary,
} from "../lib/api-client";
import { useUiConfigStore } from "../store/ui-config-store";
import { useSessionStore } from "../store/session-store";

interface Props {
  sessionId: string;
  /** Optional close handler — when set, a close button renders in the
   *  header so the panel can be dismissed from inside (used by the
   *  ChatView dropdown integration). */
  onClose?: () => void;
}

/**
 * Per-session orchestration controls. Renders nothing when
 * orchestration is disabled on this server. Otherwise shows the
 * session's role (supervisor / worker / standalone) with appropriate
 * controls:
 *
 *   - standalone: button to enable supervisor mode
 *   - supervisor: worker list + event history + disable button
 *   - worker:     supervisor back-link
 *
 * Side effects (enable/disable/kill/detach) reload the link state
 * after the mutation so the UI stays in sync with the store.
 *
 * The supervisor's worker list polls every 4s while the panel is
 * mounted. Idle UI overhead is small — one cheap HTTP call.
 */
/**
 * Role / live-state badge copy, keyed by the raw discriminator so the
 * localized label never feeds the `===` checks that pick the styling.
 */
const ROLE_LABEL_KEYS: Record<"supervisor" | "worker" | "standalone", TranslateKey> = {
  supervisor: "orchestration.panel.roles.supervisor",
  worker: "orchestration.panel.roles.worker",
  standalone: "orchestration.panel.roles.standalone",
};

const STATE_LABEL_KEYS: Record<"streaming" | "idle" | "cold", TranslateKey> = {
  streaming: "orchestration.workerState.streaming",
  idle: "orchestration.workerState.idle",
  cold: "orchestration.workerState.cold",
};

export function OrchestrationPanel({ sessionId, onClose }: Props) {
  const t = useT();
  const orchestrationEnabled = useUiConfigStore((s) => s.orchestrationEnabled);
  const [link, setLink] = useState<SessionLink | undefined>(undefined);
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [inbox, setInbox] = useState<InboxItemWire[]>([]);
  const [showInbox, setShowInbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const reload = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    try {
      const l = await api.getSessionLink(sessionId);
      setLink(l);
      if (l.role === "supervisor") {
        const w = await api.listSupervisorWorkers(sessionId);
        setWorkers(w.workers);
        const i = await api.listSupervisorInbox(sessionId);
        setInbox(i.items);
      } else {
        setWorkers([]);
        setInbox([]);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orchestrationEnabled) return;
    void reload();
    // Poll for live worker state. 4s — fast enough to feel live,
    // slow enough not to spam the server. Aligns with the cadence
    // the webhooks deliveries panel uses.
    const interval = setInterval(() => {
      void reload();
    }, 4_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orchestrationEnabled, sessionId]);

  if (!orchestrationEnabled) return null;

  const role = link?.role ?? "standalone";

  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-3 text-sm text-neutral-200">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Users size={14} />
          <span>{t("orchestration.panel.title")}</span>
          <RoleBadge role={role} />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              void reload();
            }}
            title={t("common.refresh")}
            className="p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
          {onClose !== undefined && (
            <button
              type="button"
              onClick={onClose}
              title={t("common.close")}
              className="p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {error !== undefined && (
        <div className="mt-2 rounded bg-red-900/30 px-2 py-1 text-xs text-red-300 light:bg-red-100 light:text-red-800">
          {error}
        </div>
      )}

      {role === "standalone" && (
        <StandaloneControls
          sessionId={sessionId}
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          onAfter={reload}
        />
      )}
      {role === "supervisor" && link !== undefined && (
        <SupervisorControls
          link={link}
          workers={workers}
          inbox={inbox}
          showInbox={showInbox}
          setShowInbox={setShowInbox}
          busy={busy}
          setBusy={setBusy}
          setError={setError}
          onAfter={reload}
        />
      )}
      {role === "worker" && link !== undefined && <WorkerControls link={link} />}
    </div>
  );
}

function RoleBadge({ role }: { role: "supervisor" | "worker" | "standalone" }) {
  const t = useT();
  const styles =
    role === "supervisor"
      ? "bg-violet-900/40 text-violet-200 light:bg-violet-100 light:text-violet-800"
      : role === "worker"
        ? "bg-sky-900/40 text-sky-200 light:bg-sky-100 light:text-sky-800"
        : "bg-neutral-800 text-neutral-300";
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${styles}`}>
      {t(ROLE_LABEL_KEYS[role])}
    </span>
  );
}

function StandaloneControls({
  sessionId,
  busy,
  setBusy,
  setError,
  onAfter,
}: {
  sessionId: string;
  busy: boolean;
  setBusy: (b: boolean) => void;
  setError: (s: string | undefined) => void;
  onAfter: () => Promise<void>;
}) {
  const t = useT();
  const onEnable = async (): Promise<void> => {
    setBusy(true);
    setError(undefined);
    try {
      // Server-side: enable rebuilds the live AgentSession in-place
      // so the orchestrate_* tools become available immediately. The
      // SSE connection stays attached — no client-side reconnect
      // needed, no flicker, no risk of losing a pre-prompt session
      // to the cold-resume 404 race.
      await api.enableSupervisor(sessionId);
      await onAfter();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs text-neutral-400">
        {t("orchestration.standalone.descriptionPrefix")}
        <code className="text-xs">orchestrate_*</code>
        {t("orchestration.standalone.descriptionSuffix")}
      </p>
      <button
        type="button"
        onClick={() => {
          void onEnable();
        }}
        disabled={busy}
        className="rounded bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-70"
      >
        {busy ? t("orchestration.standalone.enabling") : t("orchestration.standalone.enable")}
      </button>
      <p className="text-[11px] text-neutral-400">
        {t("orchestration.standalone.toolListRefreshed")}
      </p>
    </div>
  );
}

function SupervisorControls({
  link,
  workers,
  inbox,
  showInbox,
  setShowInbox,
  busy,
  setBusy,
  setError,
  onAfter,
}: {
  link: SessionLink;
  workers: WorkerSummary[];
  inbox: InboxItemWire[];
  showInbox: boolean;
  setShowInbox: (b: boolean) => void;
  busy: boolean;
  setBusy: (b: boolean) => void;
  setError: (s: string | undefined) => void;
  onAfter: () => Promise<void>;
}) {
  const t = useT();
  const openSession = useSessionStore((s) => s.setActiveSession);

  const onDisable = async (): Promise<void> => {
    if (!confirm(t("orchestration.supervisor.disableConfirm"))) return;
    setBusy(true);
    setError(undefined);
    try {
      // Server-side: disable rebuilds the live AgentSession in-place
      // so the orchestrate_* tools vanish from its tool surface
      // without an SSE reconnect.
      await api.disableSupervisor(link.sessionId);
      await onAfter();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onDetach = async (workerId: string): Promise<void> => {
    setBusy(true);
    setError(undefined);
    try {
      await api.detachWorker(link.sessionId, workerId);
      await onAfter();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onKill = async (workerId: string): Promise<void> => {
    if (!confirm(t("orchestration.supervisor.killConfirm", { id: workerId.slice(0, 8) }))) return;
    setBusy(true);
    setError(undefined);
    try {
      // Human-initiated worker deletion from the Web UI is an external
      // session delete from the supervisor agent's perspective, so use the
      // generic session DELETE route. The orchestration kill endpoint stays
      // reserved for supervisor/tool-initiated self-actions and suppresses
      // redundant notifications back to that same supervisor.
      await api.disposeSession(workerId);
      await onAfter();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onResume = async (workerId: string): Promise<void> => {
    setBusy(true);
    setError(undefined);
    try {
      await api.resumeWorker(link.sessionId, workerId);
      await onAfter();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onClearInbox = async (): Promise<void> => {
    if (!confirm(t("orchestration.supervisor.clearInboxConfirm"))) return;
    setBusy(true);
    setError(undefined);
    try {
      await api.clearSupervisorInbox(link.sessionId);
      await onAfter();
    } catch (err) {
      setError(err instanceof ApiError ? err.code : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-400">
          {t.plural("orchestration.supervisor.workerCount", workers.length)}
        </div>
        <button
          type="button"
          onClick={() => {
            void onDisable();
          }}
          disabled={busy}
          className="rounded px-1.5 py-0.5 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-red-400 disabled:opacity-70 light:hover:text-red-600"
        >
          {t("orchestration.supervisor.disable")}
        </button>
      </div>
      {workers.length === 0 ? (
        <p className="text-xs italic text-neutral-400">
          {t("orchestration.supervisor.emptyPrefix")}
          <code className="text-xs">orchestrate_spawn_worker</code>
          {t("orchestration.supervisor.emptySuffix")}
        </p>
      ) : (
        <ul className="divide-y divide-neutral-800 rounded border border-neutral-800 bg-neutral-950">
          {workers.map((w) => (
            <li key={w.workerId} className="flex items-center gap-2 px-2 py-1.5">
              <StateDot state={w.state ?? (w.isLive ? "idle" : "cold")} />
              <button
                type="button"
                onClick={() => openSession(w.workerId)}
                className="flex-1 text-left truncate text-xs hover:underline"
                title={w.workerId}
              >
                <span className="font-medium">{w.name ?? w.workerId.slice(0, 8)}</span>
                {w.messageCount !== undefined && (
                  <span className="ml-1 text-neutral-400">
                    {t("orchestration.supervisor.messageCount", { count: w.messageCount })}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-1">
                {!w.isLive && (
                  <button
                    type="button"
                    onClick={() => {
                      void onResume(w.workerId);
                    }}
                    disabled={busy}
                    className="px-1 py-0.5 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-violet-300 disabled:opacity-70 light:hover:text-violet-700"
                  >
                    {t("orchestration.supervisor.resume")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    void onDetach(w.workerId);
                  }}
                  disabled={busy}
                  className="px-1 py-0.5 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-amber-300 disabled:opacity-70 light:hover:text-amber-700"
                  title={t("orchestration.supervisor.detachTooltip")}
                >
                  {t("orchestration.supervisor.detach")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void onKill(w.workerId);
                  }}
                  disabled={busy}
                  className="px-1 py-0.5 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-red-300 disabled:opacity-70 light:hover:text-red-700"
                  title={t("orchestration.supervisor.killTooltip")}
                >
                  {t("orchestration.supervisor.kill")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <details open={showInbox} onToggle={(e) => setShowInbox(e.currentTarget.open)}>
        <summary className="cursor-pointer select-none text-xs text-neutral-400">
          {t("orchestration.supervisor.eventHistory", { count: inbox.length })}
        </summary>
        {inbox.length === 0 ? (
          <p className="mt-1 text-xs italic text-neutral-400">
            {t("orchestration.supervisor.noEvents")}
          </p>
        ) : (
          <div className="mt-1 space-y-1">
            <ul className="max-h-48 divide-y divide-neutral-800 overflow-auto rounded border border-neutral-800 bg-neutral-950">
              {inbox.map((item) => (
                <InboxRow key={item.id} item={item} />
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                void onClearInbox();
              }}
              disabled={busy}
              className="text-[11px] text-neutral-400 hover:text-red-400 disabled:opacity-70 light:hover:text-red-600"
            >
              {t("orchestration.supervisor.clearHistory")}
            </button>
          </div>
        )}
      </details>
    </div>
  );
}

function InboxRow({ item }: { item: InboxItemWire }) {
  const t = useT();
  const label = inboxTypeLabel(item.type);
  return (
    <li className="flex items-baseline gap-2 px-2 py-1 text-xs">
      <span
        className={`rounded px-1 py-0.5 ${
          item.delivered
            ? "bg-neutral-800 text-neutral-400"
            : "bg-amber-700/40 text-amber-200 light:bg-amber-200 light:text-amber-900"
        }`}
      >
        {t(label)}
      </span>
      <span className="font-mono text-neutral-400" title={item.workerId}>
        {item.workerId.slice(0, 8)}
      </span>
      <span className="ml-auto text-neutral-400">
        {new Date(item.occurredAt).toLocaleTimeString()}
      </span>
    </li>
  );
}

function inboxTypeLabel(type: InboxItemType): TranslateKey {
  switch (type) {
    case "worker.ended":
      return "orchestration.inbox.ended";
    case "worker.ask_user":
      return "orchestration.inbox.asked";
    case "worker.auto_retry_failed":
      return "orchestration.inbox.retryFailed";
    case "worker.process_alert":
      return "orchestration.inbox.process";
    case "worker.deleted":
      return "orchestration.inbox.deleted";
    case "worker.detached":
      return "orchestration.inbox.detached";
  }
}

function WorkerControls({ link }: { link: SessionLink }) {
  const t = useT();
  const openSession = useSessionStore((s) => s.setActiveSession);
  const supervisorId = link.supervisorId;
  if (supervisorId === undefined) return null;
  return (
    <div className="mt-2 text-xs text-neutral-400">
      {t("orchestration.worker.ownedBySupervisor")}{" "}
      <button
        type="button"
        onClick={() => openSession(supervisorId)}
        className="font-mono underline hover:text-violet-300 light:hover:text-violet-700"
        title={supervisorId}
      >
        {supervisorId.slice(0, 8)}
      </button>
      {link.spawnedFrom !== undefined && link.spawnedFrom.mode === "summary" && (
        <span className="ml-2 italic">{t("orchestration.worker.handoffWithSummary")}</span>
      )}
    </div>
  );
}

function StateDot({ state }: { state: "streaming" | "idle" | "cold" }) {
  const t = useT();
  const cls =
    state === "streaming"
      ? "bg-emerald-500 animate-pulse"
      : state === "idle"
        ? "bg-sky-500"
        : "bg-neutral-400";
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${cls}`}
      title={t(STATE_LABEL_KEYS[state])}
      aria-label={t(STATE_LABEL_KEYS[state])}
    />
  );
}
