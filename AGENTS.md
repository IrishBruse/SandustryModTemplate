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
- API types: [`modkit/types/readme.md`](modkit/types/readme.md)
- Modkit todos: [`docs/todos/README.md`](docs/todos/README.md)

## Layout

```
src/<name>/             One game mod per folder (`mod.ts` + `main.ts`)
modkit/                 Shared kit (utils, react, debug, patches, modinfo)
modkit/types/           Sandkit API types (submodule: sandustry-modding-types)
sandustry/              Extracted game source from app.asar (`npm run setup`; gitignored)
scripts/                npm command folders + `lib/` (see Scripts below)
dist/<name>/            Link to OS mods folder for that src folder (symlink / Windows junction)
build/<name>/           Release staging for Workshop publish (`npm run build:release`; gitignored)
logs/                   Link to OS sandustry logs (symlink / Windows junction)
```

Mods: Linux `~/.config/sandustry/mods/<modinfo.name>`; Windows `%APPDATA%/sandustry/mods/<modinfo.name>`.
Logs: Linux `~/.config/sandustry/logs`; Windows `%APPDATA%/sandustry/logs`.

### `src/`

Each `src/<name>/` folder with a `mod.ts` is a separate game mod. Byte-sized demos: `hello-world-example`, `overlay-hotkey-example`, `retro-game-example`, `management-button-example`, `worker-api-example`. Real mod: `selection-capture` (**Pixel-perfect Screenshot and GIF recorder** — **C** marquee, **F7** PNG / GIF). Debug companion: `debug` (debug builds only). Mods cannot import from each other.

| Path                       | Role                                                                                                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/<name>/mod.ts`        | Manifest (+ optional `patches` / `debugPatches`) → `modinfo.json` / `patches.json` at build. `export const modinfo = defineModInfo(...)`. Use `modinfo.id` for the mod id.                               |
| `src/<name>/main.ts`       | Mod entry. Build gates on **`enabled`** and boots hot reload (`reloaded` ambient). Import `onDispose` from `@modkit/debug` when needed.                                                                  |
| `src/<name>/worker.ts`     | Optional worker entry → `worker.js` when present (`workerEntry` in modinfo)                                                                                                                              |
| `src/<name>/ui/`           | React overlays (import `react`, resolved to `modkit/esbuild/react.ts`)                                                                                                                                   |
| `src/<name>/README.md`     | Optional. Repo docs only (not copied into builds). Example mods: lists only — no tables ([`docs/AGENTS.md`](docs/AGENTS.md)).                                                                            |
| `src/<name>/CHANGELOG.md`  | Optional. Repo docs; publish reads the version `##` section for Steam change notes (file stays in the repo).                                                                                             |
| `src/<name>/workshop/`     | Optional. `workshop.json`, `preview.gif` (preferred), `preview.png`, `workshop.txt`, `screenshots/`. Build copies `workshop.json` and previews to the mod root. Screenshots stay under `workshop/` only. |
| `src/<name>/mod/`          | Optional static files copied into the output folder                                                                                                                                                      |
| `src/<name>/tsconfig.json` | Isolated TypeScript project (does not see sibling mods)                                                                                                                                                  |
| `src/<name>/package.json`  | Optional npm deps for that mod only (`node_modules` in the mod folder)                                                                                                                                   |

### `modkit/`

| Path                | Role                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `modkit/modinfo.ts` | `defineModInfo` / `definePatches` plus manifest and patch types                                                      |
| `modkit/patches.ts` | Empty shared patch list (browser stub via `esbuild/patches.empty.ts`)                                                |
| `modkit/esbuild/`   | esbuild wiring: React/JSX aliases, console inject, patches stub, release debug stub                                  |
| `modkit/utils/`     | `safe`, `isEnabled`, `inGame`, `registerRetroGame`                                                                   |
| `modkit/debug/`     | Hot reload helpers (`onDispose`; inject calls `installHotReload` / `isHotReloadEval`)                                |
| `modkit/log.ts`     | File-log helper used with the hot-reload watch server                                                                |
| `modkit/types/`     | Sandkit API types submodule ([sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)) |

Hot reload boots via esbuild inject on **debug** builds only. Use free `reloaded`. Import `onDispose` from `@modkit/debug` when needed. Release defines `reloaded` as `false` and stubs `@modkit/debug` to `modkit/esbuild/debug.empty.ts`.

### `modkit/types/`

Git submodule: [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). Main API lives under `modkit/types/src/main/`; worker under `modkit/types/src/worker/`; engine under `modkit/types/src/shared/engine/`. Ambient `sandkit` is [`modkit/sandkit-global.d.ts`](modkit/sandkit-global.d.ts) (composed from those namespaces).

| Path                              | Role                                                               |
| --------------------------------- | ------------------------------------------------------------------ |
| `modkit/types/src/main/`          | Main-thread `sandkit.api`                                          |
| `modkit/types/src/worker/`        | Worker-thread `sandkit.api`                                        |
| `modkit/types/src/shared/engine/` | `sandkit.engine` (+ Retro Console)                                 |
| `modkit/types/src/shared/`        | Shared main/worker API pieces                                      |
| `modkit/types/src/common-types/`  | Shared domain shapes                                               |
| `modkit/sandkit-global.d.ts`      | Ambient `sandkit` / `SandkitApi` / `WorkerSandkitApi` / `reloaded` |

Path aliases: `@modkit/*` → `./modkit/*`. Use ambient `sandkit`, `SandkitApi`, and `WorkerSandkitApi` — do not import them with a `types/` prefix. Retro Console types come from `@modkit/utils`.

Use the free name `sandkit` in mod and modkit code. Do not import `@modkit/sandkit`.

### `scripts/`

Folders match `npm run` commands. Shared helpers live in `scripts/lib/`.

| Path                                      | Role                                                                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`        | `npm run build` / `build:release` — bundle each `src/<name>/main.ts` → `main.js` (and `worker.ts` → `worker.js`), write `modinfo.json` + `patches.json` |
| `scripts/dev/dev.js`                      | `npm run dev` — watch + write to the game mods folder                                                                                                   |
| `scripts/dev/hot-reload-server.js`        | Hot-reload HTTP server (`/hot-reload`, `/log`)                                                                                                          |
| `scripts/typecheck/typecheck.js`          | `npm run typecheck` — root kit + per-mod `tsc --noEmit`                                                                                                 |
| `scripts/test/test.js`                    | `npm run test` — Node test runner on `src/**/*.test.ts`                                                                                                 |
| `scripts/mod-install/install-mod-deps.js` | Root `postinstall` — `npm install` in each `src/<name>/` with `package.json`                                                                            |
| `scripts/setup/setup.js`                  | `npm run setup` — check install, extract game source to `sandustry/`, link `logs/`                                                                      |
| `scripts/publish/publish-workshop.js`     | `npm run publish` — release-build + SteamCMD Workshop upload                                                                                            |
| `scripts/sandustry/launch-sandustry.js`   | `npm run sandustry` — stop and launch the game (no build)                                                                                               |
| `scripts/ui/`                             | `npm run ui:css` / `ui:previews` — docs canvas Tailwind + screenshots                                                                                   |
| `scripts/lib/`                            | Shared: mod discovery, patches, paths, mod-path, workshop files, launch helpers                                                                         |

## Builds

| Command                 | Debug helpers                                            | `debugPatches` | Output                                                       |
| ----------------------- | -------------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| `npm run build`         | Stub (`modkit/esbuild/debug.empty.ts`); omit `src/debug` | Omitted        | OS mods folder; `dist/<folder>/` links                       |
| `npm run build:release` | Stub; omit `src/debug`                                   | Omitted        | `build/<folder>/` (Workshop staging; not the OS mods folder) |
| `npm run dev`           | Included; install `src/debug`                            | Included       | OS mods folder while watching; removed when the watch stops  |
| `--game` / `--debug`    | Included; install `src/debug`                            | Included       | Game mods folder                                             |

`--no-debug` forces a release-style bundle. Debug builds emit inline source maps; `--sourcemap` / `--no-sourcemap` override. `--mod <folder>` builds one src folder. Debug builds also install `src/debug` unless `--mod debug`.

Session debug helpers (DevTools, splash skip, auto-boot, disable autosave, F3) live on the **debug** companion mod. Settings are on that mod only. See [`docs/modkit/debug.md`](docs/modkit/debug.md).

## Patches

Define patches in that mod's `mod.ts` with `definePatches`. Production list is `patches`. Optional mod-only debug list is `debugPatches`. Splash skip is a settings-gated runtime helper on `src/debug` (installed on debug builds only).

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
npm run setup            # check install, extract game source, link logs
npm run dev              # watch, debug on
npm run build            # release to OS mods folder
npm run build:release    # release staging to build/<folder>/
npm run publish          # build:release + SteamCMD upload
npm run typecheck
npm run test
npm run sandustry        # stop + launch (no build)
```

## Game logs

The renderer does not write `console.log` into `logs/main.log` (that file is the Electron main process).

In **debug** builds, esbuild injects [`modkit/esbuild/console.ts`](modkit/esbuild/console.ts) so bare `console.log` / `info` / `warn` / `error` / `debug` print with a `[modinfo.id]` prefix in DevTools and also append to `logs/<modinfo.id>.log` (link: `logs/` → OS sandustry logs) when `npm run dev` is running.

```ts
console.log("my-feature", { width, collapsed });
// DevTools + logs/author.hello-world-example.log
```

Release builds do not inject the shim. Restart `npm run dev` after changing `scripts/dev/hot-reload-server.js` (the POST `/log` and `/log/clear` routes live there). Hot reload clears `logs/<modinfo.id>.log` before re-eval.
