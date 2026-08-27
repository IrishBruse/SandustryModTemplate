# Globals

Renderer `window` extras (0.5.2 vanilla). Standard DOM APIs omitted.

| Name                  | Role                                      |
| --------------------- | ----------------------------------------- |
| `electron`            | Preload `contextBridge` - `electron.md`   |
| `__debug`             | Dev helpers - `debug.md`                  |
| `Noise`               | Function (procgen noise)                  |
| `webpackChunksand_v1` | Webpack chunk array (length 1 after load) |
| `__reflow`            | Number (layout tick, changes over time)   |

`sandkit` is a host free variable in mod bundle scope (not `window` by default). See https://sandustry-modding.github.io/SandustryTypes/#/.

`sandkit.apiVersion` is `1`. Enums on this build: AbilityType, ActionState, ActionType, AuthorizationType, BuildMode, BuildingClearance, CellType, ComponentId, DroneType, ElementType, ItemId, ItemType, KeyBinding, KeyState, MatterType, PickupType, ProjectileType, ReloadType, Scene, StructureType, Tech, TechStatus.
