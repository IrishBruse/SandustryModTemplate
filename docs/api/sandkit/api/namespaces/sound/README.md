# sound

## Interfaces

### SoundHandle

Defined in: [sandkit/api/sound.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L45)

Handle returned from a play call.

#### Methods

##### stop()

```ts
stop(): void
```

Defined in: [sandkit/api/sound.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L47)

Stop this sound instance.

###### Returns

`void`

***

### SoundLayer

Defined in: [sandkit/api/sound.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L51)

One layer in a layered sound.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### soundId

```ts
soundId: string
```

Defined in: [sandkit/api/sound.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L53)

Sound id for this layer.

##### volume?

```ts
optional volume?: number
```

Defined in: [sandkit/api/sound.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L55)

Layer volume multiplier.

##### delay?

```ts
optional delay?: number
```

Defined in: [sandkit/api/sound.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L57)

Delay in milliseconds before this layer plays.

##### playbackRate?

```ts
optional playbackRate?: number
```

Defined in: [sandkit/api/sound.d.ts:59](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L59)

Playback rate for this layer.

***

### SoundOptions

Defined in: [sandkit/api/sound.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L64)

Options passed to sound play helpers.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### volume?

```ts
optional volume?: number
```

Defined in: [sandkit/api/sound.d.ts:66](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L66)

Volume multiplier (0–1 typical).

##### playbackRate?

```ts
optional playbackRate?: number
```

Defined in: [sandkit/api/sound.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L68)

Playback rate multiplier.

##### position?

```ts
optional position?: object
```

Defined in: [sandkit/api/sound.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L70)

World position for distance attenuation.

###### x

```ts
x: number
```

###### y

```ts
y: number
```

##### loop?

```ts
optional loop?: boolean
```

Defined in: [sandkit/api/sound.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L72)

When true, loop until stopped.

##### rateLimitKey?

```ts
optional rateLimitKey?: string
```

Defined in: [sandkit/api/sound.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L74)

Key used with rateLimitMs to dedupe rapid replays.

##### rateLimitMs?

```ts
optional rateLimitMs?: number
```

Defined in: [sandkit/api/sound.d.ts:76](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L76)

Minimum ms between plays with the same rateLimitKey.

***

### SoundLayersOptions

Defined in: [sandkit/api/sound.d.ts:81](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L81)

Shared options for [playLayers](#playlayers).

#### Properties

##### position?

```ts
optional position?: object
```

Defined in: [sandkit/api/sound.d.ts:83](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L83)

World position applied to all layers.

###### x

```ts
x: number
```

###### y

```ts
y: number
```

##### volume?

```ts
optional volume?: number
```

Defined in: [sandkit/api/sound.d.ts:85](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L85)

Volume multiplier applied to all layers.

##### rateLimitKey?

```ts
optional rateLimitKey?: string
```

Defined in: [sandkit/api/sound.d.ts:87](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L87)

Key used with rateLimitMs to dedupe rapid replays.

##### rateLimitMs?

```ts
optional rateLimitMs?: number
```

Defined in: [sandkit/api/sound.d.ts:89](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L89)

Minimum ms between plays with the same rateLimitKey.

## Functions

### play()

```ts
play(soundId: string, options?: SoundOptions): SoundHandle
```

Defined in: [sandkit/api/sound.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L14)

Play a sound by id with optional options.

#### Parameters

##### soundId

`string`

Registered sound identifier.

##### options?

[`SoundOptions`](#soundoptions)

Volume, position, playback rate, and rate-limit options.

#### Returns

[`SoundHandle`](#soundhandle)

***

### playActive()

```ts
playActive(soundId: string, options?: SoundOptions): SoundHandle
```

Defined in: [sandkit/api/sound.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L20)

Play a sound on the active sound channel.

#### Parameters

##### soundId

`string`

Registered sound identifier.

##### options?

[`SoundOptions`](#soundoptions)

Volume, position, playback rate, and rate-limit options.

#### Returns

[`SoundHandle`](#soundhandle)

***

### playLayers()

```ts
playLayers(layers: SoundLayer[], options?: SoundLayersOptions): SoundHandle[]
```

Defined in: [sandkit/api/sound.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L26)

Play multiple sound layers with shared options.

#### Parameters

##### layers

[`SoundLayer`](#soundlayer)[]

Layer definitions (sound id, volume, delay, and per-layer options).

##### options?

[`SoundLayersOptions`](#soundlayersoptions)

Shared position, volume, and rate-limit options for all layers.

#### Returns

[`SoundHandle`](#soundhandle)[]

***

### calculateDistanceOptionsAtWorld()

```ts
calculateDistanceOptionsAtWorld(worldX: number, worldY: number, baseVolume?: number): SoundOptions
```

Defined in: [sandkit/api/sound.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L33)

Build distance-based volume options for a world position.

#### Parameters

##### worldX

`number`

World X coordinate in pixels.

##### worldY

`number`

World Y coordinate in pixels.

##### baseVolume?

`number`

Base volume before distance attenuation.

#### Returns

[`SoundOptions`](#soundoptions)

***

### stopById()

```ts
stopById(soundId: string): void
```

Defined in: [sandkit/api/sound.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L38)

Stop a sound by id.

#### Parameters

##### soundId

`string`

Registered sound identifier to stop.

#### Returns

`void`

***

### stopActive()

```ts
stopActive(): void
```

Defined in: [sandkit/api/sound.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L40)

Stop the active sound channel.

#### Returns

`void`

***

### stopAll()

```ts
stopAll(): void
```

Defined in: [sandkit/api/sound.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sound.d.ts#L42)

Stop all playing sounds.

#### Returns

`void`
