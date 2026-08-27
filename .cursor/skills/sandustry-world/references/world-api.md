# `sandkit.api.grid` and `sandkit.api.pickups`

Cell queries, fog, redraw, and deferred grid mutations live on `sandkit.api.grid`. World pickups live on `sandkit.api.pickups`.

Types: `node_modules/@sandustry-modding/types/sandkit/api/grid.d.ts`, `pickups.d.ts`. Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## `sandkit.api.grid` — sync queries (shared)

| Method                                                        | Role                             |
| ------------------------------------------------------------- | -------------------------------- |
| `getCellIdAtCell(cellX, cellY)`                               | Packed cell id                   |
| `isCellEmptyAtCell(cellX, cellY)`                             | True when id is 0                |
| `isTerrainAtCell(cellX, cellY)`                               | True when id is terrain range    |
| `reportActivityAtCell(cellX, cellY)`                          | Wake chunk for sim (**mutates**) |
| `excavateAtCell(cellX, cellY, outVelocity, damage, options?)` | Dig terrain (**mutates**)        |

`ExcavateOptions`: `fromGun`, `fromDrill`, `fromRocketExplosion`, `useLiteralOutVelocity`, `destroyNonDestructible`, `forceRemoveAll`, `drillTierDamage`.

## `sandkit.api.grid` — main thread only

| Method                                  | Role                                                           |
| --------------------------------------- | -------------------------------------------------------------- |
| `mutate(callback)`                      | Run deferred element/terrain writes via `writer` (**mutates**) |
| `revealFogAtCell(cellX, cellY)`         | Clear fog-of-war (**mutates**)                                 |
| `redrawAroundCell(cellX, cellY, range)` | Request render refresh around cell                             |

`mutate(writer => …)` schedules coordinated element and terrain changes. The writer exposes `writer.elements.createAtCell`, `writer.terrains.createAtCell`, and matching `replaceAtCell` / `removeAtCell` helpers.

Main-thread calls on `api.elements.*` and `api.terrains.*` are also deferred. Reads see the old grid until mutations apply.

Fog terrain ids: `CellType.Fog` (4), `FogJetpackBlock` (5), `FogWater` (6), `FogLava` (13). Reveal API targets fog cells. Do not call during read-only probes.

## `sandkit.api.pickups`

| Method                                              | Role                       |
| --------------------------------------------------- | -------------------------- |
| `spawnAtWorld(type, worldX, worldY, data?, light?)` | Spawn pickup (**mutates**) |
| `remove(pickup)`                                    | Remove pickup              |
| `pickUp(pickup)`                                    | Collect to inventory       |
| `getAll()`                                          | List active pickups        |
| `getById(pickupId)`                                 | Lookup by id               |

`WorldItem`: `{ id, x, y, type, data }`. Types: `PickupType` enum / https://sandustry-modding.github.io/SandustryTypes/#/.

## MCP decode without API

When `sandkit.api` is not in scope, read `__debug.state.shared.sim.cellIds` and decode with `grid-chunks.md` id ranges.
