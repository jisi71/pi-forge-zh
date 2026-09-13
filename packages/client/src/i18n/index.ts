/**
 * Client-side i18n entry point.
 *
 * Usage in a component:
 *
 *   const t = useT();
 *   <button>{t("common.save")}</button>
 *   <p>{t("projects.delete.body", { name: project.name })}</p>
 *   <p>{t.plural("common.sessionCount", n)}</p>
 *
 * Usage outside React (stores, api-client, SSE handlers):
 *
 *   import { t } from "../i18n";
 *
 * `useT()` exists so a component re-renders when the language changes;
 * the returned function is the same shared instance as the module-level
 * `t`, and both read the active locale at call time.
 *
 * Locale files live in `./locales/<code>/` and are plain nested
 * objects. English is the reference; anything missing in another
 * locale falls back to English, then to the key itself.
 */

import { useSyncExternalStore } from "react";
import { en, type EnMessages } from "./locales/en";
import { zhCN } from "./locales/zh-CN";
import {
  createTranslator,
  type LocaleCode,
  type LocaleDefinition,
  type TranslateParams,
  type Translator,
} from "./runtime";
import { type MessageKey, type PluralKey } from "./types";

export type { LocaleCode, MessageTree, TranslateParams } from "./runtime";

/**
 * Every valid `t()` key. Handy when a component needs to store keys in
 * a lookup table (e.g. one label per enum value) instead of writing a
 * nested ternary:
 *
 *   const LABELS: Record<Mode, TranslateKey> = { fast: "x.fast", ... };
 */
export type TranslateKey = MessageKey<EnMessages>;

/** `"auto"` follows the browser; otherwise an explicit locale code. */
export type LocalePreference = "auto" | LocaleCode;

export const LOCALES: readonly LocaleDefinition[] = [
  { code: "en", label: "English", htmlLang: "en", messages: en },
  { code: "zh-CN", label: "简体中文", htmlLang: "zh-CN", messages: zhCN },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

const STORAGE_KEY = "pi-forge/locale";

/** Typed translate function. Keys are checked against the English file. */
export interface TFunction {
  (key: MessageKey<EnMessages>, params?: TranslateParams): string;
  /** Plural pair lookup: `t.plural("common.fileCount", files.length)`. */
  plural: (key: PluralKey<EnMessages>, count: number, params?: TranslateParams) => string;
}

const rawTranslator: Translator = createTranslator({
  locales: LOCALES,
  getLocale: () => activeLocale,
  onMissing: (key, locale) => {
    // Dev-only: a missing key is a translation gap, not a runtime bug.
    // English is the reference, so only gaps in OTHER locales warn.
    if (locale !== "en" && import.meta.env.DEV) {
      console.warn(`[i18n] missing ${locale} translation for "${key}"`);
    }
  },
});

/** Shared, locale-aware translator. */
export const t = rawTranslator as unknown as TFunction;

/**
 * Escape hatch for keys built at runtime (e.g. a lookup table keyed by a
 * server value). Prefer `t()` — this bypasses type checking.
 */
export function tRaw(key: string, params?: TranslateParams): string {
  return rawTranslator(key, params);
}

function isLocaleCode(value: unknown): value is LocaleCode {
  return LOCALES.some((locale) => locale.code === value);
}

function isPreference(value: unknown): value is LocalePreference {
  return value === "auto" || isLocaleCode(value);
}

/** Best match for the browser's preferred languages, or the default. */
export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const candidates = [...(navigator.languages ?? []), navigator.language].filter(
    (tag): tag is string => typeof tag === "string",
  );
  for (const tag of candidates) {
    const normalized = tag.toLowerCase();
    if (normalized === "zh" || normalized.startsWith("zh-")) {
      // Region-specific Chinese variants all map to the Simplified
      // bundle today; add a `zh-TW` file + branch here when needed.
      return "zh-CN";
    }
    if (normalized === "en" || normalized.startsWith("en-")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function localeDefinition(code: LocaleCode): LocaleDefinition {
  return LOCALES.find((locale) => locale.code === code) ?? LOCALES[0]!;
}

function readStoredPreference(): LocalePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isPreference(raw) ? raw : "auto";
  } catch {
    return "auto";
  }
}

/** `?lang=zh-CN` (or `?lang=auto`) — deterministic language for links/previews. */
function readUrlPreference(): LocalePreference | undefined {
  if (typeof location === "undefined") return undefined;
  try {
    const raw = new URLSearchParams(location.search).get("lang");
    return isPreference(raw) ? raw : undefined;
  } catch {
    return undefined;
  }
}

let preference: LocalePreference = "auto";
let activeLocale: LocaleCode = DEFAULT_LOCALE;

const listeners = new Set<() => void>();

function applyDocumentLang(code: LocaleCode): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = localeDefinition(code).htmlLang;
}

function resolvePreference(value: LocalePreference): LocaleCode {
  return value === "auto" ? detectBrowserLocale() : value;
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function getLocale(): LocaleCode {
  return activeLocale;
}

export function getLocalePreference(): LocalePreference {
  return preference;
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Switch language. Persists the preference and updates `<html lang>`.
 * Components using `useT()` re-render on the notification.
 */
export function setLocalePreference(value: LocalePreference): LocaleCode {
  preference = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // private mode / storage disabled — the choice still applies here
  }
  const next = resolvePreference(value);
  if (next !== activeLocale) {
    activeLocale = next;
    applyDocumentLang(next);
    notify();
  } else {
    // Preference changed even if the resolved locale did not ("auto" →
    // "en" on an English browser). The picker still needs the update.
    notify();
  }
  return next;
}

/** Convenience wrapper for the settings picker. */
export function setLocale(code: LocaleCode): LocaleCode {
  return setLocalePreference(code);
}

/**
 * Resolve and apply the locale before React mounts. Order of
 * precedence: `?lang=` URL override, stored preference, browser
 * detection.
 */
export function bootLocale(): LocaleCode {
  const urlPreference = readUrlPreference();
  preference = urlPreference ?? readStoredPreference();
  if (urlPreference !== undefined) {
    try {
      localStorage.setItem(STORAGE_KEY, urlPreference);
    } catch {
      // ignore
    }
  }
  activeLocale = resolvePreference(preference);
  applyDocumentLang(activeLocale);
  return activeLocale;
}

/** Reactive active locale. */
export function useLocale(): LocaleCode {
  return useSyncExternalStore(subscribeLocale, getLocale, getLocale);
}

/** Reactive locale preference (used by the language picker). */
export function useLocalePreference(): LocalePreference {
  return useSyncExternalStore(subscribeLocale, getLocalePreference, getLocalePreference);
}

/**
 * Reactive translator for components. The function identity is stable,
 * so it is safe to use inside `useMemo` / `useCallback` dependency
 * arrays — the *component* re-renders when the locale changes.
 */
export function useT(): TFunction {
  useLocale();
  return t;
}
