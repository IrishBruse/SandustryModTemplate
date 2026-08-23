# extensions

**`Internal`**

`sandkit.engine.api.extensions` — structure extension definitions.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions

### define()

```ts
define(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/extensions.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/extensions.d.ts#L15)

Define a structure extension type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
