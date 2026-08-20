# Patch definitions

Define patches in root [`mod.ts`](../mod.ts) with `definePatches`. The build writes `patches.json`. The game loader applies those patches to Sandustry JavaScript files (for example `js/bundle.js`).

Patch shapes live in [`framework/modinfo.ts`](../framework/modinfo.ts).

## When to use patches

Prefer the Sandkit API first. Use patches only when the public API cannot do the job.

Patches are string rewrites on minified game code. Keep each patch small, set `expectedMatches`, and test after every game update — bundle text can change and break `find` strings.

Patch `code` runs outside the game bundle IIFE. Put shared runtime helpers on `globalThis` if patch code needs them.

## Layout

| Export                                            | Role                                                           |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `patches` in `mod.ts`                             | Production patches (always written)                            |
| `debugPatches` in `mod.ts`                        | Debug-only patches (dev / `--debug` builds)                    |
| `frameworkDebugPatches` in `framework/patches.ts` | Shared debug patches (splash skip); spread into `debugPatches` |

Release builds (`npm run build`) omit `debugPatches`. Dev builds (`npm run dev`, VS Code debug tasks, `npm run sandustry`) include them.

## Fields

| Field              | Role                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `id`               | Unique patch id (required)                                          |
| `file`             | Target file under `js/` (required)                                  |
| `find`             | Exact match string (required unless `regex`)                        |
| `expectedMatches`  | Match count; load fails if it differs (required)                    |
| `operation`        | `replace`, `insertBefore`, or `wrap`                                |
| `code`             | Replacement / insert body (`replace` and `insertBefore`)            |
| `regex`            | `{ pattern, flags? }` instead of `find`                             |
| `atomicGroup`      | Optional group name; all patches in the group succeed or none apply |
| `before` / `after` | Required when `operation` is `wrap`                                 |

## Operations

| Operation      | Effect                                          |
| -------------- | ----------------------------------------------- |
| `replace`      | Replace each match with `code`                  |
| `insertBefore` | Insert `code` before each match                 |
| `wrap`         | Wrap each match with `before` + match + `after` |

Match by exact `find` when you can. Use `regex` only when the bundle text is not stable enough for a literal match.

Always set `expectedMatches`. The mod loader fails if the match count differs — this catches broken patches early.

## Adding a patch

```ts
// mod.ts
import { definePatches } from "@framework/modinfo";
import { frameworkDebugPatches } from "@framework/patches";

export const patches = definePatches([
  {
    id: "bundle-log-prefix",
    file: "js/bundle.js",
    find: "initializing workers",
    operation: "insertBefore",
    code: "[patched]",
    expectedMatches: 1,
  },
]);

export const debugPatches = definePatches([...frameworkDebugPatches]);
```

Shared debug example: [`framework/patches.ts`](../framework/patches.ts) (`skip-startup-splash`). The browser bundle stubs that module so patch payloads stay out of `main.js`.

## Build output

Do not edit `dist/patches.json` by hand. Change `mod.ts` and rebuild:

```bash
npm run build          # release — no debugPatches
npm run dev            # debug — includes debugPatches
```
