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

Recipe shapes: `node_modules/@sandustry-modding/types/src/sandkit/api/structures.d.ts` (`recipes.register` overloads).
Weighted outputs use `{ elementType, chance }`.

Live extra (not in official HTML): top-level `sandkit.api.processing` with `registerGrower`, `registerShaker`, `registerKineticPress`.
Prefer `structures.recipes.register`.

Engine twin: `engine.api.structures.recipes.getWeightedRecipe`, `selectWeightedOutput`, `register`. `getWeightedRecipe(state, slot, inputType)` only sees **mod** rows in `mods.recipes`.
It returns null for vanilla shaker / grower / press inputs.

## Engine builtins (not in `mods.recipes`)

`recipes.shakers`, `growers`, and `kineticPresses` start as `[]`.
Vanilla processing is hardcoded in the engine.
Mod `registerShaker` stores `{ input, outputsAbove, outputsBelow }`.
Mod grower rows store `{ input, output, chance }` (not `outputs[]`).

`getWeightedRecipe` returns null for these vanilla inputs.
Live scrape sources (game `js/bundle.js`):

| Source                 | Pattern                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Contacts               | `[[r.RJ.Water,r.RJ.Sand,r.RJ.WetSand],…]`                                                                             |
| Residue burn           | `RJ.Residue]:()=>({output:{elementType:r.RJ.BurntResidue,chance:.25}})`                                               |
| Press / shaker outputs | Locale `structures\|velocitySoaker\|description` / `structures\|shaker\|description` (`{t:elements\|…\|name}` tokens) |
| Shaker gold chance     | `RefineWetSand?.5:.25` (non-tutorial branch)                                                                          |
| Grower                 | `RJ.WetSeed&&…RJ.Seedling` (description is harvest copy, not the seedling step)                                       |

| Input         | Engine path                               | Outputs                                                                                    |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Wet Sand      | Shaker (`ShakeWetSand`)                   | Residue (nearby empty cell) + Gold below at **0.25** (0.5 during tutorial `RefineWetSand`) |
| Residue       | `fire.burnElementAt` (no `def.flammable`) | Flame → Burnt Residue at **0.25**                                                          |
| Burnt Residue | Kinetic Press (`PressBurntResidue`)       | Gold + Seed                                                                                |
| Wet Seed      | Planter Box (fallback when no grower row) | Seedling                                                                                   |

Flower harvest after Seedling is entity-side (Gold + Amethelis), not a grower recipe row.

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

Processing uses the triggers scheduler under the hood.
Main thread only for `setEnabledAtCell`.

## Factory process events

Shakers, presses, growers, and thermo machines call `engine.api.factory.recordProcess(state, processIndex)` when they complete work.
Public read ids: `shakeWetSand`, `pressBurntResidue`, `growFlowers`, `condenseFlorin` - see `factory.md`.

## Vanilla element → structure sinks (0.5.5)

Read from element `interactions` (`kind: "structure"`) plus structure i18n:

| Element       | Structure                        | Result                                |
| ------------- | -------------------------------- | ------------------------------------- |
| Wet Sand      | Shaker                           | Gold (↓, 25%) + Residue               |
| Residue       | Fire (`kind: "flammable"` only)  | Burnt Residue (25%)                   |
| Burnt Residue | Kinetic Press (`velocitySoaker`) | Gold + Seed (drop from height)        |
| Wet Seed      | Planter Box (`grower`)           | Seedling (harvest → Gold + Amethelis) |
| Gold          | Collector                        | Credits                               |
| Liquid Gold   | Collector                        | Credits (collectable value 2)         |
| Steam         | Steam Turbine                    | Energy                                |
| Voidbloom     | Flux Emanator (`gloomEmitter`)   | Fluxite terrain                       |
| Aurixite      | Shaker                           | Auralite                              |
| Florinol      | Florinol Battery / Synthesizer   | Energy / Aurixite                     |

## Related

- Thermal / refinery structure ids: **sandustry-ui** `references/building.md` (Thermal tab).
- Energy condense path records `CondenseFlorin` process index.
