# `api.maps`

Custom map selection, artifact markers, and session start. Not the in-game simulation grid.

Official: [sandkit.html - api.maps](https://sandustry.com/sandkit.html). Types: `@sandustry-modding/types` `sandkit/api/maps.d.ts`, `shared/api/maps.d.ts`.

`map.width` / `map.height` in `modinfo.json` are integers from **1** to **3840** (loader `MAX_MAP_DIMENSION`). Campaign / Void saves still allocate **3840 x 3840**. A custom map can be smaller.

## Methods

| Method                   | Role                                         |
| ------------------------ | -------------------------------------------- |
| `getAvailable()`         | Maps the player can start                    |
| `start(mapId)`           | Start custom map (**mutates** session)       |
| `getActive()`            | Current custom map metadata, or `null`       |
| `getArtifactLocations()` | `{ cellX, cellY, name }[]` for map artifacts |

Call `getArtifactLocations()` after `game:ready` when placing UI markers. Live 0.5.5 vanilla save: `[]`, `getActive()` `null`, `getAvailable()` `[]`.

`AvailableMapV1`: `{ id, name?, … }`.

`maps.start` loads blueprint PNGs through the same join as `api.assets.getUrl`: `new URL(relative, rootUrl)`. Vanilla throws `Asset path resolves outside the mod folder` unless `rootUrl` and the result use the **`file:`** protocol and the result stays under `rootUrl/` (not equal to the folder URL). The host sets `rootUrl` from `pathToFileURL(folder + sep)` in `workshop-mods.js`.

`map.colorMappings` values are **built-in `CellType` names** (lookup is case-insensitive) that have a terrain definition. Official HTML examples: `GoldSoil`, `SandiumSoil`, `Obsidian`. Structure **Block** (`cellId` 15) is not a terrain id. Unknown names throw `references unknown built-in terrain`.

Reserved RGB keys (terrain blueprint format, `workshop-mods.js`): `255, 255, 255`, `170, 170, 170`, `0, 0, 255`, `102, 0, 255`, `102, 204, 255`, `255, 0, 0`, `153, 0, 0`.

## Live session

Probe: `store.scene.active` **4** (in-game `Scene` enum). `shared.mapData` keys: `data`, `width`, `height` - procgen / map raster separate from `shared.sim`.

Live shape: `data` is `Uint8Array`, len **58982400** (= 3840 x 3840 x 4 RGBA). Clear per row in void-world batches (**sandustry-mcp** `references/void-world.md`). Background layer details: `background-layers.md`.

Custom map IPC and UI: **sandustry-ui** / **sandustry-internals**; not repeated here.
