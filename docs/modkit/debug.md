# Debug companion and hot reload

Session debug helpers live in the **debug** companion mod ([`src/debug/`](../../src/debug/)). The game folder name is **debug** (`mods/debug`). Debug builds install it. Release builds omit it and remove a leftover `mods/debug`. Manifest **`loadOrder`** is `-2147483648` so this companion runs before other local mods.

The **debug** companion patches the game loader so local mods can hot-reload without esbuild inject. The loader wrapper defines free **`reloaded`** and sets the active mod id. Import `onDispose` from [`@modkit/debug`](../../modkit/internal/debug/) when you need cleanup. Release builds omit the companion and define **`reloaded`** as `false`, but still bundle real `onDispose` so hot reload can dispose when the companion is installed.

The same main-entry rewrite also skips the entry body when **`enabled`** is false (`isEnabled`). Do not add that guard in `main.ts`. See [utils.md](utils.md).

## When it is installed

| Build   | Command                                       | `src/debug` mod            | `@modkit/debug`                        | `debugPatches` |
| ------- | --------------------------------------------- | -------------------------- | -------------------------------------- | -------------- |
| Release | `npm run build`                               | Omitted (leftover removed) | Bundled (`onDispose` registry)         | Omitted        |
| Dev     | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/debug`)   | Bundled (companion watches local mods) | Included       |

`--mod hello-world` on a debug build still installs **debug**. `--mod debug` builds only that folder. `npm run publish` never lists the companion.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Use free `reloaded` to skip one-shot boot work. Import `onDispose` from `@modkit/debug` when you need cleanup. Other developers subscribe to this companion on the Workshop. The companion does not watch other Workshop items.

## Companion settings

Settings live on the debug mod only (`src/debug/mod.ts` `configSchema`). Open **Options → Mods → debug**.

| Setting                      | Key                 | Default     | Effect                                                                                                                                                                                                               |
| ---------------------------- | ------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mod enabled**              | `enabled`           | on          | Master switch for runtime helpers                                                                                                                                                                                    |
| **Open DevTools on load**    | `openDevTools`      | off         | Open Electron DevTools on load. Keep off under F5 so the IDE debugger stays attached                                                                                                                                 |
| **F12 opens DevTools**       | `f12DevTools`       | off         | Capture-phase F12. Can disconnect an IDE debugger session                                                                                                                                                            |
| **Auto-load save**           | `autoLoad`          | off         | On load, `location.assign` with `?db_load=<saveId>`. Skips splash and main menu. Legacy `autoBoot` prefs still count until you set `autoLoad`                                                                        |
| **Start save**               | `startSave`         | Mod storage | **Last played** or **Mod storage**. **Mod storage** reads `api.storage` (`startSave`). Set the id from DevTools or another mod.                                                                                       |
| **Engine debug**             | `engineDebug`       | off         | Force `debug.active` (vanilla Debug / Stats). F3 toggles companion debug overlay                                                                                                                                     |
| **Disable autosave**         | `disableAutosave`   | off         | Sets `session.settings.autosaveInterval` to `0`. Manual saves still work                                                                                                                                             |
| **Watch local mods**         | `watchLocalMods`    | off         | Poll local mod folders for `main.js` / `patches.json` / `modinfo.json` / worker entry. Workshop mods are ignored                                                                                                     |
| **If hot reload cannot run** | `hotReloadFallback` | Eval anyway | When `main.js` changed with no dispose path: **Do nothing**, **Eval anyway**, or **Reload page**. **Eval anyway** still evaluates the new source (listeners can stack). Page reload does not re-apply `patches.json` |

Turn on **Watch local mods**, **Auto-load save**, **Engine debug**, **Disable autosave**, **F12**, or **Open DevTools on load** when you want those helpers.

## Features

| Feature               | Where                                                                                                                         | Setting                | Notes                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| DevTools globals      | [`src/debug/main.ts`](../../src/debug/main.ts)                                                                                | Mod enabled            | `sandkit`, `api`, `enums`, `react` on `globalThis`                                  |
| Open DevTools on load | [`boot/boot-menu.ts`](../../src/debug/boot/boot-menu.ts)                                                                      | Open DevTools          | Retries until the Electron bridge is ready. Keep off under F5                       |
| F12 opens DevTools    | [`boot/boot-menu.ts`](../../src/debug/boot/boot-menu.ts)                                                                      | F12                    | Capture-phase keydown; skipped on hot-reload eval                                   |
| Auto-load save        | [`boot/boot-menu.ts`](../../src/debug/boot/boot-menu.ts) + [`boot/auto-load-save.ts`](../../src/debug/boot/auto-load-save.ts) | Auto-load + Start save | Reloads with `?db_load=` for the **Start save** pick                                |
| Disable autosave      | [`boot/autosave.ts`](../../src/debug/boot/autosave.ts)                                                                        | Disable autosave       | Sets interval to `0` on load and each hot-reload eval                               |
| Renderer hot reload   | [`reload/local-mod-reload.ts`](../../src/debug/reload/local-mod-reload.ts)                                                    | Watch local mods       | Polls local folders; Workshop mods are skipped                                      |
| F3 debug overlay      | [`f3/F3DebugOverlay.tsx`](../../src/debug/f3/F3DebugOverlay.tsx)                                                              | Engine debug           | Minecraft-style text HUD; extensible via `registerF3Section` / `globalThis.debugF3` |

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

After the mod has loaded, inspect `sandkit` in DevTools or compare runtime keys against [`modkit/types/`](../modkit/types/README.md) and the [Sandkit API reference](../api/README.md).

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

**Start save** is a normal mod setting (`startSave`): **Last played** or **Mod storage**. `api.settings` is read-only and choice options are fixed in `configSchema`, so the live save list cannot live in Options. Set **Start save** to **Mod storage** (the default) and write this companion's `api.storage` key `startSave` from DevTools or another mod. **Last played** uses the same source as Continue (`getLastPlayedGameSync` / `localStorage.lastPlayedGame`). Example:

```ts
api.storage.set("irishbruse.debug", "startSave", saveId);
```

If that value is missing or the save is gone, auto-load falls back to last played.

It does nothing when:

- The URL already has a boot query (`db_load`, `new_game`, `load`, …)
- The session is already in-game
- There is no resolvable save
- Auto-load already ran this browser session (for example after you exit to the main menu and the page reloads)
- The mod body is running from hot reload (`reloaded` is true)

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

- The companion runs any registered `onDispose` callbacks and auto-tracked `api.ui.inject` / `api.ui.overlays.register` unregisters, then evaluates the new source with that mod's `sandkit`.
- If there is no dispose path, the default **Eval anyway** setting still evaluates. Listeners and overlays can stack until you add cleanup. **Do nothing** skips the eval. **Reload page** reloads the renderer (it does not re-apply `patches.json`).

When `patches.json`, `modinfo.json`, or a declared worker entry change (including this companion’s own `patches.json` / `modinfo.json`), the companion toasts **restart the game**. It stores that message in `sessionStorage` so a DevTools page reload still shows it. Patches apply in the Electron main process at process start. `location.reload()` does not re-apply them.

This companion does **not** hot-eval its own `main.js` (that would tear down the poller). After you change the debug companion, **restart the game**. A page reload is not enough for patches or workers.

The loader patches share an **atomic group**. All apply, or none apply. After boot, the companion checks the local-mod registry and `ui.inject` tracking. If a hook is missing, it toasts **restart the game**. Free `reloaded` comes only from the loader patch (not esbuild).

JavaScript cannot be unloaded. The loader only reclaims what you register (or what `api.ui.inject` / `api.ui.overlays.register` auto-track):

```ts
import { onDispose } from "@modkit/debug";

const stop = api.ui.inject("my-panel", render);
onDispose(stop);
onDispose(() => clearInterval(timer));
```

| Change                                                 | Result                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| Local `main.js` with dispose / tracked inject/overlay  | Dispose, then evaluate the new source                           |
| Local `main.js` with no dispose                        | **If hot reload cannot run** (skip / eval anyway / page reload) |
| `patches.json`, `modinfo.json`, declared `workerEntry` | Toast: restart the game (page reload is not enough)             |
| Workshop mod files                                     | Ignored                                                         |

A monkey-patch or a trigger with no unregister path stays until the game restarts.

Free **`reloaded`** is true when this script body is running because a reload evaluated a new `main.js`. Use it to skip one-shot boot work (toasts, DevTools, auto-load). The loader patch defines that binding. Release builds define it as `false`.

## File logging (`console`)

All builds inject [`modkit/internal/esbuild/console.ts`](../../modkit/internal/esbuild/console.ts) via esbuild [`inject`](https://esbuild.github.io/api/#inject). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code get a `[modId]` prefix in DevTools. `__MOD_ID__` comes from that mod's `mod.ts` at build time. Debug builds add `console.ts` to the source map `ignoreList` so DevTools and VS Code skip the shim when linking console output and breakpoints to your mod files.

Debug builds also `POST` those lines to `http://127.0.0.1:19147/log` while `npm run dev` is up ([`scripts/dev/log-server.js`](../../scripts/dev/log-server.js)). Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`). Use `createLogger` from `@modkit/log` when you want a custom bracket tag.

A renderer hot reload truncates that file via `POST /log/clear` and calls `console.clear()` so the session starts clean. Use `clearLog(modId)` from `@modkit/log` to clear by hand. `clearLog` aborts after 500 ms if F5 / CDP stalls the POST.

```ts
console.log("my-feature", payload);
// DevTools: [author.hello-world-example] my-feature {…}
// logs/author.hello-world-example.log (debug only): [author.hello-world-example] my-feature {…}
```

The shim uses `globalThis.console` internally so it does not recurse.

## Debug patches

The companion rewrites `js/external-mod-runtime.js`. Definitions live in [`src/debug/patches.ts`](../../src/debug/patches.ts) and are re-exported from `mod.ts`.

| id                           | File                         | Role                                                                |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| `local-mod-compile-reloaded` | `js/external-mod-runtime.js` | Define free `reloaded` and the active mod id in the loader wrapper. |
| `local-mod-registry`         | `js/external-mod-runtime.js` | Publish local mods on `globalThis.__sandkitLocalModRegistry__`.     |
| `local-mod-track-inject`     | `js/external-mod-runtime.js` | Auto-track `ui.inject` unregister functions for hot-eval.           |
| `local-mod-track-overlays`   | `js/external-mod-runtime.js` | Auto-track `ui.overlays.register` unregisters for hot-eval.         |

These loader patches use the same `atomicGroup` (`local-mod-loader`).

Workshop mods are not added to the registry. See [patches.md](../patches.md) for the patch format.

## Files

| Path                                           | Role                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| [`src/debug/`](../../src/debug/)               | Companion: `mod.ts`, `main.ts`, and `patches.ts` at the root                    |
| [`src/debug/boot/`](../../src/debug/boot/)     | Auto-load, DevTools boot, autosave, settings helpers                            |
| [`src/debug/reload/`](../../src/debug/reload/) | Local-mod poll, hot-eval, loader health (`loader-health.ts`)                    |
| [`src/debug/f3/`](../../src/debug/f3/)         | F3 overlay, engine debug sync, built-in sections                                |
| `modkit/internal/debug/index.ts`               | `onDispose` only (bundled in all builds)                                        |
| `modkit/internal/esbuild/debug.empty.ts`       | Unused legacy stub (release builds no longer alias `@modkit/debug` here)        |
| `modkit/internal/esbuild/console.ts`           | esbuild inject: `[modId]` prefix on `console.*`; file POST in debug builds only |

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

The debug companion owns file watching. Release builds define `reloaded` as `false`. All builds bundle real `onDispose` from `@modkit/debug`.
