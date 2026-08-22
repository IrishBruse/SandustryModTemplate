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
dist/<name>/            Link to OS mods folder for that src folder (symlink / Windows junction)
logs/                   Link to OS sandustry logs (symlink / Windows junction)
```

Mods folder: Linux `~/.config/sandustry/mods/<modinfo.name>`; Windows `%APPDATA%/sandustry/mods/<modinfo.name>`.
Logs: Linux `~/.config/sandustry/logs`; Windows `%APPDATA%/sandustry/logs`.

## `src/`

Each `src/<name>/` folder with a `mod.ts` is a separate game mod. Byte-sized demos: [`hello-toast-example`](../src/hello-toast-example/), [`overlay-hotkey-example`](../src/overlay-hotkey-example/), [`retro-game-example`](../src/retro-game-example/), [`management-button-example`](../src/management-button-example/), [`worker-api-example`](../src/worker-api-example/). Real mod: [`selection-capture`](../src/selection-capture/) (**C** marquee, **F8** PNG, **F7** GIF). A mod may import `@modkit/*`, `types/*`, and files in its own folder. It must not import another `src/<name>/` tree. Shared code stays in `modkit/`.

| Path                           | Role                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `src/<name>/mod.ts`            | Manifest + patches → `modinfo.json` / `patches.json` at build                       |
| `src/<name>/main.ts`           | Mod entry. Import debug from `./debug` (not `modkit/debug`) so release can stub it. |
| `src/<name>/worker.ts`         | Optional worker entry → `worker.js` when present (`workerEntry` in modinfo)         |
| `src/<name>/globals.ts`        | `MOD_ID` (from `./mod`) and `installGlobals`                                        |
| `src/<name>/ui/`               | React overlays and `tailwind.css` (`@tailwind utilities`)                           |
| `src/<name>/debug/`            | Mod debug entry: calls `modkit/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/<name>/patches/README.md` | Points at [patches.md](patches.md)                                                  |
| `src/<name>/README.md`         | Optional. Copied into the installed mod folder with `CHANGELOG.md`                  |
| `src/<name>/CHANGELOG.md`      | Optional. Player-facing changelog for that mod                                      |
| `src/<name>/mod/`              | Optional static files copied into the output folder                                 |
| `src/<name>/tsconfig.json`     | Isolated TypeScript project (does not see sibling mods)                             |

## `modkit/`

| Path                    | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `modkit/modinfo.ts`     | `defineModInfo` / `definePatches` plus manifest and patch types                      |
| `modkit/patches.ts`     | Shared debug patches (`modkitDebugPatches`)                                          |
| `modkit/react.ts`       | Runtime React from `sandkit.react` (`jsxImportSource`)                               |
| `modkit/jsx-runtime.ts` | JSX automatic runtime                                                                |
| `modkit/utils/`         | `safe`, `isEnabled`, `debugEnabled`, `inGame`, `registerRetroGame`                   |
| `modkit/debug/`         | DevTools globals, F12, splash skip, main-menu boot, hot reload                       |
| `modkit/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |
| `modkit/ui/`            | Shared React UI components only (no preview HTML / PNGs)                             |

Do not import `onDispose` or `isHotReloadEval` from `modkit/debug` in `src/<name>/main.ts`. Import them from `./debug`.

## `types/`

Git submodule: [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). Definitions live under `types/src/` and nest live `sandkit.*` bags under `types/src/sandkit/` (`api`, `engine`, `enums`, …).

| Path                                     | Role                                             |
| ---------------------------------------- | ------------------------------------------------ |
| `types/src/sandkit/api/`                 | Main-thread `sandkit.api`                        |
| `types/src/worker/`                      | Worker-thread `sandkit.api`                      |
| `types/src/sandkit/engine/`              | `sandkit.engine` (+ Retro Console)               |
| `types/src/sandkit/enums/`               | `sandkit.enums`                                  |
| `types/src/shared/`                      | Shared main/worker API pieces                    |
| `types/src/common-types/`                | Shared domain shapes                             |
| `types/src/sandkit/api/sandkit-api.d.ts` | Composed `SandkitApi` (`types/api`)              |
| `types/src/worker/sandkit-api.d.ts`      | Composed `WorkerSandkitApi` (`types/worker-api`) |
| `types/src/sandkit/index.d.ts`           | `Sandkit` shape (`types/sandkit`)                |
| `types/src/global.d.ts`                  | Ambient `sandkit` value + type names (no import) |

Path aliases: `@modkit/*` → `./modkit/*`; `types/api` → `./types/src/sandkit/api/sandkit-api`; `types/worker-api` → `./types/src/worker/sandkit-api`; `types/sandkit` → `./types/src/sandkit`; `types/engine` → `./types/src/sandkit/engine`; `types/enums` → `./types/src/sandkit/enums`; `types/*` → `./types/*`.

Use the free name `sandkit` in mod and modkit code. Do not import a `sandkit` value.

## Build scripts

| Path                                    | Role                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle each `src/<name>/main.ts` → `main.js` (and `worker.ts` → `worker.js`), compile used Tailwind utilities |
| `scripts/build/mods.js`                 | Discover `src/*/mod.ts`, `--mod` filter, isolation plugin                                                     |
| `scripts/build/typecheck.js`            | Root kit + per-mod `tsc --noEmit`                                                                             |
| `scripts/build/compile-tailwind.js`     | Shared Tailwind compile (mod bundle + UI previews)                                                            |
| `scripts/ui/compile-preview-css.mjs`    | `npm run ui:css` — Tailwind for `docs/ui/canvas`                                                              |
| `scripts/ui/generate-previews.mjs`      | `npm run ui:previews` — screenshot canvases into PNGs                                                         |
| `scripts/build/build-patches.js`        | Load that mod's `mod.ts` patch exports and write `patches.json`                                               |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                                                                         |
| `scripts/sandustry/paths.js`            | OS user-data + Steam binary paths                                                                             |
| `scripts/sandustry/mod-path.js`         | Game mod dir from `modinfo.name`; `dist/<folder>` links                                                       |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                                                                             |

## Output

`dist/<src-folder>/` links to that mod's game folder during development (symlink on Linux, directory junction on Windows). Release builds write the same files there. The game folder name is `modinfo.name`.
