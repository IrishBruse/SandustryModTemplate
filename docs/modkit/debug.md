# Debug companion and hot reload

Session debug helpers live in the **debug** companion mod ([`src/debug/`](../../src/debug/)). The game folder name is **debug** (`mods/debug`). Debug builds install it. Release builds omit it and remove a leftover `mods/debug`.

The main **debug** bundle injects [`modkit/internal/esbuild/hot-reload.inject.ts`](../../modkit/internal/esbuild/hot-reload.inject.ts): it calls `installHotReload` and exposes free **`reloaded`**. Release builds omit that inject and define **`reloaded`** as `false`. Import `onDispose` from [`@modkit/debug`](../../modkit/internal/debug/) when you need cleanup. Release stubs `@modkit/debug` to [`modkit/internal/esbuild/debug.empty.ts`](../../modkit/internal/esbuild/debug.empty.ts).

The same main-entry rewrite also skips the entry body when **`enabled`** is false (`isEnabled`). Do not add that guard in `main.ts`. See [utils.md](utils.md).

## When it is installed

| Build   | Command                                       | `src/debug` mod            | `@modkit/debug`                                 | `debugPatches` |
| ------- | --------------------------------------------- | -------------------------- | ----------------------------------------------- | -------------- |
| Release | `npm run build`                               | Omitted (leftover removed) | Stub (`modkit/internal/esbuild/debug.empty.ts`) | Omitted        |
| Dev     | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/debug`)   | Bundled (inject boots `installHotReload`)       | Included       |

`--mod hello-world-example` on a debug build still installs **debug**. `--mod debug` builds only that folder. `npm run publish` never lists the companion.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Do not call `installHotReload` or `isHotReloadEval` in `main.ts` — inject does that. Use free `reloaded` to skip one-shot boot work. Import `onDispose` from `@modkit/debug` when you need cleanup.

## Companion settings

Settings live on the debug mod only (`src/debug/mod.ts` `configSchema`). Open **Options → Mods → debug**.

| Setting                   | Key               | Default | Effect                                                                                                                                                                                      |
| ------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mod enabled**           | `enabled`         | on      | Master switch for runtime helpers                                                                                                                                                           |
| **Open DevTools on load** | `openDevTools`    | off     | Open Electron DevTools on load. Keep off under F5 so the IDE debugger stays attached                                                                                                        |
| **F12 opens DevTools**    | `f12DevTools`     | on      | Capture-phase F12. Can disconnect an IDE debugger session                                                                                                                                   |
| **Auto-load save**        | `autoLoad`        | on      | On load, `location.assign` with `?db_load=<saveId>`. Skips splash and main menu. Legacy `autoBoot` prefs still count until you set `autoLoad`                                               |
| **Start save**            | `startSave`       | Last played | Which save to load. Dropdown lists local saves via a bundle patch (`electron.getSaveFiles`). Stored in mod settings |
| **Engine debug**          | `engineDebug`     | on      | Force `debug.active` (vanilla Debug / Stats). F3 toggles companion debug overlay                                                                                                            |
| **Disable autosave**      | `disableAutosave` | on      | Sets `session.settings.autosaveInterval` to `0`. Manual saves still work                                                                                                                    |

Turn on **Auto-load save** or **Open DevTools on load** when you want those helpers.

## Features

| Feature               | Where                                                                              | Setting          | Notes                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| DevTools globals      | [`src/debug/main.ts`](../../src/debug/main.ts)                                     | Mod enabled      | `sandkit`, `api`, `enums`, `react` on `globalThis`                                                 |
| Open DevTools on load | [`boot-menu.ts`](../../src/debug/boot-menu.ts)                                     | Open DevTools    | Retries until the Electron bridge is ready. Keep off under F5                                      |
| F12 opens DevTools    | [`boot-menu.ts`](../../src/debug/boot-menu.ts)                                     | F12              | Capture-phase keydown; skipped on hot-reload eval                                                  |
| Auto-load save        | [`boot-menu.ts`](../../src/debug/boot-menu.ts) + [`auto-load-save.ts`](../../src/debug/auto-load-save.ts) | Auto-load + Start save | Reloads with `?db_load=` for the **Start save** pick |
| Start save picker     | [`src/debug/mod.ts`](../../src/debug/mod.ts) `patches`                             | Start save       | Bundle patch fills the mod-settings dropdown from `electron.getSaveFiles`                          |
| Disable autosave      | [`autosave.ts`](../../src/debug/autosave.ts)                                       | Disable autosave | Sets interval to `0` on load and each hot-reload eval                                              |
| Renderer hot reload   | [`modkit/internal/debug/hot-reload.ts`](../../modkit/internal/debug/hot-reload.ts) | `npm run dev`    | Polls `GET /hot-reload/last` on the dev watch server                                               |
| Options Debug tab     | [`src/debug/mod.ts`](../../src/debug/mod.ts) `patches`                             | Mod installed    | Bundle patch adds the hidden **Debug** tab to Options (Debug Active, Draw Chunks, Cinematic, etc.) |
| F3 debug overlay      | [`src/debug/toggle/F3DebugOverlay.tsx`](../../src/debug/toggle/F3DebugOverlay.tsx) | Engine debug     | Minecraft-style text HUD; extensible via `registerF3Section` / `globalThis.debugF3`              |

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

**Start save** is a normal mod setting (`startSave`). The dropdown lists local saves through bundle patches on the Options → Mods renderer. **Last played** uses the same source as Continue (`getLastPlayedGameSync` / `localStorage.lastPlayedGame`).

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

Hot reload runs only with **`npm run dev`**. That watch build starts a dev server on `http://127.0.0.1:19147`. Each mod (via inject) polls **`GET /hot-reload/last`** every ~400 ms. When the notify counter changes, the rebuilt mod re-reads `main.js` (retries if the game still has the old file), clears `logs/<modinfo.id>.log` and the DevTools console, runs `onDispose` callbacks, and evaluates the new source with `new Function("sandkit", source)`. In the watch terminal, **Ctrl+R** forces the same path even when `main.js` has not changed.

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
| Mod folder removed while the game is still open        | Stop polling; one quiet log line      |

A monkey-patch or a trigger with no unregister path stays until the game restarts.

Free **`reloaded`** is true when this script body is running because a reload evaluated a new `main.js`. Use it to skip one-shot boot work (toasts, DevTools, auto-load).

## File logging (`console`)

Debug builds use esbuild [`inject`](https://esbuild.github.io/api/#inject) with [`modkit/internal/esbuild/console.ts`](../../modkit/internal/esbuild/console.ts). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code also `POST` to `http://127.0.0.1:19147/log` while `npm run dev` is up. Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`). Tag messages yourself or use `createLogger` from `@modkit/log` when you want a bracket prefix.

A renderer hot reload (save or **Ctrl+R**) truncates that file via `POST /log/clear` and calls `console.clear()` so the session starts clean. Use `clearLog(modId)` from `@modkit/log` to clear by hand. `clearLog` aborts after 500 ms if F5 / CDP stalls the POST.

```ts
console.log("my-feature", payload);
// DevTools: my-feature {…}
// logs/author.hello-world-example.log: [log] my-feature {…}
```

Release builds skip the inject. The shim uses `globalThis.console` so it does not recurse. `__MOD_ID__` is defined from that mod's `mod.ts` at build time.

## Debug patches

The debug mod ships production patches in `patches` (Options Debug tab, dynamic **Start save** dropdown). See [patches.md](../patches.md).

## Files

| Path                                           | Role                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| [`src/debug/`](../../src/debug/)               | Companion mod: DevTools, auto-load, settings, bundle patches               |
| `modkit/internal/debug/index.ts`               | Re-exports `installHotReload`, `onDispose`, `isHotReloadEval`              |
| `modkit/internal/debug/hot-reload.ts`          | Poll `GET /hot-reload/last`, `onDispose`, `isHotReloadEval`                |
| `modkit/internal/esbuild/debug.empty.ts`       | Release stub: no-op `installHotReload`, `onDispose`, `isHotReloadEval`     |
| `modkit/internal/esbuild/hot-reload.inject.ts` | esbuild inject: boot hot reload + free `reloaded` (debug main builds only) |
| `modkit/internal/esbuild/console.ts`           | esbuild inject: mirror `console.*` to watch-server file log (debug builds) |

## Wiring

```ts
// src/hello-world-example/main.ts — debug inject boots hot reload and sets `reloaded`
import { onDispose } from "@modkit/debug"; // only when you need cleanup

const api = sandkit.api;
if (!reloaded) {
  /* one-shot boot work */
}
onDispose(() => {
  /* unregister */
});
```

| Path                                           | Role                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `modkit/internal/esbuild/hot-reload.inject.ts` | esbuild inject: `installHotReload` + free `reloaded` (debug only) |
| `modkit/internal/debug/index.ts`               | Re-exports `installHotReload`, `onDispose`, `isHotReloadEval`     |
| `modkit/internal/esbuild/debug.empty.ts`       | Release stub: no-op `installHotReload` / `onDispose`              |

Release builds omit the hot-reload inject and define `reloaded` as `false`. They still resolve `@modkit/debug` to `modkit/internal/esbuild/debug.empty.ts` when a mod imports `onDispose`.
