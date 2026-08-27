# Enums

Live on `sandkit.enums`. Types: `node_modules/@sandustry-modding/types/sandkit/enums/index.d.ts`. Reference: https://sandustry-modding.github.io/SandustryTypes/#/.

## DroneType

Autonomous drone kinds in `store.drones[].type`.

| Member | Value |
| ------ | ----- |
| Digger | 1     |
| Hauler | 2     |

Sweeper drones use a mod string type, not this enum.

## ProjectileType

`store.projectiles[].type`.

| Member        | Value |
| ------------- | ----- |
| Bullet        | 1     |
| Rocket        | 2     |
| GrapplingHook | 3     |
| Fire          | 4     |
| Digger        | 5     |
| Mod           | 6     |

Mod projectiles set `type: Mod` and carry `mods` payload keyed by registered string id.

## WorldItemType

`store.worldItems[].type` and `world.pickups.spawnAtWorld` first arg.

| Member     | Value |
| ---------- | ----- |
| Artifact   | 1     |
| GlyphKey   | 2     |
| Stratacore | 3     |
| Orb        | 4     |

## Creature typeIds (not enums)

String keys in `entities` and `store.creatures`: `lumling`, `shinelet`, `resinWeaver`, `eyes`, `voidgrazer`. See `entities.md`.
