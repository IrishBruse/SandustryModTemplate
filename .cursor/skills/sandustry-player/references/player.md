# Player

`store.player` is the live physics snapshot. `sandkit.api.player` is the public write/read API. Types: `node_modules/@sandustry-modding/types/src/shared/player.d.ts`, https://sandustry-modding.github.io/SandustryTypes/#/.

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

Canonical names from official HTML. Deprecated aliases remain on the live object (same function reference where noted).

| Method                               | Arity | Notes                                                                                                                                                                                                          |
| ------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getPositionAtWorld()`               | 0     | `{ x, y }` world pixels                                                                                                                                                                                        |
| `setPositionAtWorld(x, y)`           | 2     | **mutate**; alias `setWorldPosition`                                                                                                                                                                           |
| `setVelocity(vx, vy)`                | 2     | **mutate**                                                                                                                                                                                                     |
| `setMovementSpeedMultiplier(n)`      | 1     | `1` = walk; `0` freezes, vanilla sprint needs `1`                                                                                                                                                              |
| `setMovementMode("normal"\|"hover")` | 1     | **mutate**; returns changed                                                                                                                                                                                    |
| `isOnGround()`                       | 0     | Solid cell 1px below hitbox                                                                                                                                                                                    |
| `teleportToGround()`                 | 0     | **mutate**                                                                                                                                                                                                     |
| `isPositionClearAtWorld(x, y)`       | 2     | Hitbox fits, alias `isWorldPositionClear`                                                                                                                                                                      |
| `isCollidingWithCell(x, y)`          | 2     | Worker-shared                                                                                                                                                                                                  |
| `isWithinRadiusOfCell(x, y, r)`      | 3     | Worker-shared                                                                                                                                                                                                  |
| `inventory.hasById(itemId)`          | 1     | Numeric `ItemId` only on live (`1` Shovel true). Enum names and slugs (`"Shovel"`, `"shovel"`) return **false**. Missing tools on this save (Shotgun, Teleporter, PipeRemover, MegaShotgun) also return false. |
| `inventory.addById(itemId)`          | 1     | **mutate**; alias `addFromId`                                                                                                                                                                                  |
| `buildings.unlockById(structureId)`  | 1     | **mutate**; alias `unlockByType`                                                                                                                                                                               |
| `buildings.removeById(structureId)`  | 1     | **mutate**                                                                                                                                                                                                     |

Aliases confirmed live (0.5.5): `getPositionAtWorld` === `getWorldPosition`; `inventory.addById` === `addFromId`; `buildings.unlockById` === `unlockByType`.

## Engine twin

`sandkit.engine.api.player` mirrors the API with **state first**: `getPosition(state)`, `setPosition(state, x, y)`, `isPositionClear(state, x, y)`, etc. Prefer `sandkit.api` in probes unless you already hold `state`.

## `sandkit.api.cooldown`

| Method                                   | Arity | Notes                                                     |
| ---------------------------------------- | ----- | --------------------------------------------------------- |
| `start(cooldown)`                        | 1     | **mutate** - arm cooldown; HTML deprecated alias: `check` |
| `isReady(cooldown, durationOverrideMs?)` | 2     | Read whether elapsed time allows reuse                    |

Live 0.5.5: `start` and `check` are separate functions (not same reference). `store.player.cooldowns` holds `boostParticle`, `hoverParticle`, `slowdown` objects passed to these methods.

## Player sprite tint

There is no public Sandkit API to tint the vanilla player body. Mods can reach the Pixi sprites on the main thread while the game scene is active:

```text
sandkit.state.session.rendering.pixi.sprites.player
```

Useful display objects: `body`, `weapon`, `forearm`, `container`. Each part exposes Pixi `tint` as a packed RGB integer (`0xffffff` is the default white).

```ts
const playerSprites = (
  sandkit.state.session as {
    rendering?: { pixi?: { sprites?: { player?: { body?: { tint?: number } } } } };
  }
).rendering?.pixi?.sprites?.player;

if (playerSprites?.body && typeof playerSprites.body.tint === "number") {
  playerSprites.body.tint = 0xff6622;
}
```

Reset tint to `0xffffff` when the effect ends so later frames do not keep the colour. This is **main-thread only**. Prefer `sandkit.api.sprites` helpers when you attach **mod-owned** sprites to the player.
