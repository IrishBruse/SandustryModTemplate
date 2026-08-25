# sandkit.api.upgrades

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.upgrades.UpgradeDefinition :id=upgradedefinition

Defined in: [sandkit/api/upgrades.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L40)

Upgrade definition registered for an item.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### itemId

```ts
itemId: string
```

Defined in: [sandkit/api/upgrades.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L41)

##### itemNameKey?

```ts
optional itemNameKey?: string
```

Defined in: [sandkit/api/upgrades.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L42)

##### categoryId?

```ts
optional categoryId?: string
```

Defined in: [sandkit/api/upgrades.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L43)

##### upgrade

```ts
upgrade: object
```

Defined in: [sandkit/api/upgrades.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L44)

###### id

```ts
id: string
```

###### nameKey?

```ts
optional nameKey?: string
```

###### descriptionKey?

```ts
optional descriptionKey?: string
```

###### maxLevel

```ts
maxLevel: number
```

###### costs

```ts
costs: number[]
```

###### oneOff?

```ts
optional oneOff?: boolean
```

***

### sandkit.api.upgrades.UpgradeCategoryDefinition :id=upgradecategorydefinition

Defined in: [sandkit/api/upgrades.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L56)

Upgrade category definition shape.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/api/upgrades.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L58)

Category identifier referenced by upgrades.

##### nameKey?

```ts
optional nameKey?: string
```

Defined in: [sandkit/api/upgrades.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L60)

Display name translation key.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.upgrades.registerCategory() :id=registercategory

```ts
registerCategory(definition: UpgradeCategoryDefinition): void
```

Defined in: [sandkit/api/upgrades.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L13)

Register an upgrade category.

#### Parameters

##### definition

[`UpgradeCategoryDefinition`](#upgradecategorydefinition)

Category id and display metadata.

#### Returns

`void`

***

### sandkit.api.upgrades.register() :id=register

```ts
register(definition: UpgradeDefinition): void
```

Defined in: [sandkit/api/upgrades.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L18)

Register an upgrade definition.

#### Parameters

##### definition

[`UpgradeDefinition`](#upgradedefinition)

Item id, upgrade id, costs, and level metadata.

#### Returns

`void`

***

### sandkit.api.upgrades.updateDefinition() :id=updatedefinition

```ts
updateDefinition(itemId: string, upgradeId: string, partial: Partial<UpgradeDefinition>): void
```

Defined in: [sandkit/api/upgrades.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L25)

Patch fields on an existing upgrade definition.

#### Parameters

##### itemId

`string`

Parent item id.

##### upgradeId

`string`

Upgrade id within the item.

##### partial

`Partial`\<[`UpgradeDefinition`](#upgradedefinition)\>

Fields to merge into the definition.

#### Returns

`void`

***

### sandkit.api.upgrades.getLevelById() :id=getlevelbyid

```ts
getLevelById(itemId: string, upgradeId: string): number
```

Defined in: [sandkit/api/upgrades.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L31)

Return the current purchased level for an upgrade.

#### Parameters

##### itemId

`string`

Parent item id.

##### upgradeId

`string`

Upgrade id within the item.

#### Returns

`number`

***

### sandkit.api.upgrades.getAvailableLevelById() :id=getavailablelevelbyid

```ts
getAvailableLevelById(itemId: string, upgradeId: string): number
```

Defined in: [sandkit/api/upgrades.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/upgrades.d.ts#L37)

Return the maximum available level for an upgrade.

#### Parameters

##### itemId

`string`

Parent item id.

##### upgradeId

`string`

Upgrade id within the item.

#### Returns

`number`
