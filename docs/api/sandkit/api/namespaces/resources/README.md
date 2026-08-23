# resources

## Functions

### collectFluxiteAtCell()

```ts
collectFluxiteAtCell(...args: CellCoordinates): void
```

Defined in: [sandkit/api/resources.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/resources.d.ts#L16)

Collect fluxite at the given cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`

***

### updateEnergy()

```ts
updateEnergy(amount: number, options?: object): void
```

Defined in: [sandkit/api/resources.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/resources.d.ts#L22)

Update stored energy by amount with optional UI deferral.

#### Parameters

##### amount

`number`

Energy delta (positive or negative).

##### options?

When `deferUi` is true, skip immediate UI refresh.

###### deferUi?

`boolean`

#### Returns

`void`
