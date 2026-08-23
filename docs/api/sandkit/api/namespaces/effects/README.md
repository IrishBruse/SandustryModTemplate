# effects

`sandkit.api.effects` — visual effects, particles, lights, and lasers at world positions.
Main thread only.

## Interfaces

### LaserEffectOptions

Defined in: [sandkit/api/effects.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L46)

Options for laser beam effects.

#### Properties

##### width?

```ts
optional width?: number
```

Defined in: [sandkit/api/effects.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L48)

Beam width in pixels.

##### brightness?

```ts
optional brightness?: number
```

Defined in: [sandkit/api/effects.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L50)

Beam brightness multiplier.

##### color?

```ts
optional color?: number
```

Defined in: [sandkit/api/effects.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L52)

Beam color as a packed integer.

##### glow?

```ts
optional glow?: boolean
```

Defined in: [sandkit/api/effects.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L54)

When true, draws a glow around the beam.

***

### LaserEffectHandle

Defined in: [sandkit/api/effects.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L58)

Handle returned by createLaserAtWorld.

#### Methods

##### destroy()

```ts
destroy(): void
```

Defined in: [sandkit/api/effects.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L60)

Removes the laser from the scene.

###### Returns

`void`

***

### DistortionEffectOptions

Defined in: [sandkit/api/effects.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L64)

Options for distortion wave effects.

#### Properties

##### style?

```ts
optional style?: "implode" | "explode"
```

Defined in: [sandkit/api/effects.d.ts:66](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L66)

Distortion style: implode or explode.

##### duration?

```ts
optional duration?: number
```

Defined in: [sandkit/api/effects.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L68)

Effect duration in seconds.

##### maxRadius?

```ts
optional maxRadius?: number
```

Defined in: [sandkit/api/effects.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L70)

Maximum radius of the wave.

##### intensity?

```ts
optional intensity?: number
```

Defined in: [sandkit/api/effects.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L72)

Visual intensity of the distortion.

##### color?

```ts
optional color?: [number, number, number, number]
```

Defined in: [sandkit/api/effects.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L74)

RGBA color components for the effect.

***

### EffectOptions

Defined in: [shared/api/effects.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L35)

Generic duration and radius options for world effects.

#### Properties

##### duration?

```ts
optional duration?: number
```

Defined in: [shared/api/effects.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L36)

##### maxRadius?

```ts
optional maxRadius?: number
```

Defined in: [shared/api/effects.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L37)

##### intensity?

```ts
optional intensity?: number
```

Defined in: [shared/api/effects.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L38)

***

### TemporaryLightOptions

Defined in: [shared/api/effects.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L41)

Options for [createLightAtWorld](#createlightatworld).

#### Properties

##### brightness?

```ts
optional brightness?: number
```

Defined in: [shared/api/effects.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L42)

##### duration?

```ts
optional duration?: number
```

Defined in: [shared/api/effects.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L43)

##### durationMs?

```ts
optional durationMs?: number
```

Defined in: [shared/api/effects.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L44)

##### size?

```ts
optional size?: number
```

Defined in: [shared/api/effects.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L45)

##### color?

```ts
optional color?: [number, number, number, number]
```

Defined in: [shared/api/effects.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L46)

##### decay

```ts
decay: number
```

Defined in: [shared/api/effects.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L48)

Light decay rate after spawn.

##### unclamped?

```ts
optional unclamped?: boolean
```

Defined in: [shared/api/effects.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L49)

##### skipDedup?

```ts
optional skipDedup?: boolean
```

Defined in: [shared/api/effects.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L50)

##### useLightZones?

```ts
optional useLightZones?: boolean
```

Defined in: [shared/api/effects.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L51)

##### noopIfFull?

```ts
optional noopIfFull?: boolean
```

Defined in: [shared/api/effects.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L52)

##### priority?

```ts
optional priority?: number
```

Defined in: [shared/api/effects.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L53)

##### dedupKey

```ts
dedupKey: string
```

Defined in: [shared/api/effects.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L55)

Dedupe key when the light pool is full or dedup is enabled.

***

### ParticleEffectOptions

Defined in: [shared/api/effects.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L58)

Options for [createParticlesAtWorld](#createparticlesatworld).

#### Properties

##### count?

```ts
optional count?: number
```

Defined in: [shared/api/effects.d.ts:59](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L59)

##### velocity?

```ts
optional velocity?: Vector2
```

Defined in: [shared/api/effects.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L60)

##### minSpeed?

```ts
optional minSpeed?: number
```

Defined in: [shared/api/effects.d.ts:61](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L61)

##### maxSpeed?

```ts
optional maxSpeed?: number
```

Defined in: [shared/api/effects.d.ts:62](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L62)

##### color?

```ts
optional color?: number
```

Defined in: [shared/api/effects.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L64)

Hex code. No alpha.

##### minSize?

```ts
optional minSize?: number
```

Defined in: [shared/api/effects.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L65)

##### maxSize?

```ts
optional maxSize?: number
```

Defined in: [shared/api/effects.d.ts:66](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L66)

##### minLifetime?

```ts
optional minLifetime?: number
```

Defined in: [shared/api/effects.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L67)

##### maxLifetime?

```ts
optional maxLifetime?: number
```

Defined in: [shared/api/effects.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L68)

##### background?

```ts
optional background?: boolean
```

Defined in: [shared/api/effects.d.ts:69](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L69)

##### imageName?

```ts
optional imageName?: string
```

Defined in: [shared/api/effects.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L70)

##### fadeOutOnly?

```ts
optional fadeOutOnly?: boolean
```

Defined in: [shared/api/effects.d.ts:71](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L71)

##### fadeStart?

```ts
optional fadeStart?: number
```

Defined in: [shared/api/effects.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L72)

##### fadeEnd?

```ts
optional fadeEnd?: number
```

Defined in: [shared/api/effects.d.ts:73](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L73)

##### damp?

```ts
optional damp?: number
```

Defined in: [shared/api/effects.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L74)

## Functions

### createDistortionWaveAtWorld()

```ts
createDistortionWaveAtWorld(worldX: number, worldY: number, options?: DistortionEffectOptions): void
```

Defined in: [sandkit/api/effects.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L29)

Creates a distortion wave effect at world coordinates.

#### Parameters

##### worldX

`number`

World X coordinate in pixels.

##### worldY

`number`

World Y coordinate in pixels.

##### options?

[`DistortionEffectOptions`](#distortioneffectoptions)

Style, duration, radius, intensity, and color.

#### Returns

`void`

***

### createLaserAtWorld()

```ts
createLaserAtWorld(startWorldX: number, startWorldY: number, endWorldX: number, endWorldY: number, options?: LaserEffectOptions): LaserEffectHandle
```

Defined in: [sandkit/api/effects.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L38)

Creates a laser beam between two world points. Returns a handle to destroy it.

#### Parameters

##### startWorldX

`number`

Beam start world X in pixels.

##### startWorldY

`number`

Beam start world Y in pixels.

##### endWorldX

`number`

Beam end world X in pixels.

##### endWorldY

`number`

Beam end world Y in pixels.

##### options?

[`LaserEffectOptions`](#lasereffectoptions)

Width, brightness, color, and glow options.

#### Returns

[`LaserEffectHandle`](#lasereffecthandle)

***

### removeLightById()

```ts
removeLightById(lightId: number): void
```

Defined in: [sandkit/api/effects.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/effects.d.ts#L43)

Removes a temporary light by its id.

#### Parameters

##### lightId

`number`

Light index from [createLightAtWorld](#createlightatworld).

#### Returns

`void`

***

### createLightAtWorld()

```ts
createLightAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): object
```

Defined in: [shared/api/effects.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L17)

Spawn a temporary light at world coordinates.

#### Parameters

##### worldX

`number`

World x position in pixels.

##### worldY

`number`

World y position in pixels.

##### options?

[`TemporaryLightOptions`](#temporarylightoptions)

Brightness, colour, and lifetime settings.

#### Returns

`object`

##### index

```ts
index: number | null
```

***

### createParticlesAtWorld()

```ts
createParticlesAtWorld(worldX: number, worldY: number, options?: ParticleEffectOptions): void
```

Defined in: [shared/api/effects.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L24)

Emit particles at world coordinates.

#### Parameters

##### worldX

`number`

World x position in pixels.

##### worldY

`number`

World y position in pixels.

##### options?

[`ParticleEffectOptions`](#particleeffectoptions)

Count, velocity, colour, and lifetime settings.

#### Returns

`void`

***

### createEffectAtWorld()

```ts
createEffectAtWorld(effectId: "heatWave", worldX: number, worldY: number, options?: EffectOptions): void
```

Defined in: [shared/api/effects.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/effects.d.ts#L32)

Spawn a named screen-space or world effect.

#### Parameters

##### effectId

`"heatWave"`

Registered effect id (for example `heatWave`).

##### worldX

`number`

World x position in pixels.

##### worldY

`number`

World y position in pixels.

##### options?

[`EffectOptions`](#effectoptions)

Duration, radius, and intensity settings.

#### Returns

`void`
