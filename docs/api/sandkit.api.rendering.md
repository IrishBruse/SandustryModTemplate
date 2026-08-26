# sandkit.api.rendering

## Functions <!-- {docsify-ignore} -->

### sandkit.api.rendering.getDrawPositionAtCell() :id=getdrawpositionatcell

```ts
getDrawPositionAtCell(...args: CellCoordinates): Vector2
```

Defined in: [sandkit/api/rendering.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/rendering.d.ts#L16)

Return screen draw position for a grid cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

[`Vector2`](api/shared.player.md#vector2)

***

### sandkit.api.rendering.getGridMetrics() :id=getgridmetrics

```ts
getGridMetrics(): object
```

Defined in: [sandkit/api/rendering.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/rendering.d.ts#L18)

Return cell size and snap grid metrics.

#### Returns

`object`

##### cellSize

```ts
cellSize: number
```

##### snapGridCellSize

```ts
snapGridCellSize: number
```

***

### sandkit.api.rendering.getOverlayViewportSize() :id=getoverlayviewportsize

```ts
getOverlayViewportSize(): object
```

Defined in: [sandkit/api/rendering.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/rendering.d.ts#L20)

Return overlay viewport width and height in pixels.

#### Returns

`object`

##### width

```ts
width: number
```

##### height

```ts
height: number
```

***

### sandkit.api.rendering.withOverlayContext() :id=withoverlaycontext

```ts
withOverlayContext<T>(callback: (context: CanvasRenderingContext2D) => T): T
```

Defined in: [sandkit/api/rendering.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/rendering.d.ts#L25)

Run a callback with the overlay canvas context.

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

(`context`: `CanvasRenderingContext2D`) => `T`

Receives the overlay 2D context; return value is passed through.

#### Returns

`T`
