/**
 * Locale-independent translation runtime.
 *
 * Kept free of React, zustand and locale-data imports so it can be
 * unit-tested (and reasoned about) in isolation. The public surface
 * lives in `./index.ts`.
 *
 * Key shape: dotted paths into a nested message tree
 * (`"settings.mcp.addServer"`). Both language files are plain nested
 * objects, so adding a string is a one-line change in two files.
 *
 * Fallback order for every lookup:
 *   1. active locale
 *   2. English (`en`) — the reference language
 *   3. the key itself (visible marker instead of a blank label)
 */

/** A nested message tree. Leaves are strings (or `{one, other}` plural pairs). */
export interface MessageTree {
  readonly [key: string]: string | MessageTree;
}

/** Values available to `{placeholder}` interpolation. */
export type TranslateParams = Record<string, string | number>;

export type LocaleCode = "en" | "zh-CN";

export interface LocaleDefinition {
  readonly code: LocaleCode;
  /** Label shown in the language picker, written in that language. */
  readonly label: string;
  /** BCP-47 tag written to `<html lang>`. */
  readonly htmlLang: string;
  readonly messages: MessageTree;
}

/** Plural categories we support. Chinese only ever uses `other`. */
export type PluralCategory = "one" | "other";

const PLACEHOLDER = /\{(\w+)\}/g;

/** Interpolate `{name}` placeholders. Unknown placeholders are left as-is. */
export function interpolate(template: string, params?: TranslateParams): string {
  if (params === undefined) return template;
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

/** Walk a dotted path. Returns `undefined` when missing or not a string leaf. */
export function lookupPath(tree: MessageTree, path: string): string | undefined {
  let node: string | MessageTree | undefined = tree;
  for (const segment of path.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[segment];
  }
  return typeof node === "string" ? node : undefined;
}

/**
 * Resolve one message from one locale with no cross-locale fallback.
 * `category` selects a plural branch when the entry is a plural pair.
 */
export function resolveInLocale(
  locale: LocaleDefinition,
  key: string,
  category?: PluralCategory,
): string | undefined {
  if (category === undefined) return lookupPath(locale.messages, key);
  // Plural entries are nested `{ one, other }` objects. Chinese only
  // ships `other`, so `one` falls through to it rather than to English.
  const preferred = category === "one" ? ["one", "other"] : ["other", "one"];
  for (const branch of preferred) {
    const hit = lookupPath(locale.messages, `${key}.${branch}`);
    if (hit !== undefined) return hit;
  }
  return lookupPath(locale.messages, key);
}

/** Which English plural branch a count uses. */
export function pluralCategoryFor(count: number): PluralCategory {
  // `Intl.PluralRules` would be more general; English has two branches
  // and adding more languages here would be the place to revisit.
  return count === 1 ? "one" : "other";
}

export interface Translator {
  /** Translate a key, interpolating `{placeholders}`. */
  (key: string, params?: TranslateParams): string;
  /** Translate a plural pair (`{one}` / `{other}`) for `count`. */
  plural: (key: string, count: number, params?: TranslateParams) => string;
  /** Look up a key without the English fallback — for "is it translated?" checks. */
  has: (key: string, locale: LocaleCode) => boolean;
}

export interface TranslatorOptions {
  /** Locales by code, English included. */
  readonly locales: readonly LocaleDefinition[];
  /** Reads the active locale at call time (so a single bound `t` stays fresh). */
  readonly getLocale: () => LocaleCode;
  /** Called once per missing key; used for dev-time warnings. */
  readonly onMissing?: (key: string, locale: LocaleCode) => void;
}

const ENGLISH: LocaleCode = "en";

/**
 * Build the translator used by both the module-level `t` and the
 * `useT()` hook. The returned function is stable — its locale is read
 * through `getLocale` on every call, so React re-renders (triggered by
 * the store subscription in `useT`) are the only thing that needs to
 * change for a language switch to take effect.
 */
export function createTranslator(options: TranslatorOptions): Translator {
  const byCode = new Map<LocaleCode, LocaleDefinition>();
  for (const locale of options.locales) byCode.set(locale.code, locale);

  const english = byCode.get(ENGLISH);
  const warned = new Set<string>();

  function missing(key: string, locale: LocaleCode): string {
    const marker = `${locale}:${key}`;
    if (!warned.has(marker)) {
      warned.add(marker);
      options.onMissing?.(key, locale);
    }
    return key;
  }

  function translate(key: string, params?: TranslateParams, category?: PluralCategory): string {
    const active = options.getLocale();
    const activeLocale = byCode.get(active);
    let template: string | undefined;
    if (activeLocale !== undefined) template = resolveInLocale(activeLocale, key, category);
    // English is the reference language: a missing Chinese string must
    // never blank out the UI, it degrades to English.
    if (template === undefined && english !== undefined && active !== ENGLISH) {
      template = resolveInLocale(english, key, category);
    }
    if (template === undefined) return missing(key, active);
    return interpolate(template, params);
  }

  const translator = ((key: string, params?: TranslateParams) =>
    translate(key, params)) as Translator;

  translator.plural = (key: string, count: number, params?: TranslateParams) =>
    translate(key, { count, ...params }, pluralCategoryFor(count));

  translator.has = (key: string, locale: LocaleCode) => {
    const def = byCode.get(locale);
    return def !== undefined && resolveInLocale(def, key) !== undefined;
  };

  return translator;
}

/** Flatten a message tree into dotted keys — used by the audit script. */
export function flattenKeys(tree: MessageTree, prefix = ""): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix.length === 0 ? key : `${prefix}.${key}`;
    if (typeof value === "string") out.push(path);
    else out.push(...flattenKeys(value, path));
  }
  return out;
}

/** Read a nested leaf as a string (or `undefined`). Used by audit tooling. */
export function readLeaf(tree: MessageTree, path: string): string | undefined {
  return lookupPath(tree, path);
}
