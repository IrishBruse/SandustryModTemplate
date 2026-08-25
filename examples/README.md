# Example mods

Copy a folder here to `src/<your-mod>/` when you want that sample. Start a new mod from [`src/template/`](../src/template/). Each leaf folder is a separate game mod.

## UI

| Folder                                       | What it shows                              |
| -------------------------------------------- | ------------------------------------------ |
| [`overlay-hotkey`](ui/overlay-hotkey/)       | React overlay + Tailwind (**Alt+E**)       |
| [`management-button`](ui/management-button/) | Management-column row                      |
| [`input-binding`](ui/input-binding/)         | `api.input.registerBinding` + bound-key UI |

## Content

| Folder                                            | What it shows                                     |
| ------------------------------------------------- | ------------------------------------------------- |
| [`custom-element`](content/custom-element/)       | Register an element and paint at the mouse cell   |
| [`collector-element`](content/collector-element/) | Collectable element + Collector admission patches |
| [`mod-assets`](content/mod-assets/)               | Static `mod/` files + `assets.getUrl`             |
| [`content-machine`](content/content-machine/)     | Elements + structure + processor loop             |

## API

| Folder                          | What it shows                         |
| ------------------------------- | ------------------------------------- |
| [`events`](api/events/)         | `api.events.on` subscribe and dispose |
| [`worker-api`](api/worker-api/) | Worker-thread `sandkit.api`           |
| [`settings`](api/settings/)     | All `configSchema` field types        |

## Games

| Folder                            | What it shows      |
| --------------------------------- | ------------------ |
| [`retro-game`](games/retro-game/) | Retro Console demo |

The hot-reload companion docs live under [`../docs/hot-reload/`](../docs/hot-reload/) (debug install / release staging). Do not copy that mod as a starting sample.
