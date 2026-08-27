# Store

`sandkit.state.store` holds live runtime arrays. Types: `node_modules/@sandustry-modding/types/sandkit/engine/state.d.ts` (thin stubs).

## Entity-related keys

| Key           | Shape                                  | Notes                                                   |
| ------------- | -------------------------------------- | ------------------------------------------------------- |
| `drones`      | `Drone[]`                              | Autonomous units (digger, hauler, sweeper mod).         |
| `projectiles` | `Projectile[]`                         | Weapon and tool shots.                                  |
| `worldItems`  | `WorldItem[]`                          | Pickups in the world.                                   |
| `creatures`   | `Record<typeId, { available, found }>` | Conservatory inventory counts. Not live world entities. |

## `store.world` (related)

| Key             | Shape            | Notes                                                                     |
| --------------- | ---------------- | ------------------------------------------------------------------------- |
| `teleportZones` | `TeleportZone[]` | Prefab and runtime zones. Bidirectional zones get a linked reverse entry. |

## Session caches

| Key                            | Type            | Notes                                                                          |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------ |
| `session.teleportZoneCache`    | `Fn` (grid map) | Cell -> zone lookup. Built from `store.world.teleportZones` entry rects.       |
| `session.prefabWorldItemCache` | `Fn` (grid map) | Cell -> pending pickup spawn data before fog reveal. Cleared when item spawns. |

## Entity list (not in `store`)

Critters and swarm particles live in `sandkit.engine.api.entities.getAll(state)`.

Live 0.5.2 backing list: `store.mods.entities.list` (array of `{ id, type, x, y, ... }`). Clear with `.length = 0` for void-world wipes. `engine.api.entities.kill` is **not** on the live API — use list clear or re-probe after updates.

Types doc path `storage.ensure(state, "entities").list` may differ from live mod bag layout.

## IDs

`store.meta.nextId.drone`, `.projectile`, and entity `nextId` allocate runtime ids.

## Sprites

`session.rendering.pixi.sprites.drones[id]`, `.projectiles[id]`, `.worldItems[id]`, `.sprites.entities[id]` mirror store positions each frame.
