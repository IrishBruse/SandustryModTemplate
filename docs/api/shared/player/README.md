# shared.player

## Interfaces <!-- {docsify-ignore} -->

### shared.player.Player :id=player

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

Defined in: [shared/player.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L51)

Spawn flag. Live physics does not update this field.
Use `sandkit.api.player.isOnGround()` (solid cells 1px below the hitbox).

##### speedCapOverdrive

```ts
speedCapOverdrive: object
```

Defined in: [shared/player.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L53)

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

Defined in: [shared/player.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L70)

Items currently held in the player inventory.

##### buildings

```ts
buildings: number[]
```

Defined in: [shared/player.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L72)

Structure type ids the player has unlocked for building.

##### tech

```ts
tech: object
```

Defined in: [shared/player.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L74)

Tech tree nodes and their unlock metadata.

###### Index Signature

\[`key`: `string` \| `number`\]: `object`

##### lockedTechs

```ts
lockedTechs: object
```

Defined in: [shared/player.d.ts:104](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L104)

Tech ids explicitly locked for this save.

###### Index Signature

\[`key`: `string`\]: `boolean`

##### action

```ts
action: null
```

Defined in: [shared/player.d.ts:106](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L106)

Active world action, or null when idle.

##### hotbar

```ts
hotbar: object
```

Defined in: [shared/player.d.ts:108](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L108)

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

Defined in: [shared/player.d.ts:114](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L114)

True when the grappling hook is equipped or active.

##### cooldowns

```ts
cooldowns: object
```

Defined in: [shared/player.d.ts:116](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L116)

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

Defined in: [shared/player.d.ts:130](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L130)

True when hover movement mode is active.

##### weaponsMeta

```ts
weaponsMeta: object
```

Defined in: [shared/player.d.ts:132](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L132)

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

### shared.player.InventoryItem :id=inventoryitem

Defined in: [shared/player.d.ts:146](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L146)

One hotbar or inventory item entry.

#### Properties

##### id

```ts
id: number
```

Defined in: [shared/player.d.ts:147](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L147)

##### itemType

```ts
itemType: number
```

Defined in: [shared/player.d.ts:148](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L148)

##### abilities

```ts
abilities: object[]
```

Defined in: [shared/player.d.ts:149](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L149)

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

Defined in: [shared/player.d.ts:169](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L169)

##### descriptionKey

```ts
descriptionKey: string
```

Defined in: [shared/player.d.ts:170](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L170)

##### categoryKey

```ts
categoryKey: "excavation" | "utility" | "drones"
```

Defined in: [shared/player.d.ts:171](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L171)

##### sprite?

```ts
optional sprite?: AssetRef
```

Defined in: [shared/player.d.ts:172](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L172)

## Type Aliases <!-- {docsify-ignore} -->

### shared.player.CellCoordinates :id=cellcoordinates

```ts
CellCoordinates = [number, number]
```

Defined in: [shared/player.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/player.d.ts#L14)

Grid cell position as `[cellX, cellY]`.

Cell coordinates match `sandkit.api.*AtCell` helpers: column first, then row.

***

### shared.player.Vector2 :id=vector2

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
