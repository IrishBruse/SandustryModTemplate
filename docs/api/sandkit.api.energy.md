# sandkit.api.energy

`sandkit.api.energy` — structure energy networks, storage, and consumption.
Main thread only.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.energy.EnergyRegisterTypeOptions :id=energyregistertypeoptions

Defined in: [sandkit/api/energy.d.ts:56](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L56)

Options for [registerType](#registertype).

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### capacity?

```ts
optional capacity?: number
```

Defined in: [sandkit/api/energy.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L58)

Maximum stored energy for storage nodes.

##### energyType?

```ts
optional energyType?: string
```

Defined in: [sandkit/api/energy.d.ts:60](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L60)

Energy type id when multiple networks exist.

***

### sandkit.api.energy.EnergyAddOptions :id=energyaddoptions

Defined in: [sandkit/api/energy.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L65)

Options for [addAtCell](#addatcell).

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### energyType?

```ts
optional energyType?: string
```

Defined in: [sandkit/api/energy.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L67)

Energy type id when multiple networks exist.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.energy.registerType() :id=registertype

```ts
registerType(structureId: string, type: "conductor" | "storage", options?: EnergyRegisterTypeOptions): void
```

Defined in: [sandkit/api/energy.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L14)

Registers an energy type on a structure as conductor or storage.

#### Parameters

##### structureId

`string`

Structure type id string.

##### type

`"conductor"` \| `"storage"`

`conductor` forwards energy; `storage` holds energy.

##### options?

[`EnergyRegisterTypeOptions`](#energyregistertypeoptions)

Capacity and energy-type options for storage nodes.

#### Returns

`void`

***

### sandkit.api.energy.addAtCell() :id=addatcell

```ts
addAtCell(...args: number, number, number, [EnergyAddOptions]): number
```

Defined in: [sandkit/api/energy.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L22)

Adds energy at a cell. Returns the amount actually added.

#### Parameters

##### args

...\[`number`, `number`, `number`, [`EnergyAddOptions`](#energyaddoptions)\]

#### Returns

`number`

***

### sandkit.api.energy.consume() :id=consume

```ts
consume(amount: number, options?: object): number
```

Defined in: [sandkit/api/energy.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L28)

Consumes energy from the global pool. Returns the amount consumed.

#### Parameters

##### amount

`number`

Energy amount to consume.

##### options?

When `allOrNothing` is true, consume zero unless the full amount is available.

###### allOrNothing?

`boolean`

#### Returns

`number`

***

### sandkit.api.energy.consumeExcludingNetworkAtCell() :id=consumeexcludingnetworkatcell

```ts
consumeExcludingNetworkAtCell(...args: [number, number, number]): number
```

Defined in: [sandkit/api/energy.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L37)

Consumes energy from networks other than the one at the cell.

#### Parameters

##### args

...\[`number`, `number`, `number`\]

#### Returns

`number`

***

### sandkit.api.energy.getNetworkAtCell() :id=getnetworkatcell

```ts
getNetworkAtCell(...args: CellCoordinates): object[]
```

Defined in: [sandkit/api/energy.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L43)

Returns energy network nodes connected at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`object`[]

***

### sandkit.api.energy.getNetworkFreeCapacityAtCell() :id=getnetworkfreecapacityatcell

```ts
getNetworkFreeCapacityAtCell(...args: CellCoordinates): number
```

Defined in: [sandkit/api/energy.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/energy.d.ts#L53)

Returns free storage capacity in the network at the cell.

#### Parameters

##### args

...[`CellCoordinates`](api/shared.player.md#cellcoordinates)

#### Returns

`number`
