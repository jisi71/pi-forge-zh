# pi-forge i18n

Source-level internationalization for the React workbench. Two locales
ship today — **English** (reference) and **简体中文** (`zh-CN`) — with a
runtime fallback: anything missing in Chinese renders the English string
instead of a blank label or a raw key.

This directory is the ONLY place UI copy lives. No DOM-replacement
script, no post-build patching, no forked `dist/` artifacts: a language
change is a rebuild of the client bundle.

```
src/i18n/
├── index.ts        runtime + hooks (t, t.plural, useT, useLocale, setLocale)
├── runtime.ts      locale-agnostic lookup / interpolation / fallback
├── types.ts        DeepPartial / MessageKey / PluralKey helpers
├── locales/
│   ├── en/         reference locale — defines the key set AND the types
│   │   ├── index.ts       assembles the bundle
│   │   ├── common.ts      shared vocabulary (buttons, states, units)
│   │   └── <area>.ts      one file per feature area
│   └── zh-CN/      same file names, same keys, Chinese values
└── README.md
```

## Using it

```tsx
import { useT } from "../i18n";

export function Widget() {
  const t = useT();
  return (
    <>
      <h2>{t("settings.mcp.title")}</h2>
      <button title={t("common.refresh")}>{t("common.refresh")}</button>
      <p>{t("projects.delete.summary", { name: project.name })}</p>
      <p>{t.plural("common.fileCount", files.length)}</p>
    </>
  );
}
```

Rules:

1. **Components use `useT()`**, not the bare `t` import. The hook
   subscribes to the language store so the component re-renders when the
   language changes; the bare `t` is for non-React modules (stores,
   `api-client`, SSE handlers) where a re-render is driven by state.
2. **Keys must be static.** `t(\`x.${value}\`)` is a type error by
   design. When you need one label per enum value, build a lookup table
   typed as `Record<Value, TranslateKey>` (`TranslateKey` is exported
   from `../i18n`).
3. **Plurals** go through `t.plural(key, count)`. In English define
   `{ one, other }`; in Chinese define only `{ other }`.
4. Interpolation is `{name}`. Keep placeholders verbatim in every
   language.

## Adding a string

1. Add the key to `locales/en/<area>.ts`.
2. Add the same key to `locales/zh-CN/<area>.ts`. Optional — omission
   falls back to English, and `npm run i18n:audit` reports the gap.
3. Use it in the component.

Adding a whole area means creating the pair of files and wiring both
`locales/en/index.ts` and `locales/zh-CN/index.ts`.

Because the Chinese bundle is typed as `DeepPartial<typeof en>`, a typo
in a Chinese key fails `tsc`; because `t()` is typed as
`MessageKey<typeof en>`, a typo in a component fails `tsc` too. Run
`npm run check` (or at least `npx tsc --noEmit` inside `packages/client`)
after touching copy.

## What is NOT translated

Technical identifiers stay in their original form in every language:

- model / provider ids (`claude-sonnet-4-5`, `openai`, `vllm`)
- command names, CLI flags, env vars (`/compact`, `--port`, `PI_CONFIG_DIR`)
- file paths, file names, glob patterns, JSON keys, API field names
- protocol and product names (`MCP`, `SSE`, `OpenAPI`, `pi-forge`, `pi`, `Git`, `GitHub`)
- code, diffs, and anything rendered from a user's repository
- shell output, agent output, and model output (the SDK's own text)

Code comments stay in English so upstream diffs stay reviewable.

## Language selection

Resolution order at boot (`bootLocale()` in `main.tsx`, before React
mounts):

1. `?lang=<code>` query parameter (`zh-CN`, `en`, or `auto`) — also
   persisted, so a preview link pins the language.
2. persisted preference in `localStorage["pi-forge/locale"]`
3. browser preference (`navigator.languages`, `zh*` → `zh-CN`)
4. `en`

The picker lives in **Settings → Appearance → Language**
(`components/LanguagePicker.tsx`). It only writes localStorage; the
server is never involved, and no project/session data is touched.

## Verification

```bash
npm run i18n:audit          # key parity, orphan keys, leftover literals
npm run i18n:audit -- --strict   # non-zero exit when gaps exist
cd packages/client && npx tsc --noEmit
```

`scripts/i18n-audit.mts` checks:

- every `en` leaf has a `zh-CN` counterpart (gap → warning, listed)
- every `zh-CN` leaf exists in `en` (orphan → error)
- area file → bundle wiring is complete in both locales
- heuristic scan for English UI literals left in `packages/client/src`
  JSX text and `title` / `placeholder` / `aria-label` / `alt` attributes

The heuristic can produce false positives (code samples, unit strings),
so `--strict` is a review aid, not a gate that must be green for a
technical string.

## Upstream upgrades

Locale files are additive. When merging a new upstream tag:

1. `git merge`/rebase the new tag in the fork's source tree.
2. `npx tsc --noEmit -p packages/client` — if upstream added a call to a
   key that no longer exists (or renamed one), the compiler names it.
3. `npm run i18n:audit` — lists English keys that still need Chinese.
4. Add the missing Chinese strings; keys removed upstream should be
   removed from `zh-CN` (the audit flags them as orphans).
5. Re-run the upgrade verification script — see
   `docs/zh-CN/UPGRADE.md` in the fork root.
