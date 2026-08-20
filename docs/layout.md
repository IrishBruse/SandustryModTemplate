# Folder layout

```
mod.ts                  Typed manifest + patches → modinfo.json / patches.json at build
src/                    This mod (entry, UI, mod debug)
framework/              Shared kit (sdk, react, debug, patches, modinfo)
types/                  Sandkit API types (submodule: sandustry-modding-types)
scripts/build/          esbuild, patches.json
scripts/sandustry/      Launch / stop the game, mod output path
scripts/api/            Generate types from runtime dump + official reference
dist/                   Symlink to ~/.config/sandustry/mods/Example Mod (dev output)
```

## `src/`

| Path                    | Role                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `src/main.ts`           | Mod entry. Import debug from `./debug` (not `framework/debug`) so release can stub it. |
| `src/globals.ts`        | `MOD_ID` (from `mod.ts`) and `installGlobals`                                          |
| `src/ui/`               | React overlays (import `react`, resolved to `framework/react.ts`)                      |
| `src/debug/`            | Mod debug entry: calls `framework/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/patches/README.md` | Points at [patches.md](patches.md)                                                     |

## `framework/`

| Path                       | Role                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `framework/modinfo.ts`     | `defineModInfo` / `definePatches` plus manifest and patch types                      |
| `framework/sandkit.ts`     | Host-injected `sandkit` export (not DevTools globals)                                |
| `framework/patches.ts`     | Shared debug patches (`frameworkDebugPatches`)                                       |
| `framework/react.ts`       | Runtime React from `sandkit.react` (`jsxImportSource`)                               |
| `framework/jsx-runtime.ts` | JSX automatic runtime                                                                |
| `framework/sdk/`           | `safe`, `isEnabled`, `debugEnabled`, `inGame`, `registerRetroGame`                   |
| `framework/debug/`         | DevTools globals, F12, splash skip, main-menu boot, hot reload                       |
| `framework/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |
| `framework/ui/`            | Shared React UI components                                                           |

Do not import `onDispose` or `isHotReloadEval` from `framework/debug` in `src/main.ts`. Import them from `./debug`.

## `types/`

Git submodule: [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). Definitions live under `types/src/` (`main`, `shared`, `worker`, `common-types`).

| Path                      | Role                                              |
| ------------------------- | ------------------------------------------------- |
| `types/src/main/`         | Main-thread Sandkit API                           |
| `types/src/shared/`       | Shared main/worker API                            |
| `types/src/worker/`       | Worker-thread API                                 |
| `types/src/common-types/` | Shared domain shapes                              |
| `types/api.d.ts`          | Composed main-thread `SandkitApi`                 |
| `types/sandkit.d.ts`      | `sandkit` global shape                            |
| `types/engine.d.ts`       | Retro Console engine shapes                       |

Path aliases: `@framework/*` → `./framework/*`; `types/*` → `./types/*`.

## Build scripts

| Path                                    | Role                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle `src/main.ts` → `main.js`, write `modinfo.json` + `patches.json` |
| `scripts/build/build-patches.js`        | Load `mod.ts` patch exports and write `patches.json`                    |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                                   |
| `scripts/sandustry/mod-path.js`         | `MOD_DIR` = `~/.config/sandustry/mods/Example Mod`                      |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                                       |
| `scripts/api/generate-api-types.js`     | `npm run generate-types`                                          |

## Output

`dist/` is a symlink to the game mods folder during development. Release builds write the same files there.
