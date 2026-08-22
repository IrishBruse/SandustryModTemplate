# Agent notes

This repo is a **Sandustry** mod template. Each folder under `src/` that has a `mod.ts` is one game mod. `modkit/` is the shared kit. The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope. Do not emit `import` / `export` in the bundle (esbuild IIFE).

Prefer Sandkit API. Use patches only when the public API cannot do the job. Keep behaviour next to its caller. For a left management-column row (under Upgrades), use `registerManagementMenuButton` from `@modkit/ui` — not a one-off DOM spacer. Docs: [`docs/ui/management-menu-button.md`](docs/ui/management-menu-button.md).

Mods must not import files from another `src/<name>/` folder. Shared code lives in `modkit/`.

Detail docs:

- Docs writing / changelog: [`docs/AGENTS.md`](docs/AGENTS.md)
- Debug: [`docs/modkit/debug.md`](docs/modkit/debug.md)
- Patches: [`docs/patches.md`](docs/patches.md)
- Modkit: [`docs/modkit/README.md`](docs/modkit/README.md)
- Layout: [`docs/layout.md`](docs/layout.md)
- API types: [`types/README.md`](types/README.md)
- Modkit todos: [`todos/README.md`](todos/README.md)

## Layout

```
src/<name>/             One game mod per folder (`mod.ts` + `main.ts`)
modkit/                 Shared kit (utils, react, debug, patches, modinfo)
types/                  Sandkit API types (submodule: sandustry-modding-types)
scripts/build/          esbuild, patches.json, mod discovery
scripts/sandustry/      Launch / stop the game, mod output path
dist/<name>/            Link to OS mods folder for that src folder (symlink / Windows junction)
logs/                   Link to OS sandustry logs (symlink / Windows junction)
```

Mods: Linux `~/.config/sandustry/mods/<modinfo.name>`; Windows `%APPDATA%/sandustry/mods/<modinfo.name>`.
Logs: Linux `~/.config/sandustry/logs`; Windows `%APPDATA%/sandustry/logs`.

### `src/`

Each `src/<name>/` folder with a `mod.ts` is a separate game mod. Byte-sized demos: `hello-toast-example`, `overlay-hotkey-example`, `retro-game-example`, `management-button-example`, `worker-api-example`. Real mod: `selection-capture` (**C** marquee, **F7** PNG / GIF). Mods cannot import from each other.

| Path                           | Role                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `src/<name>/mod.ts`            | Manifest + patches → `modinfo.json` / `patches.json` at build                       |
| `src/<name>/main.ts`           | Mod entry. Import debug from `./debug` (not `modkit/debug`) so release can stub it. |
| `src/<name>/worker.ts`         | Optional worker entry → `worker.js` when present (`workerEntry` in modinfo)         |
| `src/<name>/globals.ts`        | `MOD_ID` (from `./mod`) and `installGlobals`                                        |
| `src/<name>/ui/`               | React overlays (import `react`, resolved to `modkit/react.ts`)                      |
| `src/<name>/debug/`            | Mod debug entry: calls `modkit/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/<name>/patches/README.md` | Points at [`docs/patches.md`](docs/patches.md)                                      |
| `src/<name>/README.md`         | Optional. Copied into the installed mod folder with `CHANGELOG.md`                  |
| `src/<name>/CHANGELOG.md`      | Optional. Player-facing changelog for that mod                                      |
| `src/<name>/mod/`              | Optional static files copied into the output folder                                 |
| `src/<name>/tsconfig.json`     | Isolated TypeScript project (does not see sibling mods)                             |

### `modkit/`

| Path                    | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `modkit/modinfo.ts`     | `defineModInfo` / `definePatches` plus manifest and patch types                      |
| `modkit/patches.ts`     | Shared debug patches (`modkitDebugPatches`)                                          |
| `modkit/react.ts`       | Runtime React from `sandkit.react` (`jsxImportSource`)                               |
| `modkit/jsx-runtime.ts` | JSX automatic runtime                                                                |
| `modkit/utils/`         | `safe`, `isEnabled`, `debugEnabled`, `inGame`, `registerRetroGame`                   |
| `modkit/debug/`         | DevTools globals, F12, splash skip, main-menu boot, hot reload                       |
| `modkit/console.ts`     | esbuild inject (debug): mirror `console.*` to watch-server file log                  |
| `modkit/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |

Do not import `onDispose` or `isHotReloadEval` from `modkit/debug` in `src/<name>/main.ts`. Import them from `./debug`.

### `types/`

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

Use the free name `sandkit` in mod and modkit code. Do not import `@modkit/sandkit`.

### `scripts/`

| Path                                    | Role                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle each `src/<name>/main.ts` → `main.js` (and `worker.ts` → `worker.js`), write `modinfo.json` + `patches.json` |
| `scripts/build/mods.js`                 | Discover `src/*/mod.ts`, `--mod` filter, isolation plugin                                                           |
| `scripts/build/typecheck.js`            | Root kit + per-mod `tsc --noEmit`                                                                                   |
| `scripts/build/build-patches.js`        | Load that mod's `mod.ts` patch exports and write `patches.json`                                                     |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                                                                               |
| `scripts/sandustry/paths.js`            | OS user-data + Steam binary paths                                                                                   |
| `scripts/sandustry/mod-path.js`         | Game mod dir from `modinfo.name`; `dist/<folder>` links                                                             |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                                                                                   |

## Builds

| Command                                    | Debug helpers                  | `debugPatches` | Output                                                      |
| ------------------------------------------ | ------------------------------ | -------------- | ----------------------------------------------------------- |
| `npm run build`                            | Stub (`modkit/debug/empty.ts`) | Omitted        | OS mods folder; `dist/<folder>/` links                      |
| `npm run dev`                              | Included                       | Included       | OS mods folder while watching; removed when the watch stops |
| `npm run sandustry` / `--game` / `--debug` | Included                       | Included       | Game mods folder                                            |

`--no-debug` forces a release-style bundle. Debug builds emit inline source maps; `--sourcemap` / `--no-sourcemap` override. `--mod <folder>` builds one src folder.

In-game **Debug** (`api.settings.get("debug")`) is merged into debug `modinfo.json` by the build and omitted from release. Missing setting defaults to on.

## Patches

Define patches in that mod's `mod.ts` with `definePatches`. Production list is `patches`. Optional mod-only debug list is `debugPatches`. Debug builds merge `modkitDebugPatches` into the **first** src folder (by name) only, so two mods do not both patch `js/bundle.js`.

```ts
// src/<name>/mod.ts
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
npm run sandustry        # build debug + launch
```

## Game logs

The renderer does not write `console.log` into `logs/main.log` (that file is the Electron main process).

In **debug** builds, esbuild injects [`modkit/console.ts`](modkit/console.ts) so bare `console.log` / `info` / `warn` / `error` / `debug` also append to `logs/<modinfo.id>.log` (link: `logs/` → OS sandustry logs) when `npm run dev` is running.

```ts
console.log("[my-tag]", { width, collapsed });
// DevTools + logs/author.hello-toast-example.log
```

Release builds do not inject the shim. Restart `npm run dev` after changing `scripts/build/hot-reload-server.js` (the POST `/log` and `/log/clear` routes live there). Hot reload clears `logs/<modinfo.id>.log` before re-eval.
