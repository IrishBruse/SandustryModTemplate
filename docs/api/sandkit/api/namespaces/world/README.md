# sandkit.api.world

## Namespaces <!-- {docsify-ignore} -->

| Namespace | Description |
| ------ | ------ |
| [pickups](api/sandkit/api/namespaces/world/namespaces/pickups/README.md) | World item spawn, pickup, and lookup. |

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.world.WorldItemLight :id=worlditemlight

Defined in: [sandkit/api/world.d.ts:88](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L88)

Optional point light attached when spawning a pickup.

#### Properties

##### brightness?

```ts
optional brightness?: number
```

Defined in: [sandkit/api/world.d.ts:90](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L90)

Light brightness multiplier. Default 1.

##### size?

```ts
optional size?: number
```

Defined in: [sandkit/api/world.d.ts:92](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L92)

Light radius in world pixels. Default 100.

##### color?

```ts
optional color?: [number, number, number, number] | [number, number, number]
```

Defined in: [sandkit/api/world.d.ts:94](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L94)

RGB or RGBA color components in 0–1 range.

***

### sandkit.api.world.WorldItem :id=worlditem

Defined in: [sandkit/api/world.d.ts:98](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L98)

Active world pickup instance.

#### Properties

##### id

```ts
id: number
```

Defined in: [sandkit/api/world.d.ts:99](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L99)

##### x

```ts
x: number
```

Defined in: [sandkit/api/world.d.ts:100](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L100)

##### y

```ts
y: number
```

Defined in: [sandkit/api/world.d.ts:101](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L101)

##### type

```ts
type: WorldItemType
```

Defined in: [sandkit/api/world.d.ts:102](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L102)

##### data

```ts
data: Record<string, unknown>
```

Defined in: [sandkit/api/world.d.ts:103](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L103)

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.world.WorldItemType :id=worlditemtype

```ts
WorldItemType = WorldItemType
```

Defined in: [sandkit/api/world.d.ts:85](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L85)

World pickup type discriminator.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.world.runWhenSimulationIdle() :id=runwhensimulationidle

```ts
runWhenSimulationIdle(callback: () => void): void
```

Defined in: [sandkit/api/world.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L31)

Run a callback when simulation is idle.

#### Parameters

##### callback

() => `void`

Function invoked on the main thread when workers are idle.

#### Returns

`void`

***

### sandkit.api.world.revealFogAtCell() :id=revealfogatcell

```ts
revealFogAtCell(...args: CellCoordinates): void
```

Defined in: [sandkit/api/world.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L38)

Reveal fog of war at a cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`

***

### sandkit.api.world.redrawAroundCellWhenIdle() :id=redrawaroundcellwhenidle

```ts
redrawAroundCellWhenIdle(...args: [number, number, number]): void
```

Defined in: [sandkit/api/world.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L46)

Request redraw around a cell when simulation is idle.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`void`

## References <!-- {docsify-ignore} -->

### sandkit.api.world.getCellIdAtCell :id=getcellidatcell

Re-exports [getCellIdAtCell](api/worker/namespaces/world/README.md#getcellidatcell)

***

### sandkit.api.world.isCellEmptyAtCell :id=iscellemptyatcell

Re-exports [isCellEmptyAtCell](api/worker/namespaces/world/README.md#iscellemptyatcell)

***

### sandkit.api.world.isTerrainAtCell :id=isterrainatcell

Re-exports [isTerrainAtCell](api/worker/namespaces/world/README.md#isterrainatcell)

***

### sandkit.api.world.reportActivityAtCell :id=reportactivityatcell

Re-exports [reportActivityAtCell](api/worker/namespaces/world/README.md#reportactivityatcell)

***

### sandkit.api.world.excavateAtCell :id=excavateatcell

Re-exports [excavateAtCell](api/worker/namespaces/world/README.md#excavateatcell)

***

### sandkit.api.world.ExcavateOptions :id=excavateoptions

Re-exports [ExcavateOptions](api/worker/namespaces/world/README.md#excavateoptions)
