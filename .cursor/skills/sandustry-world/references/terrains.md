# `sandkit.api.terrains`

Terrain uses numeric **cell types** (same id space as `CellType` and damaged-ground transitions).

Types: `modkit/types/shared/api/terrains.d.ts`, `modkit/types/sandkit/api/terrains.d.ts`.

Generated: `docs/api/sandkit/api/namespaces/terrains/`.

## Shared queries and sync mutations

| Method                                          | Role                               |
| ----------------------------------------------- | ---------------------------------- |
| `getTypeFromId(terrainId)`                      | String id -> cell type             |
| `getTypeAtCell`, `getDataAtCell`                | Type and hp at cell                |
| `isAtCell`, `isTypeAtCell(…, terrainId)`        | Presence checks                    |
| `isCellIdTerrain(cellId)`                       | True for terrain id range          |
| `damageAtCell(…, damage)`                       | Apply hp damage (**mutates**)      |
| `createAtCell`, `replaceAtCell`, `removeAtCell` | Immediate terrain ops (**mutate**) |
| `setHpAtCell(…, hp)`                            | Sync hp set (**mutates**)          |

`TerrainMutationOptions`: `{ skipShadow?: boolean }`.

## Registration (main)

| Method                                    | Role              |
| ----------------------------------------- | ----------------- |
| `register(definition)`                    | -> `{ cellType }` |
| `updateDefinition(cellTypeOrId, partial)` | Patch definition  |

`TerrainDefinition`: `id`, `nameKey`, `hp`, `materialId` (must be > 100 and < 150), `metaColor`, `colorHSL`, `excavationRequirements`, `interactions`, `output`.

## Idle mutations (main)

`createAtCellWhenIdle`, `replaceAtCellWhenIdle`, `removeAtCellWhenIdle`, `setHpAtCellWhenIdle`.

## Live registrations

`__debug.state.sandkit.mods.terrains` - **25** keys in probe (sample: `solidite`, `sand2`, `crystal`, `gameOfLifeRandom`).

## Shadows

Terrain create/remove can trigger shadow updates unless `skipShadow: true`. Engine refresh: `references/wall-heat-foliage.md`.
