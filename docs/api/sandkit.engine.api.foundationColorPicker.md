# sandkit.engine.api.foundationColorPicker

**`Internal`**

`sandkit.engine.api.foundationColorPicker` — foundation tile color lookup.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.foundationColorPicker.getColor() :id=getcolor

```ts
getColor(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/foundationColorPicker.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/foundationColorPicker.d.ts#L15)

Return the color on a foundation tile.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
