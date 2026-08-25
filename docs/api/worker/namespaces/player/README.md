# sandkit.api.player (worker)

**`Internal`**

Shared `sandkit.api.player` base — player position and collision queries.

 Base namespace reused by main and worker declarations.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.player.getWorldPosition() (worker) :id=getworldposition

```ts
getWorldPosition(): Vector2
```

Defined in: [shared/api/player.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/player.d.ts#L13)

Return the player center position in world pixels.

#### Returns

[`Vector2`](api/shared/player/README.md#vector2)

World position as `{ x, y }` in pixels.

***

### sandkit.api.player.isCollidingWithCell() (worker) :id=iscollidingwithcell

```ts
isCollidingWithCell(...args: CellCoordinates): boolean
```

Defined in: [shared/api/player.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/player.d.ts#L21)

Return true when the player hitbox overlaps the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

True when the player overlaps the cell.

***

### sandkit.api.player.isWithinRadiusOfCell() (worker) :id=iswithinradiusofcell

```ts
isWithinRadiusOfCell(...args: [number, number, number]): boolean
```

Defined in: [shared/api/player.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/player.d.ts#L30)

Return true when the player is within `radius` cells of the point.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`boolean`

True when the player is inside the radius.
