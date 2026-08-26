# sandkit.engine

**`Internal`**

`sandkit.engine` — state-first engine APIs and Retro Console.

Runtime paths: `sandkit.engine.api.<name>` and `sandkit.engine.state`
(same object as `sandkit.state`). Available on both the main thread
(`main.js`) and worker thread (`worker.js`). The public `sandkit.api`
surface still differs by runtime.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
These declarations are best-effort stubs. There is no guarantee they are
complete or correct.

## Namespaces <!-- {docsify-ignore} -->

- [augments](api/sandkit.engine.api.augments.md)
- [auralite](api/sandkit.engine.api.auralite.md)
- [blueprints](api/sandkit.engine.api.blueprints.md)
- [clipboard](api/sandkit.engine.api.clipboard.md)
- [colorPicker](api/sandkit.engine.api.colorPicker.md)
- [coloringTool](api/sandkit.engine.api.coloringTool.md)
- [conveyors](api/sandkit.engine.api.conveyors.md)
- [debug](api/sandkit.engine.api.debug.md)
- [drones](api/sandkit.engine.api.drones.md)
- [entities](api/sandkit.engine.api.entities.md)
- [extensions](api/sandkit.engine.api.extensions.md)
- [factory](api/sandkit.engine.api.factory.md)
- [foliage](api/sandkit.engine.api.foliage.md)
- [foundationColorPicker](api/sandkit.engine.api.foundationColorPicker.md)
- [game](api/sandkit.engine.api.game.md)
- [heatTransfer](api/sandkit.engine.api.heatTransfer.md)
- [launchers](api/sandkit.engine.api.launchers.md)
- [lightColorPicker](api/sandkit.engine.api.lightColorPicker.md)
- [matters](api/sandkit.engine.api.matters.md)
- [misc](api/sandkit.engine.api.misc.md)
- [portals](api/sandkit.engine.api.portals.md)
- [prefabData](api/sandkit.engine.api.prefabData.md)
- [prefabDecor](api/sandkit.engine.api.prefabDecor.md)
- [prefabulator](api/sandkit.engine.api.prefabulator.md)
- [prismaline](api/sandkit.engine.api.prismaline.md)
- [prismite](api/sandkit.engine.api.prismite.md)
- [queue](api/sandkit.engine.api.queue.md)
- [shadows](api/sandkit.engine.api.shadows.md)
- [strataform](api/sandkit.engine.api.strataform.md)
- [swarmConsole](api/sandkit.engine.api.swarmConsole.md)
- [sweeperDrone](api/sandkit.engine.api.sweeperDrone.md)
- [teleportZones](api/sandkit.engine.api.teleportZones.md)
- [tutorialBuild](api/sandkit.engine.api.tutorialBuild.md)
- [usageTracker](api/sandkit.engine.api.usageTracker.md)
- [wall](api/sandkit.engine.api.wall.md)
- [workerLocal](api/sandkit.engine.api.workerLocal.md)

## Interfaces <!-- {docsify-ignore} -->

### sandkit.engine.SandkitEngine :id=sandkitengine

Defined in: [sandkit/engine/index.d.ts:132](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L132)

**`Internal`**

Host `sandkit.engine` object (main and worker).

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
At runtime `sandkit.engine.state === sandkit.state`.

#### Properties

##### api

```ts
api: SandkitEngineApi
```

Defined in: [sandkit/engine/index.d.ts:133](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L133)

##### state

```ts
state: SandkitState
```

Defined in: [sandkit/engine/index.d.ts:134](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L134)

***

### sandkit.engine.RetroConsoleDisplay :id=retroconsoledisplay

Defined in: [sandkit/engine/retro-console.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L14)

**`Internal`**

Low-resolution display buffer for a Retro Console game.

#### Properties

##### width

```ts
width: number
```

Defined in: [sandkit/engine/retro-console.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L15)

##### height

```ts
height: number
```

Defined in: [sandkit/engine/retro-console.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L16)

#### Methods

##### clearScreen()

```ts
clearScreen(value?: RetroConsolePixel): void
```

Defined in: [sandkit/engine/retro-console.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L18)

Clear the framebuffer. Optional fill value defaults to off.

###### Parameters

###### value?

[`RetroConsolePixel`](#retroconsolepixel)

###### Returns

`void`

##### drawPixel()

```ts
drawPixel(x: number, y: number, value: RetroConsolePixel): void
```

Defined in: [sandkit/engine/retro-console.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L20)

Set one pixel in the framebuffer.

###### Parameters

###### x

`number`

###### y

`number`

###### value

[`RetroConsolePixel`](#retroconsolepixel)

###### Returns

`void`

***

### sandkit.engine.RetroConsoleInput :id=retroconsoleinput

Defined in: [sandkit/engine/retro-console.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L24)

**`Internal`**

Directional input from the Retro Console controls.

#### Properties

##### x

```ts
x: number
```

Defined in: [sandkit/engine/retro-console.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L25)

##### y

```ts
y: number
```

Defined in: [sandkit/engine/retro-console.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L26)

***

### sandkit.engine.RetroConsoleGameOptions :id=retroconsolegameoptions

Defined in: [sandkit/engine/retro-console.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L30)

**`Internal`**

Display size options for a registered Retro Console game.

#### Properties

##### width

```ts
width: number
```

Defined in: [sandkit/engine/retro-console.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L31)

##### height

```ts
height: number
```

Defined in: [sandkit/engine/retro-console.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L32)

***

### sandkit.engine.RetroConsoleGame :id=retroconsolegame

Defined in: [sandkit/engine/retro-console.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L36)

**`Internal`**

Retro Console game definition passed to [RetroConsoleApi.registerGame](#registergame).

#### Type Parameters

##### TState

`TState` = `unknown`

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/engine/retro-console.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L37)

##### name

```ts
name: string
```

Defined in: [sandkit/engine/retro-console.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L38)

##### options?

```ts
optional options?: RetroConsoleGameOptions
```

Defined in: [sandkit/engine/retro-console.d.ts:39](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L39)

#### Methods

##### init()

```ts
init(display: RetroConsoleDisplay): TState
```

Defined in: [sandkit/engine/retro-console.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L41)

Create initial game state and draw the first frame.

###### Parameters

###### display

[`RetroConsoleDisplay`](#retroconsoledisplay)

###### Returns

`TState`

##### update()

```ts
update(display: RetroConsoleDisplay, state: TState): TState
```

Defined in: [sandkit/engine/retro-console.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L43)

Advance one frame and return updated game state.

###### Parameters

###### display

[`RetroConsoleDisplay`](#retroconsoledisplay)

###### state

`TState`

###### Returns

`TState`

##### handleInput()?

```ts
optional handleInput(display: RetroConsoleDisplay, state: TState, input: RetroConsoleInput): TState
```

Defined in: [sandkit/engine/retro-console.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L45)

Handle player input when provided.

###### Parameters

###### display

[`RetroConsoleDisplay`](#retroconsoledisplay)

###### state

`TState`

###### input

[`RetroConsoleInput`](#retroconsoleinput)

###### Returns

`TState`

***

### sandkit.engine.RetroConsoleApi :id=retroconsoleapi

Defined in: [sandkit/engine/retro-console.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L49)

**`Internal`**

`sandkit.engine.api.retroConsole` registration API.

#### Methods

##### registerGame()

```ts
registerGame<TState>(game: RetroConsoleGame<TState>): void
```

Defined in: [sandkit/engine/retro-console.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L51)

Register a Retro Console mini-game.

###### Type Parameters

###### TState

`TState`

###### Parameters

###### game

[`RetroConsoleGame`](#retroconsolegame)\<`TState`\>

###### Returns

`void`

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.engine.SandkitEngineApi :id=sandkitengineapi

```ts
SandkitEngineApi = object
```

Defined in: [sandkit/engine/index.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L32)

**`Internal`**

Composed `sandkit.engine.api` shape.

Overlap namespaces mirror [sandkit.api](api/sandkit.md#api-1) with state-first signatures.
Engine-only namespaces are declared under `api/`.

#### Properties

##### action

```ts
action: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L34)

##### authorization

```ts
authorization: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L35)

##### building

```ts
building: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L36)

##### camera

```ts
camera: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L37)

##### collector

```ts
collector: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L38)

##### constants

```ts
constants: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:39](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L39)

##### cooldown

```ts
cooldown: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L40)

##### discoveries

```ts
discoveries: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:41](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L41)

##### effects

```ts
effects: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L42)

##### elements

```ts
elements: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L43)

##### energy

```ts
energy: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L44)

##### events

```ts
events: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L45)

##### excavation

```ts
excavation: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L46)

##### fire

```ts
fire: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L47)

##### grid

```ts
grid: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L48)

##### hooks

```ts
hooks: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:49](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L49)

##### i18n

```ts
i18n: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L50)

##### input

```ts
input: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L51)

##### items

```ts
items: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L52)

##### lights

```ts
lights: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L53)

##### maps

```ts
maps: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L54)

##### patterns

```ts
patterns: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L55)

##### player

```ts
player: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L56)

##### processing

```ts
processing: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L57)

##### progression

```ts
progression: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L58)

##### projectiles

```ts
projectiles: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:59](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L59)

##### random

```ts
random: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L60)

##### raycast

```ts
raycast: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:61](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L61)

##### reactions

```ts
reactions: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:62](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L62)

##### rendering

```ts
rendering: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:63](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L63)

##### resources

```ts
resources: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:64](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L64)

##### scene

```ts
scene: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L65)

##### schedule

```ts
schedule: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:66](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L66)

##### signals

```ts
signals: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L67)

##### sound

```ts
sound: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L68)

##### sprites

```ts
sprites: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:69](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L69)

##### storage

```ts
storage: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L70)

##### structures

```ts
structures: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:71](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L71)

##### tech

```ts
tech: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L72)

##### terrains

```ts
terrains: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:73](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L73)

##### tools

```ts
tools: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L74)

##### triggers

```ts
triggers: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:75](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L75)

##### ui

```ts
ui: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:76](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L76)

##### upgrades

```ts
upgrades: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:77](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L77)

##### utils

```ts
utils: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:78](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L78)

##### workers

```ts
workers: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:79](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L79)

##### world

```ts
world: EngineOverlapNs
```

Defined in: [sandkit/engine/index.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L80)

##### augments

```ts
augments: augments
```

Defined in: [sandkit/engine/index.d.ts:83](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L83)

##### auralite

```ts
auralite: auralite
```

Defined in: [sandkit/engine/index.d.ts:84](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L84)

##### blueprints

```ts
blueprints: blueprints
```

Defined in: [sandkit/engine/index.d.ts:85](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L85)

##### clipboard

```ts
clipboard: clipboard
```

Defined in: [sandkit/engine/index.d.ts:86](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L86)

##### colorPicker

```ts
colorPicker: colorPicker
```

Defined in: [sandkit/engine/index.d.ts:87](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L87)

##### coloringTool

```ts
coloringTool: coloringTool
```

Defined in: [sandkit/engine/index.d.ts:88](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L88)

##### conveyors

```ts
conveyors: conveyors
```

Defined in: [sandkit/engine/index.d.ts:89](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L89)

##### debug

```ts
debug: debug
```

Defined in: [sandkit/engine/index.d.ts:90](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L90)

##### drones

```ts
drones: drones
```

Defined in: [sandkit/engine/index.d.ts:91](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L91)

##### entities

```ts
entities: entities
```

Defined in: [sandkit/engine/index.d.ts:92](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L92)

##### extensions

```ts
extensions: extensions
```

Defined in: [sandkit/engine/index.d.ts:93](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L93)

##### factory

```ts
factory: factory
```

Defined in: [sandkit/engine/index.d.ts:94](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L94)

##### foliage

```ts
foliage: foliage
```

Defined in: [sandkit/engine/index.d.ts:95](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L95)

##### foundationColorPicker

```ts
foundationColorPicker: foundationColorPicker
```

Defined in: [sandkit/engine/index.d.ts:96](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L96)

##### game

```ts
game: game
```

Defined in: [sandkit/engine/index.d.ts:97](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L97)

##### heatTransfer

```ts
heatTransfer: heatTransfer
```

Defined in: [sandkit/engine/index.d.ts:98](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L98)

##### launchers

```ts
launchers: launchers
```

Defined in: [sandkit/engine/index.d.ts:99](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L99)

##### lightColorPicker

```ts
lightColorPicker: lightColorPicker
```

Defined in: [sandkit/engine/index.d.ts:100](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L100)

##### matters

```ts
matters: matters
```

Defined in: [sandkit/engine/index.d.ts:101](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L101)

##### misc

```ts
misc: misc
```

Defined in: [sandkit/engine/index.d.ts:102](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L102)

##### portals

```ts
portals: portals
```

Defined in: [sandkit/engine/index.d.ts:103](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L103)

##### prefabData

```ts
prefabData: prefabData
```

Defined in: [sandkit/engine/index.d.ts:104](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L104)

##### prefabDecor

```ts
prefabDecor: prefabDecor
```

Defined in: [sandkit/engine/index.d.ts:105](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L105)

##### prefabulator

```ts
prefabulator: prefabulator
```

Defined in: [sandkit/engine/index.d.ts:106](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L106)

##### prismaline

```ts
prismaline: prismaline
```

Defined in: [sandkit/engine/index.d.ts:107](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L107)

##### prismite

```ts
prismite: prismite
```

Defined in: [sandkit/engine/index.d.ts:108](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L108)

##### queue

```ts
queue: queue
```

Defined in: [sandkit/engine/index.d.ts:109](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L109)

##### shadows

```ts
shadows: shadows
```

Defined in: [sandkit/engine/index.d.ts:110](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L110)

##### strataform

```ts
strataform: strataform
```

Defined in: [sandkit/engine/index.d.ts:111](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L111)

##### swarmConsole

```ts
swarmConsole: swarmConsole
```

Defined in: [sandkit/engine/index.d.ts:112](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L112)

##### sweeperDrone

```ts
sweeperDrone: sweeperDrone
```

Defined in: [sandkit/engine/index.d.ts:113](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L113)

##### teleportZones

```ts
teleportZones: teleportZones
```

Defined in: [sandkit/engine/index.d.ts:114](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L114)

##### tutorialBuild

```ts
tutorialBuild: tutorialBuild
```

Defined in: [sandkit/engine/index.d.ts:115](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L115)

##### usageTracker

```ts
usageTracker: usageTracker
```

Defined in: [sandkit/engine/index.d.ts:116](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L116)

##### wall

```ts
wall: wall
```

Defined in: [sandkit/engine/index.d.ts:117](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L117)

##### workerLocal

```ts
workerLocal: workerLocal
```

Defined in: [sandkit/engine/index.d.ts:118](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L118)

##### config

```ts
config: EngineFn
```

Defined in: [sandkit/engine/index.d.ts:119](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L119)

##### extend

```ts
extend: EngineFn
```

Defined in: [sandkit/engine/index.d.ts:120](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L120)

##### retroConsole

```ts
retroConsole: RetroConsoleApi
```

Defined in: [sandkit/engine/index.d.ts:121](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/index.d.ts#L121)

***

### sandkit.engine.RetroConsolePixel :id=retroconsolepixel

```ts
RetroConsolePixel = boolean | number
```

Defined in: [sandkit/engine/retro-console.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/retro-console.d.ts#L11)

**`Internal`**

Pixel value for the Retro Console framebuffer.

***

### sandkit.engine.SandkitState :id=sandkitstate

```ts
SandkitState = object
```

Defined in: [sandkit/engine/state.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/state.d.ts#L12)

**`Internal`**

Live game state exposed on `sandkit.engine.state`.

#### Properties

##### environment

```ts
environment: object
```

Defined in: [sandkit/engine/state.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/state.d.ts#L13)

###### Index Signature

\[`key`: `string`\]: `unknown`

###### context

```ts
context: number
```

###### multithreading

```ts
multithreading: unknown
```

##### sandkit

```ts
sandkit: object
```

Defined in: [sandkit/engine/state.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/state.d.ts#L18)

###### Index Signature

\[`key`: `string`\]: `unknown`

###### events

```ts
events: unknown
```

###### gameReady

```ts
gameReady: boolean
```

###### graphics

```ts
graphics: unknown
```

###### hooks

```ts
hooks: unknown
```

###### keyBindings

```ts
keyBindings: unknown
```

###### mods

```ts
mods: unknown
```

###### registeredLauncherTypes

```ts
registeredLauncherTypes: unknown
```

##### session

```ts
session: unknown
```

Defined in: [sandkit/engine/state.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/state.d.ts#L28)

##### shared

```ts
shared: unknown
```

Defined in: [sandkit/engine/state.d.ts:29](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/state.d.ts#L29)

##### store

```ts
store: unknown
```

Defined in: [sandkit/engine/state.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/state.d.ts#L30)
