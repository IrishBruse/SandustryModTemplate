# `sandkit.api.maps`

Custom map selection and session start. Not the in-game world grid itself.

Types: `modkit/types/sandkit/api/maps.d.ts`, `modkit/types/shared/api/maps.d.ts`.

Generated: `docs/api/sandkit/api/namespaces/maps/`.

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

Custom map IPC and UI: **sandustry-ui** / **sandustry-internals**; not repeated here.
