# persistent

Lights that persist in the world save.

## Functions

### createAtWorld()

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

[`PersistentLightOptions`](api/sandkit/api/namespaces/lights/README.md#persistentlightoptions)

Brightness, size, color, and persistence options.

#### Returns

`unknown`

***

### removeAtWorld()

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

### fadeAtWorld()

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

### markDirty()

```ts
markDirty(): void
```

Defined in: [sandkit/api/lights.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/lights.d.ts#L47)

Marks persistent lights dirty so they are saved on the next flush.

#### Returns

`void`
