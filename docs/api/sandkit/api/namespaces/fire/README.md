# sandkit.api.fire

`sandkit.api.fire` — ignite and burn elements at grid cells.
Main thread only.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.fire.canBurnElementAtCell() :id=canburnelementatcell

```ts
canBurnElementAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/fire.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/fire.d.ts#L13)

Returns true when the element at the cell can burn.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### sandkit.api.fire.burnElementAtCellWhenIdle() :id=burnelementatcellwhenidle

```ts
burnElementAtCellWhenIdle(...args: CellCoordinates): void
```

Defined in: [sandkit/api/fire.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/fire.d.ts#L19)

Queues a burn at the cell when the simulation is idle.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`

***

### sandkit.api.fire.burnElementAtCell() :id=burnelementatcell

```ts
burnElementAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/fire.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/fire.d.ts#L25)

Burns the element at the cell immediately. Returns true on success.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`
