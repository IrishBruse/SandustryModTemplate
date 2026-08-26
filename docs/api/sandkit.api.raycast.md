# sandkit.api.raycast

## Functions <!-- {docsify-ignore} -->

### sandkit.api.raycast.castFromWorld() :id=castfromworld

```ts
castFromWorld(startWorldX: number, startWorldY: number, angle: number, maxDistance: number): Vector2 & object | null
```

Defined in: [sandkit/api/raycast.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/raycast.d.ts#L18)

Cast a ray from world position. Return hit point and distance, or null.

#### Parameters

##### startWorldX

`number`

Ray origin world X in pixels.

##### startWorldY

`number`

Ray origin world Y in pixels.

##### angle

`number`

Ray direction in radians.

##### maxDistance

`number`

Maximum ray length in pixels.

#### Returns

[`Vector2`](api/shared.player.md#vector2) & `object` \| `null`
