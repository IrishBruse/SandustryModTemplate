# Debug companion

Session debug helpers live in the **debug** companion mod ([`src/hot-reload/`](../../src/hot-reload/)). The game folder name is **`hot-reload`** (`mods/hot-reload`, from `modinfo.id`). Debug builds install it to the OS mods folder. `npm run build` stages a release bundle under `build/hot-reload/`. Manifest **`loadOrder`** is `-2147483648` so this companion runs before other local mods.

This companion does **not** reload other mods in game. `npm run dev` rebuilds `main.js` on disk. Restart the game to load that bundle.

Call `isEnabled` yourself when a mod must respect **Mod enabled**. The build wraps the main entry in `try` / `catch` and logs failures with `console.error`. See [utils.md](utils.md).

## When it is installed

| Build         | Command                                       | `src/hot-reload` mod          | `@modkit/debug`                | `debugPatches` |
| ------------- | --------------------------------------------- | ----------------------------- | ------------------------------ | -------------- |
| Release       | `npm run build`                               | Staged (`build/hot-reload/`)  | Bundled (`onDispose` registry) | Omitted        |
| Dev           | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/hot-reload`) | Bundled                        | Included       |
| Release watch | `npm run dev:release` / `--no-debug`          | Not installed                 | Release stubs                  | Omitted        |

`--mod template` on a debug build still installs **hot-reload**. `--mod hot-reload` builds only that folder. `npm run publish` never lists the companion.

`__MOD_DEBUG__` is `true` in dev builds and `false` in release.

Import `onDispose` from [`@modkit/debug`](../../modkit/internal/debug/) for extra cleanup when a reload wrap is present. Without that wrap, `onDispose` does nothing.

## Companion settings

Settings live on the debug mod only (`src/hot-reload/modinfo.ts` `configSchema`). Open **Options → Mods → hot-reload**.

| Setting                   | Key               | Default     | Effect                                                                                                                                        |
| ------------------------- | ----------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mod enabled**           | `enabled`         | on          | Master switch for runtime helpers                                                                                                             |
| **Open DevTools on load** | `openDevTools`    | off         | Open Electron DevTools on load. Keep off under F5 so the IDE debugger stays attached                                                          |
| **F12 opens DevTools**    | `f12DevTools`     | off         | Capture-phase F12. Can disconnect an IDE debugger session                                                                                     |
| **Auto-load save**        | `autoLoad`        | off         | On load, `location.assign` with `?db_load=<saveId>`. Skips splash and main menu. Legacy `autoBoot` prefs still count until you set `autoLoad` |
| **Start save**            | `startSave`       | Mod storage | **Last played** or **Mod storage**. **Mod storage** reads `api.storage` (`startSave`). Set the id from DevTools or another mod.               |
| **F3 debug overlay**      | `f3Debug`         | off         | F3 toggles companion debug overlay. Vanilla Debug / Stats stay on while the mod is enabled                                                    |
| **Disable autosave**      | `disableAutosave` | off         | Sets `session.settings.autosaveInterval` to `0`. Manual saves still work                                                                      |

Turn on **Auto-load save**, **F3 debug overlay**, **Disable autosave**, **F12**, or **Open DevTools on load** when you want those helpers.

## Features

| Feature               | Where                                                                                                                                   | Setting                | Notes                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| DevTools globals      | [`src/hot-reload/main.ts`](../../src/hot-reload/main.ts)                                                                                | Mod enabled            | `sandkit`, `api`, `enums`, `react` on `globalThis`                                  |
| Open DevTools on load | [`boot/boot-menu.ts`](../../src/hot-reload/boot/boot-menu.ts)                                                                           | Open DevTools          | Retries until the Electron bridge is ready. Keep off under F5                       |
| F12 opens DevTools    | [`boot/boot-menu.ts`](../../src/hot-reload/boot/boot-menu.ts)                                                                           | F12                    | Capture-phase keydown                                                               |
| Auto-load save        | [`boot/boot-menu.ts`](../../src/hot-reload/boot/boot-menu.ts) + [`boot/auto-load-save.ts`](../../src/hot-reload/boot/auto-load-save.ts) | Auto-load + Start save | Reloads with `?db_load=` for the **Start save** pick                                |
| Disable autosave      | [`boot/autosave.ts`](../../src/hot-reload/boot/autosave.ts)                                                                             | Disable autosave       | Sets interval to `0` on load                                                        |
| F3 debug overlay      | [`f3/F3DebugOverlay.tsx`](../../src/hot-reload/f3/F3DebugOverlay.tsx)                                                                   | F3 debug overlay       | Minecraft-style text HUD; extensible via `registerF3Section` / `globalThis.debugF3` |
| Mod Inspector         | [`mod-inspector/`](../../src/hot-reload/mod-inspector/)                                                                                 | Mod enabled            | Pause menu **Mods** (under **Options**) opens a blank panel. Esc closes             |

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

If that value is missing or the save is gone, auto-load falls back to last played.

It does nothing when:

- The URL already has a boot query (`db_load`, `new_game`, `load`, …)
- The session is already in-game
- There is no resolvable save
- Auto-load already ran this browser session (for example after you exit to the main menu and the page reloads)

## F3 debug overlay

When **F3 debug overlay** is on, **F3** toggles a Minecraft-style text overlay (monospace, white with shadow). Built-in sections show **Player** world/cell position and **Mouse** cell/world position while in-game. Vanilla Debug / Stats stay on while the debug companion is enabled.

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

## File logging (`console`)

All builds inject [`modkit/internal/esbuild/console.ts`](../../modkit/internal/esbuild/console.ts) via esbuild [`inject`](https://esbuild.github.io/api/#inject). Bare `console.log` / `info` / `warn` / `error` / `debug` in mod code get a `[modId]` prefix in DevTools. `__MOD_ID__` comes from that mod's `modinfo.ts` at build time. Debug builds add `console.ts` to the source map `ignoreList` so DevTools and VS Code skip the shim when linking console output and breakpoints to your mod files.

Debug builds also `POST` those lines to `http://127.0.0.1:19147/log` while `npm run dev` is up ([`scripts/dev/log-server.js`](../../scripts/dev/log-server.js)). Lines append to `logs/<modinfo.id>.log` (workspace `logs/` → OS sandustry logs: `~/.config/sandustry/logs` or `%APPDATA%/sandustry/logs`). Use `createLogger` from `@modkit/log` when you want a custom bracket tag.

Use `clearLog(modId)` from `@modkit/log` to clear a log file by hand. `clearLog` aborts after 500 ms if F5 / CDP stalls the POST.

```ts
console.log("my-feature", payload);
// DevTools: [author.template] my-feature {…}
// logs/author.template.log (debug only): [author.template] my-feature {…}
```

The shim uses `globalThis.console` internally so it does not recurse.

## Files

| Path                                                 | Role                                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`src/hot-reload/`](../../src/hot-reload/)           | Companion: `modinfo.ts` and `main.ts` at the root                               |
| [`src/hot-reload/boot/`](../../src/hot-reload/boot/) | Auto-load, DevTools boot, autosave, settings helpers                            |
| [`src/hot-reload/f3/`](../../src/hot-reload/f3/)     | F3 overlay, engine debug sync, built-in sections                                |
| `modkit/internal/debug/index.ts`                     | `onDispose` (no-op until a reload wrap sets the active mod id)                  |
| `modkit/internal/esbuild/debug.empty.ts`             | Unused legacy stub                                                              |
| `modkit/internal/esbuild/console.ts`                 | esbuild inject: `[modId]` prefix on `console.*`; file POST in debug builds only |

## Wiring

```ts
// src/template/main.ts
const api = sandkit.api;
api.ui.toast("Template loaded", {});
```
