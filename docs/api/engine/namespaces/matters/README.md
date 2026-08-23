# matters

**`Internal`**

`sandkit.engine.api.matters` — matter type registration and solid updates.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions

### getMatterTypeFromId()

```ts
getMatterTypeFromId(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/matters.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/matters.d.ts#L15)

Resolve a matter type from an id string.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### register()

```ts
register(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/matters.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/matters.d.ts#L20)

Register a custom matter type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### runSolidUpdate()

```ts
runSolidUpdate(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/matters.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/matters.d.ts#L25)

Run one solid-matter update step.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
