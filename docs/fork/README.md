# Fork maintenance docs

These documents describe how **this fork** is built, verified, deployed, rolled
back and released. They are not upstream pi-forge documentation (upstream is
archived) — for the product itself see the root [`README.md`](../../README.md)
and the i18n contract in
[`packages/client/src/i18n/README.md`](../../packages/client/src/i18n/README.md).

| Doc | Read it when |
|---|---|
| [`PUBLISH.md`](./PUBLISH.md) | building a tarball, publishing to npm, bumping the pi SDK |
| [`VERIFY.md`](./VERIFY.md) | you want the four verification layers (static → build → browser) |
| [`UPGRADE.md`](./UPGRADE.md) | rebasing onto a new upstream tag (mostly historical: upstream is archived) |
| [`ROLLBACK.md`](./ROLLBACK.md) | the deployed service misbehaves and you want it back on upstream |

## Two things these docs assume

**1. The commands referenced as `scripts/*.sh` are the fork author's local
deployment scripts.** They deliberately hard-code absolute paths for one machine
and are therefore *not* shipped in this repository. The parts that matter to a
contributor are all in-repo:

```bash
npm ci
npm run check                       # tsc + eslint + prettier
npm run build
npm run i18n:audit -- --strict      # key parity, orphan keys, leftover English
npx tsx tests/test-i18n.ts          # bundle/placeholder parity + fallback
npm run test:ci                     # upstream's integration suite
```

`scripts/build.sh`, `validate.sh`, `preview.sh`, `install-zh.sh` and
`rollback.sh` (referenced from the docs) are thin wrappers around exactly the
commands above plus "install the tarball into a scratch prefix and start it on a
spare port". Recreate them, or simply run the commands by hand.

**2. Absolute paths like `/Users/qi/Documents/Codex/pi-forge-zh/` in those docs
are from the author's setup.** Replace them with your own working directory.

## What this fork actually changes

- `packages/client/src/i18n/**` — the i18n runtime, the `en` and `zh-CN`
  bundles, and the contract in its README
- 42 client files — every user-visible string routed through `t()` / `t.plural()`
- `components/LanguagePicker.tsx` + the Settings → Appearance language section
- `scripts/i18n-audit.mts` + `tests/test-i18n.ts` — the regression net
- a handful of server files, **display strings only**: the CLI name, the startup
  log line, the OpenAPI title, the OTEL `service.name` default

Anything else — server behaviour, routes, SSE events, the data format, all
`FORGE_*` / `PI_CONFIG_DIR` env vars, every CLI flag, the JWT audience and the
`pi-forge/*` browser storage keys — is untouched from upstream `v1.5.4`.
