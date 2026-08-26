# sandkit.engine.api.blueprints

**`Internal`**

`sandkit.engine.api.blueprints` — blueprint save, load, and import/export.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.blueprints.delete() :id=delete

```ts
delete(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L15)

Delete a saved blueprint. Runtime property name is `delete`.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.blueprints.exportAllString() :id=exportallstring

```ts
exportAllString(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L21)

Export all blueprints as one string.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.blueprints.exportString() :id=exportstring

```ts
exportString(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L26)

Export one blueprint as a string.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.blueprints.getAll() :id=getall

```ts
getAll(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L31)

Return all saved blueprints.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.blueprints.importString() :id=importstring

```ts
importString(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L36)

Import a blueprint from a string.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.blueprints.load() :id=load

```ts
load(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L41)

Load a blueprint into the active session.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.blueprints.save() :id=save

```ts
save(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/blueprints.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/blueprints.d.ts#L46)

Save the current selection as a blueprint.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
