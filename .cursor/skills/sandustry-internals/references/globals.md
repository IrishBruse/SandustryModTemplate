# Globals

Renderer `window` extras (0.5.2 live). Standard DOM APIs omitted.

| Name                  | Role                                                               |
| --------------------- | ------------------------------------------------------------------ |
| `sandkit`             | Host bag: `api`, `apiVersion`, `engine`, `enums`, `react`, `state` |
| `api`                 | Same object as `sandkit.api`                                       |
| `enums`               | Same object as `sandkit.enums`                                     |
| `react`               | Same object as `sandkit.react`                                     |
| `electron`            | Preload `contextBridge` - `electron.md`                            |
| `__debug`             | Dev helpers - `debug.md`                                           |
| `debugF3`             | `{ registerSection }` (fn name `registerF3Section`, arity 1)       |
| `Noise`               | Function (procgen noise)                                           |
| `webpackChunksand_v1` | Webpack chunk array (length 1 after load)                          |
| `__reflow`            | Number (layout tick, changes over time)                            |

`sandkit.apiVersion` is `1`. Enums on this build: AbilityType, ActionState, ActionType, AuthorizationType, BuildMode, BuildingClearance, CellType, ComponentId, DroneType, ElementType, ItemId, ItemType, KeyBinding, KeyState, MatterType, ProjectileType, ReloadType, Scene, StructureType, Tech, TechStatus, WorldItemType.
