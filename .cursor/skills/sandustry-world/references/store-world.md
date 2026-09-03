# `store.world`

Session-owned world metadata on `__debug.state.store.world`.
Not the same object as `shared.sim` buffers.

## Keys (live)

| Key                        | Live shape                      | Role                       |
| -------------------------- | ------------------------------- | -------------------------- |
| `size`                     | `{ width: 3840, height: 3840 }` | World size in cells        |
| `horizon`, `groundHorizon` | arrays, len 3840                | Per-column horizon heights |
| `matrixTraverseDirection`  | number (1)                      | Sim traverse direction     |
| `updatedElementIndices`    | array                           | Pending element sync list  |
| `deferredChunkReports`     | array                           | Chunk report queue         |
| `fixtures`                 | array, len 70                   | World fixtures             |
| `lights`                   | array, len 438                  | World light records        |
| `sensors`                  | array, len 1                    | World sensors              |
| `teleportZones`            | array, len 621                  | Teleport zone defs         |

## Player position

`shared.playerPos` is array-like: index **0** = x px, **1** = y px (not `.x` / `.y`).

Cell coords: `floor(playerPos[0] / config.cellSize)`, same for y.

## Pickups and items

World pickups use `sandkit.api.pickups` (runtime list), not `store.world` keys.

Structures, drones, pipes: other `store.*` bags - **sandustry-internals** `references/state.md`.
