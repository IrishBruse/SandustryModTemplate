# Folder layout

This page lists the folders you use when you write a mod.

Each `src/<name>/` folder with a `mod.ts` is one game mod.
Put shared code in `modkit/`.
Do not import files from another `src/<name>/` folder.

New to the template? Start with [Quick start](quick-start.md).

## Repo folders

| Path            | What it is                                |
| --------------- | ----------------------------------------- |
| `src/<name>/`   | Your mod (`mod.ts` + `main.ts`)           |
| `modkit/`       | Shared kit. Import as `@modkit/*`         |
| `dist/<name>/`  | Link to that mod's folder in the game     |
| `build/<name>/` | Release staging (`npm run build:release`) |
| `logs/`         | Link to Sandustry log files               |

The game folder uses the `name` field in `mod.ts`, not the `src/` folder name.
`dist/<src-folder>/` points at that game folder.

You do not copy files into the game folder by hand. `npm run dev` and `npm run build` write them.

## Game folders on disk

| OS      | Mods                                      | Logs                       |
| ------- | ----------------------------------------- | -------------------------- |
| Linux   | `~/.config/sandustry/mods/<modinfo.name>` | `~/.config/sandustry/logs` |
| Windows | `%APPDATA%\sandustry\mods\<modinfo.name>` | `%APPDATA%\sandustry\logs` |

## Sample mods

Copy a folder under `src/` to start a new mod. `hello-world-example` is the smallest.

| Folder                                                           | What it shows                                       |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| [`hello-world-example`](../src/hello-world-example/)             | Toast on load — good copy target                    |
| [`overlay-hotkey-example`](../src/overlay-hotkey-example/)       | React overlay + Tailwind (**Alt+E**)                |
| [`retro-game-example`](../src/retro-game-example/)               | Retro Console demo                                  |
| [`management-button-example`](../src/management-button-example/) | Management-column row                               |
| [`worker-api-example`](../src/worker-api-example/)               | Worker-thread `sandkit.api`                         |
| [`selection-capture`](../src/selection-capture/)                 | Screenshot / GIF recorder (**C**, **F7**)           |
| [`debug`](../src/debug/)                                         | Dev companion (debug builds only). Do not copy this |

## Files in `src/<name>/`

Every mod needs these files:

| File            | Role                                                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mod.ts`        | Manifest and optional patches. `export const modinfo = defineModInfo(...)`. Use `modinfo.id` for the mod id. The build writes `modinfo.json` and `patches.json` |
| `main.ts`       | Mod entry. Debug builds inject hot reload; use free `reloaded`. Release defines `reloaded` as `false`                                                           |
| `tsconfig.json` | Isolated TypeScript project. This folder cannot see sibling mods                                                                                                |

Add these when you need them:

| File                         | Role                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `worker.ts`                  | Worker entry. The build writes `worker.js`                                                          |
| `ui/`                        | React overlays                                                                                      |
| `mod/`                       | Static files copied into the output folder                                                          |
| `package.json`               | npm packages for this mod only                                                                      |
| `README.md` / `CHANGELOG.md` | Repo docs only. Publish reads `CHANGELOG.md` for Steam change notes; builds do not copy these files |
| `workshop/`                  | Workshop assets (`workshop.json`, previews, `workshop.txt`, `screenshots/`)                         |

## What you import

Import `@modkit/*` and files in your own folder only.

| Import                                        | From                                                  |
| --------------------------------------------- | ----------------------------------------------------- |
| `@modkit/modinfo`                             | `defineModInfo` / `definePatches`                     |
| `@modkit/react` / JSX                         | Runtime React from `sandkit.react`                    |
| `@modkit/debug`                               | Hot reload (`onDispose`; free `reloaded` on debug builds) |
| `@modkit/utils`                               | `safe`, `isEnabled`, `inGame`, `registerRetroGame`    |
| `@modkit/ui`                                  | Shared React UI components                            |
| `sandkit` / `SandkitApi` / `WorkerSandkitApi` | Ambient globals. Do not import with a `types/` prefix |

Types submodule: [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types) under `modkit/types/`. Ambient names live in [`modkit/sandkit-global.d.ts`](../modkit/sandkit-global.d.ts).

Commands and build output: [Builds](builds.md).
