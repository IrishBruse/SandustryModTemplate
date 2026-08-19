# Patch definitions

Plain JavaScript patch definitions for Sandustry's game bundles.

**One patch per file.** The patch `id` is the filename without `.js` — for example `skip-startup-splash.js` becomes `"skip-startup-splash"`. Do not set `id` in the patch object.

At build time, the build scans this folder (and `src/debug/patches/` in dev) and writes `patches.json` to the mod output. The game loader applies those patches to Sandustry JavaScript files (for example `js/bundle.js`).

Typed builders live in [`patch-helpers/`](../../patch-helpers/) — import from there in patch files.

## When to use patches

Prefer the Sandkit API first. Use patches only when the public API cannot do the job.

Patches are string rewrites on minified game code. Keep each patch small, set `expectedMatches`, and test after every game update — bundle text can change and break `find` strings.

Patch `code` runs outside the game bundle IIFE. Put shared runtime helpers on `globalThis` if patch code needs them.

## Layout

| Location | Role |
|---|---|
| `src/patches/*.js` | Production patches — one file per patch |
| `src/debug/patches/*.js` | Dev-only patches, included when `MOD_DEBUG=1` |
| `patch-helpers/helpers.ts` | `insertBefore`, `replace`, `wrap` builders |
| `patch-helpers/finalize.ts` | Assigns `id` from filename at build time |
| `patch-helpers/types.ts` | Patch shapes and JSDoc |

Release builds (`npm run build`) omit `src/debug/patches/`. Dev builds (`npm run dev`, VS Code debug tasks) include them.

## Operations

| Operation | Effect |
|---|---|
| `insertBefore` | Insert `code` before each match |
| `replace` | Replace each match with `code` |
| `wrap` | Wrap each match with `before` + match + `after` |

Match by exact `find` string when you can. Use `regex` only when the bundle text is not stable enough for a literal match.

Always set `expectedMatches`. The mod loader fails if the match count differs — this catches broken patches early.

Optional `atomicGroup` ties patches together: all patches in a group must succeed, or none apply.

## Adding a patch

Create a new `.js` file named after the patch id. Export the patch as the default export:

```js
// src/patches/bundle-log-prefix.js
import { insertBefore } from "../../patch-helpers/helpers.ts";

export default insertBefore({
  file: "js/bundle.js",
  find: "initializing workers",
  code: "[patched] ",
  expectedMatches: 1,
});
```

For dev-only work, put the file under `src/debug/patches/` instead — same format.

Real example in this mod — `src/debug/patches/skip-startup-splash.js`:

```js
import { replace } from "../../../patch-helpers/helpers.ts";

export default replace({
  file: "js/bundle.js",
  find: 'document.addEventListener("keydown",p),document.addEventListener("click",h);',
  code: "...injected splash-skip logic...",
  expectedMatches: 1,
});
```

## Build output

Do not edit `dist/patches.json` by hand. Add or change patch files and rebuild:

```bash
npm run build          # release — no debug patches
npm run dev            # dev — includes debug patches
```
