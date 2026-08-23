# grid

`sandkit.api.grid` — iterate cells in rectangular and circular regions.
Main thread only.

## Functions

### forEachCellInRect()

```ts
forEachCellInRect(...args: number, number, number, number, (...args: [CellCoordinates) => void]): void
```

Defined in: [sandkit/api/grid.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/grid.d.ts#L16)

Calls the callback for each cell in a rectangle.

#### Parameters

##### args

...\[`number`, `number`, `number`, `number`, (...`args`: [`CellCoordinates`](api/shared/player/README.md#cellcoordinates)) => `void`\]

#### Returns

`void`

***

### forEachCellInCircle()

```ts
forEachCellInCircle(centerCellX: number, centerCellY: number, radius: number, callback: (...args: CellCoordinates) => void): void
```

Defined in: [sandkit/api/grid.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/grid.d.ts#L25)

Calls the callback for each cell inside a circle.

#### Parameters

##### centerCellX

`number`

Circle center cell column.

##### centerCellY

`number`

Circle center cell row.

##### radius

`number`

Circle radius in cells.

##### callback

(...`args`: [`CellCoordinates`](api/shared/player/README.md#cellcoordinates)) => `void`

Invoked for each cell with `(cellX, cellY)`.

#### Returns

`void`
