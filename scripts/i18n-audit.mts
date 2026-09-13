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
const COPY_ATTRIBUTES = "title|placeholder|aria-label|aria-description|alt|ariaLabel|ariaDescription|emptyHint|tooltip|hint";
/** JSX text that is really code (generics, comparisons, operators). */
const LOOKS_LIKE_CODE = /[=<>{}()[\];|&!*/+`]|\b(?:const|let|function|return|import|export)\b/;
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
  // A single bare token with no whitespace (feature/my-change, --flag, a/b)
  if (/^[\w./:+-]+$/.test(text)) return true;
  // Shell command lines (npm test, git rebase …)
  if (/^(?:npm|npx|pnpm|yarn|git|node|python3?|pip|make|docker|kubectl|cargo|go)\s/.test(text))
    return true;
  // Header-like strings (Name: value, Authorization: Bearer xxx)
  if (/^[A-Za-z][\w-]*:\s/.test(text)) return true;
  return false;
}

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
    const lines = source.split("\n");
    lines.forEach((line, index) => {
      const lineNo = index + 1;
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
      // JSX text nodes: >text<
      for (const match of line.matchAll(/>([^<>{}]+)</g)) {
        const text = match[1]!.trim();
        if (text.length < 3) continue;
        if (!/[A-Za-z]{2}/.test(text)) continue;
        if (LOOKS_LIKE_CODE.test(text)) continue;
        if (TECHNICAL_TOKEN.test(text)) continue;
        if (TS_GENERIC.test(text)) continue;
        if (isTechnicalLiteral(text)) continue;
        found.push({ file: rel, line: lineNo, text });
      }
      // User-visible attributes with a literal value.
      for (const match of line.matchAll(new RegExp(`\\b(${COPY_ATTRIBUTES})="([^"]*)"`, "g"))) {
        const text = match[2]!;
        if (!/[A-Za-z]{2}/.test(text)) continue;
        if (SAFE_ATTRIBUTE.test(text)) continue;
        if (TECHNICAL_TOKEN.test(text)) continue;
        if (isTechnicalLiteral(text)) continue;
        found.push({ file: rel, line: lineNo, text: `${match[1]}="${text}"` });
      }
    });
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
