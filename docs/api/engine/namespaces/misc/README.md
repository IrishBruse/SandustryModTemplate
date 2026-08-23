# misc

**`Internal`**

`sandkit.engine.api.misc` — miscellaneous structure behavior registration.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions

### register()

```ts
register(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/misc.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/misc.d.ts#L15)

Register a miscellaneous structure behavior.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
