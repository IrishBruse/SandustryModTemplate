# items

`sandkit.api.items` — register custom inventory items and query active items.
Main thread only.

## Interfaces

### ItemDefinition

Defined in: [sandkit/api/items.d.ts:7](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L7)

Definition for a mod-registered inventory item.

#### Type Parameters

##### State

`State` = `unknown`

##### Action

`Action` = `unknown`

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### handleAction?

```ts
optional handleAction?: (state: State, action: Action) => unknown
```

Defined in: [sandkit/api/items.d.ts:9](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L9)

Handles item use actions.

###### Parameters

###### state

`State`

###### action

`Action`

###### Returns

`unknown`

##### afterRender?

```ts
optional afterRender?: (state: State) => void
```

Defined in: [sandkit/api/items.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L11)

Called after the item is rendered each frame.

###### Parameters

###### state

`State`

###### Returns

`void`

## Type Aliases

### ModItem

```ts
ModItem = unknown
```

Defined in: [sandkit/api/items.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L46)

Runtime item instance (not yet typed in declarations).

***

### ItemType

```ts
ItemType = unknown
```

Defined in: [sandkit/api/items.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L48)

Item type id (not yet typed in declarations).

## Functions

### register()

```ts
register(definition: ItemDefinition): void
```

Defined in: [sandkit/api/items.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L19)

Registers a new item definition.

#### Parameters

##### definition

[`ItemDefinition`](#itemdefinition)

Item id, handlers, and display metadata.

#### Returns

`void`

***

### updateDefinition()

```ts
updateDefinition(itemId: string, partial: Partial<ItemDefinition>): void
```

Defined in: [sandkit/api/items.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L25)

Updates fields on an existing item definition.

#### Parameters

##### itemId

`string`

Registered item id.

##### partial

`Partial`\<[`ItemDefinition`](#itemdefinition)\>

Fields to merge into the definition.

#### Returns

`void`

***

### getDefinitionById()

```ts
getDefinitionById(itemId: string): ItemDefinition<unknown, unknown> | undefined
```

Defined in: [sandkit/api/items.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L30)

Returns the item definition for an id, or undefined.

#### Parameters

##### itemId

`string`

Registered item id.

#### Returns

[`ItemDefinition`](#itemdefinition)\<`unknown`, `unknown`\> \| `undefined`

***

### createFromId()

```ts
createFromId(itemId: string): unknown
```

Defined in: [sandkit/api/items.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L35)

Creates a runtime item instance from an id.

#### Parameters

##### itemId

`string`

Registered item id.

#### Returns

`unknown`

***

### getActive()

```ts
getActive(): ItemDefinition<unknown, unknown> | undefined
```

Defined in: [sandkit/api/items.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L37)

Returns the item definition for the active hotbar slot.

#### Returns

[`ItemDefinition`](#itemdefinition)\<`unknown`, `unknown`\> \| `undefined`

***

### isActiveById()

```ts
isActiveById(itemId: string | number, itemType?: unknown): boolean
```

Defined in: [sandkit/api/items.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/items.d.ts#L43)

Returns true when the given item is the active hotbar item.

#### Parameters

##### itemId

`string` \| `number`

Item id or numeric type to compare.

##### itemType?

`unknown`

Optional item type discriminator.

#### Returns

`boolean`
