# Player

`store.player` is the live physics snapshot. `sandkit.api.player` is the public write/read API. Types: `node_modules/@sandustry-modding/types/shared/player.d.ts`, https://sandustry-modding.github.io/SandustryTypes/#/.

## `store.player` (live keys)

| Field                   | Role                                              |
| ----------------------- | ------------------------------------------------- |
| `x`, `y`                | Hitbox top-left in world pixels                   |
| `width`, `height`       | Hitbox size (1230 vanilla)                        |
| `velocity`, `threshold` | Movement vectors                                  |
| `onGround`              | **Stale in play** - use `api.player.isOnGround()` |
| `speedCapOverdrive`     | Per-axis sprint cap bonuses                       |
| `inventory`             | 120 toolbox slots (`InventoryItem[]`)             |
| `buildings`             | Unlocked structure type ids (`number[]`)          |
| `tech`                  | Tech tree node map                                |
| `action`                | Usually `null`; active use is in `session.action` |
| `hotbar`                | See `items.md`                                    |
| `grapplingHook`         | Hook equipped/active flag                         |
| `cooldowns`             | `boostParticle`, `hoverParticle`, `slowdown`      |
| `isHovering`            | Hover flight mode                                 |
| `weaponsMeta`           | e.g. `rocketLauncher.ammo`                        |

## `sandkit.api.player`

| Method                               | Arity | Notes                                             |
| ------------------------------------ | ----- | ------------------------------------------------- |
| `getPositionAtWorld()`               | 0     | `{ x, y }` world pixels                           |
| `setPositionAtWorld(x, y)`           | 2     | **mutate**                                        |
| `setVelocity(vx, vy)`                | 2     | **mutate**                                        |
| `setMovementSpeedMultiplier(n)`      | 1     | `1` = walk; `0` freezes, vanilla sprint needs `1` |
| `setMovementMode("normal"\|"hover")` | 1     | **mutate**; returns changed                       |
| `isOnGround()`                       | 0     | Solid cell 1px below hitbox                       |
| `teleportToGround()`                 | 0     | **mutate**                                        |
| `isPositionClearAtWorld(x, y)`       | 2     | Hitbox fits                                       |
| `isCollidingWithCell(x, y)`          | 2     | Worker-shared                                     |
| `isWithinRadiusOfCell(x, y, r)`      | 3     | Worker-shared                                     |
| `inventory.addById(itemId)`          | 1     | **mutate**                                        |
| `buildings.unlockById(structureId)`  | 1     | **mutate**                                        |

## Engine twin

`sandkit.engine.api.player` mirrors the API with **state first**: `getPosition(state)`, `setPosition(state, x, y)`, `isPositionClear(state, x, y)`, etc. Prefer `sandkit.api` in probes unless you already hold `state`.
