# Entities

Capture critters, swarm particles, and mod-registered entity types.

## Public API (mods)

`sandkit.api.entities` - **main entry only** (not in Worker reference). Official signatures have **no state-first arg**.

| Method                                       | Role                                       |
| -------------------------------------------- | ------------------------------------------ |
| `getById(entityId)`                          | One live instance by runtime id.           |
| `getAllByType(entityTypeId)`                 | All instances of a string `entityTypeId`.  |
| `spawnAtWorld(entityTypeId, worldX, worldY)` | Create instance (unsafe without user ask). |
| `remove(entityId)`                           | Despawn (unsafe).                          |
| `launch(entityId, angleRadians, speed?)`     | Set motion and launch timers (unsafe).     |
| `startCapture(entityId)`                     | Begin corraller capture (unsafe).          |
| `collect(entityId)`                          | Force conservatory collect (unsafe).       |

There is **no** public `getAll()`. For read-only probes, use `getAllByType` per known `typeId`, or `engine.api.entities.getAll(state)` below.

Reference: https://sandustry.com/sandkit.html (`api.entities`).

## Engine API (internal)

`sandkit.engine.api.entities` - same domain, **state-first** on most calls. Still live on 0.5.5.

| Method                                                                    | Role                                  |
| ------------------------------------------------------------------------- | ------------------------------------- |
| `getAll(state)`                                                           | All live entity instances.            |
| `getAllByType(state, typeId)`                                             | Filter by string `typeId`.            |
| `getById(state, entityId)`                                                | One instance.                         |
| `getAllTypeDefs(state?)` / `getTypeDef(typeId)`                           | Registered type metadata.             |
| `getSprite(state, entityId)`                                              | Pixi sprite for one entity.           |
| `spawn(state, typeId, x, y, data?)`                                       | Create (unsafe). Optional 5th `data`. |
| `removeById(state, entityId)`                                             | Despawn (unsafe).                     |
| `launch(state, entity, angle, speed?)` / `launchById(state, entityId, …)` | Launch (unsafe).                      |
| `startCapture(state, entityId)`                                           | Capture (unsafe).                     |
| `collectById(state, entityId)`                                            | Collect (unsafe).                     |
| `registerType` / `registerSpawner`                                        | Mod registration (unsafe).            |
| `createLight`                                                             | Attach point light to entity.         |

Prefer public names for mod code. Map ids: public `remove`/`collect`/`launch` take `entityId`; engine often takes `state` first.

## Built-in creature `typeId` values (0.5.5)

| typeId        | sortOrder | Notes                                        |
| ------------- | --------- | -------------------------------------------- |
| `shinelet`    | 1         | Small light critter.                         |
| `lumling`     | 2         | Flying critter.                              |
| `resinWeaver` | 3         | Ground critter. Display name "Resin Weaver". |
| `eyes`        | 4         | Small swarm critter.                         |
| `voidgrazer`  | 5         | Large flying critter.                        |

Debug F3 lists "Redweaver" and "Voltblub" as creature buttons. Live `typeId` keys use the table above. `resinWeaver` may match the old "Redweaver" label. No live `voltblub` typeId found.

## Instance fields (common)

| Field             | Type    | Notes                    |
| ----------------- | ------- | ------------------------ |
| `id`              | number  | Runtime id.              |
| `type`            | string  | Same as `typeId`.        |
| `x`, `y`          | number  | World pixels.            |
| `vx`, `vy`        | number  | Velocity (flying types). |
| `capturing`       | boolean | Corraller vacuum active. |
| `captureProgress` | number  | 0-1 during capture.      |
| `lightIndex`      | number? | Attached point light.    |

Per-type fields include `targetX`/`targetY`, `phase`, `grazeFlash`, `playerReleased`, etc.

## `store.creatures` vs live entities

- **Live world:** `api.entities.getAllByType(typeId)` or `engine.api.entities.getAll(state)` - instances you can see and capture.
- **Inventory:** `store.creatures[typeId] = { available, found }` - conservatory counts. Updated on `entity:collected`. First find grants conservatory tickets.

## Capture flow (read-only observation)

1. Corraller tool calls `startCapture` -> sets `capturing`, `captureProgress`.
2. On complete -> increments `store.creatures[typeId]`, may toast first pickup, emits `entity:collected`.
3. Entity removed from the live list.

## Spawners

`registerSpawner` and prefab `entitySpawns` place prop entities at map load. Prop list cached in `storage.ensure(state, "entities")`.
