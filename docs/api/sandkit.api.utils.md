# sandkit.api.utils

## Functions <!-- {docsify-ignore} -->

### sandkit.api.utils.getDistance() :id=getdistance

```ts
getDistance(pointA: Vector2, pointB: Vector2): number
```

Defined in: [sandkit/api/utils.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L16)

Return distance between two points.

#### Parameters

##### pointA

[`Vector2`](api/shared.player.md#vector2)

First point.

##### pointB

[`Vector2`](api/shared.player.md#vector2)

Second point.

#### Returns

`number`

***

### sandkit.api.utils.getDirection() :id=getdirection

```ts
getDirection(pointA: Vector2, pointB: Vector2): Vector2
```

Defined in: [sandkit/api/utils.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L22)

Return normalized direction from point A to point B.

#### Parameters

##### pointA

[`Vector2`](api/shared.player.md#vector2)

Origin point.

##### pointB

[`Vector2`](api/shared.player.md#vector2)

Target point.

#### Returns

[`Vector2`](api/shared.player.md#vector2)

***

### sandkit.api.utils.getAngle() :id=getangle

```ts
getAngle(pointA: Vector2, pointB: Vector2): number
```

Defined in: [sandkit/api/utils.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L28)

Return angle in radians from point A to point B.

#### Parameters

##### pointA

[`Vector2`](api/shared.player.md#vector2)

Origin point.

##### pointB

[`Vector2`](api/shared.player.md#vector2)

Target point.

#### Returns

`number`

***

### sandkit.api.utils.getCoordinatesBetweenPoints() :id=getcoordinatesbetweenpoints

```ts
getCoordinatesBetweenPoints(pointA: Vector2, pointB: Vector2): Vector2[]
```

Defined in: [sandkit/api/utils.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L34)

Return grid cells along a line between two points.

#### Parameters

##### pointA

[`Vector2`](api/shared.player.md#vector2)

Line start in cell or world coordinates.

##### pointB

[`Vector2`](api/shared.player.md#vector2)

Line end in cell or world coordinates.

#### Returns

[`Vector2`](api/shared.player.md#vector2)[]
