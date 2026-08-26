# sandkit.api.terrains

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.terrains.TerrainDefinition :id=terraindefinition

Defined in: [sandkit/api/terrains.d.ts:95](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L95)

Terrain definition shape for [register](#register) and [updateDefinition](#updatedefinition).

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/api/terrains.d.ts:97](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L97)

Unique mod-scoped terrain id.

##### nameKey?

```ts
optional nameKey?: string
```

Defined in: [sandkit/api/terrains.d.ts:99](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L99)

i18n key for the terrain display name.

##### hp?

```ts
optional hp?: number
```

Defined in: [sandkit/api/terrains.d.ts:101](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L101)

Default terrain hit points.

##### materialId?

```ts
optional materialId?: number
```

Defined in: [sandkit/api/terrains.d.ts:103](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L103)

Material id used for rendering. Must be > obstacle breakpoint and < 150.

##### metaColor?

```ts
optional metaColor?: number
```

Defined in: [sandkit/api/terrains.d.ts:105](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L105)

UI/meta color as 0xRRGGBB.

##### colorHSL?

```ts
optional colorHSL?: [number, number, number]
```

Defined in: [sandkit/api/terrains.d.ts:107](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L107)

Base terrain color as HSL components.

##### excavationRequirements?

```ts
optional excavationRequirements?: readonly string[]
```

Defined in: [sandkit/api/terrains.d.ts:109](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L109)

Tool item ids required to excavate this terrain.

##### interactions?

```ts
optional interactions?: readonly Interaction[]
```

Defined in: [sandkit/api/terrains.d.ts:111](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L111)

Tooltip interactions shown for this terrain.

##### output?

```ts
optional output?: object
```

Defined in: [sandkit/api/terrains.d.ts:113](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L113)

Default element drop when the terrain is destroyed.

###### elementType

```ts
elementType: number
```

###### chance

```ts
chance: number
```

## Functions <!-- {docsify-ignore} -->

### sandkit.api.terrains.register() :id=register

```ts
register(definition: TerrainDefinition): object
```

Defined in: [sandkit/api/terrains.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L42)

Register a new terrain definition.

#### Parameters

##### definition

[`TerrainDefinition`](#terraindefinition)

Terrain definition to register.

#### Returns

`object`

Object with the assigned `cellType`.

##### cellType

```ts
cellType: number
```

***

### sandkit.api.terrains.updateDefinition() :id=updatedefinition

```ts
updateDefinition(cellTypeOrId: string | number, partial: Partial<TerrainDefinition>): void
```

Defined in: [sandkit/api/terrains.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L49)

Patch fields on an existing terrain definition.

#### Parameters

##### cellTypeOrId

`string` \| `number`

Numeric cell type or terrain string id.

##### partial

`Partial`\<[`TerrainDefinition`](#terraindefinition)\>

Fields to merge onto the definition.

#### Returns

`void`

***

### sandkit.api.terrains.createAtCellWhenIdle() :id=createatcellwhenidle

```ts
createAtCellWhenIdle(...args: number, number, string | number, [TerrainMutationOptions]): void
```

Defined in: [sandkit/api/terrains.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L58)

Create terrain at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `string` \| `number`, [`TerrainMutationOptions`](api/sandkit.api.terrains.worker.md#terrainmutationoptions)\]

#### Returns

`void`

***

### sandkit.api.terrains.replaceAtCellWhenIdle() :id=replaceatcellwhenidle

```ts
replaceAtCellWhenIdle(...args: number, number, string | number, [TerrainMutationOptions]): void
```

Defined in: [sandkit/api/terrains.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L67)

Replace terrain at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `string` \| `number`, [`TerrainMutationOptions`](api/sandkit.api.terrains.worker.md#terrainmutationoptions)\]

#### Returns

`void`

***

### sandkit.api.terrains.removeAtCellWhenIdle() :id=removeatcellwhenidle

```ts
removeAtCellWhenIdle(...args: number, number, [TerrainMutationOptions]): void
```

Defined in: [sandkit/api/terrains.d.ts:75](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L75)

Remove terrain at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`TerrainMutationOptions`](api/sandkit.api.terrains.worker.md#terrainmutationoptions)\]

#### Returns

`void`

***

### sandkit.api.terrains.setHpAtCellWhenIdle() :id=sethpatcellwhenidle

```ts
setHpAtCellWhenIdle(...args: [number, number, number]): void
```

Defined in: [sandkit/api/terrains.d.ts:83](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L83)

Set terrain hit points at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`void`

***

### sandkit.api.terrains.setHpAtCell() :id=sethpatcell

```ts
setHpAtCell(...args: [number, number, number]): boolean
```

Defined in: [sandkit/api/terrains.d.ts:92](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L92)

Set terrain hit points at a cell immediately.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`boolean`

True when hp changed or the terrain was removed.

## References <!-- {docsify-ignore} -->

### sandkit.api.terrains.getTypeFromId :id=gettypefromid

Re-exports [getTypeFromId](api/sandkit.api.terrains.worker.md#gettypefromid)

***

### sandkit.api.terrains.getTypeAtCell :id=gettypeatcell

Re-exports [getTypeAtCell](api/sandkit.api.terrains.worker.md#gettypeatcell)

***

### sandkit.api.terrains.getDataAtCell :id=getdataatcell

Re-exports [getDataAtCell](api/sandkit.api.terrains.worker.md#getdataatcell)

***

### sandkit.api.terrains.isAtCell :id=isatcell

Re-exports [isAtCell](api/sandkit.api.terrains.worker.md#isatcell)

***

### sandkit.api.terrains.isTypeAtCell :id=istypeatcell

Re-exports [isTypeAtCell](api/sandkit.api.terrains.worker.md#istypeatcell)

***

### sandkit.api.terrains.isCellIdTerrain :id=iscellidterrain

Re-exports [isCellIdTerrain](api/sandkit.api.terrains.worker.md#iscellidterrain)

***

### sandkit.api.terrains.damageAtCell :id=damageatcell

Re-exports [damageAtCell](api/sandkit.api.terrains.worker.md#damageatcell)

***

### sandkit.api.terrains.createAtCell :id=createatcell

Re-exports [createAtCell](api/sandkit.api.terrains.worker.md#createatcell)

***

### sandkit.api.terrains.replaceAtCell :id=replaceatcell

Re-exports [replaceAtCell](api/sandkit.api.terrains.worker.md#replaceatcell)

***

### sandkit.api.terrains.removeAtCell :id=removeatcell

Re-exports [removeAtCell](api/sandkit.api.terrains.worker.md#removeatcell)

***

### sandkit.api.terrains.TerrainMutationOptions :id=terrainmutationoptions

Re-exports [TerrainMutationOptions](api/sandkit.api.terrains.worker.md#terrainmutationoptions)
