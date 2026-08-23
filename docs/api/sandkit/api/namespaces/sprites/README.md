# sprites

## Interfaces

### SpriteLoadOptions

Defined in: [sandkit/api/sprites.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L40)

Options for [load](#load) and [loadFromMod](#loadfrommod).

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### tint?

```ts
optional tint?: number
```

Defined in: [sandkit/api/sprites.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L42)

Packed RGB tint applied after load.

## Type Aliases

### LoadedSprite

```ts
LoadedSprite = unknown
```

Defined in: [sandkit/api/sprites.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L37)

Loaded sprite handle (runtime texture or display object).

## Functions

### load()

```ts
load(spriteId: string, path: string, options?: SpriteLoadOptions): Promise<void>
```

Defined in: [sandkit/api/sprites.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L15)

Load a sprite from a URL path.

#### Parameters

##### spriteId

`string`

Id used with [getById](#getbyid).

##### path

`string`

URL or asset path to load.

##### options?

[`SpriteLoadOptions`](#spriteloadoptions)

Optional tint and load options.

#### Returns

`Promise`\<`void`\>

***

### loadFromMod()

```ts
loadFromMod(spriteId: string, relativePath: string, options?: SpriteLoadOptions): Promise<void>
```

Defined in: [sandkit/api/sprites.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L22)

Load a sprite from the calling mod folder.

#### Parameters

##### spriteId

`string`

Id used with [getById](#getbyid).

##### relativePath

`string`

Path relative to the mod folder.

##### options?

[`SpriteLoadOptions`](#spriteloadoptions)

Optional tint and load options.

#### Returns

`Promise`\<`void`\>

***

### getById()

```ts
getById(spriteId: string): unknown
```

Defined in: [sandkit/api/sprites.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L27)

Return a loaded sprite by id.

#### Parameters

##### spriteId

`string`

Sprite id from [load](#load) or [loadFromMod](#loadfrommod).

#### Returns

`unknown`

***

### hideAllPlayerModSprites()

```ts
hideAllPlayerModSprites(): void
```

Defined in: [sandkit/api/sprites.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L29)

Hide all player mod-attached sprites.

#### Returns

`void`

***

### rotatePlayerModSprites()

```ts
rotatePlayerModSprites(angle: number): void
```

Defined in: [sandkit/api/sprites.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sprites.d.ts#L34)

Rotate all player mod-attached sprites by angle.

#### Parameters

##### angle

`number`

Rotation in radians.

#### Returns

`void`
