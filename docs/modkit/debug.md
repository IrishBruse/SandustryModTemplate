# Debug companion and hot reload

Session debug helpers live in the **debug** companion mod ([`src/debug/`](../../src/debug/)). The game folder name is **debug** (`mods/debug`). Debug builds install it. Release builds omit it and remove a leftover `mods/debug`. Manifest **`loadOrder`** is `-2147483648` so this companion runs before other local mods.

The **debug** companion patches the game loader so local mods can hot-reload without esbuild inject. The loader wrapper defines free **`reloaded`** and sets the active mod id. Import `onDispose` from [`@modkit/debug`](../../modkit/internal/debug/) when you need cleanup. Release builds omit the companion, define **`reloaded`** as `false`, and stub `@modkit/debug` to [`modkit/internal/esbuild/debug.empty.ts`](../../modkit/internal/esbuild/debug.empty.ts).

The same main-entry rewrite also skips the entry body when **`enabled`** is false (`isEnabled`). Do not add that guard in `main.ts`. See [utils.md](utils.md).

## When it is installed

| Build   | Command                                       | `src/debug` mod            | `@modkit/debug`                                 | `debugPatches` |
| ------- | --------------------------------------------- | -------------------------- | ----------------------------------------------- | -------------- |
| Release | `npm run build`                               | Omitted (leftover removed) | Stub (`modkit/internal/esbuild/debug.empty.ts`) | Omitted        |
| Dev     | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/debug`)   | Bundled (companion watches local mods)          | Included       |

`--mod hello-world` on a debug build still installs **debug**. `--mod debug` builds only that folder. `npm run publish` never lists the companion.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Use free `reloaded` to skip one-shot boot work. Import `onDispose` from `@modkit/debug` when you need cleanup. Other developers subscribe to this companion on the Workshop. The companion does not watch other Workshop items.

## Companion settings

Settings live on the debug mod only (`src/debug/mod.ts` `configSchema`). Open **Options → Mods → debug**.

| Setting                   | Key               | Default | Effect                                                                                                                                                                                      |
| ------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mod enabled**           | `enabled`         | on      | Master switch for runtime helpers                                                                                                                                                           |
| **Open DevTools on load** | `openDevTools`    | off     | Open Electron DevTools on load. Keep off under F5 so the IDE debugger stays attached                                                                                                        |
| **F12 opens DevTools**    | `f12DevTools`     | on      | Capture-phase F12. Can disconnect an IDE debugger session                                                                                                                                   |
| **Auto-load save**        | `autoLoad`        | on      | On load, `location.assign` with `?db_load=<saveId>`. Skips splash and main menu. Legacy `autoBoot` prefs still count until you set `autoLoad`                                               |
| **Start save**            | `startSave`       | Mod storage | **Last played** or **Mod storage**. **Mod storage** reads `api.storage` (`startSave`). Pick a world in the Start save panel. |
| **Engine debug**          | `engineDebug`     | on      | Force `debug.active` (vanilla Debug / Stats). F3 toggles companion debug overlay                                                                                                            |
| **Disable autosave**      | `disableAutosave` | on      | Sets `session.settings.autosaveInterval` to `0`. Manual saves still work                                                                                                                    |
| **Watch local mods**      | `watchLocalMods`  | on      | Poll local mod folders for `main.js` / `patches.json` / `modinfo.json` / worker entry. Workshop mods are ignored                                                                            |
| **If hot reload cannot run** | `hotReloadFallback` | Toast | When `main.js` changed but the mod has no dispose path: **Do nothing**, **Toast**, or **Reload page**. Page reload does not re-apply `patches.json` |

Turn on **Auto-load save** or **Open DevTools on load** when you want those helpers.

## Features

| Feature               | Where                                                                              | Setting          | Notes                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| DevTools globals      | [`src/debug/main.ts`](../../src/debug/main.ts)                                     | Mod enabled      | `sandkit`, `api`, `enums`, `react` on `globalThis`                                                 |
| Open DevTools on load | [`boot/boot-menu.ts`](../../src/debug/boot/boot-menu.ts)                                     | Open DevTools    | Retries until the Electron bridge is ready. Keep off under F5                                      |
| F12 opens DevTools    | [`boot/boot-menu.ts`](../../src/debug/boot/boot-menu.ts)                                     | F12              | Capture-phase keydown; skipped on hot-reload eval                                                  |
| Auto-load save        | [`boot/boot-menu.ts`](../../src/debug/boot/boot-menu.ts) + [`boot/auto-load-save.ts`](../../src/debug/boot/auto-load-save.ts) | Auto-load + Start save | Reloads with `?db_load=` for the **Start save** pick |
| Start save picker     | [`boot/start-save-picker.tsx`](../../src/debug/boot/start-save-picker.tsx)           | Start save       | Lists local saves on the main menu. Writes `api.storage`. Hidden in-game. |
| Disable autosave      | [`boot/autosave.ts`](../../src/debug/boot/autosave.ts)                                       | Disable autosave | Sets interval to `0` on load and each hot-reload eval                                              |
| Renderer hot reload   | [`reload/local-mod-reload.ts`](../../src/debug/reload/local-mod-reload.ts)                       | Watch local mods | Polls local folders; Workshop mods are skipped                                             |
| F3 debug overlay      | [`f3/F3DebugOverlay.tsx`](../../src/debug/f3/F3DebugOverlay.tsx) | Engine debug     | Minecraft-style text HUD; extensible via `registerF3Section` / `globalThis.debugF3`              |

Hot-reload eval skips DevTools shortcut and auto-load so those do not stack on every save. Autosave disable runs again on each hot-reload eval.

## DevTools globals

The debug mod copies the live Sandkit objects onto `globalThis` for the browser
console and dump scripts. In TypeScript, `sandkit` is already an ambient free
variable (see [`modkit/types/global.d.ts`](../../modkit/types/global.d.ts) and [`modkit/ambient.d.ts`](../../modkit/ambient.d.ts)). Use that name in mod code — do not import
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

## Auto-load save

When **Auto-load save** is on, the companion resolves a save id from **Start save** and navigates like the game **Continue** path:

```ts
const url = new URL(window.location.href);
url.search = "";
url.searchParams.set("db_load", saveId);
location.assign(url.toString());
```

**Start save** is a normal mod setting (`startSave`): **Last played** or **Mod storage**. `api.settings` is read-only and choice options are fixed in `configSchema`, so the live save list cannot live in Options. The companion overlay lists local saves (`electron.getSaveFiles`) and writes this companion's `api.storage` key `startSave`. Set **Start save** to **Mod storage** (the default) to use that pick. **Last played** uses the same source as Continue (`getLastPlayedGameSync` / `localStorage.lastPlayedGame`). Another mod can set storage:

```ts
api.storage.set("irishbruse.debug", "startSave", saveId);
```

If that value is missing or the save is gone, auto-load falls back to last played.

It does nothing when:

- The URL already has a boot query (`db_load`, `new_game`, `load`, …)
- The session is already in-game
- There is no resolvable save

## F3 debug overlay

When **Engine debug** is on, **F3** toggles a Minecraft-style text overlay (monospace, white with shadow). Built-in sections show **Player** world/cell position and **Mouse** cell/world position while in-game.

Add sections from the debug mod:

```ts
import { registerF3Section } from "./f3/registry";

registerF3Section({
  id: "my-stats",
  title: "My mod",
  lines: () => [{ left: "Foo", right: "42" }],
});
```

After boot, `globalThis.debugF3.registerSection` is the same API for DevTools experiments.

## Hot reload

Subscribe to the **debug** companion on the Workshop. This template's debug builds also install a local copy. The companion patches `js/external-mod-runtime.js` and polls **local** mod folders about every 400 ms. Other Workshop / subscribed mods are not watched. You do not need esbuild or `npm run dev` for that poll (file bytes on disk are enough). `npm run dev` still rebuilds this template's bundles and file logs.

When **local** `main.js` bytes change:

- If the mod registered `onDispose`, or `api.ui.inject` was auto-tracked, the companion disposes and evaluates the new source with that mod's `sandkit`.
- Otherwise it honours **If hot reload cannot run** (`off` / `toast` / `reload` the page).

When `patches.json`, `modinfo.json`, or a declared worker entry change (including this companion’s own `patches.json` / `modinfo.json`), the companion toasts **restart the game**. It stores that message in `sessionStorage` so a DevTools page reload still shows it. Patches apply in the Electron main process at process start. `location.reload()` does not re-apply them.

This companion does **not** hot-eval its own `main.js` (that would tear down the poller). After you change the debug companion, **restart the game**. A page reload is not enough for patches or workers.

The three loader patches share an **atomic group**. All apply, or none apply. After boot, the companion checks the local-mod registry and `ui.inject` tracking. If a hook is missing, it toasts **restart the game**. Free `reloaded` comes only from the loader patch (not esbuild).

JavaScript cannot be unloaded. The loader only reclaims what you register (or what `api.ui.inject` returns):

```ts
import { onDispose } from "@modkit/debug";

const stop = api.ui.inject("my-panel", render);
onDispose(stop);
onDispose(() => clearInterval(timer));
```

| Change                                                 | Result                                              |
| ------------------------------------------------------ | --------------------------------------------------- |
| Local `main.js` with dispose / tracked inject          | Dispose, then evaluate the new source               |
| Local `main.js` with no dispose                        | **If hot reload cannot run** (`off` / toast / page) |
| `patches.json`, `modinfo.json`, declared `workerEntry` | Toast: restart the game (page reload is not enough) |
| Workshop mod files                                     | Ignored                                             |

A monkey-patch or a trigger with no unregister path stays until the game restarts.

Free **`reloaded`** is true when this script body is running because a reload evaluated a new `main.js`. Use it to skip one-shot boot work (toasts, DevTools, auto-load). The loader patch defines that binding. Release builds define it as `false`.

## File logging (`console`)

Debug builds use esbuild [`inject`](https://esbuild.github.io/api/#inject) with [`modkit/internal/esbuild/console.ts`](../../modkit/internal/esbuild/console.ts). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code also `POST` to `http://127.0.0.1:19147/log` while `npm run dev` is up ([`scripts/dev/log-server.js`](../../scripts/dev/log-server.js)). Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`). Tag messages yourself or use `createLogger` from `@modkit/log` when you want a bracket prefix.

A renderer hot reload truncates that file via `POST /log/clear` and calls `console.clear()` so the session starts clean. Use `clearLog(modId)` from `@modkit/log` to clear by hand. `clearLog` aborts after 500 ms if F5 / CDP stalls the POST.

```ts
console.log("my-feature", payload);
// DevTools: my-feature {…}
// logs/author.hello-world-example.log: [log] my-feature {…}
```

Release builds skip the inject. The shim uses `globalThis.console` so it does not recurse. `__MOD_ID__` is defined from that mod's `mod.ts` at build time.

## Debug patches

The companion rewrites `js/external-mod-runtime.js`. Definitions live in [`src/debug/patches.ts`](../../src/debug/patches.ts) and are re-exported from `mod.ts`.

| id | File | Role |
| --- | --- | --- |
| `local-mod-compile-reloaded` | `js/external-mod-runtime.js` | Define free `reloaded` and the active mod id in the loader wrapper. |
| `local-mod-registry` | `js/external-mod-runtime.js` | Publish local mods on `globalThis.__sandkitLocalModRegistry__`. |
| `local-mod-track-inject` | `js/external-mod-runtime.js` | Auto-track `ui.inject` unregister functions for hot-eval. |

These three patches use the same `atomicGroup` (`local-mod-loader`).

Workshop mods are not added to the registry. See [patches.md](../patches.md) for the patch format.

## Files

| Path                                           | Role                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| [`src/debug/`](../../src/debug/)               | Companion: `mod.ts`, `main.ts`, `patches.ts` at the root                   |
| [`src/debug/boot/`](../../src/debug/boot/)     | Auto-load, Start save picker, DevTools boot, autosave, settings helpers |
| [`src/debug/reload/`](../../src/debug/reload/) | Local-mod poll, hot-eval, loader health (`loader-health.ts`)               |
| [`src/debug/f3/`](../../src/debug/f3/)         | F3 overlay, engine debug sync, built-in sections                           |
| `modkit/internal/debug/index.ts`               | `onDispose` only                                                           |
| `modkit/internal/esbuild/debug.empty.ts`       | Release stub: no-op `onDispose`                                            |
| `modkit/internal/esbuild/console.ts`           | esbuild inject: mirror `console.*` to the watch log server (debug builds) |

## Wiring

```ts
// examples/hello-world/main.ts — loader patch sets `reloaded`
import { onDispose } from "@modkit/debug"; // only when you need cleanup

const api = sandkit.api;
if (!reloaded) {
  /* one-shot boot work */
}
onDispose(() => {
  /* unregister */
});
```

The debug companion owns file watching. Release builds define `reloaded` as `false`. They still resolve `@modkit/debug` to `modkit/internal/esbuild/debug.empty.ts` when a mod imports `onDispose`.
