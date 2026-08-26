# sandkit.api.lights.vfx

Short-lived visual effect lights.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.lights.vfx.createAtWorld() :id=createatworld

```ts
createAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): object
```

Defined in: [sandkit/api/lights.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L16)

Creates a temporary light at world coordinates.

#### Parameters

##### worldX

`number`

World X coordinate in pixels.

##### worldY

`number`

World Y coordinate in pixels.

##### options?

[`TemporaryLightOptions`](api/sandkit.api.effects.md#temporarylightoptions)

Brightness, duration, color, and dedup options.

#### Returns

`object`

##### index

```ts
index: number | null
```

***

### sandkit.api.lights.vfx.removeById() :id=removebyid

```ts
removeById(lightId: number): void
```

Defined in: [sandkit/api/lights.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L21)

Removes a temporary light by its id.

#### Parameters

##### lightId

`number`

Light index returned from [createAtWorld](#createatworld).

#### Returns

`void`
