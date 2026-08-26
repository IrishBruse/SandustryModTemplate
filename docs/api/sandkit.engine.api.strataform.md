# sandkit.engine.api.strataform

**`Internal`**

`sandkit.engine.api.strataform` — strataform event triggers and type registration.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.strataform.getDefaultConfig() :id=getdefaultconfig

```ts
getDefaultConfig(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/strataform.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/strataform.d.ts#L15)

Return the default strataform configuration.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.strataform.getRegisteredTypes() :id=getregisteredtypes

```ts
getRegisteredTypes(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/strataform.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/strataform.d.ts#L20)

Return all registered strataform types.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.strataform.registerType() :id=registertype

```ts
registerType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/strataform.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/strataform.d.ts#L25)

Register a custom strataform type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.strataform.trigger() :id=trigger

```ts
trigger(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/strataform.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/strataform.d.ts#L30)

Trigger a strataform event at a location.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.strataform.triggerByType() :id=triggerbytype

```ts
triggerByType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/strataform.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/strataform.d.ts#L35)

Trigger a strataform event by type id.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
