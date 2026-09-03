# `api.terrains`

Terrain uses numeric **cell types** (same id space as `CellType` and damaged-ground transitions).

Official: [sandkit.html - api.terrains](https://sandustry.com/sandkit.html).
Types: `@sandustry-modding/types` `src/shared/api/terrains.d.ts`, `src/sandkit/api/terrains.d.ts`.

## Shared queries and mutations

| Method                                          | Role                                 |
| ----------------------------------------------- | ------------------------------------ |
| `getTypeById(terrainId)`                        | String id -> cell type               |
| `getIdByType(terrainType)`                      | Cell type -> string id               |
| `getTypeAtCell`, `getDataAtCell`                | Type and hit points at cell          |
| `isAtCell`, `isTypeAtCell(…, terrainId)`        | Presence checks                      |
| `isCellIdTerrain(cellId)`                       | True for terrain id range            |
| `damageAtCell(…, damage)`                       | Apply hit-point damage (**mutates**) |
| `createAtCell`, `replaceAtCell`, `removeAtCell` | Terrain ops (**mutate**)             |
| `setHitPointsAtCell(…, hitPoints)`              | Set hit points (**mutates**)         |

Deprecated aliases: `getTypeFromId` -> `getTypeById`; `setHpAtCell` / `setHpAtCellWhenIdle` -> `setHitPointsAtCell`; main-thread `*WhenIdle` on create/replace/remove.

`getDataAtCell` returns `{ cellType, hitPoints, hp }`.
Prefer **`hitPoints`**; `hp` is a deprecated alias (live 0.5.5 returns both keys).

On the main thread, terrain mutations are deferred like element writes.
Worker entry applies them immediately.

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

Terrain create/remove can trigger shadow updates unless `skipShadow: true`.
Engine refresh: `wall-heat-foliage.md`.
