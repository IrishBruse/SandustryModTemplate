# world

**`Internal`**

Shared `sandkit.api.world` base — cell and terrain queries plus excavation.

Main thread adds idle scheduling and fog helpers on top of this shape.

 Base namespace reused by main and worker declarations.

## Interfaces

### ExcavateOptions

Defined in: [shared/api/world.d.ts:51](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L51)

Flags that control how [excavateAtCell](#excavateatcell) resolves damage and drops.

#### Properties

##### fromGun?

```ts
optional fromGun?: boolean
```

Defined in: [shared/api/world.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L53)

Treat the dig as gun fire for terrain resistance checks.

##### fromRocketExplosion?

```ts
optional fromRocketExplosion?: boolean
```

Defined in: [shared/api/world.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L55)

Treat the dig as rocket or dynamite explosion damage.

##### fromDrill?

```ts
optional fromDrill?: boolean
```

Defined in: [shared/api/world.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L57)

Treat the dig as drill damage.

##### useLiteralOutVelocity?

```ts
optional useLiteralOutVelocity?: boolean
```

Defined in: [shared/api/world.d.ts:59](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L59)

Use outVelocity literally instead of deriving ejection speed.

##### destroyNonDestructible?

```ts
optional destroyNonDestructible?: boolean
```

Defined in: [shared/api/world.d.ts:61](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L61)

Allow removing terrain marked non-destructible.

##### forceRemoveAll?

```ts
optional forceRemoveAll?: boolean
```

Defined in: [shared/api/world.d.ts:63](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L63)

Force-remove all matched cells regardless of normal rules.

##### drillTierDamage?

```ts
optional drillTierDamage?: number
```

Defined in: [shared/api/world.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L65)

Extra drill-tier damage when [fromDrill](#fromdrill) is true. Clamped to 0–1000.

## Functions

### getCellIdAtCell()

```ts
getCellIdAtCell(...args: CellCoordinates): number
```

Defined in: [shared/api/world.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L17)

Return the packed cell id at grid coordinates.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`number`

Packed cell id for the cell.

***

### isCellEmptyAtCell()

```ts
isCellEmptyAtCell(...args: CellCoordinates): boolean
```

Defined in: [shared/api/world.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L24)

Return true when the cell has no element or terrain content.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### isTerrainAtCell()

```ts
isTerrainAtCell(...args: CellCoordinates): boolean
```

Defined in: [shared/api/world.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L31)

Return true when the cell holds terrain (not an element).

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`boolean`

***

### reportActivityAtCell()

```ts
reportActivityAtCell(...args: CellCoordinates): void
```

Defined in: [shared/api/world.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L38)

Mark the cell active for simulation this tick.

#### Parameters

##### args

...[`CellCoordinates`](api/shared/player/README.md#cellcoordinates)

#### Returns

`void`

***

### excavateAtCell()

```ts
excavateAtCell(...args: number, number, [Vector2, number, ExcavateOptions]): void
```

Defined in: [shared/api/world.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/world.d.ts#L48)

Apply excavation damage and eject velocity at a cell.

#### Parameters

##### args

...\[`number`, `number`, [`Vector2`](api/shared/player/README.md#vector2), `number`, [`ExcavateOptions`](#excavateoptions)\]

#### Returns

`void`
