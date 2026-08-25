# sandkit.engine.api.portals

**`Internal`**

`sandkit.engine.api.portals` — portal marker queries.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.portals.getMarkers() :id=getmarkers

```ts
getMarkers(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/portals.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/portals.d.ts#L15)

Return portal markers in the world.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
