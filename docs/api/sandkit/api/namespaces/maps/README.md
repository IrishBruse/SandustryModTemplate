# sandkit.api.maps

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.maps.AvailableMapV1 :id=availablemapv1

Defined in: [sandkit/api/maps.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/maps.d.ts#L26)

Available map entry shape.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/api/maps.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/maps.d.ts#L28)

Map identifier passed to [start](#start).

##### name?

```ts
optional name?: string
```

Defined in: [sandkit/api/maps.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/maps.d.ts#L30)

Display name or translation key.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.maps.getAvailable() :id=getavailable

```ts
getAvailable(): readonly Readonly<AvailableMapV1>[]
```

Defined in: [sandkit/api/maps.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/maps.d.ts#L18)

Return maps the player can start.

#### Returns

readonly `Readonly`\<[`AvailableMapV1`](#availablemapv1)\>[]

***

### sandkit.api.maps.start() :id=start

```ts
start(mapId: string): boolean
```

Defined in: [sandkit/api/maps.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/maps.d.ts#L23)

Start a map by id. Return true when start succeeds.

#### Parameters

##### mapId

`string`

Custom map identifier.

#### Returns

`boolean`

## References <!-- {docsify-ignore} -->

### sandkit.api.maps.getActive :id=getactive

Re-exports [getActive](api/worker/namespaces/maps/README.md#getactive)

***

### sandkit.api.maps.ActiveMapV1 :id=activemapv1

Re-exports [ActiveMapV1](api/worker/namespaces/maps/README.md#activemapv1)
