# Engine energy

Internal: `sandkit.engine.api.energy` (state-first, pass `state` as arg 0). Prefer public `sandkit.api.energy` in mods.

## Engine method names (live)

| Engine                    | Public wrapper                  |
| ------------------------- | ------------------------------- |
| `registerType`            | `registerType`                  |
| `add`                     | `addAtCell`                     |
| `consume`                 | `consume`                       |
| `consumeExcludingNetwork` | `consumeExcludingNetworkAtCell` |
| `getNetwork`              | `getNetworkAtCell`              |
| `getNetworkFreeCapacity`  | `getNetworkFreeCapacityAtCell`  |

Also on engine only: `addBatch`.

## `state.sandkit.mods.energy`

Registry written by `registerType`. Live on this save:

| Structure id           | Type      | Notable options                                                          |
| ---------------------- | --------- | ------------------------------------------------------------------------ |
| `powerBrick`           | storage   | `priority: 1`, `spritesheetThresholds`, `onCharge`                       |
| `goldBattery`          | storage   | `excludeFromNetwork`, `canConsume`, `onConsume`, `spritesheetThresholds` |
| `steamTurbine`         | conductor | -                                                                        |
| `electricityConnector` | conductor | -                                                                        |
| `snowmaker`            | conductor | -                                                                        |

`state.sandkit.mods.energyPriorities` - live `[0, 1]` (storage drain order).

Networks walk orthogonal neighbors at **4-cell** spacing (structure snap grid). Nodes with `excludeFromNetwork` (goldBattery) are omitted from graph traversal but still store energy locally.
