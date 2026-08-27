# Processing and recipes

Machine recipes and per-cell processing toggles.

## `sandkit.api.processing` (live)

| Method                 | Role                                |
| ---------------------- | ----------------------------------- |
| `registerGrower`       | Planter box input -> output         |
| `registerShaker`       | Shaker weighted outputs above/below |
| `registerKineticPress` | Press velocity threshold + outputs  |

Recipe shapes: `node_modules/@sandustry-modding/types/sandkit/api/processing.d.ts`. Weighted outputs use `{ elementType, chance }`.

## `structures.recipes.register`

Alternate registration path by machine slot id:

- `planterBox`, `shaker`, `kineticPress`
- Refinery ids: `condenser`, `steamDryer`, `synthesizer`, `snowmaker`, `smelter`

Engine twin: `engine.api.structures.recipes.getWeightedRecipe`, `selectWeightedOutput`, `register`.

## Custom structure processing

`sandkit.api.structures.processing`:

| Method                                                 | Role                                 |
| ------------------------------------------------------ | ------------------------------------ |
| `isEnabledAt(cellX, cellY)`                            | Read whether processing runs at cell |
| `register(id, { structureType, intervalMs, process })` | Bind periodic callback               |
| `setEnabledAt(cellX, cellY, enabled)`                  | **mutate** per-cell enable flag      |

`addProcessor(structureId, { intervalMs, process })` - attach processor to a structure type without a separate id.

Processing uses the triggers scheduler under the hood. Main thread only for `setEnabledAt`.

## Factory process events

Shakers, presses, growers, and thermo machines call `engine.api.factory.recordProcess(state, processIndex)` when they complete work. Process indices and tier gates: `factory.md`.

## Related

- Thermal / refinery structure ids: **sandustry-ui** `references/building.md` (Thermal tab).
- Energy condense path records `CondenseFlorin` process index.
