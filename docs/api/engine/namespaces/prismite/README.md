# sandkit.engine.api.prismite

**`Internal`**

`sandkit.engine.api.prismite` — prismite resource consume and availability.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.prismite.consume() :id=consume

```ts
consume(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prismite.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prismite.d.ts#L15)

Consume prismite from the player or world.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.prismite.getAvailable() :id=getavailable

```ts
getAvailable(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prismite.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prismite.d.ts#L20)

Return available prismite amount.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.prismite.getConsumed() :id=getconsumed

```ts
getConsumed(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prismite.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prismite.d.ts#L25)

Return total prismite consumed so far.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
