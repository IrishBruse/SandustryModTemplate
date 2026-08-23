# utils

## Functions

### getDistance()

```ts
getDistance(pointA: Vector2, pointB: Vector2): number
```

Defined in: [sandkit/api/utils.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L16)

Return distance between two points.

#### Parameters

##### pointA

[`Vector2`](api/shared/player/README.md#vector2)

First point.

##### pointB

[`Vector2`](api/shared/player/README.md#vector2)

Second point.

#### Returns

`number`

***

### getDirection()

```ts
getDirection(pointA: Vector2, pointB: Vector2): Vector2
```

Defined in: [sandkit/api/utils.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L22)

Return normalized direction from point A to point B.

#### Parameters

##### pointA

[`Vector2`](api/shared/player/README.md#vector2)

Origin point.

##### pointB

[`Vector2`](api/shared/player/README.md#vector2)

Target point.

#### Returns

[`Vector2`](api/shared/player/README.md#vector2)

***

### getAngle()

```ts
getAngle(pointA: Vector2, pointB: Vector2): number
```

Defined in: [sandkit/api/utils.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L28)

Return angle in radians from point A to point B.

#### Parameters

##### pointA

[`Vector2`](api/shared/player/README.md#vector2)

Origin point.

##### pointB

[`Vector2`](api/shared/player/README.md#vector2)

Target point.

#### Returns

`number`

***

### getCoordinatesBetweenPoints()

```ts
getCoordinatesBetweenPoints(pointA: Vector2, pointB: Vector2): Vector2[]
```

Defined in: [sandkit/api/utils.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/utils.d.ts#L34)

Return grid cells along a line between two points.

#### Parameters

##### pointA

[`Vector2`](api/shared/player/README.md#vector2)

Line start in cell or world coordinates.

##### pointB

[`Vector2`](api/shared/player/README.md#vector2)

Line end in cell or world coordinates.

#### Returns

[`Vector2`](api/shared/player/README.md#vector2)[]
