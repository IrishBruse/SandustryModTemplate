# `api.elements`

Official: [sandkit.html - api.elements](https://sandustry.com/sandkit.html).
Types: `@sandustry-modding/types` `src/sandkit/api/elements.d.ts`, `src/shared/api/elements.d.ts`.

Main entry: registration and deferred cell mutations.
Worker entry: immediate mutations plus extra move/swap helpers (see **Worker-only** below).

## Shared reads (main and worker)

| Method                                    | Role                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `getTypeById(elementId)`                  | String id -> type handle. Builtins (`residue`, `wetSand`) resolve even when absent from `mods.elements` |
| `getIdByType(elementType)`                | Type handle -> string id                                                                                |
| `getDefinitionByType(elementType)`        | Mod definition                                                                                          |
| `getTypeAtCell`, `getResolvedTypeAtCell`  | Type at cell                                                                                            |
| `getResolvedTypeFromCellId(cellId)`       | Type from packed id                                                                                     |
| `getInfoAtCell`                           | Type, particle flag, indices                                                                            |
| `getMatterTypeAtCell`                     | Matter category                                                                                         |
| `isTypeAtCell`, `isFreeFallingAtCell`     | Boolean checks                                                                                          |
| `getVelocityAtCell`, `getDataFieldAtCell` | Per-cell data                                                                                           |

Deprecated alias: `getTypeFromId` -> `getTypeById`.

## Registration (main)

| Method                                                                        | Role                             |
| ----------------------------------------------------------------------------- | -------------------------------- |
| `getRegisteredTypes()`                                                        | All type handles                 |
| `register(definition)`                                                        | New element -> `{ elementType }` |
| `updateDefinition(typeOrId, partial)`                                         | Patch definition                 |
| `addInteractionInfo(typeOrId, interaction)`                                   | Tooltip interactions             |
| `getNameByType(elementType)`                                                  | Display name                     |
| `findFreeCellInStructure(structureCellX, structureCellY, structureSizeCells)` | Footprint search                 |

## Main-thread mutations (need user ask)

Deferred on main.
Reads see the old grid until mutations apply.

`createAtCell`, `replaceAtCell`, `removeAtCell`, `teleportBetweenCells`, `setVelocityAtCell`, `addParticleVelocityAtCell`, `convertToParticleAtCell`, `convertFromParticleAtCell`, `setDataFieldAtCell`, `refreshColorAtCell`, `setPhysicsAtCell`, `setDurationAtCell`.

Each has a deprecated `*WhenIdle` alias (same function). `setPhysicsAtCell` takes `api.constants.physics` values - see `world-api.md`.

For coordinated element and terrain changes, prefer `api.grid.mutate(writer => …)`.

## Worker-only mutations

Present on worker entry only (undefined on main renderer 0.5.5):

| Method                                                               | Deprecated alias                    |
| -------------------------------------------------------------------- | ----------------------------------- |
| `moveBetweenCells(fromCellX, fromCellY, toCellX, toCellY)`           | -                                   |
| `swapBetweenCells(firstCellX, firstCellY, secondCellX, secondCellY)` | `swapCells`                         |
| `markMovementBlockedByIndex(elementIndex)`                           | `markMovementBlockedByElementIndex` |

Worker `createAtCell` / `replaceAtCell` / etc. apply immediately (no `*WhenIdle` aliases in worker docs).

## `ElementDefinition` (register / `getDefinitionByType`)

Public TypeScript (`@sandustry-modding/types` shared `elements.d.ts`).
Pass to `register` / `updateDefinition`. `getDefinitionByType` returns the live snapshot (may include extra keys below).

| Field                | Role                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | String id for mods (`modId:localId`). Builtins often omit `id` on the engine config; resolve with `getIdByType` / `nameKey`                                            |
| `nameKey`            | i18n key for display name (`elements\|sand\|name`, or mod key from `api.i18n.register`)                                                                                |
| `density`            | Copied onto the cell at spawn (`elementData.density`). Heavier sinks through lighter. Examples: Water 100, Sand 150, Gold 300, Steam/Fire 25                           |
| `matterType`         | Physics category: `sandkit.enums.MatterType` Solid(1) … Powder(8). See `cells.md`. Some workshop mods use values outside 1–8 via engine matters                        |
| `isGrabbable?`       | Grabber skips only when `=== false`. Omit or `true` allows grab. Some grab UI paths still refuse Liquid/Gas                                                            |
| `isTransportable?`   | Conveyors treat omit as **true**; `false` blocks. Liquid / Gas / Static matter also skip transport regardless                                                          |
| `defaultDataFields?` | Spawn defaults for `field1`…`field4` → `elementData.dataField1`…`4`. Override per place with `createAtCell` `dataFields` / `getDataFieldAtCell` / `setDataFieldAtCell` |
| `colors`             | See **colors** below                                                                                                                                                   |
| `getExtraProps?`     | See **getExtraProps** below                                                                                                                                            |

### `colors`

| Key                      | Role                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `variants`               | Palette of `[r,g,b]` (types) or live `[r,g,b,a]` tuples. Spawn picks a random `variantIndex` (0–3). |
| `variantFromDataField1?` | Map per-cell `dataField1` onto `variants` for draw / `refreshColorAtCell`                           |

`variantFromDataField1` options (engine color path):

| Option        | Default when omitted | Role                                                                                  |
| ------------- | -------------------- | ------------------------------------------------------------------------------------- |
| `rangeMin`    | `1`                  | Clamp low for `dataField1`                                                            |
| `rangeMax`    | `variants.length`    | Clamp high                                                                            |
| `invert`      | **`true`**           | Flip position inside the range before picking a variant                               |
| `useGradient` | falsy                | When true, lerp between adjacent variants; when false, discrete index into `variants` |

Live samples: Coolant `{ rangeMin:0, rangeMax:100, invert:false, useGradient:true }`; Water Pressure `{ rangeMin:1, rangeMax:700, invert:true, useGradient:true }`.
Live color scheme also exists under `session.colors.scheme.element[type]` (may diverge from the definition object).
Engine-only `variantFromVelocity` is **not** on the public type.

### `getExtraProps`

Optional `() => ({ data: Record<…> })`.
On create, the engine merges the return value into the spawn bag.
Builtin `data` keys that write `dataField*`:

| Element  | `data` keys                    | Maps to                |
| -------- | ------------------------------ | ---------------------- |
| Steam    | `energy` (default 10)          | `dataField1`           |
| Fire     | `temperature` (default 1000)   | `dataField1`           |
| Seedling | `seedlings`, `grows`, `runway` | `dataField1`, `2`, `3` |

Matter-type `getExtraProps` on the physics table (Liquid axis counters, Particle velocity bag) is separate from element definitions.

## Live extras (beyond public TypeScript)

| Key                              | Role                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `descriptionKey` / `description` | Lexicon copy                                                                                                                                                        |
| `metaColor`                      | RGB packed as `0xRRGGBB`                                                                                                                                            |
| `materialId`                     | Render / sim material index                                                                                                                                         |
| `hidden`                         | Hide from some UI                                                                                                                                                   |
| `duration` / `durationRandom`    | Lifetime seconds                                                                                                                                                    |
| `horizontalSpeed`                | Sideways motion (example: Lava `0.1`)                                                                                                                               |
| `flammable`                      | Burn output id, chance, fire duration. Builtins may omit this object                                                                                                |
| `collectable.value`              | Collector gold                                                                                                                                                      |
| `mixes`                          | Contact mix `{ elementType, result }`                                                                                                                               |
| `interactions`                   | Tooltip kinds (`flammable`, `freezable`, ...). Residue is `kind: "flammable"` only; engine fire writes Burnt Residue at 25% (**sandustry-world** `sim-crafting.md`) |

Built-in enum: `sandkit.enums.ElementType` - Sand (1) ...
Basalt (20), **Gloom (8)**.
String id for mods is `definition.id`; for builtins parse `nameKey` (`elements|sand|name`).

Live: `state.sandkit.mods.elements` - **32** registered ids this session (sample: `caulk`, `florin`, `liquidGold`, `irishbruse.trees:pineCone`).

## MCP element read

```javascript
const sim = __debug.state.shared.sim;
const cellId = sim.cellIds[y * sim.width + x];
if (cellId >= 1000001 && cellId <= 2000000) {
  const idx = cellId - 1000001;
  return { type: sim.elementData.type[idx], vx: sim.elementData.velocityX[idx] };
}
```
