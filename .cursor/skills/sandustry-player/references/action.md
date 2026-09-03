# Action

Active tool/structure **use** state while the mouse button is down.

## `session.action`

| Field        | Role                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| `point`      | `{ x, y }` world pixel aim point                                                |
| `state`      | Map keyed by `ActionState` value (`"1"`=Start, `"2"`=Active, `"3"`=End) -> bool |
| `customData` | Mod payload from `api.action.setCustomData` or `null`                           |

`store.player.action` stays `null` during play - do not use it for live action.

## `sandkit.api.action`

| Method                | Arity | Notes                                                      |
| --------------------- | ----- | ---------------------------------------------------------- |
| `getActive()`         | 0     | `AssetRef` in use (may differ from selected while holding) |
| `getSelected()`       | 0     | Hotbar `AssetRef`                                          |
| `setCustomData(data)` | 1     | **mutate** - attach to active handler                      |

Returns `{ id, type }` where `type` is `ItemType` (structure slots use `Mod`=4 for placed structures).

## `sandkit.enums.ActionType`

| Member   | Value |
| -------- | ----- |
| Weapon   | 1     |
| Building | 2     |
| Tool     | 3     |
| Mod      | 4     |

## `sandkit.enums.ActionState`

| Member | Value |
| ------ | ----- |
| Start  | 1     |
| Active | 2     |
| End    | 3     |

## Related

`session.actionLocked` - blocks new actions when `true`.

## MCP triage: `handleAction` crash

Input loop calls `definition.handleAction(state, action)`.
If the **definition lookup** is `undefined`, the renderer throws and movement stops.

| Trigger                                                        | Fix                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Hotbar `type: 4` mod item without handler (`<modId>:<itemId>`) | Switch to vanilla weapon `{ id: 1, type: 1 }` or tool `{ id: 2, type: 3 }`      |
| New game `activeSlotIndex: null`                               | Set `hotbarIndex: 0`, `activeSlotIndex: 0` before mutations                     |
| Build mode active structure                                    | `api.building.cancelPlacement()`, `session.building.activeStructureType = null` |

`action.getSelected()` may still report a structure id while `hotbar.bars[bank][slot]` shows a weapon - trust hotbar after canceling build mode.

Full scripts: **sandustry-mcp** `references/void-world.md`.
