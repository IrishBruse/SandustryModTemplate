# `sandkit.api.maps`

Custom map selection and session start. Not the in-game world grid itself.

Types: `node_modules/@sandustry-modding/types/sandkit/api/maps.d.ts`, `node_modules/@sandustry-modding/types/shared/api/maps.d.ts`.

Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## Methods

| Method           | Role                                   |
| ---------------- | -------------------------------------- |
| `getAvailable()` | Maps the player can start              |
| `start(mapId)`   | Start custom map (**mutates** session) |
| `getActive()`    | Current custom map metadata, or null   |

`AvailableMapV1`: `{ id, name?, … }`.

`ActiveMapV1`: optional `deployment`, `spawn`, `topBounds`, `parallax`, `depthLight`, etc.

## Live session

Probe showed `store.scene.active` **4** (in-game `Scene` enum). `shared.mapData` keys: `data`, `width`, `height` - procgen / map raster separate from `shared.sim`.

Live shape: `data` is `Uint8Array`, len **58982400** (= 3840×3840×4 RGBA). Clear per row in void-world batches (**sandustry-mcp** `references/void-world.md`). Background layer details: [background-layers.md](background-layers.md).

Custom map IPC and UI: **sandustry-ui** / **sandustry-internals**; not repeated here.
