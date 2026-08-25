# sandkit.engine.api.auralite

**`Internal`**

`sandkit.engine.api.auralite` — auralite production tracking.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.auralite.ensureProducedAtLeast() :id=ensureproducedatleast

```ts
ensureProducedAtLeast(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/auralite.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/auralite.d.ts#L15)

Ensure at least the given amount of auralite has been produced.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.auralite.getProduced() :id=getproduced

```ts
getProduced(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/auralite.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/auralite.d.ts#L20)

Return total auralite produced so far.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
