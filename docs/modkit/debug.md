# Debug companion and hot reload

Session debug helpers live in the **debug** companion mod ([`src/debug/`](../../src/debug/)). The game folder name is **debug** (`mods/debug`). Debug builds install it. Release builds omit it and remove a leftover `mods/debug`.

Each other mod keeps a one-file hot-reload client: [`src/<name>/debug.ts`](../../src/hello-toast-example/debug.ts). Release builds stub that import.

## When it is installed

| Build   | Command                                       | `src/debug` mod              | Per-mod `./debug`              | `debugPatches` |
| ------- | --------------------------------------------- | ---------------------------- | ------------------------------ | -------------- |
| Release | `npm run build`                               | Omitted (leftover removed)   | Stub (`modkit/debug/empty.ts`) | Omitted        |
| Dev     | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/debug`)     | Bundled (`installHotReload`)   | Included       |

`--mod hello-toast-example` on a debug build still installs **debug**. `--mod debug` builds only that folder. `npm run publish` never lists the companion.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Import `onDispose` / `isHotReloadEval` / `installHotReload` from `./debug`, not from `modkit/debug`, so release can stub them.

## Companion settings

Settings live on the debug mod only (`src/debug/mod.ts` `configSchema`):

| Setting                 | Key             | Default | Effect                                                                                          |
| ----------------------- | --------------- | ------- | ----------------------------------------------------------------------------------------------- |
| **Mod enabled**         | `enabled`       | on      | Master switch for runtime helpers                                                               |
| **Open DevTools on load** | `openDevTools`  | on      | Open Electron DevTools on load. Skipped when `ide-debug.json` is present (F5)                   |
| **F12 opens DevTools**  | `f12DevTools`   | on      | Capture-phase F12. Can disconnect an IDE debugger session                                       |
| **Skip splash**         | `skipSplash`    | on      | Runtime click poll while splash logos are visible                                               |
| **Auto-boot Continue**  | `autoBoot`      | on      | Click Continue on the main menu after it has been visible                                       |
| **Engine Debug (F3)**   | `engineDebug`   | on      | Management row + F3; force `debug.active`; hide vanilla Debug / Stats buttons                   |

The splash **bundle patch** applies while the debug mod is installed. The **Skip splash** setting only gates the runtime poll.

## Features

| Feature               | Where                                              | Setting            | Notes                                                                              |
| --------------------- | -------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| DevTools globals      | [`src/debug/main.ts`](../../src/debug/main.ts)     | Mod enabled        | `sandkit`, `api`, `enums`, `react` on `globalThis`                                 |
| Open DevTools on load | [`boot-menu.ts`](../../src/debug/boot-menu.ts)     | Open DevTools      | Retries until the Electron bridge is ready; skipped when CDP `:9222` is up (F5)    |
| F12 opens DevTools    | [`boot-menu.ts`](../../src/debug/boot-menu.ts)     | F12                | Capture-phase keydown; skipped on hot-reload eval                                  |
| Splash skip (runtime) | [`splash.ts`](../../src/debug/splash.ts)           | Skip splash        | Clicks the splash while logos are visible                                          |
| Splash skip (bundle)  | [`src/debug/mod.ts`](../../src/debug/mod.ts)       | Mod installed      | Rewrites `js/bundle.js`; not toggled at runtime                                    |
| Main-menu auto-boot   | `boot-menu.ts` + [`menu.ts`](../../src/debug/menu.ts) | Auto-boot       | Clicks **Continue** after it has been visible                                      |
| Renderer hot reload   | [`modkit/debug/hot-reload.ts`](../../modkit/debug/hot-reload.ts) | `npm run dev` | Polls `GET /hot-reload/last` on the dev watch server                               |
| F3 debug toggle       | [`src/debug/toggle/`](../../src/debug/toggle/)     | Engine Debug       | Management row + F3 opens the engine Debug window                                  |

Hot-reload eval skips DevTools shortcut, splash polling, and auto-boot so those do not stack on every save.

## DevTools globals

The debug mod copies the live Sandkit objects onto `globalThis` for the browser
console and dump scripts. In TypeScript, `sandkit` is already an ambient free
variable (see [`modkit/sandkit-global.d.ts`](../../modkit/sandkit-global.d.ts)). Use that name in mod code — do not import
a value binding. DevTools also gets `api`, `enums`, and `react` on `globalThis`.

- `sandkit`
- `api` (`sandkit.api`)
- `enums`
- `react`

After the mod has loaded, you can paste a runtime API dump script into DevTools. See the [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types) repo for dump tooling.

## DevTools

- On first load, `openDevToolsOnStartup` calls `window.electron.openDevTools()` immediately and again at 250 ms, 750 ms, 1500 ms, and 3000 ms — **unless** F5 / `sandustry:vscode` wrote `ide-debug.json` into the local mod folders (the renderer has no `process.env`, so spawn env alone cannot signal this). Opening Electron DevTools on top of that attach drops the IDE debugger. The renderer does not fetch `:9222` — that HTTP call can freeze the game while the IDE is attached.
- **F12** still opens Electron DevTools (force). That can disconnect an IDE CDP session; prefer the IDE debugger panel when you launched with F5.
- The listener uses capture phase so the game does not swallow the key. Preload patches cannot target `preload.js`, so this runs in the renderer.

## Splash skip

Two layers, both only while the debug mod is installed:

1. **Bundle patch** — `skip-startup-splash` in [`src/debug/mod.ts`](../../src/debug/mod.ts) registers a `requestAnimationFrame` click loop next to the game splash listeners. Format: [patches.md](../patches.md).
2. **Runtime poll** — `startSplashSkipPolling` clicks `document` every 100 ms while `#splash-logo-1` / `#splash-logo-2` / `#splash-logo-3` or `#splash-screen` is visible, until `sessionStorage.splashShown` is set.

## Main-menu auto-boot

When **Auto-boot Continue** is on, the helper waits until a **Continue** control is visible for 400 ms, then clicks it and opens DevTools (if that setting is on).

- Find is by visible label (`continue` or a label that ends with ` continue`), not by a DOM id.
- Polling uses `setInterval` (250 ms), `api.triggers.register("${modId}:main-menu-boot")`, `game:ready`, and a 1 s fallback.
- After a successful click, polling stops. Triggers have no unregister path, so a hot reload does not register them again (`isHotReloadEval`).

## Hot reload

Hot reload runs only with **`npm run dev`**. That watch build starts a dev server on `http://127.0.0.1:19147`. Each mod that calls `installHotReload` polls **`GET /hot-reload/last`** every ~400 ms. When the notify counter changes, it re-reads `main.js`, clears `logs/<modinfo.id>.log` and the DevTools console, runs `onDispose` callbacks, and evaluates the new source with `new Function("sandkit", source)`. In the watch terminal, **Ctrl+R** forces the same path even when `main.js` has not changed.

One-shot builds (`npm run build`, `--game`) leave the dev watch URL empty. **F5** and `npm run sandustry` do not build — run `npm run dev` first so the watch owns `main.js`.

JavaScript cannot be unloaded. The loader only reclaims what you register:

```ts
import { onDispose } from "./debug";

const stop = api.ui.inject("my-panel", render);
onDispose(stop);
onDispose(() => clearInterval(timer));
```

| Change                                                 | Result                                |
| ------------------------------------------------------ | ------------------------------------- |
| `main.js` (dev rebuild notify)                         | Dispose, then evaluate the new source |
| `patches.json`, `modinfo.json`, declared `workerEntry` | Toast: restart the game               |

A monkey-patch or a trigger with no unregister path stays until the game restarts.

`isHotReloadEval(modId)` is true when this script body is running because a reload evaluated a new `main.js`. Use it to skip one-shot boot work (toasts, DevTools, splash skip).

## File logging (`console`)

Debug builds use esbuild [`inject`](https://esbuild.github.io/api/#inject) with [`modkit/console.ts`](../../modkit/console.ts). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code still print in DevTools and also `POST` to `http://127.0.0.1:19147/log` while `npm run dev` is up. Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`).

A renderer hot reload (save or **Ctrl+R**) truncates that file via `POST /log/clear` and calls `console.clear()` so the session starts clean. Use `clearLog(modId)` from `@modkit/log` to clear by hand. **F5** skips the HTTP clear (CDP can stall that POST) and still calls `console.clear()`.

```ts
console.log("[my-feature]", payload);
```

Release builds skip the inject. The shim uses `globalThis.console` so it does not recurse. `__MOD_ID__` is defined from that mod's `mod.ts` at build time.

## Debug patches

Optional extra debug-only patches can still be exported from a mod's `mod.ts` as `debugPatches`. Splash skip lives on the debug companion, not in `modkit/patches.ts`. See [patches.md](../patches.md).

## Files

| Path                                      | Role                                                                             |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| [`src/debug/`](../../src/debug/)          | Companion mod: DevTools, splash, auto-boot, F3, splash patch, settings           |
| `modkit/debug/index.ts`                   | Re-exports `installHotReload`, `onDispose`, `isHotReloadEval`                    |
| `modkit/debug/empty.ts`                   | Release stub: no-op `installHotReload`, `onDispose`, `isHotReloadEval`           |
| `modkit/debug/hot-reload.ts`              | Poll `GET /hot-reload/last`, `onDispose`, `isHotReloadEval`                      |
| `modkit/console.ts`                       | esbuild inject: mirror `console.*` to watch-server file log (debug builds)       |
| `src/<name>/debug.ts`                     | Thin re-export so release can stub `./debug`                                     |

## Wiring

```ts
// src/hello-toast-example/debug.ts — debug builds
export { installHotReload, isHotReloadEval, onDispose } from "@modkit/debug";

// src/hello-toast-example/main.ts
import { installHotReload, isHotReloadEval, onDispose } from "./debug";
installHotReload(api, MOD_ID);
```

Release builds resolve `./debug` (from that mod's `main.ts`) to `modkit/debug/empty.ts` (`installHotReload` no-op, `onDispose` no-op, `isHotReloadEval` false).
