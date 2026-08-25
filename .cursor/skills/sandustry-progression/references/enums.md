# Enums

Live on `sandkit.enums`. Types: `modkit/types/sandkit/enums/index.d.ts`. Generated: `docs/api/sandkit/enums/`.

## TechStatus

Visibility and research state for **UI** (not the same as `player.tech`).

| Value | Name       | Meaning                        |
| ----- | ---------- | ------------------------------ |
| 0     | Available  | May be purchased now           |
| 1     | Visible    | Shown but requirements not met |
| 2     | Researched | Already bought                 |
| 3     | Unknown    | Not yet revealed               |
| 4     | Hidden     | Hidden from tree               |

Derive per-node status in UI code from definitions, parents, `player.tech`, and `lockedTechs`.

## Tech

Mixed numeric and string node ids. Numeric core examples:

`Shaker=1`, `Conveyors=2`, `Flamethrower=5`, `Gun=6`, `Hover=108`, `SprintBoost=109`, `Heatmap=105`, `Corraller=102`.

String examples: `FluxEmanator="fluxEmanator"`, plus mod string ids (`aurixiteCrystallizer`, `swarmConsole`, `voidOrb`, ...).

Use `String(Tech.Shaker)` or numeric key when reading `player.tech` and `getDefinitionById`.

Full enum (110 entries) is in `modkit/types/sandkit/enums/index.d.ts` lines 289-401.

## Related enums

- `ElementType`, `CellType`: discovery and lexicon element ids.
- `ItemId`, `StructureType`: unlock targets on tech definitions.
- `DungeonId` / `Boss1`: `store.progression.dungeons` keys.
