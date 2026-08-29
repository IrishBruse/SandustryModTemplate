# Folder layout

This page lists the folders you use when you write a mod.

Each `src/<name>/`, `mods/<name>/`, or `examples/<name>/` folder with a `modinfo.json` is one game mod.
Put shared code in `modkit/`.
Do not import files from another mod folder (in `src/`, `mods/`, or `examples/`).

New to the template? Start with [Quick start](quick-start.md).

## Repo folders

| Path                  | What it is                                   |
| --------------------- | -------------------------------------------- |
| `src/<name>/`         | Your mod (`modinfo.json` + `main.ts`)        |
| `mods/<name>/`        | Optional private mods (gitignored worktree)  |
| `examples/<name>/`    | Sample mods to copy into `src/`              |
| `modkit/`             | Shared kit. Import as `@modkit/*`            |
| `dist/`               | Link to the Sandustry mods folder on disk    |
| `build/<modinfo.id>/` | Workshop staging (copied on `npm run build`) |
| `logs/`               | Link to Sandustry log files                  |

`mods/` is optional. On this repo it is a gitignored worktree of branch `irishbruse-mods`, whose tree root is only mod folders. `main` does not track it. Same `modinfo` rules as `src/`. `npm run build`, `npm run dev`, and `npm run publish` include it.

The game folder and Workshop staging use the `id` field in `modinfo.json`, not the repo folder name or display `name`.
`dist/` points at the OS mods folder. Each built mod lives at `dist/<modinfo.id>/`. Release staging is `build/<modinfo.id>/`.

You do not copy files into the game folder by hand. `npm run dev` and `npm run build` write them.

## Game folders on disk

| OS      | Mods                                    | Logs                       |
| ------- | --------------------------------------- | -------------------------- |
| Linux   | `~/.config/sandustry/mods/<modinfo.id>` | `~/.config/sandustry/logs` |
| Windows | `%APPDATA%\sandustry\mods\<modinfo.id>` | `%APPDATA%\sandustry\logs` |

## Sample mods

Start from [`src/template/`](../src/template/). Copy a folder from [`examples/`](../examples/) into `src/<your-mod>/` when you want that sample.

On **0.5.5+**, prefer Sandkit hooks and `configOverrides` over bundle patches; [`collector-patches`](../examples/api/collector-patches/) is the remaining patch-rewrite sample.

| Group   | Folder                                                            | What it shows                                              |
| ------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| UI      | [`overlay-hotkey`](../examples/ui/overlay-hotkey/)                | React overlay + Tailwind (**Alt+E**)                       |
| UI      | [`management-button`](../examples/ui/management-button/)          | Management-column row                                      |
| UI      | [`input-binding`](../examples/ui/input-binding/)                  | `registerBinding` + `getDisplayKey`                        |
| Content | [`custom-element`](../examples/content/custom-element/)           | `api.elements.register` for one powder                     |
| Content | [`collector-element`](../examples/content/collector-element/)     | Platinum + Collector admission patches                     |
| Content | [`custom-terrain`](../examples/content/custom-terrain/)           | `api.terrains.register` for one terrain                    |
| Content | [`element-reaction`](../examples/content/element-reaction/)       | `api.reactions.registerContact`                            |
| Content | [`register-structure`](../examples/content/register-structure/)   | `api.structures.register` + mod sprite                     |
| Content | [`structure-processor`](../examples/content/structure-processor/) | `api.structures.processing.register` periodic loop         |
| Content | [`mod-assets`](../examples/content/mod-assets/)                   | Static `mod/` files + `assets.getUrl`                      |
| API     | [`events`](../examples/api/events/)                               | `api.events.on("game:ready")`                              |
| API     | [`triggers-interval`](../examples/api/triggers-interval/)         | `api.triggers.register` repeating callback                 |
| API     | [`hooks-intercept`](../examples/api/hooks-intercept/)             | `api.hooks.intercept` + `context.cancel()`                 |
| API     | [`schedule-idle`](../examples/api/schedule-idle/)                 | `schedule.nextTick` + `grid.mutate`                        |
| API     | [`i18n`](../examples/api/i18n/)                                   | `api.i18n.register` + `i18n.t`                             |
| API     | [`storage`](../examples/api/storage/)                             | `api.storage.ensure` in the save file                      |
| API     | [`sprites`](../examples/api/sprites/)                             | `api.sprites.loadFromMod` + `getById`                      |
| API     | [`ui-prompt`](../examples/api/ui-prompt/)                         | `api.ui.prompt` text dialog                                |
| API     | [`signal-target`](../examples/api/signal-target/)                 | `api.signals.targets.register`                             |
| API     | [`player-teleport`](../examples/api/player-teleport/)             | `api.player.setPositionAtWorld`                            |
| API     | [`collector-patches`](../examples/api/collector-patches/)         | Collector admission patches                                |
| API     | [`worker-api`](../examples/api/worker-api/)                       | Worker-thread `sandkit.api`                                |
| API     | [`settings`](../examples/api/settings/)                           | All `configSchema` types (`boolean` / `number` / `choice`) |
| Games   | [`retro-game`](../examples/games/retro-game/)                     | Retro Console demo                                         |

Mods in `src/`:

| Folder                         | What it shows                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------- |
| [`template`](../src/template/) | Starter mod. Toast on load. Change `id` / `name` / `author` in `modinfo.json` |
| [`dev-tools`](dev-tools/)      | Dev companion. Debug installs it; `npm run build` stages it. Do not copy this |

## Files in a mod folder

Every mod under `src/<name>/`, `mods/<name>/`, or `examples/<name>/` needs these files:

| File            | Role                                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| `modinfo.json`  | JSON manifest with `$schema` for IDE validation. See [Mod manifest](modinfo.md)       |
| `modinfo.ts`    | TypeScript manifest (`defineModInfo` or `modinfoFromJson`). Optional patch re-exports |
| `main.ts`       | Mod entry                                                                             |
| `tsconfig.json` | Isolated TypeScript project. This folder cannot see sibling mods                      |

Keep extra TypeScript out of the mod root. Only `modinfo.json` and/or `modinfo.ts`, `main.ts`, optional `worker.ts`, and optional `patches.json` / `patches.ts` may sit next to `tsconfig.json`. Put other source files in feature folders (`ui/`, `health/`, `capture/`, …).

Add these when you need them:

| File                         | Role                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| `worker.ts`                  | Worker entry at the mod root. The build writes `worker.js`                                 |
| `patches.json`               | Optional patch list (JSON array). See [Patches](patches.md).                               |
| `patches.ts`                 | Optional patch list (`definePatches`). See [Patches](patches.md).                          |
| `ui/`                        | React overlays                                                                             |
| Feature folders              | Other source files (`health/`, `capture/`, …). Keep tests next to the file they test       |
| `mod/`                       | Static files copied into the output folder                                                 |
| `package.json`               | Optional. npm packages for this mod only. Run `npm install` in that folder yourself        |
| `docs/`                      | Optional. For site pages, symlink to `docs/<name>/`. Builds do not copy this folder        |
| `README.md` / `CHANGELOG.md` | Short pointer or Steam notes. Publish reads `CHANGELOG.md`; builds do not copy these files |
| `workshop/`                  | Workshop assets (`workshop.json`, previews, `workshop.md`, `screenshots/`)                 |

## What you import

Import `@modkit/*` and files in your own folder only.

| Import                                        | From                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `@modkit/modinfo`                             | `defineModInfo`                                                                          |
| `@modkit/patches`                             | `definePatches` and patch types. Browser stub keeps payloads out of `main.js`            |
| `@modkit/react` / JSX                         | Runtime React from `sandkit.react`                                                       |
| `@modkit/utils`                               | `safe`, `isEnabled`, `inGame`, `registerRetroGame`                                       |
| `@modkit/test`                                | Extracted-game integration tests (CDP `:9224`). Import from `*.integration.test.ts` only |
| `@modkit/ui`                                  | Shared React UI components                                                               |
| `sandkit` / `SandkitApi` / `WorkerSandkitApi` | Ambient globals. Do not import with a `types/` prefix                                    |

Sandkit API types come from [`@sandustry-modding/types`](https://www.npmjs.com/package/@sandustry-modding/types). Browse the reference at [SandustryTypes](https://sandustry-modding.github.io/SandustryTypes/#/). Ambient `sandkit` loads through [`modkit/sandkit.d.ts`](../modkit/sandkit.d.ts) (`/// <reference types="@sandustry-modding/types" />`, listed in `files` in [`tsconfig.mod.json`](../tsconfig.mod.json)). Do not list this package under `compilerOptions.types`. `WorkerSandkitApi` is ambient from the same package. Manifest and patch schemas: `@sandustry-modding/types/configs`. CSS imports (`*.css` as a string) load through [`modkit/css.d.ts`](../modkit/css.d.ts).

Commands and build output: [Builds](builds.md).
