# Example mods

Copy a folder here to `src/<your-mod>/` when you want that sample. Start a new mod from [`src/template/`](../src/template/). Each leaf folder is a separate game mod.

On **0.5.5+**, prefer Sandkit hooks and `configOverrides` over bundle patches; [`collector-patches`](api/collector-patches/) is the remaining patch-rewrite sample.

Workshop mod references live in `sandustry-workshop-mods/workshop/` (sibling repo).

## UI

| Folder                                       | What it shows                              |
| -------------------------------------------- | ------------------------------------------ |
| [`overlay-hotkey`](ui/overlay-hotkey/)       | React overlay + Tailwind (**Alt+E**)       |
| [`management-button`](ui/management-button/) | Management-column row                      |
| [`input-binding`](ui/input-binding/)         | `api.input.registerBinding` + bound-key UI |

## Content

| Folder                                                | What it shows                                      |
| ----------------------------------------------------- | -------------------------------------------------- |
| [`custom-element`](content/custom-element/)           | `api.elements.register` for one powder             |
| [`collectable-element`](content/collectable-element/) | `collectable.value` on a mod element               |
| [`custom-terrain`](content/custom-terrain/)           | `api.terrains.register` for one terrain            |
| [`element-reaction`](content/element-reaction/)       | `api.reactions.registerContact`                    |
| [`register-structure`](content/register-structure/)   | `api.structures.register` + mod sprite             |
| [`structure-processor`](content/structure-processor/) | `api.structures.processing.register` periodic loop |
| [`mod-assets`](content/mod-assets/)                   | Static `mod/` files + `assets.getUrl`              |

## API

| Folder                                        | What it shows                              |
| --------------------------------------------- | ------------------------------------------ |
| [`events`](api/events/)                       | `api.events.on("game:ready")`              |
| [`triggers-interval`](api/triggers-interval/) | `api.triggers.register` repeating callback |
| [`hooks-intercept`](api/hooks-intercept/)     | `api.hooks.intercept` + `context.cancel()` |
| [`schedule-idle`](api/schedule-idle/)         | `schedule.nextTick` + `grid.mutate`        |
| [`i18n`](api/i18n/)                           | `api.i18n.register` + `i18n.t`             |
| [`storage`](api/storage/)                     | `api.storage.ensure` in the save file      |
| [`sprites`](api/sprites/)                     | `api.sprites.loadFromMod` + `getById`      |
| [`ui-prompt`](api/ui-prompt/)                 | `api.ui.prompt` text dialog                |
| [`signal-target`](api/signal-target/)         | `api.signals.targets.register`             |
| [`player-teleport`](api/player-teleport/)     | `api.player.setPositionAtWorld`            |
| [`collector-patches`](api/collector-patches/) | Collector admission patches (`patches.ts`) |
| [`worker-api`](api/worker-api/)               | Worker-thread `sandkit.api`                |
| [`settings`](api/settings/)                   | All `configSchema` field types             |

## Games

| Folder                            | What it shows      |
| --------------------------------- | ------------------ |
| [`retro-game`](games/retro-game/) | Retro Console demo |

The hot-reload companion docs live under [`../docs/hot-reload/`](../docs/hot-reload/) (debug install / release staging). Do not copy that mod as a starting sample.

Live tests (`*.live.test.ts`) run with `npm run test:integration`. Samples: `api/player-teleport`, `api/i18n`, `api/storage`, `api/events`, `ui/overlay-hotkey`.
