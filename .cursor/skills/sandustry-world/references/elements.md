# `sandkit.api.elements`

Main thread only for registration and `*WhenIdle` mutations. Shared reads in `node_modules/@sandustry-modding/types/shared/api/elements.d.ts`.

Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## Shared reads

| Method                                    | Role                         |
| ----------------------------------------- | ---------------------------- |
| `getTypeFromId(elementId)`                | String id -> type handle     |
| `getDefinitionByType(elementType)`        | Mod definition               |
| `getTypeAtCell`, `getResolvedTypeAtCell`  | Type at cell                 |
| `getResolvedTypeFromCellId(cellId)`       | Type from packed id          |
| `getInfoAtCell`                           | Type, particle flag, indices |
| `getMatterTypeAtCell`                     | Matter category              |
| `isTypeAtCell`, `isFreeFallingAtCell`     | Boolean checks               |
| `getVelocityAtCell`, `getDataFieldAtCell` | Per-cell data                |

## Registration (main)

| Method                                            | Role                             |
| ------------------------------------------------- | -------------------------------- |
| `getRegisteredTypes()`                            | All type handles                 |
| `register(definition)`                            | New element -> `{ elementType }` |
| `updateDefinition(typeOrId, partial)`             | Patch definition                 |
| `addInteractionInfo(typeOrId, interaction)`       | Tooltip interactions             |
| `getNameByType(elementType)`                      | Display name                     |
| `findFreeCellInStructure(anchorX, anchorY, size)` | Footprint search                 |

## Idle mutations (main, need user ask)

All schedule work when sim is idle: `createAtCellWhenIdle`, `replaceAtCellWhenIdle`, `removeAtCellWhenIdle`, `teleportBetweenCellsWhenIdle`, `setVelocityAtCellWhenIdle`, `addParticleVelocityAtCellWhenIdle`, `convertToParticleAtCellWhenIdle`, `convertFromParticleAtCellWhenIdle`, `setDataFieldAtCellWhenIdle`, `refreshColorAtCellWhenIdle`, `setPhysicsAtCellWhenIdle`, `setDurationAtCellWhenIdle`.

## Live definition keys (`getDefinitionByType`)

Public TypeScript lists `id`, `nameKey`, `density`, `matterType`, `colors`, `defaultDataFields`. Live configs also carry:

| Key                               | Role                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| `descriptionKey` / `description`  | Lexicon copy                                                         |
| `metaColor`                       | RGB packed as `0xRRGGBB`                                             |
| `materialId`                      | Render / sim material index                                          |
| `hidden`                          | Hide from some UI                                                    |
| `isGrabbable` / `isTransportable` | Grabber and conveyor                                                 |
| `duration` / `durationRandom`     | Lifetime seconds                                                     |
| `horizontalSpeed`                 | Sideways motion                                                      |
| `flammable`                       | Burn output id, chance, fire duration                                |
| `collectable.value`               | Collector gold                                                       |
| `mixes`                           | Contact mix `{ elementType, result }`                                |
| `interactions`                    | Tooltip kinds (`flammable`, `freezable`, …)                          |
| `getExtraProps().data`            | Extra sim bags (Steam `energy`, Fire `temperature`, Seedling growth) |

Built-in enum names: `sandkit.enums.ElementType` (`Sand` = 1 … `Basalt` = 20). String id for mods is `definition.id`; for builtins parse `nameKey` (`elements|sand|name`).

## MCP element read

```javascript
const sim = __debug.state.shared.sim;
const cellId = sim.cellIds[y * sim.width + x];
if (cellId >= 1000001 && cellId <= 2000000) {
  const idx = cellId - 1000001;
  return { type: sim.elementData.type[idx], vx: sim.elementData.velocityX[idx] };
}
```
