# `sandkit.api.terrains`

Terrain uses numeric **cell types** (same id space as `CellType` and damaged-ground transitions).

Types: `node_modules/@sandustry-modding/types/shared/api/terrains.d.ts`, `node_modules/@sandustry-modding/types/sandkit/api/terrains.d.ts`.

Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## Shared queries and mutations

| Method                                          | Role                                 |
| ----------------------------------------------- | ------------------------------------ |
| `getTypeById(terrainId)`                        | String id -> cell type               |
| `getTypeAtCell`, `getDataAtCell`                | Type and `hitPoints` at cell         |
| `isAtCell`, `isTypeAtCell(…, terrainId)`        | Presence checks                      |
| `isCellIdTerrain(cellId)`                       | True for terrain id range            |
| `damageAtCell(…, damage)`                       | Apply hit-point damage (**mutates**) |
| `createAtCell`, `replaceAtCell`, `removeAtCell` | Terrain ops (**mutate**)             |
| `setHitPointsAtCell(…, hitPoints)`              | Set hit points (**mutates**)         |

On the main thread, terrain mutations are deferred like element writes. Worker entry applies them immediately.

`TerrainMutationOptions`: `{ skipShadow?: boolean }`.

## Registration (main)

| Method                                    | Role              |
| ----------------------------------------- | ----------------- |
| `register(definition)`                    | -> `{ cellType }` |
| `updateDefinition(cellTypeOrId, partial)` | Patch definition  |

`TerrainDefinition`: `id`, `nameKey`, `hp`, `materialId` (must be > 100 and < 150), `metaColor`, `colorHSL`, `excavationRequirements`, `interactions`, `output`.

## Live registrations

`__debug.state.sandkit.mods.terrains` - **25** keys in probe (sample: `solidite`, `sand2`, `crystal`, `gameOfLifeRandom`).

## Shadows

Terrain create/remove can trigger shadow updates unless `skipShadow: true`. Engine refresh: `references/wall-heat-foliage.md`.
