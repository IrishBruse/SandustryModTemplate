# Structures

World structures live in `store.structures[]`. Spatial index: `session.cache.structures` (block grid). Pipes are separate - see `pipes.md`.

## Instance shape (live)

| Field    | Role                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| `type`   | Builtin numeric id (e.g. `11` Foundation) or mod string id (e.g. `conveyorLeftMk2`) |
| `x`, `y` | Snap-grid cell origin                                                               |
| `queued` | `true` when placement waits on clearance (partial block or replace)                 |
| `filter` | Optional `{ elementType, mode }` on filters (`mode`: `"allow"` seen live)           |
| `data`   | Per-structure bag (signals, pumps, prefab reset, sound box notes, ...)              |
| `color`  | Hex tint (coloring tool), e.g. `"#00ffff"`                                          |
| `frame`  | Boolean frame overlay on foundations                                                |

Live save sample: 872 structures, 10 `queued`, fields `color`, `data`, `filter`, `frame`, `queued`, `type`, `x`, `y`.

## `sandkit.api.structures` (live keys)

`addProcessor`, `addVariant`, `buildAtCellWhenIdle`, `forEachOfType`, `getAtCell`, `getDefinitionByType`, `getTypeFromId`, `getUnlockedTypes`, `hasBuiltAtCell`, `isBlockedByPlayerAtCell`, `isLauncherAtCell`, `isType`, `isTypeAtCell`, `isUnlockedByType`, `mapValueToSpritesheetIndex`, `register`, `registerPlacementConfig`, `removeAtCellWhenIdle`, `removeAtCellsWhenIdle`, `removeBetweenCellsWhenIdle`, `setData`, `setSpritesheetIndex`, `setSpritesheetIndexAtCell`, `setSpritesheetIndexByValue`, `setSpritesheetIndexByValueAtCell`, `update`, `updateDefinition`.

Nested:

- `recipes.register` - machine recipe slots (`planterBox`, `shaker`, `kineticPress`, refinery ids).
- `processing.isEnabledAt`, `processing.register`, `processing.setEnabledAt`.

## Mod registry

`state.sandkit.mods.structures` - 65 defs on this save. Each has `id`, keys like `nameKey`, `categoryKey`, `buildModes`, `variants`, `render`, optional `shape`, `draw`.

Builtin defs via `getDefinitionByType(16)` expose `buildModes`, `variants`, `nameKey`, `descriptionKey`, `categoryKey`.

## Engine-only extras (`engine.api.structures`)

State-first twin. Live extras vs public: `build`, `removeAt`, `removeBetween`, `removeAtPositions`, `beginBatchWrite`, `endBatchWrite`, `getConfig`, `resolveTypeName`, `isBlockedByPlayer`, `isUnlocked`, `isTypeAt`.

`engine.api.structures.recipes`: `getWeightedRecipe`, `register`, `selectWeightedOutput`.

## Built-in type ids

Numeric `StructureType` enum (1-27): see `enums.md`. Mod types use string ids. `getTypeFromId('collector')` -> `16`.

## Related

- Placement mode: **sandustry-player** `references/building.md`.
- Building overlay names: **sandustry-ui** `references/building.md`.
- Collectors: `sandkit.api.collector` (value at cell). Gold overlap: **sandustry-energy** `references/gold-collector.md`.
- Launchers: **sandustry-entities** `references/launchers.md`.
