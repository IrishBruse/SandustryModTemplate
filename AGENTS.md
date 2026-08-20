# Agent notes

This repo is a **Sandustry** mod (`author.example-mod`). `src/` is this mod. `framework/` is the shared kit. The game runs `main.js` as a script body (`new Function`); `sandkit` is already in scope. Do not emit `import` / `export` in the bundle (esbuild IIFE).

Prefer Sandkit API. Use patches only when the public API cannot do the job. Keep behaviour next to its caller.

Detail docs:

- Debug features: [`framework/debug/README.md`](framework/debug/README.md)
- Patch file format: [`src/patches/README.md`](src/patches/README.md)
- API types: [`types/README.md`](types/README.md)

## Layout

```
modinfo.ts              Typed manifest → modinfo.json at build
src/                    This mod (entry, UI, mod debug, mod patches)
framework/              Shared kit (sdk, react, debug, patches)
types/                  Sandkit + framework TypeScript definitions
scripts/build/          esbuild, patches.json
scripts/sandustry/      Launch / stop the game, mod output path
scripts/api/            Generate types from runtime dump + official reference
dist/                   Symlink to ~/.config/sandustry/mods/Example Mod (dev output)
```

### `src/`

| Path | Role |
|---|---|
| `src/main.ts` | Mod entry. Import debug from `./debug` (not `framework/debug`) so release can stub it. |
| `src/globals.ts` | `MOD_ID` and `installGlobals` |
| `src/ui/` | React overlays (import `react`, resolved to `framework/react.ts`) |
| `src/debug/` | Mod debug entry: calls `framework/debug`, re-exports `onDispose` / `isHotReloadEval` |
| `src/patches/*.js` | Production bundle patches for this mod |
| `src/patches/debug/*.js` | Debug-only patches for this mod |

### `framework/`

| Path | Role |
|---|---|
| `framework/modinfo.ts` | `defineMod` for `modinfo.ts` |
| `framework/react.ts` | Runtime React from `sandkit.react` (`jsxImportSource`) |
| `framework/jsx-runtime.ts` | JSX automatic runtime |
| `framework/sdk/` | `safe`, `isEnabled`, `debugEnabled`, `inGame` |
| `framework/debug/` | DevTools globals, F12, splash skip, main-menu boot, hot reload |
| `framework/debug/empty.ts` | Release stub for `./debug` (`installDebug` / `onDispose` / `isHotReloadEval` no-ops) |
| `framework/patches/*.js` | Shared production patches |
| `framework/patches/debug/*.js` | Shared debug patches (splash skip) |

Do not import `onDispose` or `isHotReloadEval` from `framework/debug` in `src/main.ts`. Import them from `./debug`.

### `types/`

| Path | Role |
|---|---|
| `types/api/generated/` | Auto-generated API stubs. Do not edit by hand. |
| `types/api/source/` | Runtime dump, official reference, `api-docs.json` |
| `types/api/domain.d.ts` | Opaque domain aliases for generated signatures |
| `types/framework/manifest.d.ts` | `modinfo.ts` shapes |
| `types/framework/patch.d.ts` | Compiled `patches.json` objects (not the source `.js` files) |
| `types/sandkit.d.ts` / `types/global.d.ts` | `sandkit` / `api` / `__MOD_DEBUG__` |

Path alias: `types/*` → `./types/*`.

### `scripts/`

| Path | Role |
|---|---|
| `scripts/build/esbuild.config.mjs` | Bundle `src/main.ts` → `main.js`, write `modinfo.json` + `patches.json` |
| `scripts/build/build-patches.js` | Parse patch `.js` files into `patches.json` |
| `scripts/build/dev.js` | Watch + write to the game mods folder |
| `scripts/sandustry/mod-path.js` | `MOD_DIR` = `~/.config/sandustry/mods/Example Mod` |
| `scripts/sandustry/launch-sandustry.js` | Build (debug) and launch the game |
| `scripts/api/generate-api-types.js` | `npm run generate-types` |

## Builds

| Command | Debug helpers | `patches/debug/` | Output |
|---|---|---|---|
| `npm run build` | Stub (`framework/debug/empty.ts`) | Omitted | `dist/` (symlink) |
| `npm run dev` | Included | Included | `~/.config/sandustry/mods/Example Mod` |
| `npm run sandustry` / `--game` / `--debug` | Included | Included | Game mods folder |

`--no-debug` forces a release-style bundle.

In-game **Debug** (`api.settings.get("debug")`) is omitted from release `modinfo.json`. Missing setting defaults to on.

## Patches

Each `*.js` file is raw injected source. The filename without `.js` is the id. Leading comments set the other fields:

```js
// @file js/bundle.js
// @find initializing workers
// @expectedMatches 1

[patched]
```

`@operation` defaults to `replace`. Scan is not recursive: `patches/*.js` does not include `patches/debug/*.js`. Full format: [`src/patches/README.md`](src/patches/README.md).

## Commands

```bash
npm run dev              # watch, debug on
npm run build            # release
npm run typecheck
npm run generate-types   # after a new runtime dump
npm run sandustry        # build debug + launch
npm run sandustry:debug  # same, with inspector ports
```
