import type { TFunction } from "../i18n";

/**
 * The pi SDK names a freshly created session `New session`, and the server
 * de-duplicates collisions as `New session (2)`, `New session (3)` … — see
 * `packages/server/src/session-title.ts`, which owns the same pattern.
 *
 * That default name is SERVER-side copy, so it arrives in English. Rather
 * than fork the server's behaviour, the UI recognizes the generic default and
 * renders a localized label. A user-chosen name never matches, so real names
 * pass through untouched.
 *
 * Display-only: the stored name (and anything the user renames it to) is
 * unchanged.
 */
const GENERIC_SESSION_NAME_RE = /^New session(?: \((\d+)\))?$/;

export function localizeSessionName(name: string, t: TFunction): string {
  const match = GENERIC_SESSION_NAME_RE.exec(name);
  if (match === null) return name;
  const ordinal = match[1];
  return ordinal === undefined
    ? t("common.newSession")
    : t("common.newSessionNumbered", { count: Number(ordinal) });
}

/** True when `name` is the SDK's generic default rather than a real title. */
export function isGenericSessionName(name: string): boolean {
  return GENERIC_SESSION_NAME_RE.test(name);
}
