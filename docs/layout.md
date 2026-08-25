# Folder layout

This page lists the folders you use when you write a mod.

Each `src/<name>/` or `examples/<name>/` folder with a `modinfo.ts` is one game mod.
Put shared code in `modkit/`.
Do not import files from another mod folder (in `src/` or `examples/`).

New to the template? Start with [Quick start](quick-start.md).

## Repo folders

| Path                  | What it is                                   |
| --------------------- | -------------------------------------------- |
| `src/<name>/`         | Your mod (`modinfo.ts` + `main.ts`)          |
| `examples/<name>/`    | Sample mods to copy into `src/`              |
| `modkit/`             | Shared kit. Import as `@modkit/*`            |
| `dist/`               | Link to the Sandustry mods folder on disk    |
| `build/<modinfo.id>/` | Workshop staging (copied on `npm run build`) |
| `logs/`               | Link to Sandustry log files                  |

The game folder and Workshop staging use the `id` field in `modinfo.ts`, not the repo folder name or display `name`.
`dist/` points at the OS mods folder. Each built mod lives at `dist/<modinfo.id>/`. Release staging is `build/<modinfo.id>/`.

You do not copy files into the game folder by hand. `npm run dev` and `npm run build` write them.

## Game folders on disk

| OS      | Mods                                    | Logs                       |
| ------- | --------------------------------------- | -------------------------- |
| Linux   | `~/.config/sandustry/mods/<modinfo.id>` | `~/.config/sandustry/logs` |
| Windows | `%APPDATA%\sandustry\mods\<modinfo.id>` | `%APPDATA%\sandustry\logs` |

## Sample mods

Start from [`src/template/`](../src/template/). Copy a folder from [`examples/`](../examples/) into `src/<your-mod>/` when you want that sample.

| Group   | Folder                                                    | What it shows                                              |
| ------- | --------------------------------------------------------- | ---------------------------------------------------------- |
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

Mods in `src/`:

| Folder                             | What it shows                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| [`template`](../src/template/)     | Starter mod. Toast on load. Change `id` / `name` / `author` in `modinfo.ts`   |
| [`hot-reload`](../src/hot-reload/) | Dev companion. Debug installs it; `npm run build` stages it. Do not copy this |

## Files in a mod folder

Every mod under `src/<name>/` or `examples/<name>/` needs these files:

| File            | Role                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `modinfo.ts`    | Manifest. Optional `patches` export (or re-export from `patches.ts`). `export const modinfo = defineModInfo(...)`. Use `modinfo.id` for the mod id. The build writes `modinfo.json` and `patches.json` |
| `main.ts`       | Mod entry                                                                                                                                                                                              |
| `tsconfig.json` | Isolated TypeScript project. This folder cannot see sibling mods                                                                                                                                       |

Keep extra TypeScript out of the mod root. Only `modinfo.ts`, `main.ts`, optional `worker.ts`, and optional `patches.ts` may sit next to `tsconfig.json`. Put other source files in feature folders (`ui/`, `health/`, `capture/`, …).

Add these when you need them:

| File                         | Role                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `worker.ts`                  | Worker entry at the mod root. The build writes `worker.js`                                          |
| `patches.ts`                 | Optional patch list. Re-export `patches` from `modinfo.ts`.                                         |
| `ui/`                        | React overlays                                                                                      |
| Feature folders              | Other source files (`health/`, `capture/`, …). Keep tests next to the file they test                |
| `mod/`                       | Static files copied into the output folder                                                          |
| `package.json`               | Optional. npm packages for this mod only. Run `npm install` in that folder yourself                 |
| `README.md` / `CHANGELOG.md` | Repo docs only. Publish reads `CHANGELOG.md` for Steam change notes; builds do not copy these files |
| `workshop/`                  | Workshop assets (`workshop.json`, previews, `workshop.md`, `screenshots/`)                          |

## What you import

Import `@modkit/*` and files in your own folder only.

| Import                                        | From                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| `@modkit/modinfo`                             | `defineModInfo` / `definePatches`                                               |
| `@modkit/react` / JSX                         | Runtime React from `sandkit.react`                                              |
| `@modkit/debug`                               | `onDispose` for extra cleanup. No-op until a reload wrap sets the active mod id |
| `@modkit/utils`                               | `safe`, `isEnabled`, `inGame`, `registerRetroGame`                              |
| `@modkit/ui`                                  | Shared React UI components                                                      |
| `sandkit` / `SandkitApi` / `WorkerSandkitApi` | Ambient globals. Do not import with a `types/` prefix                           |

Sandkit API types live in `modkit/types/`. Layout mirrors the live object (`sandkit/api`, `sandkit/engine/api`, …). Ambient `sandkit` is in [`modkit/types/global.d.ts`](../modkit/types/global.d.ts); `WorkerSandkitApi` is in [`modkit/ambient.d.ts`](../modkit/ambient.d.ts).

Commands and build output: [Builds](builds.md).
