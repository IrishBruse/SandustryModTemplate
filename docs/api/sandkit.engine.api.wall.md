# sandkit.engine.api.wall

**`Internal`**

`sandkit.engine.api.wall` — wall tile palette and cell data.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.wall.getPaletteData() :id=getpalettedata

```ts
getPaletteData(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/wall.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/wall.d.ts#L15)

Return wall palette data for rendering.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.wall.getWallDataAt() :id=getwalldataat

```ts
getWallDataAt(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/wall.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/wall.d.ts#L20)

Return wall tile data at one cell.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.wall.getWallDataSize() :id=getwalldatasize

```ts
getWallDataSize(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/wall.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/wall.d.ts#L25)

Return the byte size of wall tile data.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.wall.setWallDataAt() :id=setwalldataat

```ts
setWallDataAt(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/wall.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/wall.d.ts#L30)

Set wall tile data at one cell.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
