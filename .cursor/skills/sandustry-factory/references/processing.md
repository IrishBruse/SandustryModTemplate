# Processing and recipes

Machine recipes and per-cell processing toggles.

## `api.structures.recipes.register` (canonical)

Official HTML documents machine recipes as `api.structures.recipes.register(id, definition)`:

| `id` slot                                                        | Role                                |
| ---------------------------------------------------------------- | ----------------------------------- |
| `planterBox`                                                     | Grower input -> output              |
| `shaker`                                                         | Shaker weighted outputs above/below |
| `kineticPress`                                                   | Press velocity threshold + outputs  |
| `condenser`, `steamDryer`, `synthesizer`, `snowmaker`, `smelter` | Weighted refinery outputs           |

Recipe shapes: `node_modules/@sandustry-modding/types/sandkit/api/structures.d.ts` (`recipes.register` overloads). Weighted outputs use `{ elementType, chance }`.

Live extra (not in official HTML): top-level `sandkit.api.processing` with `registerGrower`, `registerShaker`, `registerKineticPress`. Prefer `structures.recipes.register`.

Engine twin: `engine.api.structures.recipes.getWeightedRecipe`, `selectWeightedOutput`, `register`.

## Custom structure processing

`sandkit.api.structures.processing`:

| Method                                                 | Role                                 |
| ------------------------------------------------------ | ------------------------------------ |
| `register(id, { structureType, intervalMs, process })` | Bind periodic callback               |
| `isEnabledAtCell(cellX, cellY)`                        | Read whether processing runs at cell |
| `setEnabledAtCell(cellX, cellY, enabled)`              | **mutate** per-cell enable flag      |

Deprecated aliases (official HTML): `api.structures.addProcessor` -> `processing.register`; `isEnabledAt` -> `isEnabledAtCell`; `setEnabledAt` -> `setEnabledAtCell`.

`context` deprecated aliases: `getElementTypeAtCell` -> `getResolvedTypeAtCell`; `isCellEmpty` -> `isCellEmptyAtCell`.

Canonical registration:

```js
api.structures.processing.register(id, {
  structureType: id,
  intervalMs: number,
  process(structure, context) {
    // context.isCellEmptyAtCell, context.getResolvedTypeAtCell, context.commit
  },
});
```

Processing uses the triggers scheduler under the hood. Main thread only for `setEnabledAtCell`.

## Factory process events

Shakers, presses, growers, and thermo machines call `engine.api.factory.recordProcess(state, processIndex)` when they complete work. Public read ids: `shakeWetSand`, `pressBurntResidue`, `growFlowers`, `condenseFlorin` - see `factory.md`.

## Related

- Thermal / refinery structure ids: **sandustry-ui** `references/building.md` (Thermal tab).
- Energy condense path records `CondenseFlorin` process index.
