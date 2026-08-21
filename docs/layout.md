# Folder layout

```
mod.ts                  Typed manifest + patches → modinfo.json / patches.json at build
src/                    This mod (entry, UI, mod debug)
modkit/              Shared kit (utils, react, debug, patches, modinfo)
docs/                   Docsify site; UI canvases under docs/ui/canvas/
assets/                 Symlink to docs/assets (so README image paths work on GitHub and Docsify)
types/                  Sandkit API types (submodule: sandustry-modding-types)
scripts/build/          esbuild, patches.json
scripts/ui/             Preview CSS + screenshot tools for docs/ui/canvas
scripts/sandustry/      Launch / stop the game, mod output path
scripts/api/            Generate types from runtime dump + official reference
dist/                   Link to OS mods folder (symlink / Windows junction)
logs/                   Link to OS sandustry logs (symlink / Windows junction)
```

Mods folder: Linux `~/.config/sandustry/mods/<modinfo.name>`; Windows `%APPDATA%/sandustry/mods/<modinfo.name>`.
Logs: Linux `~/.config/sandustry/logs`; Windows `%APPDATA%/sandustry/logs`.

## `src/`

| Path                    | Role                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `src/main.ts`           | Mod entry. Import debug from `./debug` (not `modkit/debug`) so release can stub it. |
| `src/globals.ts`        | `MOD_ID` (from `mod.ts`) and `installGlobals`                                       |
| `src/ui/`               | React overlays and `tailwind.css` (`@tailwind utilities`)                           |
| `src/debug/`            | Mod debug entry: calls `modkit/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/patches/README.md` | Points at [patches.md](patches.md)                                                  |

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

Do not import `onDispose` or `isHotReloadEval` from `modkit/debug` in `src/main.ts`. Import them from `./debug`.

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

| Path                                    | Role                                                              |
| --------------------------------------- | ----------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle `src/main.ts` → `main.js`, compile used Tailwind utilities |
| `scripts/build/compile-tailwind.js`     | Shared Tailwind compile (mod bundle + UI previews)                |
| `scripts/ui/compile-preview-css.mjs`    | `npm run ui:css` — Tailwind for `docs/ui/canvas`                  |
| `scripts/ui/generate-previews.mjs`      | `npm run ui:previews` — screenshot canvases into PNGs             |
| `scripts/build/build-patches.js`        | Load `mod.ts` patch exports and write `patches.json`              |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                             |
| `scripts/sandustry/paths.js`            | OS user-data + Steam binary paths                             |
| `scripts/sandustry/mod-path.js`         | `MOD_DIR` from `sandustryModsDir()` + `modinfo.name`          |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                             |
| `scripts/api/generate-api-types.js`     | `npm run generate-types`                                      |

## Output

`dist/` links to the game mods folder during development (symlink on Linux, directory junction on Windows). Release builds write the same files there.
