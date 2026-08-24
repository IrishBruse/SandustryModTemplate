# Folder layout

This page lists the folders you use when you write a mod.

Each `src/<name>/` or `examples/<name>/` folder with a `mod.ts` is one game mod.
Put shared code in `modkit/`.
Do not import files from another mod folder (in `src/` or `examples/`).

New to the template? Start with [Quick start](quick-start.md).

## Repo folders

| Path               | What it is                                   |
| ------------------ | -------------------------------------------- |
| `src/<name>/`      | Your mod (`mod.ts` + `main.ts`)              |
| `examples/<name>/` | Sample mods to copy into `src/`              |
| `modkit/`          | Shared kit. Import as `@modkit/*`            |
| `dist/`            | Link to the Sandustry mods folder on disk    |
| `build/<name>/`    | Workshop staging (copied on `npm run build`) |
| `logs/`            | Link to Sandustry log files                  |

The game folder uses the `name` field in `mod.ts`, not the repo folder name.
`dist/` points at the OS mods folder. Each built mod lives at `dist/<modinfo.name>/`.

You do not copy files into the game folder by hand. `npm run dev` and `npm run build` write them.

## Game folders on disk

| OS      | Mods                                      | Logs                       |
| ------- | ----------------------------------------- | -------------------------- |
| Linux   | `~/.config/sandustry/mods/<modinfo.name>` | `~/.config/sandustry/logs` |
| Windows | `%APPDATA%\sandustry\mods\<modinfo.name>` | `%APPDATA%\sandustry\logs` |

## Sample mods

Copy a folder from [`examples/`](../examples/) into `src/<your-mod>/`. [`hello-world`](../examples/hello-world/) is the smallest.

| Group   | Folder                                                    | What it shows                                              |
| ------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| —       | [`hello-world`](../examples/hello-world/)                 | Toast on load — good copy target                           |
| UI      | [`overlay-hotkey`](../examples/ui/overlay-hotkey/)        | React overlay + Tailwind (**Alt+E**)                       |
| UI      | [`management-button`](../examples/ui/management-button/)  | Management-column row                                      |
| UI      | [`input-binding`](../examples/ui/input-binding/)          | `registerBinding` + `getDisplayKey`                        |
| Content | [`custom-element`](../examples/content/custom-element/)   | Register an element and paint at the mouse cell            |
| Content | [`mod-assets`](../examples/content/mod-assets/)           | Static `mod/` files + `assets.getUrl`                      |
| Content | [`content-machine`](../examples/content/content-machine/) | Elements + structure + processor loop                      |
| API     | [`events`](../examples/api/events/)                       | `api.events.on` subscribe and dispose                      |
| API     | [`worker-api`](../examples/api/worker-api/)               | Worker-thread `sandkit.api`                                |
| API     | [`settings`](../examples/api/settings/)                   | All `configSchema` types (`boolean` / `number` / `choice`) |
| Games   | [`retro-game`](../examples/games/retro-game/)             | Retro Console demo                                         |

Shipped mods in `src/` (not copy targets for new mods):

| Folder                                           | What it shows                                       |
| ------------------------------------------------ | --------------------------------------------------- |
| [`selection-capture`](../src/selection-capture/) | Screenshot / GIF recorder (**C**, **F7**)           |
| [`survival-mode`](../src/survival-mode/)         | Health HUD, grounded walking, step-up on inclines   |
| [`debug`](../src/debug/)                         | Dev companion (debug builds only). Do not copy this |

## Files in a mod folder

Every mod under `src/<name>/` or `examples/<name>/` needs these files:

| File            | Role                                                                                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mod.ts`        | Manifest. Optional `patches` export (or re-export from `patches.ts`). `export const modinfo = defineModInfo(...)`. Use `modinfo.id` for the mod id. The build writes `modinfo.json` and `patches.json` |
| `main.ts`       | Mod entry. Debug builds get free `reloaded` from the debug companion loader patch. Release defines `reloaded` as `false`                                                                                 |
| `tsconfig.json` | Isolated TypeScript project. This folder cannot see sibling mods                                                                                                                                         |

Keep extra TypeScript out of the mod root. Only `mod.ts`, `main.ts`, optional `worker.ts`, and optional `patches.ts` may sit next to `tsconfig.json`. Put other source files in feature folders (`ui/`, `health/`, `capture/`, …).

Add these when you need them:

| File                         | Role                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `worker.ts`                  | Worker entry at the mod root. The build writes `worker.js`                                          |
| `patches.ts`                 | Optional patch list. Re-export `patches` from `mod.ts`. The debug companion uses this.              |
| `ui/`                        | React overlays                                                                                      |
| Feature folders              | Other source files (`health/`, `capture/`, …). Keep tests next to the file they test               |
| `mod/`                       | Static files copied into the output folder                                                          |
| `package.json`               | npm packages for this mod only                                                                      |
| `README.md` / `CHANGELOG.md` | Repo docs only. Publish reads `CHANGELOG.md` for Steam change notes; builds do not copy these files |
| `workshop/`                  | Workshop assets (`workshop.json`, previews, `workshop.txt`, `screenshots/`)                         |

## What you import

Import `@modkit/*` and files in your own folder only.

| Import                                        | From                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `@modkit/modinfo`                             | `defineModInfo` / `definePatches`                                                   |
| `@modkit/react` / JSX                         | Runtime React from `sandkit.react`                                                  |
| `@modkit/debug`                               | `onDispose` (bundled in all builds). Free `reloaded` comes from the debug companion |
| `@modkit/utils`                               | `safe`, `isEnabled`, `inGame`, `registerRetroGame`                                  |
| `@modkit/ui`                                  | Shared React UI components                                                          |
| `sandkit` / `SandkitApi` / `WorkerSandkitApi` | Ambient globals. Do not import with a `types/` prefix                               |

Sandkit API types live in `modkit/types/`. Layout mirrors the live object (`sandkit/api`, `sandkit/engine/api`, …). Ambient `sandkit` is in [`modkit/types/global.d.ts`](../modkit/types/global.d.ts); `reloaded` and `WorkerSandkitApi` are in [`modkit/ambient.d.ts`](../modkit/ambient.d.ts).

Commands and build output: [Builds](builds.md).
