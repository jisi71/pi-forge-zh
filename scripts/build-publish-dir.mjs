#!/usr/bin/env node
/**
 * Assemble `publish/` — the staging directory we ship to npm as the
 * `pi-forge` package.
 *
 * What this does:
 *   1. Sanity-checks that both server and client builds exist (caller
 *      must have already run `npm run build`).
 *   2. Wipes any prior `publish/` dir.
 *   3. Copies built server + client artifacts into `publish/dist/`.
 *   4. Copies the bin shim into `publish/bin/`.
 *   5. Synthesizes `publish/package.json` by reading the root version,
 *      hoisting the SERVER's runtime `dependencies` (the server's
 *      package.json is the source of truth — no manual duplication),
 *      and adding `bin`, `engines`, `files`, `repository`, etc.
 *   6. Copies `LICENSE` and writes a focused `README.md` that explains
 *      the npm consumer flow (different from the repo's contributor
 *      README, which assumes you cloned).
 *
 * Why a staging dir instead of flipping the root `private: false`:
 * keeps the source tree clean. The published artifact is a flat
 * single-package layout; the dev-time monorepo layout stays as it is.
 * No drift risk from manually keeping a hoisted-deps list in sync —
 * we read the server's deps fresh on every build.
 *
 * Run via: `npm run build:publish` (which depends on `npm run build`).
 *
 * The CI release workflow runs this between `npm run build` and
 * `npm publish ./publish`. Locally you can also run it for a smoke
 * test or to inspect the tarball with `npm pack` from `publish/`.
 */
import { existsSync } from "node:fs";
import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLISH_DIR = resolve(REPO_ROOT, "publish");

const SERVER_DIST = resolve(REPO_ROOT, "packages/server/dist");
const CLIENT_DIST = resolve(REPO_ROOT, "packages/client/dist");
const BIN_SRC = resolve(REPO_ROOT, "bin/pi-forge-zh.mjs");
const POSTINSTALL_SRC = resolve(REPO_ROOT, "bin/fix-pty-perms.mjs");

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function main() {
  // 1. Sanity-check inputs
  for (const [label, path] of [
    ["server dist", SERVER_DIST],
    ["client dist", CLIENT_DIST],
    ["bin shim", BIN_SRC],
    ["postinstall script", POSTINSTALL_SRC],
  ]) {
    if (!existsSync(path)) {
      console.error(
        `[build-publish-dir] missing ${label} at ${path}\n` +
          `  Run 'npm run build' first to produce server + client artifacts.`,
      );
      process.exit(1);
    }
  }

  const rootPkg = await readJson(resolve(REPO_ROOT, "package.json"));
  const serverPkg = await readJson(resolve(REPO_ROOT, "packages/server/package.json"));

  // 2. Reset the staging dir
  await rm(PUBLISH_DIR, { recursive: true, force: true });
  await mkdir(PUBLISH_DIR, { recursive: true });

  // 3. Copy artifacts
  // recursive copy with `cp` (Node >=16.7) preserves directory structure
  // including nested `core/`, `mcp/`, `routes/` etc. under the server dist.
  await cp(SERVER_DIST, resolve(PUBLISH_DIR, "dist/server"), { recursive: true });
  await cp(CLIENT_DIST, resolve(PUBLISH_DIR, "dist/client"), { recursive: true });

  // 4. Bin shim + postinstall fix-pty-perms script
  await mkdir(resolve(PUBLISH_DIR, "bin"), { recursive: true });
  await copyFile(BIN_SRC, resolve(PUBLISH_DIR, "bin/pi-forge-zh.mjs"));
  await copyFile(POSTINSTALL_SRC, resolve(PUBLISH_DIR, "bin/fix-pty-perms.mjs"));

  // 5. Synthetic package.json
  // Hoist the server's runtime deps verbatim — the server is the only
  // thing the bin actually loads, and its package.json is the
  // authoritative dep list. If a dep is added there, it's automatically
  // picked up by the next publish; nothing manual to edit here.
  if (serverPkg.dependencies === undefined) {
    console.error("[build-publish-dir] packages/server/package.json has no dependencies field");
    process.exit(1);
  }
  const publishPkg = {
    name: "pi-forge-zh",
    version: rootPkg.version,
    description:
      "Browser UI for the pi coding agent with a Simplified Chinese interface — fork of pi-forge (upstream archived), embedded HTTP server with a React workbench (chat, file browser, terminal, git, MCP).",
    keywords: [
      "pi",
      "coding-agent",
      "ai",
      "llm",
      "agent",
      "workbench",
      "fastify",
      "i18n",
      "zh-CN",
      "chinese",
    ],
    homepage: "https://github.com/jisi71/pi-forge-zh#readme",
    bugs: { url: "https://github.com/jisi71/pi-forge-zh/issues" },
    repository: {
      type: "git",
      url: "git+https://github.com/jisi71/pi-forge-zh.git",
    },
    license: "MIT",
    // Upstream MIT copyright is retained in LICENSE; the fork author is added
    // here so the published metadata reflects both.
    author: "Devin Marks (pi-forge); jisi71 (pi-forge-zh fork)",
    type: "module",
    bin: { "pi-forge-zh": "bin/pi-forge-zh.mjs" },
    files: ["bin/", "dist/", "README.md", "LICENSE"],
    // Same node target as the server workspace + CI matrix.
    engines: { node: ">=20" },
    // node-pty's tarball ships `prebuilds/<platform>/spawn-helper`
    // without a reliable executable bit (the upstream postinstall
    // only fixes `build/Release/`, not `prebuilds/`). Without an
    // exec bit, every PTY spawn fails with `posix_spawnp failed.`
    // Our postinstall walks every prebuild and chmod +x's the
    // spawn-helper. Idempotent + failure-tolerant — see
    // bin/fix-pty-perms.mjs for the full story.
    scripts: { postinstall: "node bin/fix-pty-perms.mjs" },
    dependencies: serverPkg.dependencies,
    // `publishConfig.provenance: true` makes `npm publish` attach a
    // sigstore-signed provenance attestation tying this version to the
    // GitHub Actions run that produced it. Free with the trusted-
    // publisher OIDC flow we use in `.github/workflows/release.yml`.
    publishConfig: { access: "public", provenance: true },
  };
  await writeFile(resolve(PUBLISH_DIR, "package.json"), JSON.stringify(publishPkg, null, 2) + "\n");

  // 6. LICENSE + README
  await copyFile(resolve(REPO_ROOT, "LICENSE"), resolve(PUBLISH_DIR, "LICENSE"));
  await writeFile(resolve(PUBLISH_DIR, "README.md"), buildPublishReadme(rootPkg.version));

  // Friendly summary
  console.log(`[build-publish-dir] assembled publish/ for ${publishPkg.name}@${rootPkg.version}`);
  console.log(`  server dist: ${relativeFromRoot(SERVER_DIST)} → publish/dist/server/`);
  console.log(`  client dist: ${relativeFromRoot(CLIENT_DIST)} → publish/dist/client/`);
  console.log(`  bin: bin/pi-forge-zh.mjs → publish/bin/pi-forge-zh.mjs`);
  console.log(`  ${Object.keys(publishPkg.dependencies).length} runtime deps hoisted from server`);
  console.log(`Inspect with: cd publish && npm pack --dry-run`);
}

function relativeFromRoot(p) {
  return p.startsWith(REPO_ROOT) ? p.slice(REPO_ROOT.length + 1) : p;
}

function buildPublishReadme(version) {
  // Consumer-facing README. The in-repo README targets contributors; npm users
  // want install/run/configure and an honest statement of what this fork is.
  return `# pi-forge-zh

**Simplified Chinese** interface for
[pi-forge](https://github.com/Devin-Marks/pi-forge) — a self-hosted browser UI for the
[pi coding agent](https://github.com/earendil-works/pi).

> **This is a community fork.** Upstream \`pi-forge\` was
> [archived](https://github.com/Devin-Marks/pi-forge) on 2026-09-16, so the project is no
> longer maintained there. This build is \`pi-forge-zh@${version}\`, based on the last
> upstream release (\`v1.5.4\`), and adds a source-level i18n layer with \`en\` and
> \`zh-CN\` locales. Upstream copyright and the MIT license are retained — see
> [LICENSE](./LICENSE).

## Install

\`\`\`bash
# One-shot
npx pi-forge-zh

# Or install globally
npm i -g pi-forge-zh
pi-forge-zh
\`\`\`

Open <http://localhost:3000> and pick a workspace folder. The interface follows your
browser language (\`zh*\` → Chinese, otherwise English).

## Language

| | |
|---|---|
| Follow the browser | default |
| Force Chinese | <http://localhost:3000/?lang=zh-CN> |
| Force English | <http://localhost:3000/?lang=en> |
| Switch live | **Settings → Appearance → Language** (stored in the browser only) |

Model names, provider ids, command tokens, file paths, JSON keys and protocol names are
**never** translated — only interface copy is. Anything missing from the Chinese bundle
falls back to the English string rather than rendering a blank or a raw key.

## Configuration

Every knob is settable as a \`--flag\` on the \`pi-forge-zh\` command OR as an environment
variable. **Flags win when both are set.** Run \`pi-forge-zh --help\` for the full grouped
list.

\`\`\`bash
pi-forge-zh --port 4000 --workspace-path ~/Code
pi-forge-zh --api-key @/run/secrets/api-key --no-expose-docs
\`\`\`

The most common knobs:

| Flag | Env var | Default | Purpose |
|---|---|---|---|
| \`--port\` | \`PORT\` | \`3000\` | HTTP listen port |
| \`--host\` | \`HOST\` | \`127.0.0.1\` | Bind address |
| \`--workspace-path\` | \`WORKSPACE_PATH\` | \`~/.pi-forge/workspace\` | Where project code lives |
| \`--pi-config-dir\` | \`PI_CONFIG_DIR\` | \`~/.pi/agent\` | Pi SDK config (auth, models, settings) |
| \`--forge-data-dir\` | \`FORGE_DATA_DIR\` | \`~/.pi-forge\` | pi-forge state (project list, caches) |
| \`--app-name\` | \`APP_NAME\` | \`pi-forge\` | Display name shown in the UI |
| \`--ui-password\` | \`UI_PASSWORD\` | (unset) | Enables browser login if set |
| \`--api-key\` | \`API_KEY\` | (unset) | Enables \`Authorization: Bearer\` for programmatic use |

\`--ui-password\`, \`--api-key\`, and \`--jwt-secret\` accept \`@<path>\` to read the value from a
file (avoids shell history leakage). If both \`--ui-password\` and \`--api-key\` are unset,
auth is disabled — for production, set at minimum \`--api-key\`.

### Running alongside upstream \`pi-forge\`

The defaults are inherited from upstream, so two installs would share \`~/.pi-forge\`. To
keep them separate:

\`\`\`bash
pi-forge-zh --port 3100 --forge-data-dir ~/.pi-forge-zh
\`\`\`

## What this fork changes

Only the client is touched — \`packages/server/\`, \`tests/\` (existing files),
\`docker/\`, \`kubernetes/\` and CI are unchanged from upstream \`v1.5.4\`:

- a zero-dependency i18n runtime (\`packages/client/src/i18n/\`) with per-area locale files
- \`en\` and \`zh-CN\` bundles, English as the reference locale and the fallback
- a language picker in Settings → Appearance
- \`npm run i18n:audit\` (key parity, orphan keys, leftover English copy) and
  \`tests/test-i18n.ts\` (bundle parity, placeholder parity, fallback behaviour)

## Uninstall / revert

\`\`\`bash
npm rm -g pi-forge-zh
\`\`\`

Data written by this app lives in \`--forge-data-dir\` (default \`~/.pi-forge\`); your
projects and sessions are untouched by an uninstall.

## License

MIT — see [LICENSE](./LICENSE). \`pi-forge\` is © 2026 Devin Marks and pi-forge
contributors; the Chinese localization and the fork's changes are released under the same
license.
`;
}

main().catch((err) => {
  console.error("[build-publish-dir] failed:", err);
  process.exit(1);
});
