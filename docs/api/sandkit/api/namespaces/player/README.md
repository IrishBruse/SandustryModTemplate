# sandkit.api.player

## Namespaces <!-- {docsify-ignore} -->

| Namespace | Description |
| ------ | ------ |
| [inventory](api/sandkit/api/namespaces/player/namespaces/inventory/README.md) | Player inventory helpers. |
| [buildings](api/sandkit/api/namespaces/player/namespaces/buildings/README.md) | Player building unlock helpers. |

## Functions <!-- {docsify-ignore} -->

### sandkit.api.player.setWorldPosition() :id=setworldposition

```ts
setWorldPosition(worldX: number, worldY: number): void
```

Defined in: [sandkit/api/player.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L25)

Set the player world position.

#### Parameters

##### worldX

`number`

World x position in pixels.

##### worldY

`number`

World y position in pixels.

#### Returns

`void`

***

### sandkit.api.player.setVelocity() :id=setvelocity

```ts
setVelocity(velocityX: number, velocityY: number): void
```

Defined in: [sandkit/api/player.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L32)

Set the player velocity.

#### Parameters

##### velocityX

`number`

Horizontal velocity in pixels per second.

##### velocityY

`number`

Vertical velocity in pixels per second.

#### Returns

`void`

***

### sandkit.api.player.setMovementSpeedMultiplier() :id=setmovementspeedmultiplier

```ts
setMovementSpeedMultiplier(multiplier: number): void
```

Defined in: [sandkit/api/player.d.ts:39](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L39)

Set the movement speed multiplier.

#### Parameters

##### multiplier

`number`

Speed scale factor (`1` is default walk). `0` freezes movement.
Vanilla Sprint Boost (Shift burst + meter) only runs when this value is exactly `1`.

#### Returns

`void`

***

### sandkit.api.player.setMovementMode() :id=setmovementmode

```ts
setMovementMode(mode: "normal" | "hover"): boolean
```

Defined in: [sandkit/api/player.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L46)

Set movement mode to normal or hover.

#### Parameters

##### mode

`"normal"` \| `"hover"`

`"normal"` for default physics, or `"hover"` for hover flight.

#### Returns

`boolean`

True when the mode changes.

***

### sandkit.api.player.isOnGround() :id=isonground

```ts
isOnGround(): boolean
```

Defined in: [sandkit/api/player.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L54)

Return true when the player is on ground.
Tests solid cells 1 pixel below the hitbox. Do not use `player.onGround`
on the store snapshot — that flag is not updated during play.

#### Returns

`boolean`

True when the player touches solid ground.

***

### sandkit.api.player.teleportToGround() :id=teleporttoground

```ts
teleportToGround(): void
```

Defined in: [sandkit/api/player.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L57)

Move the player down until ground is found.

#### Returns

`void`

***

### sandkit.api.player.isWorldPositionClear() :id=isworldpositionclear

```ts
isWorldPositionClear(worldX: number, worldY: number): boolean
```

Defined in: [sandkit/api/player.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/player.d.ts#L65)

Return true when the world position has no collision.

#### Parameters

##### worldX

`number`

World x position in pixels to test.

##### worldY

`number`

World y position in pixels to test.

#### Returns

`boolean`

True when the player hitbox fits at the position.

## References <!-- {docsify-ignore} -->

### sandkit.api.player.getWorldPosition :id=getworldposition

Re-exports [getWorldPosition](api/worker/namespaces/player/README.md#getworldposition)

***

### sandkit.api.player.isCollidingWithCell :id=iscollidingwithcell

Re-exports [isCollidingWithCell](api/worker/namespaces/player/README.md#iscollidingwithcell)

***

### sandkit.api.player.isWithinRadiusOfCell :id=iswithinradiusofcell

Re-exports [isWithinRadiusOfCell](api/worker/namespaces/player/README.md#iswithinradiusofcell)
