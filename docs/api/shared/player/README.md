# shared/player

## Interfaces

### Player

Defined in: [shared/player.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L34)

Live player state snapshot (read-only shape for mods).

Reflects `sandkit.engine.state` / store player fields exposed to mods.

#### Properties

##### x

```ts
x: number
```

Defined in: [shared/player.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L36)

Player hitbox left edge in world pixels.

##### y

```ts
y: number
```

Defined in: [shared/player.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L38)

Player hitbox top edge in world pixels.

##### width

```ts
width: number
```

Defined in: [shared/player.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L40)

Player hitbox width in world pixels.

##### height

```ts
height: number
```

Defined in: [shared/player.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L42)

Player hitbox height in world pixels.

##### velocity

```ts
velocity: Vector2
```

Defined in: [shared/player.d.ts:44](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L44)

Current movement velocity in pixels per second.

##### threshold

```ts
threshold: Vector2
```

Defined in: [shared/player.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L46)

Movement threshold accumulator used by physics.

##### onGround

```ts
onGround: boolean
```

Defined in: [shared/player.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L48)

True when the player is standing on ground this tick.

##### speedCapOverdrive

```ts
speedCapOverdrive: object
```

Defined in: [shared/player.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L50)

Temporary speed-cap bonuses applied on each axis.

###### x

```ts
x: object
```

###### x.dir

```ts
dir: null
```

###### x.active

```ts
active: boolean
```

###### x.bonus

```ts
bonus: number
```

###### x.releaseTime

```ts
releaseTime: number
```

###### x.releaseBonus

```ts
releaseBonus: number
```

###### y

```ts
y: object
```

###### y.dir

```ts
dir: null
```

###### y.active

```ts
active: boolean
```

###### y.bonus

```ts
bonus: number
```

###### y.releaseTime

```ts
releaseTime: number
```

###### y.releaseBonus

```ts
releaseBonus: number
```

##### inventory

```ts
inventory: InventoryItem[]
```

Defined in: [shared/player.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L67)

Items currently held in the player inventory.

##### buildings

```ts
buildings: number[]
```

Defined in: [shared/player.d.ts:69](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L69)

Structure type ids the player has unlocked for building.

##### tech

```ts
tech: object
```

Defined in: [shared/player.d.ts:71](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L71)

Tech tree nodes and their unlock metadata.

###### Index Signature

\[`key`: `string` \| `number`\]: `object`

##### lockedTechs

```ts
lockedTechs: object
```

Defined in: [shared/player.d.ts:101](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L101)

Tech ids explicitly locked for this save.

###### Index Signature

\[`key`: `string`\]: `boolean`

##### action

```ts
action: null
```

Defined in: [shared/player.d.ts:103](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L103)

Active world action, or null when idle.

##### hotbar

```ts
hotbar: object
```

Defined in: [shared/player.d.ts:105](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L105)

Hotbar slots, active indices, and item sprites.

###### activeSlotIndex

```ts
activeSlotIndex: number
```

###### hotbarIndex

```ts
hotbarIndex: number
```

###### bars

```ts
bars: AssetRef[][]
```

##### grapplingHook

```ts
grapplingHook: boolean
```

Defined in: [shared/player.d.ts:111](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L111)

True when the grappling hook is equipped or active.

##### cooldowns

```ts
cooldowns: object
```

Defined in: [shared/player.d.ts:113](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L113)

Cooldown timestamps for movement particles and slowdown.

###### boostParticle

```ts
boostParticle: object
```

###### boostParticle.time

```ts
time: number
```

###### boostParticle.last

```ts
last: number
```

###### hoverParticle

```ts
hoverParticle: object
```

###### hoverParticle.time

```ts
time: number
```

###### hoverParticle.last

```ts
last: number
```

###### slowdown

```ts
slowdown: object
```

###### slowdown.last

```ts
last: number
```

##### isHovering

```ts
isHovering: boolean
```

Defined in: [shared/player.d.ts:127](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L127)

True when hover movement mode is active.

##### weaponsMeta

```ts
weaponsMeta: object
```

Defined in: [shared/player.d.ts:129](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L129)

Per-weapon runtime metadata.

###### rocketLauncher

```ts
rocketLauncher: object
```

###### rocketLauncher.ammo

```ts
ammo: object
```

###### rocketLauncher.ammo.current

```ts
current: number
```

###### rocketLauncher.ammo.reload

```ts
reload: object
```

###### rocketLauncher.ammo.reload.last

```ts
last: number
```

###### rocketLauncher.ammo.reloading

```ts
reloading: boolean
```

***

### InventoryItem

Defined in: [shared/player.d.ts:143](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L143)

One hotbar or inventory item entry.

#### Properties

##### id

```ts
id: number
```

Defined in: [shared/player.d.ts:144](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L144)

##### itemType

```ts
itemType: number
```

Defined in: [shared/player.d.ts:145](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L145)

##### abilities

```ts
abilities: object[]
```

Defined in: [shared/player.d.ts:146](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L146)

###### type

```ts
type: number
```

###### levelRequirement?

```ts
optional levelRequirement?: number
```

###### attributes

```ts
attributes: object
```

###### Index Signature

\[`key`: `string`\]: `object`

###### cooldown

```ts
cooldown: object
```

###### cooldown.time

```ts
time: number
```

###### cooldown.last

```ts
last: number
```

##### nameKey

```ts
nameKey: string
```

Defined in: [shared/player.d.ts:166](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L166)

##### descriptionKey

```ts
descriptionKey: string
```

Defined in: [shared/player.d.ts:167](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L167)

##### categoryKey

```ts
categoryKey: "excavation" | "utility" | "drones"
```

Defined in: [shared/player.d.ts:168](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L168)

##### sprite?

```ts
optional sprite?: AssetRef
```

Defined in: [shared/player.d.ts:169](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L169)

## Type Aliases

### CellCoordinates

```ts
CellCoordinates = [number, number]
```

Defined in: [shared/player.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L14)

Grid cell position as `[cellX, cellY]`.

Cell coordinates match `sandkit.api.*AtCell` helpers: column first, then row.

***

### Vector2

```ts
Vector2 = object
```

Defined in: [shared/player.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L22)

2D vector in world or cell space.

World positions use pixels. Cell helpers may return pixel or cell units
depending on the API.

#### Properties

##### x

```ts
x: number
```

Defined in: [shared/player.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L24)

Horizontal component.

##### y

```ts
y: number
```

Defined in: [shared/player.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L26)

Vertical component.
