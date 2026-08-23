# terrains

## Interfaces

### TerrainDefinition

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

## Functions

### register()

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

### updateDefinition()

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

### createAtCellWhenIdle()

```ts
createAtCellWhenIdle(...args: number, number, string | number, [TerrainMutationOptions]): void
```

Defined in: [sandkit/api/terrains.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L58)

Create terrain at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `string` \| `number`, [`TerrainMutationOptions`](api/worker/namespaces/terrains/README.md#terrainmutationoptions)\]

#### Returns

`void`

***

### replaceAtCellWhenIdle()

```ts
replaceAtCellWhenIdle(...args: number, number, string | number, [TerrainMutationOptions]): void
```

Defined in: [sandkit/api/terrains.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L67)

Replace terrain at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `string` \| `number`, [`TerrainMutationOptions`](api/worker/namespaces/terrains/README.md#terrainmutationoptions)\]

#### Returns

`void`

***

### removeAtCellWhenIdle()

```ts
removeAtCellWhenIdle(...args: number, number, [TerrainMutationOptions]): void
```

Defined in: [sandkit/api/terrains.d.ts:75](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/terrains.d.ts#L75)

Remove terrain at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`TerrainMutationOptions`](api/worker/namespaces/terrains/README.md#terrainmutationoptions)\]

#### Returns

`void`

***

### setHpAtCellWhenIdle()

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

### setHpAtCell()

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

## References

### getTypeFromId

Re-exports [getTypeFromId](api/worker/namespaces/terrains/README.md#gettypefromid)

***

### getTypeAtCell

Re-exports [getTypeAtCell](api/worker/namespaces/terrains/README.md#gettypeatcell)

***

### getDataAtCell

Re-exports [getDataAtCell](api/worker/namespaces/terrains/README.md#getdataatcell)

***

### isAtCell

Re-exports [isAtCell](api/worker/namespaces/terrains/README.md#isatcell)

***

### isTypeAtCell

Re-exports [isTypeAtCell](api/worker/namespaces/terrains/README.md#istypeatcell)

***

### isCellIdTerrain

Re-exports [isCellIdTerrain](api/worker/namespaces/terrains/README.md#iscellidterrain)

***

### damageAtCell

Re-exports [damageAtCell](api/worker/namespaces/terrains/README.md#damageatcell)

***

### createAtCell

Re-exports [createAtCell](api/worker/namespaces/terrains/README.md#createatcell)

***

### replaceAtCell

Re-exports [replaceAtCell](api/worker/namespaces/terrains/README.md#replaceatcell)

***

### removeAtCell

Re-exports [removeAtCell](api/worker/namespaces/terrains/README.md#removeatcell)

***

### TerrainMutationOptions

Re-exports [TerrainMutationOptions](api/worker/namespaces/terrains/README.md#terrainmutationoptions)
