# sandkit.engine.api.conveyors

**`Internal`**

`sandkit.engine.api.conveyors` — conveyor type registration.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.conveyors.registerType() :id=registertype

```ts
registerType(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/conveyors.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/conveyors.d.ts#L15)

Register a custom conveyor type.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
