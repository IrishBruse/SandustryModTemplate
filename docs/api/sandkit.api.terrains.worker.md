# sandkit.api.terrains (worker)

**`Internal`**

Shared `sandkit.api.terrains` base — terrain type lookup and cell mutation.

 Base namespace reused by main and worker declarations.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.terrains.TerrainMutationOptions (worker) :id=terrainmutationoptions

Defined in: [shared/api/terrains.d.ts:87](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L87)

Options for terrain create, replace, or remove calls.

#### Properties

##### skipShadow?

```ts
optional skipShadow?: boolean
```

Defined in: [shared/api/terrains.d.ts:89](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L89)

Skip shadow updates around the changed cell.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.terrains.getTypeFromId() (worker) :id=gettypefromid

```ts
getTypeFromId(terrainId: string): number
```

Defined in: [shared/api/terrains.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L14)

Resolve a terrain string id to a numeric cell type.

#### Parameters

##### terrainId

`string`

Mod-registered or built-in terrain id.

#### Returns

`number`

Numeric terrain cell type.

***

### sandkit.api.terrains.getTypeAtCell() (worker) :id=gettypeatcell

```ts
getTypeAtCell(...args: CellCoordinates): number | null
```

Defined in: [shared/api/terrains.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L21)

Return the terrain cell type at a cell, or null when none.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`number` \| `null`

***

### sandkit.api.terrains.getDataAtCell() (worker) :id=getdataatcell

```ts
getDataAtCell(...args: CellCoordinates): { cellType: number; hp: number | null; } | null
```

Defined in: [shared/api/terrains.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L29)

Return terrain cell type and hit points at a cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

\{ `cellType`: `number`; `hp`: `number` \| `null`; \} \| `null`

Cell type and hp, or null when the cell is not terrain.

***

### sandkit.api.terrains.isAtCell() (worker) :id=isatcell

```ts
isAtCell(...args: CellCoordinates): boolean
```

Defined in: [shared/api/terrains.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L36)

Return true when any terrain occupies the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`boolean`

***

### sandkit.api.terrains.isTypeAtCell() (worker) :id=istypeatcell

```ts
isTypeAtCell(...args: [number, number, string]): boolean
```

Defined in: [shared/api/terrains.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L44)

Return true when the cell terrain matches the given id.

#### Parameters

##### args

...\[`number`, `number`, `string`\]

#### Returns

`boolean`

***

### sandkit.api.terrains.isCellIdTerrain() (worker) :id=iscellidterrain

```ts
isCellIdTerrain(cellId: number): boolean
```

Defined in: [shared/api/terrains.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L50)

Return true when a packed cell id refers to terrain.

#### Parameters

##### cellId

`number`

Packed cell id from [world.getCellIdAtCell](api/sandkit.api.world.worker.md#getcellidatcell).

#### Returns

`boolean`

***

### sandkit.api.terrains.damageAtCell() (worker) :id=damageatcell

```ts
damageAtCell(...args: [number, number, number]): void
```

Defined in: [shared/api/terrains.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L58)

Apply damage to terrain at a cell.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`void`

***

### sandkit.api.terrains.createAtCell() (worker) :id=createatcell

```ts
createAtCell(...args: number, number, string | number, [TerrainMutationOptions]): void
```

Defined in: [shared/api/terrains.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L67)

Place terrain at an empty cell.

#### Parameters

##### args

...\[`number`, `number`, `string` \| `number`, [`TerrainMutationOptions`](#terrainmutationoptions)\]

#### Returns

`void`

***

### sandkit.api.terrains.replaceAtCell() (worker) :id=replaceatcell

```ts
replaceAtCell(...args: number, number, string | number, [TerrainMutationOptions]): void
```

Defined in: [shared/api/terrains.d.ts:76](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L76)

Replace existing terrain at a cell.

#### Parameters

##### args

...\[`number`, `number`, `string` \| `number`, [`TerrainMutationOptions`](#terrainmutationoptions)\]

#### Returns

`void`

***

### sandkit.api.terrains.removeAtCell() (worker) :id=removeatcell

```ts
removeAtCell(...args: number, number, [TerrainMutationOptions]): void
```

Defined in: [shared/api/terrains.d.ts:84](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/terrains.d.ts#L84)

Remove terrain from a cell.

#### Parameters

##### args

...\[`number`, `number`, [`TerrainMutationOptions`](#terrainmutationoptions)\]

#### Returns

`void`
