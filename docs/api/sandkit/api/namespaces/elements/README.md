# elements

`sandkit.api.elements` — register elements and read or change cells when idle.
Main thread only.

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [MatterType](api/sandkit/api/namespaces/elements/enumerations/MatterType.md) | Physical behaviour category for an element. |

## Interfaces

### InteractionStructureMetadata

Defined in: [sandkit/api/elements.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L45)

Optional tooltip metadata on structure interactions.

#### Properties

##### textKey?

```ts
optional textKey?: string
```

Defined in: [sandkit/api/elements.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L47)

i18n key for custom interaction label text.

##### crossedOutWhen?

```ts
optional crossedOutWhen?: object
```

Defined in: [sandkit/api/elements.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L49)

Hide the label when a data field matches a value.

###### dataField

```ts
dataField: number
```

###### equals

```ts
equals: number
```

##### visibleWhen?

```ts
optional visibleWhen?: object
```

Defined in: [sandkit/api/elements.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L51)

Show the label only when a data field matches a value.

###### dataField

```ts
dataField: number
```

###### equals

```ts
equals: number
```

##### onlyWhenTranslated?

```ts
optional onlyWhenTranslated?: boolean
```

Defined in: [sandkit/api/elements.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L53)

Require the text key to exist in the active locale.

***

### ElementCreateOptions

Defined in: [shared/api/elements.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L47)

Options for createAtCell, replace, and idle create helpers.

#### Properties

##### data?

```ts
optional data?: Record<string, unknown>
```

Defined in: [shared/api/elements.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L49)

Initial element data bag.

##### density?

```ts
optional density?: number
```

Defined in: [shared/api/elements.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L51)

Override element density.

##### duration?

```ts
optional duration?: number
```

Defined in: [shared/api/elements.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L53)

Set both max and remaining duration.

##### isFreeFalling?

```ts
optional isFreeFalling?: boolean
```

Defined in: [shared/api/elements.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L55)

Override free-fall state on spawn.

##### dataFields?

```ts
optional dataFields?: object
```

Defined in: [shared/api/elements.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L57)

Override default data fields 1–4.

###### field1?

```ts
optional field1?: number
```

###### field2?

```ts
optional field2?: number
```

###### field3?

```ts
optional field3?: number
```

###### field4?

```ts
optional field4?: number
```

##### particle?

```ts
optional particle?: object
```

Defined in: [shared/api/elements.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L64)

Spawn as a particle with the given velocity.

###### velocity

```ts
velocity: Vector2
```

##### skipCollectorCheck?

```ts
optional skipCollectorCheck?: boolean
```

Defined in: [shared/api/elements.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L68)

Skip collector accounting when placing the element.

***

### ElementRemovalOptions

Defined in: [shared/api/elements.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L72)

Options for element removal helpers.

#### Properties

##### skipCollectorCheck?

```ts
optional skipCollectorCheck?: boolean
```

Defined in: [shared/api/elements.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L74)

Skip collector accounting when removing the element.

## Type Aliases

### InteractionDestroyer

```ts
InteractionDestroyer = object
```

Defined in: [sandkit/api/elements.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L57)

Interaction that destroys specific items.

#### Properties

##### kind

```ts
kind: "destroyer"
```

Defined in: [sandkit/api/elements.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L58)

##### items

```ts
items: readonly string[]
```

Defined in: [sandkit/api/elements.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L60)

Item ids removed by this interaction (for example `"drill"`).

***

### InteractionStructure

```ts
InteractionStructure = InteractionStructureMetadata & object
```

Defined in: [sandkit/api/elements.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L64)

Interaction that affects specific structures.

#### Type Declaration

##### kind

```ts
kind: "structure"
```

##### structures

```ts
structures: readonly string[]
```

Structure ids shown in the interaction tooltip.

***

### InteractionEntity

```ts
InteractionEntity = object
```

Defined in: [sandkit/api/elements.d.ts:71](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L71)

Interaction that affects specific entities.

#### Properties

##### kind

```ts
kind: "entity"
```

Defined in: [sandkit/api/elements.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L72)

##### entities

```ts
entities: readonly string[]
```

Defined in: [sandkit/api/elements.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L74)

Entity type ids referenced by the interaction.

***

### InteractionFlammable

```ts
InteractionFlammable = object
```

Defined in: [sandkit/api/elements.d.ts:78](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L78)

Interaction that marks the element as flammable.

#### Properties

##### kind

```ts
kind: "flammable"
```

Defined in: [sandkit/api/elements.d.ts:78](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L78)

***

### InteractionMeltable

```ts
InteractionMeltable = object
```

Defined in: [sandkit/api/elements.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L80)

Interaction that marks the element as meltable.

#### Properties

##### kind

```ts
kind: "meltable"
```

Defined in: [sandkit/api/elements.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L80)

***

### InteractionFreezable

```ts
InteractionFreezable = object
```

Defined in: [sandkit/api/elements.d.ts:82](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L82)

Interaction that marks the element as freezable.

#### Properties

##### kind

```ts
kind: "freezable"
```

Defined in: [sandkit/api/elements.d.ts:82](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L82)

***

### InteractionCustom

```ts
InteractionCustom = InteractionStructureMetadata & object
```

Defined in: [sandkit/api/elements.d.ts:84](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L84)

Interaction handled by custom mod logic and tooltip text.

#### Type Declaration

##### kind

```ts
kind: "custom"
```

***

### Interaction

```ts
Interaction = InteractionDestroyer | InteractionStructure | InteractionEntity | InteractionFlammable | InteractionMeltable | InteractionFreezable | InteractionCustom
```

Defined in: [sandkit/api/elements.d.ts:87](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L87)

Union of element interaction kinds for tool and structure logic.

***

### ElementType

```ts
ElementType = number
```

Defined in: [shared/api/elements.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L13)

Numeric element type handle.

***

### ElementDefinition

```ts
ElementDefinition = object
```

Defined in: [shared/api/elements.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L28)

Mod-registered element definition snapshot.

#### Properties

##### id

```ts
id: string
```

Defined in: [shared/api/elements.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L29)

##### nameKey

```ts
nameKey: string
```

Defined in: [shared/api/elements.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L30)

##### defaultDataFields?

```ts
optional defaultDataFields?: object
```

Defined in: [shared/api/elements.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L31)

###### Index Signature

\[`key`: `string`\]: `number`

##### colors

```ts
colors: object
```

Defined in: [shared/api/elements.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L32)

###### variantFromDataField1?

```ts
optional variantFromDataField1?: object
```

###### variantFromDataField1.rangeMin?

```ts
optional rangeMin?: number
```

###### variantFromDataField1.rangeMax?

```ts
optional rangeMax?: number
```

###### variantFromDataField1.invert?

```ts
optional invert?: boolean
```

###### variantFromDataField1.useGradient?

```ts
optional useGradient?: boolean
```

###### variants

```ts
variants: [number, number, number][]
```

##### density

```ts
density: number
```

Defined in: [shared/api/elements.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L41)

##### matterType

```ts
matterType: MatterType
```

Defined in: [shared/api/elements.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L42)

##### getExtraProps?

```ts
optional getExtraProps?: () => object
```

Defined in: [shared/api/elements.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L43)

###### Returns

`object`

###### data

```ts
data: Record<PropertyKey, any>
```

## Functions

### getRegisteredTypes()

```ts
getRegisteredTypes(): number[]
```

Defined in: [sandkit/api/elements.d.ts:96](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L96)

Returns all registered element type ids.

#### Returns

`number`[]

***

### register()

```ts
register(definition: ElementDefinition): object
```

Defined in: [sandkit/api/elements.d.ts:103](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L103)

Registers a new element and returns its assigned type id.

#### Parameters

##### definition

[`ElementDefinition`](#elementdefinition)

Full element definition to register.

#### Returns

`object`

Object with the assigned `elementType`.

##### elementType

```ts
elementType: number
```

***

### updateDefinition()

```ts
updateDefinition(elementTypeOrId: string | number, partial: Partial<ElementDefinition>): void
```

Defined in: [sandkit/api/elements.d.ts:110](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L110)

Updates fields on an existing element definition.

#### Parameters

##### elementTypeOrId

`string` \| `number`

Numeric type or string id.

##### partial

`Partial`\<[`ElementDefinition`](#elementdefinition)\>

Fields to merge onto the definition.

#### Returns

`void`

***

### addInteractionInfo()

```ts
addInteractionInfo(elementTypeOrId: string | number, interaction: Interaction): void
```

Defined in: [sandkit/api/elements.d.ts:117](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L117)

Adds an interaction entry to an element definition.

#### Parameters

##### elementTypeOrId

`string` \| `number`

Numeric type or string id.

##### interaction

[`Interaction`](#interaction)

Interaction entry to append.

#### Returns

`void`

***

### getNameByType()

```ts
getNameByType(elementType: number): string
```

Defined in: [sandkit/api/elements.d.ts:123](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L123)

Returns the display name for an element type.

#### Parameters

##### elementType

`number`

Numeric element type.

#### Returns

`string`

***

### findFreeCellInStructure()

```ts
findFreeCellInStructure(structureCellX: number, structureCellY: number, structureSize: number): Vector2 | null
```

Defined in: [sandkit/api/elements.d.ts:132](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L132)

Finds a free cell inside a structure footprint, or null.

#### Parameters

##### structureCellX

`number`

Structure anchor cell column.

##### structureCellY

`number`

Structure anchor cell row.

##### structureSize

`number`

Structure footprint size in cells.

#### Returns

[`Vector2`](api/shared/player/README.md#vector2) \| `null`

Cell coordinates of a free cell, or null when none.

***

### createAtCellWhenIdle()

```ts
createAtCellWhenIdle(...args: number, number, number, [ElementCreateOptions]): void
```

Defined in: [sandkit/api/elements.d.ts:141](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L141)

Creates an element at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `number`, [`ElementCreateOptions`](#elementcreateoptions)\]

#### Returns

`void`

***

### replaceAtCellWhenIdle()

```ts
replaceAtCellWhenIdle(...args: number, number, number, [ElementCreateOptions]): void
```

Defined in: [sandkit/api/elements.d.ts:150](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L150)

Replaces the element at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `number`, [`ElementCreateOptions`](#elementcreateoptions)\]

#### Returns

`void`

***

### removeAtCellWhenIdle()

```ts
removeAtCellWhenIdle(...args: number, number, [ElementRemovalOptions]): void
```

Defined in: [sandkit/api/elements.d.ts:158](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L158)

Removes the element at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`ElementRemovalOptions`](#elementremovaloptions)\]

#### Returns

`void`

***

### teleportBetweenCellsWhenIdle()

```ts
teleportBetweenCellsWhenIdle(fromCellX: number, fromCellY: number, toCellX: number, toCellY: number): void
```

Defined in: [sandkit/api/elements.d.ts:167](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L167)

Moves an element between cells when the simulation is idle.

#### Parameters

##### fromCellX

`number`

Source cell column.

##### fromCellY

`number`

Source cell row.

##### toCellX

`number`

Destination cell column.

##### toCellY

`number`

Destination cell row.

#### Returns

`void`

***

### setVelocityAtCellWhenIdle()

```ts
setVelocityAtCellWhenIdle(...args: number, number, [Vector2]): void
```

Defined in: [sandkit/api/elements.d.ts:175](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L175)

Sets particle velocity at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`Vector2`](api/shared/player/README.md#vector2)\]

#### Returns

`void`

***

### addParticleVelocityAtCellWhenIdle()

```ts
addParticleVelocityAtCellWhenIdle(...args: number, number, [Vector2, number]): void
```

Defined in: [sandkit/api/elements.d.ts:184](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L184)

Adds velocity to a particle at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`Vector2`](api/shared/player/README.md#vector2), `number`\]

#### Returns

`void`

***

### convertToParticleAtCellWhenIdle()

```ts
convertToParticleAtCellWhenIdle(...args: number, number, [Vector2]): void
```

Defined in: [sandkit/api/elements.d.ts:192](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L192)

Converts a cell element to a particle when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, [`Vector2`](api/shared/player/README.md#vector2)\]

#### Returns

`void`

***

### convertFromParticleAtCellWhenIdle()

```ts
convertFromParticleAtCellWhenIdle(...args: CellCoordinates): void
```

Defined in: [sandkit/api/elements.d.ts:199](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L199)

Converts a particle back to a solid element when the simulation is idle.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`

***

### setDataFieldAtCellWhenIdle()

```ts
setDataFieldAtCellWhenIdle(...args: [number, number, 1 | 2 | 3 | 4, number]): void
```

Defined in: [sandkit/api/elements.d.ts:208](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L208)

Sets a data field on the element at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `1` \| `2` \| `3` \| `4`, `number`\]

#### Returns

`void`

***

### refreshColorAtCellWhenIdle()

```ts
refreshColorAtCellWhenIdle(...args: CellCoordinates): void
```

Defined in: [sandkit/api/elements.d.ts:215](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L215)

Refreshes the rendered color at a cell when the simulation is idle.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`

***

### setPhysicsAtCellWhenIdle()

```ts
setPhysicsAtCellWhenIdle(...args: [number, number, number]): void
```

Defined in: [sandkit/api/elements.d.ts:223](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L223)

Sets the physics skip mode at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`void`

***

### setDurationAtCellWhenIdle()

```ts
setDurationAtCellWhenIdle(...args: [number, number, number, object]): void
```

Defined in: [sandkit/api/elements.d.ts:232](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/elements.d.ts#L232)

Sets element duration at a cell when the simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `number`, `object`\]

#### Returns

`void`

***

### getTypeFromId()

```ts
getTypeFromId(elementId: string): number
```

Defined in: [shared/api/elements.d.ts:81](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L81)

Resolve a mod element string id to a type handle.

#### Parameters

##### elementId

`string`

Mod-registered element id.

#### Returns

`number`

***

### getDefinitionByType()

```ts
getDefinitionByType(elementType: number): ElementDefinition | undefined
```

Defined in: [shared/api/elements.d.ts:87](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L87)

Look up the definition for a type handle.

#### Parameters

##### elementType

`number`

Numeric element type.

#### Returns

[`ElementDefinition`](#elementdefinition) \| `undefined`

***

### getTypeAtCell()

```ts
getTypeAtCell(...args: CellCoordinates): number | null
```

Defined in: [shared/api/elements.d.ts:94](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L94)

Return the raw element type at a cell (may differ from resolved type).

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`number` \| `null`

***

### getResolvedTypeAtCell()

```ts
getResolvedTypeAtCell(...args: CellCoordinates): number | null
```

Defined in: [shared/api/elements.d.ts:101](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L101)

Return the resolved element type after overlays and particles.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`number` \| `null`

***

### getResolvedTypeFromCellId()

```ts
getResolvedTypeFromCellId(cellId: number): number | null
```

Defined in: [shared/api/elements.d.ts:107](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L107)

Return the resolved element type from a packed cell id.

#### Parameters

##### cellId

`number`

Packed cell id from [world.getCellIdAtCell](api/worker/namespaces/world/README.md#getcellidatcell).

#### Returns

`number` \| `null`

***

### getInfoAtCell()

```ts
getInfoAtCell(...args: CellCoordinates): { elementType: number; isParticle: boolean; cellId: number; elementIndex: number; } | null
```

Defined in: [shared/api/elements.d.ts:114](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L114)

Return element index, particle flag, and ids at a cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

\{ `elementType`: `number`; `isParticle`: `boolean`; `cellId`: `number`; `elementIndex`: `number`; \} \| `null`

***

### getMatterTypeAtCell()

```ts
getMatterTypeAtCell(...args: CellCoordinates): MatterType | null
```

Defined in: [shared/api/elements.d.ts:121](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L121)

Return the matter category at a cell, or null when empty.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

[`MatterType`](api/sandkit/api/namespaces/elements/enumerations/MatterType.md) \| `null`

***

### isTypeAtCell()

```ts
isTypeAtCell(...args: [number, number, number]): boolean
```

Defined in: [shared/api/elements.d.ts:129](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L129)

Return true when the cell holds the given element type.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`boolean`

***

### isFreeFallingAtCell()

```ts
isFreeFallingAtCell(...args: CellCoordinates): boolean
```

Defined in: [shared/api/elements.d.ts:136](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L136)

Return true when the element at the cell is falling.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### getVelocityAtCell()

```ts
getVelocityAtCell(...args: CellCoordinates): { x: number; y: number; } | null
```

Defined in: [shared/api/elements.d.ts:143](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L143)

Return per-cell velocity for moving elements.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

\{ `x`: `number`; `y`: `number`; \} \| `null`

***

### getDataFieldAtCell()

```ts
getDataFieldAtCell(...args: [number, number, 1 | 2 | 3 | 4]): number | null
```

Defined in: [shared/api/elements.d.ts:151](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/elements.d.ts#L151)

Read element data field 1–4 at a cell.

#### Parameters

##### args

...\[`number`, `number`, `1` \| `2` \| `3` \| `4`\]

#### Returns

`number` \| `null`
