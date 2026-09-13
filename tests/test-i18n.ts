/**
 * i18n integrity tests.
 *
 * pi-forge has no browser test harness, so this covers the locale bundles and
 * the runtime directly. It is the regression net for the property that makes
 * a growing set of locales safe: English is the reference bundle, its key set
 * is the TypeScript type every other bundle is checked against, and anything
 * a locale forgets falls back to English instead of rendering a raw key.
 *
 * Run: npx tsx tests/test-i18n.ts
 */
import { createTranslator, flattenKeys } from "../packages/client/src/i18n/runtime";
import { en } from "../packages/client/src/i18n/locales/en/index";
import { zhCN } from "../packages/client/src/i18n/locales/zh-CN/index";

let failures = 0;
function assert(label: string, ok: boolean, detail?: string): void {
  if (ok) {
    console.log(`PASS ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL ${label}${detail === undefined ? "" : `: ${detail}`}`);
  }
}

const enKeys = new Set(flattenKeys(en));
const zhKeys = new Set(flattenKeys(zhCN));

console.log("bundle shape");
assert("english bundle is not empty", enKeys.size > 0, `keys=${String(enKeys.size)}`);
assert("chinese bundle is not empty", zhKeys.size > 0, `keys=${String(zhKeys.size)}`);

// A plural pair is `{ one, other }` in English; Chinese has a single plural
// form, so a zh bundle is expected to ship only `other`.
const zhPluralOthers = new Set(
  [...zhKeys].filter((k) => k.endsWith(".other")).map((k) => k.slice(0, -".other".length)),
);
const missingInZh = [...enKeys].filter(
  (k) => !zhKeys.has(k) && !(k.endsWith(".one") && zhPluralOthers.has(k.slice(0, -".one".length))),
);
assert(
  "every english key has a chinese counterpart (or an intentional plural omission)",
  missingInZh.length === 0,
  missingInZh.slice(0, 10).join(", "),
);

const orphans = [...zhKeys].filter((k) => !enKeys.has(k));
assert(
  "no orphan chinese keys (renamed/removed upstream)",
  orphans.length === 0,
  orphans.slice(0, 10).join(", "),
);

// A translation that drops or renames a {placeholder} silently renders a
// broken sentence, so compare the placeholder sets key by key.
const placeholders = (value: string): string =>
  [...value.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1]!)
    .sort()
    .join(",");
const readLeaf = (tree: unknown, path: string): string | undefined => {
  let node: unknown = tree;
  for (const segment of path.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[segment];
  }
  return typeof node === "string" ? node : undefined;
};
const placeholderMismatch: string[] = [];
for (const key of enKeys) {
  const source = readLeaf(en, key);
  const target = readLeaf(zhCN, key);
  if (source === undefined || target === undefined) continue;
  if (placeholders(source) !== placeholders(target)) {
    placeholderMismatch.push(
      `${key} (en: ${placeholders(source) || "-"} vs zh: ${placeholders(target) || "-"})`,
    );
  }
}
assert(
  "chinese translations keep every {placeholder} of the english source",
  placeholderMismatch.length === 0,
  placeholderMismatch.slice(0, 10).join("; "),
);

console.log("\nruntime behaviour");
const seen: string[] = [];
const t = createTranslator({
  locales: [
    { code: "en", label: "English", htmlLang: "en", messages: en },
    {
      code: "zh-CN",
      label: "简体中文",
      htmlLang: "zh-CN",
      messages: zhCN,
    },
  ],
  getLocale: () => "zh-CN",
  onMissing: (key) => seen.push(key),
});

assert("translates a known key", t("common.save") === "保存", t("common.save"));
assert(
  "interpolates named placeholders",
  t("common.sessionCount.other", { count: 3 }) === "3 个会话",
  t("common.sessionCount.other", { count: 3 }),
);
// Chinese has a single plural form: a count of 1 must still pick `.other`,
// never the English `.one` branch.
assert(
  "chinese uses its single plural form for count 1 and 2",
  t.plural("common.fileCount", 1) === "1 个文件" && t.plural("common.fileCount", 2) === "2 个文件",
  `${t.plural("common.fileCount", 1)} / ${t.plural("common.fileCount", 2)}`,
);
assert(
  "a key missing from the locale falls back to the english value",
  t("common.fileCount.one", { count: 1 }) === "1 file",
  t("common.fileCount.one", { count: 1 }),
);

// English plural selection is locale-independent logic, so pin it with an
// english-only translator.
const enOnly = createTranslator({
  locales: [{ code: "en", label: "English", htmlLang: "en", messages: en }],
  getLocale: () => "en",
});
assert(
  "english picks one/other by count",
  enOnly.plural("common.fileCount", 1) === "1 file" &&
    enOnly.plural("common.fileCount", 2) === "2 files",
  `${enOnly.plural("common.fileCount", 1)} / ${enOnly.plural("common.fileCount", 2)}`,
);
assert(
  "reports a missing key instead of rendering an empty string",
  t("does.not.exist") === "does.not.exist",
  t("does.not.exist"),
);
assert("notifies onMissing for the missing key", seen.includes("does.not.exist"), seen.join(","));

if (failures > 0) {
  console.error(`\n[test-i18n] ${String(failures)} failure(s).`);
  process.exit(1);
}
console.log("\nAll i18n integrity checks passed.");
