# Drones

## Store model

`store.drones` is a flat array.
Each drone:

| Field    | Type             | Notes                                                            |
| -------- | ---------------- | ---------------------------------------------------------------- |
| `id`     | number           | From `store.meta.nextId.drone`.                                  |
| `type`   | number or string | Built-in: `sandkit.enums.DroneType`. Sweeper uses mod string id. |
| `x`, `y` | number           | World pixels.                                                    |
| `data`   | object           | Type-specific state bag.                                         |

### `DroneType` (built-in)

| Name   | Value |
| ------ | ----- |
| Digger | 1     |
| Hauler | 2     |

### Hauler `data` (from bundle)

`movingToTarget`, `currentSpeed`, `pauseTimer`, `inventory` (grabber-style cell grid).
Sprite toggles `hauler` / `haulerClosed` when `inventory.amount > 0`.

### Sweeper (mod)

Item id `sweeperDroneLauncher`.
Drone `type` is a mod string (not `DroneType`). `data` holds origin, drop-off positions, inventory with `hasItem`.
Uses `sandkit.config("sweeperDrone", …)` for limits.
UI: hotbar overlay hints (`mods|sweeperDrone|*` keys).

## Engine API

`sandkit.engine.api.drones` - **internal**, state-first.

| Method                                         | Role                                            |
| ---------------------------------------------- | ----------------------------------------------- |
| `spawn(state, type, x, y, data?, spriteOpts?)` | Push to `store.drones`, refresh DroneAdminList. |
| `kill(state, drone)`                           | Remove from store and sprites.                  |

**No public `sandkit.api.drones`.** Mods use items with `onDroneUpdate` hooks on `sandkit.mods.items[type]`.

## UI

`ComponentId.DroneAdminList` (18) - management screen for haulers.
See **sandustry-ui** overlay table.

## Update loop

Each frame: `onDroneUpdate` mod hook, else hauler sim.
Sprite position = `drone.x/y - camera`.
