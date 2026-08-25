# sandkit.api.structures (worker)

**`Internal`**

Shared `sandkit.api.structures` base — structure lookup and mutation.

 Base namespace reused by main and worker declarations.

## Namespaces <!-- {docsify-ignore} -->

| Namespace | Description |
| ------ | ------ |
| [processing](api/worker/namespaces/structures/namespaces/processing/README.md) | Structure processing enablement checks. |

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.structures.StructureData (worker) :id=structuredata

Defined in: [shared/api/structures.d.ts:115](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L115)

Per-structure custom data bag.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### elementId?

```ts
optional elementId?: string | null
```

Defined in: [shared/api/structures.d.ts:116](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L116)

##### elementType?

```ts
optional elementType?: number | null
```

Defined in: [shared/api/structures.d.ts:117](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L117)

***

### sandkit.api.structures.Structure (worker) :id=structure

Defined in: [shared/api/structures.d.ts:122](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L122)

Live structure instance in the world grid.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### x

```ts
x: number
```

Defined in: [shared/api/structures.d.ts:123](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L123)

##### y

```ts
y: number
```

Defined in: [shared/api/structures.d.ts:124](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L124)

##### trapped?

```ts
optional trapped?: boolean
```

Defined in: [shared/api/structures.d.ts:125](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L125)

##### data?

```ts
optional data?: StructureData
```

Defined in: [shared/api/structures.d.ts:126](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L126)

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.structures.StructureType (worker) :id=structuretype

```ts
StructureType = string | number
```

Defined in: [shared/api/structures.d.ts:131](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L131)

Numeric or string structure type discriminator.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.structures.forEachOfType() (worker) :id=foreachoftype

```ts
forEachOfType(structureTypeOrId: StructureType, callback: (structure: Structure) => void): void
```

Defined in: [shared/api/structures.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L14)

Invoke a callback for every structure of the given type.

#### Parameters

##### structureTypeOrId

[`StructureType`](#structuretype)

Structure type value or string id.

##### callback

(`structure`: [`Structure`](#structure)) => `void`

Called once per matching structure instance.

#### Returns

`void`

***

### sandkit.api.structures.getAtCell() (worker) :id=getatcell

```ts
getAtCell(...args: CellCoordinates): Structure | null
```

Defined in: [shared/api/structures.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L21)

Return the structure at a cell, or null when none.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

[`Structure`](#structure) \| `null`

***

### sandkit.api.structures.getDefinitionByType() (worker) :id=getdefinitionbytype

```ts
getDefinitionByType(structureType: StructureType): any
```

Defined in: [shared/api/structures.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L27)

Return the mod-registered or built-in definition for a structure type.

#### Parameters

##### structureType

[`StructureType`](#structuretype)

Structure type value or string id.

#### Returns

`any`

***

### sandkit.api.structures.getTypeFromId() (worker) :id=gettypefromid

```ts
getTypeFromId(structureId: string): StructureType
```

Defined in: [shared/api/structures.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L33)

Map a structure string id to its runtime type value.

#### Parameters

##### structureId

`string`

Structure string id.

#### Returns

[`StructureType`](#structuretype)

***

### sandkit.api.structures.hasBuiltAtCell() (worker) :id=hasbuiltatcell

```ts
hasBuiltAtCell(...args: CellCoordinates): boolean
```

Defined in: [shared/api/structures.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L40)

Return true when a completed structure occupies the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### sandkit.api.structures.isType() (worker) :id=istype

```ts
isType(structure: Structure | null, structureId: string): boolean
```

Defined in: [shared/api/structures.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L47)

Return true when the structure matches the given id.

#### Parameters

##### structure

[`Structure`](#structure) \| `null`

Structure instance, or null.

##### structureId

`string`

Structure string id to compare.

#### Returns

`boolean`

***

### sandkit.api.structures.isTypeAtCell() (worker) :id=istypeatcell

```ts
isTypeAtCell(...args: [number, number, string]): boolean
```

Defined in: [shared/api/structures.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L55)

Return true when the cell structure matches the given id.

#### Parameters

##### args

...\[`number`, `number`, `string`\]

#### Returns

`boolean`

***

### sandkit.api.structures.setSpritesheetIndex() (worker) :id=setspritesheetindex

```ts
setSpritesheetIndex(structure: Structure, index: number): void
```

Defined in: [shared/api/structures.d.ts:62](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L62)

Set the spritesheet frame index on a structure instance.

#### Parameters

##### structure

[`Structure`](#structure)

Target structure instance.

##### index

`number`

Spritesheet frame index.

#### Returns

`void`

***

### sandkit.api.structures.setSpritesheetIndexAtCell() (worker) :id=setspritesheetindexatcell

```ts
setSpritesheetIndexAtCell(...args: [number, number, number]): void
```

Defined in: [shared/api/structures.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L70)

Set spritesheet frame index for the structure at a cell.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`void`

***

### sandkit.api.structures.setSpritesheetIndexByValue() (worker) :id=setspritesheetindexbyvalue

```ts
setSpritesheetIndexByValue(structure: Structure, value: number, thresholds: number[]): void
```

Defined in: [shared/api/structures.d.ts:78](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L78)

Pick spritesheet index from a value and threshold table on a structure.

#### Parameters

##### structure

[`Structure`](#structure)

Target structure instance.

##### value

`number`

Numeric value mapped through thresholds.

##### thresholds

`number`[]

Ascending threshold values.

#### Returns

`void`

***

### sandkit.api.structures.setSpritesheetIndexByValueAtCell() (worker) :id=setspritesheetindexbyvalueatcell

```ts
setSpritesheetIndexByValueAtCell(...args: [number, number, number, number[]]): void
```

Defined in: [shared/api/structures.d.ts:87](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L87)

Same as [setSpritesheetIndexByValue](#setspritesheetindexbyvalue) for the structure at a cell.

#### Parameters

##### args

...\[`number`, `number`, `number`, `number`[]\]

#### Returns

`void`

***

### sandkit.api.structures.update() (worker) :id=update

```ts
update(structure: Structure, options?: object): void
```

Defined in: [shared/api/structures.d.ts:94](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L94)

Push structure field changes to simulation.

#### Parameters

##### structure

[`Structure`](#structure)

Structure instance to update.

##### options?

When `propagateToWorkers` is true, sync to worker threads.

###### propagateToWorkers?

`boolean`

#### Returns

`void`

***

### sandkit.api.structures.setData() (worker) :id=setdata

```ts
setData(structure: Structure, partial: any, options?: object): void
```

Defined in: [shared/api/structures.d.ts:102](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/structures.d.ts#L102)

Merge partial data onto a structure.

#### Parameters

##### structure

[`Structure`](#structure)

Structure instance to update.

##### partial

`any`

Fields to merge onto `structure.data`.

##### options?

When `propagateToWorkers` is true, sync to worker threads.

###### propagateToWorkers?

`boolean`

#### Returns

`void`
