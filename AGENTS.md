# Agent notes

This repo is a **Sandustry** mod template. `src/` is the mod. `modkit/` is the shared kit. The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope. Do not emit `import` / `export` in the output (esbuild IIFE). The build also writes `modkit/index.js`; `main.js` sync-loads it into `globalThis.__modkit`.

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
modkit/                 Shared kit (sdk, react, debug, patches, modinfo)
types/                  Sandkit API types (submodule: sandustry-modding-types)
scripts/build/          esbuild, patches.json
scripts/sandustry/      Launch / stop the game, mod output path
scripts/api/            Generate types from runtime dump + official reference
dist/                   Symlink to ~/.config/sandustry/mods/Example Mod (dev output)
                        → main.js + modkit/index.js + modinfo.json + patches.json
```

### `src/`

| Path                    | Role                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `src/main.ts`           | Mod entry. Import debug from `./debug` (not `modkit/debug`) so release can stub it. |
| `src/globals.ts`        | `MOD_ID` (from `mod.ts`) and `installGlobals`                                       |
| `src/ui/`               | React overlays (import `react`, resolved via `globalThis.__modkit` at runtime)      |
| `src/debug/`            | Mod debug entry: calls `modkit/debug`, re-exports `onDispose` / `isHotReloadEval`   |
| `src/patches/README.md` | Points at [`docs/patches.md`](docs/patches.md)                                      |

### `modkit/`

| Path                    | Role                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `modkit/browser.ts`     | Browser entry → `dist/modkit/index.js` (`globalThis.__modkit`)                       |
| `modkit/modinfo.ts`     | `defineModInfo` / `definePatches` plus manifest and patch types                      |
| `modkit/sandkit.ts`     | Host-injected `sandkit` export (not DevTools globals)                                |
| `modkit/patches.ts`     | Shared debug patches (`modkitDebugPatches`)                                          |
| `modkit/react.ts`       | Runtime React from `sandkit.react` (`jsxImportSource`)                               |
| `modkit/jsx-runtime.ts` | JSX automatic runtime                                                                |
| `modkit/sdk/`           | `safe`, `isEnabled`, `debugEnabled`, `inGame`, `registerRetroGame`                   |
| `modkit/debug/`         | DevTools globals, F12, splash skip, main-menu boot, hot reload                       |
| `modkit/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |

Do not import `onDispose` or `isHotReloadEval` from `modkit/debug` in `src/main.ts`. Import them from `./debug`.

### `types/`

Git submodule: [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). Definitions live under `types/src/` (`main`, `shared`, `worker`, `common-types`).

| Path                      | Role                              |
| ------------------------- | --------------------------------- |
| `types/src/main/`         | Main-thread Sandkit API           |
| `types/src/shared/`       | Shared main/worker API            |
| `types/src/worker/`       | Worker-thread API                 |
| `types/src/common-types/` | Shared domain shapes              |
| `types/api.d.ts`          | Composed main-thread `SandkitApi` |
| `types/sandkit.d.ts`      | `sandkit` global shape            |
| `types/engine.d.ts`       | Retro Console engine shapes       |

Path aliases: `@modkit/*` → `./modkit/*`; `types/*` → `./types/*`.

### `scripts/`

| Path                                    | Role                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `scripts/build/esbuild.config.mjs`      | Bundle `main.js` + `modkit/index.js`, write `modinfo.json` + `patches.json` |
| `scripts/build/build-patches.js`        | Load `mod.ts` patch exports and write `patches.json`                        |
| `scripts/build/dev.js`                  | Watch + write to the game mods folder                                       |
| `scripts/sandustry/mod-path.js`         | `MOD_DIR` = `~/.config/sandustry/mods/Example Mod`                          |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game                                           |
| `scripts/api/generate-api-types.js`     | `npm run generate-types`                                                    |

## Builds

| Command                                    | Debug helpers                  | `debugPatches` | Output                                 |
| ------------------------------------------ | ------------------------------ | -------------- | -------------------------------------- |
| `npm run build`                            | Stub (`modkit/debug/empty.ts`) | Omitted        | `dist/` (symlink)                      |
| `npm run dev`                              | Included                       | Included       | `~/.config/sandustry/mods/Example Mod` |
| `npm run sandustry` / `--game` / `--debug` | Included                       | Included       | Game mods folder                       |

`--no-debug` forces a release-style bundle. Debug builds emit inline source maps; `--sourcemap` / `--no-sourcemap` override.

In-game **Debug** (`api.settings.get("debug")`) is omitted from release `modinfo.json`. Missing setting defaults to on.

## Patches

Define patches in root `mod.ts` with `definePatches`. Production list is `patches`; debug-only list is `debugPatches`.

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
npm run sandustry:debug  # same, with inspector ports
```
