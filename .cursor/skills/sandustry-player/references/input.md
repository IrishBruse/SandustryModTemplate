# Input

Key **binding ids** and live key codes - not the full Options Controls table (**sandustry-ui** `bindings.md`).

## `session.input`

| Field                                  | Role                                                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `mode`                                 | `"kbm"` or deck mode                                                                                              |
| `currentLastKey`, `currentLastKeyCode` | Last key event                                                                                                    |
| `keys`                                 | Map of `KeyboardEvent.code` -> pressed (`KeyW`, `ShiftLeft`, ...)                                                 |
| `bindingStates`                        | Per-binding hold state (often `{}`)                                                                               |
| `action`                               | `{ move: { order: [] }, boost: bool }` - movement intent                                                          |
| `mouse`                                | `pressed`, `clicked`, `released`, `position`, `worldPosition`, `cellPosition`, `lastCellPosition`, `lastBigMoveX` |
| `deckLastManagementTab`, `deckCursor`  | Steam Deck UI                                                                                                     |

## `sandkit.api.input`

| Method                                  | Arity | Notes                                                                |
| --------------------------------------- | ----- | -------------------------------------------------------------------- |
| `registerBinding(id, defaultKeys, def)` | 3     | **mutate**                                                           |
| `getMousePositionAtCell()`              | 0     | `{ x, y }` cell under cursor, alias `getMouseCellPosition` (same fn) |
| `getMousePositionAtWorld()`             | 0     | `{ x, y }` world pixels under cursor                                 |
| `getBoundKeys(bindingId)`               | 1     | Key strings from settings                                            |
| `getDisplayKey(bindingId, fallback?)`   | 2     | UI label                                                             |
| `triggerBinding(id)`                    | 1     | **mutate** - fire down handler                                       |
| `pressBinding(id)`                      | 1     | **mutate** - down without release                                    |
| `releaseBinding(id)`                    | 1     | **mutate** - fire up handler                                         |
| `resetMouseState()`                     | 0     | **mutate**                                                           |
| `isCtrlHeld()`                          | 0     | Modifier                                                             |
| `isAltHeld()`                           | 0     | Modifier                                                             |

`getBoundKeys` uses settings strings like `"Control+KeyC"`. `session.input.keys` uses `KeyboardEvent.code`. Modifier aliases (`Shift`, `Control`, ...) expand to `ShiftLeft` / `ShiftRight`, etc.

## Live `KeyBinding` -> keys (this session)

Probe: `api.input.getBoundKeys(sandkit.enums.KeyBinding.<Name>)`.

| Binding id                     | Live keys                                  |
| ------------------------------ | ------------------------------------------ |
| OpenBuildMenu                  | KeyQ                                       |
| OpenInventory                  | Tab                                        |
| OpenTechTree                   | KeyT                                       |
| OpenUpgrades                   | KeyU                                       |
| GrapplingHook                  | KeyG                                       |
| Escape                         | Escape                                     |
| Pause                          | KeyP                                       |
| Left / Right / Boost / Descend | KeyA / KeyD / KeyW / KeyS                  |
| Hover                          | Space                                      |
| SprintBoost                    | Shift                                      |
| Marquee                        | KeyC                                       |
| Demolish                       | KeyX                                       |
| BuildMode                      | KeyR                                       |
| ReverseBuildDirection          | Alt                                        |
| OverrideReplaceStructures      | Control                                    |
| Ruler                          | KeyV                                       |
| Copy / Paste / Flip            | Control+KeyC / Control+KeyV / Control+KeyH |
| Delete                         | Backspace                                  |
| QuickSave / QuickLoad          | F5 / F9                                    |
| ToggleGameHud                  | F4                                         |
| PauseCamera                    | KeyN                                       |

Mod and per-save rebinding can change these. Re-probe before simulating keys.
