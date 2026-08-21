# Agent notes

This repo is a **Sandustry** mod template. `src/` is the mod. `modkit/` is the shared kit. The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope. Do not emit `import` / `export` in the bundle (esbuild IIFE).

Prefer Sandkit API. Use patches only when the public API cannot do the job. Keep behaviour next to its caller.

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
dist/                   Symlink to ~/.config/sandustry/mods/<modinfo.name> (dev output)
logs/                   Symlink to ~/.config/sandustry/logs (game + mod debug logs)
```

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
| `scripts/sandustry/mod-path.js`         | `MOD_DIR` = `~/.config/sandustry/mods/<modinfo.name>`                   |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                                       |
| `scripts/api/generate-api-types.js`     | `npm run generate-types`                                                |

## Builds

| Command                                    | Debug helpers                  | `debugPatches` | Output                                    |
| ------------------------------------------ | ------------------------------ | -------------- | ----------------------------------------- |
| `npm run build`                            | Stub (`modkit/debug/empty.ts`) | Omitted        | `dist/` (symlink)                         |
| `npm run dev`                              | Included                       | Included       | `~/.config/sandustry/mods/<modinfo.name>` |
| `npm run sandustry` / `--game` / `--debug` | Included                       | Included       | Game mods folder                          |

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

The renderer does not write `console.log` into `logs/main.log` (that file is the Electron main process). To debug in-game UI from this workspace:

1. Run `npm run dev` (watch SSE on `127.0.0.1:19147`).
2. From the mod, `POST` JSON `{ "modId": "<modinfo.id>", "line": "…" }` to `http://127.0.0.1:19147/mgmt-log`.
3. Read `logs/<mod-id>.log` (same as `~/.config/sandustry/logs/<mod-id>.log`). Unsafe characters in `modId` become `_`.

Example (also `console.log` so DevTools still shows it):

```ts
void fetch("http://127.0.0.1:19147/mgmt-log", {
  method: "POST",
  mode: "cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ modId: MOD_ID, line: `[my-tag] ${JSON.stringify(payload)}` }),
}).catch(() => {});
```

Restart `npm run dev` after changing `scripts/build/hot-reload-server.js`. Route changes are not hot-reloaded into the game.
