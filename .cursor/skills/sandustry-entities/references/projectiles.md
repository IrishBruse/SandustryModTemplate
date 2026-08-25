# Projectiles

## Store model

`store.projectiles` - active shots. Common fields (live 0.5.2):

| Field                | Type                  | Notes                                                              |
| -------------------- | --------------------- | ------------------------------------------------------------------ |
| `id`                 | number                | From `store.meta.nextId.projectile`.                               |
| `type`               | number                | `sandkit.enums.ProjectileType`.                                    |
| `x`, `y`             | number                | World pixels.                                                      |
| `initialAngle`       | number                | Degrees at spawn.                                                  |
| `velocity`           | `{ x, y }`            | Current motion.                                                    |
| `threshold`          | `{ x, y }`            | Hit detection offset.                                              |
| `duration`           | `{ max, left? }`      | Lifetime. `-1` = no expiry.                                        |
| `bounce`             | `{ enabled, factor }` | Wall bounce.                                                       |
| `gravity`            | `{ enabled, factor }` | Gravity toggle.                                                    |
| `rotateWithVelocity` | boolean               | Sprite rotation.                                                   |
| `ignoreUpgrades`     | boolean               | Skip upgrade modifiers.                                            |
| `attributes`         | object                | Per-type data (napalm, digger hp, trajectory origin, mod payload). |
| `mods`               | object?               | When `type === Mod`, keyed by mod projectile id.                   |

Sprite key: `session.rendering.pixi.sprites.projectiles[id]`. Built-in texture map: Bullet -> `"bullet"`, Rocket -> `"rocket"`, Digger -> `"digger"`.

## Public API

`sandkit.api.projectiles` - preferred for mods.

| Method                                 | Role                                         |
| -------------------------------------- | -------------------------------------------- |
| `register(definition)`                 | Add to `sandkit.mods.projectiles`.           |
| `getDefinitionById(id)`                | Lookup mod definition.                       |
| `createBlueprintFromId(id)`            | Build spawn blueprint (`opts`, `type: Mod`). |
| `getAll()`                             | `store.projectiles`.                         |
| `getById(id)`                          | One instance.                                |
| `spawnAtWorld(x, y, angle, blueprint)` | Spawn (unsafe without user ask).             |
| `remove(projectile)`                   | Despawn (unsafe).                            |

Engine overlap exposes `createBlueprint` and `spawn` with state-first signatures. Prefer public names above.

## Engine-only

No `sandkit.engine.api.projectiles` namespace. Projectile sim lives in the main store push/filter helpers.
