# Agent notes

This repo is a **Sandustry** mod template. `src/` is the mod. `modkit/` is the shared kit. The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope. Do not emit `import` / `export` in the bundle (esbuild IIFE).

Prefer Sandkit API. Use patches only when the public API cannot do the job. Keep behaviour next to its caller. For a left management-column row (under Upgrades), use `registerManagementMenuButton` from `@modkit/ui` — not a one-off DOM spacer. Docs: [`docs/ui/management-menu-button.md`](docs/ui/management-menu-button.md).

Detail docs:

- Debug: [`docs/modkit/debug.md`](docs/modkit/debug.md)
- Patches: [`docs/patches.md`](docs/patches.md)
- Modkit: [`docs/modkit/README.md`](docs/modkit/README.md)
- Layout: [`docs/layout.md`](docs/layout.md)
- API types: [`types/README.md`](types/README.md)
- Modkit todos: [`todos/README.md`](todos/README.md)

## Layout

```
mod.ts                  Typed manifest + patches → modinfo.json / patches.json at build
src/                    This mod (entry, UI, mod debug)
modkit/                 Shared kit (utils, react, debug, patches, modinfo)
types/                  Sandkit API types (submodule: sandustry-modding-types)
scripts/build/          esbuild, patches.json
scripts/sandustry/      Launch / stop the game, mod output path
scripts/api/            Generate types from runtime dump + official reference
dist/                   Link to OS mods folder (symlink / Windows junction)
logs/                   Link to OS sandustry logs (symlink / Windows junction)
```

Mods: Linux `~/.config/sandustry/mods/<modinfo.name>`; Windows `%APPDATA%/sandustry/mods/<modinfo.name>`.
Logs: Linux `~/.config/sandustry/logs`; Windows `%APPDATA%/sandustry/logs`.

### `src/`

| Path                    | Role                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `src/main.ts`           | Mod entry. Import debug from `./debug` (not `modkit/debug`) so release can stub it. |
| `src/globals.ts`        | `MOD_ID` (from `mod.ts`) and `installGlobals`                                       |
| `src/ui/`               | React overlays (import `react`, resolved to `modkit/react.ts`)                      |
| `src/debug/`            | Mod debug entry: calls `modkit/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/patches/README.md` | Points at [`docs/patches.md`](docs/patches.md)                                      |

### `modkit/`

| Path                    | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `modkit/modinfo.ts`     | `defineModInfo` / `definePatches` plus manifest and patch types                      |
| `modkit/sandkit.ts`     | Host-injected `sandkit` export (not DevTools globals)                                |
| `modkit/patches.ts`     | Shared debug patches (`modkitDebugPatches`)                                          |
| `modkit/react.ts`       | Runtime React from `sandkit.react` (`jsxImportSource`)                               |
| `modkit/jsx-runtime.ts` | JSX automatic runtime                                                                |
| `modkit/utils/`         | `safe`, `isEnabled`, `debugEnabled`, `inGame`, `registerRetroGame`                   |
| `modkit/debug/`         | DevTools globals, F12, splash skip, main-menu boot, hot reload                       |
| `modkit/console.ts`     | esbuild inject (debug): mirror `console.*` to watch-server file log                  |
| `modkit/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |
| `modkit/types/`         | Composed `types/api`, `types/sandkit`, `types/engine` import shims                   |

Do not import `onDispose` or `isHotReloadEval` from `modkit/debug` in `src/main.ts`. Import them from `./debug`.

### `types/`

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

### `scripts/`

| Path                                    | Role                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle `src/main.ts` → `main.js`, write `modinfo.json` + `patches.json` |
| `scripts/build/build-patches.js`        | Load `mod.ts` patch exports and write `patches.json`                    |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                                   |
| `scripts/sandustry/paths.js`            | OS user-data + Steam binary paths                               |
| `scripts/sandustry/mod-path.js`         | `MOD_DIR` from `sandustryModsDir()` + `modinfo.name`            |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                               |
| `scripts/api/generate-api-types.js`     | `npm run generate-types`                                        |

## Builds

| Command                                    | Debug helpers                  | `debugPatches` | Output                                                         |
| ------------------------------------------ | ------------------------------ | -------------- | -------------------------------------------------------------- |
| `npm run build`                            | Stub (`modkit/debug/empty.ts`) | Omitted        | `dist/` (symlink / Windows junction)                           |
| `npm run dev`                              | Included                       | Included       | OS mods folder (`~/.config/...` or `%APPDATA%/sandustry/mods`) |
| `npm run sandustry` / `--game` / `--debug` | Included                       | Included       | Game mods folder                                               |

`--no-debug` forces a release-style bundle. Debug builds emit inline source maps; `--sourcemap` / `--no-sourcemap` override.

In-game **Debug** (`api.settings.get("debug")`) is merged into debug `modinfo.json` by the build and omitted from release. Missing setting defaults to on.

## Patches

Define patches in root `mod.ts` with `definePatches`. Production list is `patches`. Optional mod-only debug list is `debugPatches`. The build also merges `modkitDebugPatches` in debug builds.

```ts
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
```

Full format: [`docs/patches.md`](docs/patches.md).

## Commands

```bash
npm run dev              # watch, debug on
npm run build            # release
npm run typecheck
npm run generate-types   # after a new runtime dump
npm run sandustry        # build debug + launch
```

## Game logs

The renderer does not write `console.log` into `logs/main.log` (that file is the Electron main process).

In **debug** builds, esbuild injects [`modkit/console.ts`](modkit/console.ts) so bare `console.log` / `info` / `warn` / `error` / `debug` also append to `logs/<modinfo.id>.log` (link: `logs/` → OS sandustry logs) when `npm run dev` is running.

```ts
console.log("[my-tag]", { width, collapsed });
// DevTools + logs/author.example-mod.log
```

Release builds do not inject the shim. Restart `npm run dev` after changing `scripts/build/hot-reload-server.js` (the POST `/log` route lives there).
