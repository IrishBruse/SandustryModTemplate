# Debug companion and hot reload

Session debug helpers live in the **debug** companion mod ([`src/debug/`](../../src/debug/)). The game folder name is **debug** (`mods/debug`). Debug builds install it. Release builds omit it and remove a leftover `mods/debug`.

The main bundle injects [`modkit/esbuild/hot-reload.inject.ts`](../../modkit/esbuild/hot-reload.inject.ts): it calls `installHotReload` and exposes free **`reloaded`**. Import `onDispose` from [`@modkit/debug`](../../modkit/debug/) when you need cleanup. Release builds stub `@modkit/debug` to [`modkit/esbuild/debug.empty.ts`](../../modkit/esbuild/debug.empty.ts).

## When it is installed

| Build   | Command                                       | `src/debug` mod            | `@modkit/debug`                           | `debugPatches` |
| ------- | --------------------------------------------- | -------------------------- | ----------------------------------------- | -------------- |
| Release | `npm run build`                               | Omitted (leftover removed) | Stub (`modkit/esbuild/debug.empty.ts`)    | Omitted        |
| Dev     | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/debug`)   | Bundled (inject boots `installHotReload`) | Included       |

`--mod hello-world-example` on a debug build still installs **debug**. `--mod debug` builds only that folder. `npm run publish` never lists the companion.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Do not call `installHotReload` or `isHotReloadEval` in `main.ts` — inject does that. Use free `reloaded` to skip one-shot boot work. Import `onDispose` from `@modkit/debug` when you need cleanup.

## Companion settings

Settings live on the debug mod only (`src/debug/mod.ts` `configSchema`):

| Setting                   | Key               | Default | Effect                                                                               |
| ------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------ |
| **Mod enabled**           | `enabled`         | on      | Master switch for runtime helpers                                                    |
| **Open DevTools on load** | `openDevTools`    | off     | Open Electron DevTools on load. Keep off under F5 so the IDE debugger stays attached |
| **F12 opens DevTools**    | `f12DevTools`     | on      | Capture-phase F12. Can disconnect an IDE debugger session                            |
| **Skip splash**           | `skipSplash`      | off     | Runtime click poll while splash logos are visible                                    |
| **Auto-boot Continue**    | `autoBoot`        | off     | Click Continue on the main menu after it has been visible                            |
| **Debug panel (F3)**      | `engineDebug`     | on      | Force `debug.active` (vanilla Debug / Stats); F3 toggles companion panel (top left)  |
| **Disable autosave**      | `disableAutosave` | on      | Sets `session.settings.autosaveInterval` to `0`. Manual saves still work             |

Turn on **Skip splash**, **Auto-boot Continue**, or **Open DevTools on load** in the debug mod settings when you want those helpers.

## Features

| Feature               | Where                                                            | Setting          | Notes                                                                 |
| --------------------- | ---------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------- |
| DevTools globals      | [`src/debug/main.ts`](../../src/debug/main.ts)                   | Mod enabled      | `sandkit`, `api`, `enums`, `react` on `globalThis`                    |
| Open DevTools on load | [`boot-menu.ts`](../../src/debug/boot-menu.ts)                   | Open DevTools    | Retries until the Electron bridge is ready. Keep off under F5         |
| F12 opens DevTools    | [`boot-menu.ts`](../../src/debug/boot-menu.ts)                   | F12              | Capture-phase keydown; skipped on hot-reload eval                     |
| Splash skip           | [`splash.ts`](../../src/debug/splash.ts)                         | Skip splash      | Clicks the splash while logos are visible                             |
| Main-menu auto-boot   | `boot-menu.ts` + [`menu.ts`](../../src/debug/menu.ts)            | Auto-boot        | Clicks **Continue** after it has been visible                         |
| Disable autosave      | [`autosave.ts`](../../src/debug/autosave.ts)                     | Disable autosave | Sets interval to `0` on load and each hot-reload eval                 |
| Renderer hot reload   | [`modkit/debug/hot-reload.ts`](../../modkit/debug/hot-reload.ts) | `npm run dev`    | Polls `GET /hot-reload/last` on the dev watch server                  |
| F3 debug panel        | [`src/debug/toggle/`](../../src/debug/toggle/)                   | Debug panel (F3) | Top-left companion panel; vanilla Debug / Stats stay for engine tools |

Hot-reload eval skips DevTools shortcut, splash polling, and auto-boot so those do not stack on every save. Autosave disable runs again on each hot-reload eval.

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

- On first load, `openDevToolsOnStartup` calls `window.electron.openDevTools()` immediately and again at 250 ms, 750 ms, 1500 ms, and 3000 ms when **Open DevTools on load** is on. Opening Electron DevTools on top of an IDE attach drops the debugger — keep that setting off under F5. Do not fetch `:9222` from the page — that HTTP call can freeze the game while the IDE is attached.
- **F12** still opens Electron DevTools. That can disconnect an IDE CDP session; prefer the IDE debugger panel when you launched with F5.
- The listener uses capture phase so the game does not swallow the key. Preload patches cannot target `preload.js`, so this runs in the renderer.

## Splash skip

When **Skip splash** is on, `startSplashSkipPolling` clicks `document` every 100 ms while `#splash-logo-1` / `#splash-logo-2` / `#splash-logo-3` or `#splash-screen` is visible, until `sessionStorage.splashShown` is set. There is no game-file patch; the setting gates runtime only.

## Main-menu auto-boot

When **Auto-boot Continue** is on, the helper waits until a **Continue** control is visible for 400 ms, then clicks it and opens DevTools (if that setting is on).

- Find is by visible label (`continue` or a label that ends with ` continue`), not by a DOM id.
- Polling uses `setInterval` (250 ms), `api.triggers.register("${modId}:main-menu-boot")`, `game:ready`, and a 1 s fallback.
- After a successful click, polling stops. Triggers have no unregister path, so a hot reload does not register them again (`isHotReloadEval`).

## Hot reload

Hot reload runs only with **`npm run dev`**. That watch build starts a dev server on `http://127.0.0.1:19147`. Each mod (via inject) polls **`GET /hot-reload/last`** every ~400 ms. When the notify counter changes, it re-reads `main.js`, clears `logs/<modinfo.id>.log` and the DevTools console, runs `onDispose` callbacks, and evaluates the new source with `new Function("sandkit", source)`. In the watch terminal, **Ctrl+R** forces the same path even when `main.js` has not changed.

One-shot builds (`npm run build`, `--game`) leave the dev watch URL empty. **F5** and `npm run sandustry` do not build — run `npm run dev` first so the watch owns `main.js`.

JavaScript cannot be unloaded. The loader only reclaims what you register:

```ts
import { onDispose } from "@modkit/debug";

const stop = api.ui.inject("my-panel", render);
onDispose(stop);
onDispose(() => clearInterval(timer));
```

| Change                                                 | Result                                |
| ------------------------------------------------------ | ------------------------------------- |
| `main.js` (dev rebuild notify)                         | Dispose, then evaluate the new source |
| `patches.json`, `modinfo.json`, declared `workerEntry` | Toast: restart the game               |

A monkey-patch or a trigger with no unregister path stays until the game restarts.

Free **`reloaded`** is true when this script body is running because a reload evaluated a new `main.js`. Use it to skip one-shot boot work (toasts, DevTools, splash skip).

## File logging (`console`)

Debug builds use esbuild [`inject`](https://esbuild.github.io/api/#inject) with [`modkit/esbuild/console.ts`](../../modkit/esbuild/console.ts). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code still print in DevTools and also `POST` to `http://127.0.0.1:19147/log` while `npm run dev` is up. Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`).

A renderer hot reload (save or **Ctrl+R**) truncates that file via `POST /log/clear` and calls `console.clear()` so the session starts clean. Use `clearLog(modId)` from `@modkit/log` to clear by hand. `clearLog` aborts after 500 ms if F5 / CDP stalls the POST.

```ts
console.log("[my-feature]", payload);
```

Release builds skip the inject. The shim uses `globalThis.console` so it does not recurse. `__MOD_ID__` is defined from that mod's `mod.ts` at build time.

## Debug patches

Optional extra debug-only patches can still be exported from a mod's `mod.ts` as `debugPatches`. Splash skip is a settings-gated runtime helper on the debug companion (no bundle patch). See [patches.md](../patches.md).

## Files

| Path                                  | Role                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------- |
| [`src/debug/`](../../src/debug/)      | Companion mod: DevTools, splash, auto-boot, F3, settings                   |
| `modkit/debug/index.ts`               | Re-exports `installHotReload`, `onDispose`, `isHotReloadEval`              |
| `modkit/debug/hot-reload.ts`          | Poll `GET /hot-reload/last`, `onDispose`, `isHotReloadEval`                |
| `modkit/esbuild/debug.empty.ts`       | Release stub: no-op `installHotReload`, `onDispose`, `isHotReloadEval`     |
| `modkit/esbuild/hot-reload.inject.ts` | esbuild inject: boot hot reload + free `reloaded` (all main builds)        |
| `modkit/esbuild/console.ts`           | esbuild inject: mirror `console.*` to watch-server file log (debug builds) |

## Wiring

```ts
// src/hello-world-example/main.ts — inject boots hot reload and sets `reloaded`
import { onDispose } from "@modkit/debug"; // only when you need cleanup
import { MOD_ID } from "./mod";

const api = sandkit.api;
if (!reloaded) {
  /* one-shot boot work */
}
onDispose(() => {
  /* unregister */
});
```

| Path                                  | Role                                                           |
| ------------------------------------- | -------------------------------------------------------------- |
| `modkit/esbuild/hot-reload.inject.ts` | esbuild inject: `installHotReload` + free `reloaded`           |
| `modkit/debug/index.ts`               | Re-exports `installHotReload`, `onDispose`, `isHotReloadEval`  |
| `modkit/esbuild/debug.empty.ts`       | Release stub: no-op install, `reloaded` false via stubbed eval |

Release builds resolve `@modkit/debug` to `modkit/esbuild/debug.empty.ts`.
