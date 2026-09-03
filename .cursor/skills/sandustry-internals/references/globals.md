# Globals

Renderer `window` extras (0.5.5 vanilla).
Standard DOM APIs omitted.

| Name                  | Role                                      |
| --------------------- | ----------------------------------------- |
| `electron`            | Preload `contextBridge` - `electron.md`   |
| `__debug`             | Dev helpers - `debug.md`                  |
| `Noise`               | Function (procgen noise)                  |
| `webpackChunksand_v1` | Webpack chunk array (length 1 after load) |
| `__reflow`            | Number (layout tick, changes over time)   |

`sandkit` top-level keys (live 0.5.5): `api`, `apiVersion`, `engine`, `enums`, `react`, `state`.
Injected into mod `entry` / `workerEntry` per official HTML (Function wrap around `entrySource`).
Vanilla does not assign `window.sandkit`.
Empty `getSandkitMods` still reaches Game HUD.
Ambient `sandkit` in MCP `evaluate_script` needs a loaded entry (Steam session with mods, or a harness that sets `globalThis.sandkit`).
This Steam 0.5.5 session: `typeof window.sandkit === "object"`.
After reload, verify again (may be `"undefined"`).

Official API reference: `.tmp/Sandkit - Sandustry Modding API.html`.
Prefer **`api.grid`**; live **`api.world`** is a **deprecated alias** of grid mutate/dims plus `pickups`, `runWhenSimulationIdle`, `redrawAroundCellWhenIdle` (`world.mutate === grid.mutate` on live 0.5.5).

`sandkit.apiVersion` is **1**.
Enums on this build: AbilityType, ActionState, ActionType, AuthorizationType, BuildMode, BuildingClearance, CellType, ComponentId, DroneType, ElementType (**Gloom**), ItemId, ItemType, KeyBinding, KeyState, MatterType, PickupType (**Stratacore**), ProjectileType, ReloadType, Scene, StructureType, Tech (221 keys), TechStatus, WorldItemType.
ComponentId: 31 keys.
