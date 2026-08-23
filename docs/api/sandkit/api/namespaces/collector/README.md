# collector

`sandkit.api.collector` — collector structure value and pickup handling.
Main thread only.

## Functions

### getValueFromCellId()

```ts
getValueFromCellId(cellId: number): number
```

Defined in: [sandkit/api/collector.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/collector.d.ts#L12)

Returns the collector value for a cell id.

#### Parameters

##### cellId

`number`

Packed cell identifier.

#### Returns

`number`

***

### getValueByType()

```ts
getValueByType(elementType: number): number
```

Defined in: [sandkit/api/collector.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/collector.d.ts#L17)

Returns the collector value for an element type.

#### Parameters

##### elementType

`number`

Numeric element type id.

#### Returns

`number`

***

### isCellIdCollectable()

```ts
isCellIdCollectable(cellId: number): boolean
```

Defined in: [sandkit/api/collector.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/collector.d.ts#L22)

Returns true when the cell id can be collected.

#### Parameters

##### cellId

`number`

Packed cell identifier.

#### Returns

`boolean`

***

### isCellIdCollectableForSprite()

```ts
isCellIdCollectableForSprite(cellId: number): boolean
```

Defined in: [sandkit/api/collector.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/collector.d.ts#L27)

Returns true when the cell id can be collected for sprite display.

#### Parameters

##### cellId

`number`

Packed cell identifier.

#### Returns

`boolean`

***

### notifyPickupAtCell()

```ts
notifyPickupAtCell(...args: CellCoordinates): void
```

Defined in: [sandkit/api/collector.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/collector.d.ts#L33)

Notifies collector logic that a pickup happened at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`
