# structures

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [recipes](api/sandkit/api/namespaces/structures/namespaces/recipes/README.md) | Structure recipe registration by machine kind. |
| [processing](api/sandkit/api/namespaces/structures/namespaces/processing/README.md) | Per-structure processing enablement and registration. |

## Interfaces

### StructureBuildMode

Defined in: [sandkit/api/structures.d.ts:200](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L200)

Build mode entry for a structure definition.

#### Properties

##### type

```ts
type: string
```

Defined in: [sandkit/api/structures.d.ts:201](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L201)

##### directions?

```ts
optional directions?: string[]
```

Defined in: [sandkit/api/structures.d.ts:202](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L202)

***

### StructureVariant

Defined in: [sandkit/api/structures.d.ts:206](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L206)

Rotated variant entry for a structure definition.

#### Properties

##### id

```ts
id: string | number
```

Defined in: [sandkit/api/structures.d.ts:207](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L207)

##### angles

```ts
angles: number[]
```

Defined in: [sandkit/api/structures.d.ts:208](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L208)

***

### StructureRender

Defined in: [sandkit/api/structures.d.ts:212](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L212)

Render settings for a structure definition.

#### Properties

##### imageName?

```ts
optional imageName?: string
```

Defined in: [sandkit/api/structures.d.ts:213](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L213)

##### size?

```ts
optional size?: object
```

Defined in: [sandkit/api/structures.d.ts:214](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L214)

###### width

```ts
width: number
```

###### height

```ts
height: number
```

##### offset?

```ts
optional offset?: object
```

Defined in: [sandkit/api/structures.d.ts:215](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L215)

###### x

```ts
x: number
```

###### y

```ts
y: number
```

***

### SandkitStructureDefinition

Defined in: [sandkit/api/structures.d.ts:219](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L219)

Full structure definition registered with the game.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/api/structures.d.ts:220](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L220)

##### nameKey?

```ts
optional nameKey?: string
```

Defined in: [sandkit/api/structures.d.ts:221](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L221)

##### descriptionKey?

```ts
optional descriptionKey?: string
```

Defined in: [sandkit/api/structures.d.ts:222](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L222)

##### categoryKey?

```ts
optional categoryKey?: string
```

Defined in: [sandkit/api/structures.d.ts:223](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L223)

##### order?

```ts
optional order?: number
```

Defined in: [sandkit/api/structures.d.ts:224](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L224)

##### buildModes?

```ts
optional buildModes?: StructureBuildMode[]
```

Defined in: [sandkit/api/structures.d.ts:225](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L225)

##### shape?

```ts
optional shape?: number[][]
```

Defined in: [sandkit/api/structures.d.ts:226](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L226)

##### variants?

```ts
optional variants?: StructureVariant[]
```

Defined in: [sandkit/api/structures.d.ts:227](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L227)

##### render?

```ts
optional render?: StructureRender
```

Defined in: [sandkit/api/structures.d.ts:228](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L228)

##### defaultData?

```ts
optional defaultData?: Record<string, unknown>
```

Defined in: [sandkit/api/structures.d.ts:229](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L229)

***

### StructureBuildOptions

Defined in: [sandkit/api/structures.d.ts:234](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L234)

Options passed to [buildAtCellWhenIdle](#buildatcellwhenidle).

#### Indexable

```ts
[key: string]: unknown
```

***

### StructureRemovalOptions

Defined in: [sandkit/api/structures.d.ts:239](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L239)

Options passed to [removeAtCellWhenIdle](#removeatcellwhenidle).

#### Properties

##### removeCells?

```ts
optional removeCells?: boolean
```

Defined in: [sandkit/api/structures.d.ts:241](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L241)

Also remove underlying terrain cells in the footprint.

##### skipVisuals?

```ts
optional skipVisuals?: boolean
```

Defined in: [sandkit/api/structures.d.ts:243](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L243)

Skip visual teardown effects.

***

### StructureBulkRemovalOptions

Defined in: [sandkit/api/structures.d.ts:247](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L247)

Options passed to bulk structure removal helpers.

#### Properties

##### removeCells?

```ts
optional removeCells?: boolean
```

Defined in: [sandkit/api/structures.d.ts:248](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L248)

##### skipVisuals?

```ts
optional skipVisuals?: boolean
```

Defined in: [sandkit/api/structures.d.ts:249](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L249)

##### preserveUnselectable?

```ts
optional preserveUnselectable?: boolean
```

Defined in: [sandkit/api/structures.d.ts:251](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L251)

When set, only remove structures at these positions.

##### onlyPositions?

```ts
optional onlyPositions?: Vector2[]
```

Defined in: [sandkit/api/structures.d.ts:252](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L252)

***

### StructureProcessorDefinitionV1

Defined in: [sandkit/api/structures.d.ts:256](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L256)

Periodic structure processor attached with [addProcessor](#addprocessor).

#### Properties

##### intervalMs

```ts
intervalMs: number
```

Defined in: [sandkit/api/structures.d.ts:258](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L258)

Tick interval in milliseconds. Must be > 0.

##### process

```ts
process: (state: unknown, structure: Structure) => void
```

Defined in: [sandkit/api/structures.d.ts:260](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L260)

Synchronous callback invoked for each structure instance.

###### Parameters

###### state

`unknown`

###### structure

[`Structure`](api/worker/namespaces/structures/README.md#structure)

###### Returns

`void`

***

### PlacementConfigIntegerField

Defined in: [sandkit/api/structures.d.ts:269](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L269)

Integer placement field with optional bounds.

#### Properties

##### type

```ts
type: "integer"
```

Defined in: [sandkit/api/structures.d.ts:270](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L270)

##### id

```ts
id: string
```

Defined in: [sandkit/api/structures.d.ts:271](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L271)

##### labelKey

```ts
labelKey: string
```

Defined in: [sandkit/api/structures.d.ts:272](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L272)

##### min?

```ts
optional min?: number
```

Defined in: [sandkit/api/structures.d.ts:273](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L273)

##### max?

```ts
optional max?: number
```

Defined in: [sandkit/api/structures.d.ts:274](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L274)

##### default?

```ts
optional default?: number
```

Defined in: [sandkit/api/structures.d.ts:275](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L275)

***

### PlacementConfigChoiceField

Defined in: [sandkit/api/structures.d.ts:279](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L279)

Choice placement field with labeled options.

#### Properties

##### type

```ts
type: "choice"
```

Defined in: [sandkit/api/structures.d.ts:280](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L280)

##### id

```ts
id: string
```

Defined in: [sandkit/api/structures.d.ts:281](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L281)

##### labelKey

```ts
labelKey: string
```

Defined in: [sandkit/api/structures.d.ts:282](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L282)

##### options

```ts
options: readonly object[]
```

Defined in: [sandkit/api/structures.d.ts:283](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L283)

***

### PlacementConfigDefinition

Defined in: [sandkit/api/structures.d.ts:290](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L290)

Placement rule definition for a structure type.

#### Properties

##### structureId

```ts
structureId: string
```

Defined in: [sandkit/api/structures.d.ts:291](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L291)

##### fields

```ts
fields: PlacementConfigField[]
```

Defined in: [sandkit/api/structures.d.ts:292](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L292)

***

### WeightedRefineryRecipeDefinitionV1

Defined in: [sandkit/api/structures.d.ts:303](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L303)

Weighted refinery recipe definition shape.

#### Properties

##### input

```ts
input: WeightedRecipeOutput
```

Defined in: [sandkit/api/structures.d.ts:304](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L304)

##### outputs

```ts
outputs: WeightedRecipeOutput[]
```

Defined in: [sandkit/api/structures.d.ts:305](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L305)

***

### StructureProcessingDefinitionV1

Defined in: [sandkit/api/structures.d.ts:309](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L309)

Custom structure processing definition shape.

#### Properties

##### structureType

```ts
structureType: StructureType
```

Defined in: [sandkit/api/structures.d.ts:310](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L310)

##### intervalMs

```ts
intervalMs: number
```

Defined in: [sandkit/api/structures.d.ts:311](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L311)

##### process

```ts
process: (state: unknown, structure: Structure) => void
```

Defined in: [sandkit/api/structures.d.ts:312](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L312)

###### Parameters

###### state

`unknown`

###### structure

[`Structure`](api/worker/namespaces/structures/README.md#structure)

###### Returns

`void`

## Type Aliases

### PlacementConfigField

```ts
PlacementConfigField = PlacementConfigIntegerField | PlacementConfigChoiceField
```

Defined in: [sandkit/api/structures.d.ts:264](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L264)

Placement hotbar field definition.

***

### PlanterBoxRecipeDefinitionV1

```ts
PlanterBoxRecipeDefinitionV1 = processing.PlanterBoxRecipeDefinitionV1
```

Defined in: [sandkit/api/structures.d.ts:296](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L296)

Planter box recipe definition shape.

***

### ShakerRecipeDefinitionV1

```ts
ShakerRecipeDefinitionV1 = processing.ShakerRecipeDefinitionV1
```

Defined in: [sandkit/api/structures.d.ts:298](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L298)

Shaker recipe definition shape.

***

### KineticPressRecipeDefinitionV1

```ts
KineticPressRecipeDefinitionV1 = processing.KineticPressRecipeDefinitionV1
```

Defined in: [sandkit/api/structures.d.ts:300](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L300)

Kinetic press recipe definition shape.

## Functions

### addProcessor()

```ts
addProcessor(structureId: StructureType, definition: StructureProcessorDefinitionV1): void
```

Defined in: [sandkit/api/structures.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L50)

Register a structure processor handler.

#### Parameters

##### structureId

[`StructureType`](api/worker/namespaces/structures/README.md#structuretype)

Structure type or string id to attach the processor to.

##### definition

[`StructureProcessorDefinitionV1`](#structureprocessordefinitionv1)

Periodic processing interval and callback.

#### Returns

`void`

***

### register()

```ts
register(definition: SandkitStructureDefinition, options?: object): void
```

Defined in: [sandkit/api/structures.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L57)

Register a new structure definition.

#### Parameters

##### definition

[`SandkitStructureDefinition`](#sandkitstructuredefinition)

Full structure definition.

##### options?

When `useRawShape` is true, keep the shape matrix as-is.

###### useRawShape?

`boolean`

#### Returns

`void`

***

### updateDefinition()

```ts
updateDefinition(structureTypeOrId: StructureType, partial: Partial<SandkitStructureDefinition>, options?: object): void
```

Defined in: [sandkit/api/structures.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L65)

Patch fields on an existing structure definition.

#### Parameters

##### structureTypeOrId

[`StructureType`](api/worker/namespaces/structures/README.md#structuretype)

Structure type value or string id.

##### partial

`Partial`\<[`SandkitStructureDefinition`](#sandkitstructuredefinition)\>

Fields to merge onto the definition.

##### options?

When `useRawShape` is true, keep the shape matrix as-is.

###### useRawShape?

`boolean`

#### Returns

`void`

***

### addVariant()

```ts
addVariant(baseStructureTypeOrId: StructureType, variant: object, options?: object): void
```

Defined in: [sandkit/api/structures.d.ts:73](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L73)

Add a rotated variant to a base structure type.

#### Parameters

##### baseStructureTypeOrId

[`StructureType`](api/worker/namespaces/structures/README.md#structuretype)

Base structure type or id.

##### variant

Variant id and supported rotation angles.

###### id

[`StructureType`](api/worker/namespaces/structures/README.md#structuretype)

###### angles

`number`[]

##### options?

Optional build-mode wiring for the variant.

###### addBuildMode?

`unknown`

#### Returns

`void`

***

### registerPlacementConfig()

```ts
registerPlacementConfig(definition: PlacementConfigDefinition): void
```

Defined in: [sandkit/api/structures.d.ts:79](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L79)

Register placement rules for a structure.

#### Parameters

##### definition

[`PlacementConfigDefinition`](#placementconfigdefinition)

Hotbar placement field configuration.

#### Returns

`void`

***

### getUnlockedTypes()

```ts
getUnlockedTypes(): Set<StructureType>
```

Defined in: [sandkit/api/structures.d.ts:82](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L82)

Return structure types unlocked for building.

#### Returns

`Set`\<[`StructureType`](api/worker/namespaces/structures/README.md#structuretype)\>

***

### isBlockedByPlayerAtCell()

```ts
isBlockedByPlayerAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/structures.d.ts:89](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L89)

Return true when the player blocks building at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### isLauncherAtCell()

```ts
isLauncherAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/structures.d.ts:96](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L96)

Return true when a launcher structure is at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### isUnlockedByType()

```ts
isUnlockedByType(structureType: StructureType): boolean
```

Defined in: [sandkit/api/structures.d.ts:102](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L102)

Return true when a structure type is unlocked.

#### Parameters

##### structureType

[`StructureType`](api/worker/namespaces/structures/README.md#structuretype)

Structure type value or string id.

#### Returns

`boolean`

***

### mapValueToSpritesheetIndex()

```ts
mapValueToSpritesheetIndex(value: number, thresholds: number[]): number
```

Defined in: [sandkit/api/structures.d.ts:110](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L110)

Map a numeric value through thresholds to a spritesheet index.

#### Parameters

##### value

`number`

Numeric value to map.

##### thresholds

`number`[]

Ascending threshold values.

#### Returns

`number`

Spritesheet frame index.

***

### buildAtCellWhenIdle()

```ts
buildAtCellWhenIdle(...args: number, number, string, [StructureBuildOptions]): void
```

Defined in: [sandkit/api/structures.d.ts:119](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L119)

Build a structure at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `string`, [`StructureBuildOptions`](#structurebuildoptions)\]

#### Returns

`void`

***

### removeAtCellWhenIdle()

```ts
removeAtCellWhenIdle(...args: number, number, [StructureRemovalOptions]): void
```

Defined in: [sandkit/api/structures.d.ts:127](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L127)

Remove a structure at a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`StructureRemovalOptions`](#structureremovaloptions)\]

#### Returns

`void`

***

### removeBetweenCellsWhenIdle()

```ts
removeBetweenCellsWhenIdle(startCellX: number, startCellY: number, endCellX: number, endCellY: number, options?: StructureBulkRemovalOptions): void
```

Defined in: [sandkit/api/structures.d.ts:137](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L137)

Remove structures between two cells when simulation is idle.

#### Parameters

##### startCellX

`number`

Start cell column.

##### startCellY

`number`

Start cell row.

##### endCellX

`number`

End cell column.

##### endCellY

`number`

End cell row.

##### options?

[`StructureBulkRemovalOptions`](#structurebulkremovaloptions)

Optional bulk-removal flags.

#### Returns

`void`

***

### removeAtCellsWhenIdle()

```ts
removeAtCellsWhenIdle(positions: Vector2[], options?: StructureBulkRemovalOptions): void
```

Defined in: [sandkit/api/structures.d.ts:144](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L144)

Remove structures at many cells when simulation is idle.

#### Parameters

##### positions

[`Vector2`](api/shared/player/README.md#vector2)[]

Cell positions to clear.

##### options?

[`StructureBulkRemovalOptions`](#structurebulkremovaloptions)

Optional bulk-removal flags.

#### Returns

`void`

## References

### forEachOfType

Re-exports [forEachOfType](api/worker/namespaces/structures/README.md#foreachoftype)

***

### getAtCell

Re-exports [getAtCell](api/worker/namespaces/structures/README.md#getatcell)

***

### getDefinitionByType

Re-exports [getDefinitionByType](api/worker/namespaces/structures/README.md#getdefinitionbytype)

***

### getTypeFromId

Re-exports [getTypeFromId](api/worker/namespaces/structures/README.md#gettypefromid)

***

### hasBuiltAtCell

Re-exports [hasBuiltAtCell](api/worker/namespaces/structures/README.md#hasbuiltatcell)

***

### isType

Re-exports [isType](api/worker/namespaces/structures/README.md#istype)

***

### isTypeAtCell

Re-exports [isTypeAtCell](api/worker/namespaces/structures/README.md#istypeatcell)

***

### setSpritesheetIndex

Re-exports [setSpritesheetIndex](api/worker/namespaces/structures/README.md#setspritesheetindex)

***

### setSpritesheetIndexAtCell

Re-exports [setSpritesheetIndexAtCell](api/worker/namespaces/structures/README.md#setspritesheetindexatcell)

***

### setSpritesheetIndexByValue

Re-exports [setSpritesheetIndexByValue](api/worker/namespaces/structures/README.md#setspritesheetindexbyvalue)

***

### setSpritesheetIndexByValueAtCell

Re-exports [setSpritesheetIndexByValueAtCell](api/worker/namespaces/structures/README.md#setspritesheetindexbyvalueatcell)

***

### update

Re-exports [update](api/worker/namespaces/structures/README.md#update)

***

### setData

Re-exports [setData](api/worker/namespaces/structures/README.md#setdata)

***

### Structure

Re-exports [Structure](api/worker/namespaces/structures/README.md#structure)

***

### StructureType

Re-exports [StructureType](api/worker/namespaces/structures/README.md#structuretype)
