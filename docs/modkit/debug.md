# Debug modkit

Shared dev-only helpers for Sandustry mods. Call `installDebug(api, modId)` from the mod debug entry (`src/debug` in this repo). Release builds stub that import, so none of this folder is bundled in production.

## When it is included

| Build   | Command                                       | This folder                    | `debugPatches` | `configSchema.debug`        |
| ------- | --------------------------------------------- | ------------------------------ | -------------- | --------------------------- |
| Release | `npm run build`                               | Stub (`modkit/debug/empty.ts`) | Omitted        | Omitted from `modinfo.json` |
| Dev     | `npm run dev`, `--watch`, `--game`, `--debug` | Bundled                        | Included       | Present                     |

The in-game **Debug** setting (`api.settings.get("debug")`) turns some helpers on or off at runtime without a rebuild. If the setting is missing, it defaults to on.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Mod-only extra debug code lives in [`src/debug/`](../../src/debug/). That folder re-exports `onDispose` and `isHotReloadEval` so release stubs work. Import those from `./debug`, not from `modkit/debug`.

## Features

| Feature               | File                                                                         | Debug setting              | Notes                                                 |
| --------------------- | ---------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| DevTools globals      | `index.ts`                                                                   | Always in a debug build    | `sandkit`, `api`, `enums`, `react` on `globalThis`    |
| Open DevTools on load | `boot-menu.ts`                                                               | Always in a debug build    | Retries until the Electron bridge is ready            |
| F12 opens DevTools    | `boot-menu.ts`                                                               | Always in a debug build    | Capture-phase keydown; skipped on hot-reload eval     |
| Splash skip (runtime) | `splash.ts`                                                                  | Always in a debug build    | Clicks the splash while logos are visible             |
| Splash skip (bundle)  | [`../../modkit/patches.ts`](../../modkit/patches.ts) (`skip-startup-splash`) | Debug **build**            | Rewrites `js/bundle.js`; not toggled at runtime       |
| Main-menu auto-boot   | `boot-menu.ts` + `menu.ts`                                                   | Must be on                 | Clicks **Continue** after it has been visible         |
| Renderer hot reload   | `hot-reload.ts`                                                              | Must be on + `npm run dev` | SSE notify from watch build; dispose + eval `main.js` |
| F3 debug toggle       | `toggle/`                                                                    | Always in a debug build    | Management row + panel for engine debug flags         |

### F3 debug toggle

Dev builds inject a **Debug** management row under Upgrades and bind **F3** to the same panel. The panel toggles the engine flags from `references/uolkx-debug-toggle` (`active`, `drawChunks`, cell inspector, lights, and so on).

| Control            | Setting           | Notes                                                                                             |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------- |
| Sidebar Debug row  | `debugMenuButton` | Default on. Turn off to hide the row; **F3 still works** and cannot be disabled in a debug build. |
| Engine flag fields | `debugActive`, …  | Same schema as the reference mod; omitted from release `modinfo.json`.                            |

Schema helpers: `modkitDebugConfigSchema` / `debugOnlyConfigKeys` from `@modkit/debug/config-schema` (spread into `mod.ts`).

Hot-reload eval skips DevTools shortcut, splash polling, and auto-boot so those do not stack on every save.

## DevTools globals

`installDebug` copies the live Sandkit objects onto `globalThis` for the browser
console and dump scripts only. Those names are not ambient TypeScript globals —
import `sandkit` from `@modkit/sandkit` in mod code.

- `sandkit`
- `api` (`sandkit.api`)
- `enums`
- `react`

After the mod has loaded, you can paste a runtime API dump script into DevTools. See the [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types) repo for dump tooling.

## DevTools

- On first load, `openDevToolsOnStartup` calls `window.electron.openDevTools()` immediately and again at 250 ms, 750 ms, 1500 ms, and 3000 ms.
- **F12** opens DevTools. The listener uses capture phase so the game does not swallow the key. Preload patches cannot target `preload.js`, so this runs in the renderer.

## Splash skip

Two layers, both debug-build only:

1. **Bundle patch** — [`skip-startup-splash`](../../modkit/patches.ts) in `modkitDebugPatches` registers a `requestAnimationFrame` click loop next to the game splash listeners. Format: [patches.md](../patches.md).
2. **Runtime poll** — `startSplashSkipPolling` clicks `document` every 100 ms while `#splash-logo-1` / `#splash-logo-2` / `#splash-logo-3` or `#splash-screen` is visible, until `sessionStorage.splashShown` is set.

## Main-menu auto-boot

When the Debug setting is on, the helper waits until a **Continue** control is visible for 400 ms, then clicks it and opens DevTools.

- Find is by visible label (`continue` or a label that ends with ` continue`), not by a DOM id.
- Polling uses `setInterval` (250 ms), `api.triggers.register("${modId}:main-menu-boot")`, `game:ready`, and a 1 s fallback.
- After a successful click, polling stops. Triggers have no unregister path, so a hot reload does not register them again (`isHotReloadEval`).

## Hot reload

Hot reload runs only with **`npm run dev`**. That watch build starts an SSE server on `http://127.0.0.1:19147/hot-reload` and embeds the URL in the debug bundle. With the Debug setting on, the mod opens `EventSource` to that URL. Each successful rebuild pushes a notify event; the client then re-reads `main.js` / `modkit/index.js`, runs `onDispose` callbacks, clears `globalThis.__modkit` when the kit changed, and evaluates the new `main.js` with `new Function("sandkit", source)`.

One-shot builds (`npm run build`, `sandustry`, `sandustry:debug`) leave the URL empty — no subscribe and no file polling.

JavaScript cannot be unloaded. The loader only reclaims what you register:

```ts
import { onDispose } from "./debug";

const stop = api.ui.inject("my-panel", render);
onDispose(stop);
onDispose(() => clearInterval(timer));
```

| Change                                                 | Result                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `main.js` (dev rebuild notify)                         | Dispose, then evaluate the new source                            |
| `modkit/index.js` (dev rebuild notify)                 | Dispose, clear `__modkit`, then evaluate `main.js` (reloads kit) |
| `patches.json`, `modinfo.json`, declared `workerEntry` | Toast: restart the game                                          |

A monkey-patch or a trigger with no unregister path stays until the game restarts.

`isHotReloadEval(modId)` is true when this script body is running because a reload evaluated a new `main.js`. Use it to skip one-shot boot work (toasts, DevTools, splash skip).

Turning Debug off closes the EventSource. Turning it on connects again when the URL is present.

## Debug patches

Define debug-only patches in root `mod.ts` as `debugPatches`. Shared splash skip lives in [`modkit/patches.ts`](../../modkit/patches.ts) (`modkitDebugPatches`). See [patches.md](../patches.md).

## Files

| Path               | Role                                                               |
| ------------------ | ------------------------------------------------------------------ |
| `index.ts`         | `installDebug`, globals, re-exports                                |
| `empty.ts`         | Release stub: no-op `installDebug`, `onDispose`, `isHotReloadEval` |
| `config-schema.ts` | Dev-only settings schema + keys omitted from release               |
| `boot-menu.ts`     | DevTools on load, F12, auto-boot schedule                          |
| `menu.ts`          | Find and click the main-menu Continue row                          |
| `splash.ts`        | Runtime splash click poll                                          |
| `hot-reload.ts`    | SSE subscribe (`npm run dev`), `onDispose`, `isHotReloadEval`      |
| `toggle/`          | F3 / management Debug panel for engine flags                       |

## Wiring

```ts
// src/debug/index.ts — debug builds
import { installDebug as installModkitDebug } from "@modkit/debug";
export { isHotReloadEval, onDispose } from "@modkit/debug";
export function installDebug(api: SandkitApi, modId: string): void {
  installModkitDebug(api, modId);
}

// src/main.ts
import { installDebug, isHotReloadEval, onDispose } from "./debug";
```

Release builds resolve `./debug` (from `src/main.ts`) to `modkit/debug/empty.ts` (`installDebug` no-op, `onDispose` no-op, `isHotReloadEval` false).
