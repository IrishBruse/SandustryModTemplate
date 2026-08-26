# sandkit

Live `sandkit` object — shape, ambient binding docs, and nested bags.

Mirrors on-disk `src/sandkit/` and the host free variable: `api`, `engine`,
`enums`, `react`, `state`. Prefer the free name `sandkit` in mod code
(`src/global.d.ts`); do not import a value binding.

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.SandkitApi :id=sandkitapi

```ts
SandkitApi = object
```

Defined in: [sandkit/api/sandkit-api.d.ts:8](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L8)

Composed main-thread `sandkit.api` object type.

Each property matches a namespace under `sandkit.api.*`.
Namespace members are documented in their module files.
Use this type when typing the host `sandkit.api` value as a whole.

#### Properties

##### action

```ts
action: action
```

Defined in: [sandkit/api/sandkit-api.d.ts:10](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L10)

Player action and custom action data.

##### assets

```ts
assets: assets
```

Defined in: [sandkit/api/sandkit-api.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L12)

Mod asset URLs and provider selection.

##### authorization

```ts
authorization: authorization
```

Defined in: [sandkit/api/sandkit-api.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L14)

Build authorization checks.

##### building

```ts
building: building
```

Defined in: [sandkit/api/sandkit-api.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L16)

Building mode and placement.

##### camera

```ts
camera: camera
```

Defined in: [sandkit/api/sandkit-api.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L18)

Camera position and bounds.

##### collector

```ts
collector: collector
```

Defined in: [sandkit/api/sandkit-api.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L20)

Collector machine helpers.

##### constants

```ts
constants: constants
```

Defined in: [sandkit/api/sandkit-api.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L22)

Shared game constants.

##### cooldown

```ts
cooldown: cooldown
```

Defined in: [sandkit/api/sandkit-api.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L24)

Cooldown timers.

##### discoveries

```ts
discoveries: discoveries
```

Defined in: [sandkit/api/sandkit-api.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L26)

Discovery tracking.

##### effects

```ts
effects: effects
```

Defined in: [sandkit/api/sandkit-api.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L28)

Visual and gameplay effects.

##### elements

```ts
elements: elements
```

Defined in: [sandkit/api/sandkit-api.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L30)

Element types and cell mutations.

##### energy

```ts
energy: energy
```

Defined in: [sandkit/api/sandkit-api.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L32)

Energy network helpers.

##### events

```ts
events: events
```

Defined in: [sandkit/api/sandkit-api.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L34)

Game event subscription.

##### excavation

```ts
excavation: excavation
```

Defined in: [sandkit/api/sandkit-api.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L36)

Excavation helpers.

##### fire

```ts
fire: fire
```

Defined in: [sandkit/api/sandkit-api.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L38)

Fire and burning helpers.

##### gameConfig

```ts
gameConfig: gameConfig
```

Defined in: [sandkit/api/sandkit-api.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L40)

Game configuration values.

##### grid

```ts
grid: grid
```

Defined in: [sandkit/api/sandkit-api.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L42)

Grid metrics and cell helpers.

##### hooks

```ts
hooks: hooks
```

Defined in: [sandkit/api/sandkit-api.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L44)

Intercept and modify hooks.

##### i18n

```ts
i18n: i18n
```

Defined in: [sandkit/api/sandkit-api.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L46)

Localization strings.

##### input

```ts
input: input
```

Defined in: [sandkit/api/sandkit-api.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L48)

Input state and bindings.

##### items

```ts
items: items
```

Defined in: [sandkit/api/sandkit-api.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L50)

Item definitions and inventory.

##### lights

```ts
lights: lights
```

Defined in: [sandkit/api/sandkit-api.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L52)

Dynamic light sources.

##### maps

```ts
maps: maps
```

Defined in: [sandkit/api/sandkit-api.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L54)

Map selection and session start.

##### mods

```ts
mods: mods
```

Defined in: [sandkit/api/sandkit-api.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L56)

Mod asset provider lookup.

##### patterns

```ts
patterns: patterns
```

Defined in: [sandkit/api/sandkit-api.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L58)

Excavation pattern helpers.

##### player

```ts
player: player
```

Defined in: [sandkit/api/sandkit-api.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L60)

Player position, movement, and inventory.

##### processing

```ts
processing: processing
```

Defined in: [sandkit/api/sandkit-api.d.ts:62](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L62)

Processing recipe registration.

##### progression

```ts
progression: progression
```

Defined in: [sandkit/api/sandkit-api.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L64)

Story progression completion.

##### projectiles

```ts
projectiles: projectiles
```

Defined in: [sandkit/api/sandkit-api.d.ts:66](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L66)

Projectile spawn and lifecycle.

##### random

```ts
random: random
```

Defined in: [sandkit/api/sandkit-api.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L68)

Game random number helpers.

##### raycast

```ts
raycast: raycast
```

Defined in: [sandkit/api/sandkit-api.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L70)

World raycast queries.

##### reactions

```ts
reactions: reactions
```

Defined in: [sandkit/api/sandkit-api.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L72)

Element contact reactions.

##### rendering

```ts
rendering: rendering
```

Defined in: [sandkit/api/sandkit-api.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L74)

Screen drawing and overlay canvas.

##### resources

```ts
resources: resources
```

Defined in: [sandkit/api/sandkit-api.d.ts:76](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L76)

Fluxite and energy resources.

##### scene

```ts
scene: scene
```

Defined in: [sandkit/api/sandkit-api.d.ts:78](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L78)

Active game scene.

##### schedule

```ts
schedule: schedule
```

Defined in: [sandkit/api/sandkit-api.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L80)

Next-tick callback scheduling.

##### settings

```ts
settings: settings
```

Defined in: [sandkit/api/sandkit-api.d.ts:82](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L82)

Game settings read and change events.

##### shared

```ts
shared: shared
```

Defined in: [sandkit/api/sandkit-api.d.ts:84](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L84)

Cross-thread shared buffers.

##### signals

```ts
signals: signals
```

Defined in: [sandkit/api/sandkit-api.d.ts:86](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L86)

Signal target registration.

##### sound

```ts
sound: sound
```

Defined in: [sandkit/api/sandkit-api.d.ts:88](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L88)

Sound playback and stop controls.

##### sprites

```ts
sprites: sprites
```

Defined in: [sandkit/api/sandkit-api.d.ts:90](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L90)

Sprite load and transforms.

##### storage

```ts
storage: storage
```

Defined in: [sandkit/api/sandkit-api.d.ts:92](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L92)

Per-mod and local storage.

##### structureBehaviors

```ts
structureBehaviors: structureBehaviors
```

Defined in: [sandkit/api/sandkit-api.d.ts:94](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L94)

Conveyor and launcher behaviors.

##### structures

```ts
structures: structures
```

Defined in: [sandkit/api/sandkit-api.d.ts:96](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L96)

Structure registration and queries.

##### tech

```ts
tech: tech
```

Defined in: [sandkit/api/sandkit-api.d.ts:98](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L98)

Tech tree definitions and locks.

##### terrains

```ts
terrains: terrains
```

Defined in: [sandkit/api/sandkit-api.d.ts:100](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L100)

Terrain registration and mutations.

##### time

```ts
time: time
```

Defined in: [sandkit/api/sandkit-api.d.ts:102](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L102)

Game time and tick counter.

##### tools

```ts
tools: tools
```

Defined in: [sandkit/api/sandkit-api.d.ts:104](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L104)

Tool-specific helpers.

##### triggers

```ts
triggers: triggers
```

Defined in: [sandkit/api/sandkit-api.d.ts:106](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L106)

Interval trigger registration.

##### ui

```ts
ui: ui
```

Defined in: [sandkit/api/sandkit-api.d.ts:108](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L108)

UI overlays, dialogs, and navigation.

##### upgrades

```ts
upgrades: upgrades
```

Defined in: [sandkit/api/sandkit-api.d.ts:110](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L110)

Upgrade categories and levels.

##### utils

```ts
utils: utils
```

Defined in: [sandkit/api/sandkit-api.d.ts:112](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L112)

Vector math helpers.

##### workers

```ts
workers: workers
```

Defined in: [sandkit/api/sandkit-api.d.ts:114](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L114)

Worker post-update control.

##### world

```ts
world: world
```

Defined in: [sandkit/api/sandkit-api.d.ts:116](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/sandkit-api.d.ts#L116)

World cells, fog, redraw, and pickups.

***

### sandkit.Sandkit :id=sandkit

```ts
Sandkit = object
```

Defined in: [sandkit/index.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L22)

Shape of the host-injected `sandkit` free variable in mod `main.js`.

#### Properties

##### api

```ts
api: SandkitApi
```

Defined in: [sandkit/index.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L24)

Public mod API. See [sandkit.api](#api-1).

##### apiVersion

```ts
apiVersion: number
```

Defined in: [sandkit/index.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L26)

Sandkit API version number (live value is `1`).

##### engine

```ts
engine: SandkitEngine
```

Defined in: [sandkit/index.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L31)

**`Internal`**

State-first internals. See [SandkitEngine](api/sandkit.engine.md#sandkitengine).

##### enums

```ts
enums: SandkitEnums
```

Defined in: [sandkit/index.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L33)

Runtime enum bags. See [sandkit.enums](#enums-1).

##### react

```ts
react: SandkitReact
```

Defined in: [sandkit/index.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L35)

Host React package. See [SandkitReact](api/sandkit.react.md#sandkitreact).

##### state

```ts
state: SandkitState
```

Defined in: [sandkit/index.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/index.d.ts#L40)

Game state. Same object as `sandkit.engine.state` at runtime.
See [SandkitState](api/sandkit.engine.md#sandkitstate).

## References <!-- {docsify-ignore} -->

### sandkit.api :id=api

Renames and re-exports [sandkit/api](api/sandkit.api.md)

***

### sandkit.engine :id=engine

Re-exports [engine](api/sandkit.engine.md)

***

### sandkit.enums :id=enums

Renames and re-exports [sandkit/enums](api/sandkit.enums.md)

***

### sandkit.SandkitEngine :id=sandkitengine

Re-exports [SandkitEngine](api/sandkit.engine.md#sandkitengine)

***

### sandkit.SandkitEngineApi :id=sandkitengineapi

Re-exports [SandkitEngineApi](api/sandkit.engine.md#sandkitengineapi)

***

### sandkit.RetroConsoleApi :id=retroconsoleapi

Re-exports [RetroConsoleApi](api/sandkit.engine.md#retroconsoleapi)

***

### sandkit.SandkitState :id=sandkitstate

Re-exports [SandkitState](api/sandkit.engine.md#sandkitstate)

***

### sandkit.SandkitEnums :id=sandkitenums

Re-exports [SandkitEnums](api/sandkit.enums.md#sandkitenums)

***

### sandkit.SandkitReact :id=sandkitreact

Re-exports [SandkitReact](api/sandkit.react.md#sandkitreact)
