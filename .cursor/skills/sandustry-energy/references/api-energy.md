# `sandkit.api.energy`

Main thread only. Live keys from webpack loader module `92015` (0.5.2).

| Method                                                | Role                                                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `registerType(structureId, type, options?)`           | Register `conductor` or `storage` on a structure type.                                    |
| `addAtCell(cellX, cellY, amount, options?)`           | Add energy into the network at the cell. Returns amount added.                            |
| `consume(amount, options?)`                           | Take from the **global** energy pool (`store.resources.energy`). `allOrNothing` optional. |
| `consumeExcludingNetworkAtCell(cellX, cellY, amount)` | Consume from networks except the one at the cell.                                         |
| `getNetworkAtCell(cellX, cellY)`                      | Connected nodes `{ x, y, type }[]`.                                                       |
| `getNetworkFreeCapacityAtCell(cellX, cellY)`          | Free storage capacity in that network.                                                    |

`options.energyType` exists in types for multi-network mods. This save uses one pool.

Engine twin (`sandkit.engine.api.energy`) uses shorter names: `add`, `getNetwork`, `getNetworkFreeCapacity`, `consumeExcludingNetwork`. See `engine-energy.md`.

Storage nodes keep `structure.data.storedEnergy` and `structure.data.maxEnergy` (default 16 on goldBattery tiles, 100 on powerBrick).
