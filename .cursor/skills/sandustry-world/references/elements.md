# `api.elements`

Official: [sandkit.html - api.elements](https://sandustry.com/sandkit.html). Types: `@sandustry-modding/types` `sandkit/api/elements.d.ts`, `shared/api/elements.d.ts`.

Main entry: registration and deferred cell mutations. Worker entry: immediate mutations plus extra move/swap helpers (see **Worker-only** below).

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

Deferred on main. Reads see the old grid until mutations apply.

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

## Live definition keys (`getDefinitionByType`)

Public TypeScript lists `id`, `nameKey`, `density`, `matterType`, `colors`, `defaultDataFields`. Live configs also carry:

| Key                               | Role                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `descriptionKey` / `description`  | Lexicon copy                                                                                                                                                        |
| `metaColor`                       | RGB packed as `0xRRGGBB`                                                                                                                                            |
| `materialId`                      | Render / sim material index                                                                                                                                         |
| `hidden`                          | Hide from some UI                                                                                                                                                   |
| `isGrabbable` / `isTransportable` | Grabber and conveyor                                                                                                                                                |
| `duration` / `durationRandom`     | Lifetime seconds                                                                                                                                                    |
| `horizontalSpeed`                 | Sideways motion                                                                                                                                                     |
| `flammable`                       | Burn output id, chance, fire duration. Builtins may omit this object                                                                                                |
| `collectable.value`               | Collector gold                                                                                                                                                      |
| `mixes`                           | Contact mix `{ elementType, result }`                                                                                                                               |
| `interactions`                    | Tooltip kinds (`flammable`, `freezable`, ...). Residue is `kind: "flammable"` only; engine fire writes Burnt Residue at 25% (**sandustry-world** `sim-crafting.md`) |
| `getExtraProps().data`            | Extra sim bags (Steam `energy`, Fire `temperature`, Seedling growth)                                                                                                |

Built-in enum: `sandkit.enums.ElementType` - Sand (1) ... Basalt (20), **Gloom (8)**. String id for mods is `definition.id`; for builtins parse `nameKey` (`elements|sand|name`).

Live: `state.sandkit.mods.elements` - **31** registered ids (sample: `caulk`, `florin`, `liquidGold`).

## MCP element read

```javascript
const sim = __debug.state.shared.sim;
const cellId = sim.cellIds[y * sim.width + x];
if (cellId >= 1000001 && cellId <= 2000000) {
  const idx = cellId - 1000001;
  return { type: sim.elementData.type[idx], vx: sim.elementData.velocityX[idx] };
}
```
