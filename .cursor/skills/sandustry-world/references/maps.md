# `api.maps`

Custom map selection, artifact markers, and session start. Not the in-game simulation grid.

Official: [sandkit.html - api.maps](https://sandustry.com/sandkit.html). Types: `@sandustry-modding/types` `sandkit/api/maps.d.ts`, `shared/api/maps.d.ts`.

## Methods

| Method                   | Role                                         |
| ------------------------ | -------------------------------------------- |
| `getAvailable()`         | Maps the player can start                    |
| `start(mapId)`           | Start custom map (**mutates** session)       |
| `getActive()`            | Current custom map metadata, or `null`       |
| `getArtifactLocations()` | `{ cellX, cellY, name }[]` for map artifacts |

Call `getArtifactLocations()` after `game:ready` when placing UI markers. Live 0.5.5 vanilla save: `[]`, `getActive()` `null`, `getAvailable()` `[]`.

`AvailableMapV1`: `{ id, name?, … }`.

`ActiveMapV1`: optional `deployment`, `spawn`, `topBounds`, `parallax`, `depthLight`, etc.

## Live session

Probe: `store.scene.active` **4** (in-game `Scene` enum). `shared.mapData` keys: `data`, `width`, `height` - procgen / map raster separate from `shared.sim`.

Live shape: `data` is `Uint8Array`, len **58982400** (= 3840 x 3840 x 4 RGBA). Clear per row in void-world batches (**sandustry-mcp** `references/void-world.md`). Background layer details: `background-layers.md`.

Custom map IPC and UI: **sandustry-ui** / **sandustry-internals**; not repeated here.
