# sandkit.api.lights.persistent

Lights that persist in the world save.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.lights.persistent.createAtWorld() :id=createatworld

```ts
createAtWorld(worldX: number, worldY: number, options?: PersistentLightOptions): unknown
```

Defined in: [sandkit/api/lights.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L32)

Creates a persistent light at world coordinates.

#### Parameters

##### worldX

`number`

World X coordinate in pixels.

##### worldY

`number`

World Y coordinate in pixels.

##### options?

[`PersistentLightOptions`](api/sandkit.api.lights.md#persistentlightoptions)

Brightness, size, color, and persistence options.

#### Returns

`unknown`

***

### sandkit.api.lights.persistent.removeAtWorld() :id=removeatworld

```ts
removeAtWorld(worldX: number, worldY: number): void
```

Defined in: [sandkit/api/lights.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L38)

Removes the persistent light at world coordinates.

#### Parameters

##### worldX

`number`

World X coordinate in pixels.

##### worldY

`number`

World Y coordinate in pixels.

#### Returns

`void`

***

### sandkit.api.lights.persistent.fadeAtWorld() :id=fadeatworld

```ts
fadeAtWorld(worldX: number, worldY: number, durationMs?: number): void
```

Defined in: [sandkit/api/lights.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L45)

Fades out the persistent light at world coordinates over durationMs.

#### Parameters

##### worldX

`number`

World X coordinate in pixels.

##### worldY

`number`

World Y coordinate in pixels.

##### durationMs?

`number`

Fade duration in milliseconds.

#### Returns

`void`

***

### sandkit.api.lights.persistent.markDirty() :id=markdirty

```ts
markDirty(): void
```

Defined in: [sandkit/api/lights.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L47)

Marks persistent lights dirty so they are saved on the next flush.

#### Returns

`void`
