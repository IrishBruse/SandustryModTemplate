# sandkit.api.camera

`sandkit.api.camera` — camera focus and follow control.
Main thread only.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.camera.snapToPlayer() :id=snaptoplayer

```ts
snapToPlayer(): void
```

Defined in: [sandkit/api/camera.d.ts:7](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/camera.d.ts#L7)

Snap the camera to the player position.

#### Returns

`void`

***

### sandkit.api.camera.setFocusAtWorld() :id=setfocusatworld

```ts
setFocusAtWorld(worldX: number, worldY: number): boolean
```

Defined in: [sandkit/api/camera.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/camera.d.ts#L15)

Move camera focus to world coordinates.

#### Parameters

##### worldX

`number`

World x position in pixels.

##### worldY

`number`

World y position in pixels.

#### Returns

`boolean`

True when focus was applied.

***

### sandkit.api.camera.releaseFocus() :id=releasefocus

```ts
releaseFocus(options?: object): boolean
```

Defined in: [sandkit/api/camera.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/camera.d.ts#L22)

Release scripted focus and return control to the player.

#### Parameters

##### options?

Optional transition duration in milliseconds.

###### durationMs?

`number`

#### Returns

`boolean`

True when focus was released.
