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
