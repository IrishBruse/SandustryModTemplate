# Items and hotbar

Hotbar UI clicks: **sandustry-ui** (`references/hud.md`, `references/bindings.md`). This file covers **state shape** and `sandkit.api.items`.

## `store.player.hotbar`

| Field             | Role                              |
| ----------------- | --------------------------------- |
| `activeSlotIndex` | 0-9 slot within the bank          |
| `hotbarIndex`     | 0-4 bank index                    |
| `bars`            | `AssetRef[][]` - 5 banks 10 slots |

Each hotbar slot is `{ id, type }`:

- `id` - string structure/mod id (e.g. `"signalRepeater"`) or numeric `ItemId` for tools/weapons.
- `type` - `sandkit.enums.ItemType` (`Weapon`=1, `Tool`=2, `Consumable`=3, `Mod`=4).

Empty slots are `null`.

**MCP cleanup pitfalls (0.5.2):** Debug/max saves may inflate `inventory.length` (e.g. **410** filled slots with duplicates). Deduplicate to one entry per `id:itemType`. Keep **120** slots with `null` empties, or a dense array of unlocked items only. After bulk story completion, set `store.mods.storyProgression.currentStep` to the last `completedSteps` id — **`null` breaks cold load** from the save menu. Rewrite via `electron.save` / `game.save` after fixes; `.save.backup` beside the id holds the pre-write copy.

## `store.player.inventory`

Toolbox rows. Vanilla entries use numeric `id` (`ItemId`), `itemType`, `abilities[]`, i18n keys (`nameKey`, `descriptionKey`, `categoryKey`). Example shovel: `id: 1`, `itemType: 1`, ability `type: 1` (Dig).

## `sandkit.api.items`

| Method                          | Arity | Notes                                                                   |
| ------------------------------- | ----- | ----------------------------------------------------------------------- |
| `register(definition)`          | 1     | **mutate** - mod item                                                   |
| `updateDefinition(id, partial)` | 2     | **mutate**                                                              |
| `getDefinitionById(id)`         | 1     | Mod definition                                                          |
| `createFromId(id)`              | 1     | **mutate** - runtime instance                                           |
| `getActive()`                   | 0     | Definition for active hotbar slot; `undefined` when slot is a structure |
| `isActiveById(id, type?)`       | 2     | Compare active slot                                                     |

## `sandkit.api.action` vs items

- `action.getActive()` / `getSelected()` return the hotbar `AssetRef` `{ id, type }` (structure on belt, tool id, etc.).
- `items.getActive()` returns a registered **item definition** only (tools/weapons/mods), not structures.

When the active slot is a structure, `action.getActive()` has the structure id and `items.getActive()` is `undefined`.

## Hotbar guard (new game / void MCP)

Fresh worlds can spawn with `activeSlotIndex: null`. Always set bank `0` and a non-null slot before bulk MCP mutations.

Mod belt items (`type: 4`) may lack `handleAction` on the definition object — selecting them crashes the input loop. Prefer weapon (`type: 1`) or tool (`type: 3`) slots for testing void saves.

Entities live in `store.mods.entities.list` (not `store.creatures`). Clear with `.length = 0` when wiping worlds.
