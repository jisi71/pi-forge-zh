/**
 * Type helpers for the locale files.
 *
 * The English file (`locales/en/**`) is the reference: it defines the
 * full key set AND the TypeScript types other locales are checked
 * against. Adding a string is therefore:
 *   1. add the key to the area's `en/<area>.ts`
 *   2. add the same key to `zh-CN/<area>.ts` (optional — a missing key
 *      falls back to English at runtime rather than rendering blank)
 */

/** Every non-leaf in a message tree becomes optional in a translation. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]>;
};

/**
 * Union of all dotted leaf paths in a message tree, e.g.
 * `"common.save" | "settings.mcp.addServer"`. Used to type `t()` so a
 * typo fails `tsc` instead of silently rendering the raw key.
 */
export type MessageKey<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${MessageKey<T[K]>}`;
}[keyof T & string];

/**
 * Union of dotted paths whose entry is a plural pair
 * (`{ one, other }`). Those are consumed by `t.plural(...)`, which
 * picks the branch from the count.
 */
export type PluralKey<T> = {
  [K in keyof T & string]: T[K] extends { one: string; other: string }
    ? K
    : T[K] extends object
      ? `${K}.${PluralKey<T[K]>}`
      : never;
}[keyof T & string];
