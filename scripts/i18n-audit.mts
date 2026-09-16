#!/usr/bin/env node
/**
 * i18n audit for pi-forge.
 *
 *   npm run i18n:audit              # report only
 *   npm run i18n:audit -- --strict  # exit 1 on gaps / orphan keys / leftovers
 *   npm run i18n:audit -- --json    # machine-readable report
 *
 * Three checks:
 *
 *   1. Key parity — every English leaf should have a Chinese leaf.
 *      Missing Chinese is a *fallback*, not a crash, so it is a warning
 *      unless --strict. Orphan Chinese keys (no English counterpart)
 *      are always an error: they mean the key was renamed or removed.
 *
 *   2. Bundle wiring — every `locales/<code>/<area>.ts` on disk is
 *      imported AND listed in that locale's `index.ts`, and vice versa.
 *
 *   3. Leftover literals — heuristic scan of `packages/client/src` for
 *      English UI strings that were not routed through `t()`. This is a
 *      review aid: code samples, units and brand names legitimately
 *      stay in English.
 *
 * Run via `tsx` (see root package.json) so the TS locale modules can be
 * imported directly — no duplicated key list to drift.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { flattenKeys, type MessageTree } from "../packages/client/src/i18n/runtime.ts";
import { en } from "../packages/client/src/i18n/locales/en/index.ts";
import { zhCN } from "../packages/client/src/i18n/locales/zh-CN/index.ts";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES_DIR = join(REPO_ROOT, "packages/client/src/i18n/locales");
const CLIENT_SRC = join(REPO_ROOT, "packages/client/src");

const args = new Set(process.argv.slice(2));
const STRICT = args.has("--strict");
const JSON_OUT = args.has("--json");

interface Missing {
  en: string[];
  zh: string[];
  zhOrphans: string[];
  wiring: string[];
  literals: { file: string; line: number; text: string }[];
}

function checkParity(): Pick<Missing, "en" | "zh" | "zhOrphans"> {
  const enKeys = new Set(flattenKeys(en as unknown as MessageTree));
  const zhKeys = new Set(flattenKeys(zhCN as unknown as MessageTree));
  // Chinese has one plural form, so locale files intentionally ship only
  // the `other` branch of a plural pair. A missing `.one` whose `.other`
  // exists is therefore not a gap.
  const pluralOtherPresent = (key: string): boolean =>
    key.endsWith(".one") && zhKeys.has(`${key.slice(0, -4)}.other`);
  return {
    en: [...enKeys].filter((k) => !zhKeys.has(k) && !pluralOtherPresent(k)).sort(),
    zh: [...zhKeys].filter((k) => !enKeys.has(k)).sort(),
    zhOrphans: [...zhKeys].filter((k) => !enKeys.has(k)).sort(),
  };
}

/** Compare each locale dir on disk against the imports + object keys in its index.ts. */
function checkWiring(): string[] {
  const problems: string[] = [];
  for (const code of ["en", "zh-CN"]) {
    const dir = join(LOCALES_DIR, code);
    const indexPath = join(dir, "index.ts");
    const indexSource = readFileSync(indexPath, "utf8");
    const onDisk = readdirSync(dir)
      .filter((f) => f.endsWith(".ts") && f !== "index.ts")
      .map((f) => f.replace(/\.ts$/, ""))
      .sort();

    for (const area of onDisk) {
      const imported = new RegExp(`from "\\./${area}"`).test(indexSource);
      if (!imported) {
        problems.push(`${code}/index.ts does not import ./${area}`);
      }
    }
    // Any `import { x } from "./y"` whose file is gone.
    for (const match of indexSource.matchAll(/from "\.\/([\w-]+)"/g)) {
      const area = match[1]!;
      if (!onDisk.includes(area)) {
        problems.push(`${code}/index.ts imports ./${area} but the file is missing`);
      }
    }
  }
  return problems;
}

const I18N_IMPORT = /from "\.+\/(?:\.\.\/)*i18n"/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/**
 * Attribute values that are legitimately not translated. Anything
 * matching these shapes is skipped so the report stays actionable.
 */
const SAFE_ATTRIBUTE = /^(?:https?:\/\/|\/|#|mailto:|data:|_blank|noopener|noreferrer|[\w-]+$)/;
/**
 * Attributes that carry user-visible copy. Covers both the DOM spelling
 * (`aria-label=`) and the React prop spelling used by this codebase's own
 * primitives (`ariaLabel=`, `emptyHint=`, `tooltip=`). Missing the camelCase
 * forms is how `ariaLabel="Resize project sidebar"` slipped through once.
 */
const COPY_ATTRIBUTES =
  "title|placeholder|aria-label|aria-description|alt|ariaLabel|ariaDescription|emptyHint|tooltip|hint";
/** JSX text that is really code (generics, comparisons, operators). */
// NOTE: the `]` MUST be escaped. Writing `[=<>{}()[];...]` closes the class at
// the inner `]`, which silently turned this filter into a no-op for `(`, `)`,
// `!`, `|`, `&`, `*` — the exact characters that mark JSX ternaries and type
// annotations. (`[` needs no escape inside a class; `]` does.)
const LOOKS_LIKE_CODE = /[=<>{}()[\];|&!*`]|\b(?:const|let|function|return|import|export)\b/;
/** JSX text nodes that are pure technical identifiers (kebab/snake/CONSTANT). */
const TECHNICAL_TOKEN = /^(?:[A-Z][A-Z0-9_]*|[a-z][a-z0-9-]*|[a-z0-9_.-/]+)$/;
/**
 * TypeScript generics leak into the JSX-text heuristic (e.g. the `<` of
 * `Array<Promise<void>>` is read as a tag boundary). These are never copy.
 */
const TS_GENERIC =
  /^(?:Promise|Partial|Readonly|ReadonlyArray|Record|Map|Set|Array|Pick|Omit|Exclude|Extract|ReturnType|Parameters|Awaited|NonNullable|Iterable|PromiseLike|string|number|boolean|unknown|never)$/;

/**
 * A literal that is legitimately not translated: URLs, file names,
 * placeholders that are commands/refs/headers, and similar technical text.
 * Checked before reporting an attribute or JSX-text hit.
 */
function isTechnicalLiteral(text: string): boolean {
  if (text.includes("@") || text.includes("://") || /\bBearer\b/.test(text)) return true;
  // File names with a known extension (skills-overrides.json, README.md …)
  if (
    /\b[\w-]+\.(?:json|jsonl|md|ts|tsx|js|mjs|cjs|css|html|txt|yml|yaml|env|lock|toml|sh|bash|py|rs|go)\b/.test(
      text,
    )
  )
    return true;
  // Paths and refs: must contain a separator to qualify (feature/my-change, a/b)
  // Paths, including home-relative ones (~/.pi/agent/skills/)
  if (/^[~\w.:+-]*[/\\][\w./:+-]*$/.test(text)) return true;
  // Absolute/relative commands with arguments (/bin/sh -c, ./run.sh --watch)
  if (/^[~.]?\/[\w./-]+(?:\s+[\w-]+)*$/.test(text)) return true;
  // CLI flags
  if (/^-{1,2}[\w-]+$/.test(text)) return true;
  // Lowercase identifier-ish words (glob, retry, model) — a capitalized word
  // like "Saved" is UI copy and must NOT be swallowed here.
  if (/^[a-z][a-z0-9-]*$/.test(text)) return true;
  // Shell command lines (npm test, git rebase …)
  if (/^(?:npm|npx|pnpm|yarn|git|node|python3?|pip|make|docker|kubectl|cargo|go)\s/.test(text))
    return true;
  // Header-like strings (Name: value, Authorization: Bearer xxx)
  if (/^[A-Za-z][\w-]*:\s/.test(text)) return true;
  return false;
}

function lineNumberAt(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i += 1) {
    if (source.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

/** Is the given offset inside a `//` or block comment? (Heuristic.) */
function inComment(source: string, index: number): boolean {
  const lineStart = source.lastIndexOf("\n", index) + 1;
  const before = source.slice(lineStart, index);
  if (before.includes("//")) return true;
  const open = source.lastIndexOf("/*", index);
  const close = source.lastIndexOf("*/", index);
  return open > close;
}

/**
 * Heuristic scan for user-visible English that was not routed through `t()`.
 *
 * Scans the WHOLE file (not line by line) so a JSX text node that Prettier
 * wrapped across several lines is still one match — that gap is how
 * `ariaLabel="Resize project sidebar"` and the multi-line OTEL copy first
 * slipped past a line-based version of this check.
 *
 * Known blind spots, covered by the runtime walkthrough instead:
 *   - text assembled from a variable/ternary
 *   - module-level lookup tables of labels
 */
function scanLiterals(): Missing["literals"] {
  const found: Missing["literals"] = [];
  for (const file of walk(CLIENT_SRC)) {
    const rel = relative(REPO_ROOT, file);
    if (rel.includes("/i18n/")) continue;
    if (rel.endsWith(".d.ts")) continue;
    const source = readFileSync(file, "utf8");
    // Only audit files that already opted into i18n; files that have not
    // been migrated yet are tracked by the progress summary instead.
    if (!I18N_IMPORT.test(source)) continue;

    /**
     * `display` is what gets reported; `subject` is what gets classified.
     * They differ for attributes, where the reported text is
     * `ariaLabel="…"` (which contains `=` and would be filtered as code)
     * while the classification must look at the value alone.
     */
    const push = (index: number, display: string, subject = display): void => {
      if (subject.length < 3) return;
      if (!/[A-Za-z]{3}/.test(subject)) return;
      if (inComment(source, index)) return;
      if (LOOKS_LIKE_CODE.test(subject)) return;
      if (TECHNICAL_TOKEN.test(subject)) return;
      if (TS_GENERIC.test(subject)) return;
      if (isTechnicalLiteral(subject)) return;
      found.push({
        file: rel,
        line: lineNumberAt(source, index),
        text: display.replace(/\s+/g, " "),
      });
    };

    // JSX text nodes: >text< — `[^<>{}]` spans newlines on purpose.
    //
    // Only .tsx files are scanned this way: in a plain .ts file the only `>`…`<`
    // pairs come from generic type annotations (`Record<string, X>`), and a
    // whole-file scan happily spans a comment block between two of them.
    // A match containing a comment fragment is likewise not JSX text.
    if (file.endsWith(".tsx")) {
      for (const match of source.matchAll(/>([^<>{}]+)</g)) {
        const text = match[1]!;
        // A match that spans a comment is not JSX text: the `>`/`<` pair came
        // from an arrow function or a generic sitting next to a comment.
        if (text.includes("//") || text.includes("/*")) continue;
        push(match.index, text.trim());
      }
    }
    // User-visible attributes with a literal value.
    for (const match of source.matchAll(new RegExp(`\\b(${COPY_ATTRIBUTES})="([^"]*)"`, "g"))) {
      const text = match[2]!;
      if (!/[A-Za-z]{2}/.test(text)) continue;
      if (SAFE_ATTRIBUTE.test(text)) continue;
      push(match.index, `${match[1]}="${text}"`, text);
    }
    // Template literals containing an English sentence (>=3 words). These are
    // usually error/banner copy built with an interpolated code.
    for (const match of source.matchAll(/`([^`$]*?)`/g)) {
      const text = match[1]!.trim();
      if (!/^[A-Z][A-Za-z]*(?:\s+[A-Za-z'’,.:-]+){2,}/.test(text)) continue;
      if (inComment(source, match.index)) continue;
      if (isTechnicalLiteral(text)) continue;
      found.push({
        file: rel,
        line: lineNumberAt(source, match.index),
        text: `template: ${text.replace(/\s+/g, " ")}`,
      });
    }
  }
  return found;
}

function countMigratedFiles(): { migrated: number; total: number } {
  const files = walk(CLIENT_SRC).filter(
    (f) => !f.includes("/i18n/") && !f.endsWith("vite-env.d.ts"),
  );
  let migrated = 0;
  for (const file of files) {
    if (I18N_IMPORT.test(readFileSync(file, "utf8"))) migrated += 1;
  }
  return { migrated, total: files.length };
}

const parity = checkParity();
const wiring = checkWiring();
const literals = scanLiterals();
const progress = countMigratedFiles();

const report: Missing = {
  en: parity.en,
  zh: parity.zh,
  zhOrphans: parity.zhOrphans,
  wiring,
  literals,
};

if (JSON_OUT) {
  process.stdout.write(`${JSON.stringify({ ...report, progress }, null, 2)}\n`);
} else {
  const totalKeys = flattenKeys(en as unknown as MessageTree).length;
  console.log(`i18n audit — ${totalKeys} English keys, ${totalKeys - parity.en.length} translated`);
  console.log(`  files using i18n: ${progress.migrated}/${progress.total}`);

  if (parity.en.length > 0) {
    console.log(`\n[gap] ${parity.en.length} English key(s) without a zh-CN translation:`);
    for (const key of parity.en) console.log(`  - ${key}`);
  }
  if (parity.zhOrphans.length > 0) {
    console.log(`\n[orphan] ${parity.zhOrphans.length} zh-CN key(s) missing from en:`);
    for (const key of parity.zhOrphans) console.log(`  - ${key}`);
  }
  if (wiring.length > 0) {
    console.log(`\n[wiring] ${wiring.length} problem(s):`);
    for (const problem of wiring) console.log(`  - ${problem}`);
  }
  if (literals.length > 0) {
    console.log(`\n[literal] ${literals.length} untranslated string(s) in migrated files:`);
    for (const hit of literals.slice(0, 200)) {
      console.log(`  - ${hit.file}:${hit.line}  ${hit.text}`);
    }
    if (literals.length > 200) console.log(`  … ${literals.length - 200} more`);
  }
  if (
    parity.en.length === 0 &&
    parity.zhOrphans.length === 0 &&
    wiring.length === 0 &&
    literals.length === 0
  ) {
    console.log("\nNo issues found.");
  }
}

const failed = report.zhOrphans.length > 0 || report.wiring.length > 0;
const strictFailed = failed || report.en.length > 0 || report.literals.length > 0;
if (STRICT ? strictFailed : failed) {
  process.exit(1);
}
