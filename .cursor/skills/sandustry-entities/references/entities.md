# Entities

`sandkit.engine.api.entities` - capture critters, swarm particles, and mod-registered types. **Internal.** State is first arg on every call.

Reference: https://sandustry-modding.github.io/SandustryTypes/#/. Types: `node_modules/@sandustry-modding/types/sandkit/engine/api/entities.d.ts`.

## Methods (live)

| Method                                    | Role                                       |
| ----------------------------------------- | ------------------------------------------ |
| `getAll(state)`                           | All live entity instances.                 |
| `getAllByType(state, typeId)`             | Filter by string `typeId`.                 |
| `getAllTypeDefs()` / `getTypeDef(typeId)` | Registered type metadata.                  |
| `getSprite(state, entityId)`              | Pixi sprite for one entity.                |
| `spawn(state, typeId, x, y, data?)`       | Create instance (unsafe without user ask). |
| `launch(state, entity, angle, speed?)`    | Set `vx`/`vy`, launch timers (unsafe).     |
| `startCapture(state, entityId)`           | Begin corraller capture (unsafe).          |
| `registerType` / `registerSpawner`        | Mod registration (unsafe).                 |
| `createLight`                             | Attach point light to entity.              |

## Built-in creature `typeId` values (0.5.2)

| typeId        | sortOrder | Notes                                        |
| ------------- | --------- | -------------------------------------------- |
| `lumling`     | 2         | Flying critter.                              |
| `shinelet`    | -         | Small light critter.                         |
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

- **Live world:** `entities.getAll(state)` - instances you can see and capture.
- **Inventory:** `store.creatures[typeId] = { available, found }` - conservatory counts. Updated on `entity:collected`. First find grants conservatory tickets.

## Capture flow (read-only observation)

1. Corraller tool calls `startCapture` -> sets `capturing`, `captureProgress`.
2. On complete -> increments `store.creatures[typeId]`, may toast first pickup, emits `entity:collected`.
3. Entity removed from `entities` list.

## Spawners

`registerSpawner` and prefab `entitySpawns` place prop entities at map load. Prop list cached in `storage.ensure(state, "entities")`.
