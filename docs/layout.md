# Folder layout

```
src/<name>/             One game mod per folder (`mod.ts` + `main.ts`)
modkit/                 Shared kit (utils, react, debug, patches, modinfo)
docs/                   Docsify site; UI canvases under docs/ui/canvas/
assets/                 Symlink to docs/assets (so README image paths work on GitHub and Docsify)
types/                  Sandkit API types (submodule: sandustry-modding-types)
scripts/build/          esbuild, patches.json, mod discovery
scripts/ui/             Preview CSS + screenshot tools for docs/ui/canvas
scripts/sandustry/      Launch / stop the game, mod output path
scripts/api/            Generate types from runtime dump + official reference
dist/<name>/            Link to OS mods folder for that src folder (symlink / Windows junction)
logs/                   Link to OS sandustry logs (symlink / Windows junction)
```

Mods folder: Linux `~/.config/sandustry/mods/<modinfo.name>`; Windows `%APPDATA%/sandustry/mods/<modinfo.name>`.
Logs: Linux `~/.config/sandustry/logs`; Windows `%APPDATA%/sandustry/logs`.

## `src/`

Each `src/<name>/` folder with a `mod.ts` is a separate game mod. Byte-sized demos: [`hello-toast`](../src/hello-toast/), [`overlay-hotkey`](../src/overlay-hotkey/), [`retro-noise`](../src/retro-noise/), [`management-button`](../src/management-button/). A mod may import `@modkit/*`, `types/*`, and files in its own folder. It must not import another `src/<name>/` tree. Shared code stays in `modkit/`.

| Path                           | Role                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `src/<name>/mod.ts`            | Manifest + patches → `modinfo.json` / `patches.json` at build                       |
| `src/<name>/main.ts`           | Mod entry. Import debug from `./debug` (not `modkit/debug`) so release can stub it. |
| `src/<name>/globals.ts`        | `MOD_ID` (from `./mod`) and `installGlobals`                                        |
| `src/<name>/ui/`               | React overlays and `tailwind.css` (`@tailwind utilities`)                           |
| `src/<name>/debug/`            | Mod debug entry: calls `modkit/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/<name>/patches/README.md` | Points at [patches.md](patches.md)                                                  |
| `src/<name>/mod/`              | Optional static files copied into the output folder                                 |
| `src/<name>/tsconfig.json`     | Isolated TypeScript project (does not see sibling mods)                             |

## `modkit/`

| Path                    | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `modkit/modinfo.ts`     | `defineModInfo` / `definePatches` plus manifest and patch types                      |
| `modkit/sandkit.ts`     | Host-injected `sandkit` export (not DevTools globals)                                |
| `modkit/patches.ts`     | Shared debug patches (`modkitDebugPatches`)                                          |
| `modkit/react.ts`       | Runtime React from `sandkit.react` (`jsxImportSource`)                               |
| `modkit/jsx-runtime.ts` | JSX automatic runtime                                                                |
| `modkit/utils/`         | `safe`, `isEnabled`, `debugEnabled`, `inGame`, `registerRetroGame`                   |
| `modkit/debug/`         | DevTools globals, F12, splash skip, main-menu boot, hot reload                       |
| `modkit/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |
| `modkit/ui/`            | Shared React UI components only (no preview HTML / PNGs)                             |

Do not import `onDispose` or `isHotReloadEval` from `modkit/debug` in `src/<name>/main.ts`. Import them from `./debug`.

## `types/`

Git submodule: [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). Definitions live under `types/src/` (`main`, `shared`, `worker`, `common-types`).

| Path                        | Role                                            |
| --------------------------- | ----------------------------------------------- |
| `types/src/main/`           | Main-thread Sandkit API                         |
| `types/src/shared/`         | Shared main/worker API                          |
| `types/src/worker/`         | Worker-thread API                               |
| `types/src/common-types/`   | Shared domain shapes                            |
| `modkit/types/api.d.ts`     | Composed main-thread `SandkitApi` (`types/api`) |
| `modkit/types/sandkit.d.ts` | `sandkit` global shape (`types/sandkit`)        |
| `modkit/types/engine.d.ts`  | Retro Console engine shapes (`types/engine`)    |

Path aliases: `@modkit/*` → `./modkit/*`; `types/api` / `types/sandkit` / `types/engine` → `./modkit/types/…`; `types/*` → `./types/*`.

## Build scripts

| Path                                    | Role                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle each `src/<name>/main.ts` → `main.js`, compile used Tailwind utilities |
| `scripts/build/mods.js`                 | Discover `src/*/mod.ts`, `--mod` filter, isolation plugin                     |
| `scripts/build/typecheck.js`            | Root kit + per-mod `tsc --noEmit`                                             |
| `scripts/build/compile-tailwind.js`     | Shared Tailwind compile (mod bundle + UI previews)                            |
| `scripts/ui/compile-preview-css.mjs`    | `npm run ui:css` — Tailwind for `docs/ui/canvas`                              |
| `scripts/ui/generate-previews.mjs`      | `npm run ui:previews` — screenshot canvases into PNGs                         |
| `scripts/build/build-patches.js`        | Load that mod's `mod.ts` patch exports and write `patches.json`               |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                                         |
| `scripts/sandustry/paths.js`            | OS user-data + Steam binary paths                                             |
| `scripts/sandustry/mod-path.js`         | Game mod dir from `modinfo.name`; `dist/<folder>` links                       |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                                             |
| `scripts/api/generate-api-types.js`     | `npm run generate-types`                                                      |

## Output

`dist/<src-folder>/` links to that mod's game folder during development (symlink on Linux, directory junction on Windows). Release builds write the same files there. The game folder name is `modinfo.name`.
