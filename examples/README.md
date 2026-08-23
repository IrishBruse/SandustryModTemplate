# Example mods

Copy a folder here to `src/<your-mod>/` when you start a real mod. Each leaf folder is a separate game mod.

[`hello-world`](hello-world/) is the smallest copy target. Other samples are grouped by topic.

## UI

| Folder                                       | What it shows                              |
| -------------------------------------------- | ------------------------------------------ |
| [`overlay-hotkey`](ui/overlay-hotkey/)       | React overlay + Tailwind (**Alt+E**)       |
| [`management-button`](ui/management-button/) | Management-column row                      |
| [`input-binding`](ui/input-binding/)         | `api.input.registerBinding` + bound-key UI |

## Content

| Folder                                        | What it shows                                   |
| --------------------------------------------- | ----------------------------------------------- |
| [`custom-element`](content/custom-element/)   | Register an element and paint at the mouse cell |
| [`mod-assets`](content/mod-assets/)           | Static `mod/` files + `assets.getUrl`           |
| [`content-machine`](content/content-machine/) | Elements + structure + processor loop           |

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

Shipped mods that are not samples live under [`../src/`](../src/): `selection-capture`, `debug` (debug builds only).
