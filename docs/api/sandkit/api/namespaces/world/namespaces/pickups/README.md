# pickups

World item spawn, pickup, and lookup.

## Functions

### spawnAtWorld()

```ts
spawnAtWorld(type: WorldItemType, worldX: number, worldY: number, data?: Record<string, unknown>, light?: WorldItemLight): WorldItem
```

Defined in: [sandkit/api/world.d.ts:59](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L59)

Spawn a world pickup at world position.

#### Parameters

##### type

[`WorldItemType`](api/sandkit/enums/enumerations/WorldItemType.md)

Pickup type discriminator.

##### worldX

`number`

World x position in pixels.

##### worldY

`number`

World y position in pixels.

##### data?

`Record`\<`string`, `unknown`\>

Optional per-item data bag copied onto the instance.

##### light?

[`WorldItemLight`](api/sandkit/api/namespaces/world/README.md#worlditemlight)

Optional point light spawned with the pickup.

#### Returns

[`WorldItem`](api/sandkit/api/namespaces/world/README.md#worlditem)

The spawned world item instance.

***

### destroy()

```ts
destroy(worldItem: WorldItem): void
```

Defined in: [sandkit/api/world.d.ts:65](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L65)

Destroy a world pickup instance.

#### Parameters

##### worldItem

[`WorldItem`](api/sandkit/api/namespaces/world/README.md#worlditem)

World item returned from spawn or lookup helpers.

#### Returns

`void`

***

### pickUp()

```ts
pickUp(worldItem: WorldItem): boolean
```

Defined in: [sandkit/api/world.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L72)

Pick up a world item into inventory.

#### Parameters

##### worldItem

[`WorldItem`](api/sandkit/api/namespaces/world/README.md#worlditem)

World item to pick up.

#### Returns

`boolean`

True when the item was collected.

***

### getAll()

```ts
getAll(): WorldItem[]
```

Defined in: [sandkit/api/world.d.ts:75](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L75)

Return all active world pickups.

#### Returns

[`WorldItem`](api/sandkit/api/namespaces/world/README.md#worlditem)[]

***

### getById()

```ts
getById(worldItemId: number): WorldItem | undefined
```

Defined in: [sandkit/api/world.d.ts:81](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/world.d.ts#L81)

Return a world pickup by numeric id.

#### Parameters

##### worldItemId

`number`

Runtime world item id.

#### Returns

[`WorldItem`](api/sandkit/api/namespaces/world/README.md#worlditem) \| `undefined`
