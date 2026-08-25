# sandkit.api.tech

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.tech.TechDefinition :id=techdefinition

Defined in: [sandkit/api/tech.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L48)

Tech definition shape.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### nameKey?

```ts
optional nameKey?: string
```

Defined in: [sandkit/api/tech.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L50)

Display name translation key.

##### descriptionKey?

```ts
optional descriptionKey?: string
```

Defined in: [sandkit/api/tech.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L52)

Description translation key.

***

### sandkit.api.tech.TechGridPosition :id=techgridposition

Defined in: [sandkit/api/tech.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L56)

Position on the tech grid.

#### Properties

##### x

```ts
x: number
```

Defined in: [sandkit/api/tech.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L57)

##### y

```ts
y: number
```

Defined in: [sandkit/api/tech.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L58)

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.tech.TechGridId :id=techgridid

```ts
TechGridId = string | number
```

Defined in: [sandkit/api/tech.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L46)

Tech grid node id.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.tech.getDefinitionById() :id=getdefinitionbyid

```ts
getDefinitionById(techId: string): TechDefinition | undefined
```

Defined in: [sandkit/api/tech.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L13)

Return a tech definition by string id.

#### Parameters

##### techId

`string`

Tech entry identifier.

#### Returns

[`TechDefinition`](#techdefinition) \| `undefined`

***

### sandkit.api.tech.updateDefinition() :id=updatedefinition

```ts
updateDefinition(techId: string, updates: Partial<TechDefinition>): void
```

Defined in: [sandkit/api/tech.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L19)

Patch fields on an existing tech definition.

#### Parameters

##### techId

`string`

Tech entry identifier.

##### updates

`Partial`\<[`TechDefinition`](#techdefinition)\>

Fields to merge into the definition.

#### Returns

`void`

***

### sandkit.api.tech.addDefinition() :id=adddefinition

```ts
addDefinition(techId: string, definition: TechDefinition): void
```

Defined in: [sandkit/api/tech.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L25)

Add a new tech definition by id.

#### Parameters

##### techId

`string`

Tech entry identifier.

##### definition

[`TechDefinition`](#techdefinition)

Full tech definition to register.

#### Returns

`void`

***

### sandkit.api.tech.registerNode() :id=registernode

```ts
registerNode(techId: TechGridId, definition: TechDefinition, options: object): TechGridPosition
```

Defined in: [sandkit/api/tech.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L32)

Register a tech node on the grid with parent and position options.

#### Parameters

##### techId

[`TechGridId`](#techgridid)

Tech grid node id.

##### definition

[`TechDefinition`](#techdefinition)

Tech definition for the node.

##### options

Parent node id and optional preferred grid position.

###### parentId

[`TechGridId`](#techgridid)

###### preferredPosition?

[`TechGridPosition`](#techgridposition)

#### Returns

[`TechGridPosition`](#techgridposition)

***

### sandkit.api.tech.isLockedById() :id=islockedbyid

```ts
isLockedById(techId: string | number): boolean
```

Defined in: [sandkit/api/tech.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L37)

Return true when a tech entry is locked.

#### Parameters

##### techId

`string` \| `number`

Tech entry id (string or numeric enum).

#### Returns

`boolean`

***

### sandkit.api.tech.setLockedById() :id=setlockedbyid

```ts
setLockedById(techId: string | number, locked: boolean): void
```

Defined in: [sandkit/api/tech.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/tech.d.ts#L43)

Set locked state for a tech entry by id.

#### Parameters

##### techId

`string` \| `number`

Tech entry id (string or numeric enum).

##### locked

`boolean`

When true, the tech cannot be purchased.

#### Returns

`void`
