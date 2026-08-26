# sandkit.api.authorization

`sandkit.api.authorization` — player permission checks for build, grab, and tools.
Main thread only.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.authorization.canBuildAtCell() :id=canbuildatcell

```ts
canBuildAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/authorization.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/authorization.d.ts#L14)

Return true when the player may place a structure at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`boolean`

True when building is allowed in the authorization zone.

***

### sandkit.api.authorization.canGrabAtCell() :id=cangrabatcell

```ts
canGrabAtCell(...args: CellCoordinates): boolean
```

Defined in: [sandkit/api/authorization.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/authorization.d.ts#L22)

Return true when the player may grab at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`boolean`

True when grabbing is allowed in the authorization zone.

***

### sandkit.api.authorization.canUseTool() :id=canusetool

```ts
canUseTool(player: Player, isFlamethrower?: boolean): boolean
```

Defined in: [sandkit/api/authorization.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/authorization.d.ts#L30)

Return true when the player may use a tool.

#### Parameters

##### player

[`Player`](api/shared.player.md#player)

Player state snapshot.

##### isFlamethrower?

`boolean`

When true, apply flamethrower-specific rules.

#### Returns

`boolean`

True when tool use is allowed for the player.

***

### sandkit.api.authorization.canUseToolAtCell() :id=canusetoolatcell

```ts
canUseToolAtCell(...args: [number, number, boolean]): boolean
```

Defined in: [sandkit/api/authorization.d.ts:39](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/authorization.d.ts#L39)

Return true when the player may use a tool at the cell.

#### Parameters

##### args

...\[`number`, `number`, `boolean`\]

#### Returns

`boolean`

True when tool use is allowed at the cell.

***

### sandkit.api.authorization.getZoneIdAtCell() :id=getzoneidatcell

```ts
getZoneIdAtCell(...args: CellCoordinates): number
```

Defined in: [sandkit/api/authorization.d.ts:47](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/authorization.d.ts#L47)

Return the authorization zone id at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`number`

Numeric zone id for the cell.

***

### sandkit.api.authorization.getPlayerZoneId() :id=getplayerzoneid

```ts
getPlayerZoneId(): number
```

Defined in: [sandkit/api/authorization.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/authorization.d.ts#L53)

Return the authorization zone id for the player.

#### Returns

`number`

Numeric zone id for the player's current position.
