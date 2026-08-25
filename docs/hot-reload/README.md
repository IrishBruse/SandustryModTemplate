# Hot Reload Dev Tools

Dev companion mod. The game folder name is **`hot-reload`** (`mods/hot-reload`, from `modinfo.id`). Debug builds (`npm run dev`, `--debug`) install it. `npm run build` stages a release bundle under `build/hot-reload/`. `npm run publish` does not list it.

Manifest **`loadOrder`** is `-2147483648` so this companion runs before other local mods.

When **Watch local mods** is on (default), this companion polls other mods' `main.js` and re-evals the renderer bundle after a save. It does not reload itself. Restart the game for `worker.js` and `patches.json`.

Settings live on this mod. Open **Options → Mods → hot-reload**.

## When it is installed

| Build         | Command                                       | This mod                      | `debugPatches` |
| ------------- | --------------------------------------------- | ----------------------------- | -------------- |
| Release       | `npm run build`                               | Staged (`build/hot-reload/`)  | Omitted        |
| Dev           | `npm run dev`, `--watch`, `--game`, `--debug` | Installed (`mods/hot-reload`) | Included       |
| Release watch | `npm run dev:release` / `--no-debug`          | Not installed                 | Omitted        |

`--mod template` on a debug build still installs **hot-reload**. `--mod hot-reload` builds only this folder.

## Settings

| Setting                   | Key               | Default     | Effect                                                                                                                                        |
| ------------------------- | ----------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mod enabled**           | `enabled`         | on          | Master switch for runtime helpers                                                                                                             |
| **Open DevTools on load** | `openDevTools`    | off         | Open Electron DevTools on load. Keep off under F5 so the IDE debugger stays attached                                                          |
| **F12 opens DevTools**    | `f12DevTools`     | off         | Capture-phase F12. Can disconnect an IDE debugger session                                                                                     |
| **Auto-load save**        | `autoLoad`        | off         | On load, `location.assign` with `?db_load=<saveId>`. Skips splash and main menu. Legacy `autoBoot` prefs still count until you set `autoLoad` |
| **Start save**            | `startSave`       | Mod storage | **Last played** or **Mod storage**. **Mod storage** reads `api.storage` (`startSave`). Set the id from DevTools or another mod.               |
| **F3 debug overlay**      | `f3Debug`         | off         | F3 toggles companion debug overlay. Vanilla Debug / Stats stay on while the mod is enabled                                                    |
| **Disable autosave**      | `disableAutosave` | off         | Sets `session.settings.autosaveInterval` to `0`. Manual saves still work                                                                      |
| **Watch local mods**      | `watchLocalMods`  | on          | Poll other mods' `main.js` and re-eval the renderer bundle. Does not reload this companion, workers, or patches                               |

Turn on **Auto-load save**, **F3 debug overlay**, **Disable autosave**, **F12**, or **Open DevTools on load** when you want those helpers. **Watch local mods** is on by default.

## Features

- **DevTools globals** (`main.ts`) — `sandkit`, `api`, `enums`, `react` on `globalThis` when the mod is enabled.
- **Open DevTools on load** (`boot/boot-menu.ts`) — retries until the Electron bridge is ready. Keep off under F5.
- **F12 opens DevTools** (`boot/boot-menu.ts`) — capture-phase keydown.
- **Auto-load save** (`boot/boot-menu.ts`, `boot/auto-load-save.ts`) — reloads with `?db_load=` for the **Start save** pick.
- **Disable autosave** (`boot/autosave.ts`) — sets interval to `0` on load.
- **F3 debug overlay** (`f3/F3DebugOverlay.tsx`) — Minecraft-style text HUD. Extend with `registerF3Section` / `globalThis.debugF3`.
- **Mod Inspector** (`mod-inspector/`) — pause menu **Mods** (under **Options**) opens a blank panel. Esc closes.
- **Watch local mods** (`reload/`) — poll and re-eval other mods' renderer `main.js`.

## DevTools globals

This mod copies the live Sandkit objects onto `globalThis` for the browser console. In TypeScript, `sandkit` is already an ambient free variable. Use that name in mod code. Do not import a value binding. DevTools also gets `api`, `enums`, and `react` on `globalThis`.

- `sandkit`
- `api` (`sandkit.api`)
- `enums`
- `react`

## DevTools

- On first load, `openDevToolsOnStartup` calls `window.electron.openDevTools()` immediately and again at 250 ms, 750 ms, 1500 ms, and 3000 ms when **Open DevTools on load** is on. Opening Electron DevTools on top of an IDE attach drops the debugger. Keep that setting off under F5. Do not fetch `:9222` from the page.
- **F12** still opens Electron DevTools. That can disconnect an IDE CDP session. Prefer the IDE debugger panel when you launched with F5.
- The listener uses capture phase so the game does not swallow the key.

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

When **F3 debug overlay** is on, **F3** toggles a Minecraft-style text overlay. Built-in sections show **Player** world/cell position and **Mouse** cell/world position while in-game. Vanilla Debug / Stats stay on while this mod is enabled.

Add sections from this mod:

```ts
import { registerF3Section } from "../f3/registry";

registerF3Section({
  id: "my-stats",
  title: "My mod",
  lines: () => [{ left: "Foo", right: "42" }],
});
```

After boot, `globalThis.debugF3.registerSection` is the same API for DevTools experiments.

## Watch local mods

When **Watch local mods** is on, the companion polls other mods' `main.js` about twice per second. After `npm run dev` writes a new bundle, it re-evals that renderer entry.

It does not:

- Reload this companion
- Reload `worker.js`
- Re-apply `patches.json`

Restart the game for workers and patches.
