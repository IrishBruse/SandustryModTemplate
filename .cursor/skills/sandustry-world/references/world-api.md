# `sandkit.api.world`

Main-thread namespace. Shared queries live in `modkit/types/shared/api/world.d.ts`. Idle and fog helpers on main thread only.

Generated reference: `docs/api/sandkit/api/namespaces/world/`.

## Sync queries (shared)

| Method                                                        | Role                             |
| ------------------------------------------------------------- | -------------------------------- |
| `getCellIdAtCell(cellX, cellY)`                               | Packed cell id                   |
| `isCellEmptyAtCell(cellX, cellY)`                             | True when id is 0                |
| `isTerrainAtCell(cellX, cellY)`                               | True when id is terrain range    |
| `reportActivityAtCell(cellX, cellY)`                          | Wake chunk for sim (**mutates**) |
| `excavateAtCell(cellX, cellY, outVelocity, damage, options?)` | Dig terrain (**mutates**)        |

`ExcavateOptions`: `fromGun`, `fromDrill`, `fromRocketExplosion`, `useLiteralOutVelocity`, `destroyNonDestructible`, `forceRemoveAll`, `drillTierDamage`.

## Main-thread only

| Method                                          | Role                                 |
| ----------------------------------------------- | ------------------------------------ |
| `runWhenSimulationIdle(callback)`               | Run on main thread when workers idle |
| `revealFogAtCell(cellX, cellY)`                 | Clear fog-of-war (**mutates**)       |
| `redrawAroundCellWhenIdle(cellX, cellY, range)` | Request render refresh when idle     |

Fog terrain ids: `CellType.Fog` (4), `FogJetpackBlock` (5), `FogWater` (6), `FogLava` (13). Reveal API targets fog cells, do not call during read-only probes.

## `world.pickups`

| Method                                              | Role                       |
| --------------------------------------------------- | -------------------------- |
| `spawnAtWorld(type, worldX, worldY, data?, light?)` | Spawn pickup (**mutates**) |
| `destroy(worldItem)`                                | Remove pickup              |
| `pickUp(worldItem)`                                 | Collect to inventory       |
| `getAll()`                                          | List active pickups        |
| `getById(worldItemId)`                              | Lookup by id               |

`WorldItem`: `{ id, x, y, type, data }`. Types: `WorldItemType` enum / `docs/api/sandkit/enums/enumerations/WorldItemType.md`.

## MCP decode without API

When `sandkit.api` is not in scope, read `__debug.state.shared.sim.cellIds` and decode with `grid-chunks.md` id ranges.
