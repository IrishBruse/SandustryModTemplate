# player

**`Internal`**

Shared `sandkit.api.player` base — player position and collision queries.

 Base namespace reused by main and worker declarations.

## Functions

### getWorldPosition()

```ts
getWorldPosition(): Vector2
```

Defined in: [shared/api/player.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/player.d.ts#L13)

Return the player center position in world pixels.

#### Returns

[`Vector2`](api/shared/player/README.md#vector2)

World position as `{ x, y }` in pixels.

***

### isCollidingWithCell()

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

### isWithinRadiusOfCell()

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
