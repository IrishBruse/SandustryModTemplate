# `sandkit.api.elements`

Main thread only for registration and `*WhenIdle` mutations. Shared reads in `modkit/types/shared/api/elements.d.ts`.

Generated: `docs/api/sandkit/api/namespaces/elements/`.

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

## Live registrations

`__debug.state.sandkit.mods.elements` - **31** keys in probe (vanilla + template mods). `mods.matters` - **1** key.

## MCP element read

```javascript
const sim = __debug.state.shared.sim;
const cellId = sim.cellIds[y * sim.width + x];
if (cellId >= 1000001 && cellId <= 2000000) {
  const idx = cellId - 1000001;
  return { type: sim.elementData.type[idx], vx: sim.elementData.velocityX[idx] };
}
```
