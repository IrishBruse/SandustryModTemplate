# sandkit.api.building

`sandkit.api.building` — structure placement and built-in structure types.
Main thread only.

## Enumerations <!-- {docsify-ignore} -->

- [StructureType](api/sandkit.api.building.StructureType.md)

## Functions <!-- {docsify-ignore} -->

### sandkit.api.building.getSnappedPositionAtCell() :id=getsnappedpositionatcell

```ts
getSnappedPositionAtCell(...args: CellCoordinates): Vector2
```

Defined in: [sandkit/api/building.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/building.d.ts#L72)

Return the snapped world position for placement at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

[`Vector2`](api/shared.player.md#vector2)

Snapped world position in pixels.

***

### sandkit.api.building.isBlockedAtCell() :id=isblockedatcell

```ts
isBlockedAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/building.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/building.d.ts#L80)

Return true when placement is blocked at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`boolean`

True when a structure cannot be placed at the cell.

***

### sandkit.api.building.cancelPlacement() :id=cancelplacement

```ts
cancelPlacement(): void
```

Defined in: [sandkit/api/building.d.ts:83](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/building.d.ts#L83)

Cancel the current structure placement preview.

#### Returns

`void`

***

### sandkit.api.building.selectStructure() :id=selectstructure

```ts
selectStructure(structureTypeOrId: string | StructureType): string | StructureType | null
```

Defined in: [sandkit/api/building.d.ts:90](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/building.d.ts#L90)

Select a structure for placement by type or id.

#### Parameters

##### structureTypeOrId

`string` \| [`StructureType`](api/sandkit.api.building.StructureType.md)

Built-in [StructureType](api/sandkit.api.building.StructureType.md) value or registered structure id.

#### Returns

`string` \| [`StructureType`](api/sandkit.api.building.StructureType.md) \| `null`

Resolved selection, or null when the type or id is invalid.
