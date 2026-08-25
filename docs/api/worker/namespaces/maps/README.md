# sandkit.api.maps (worker)

**`Internal`**

Shared `sandkit.api.maps` base — active custom map metadata.

 Base namespace reused by main and worker declarations.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.maps.ActiveMapV1 (worker) :id=activemapv1

Defined in: [shared/api/maps.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L18)

Active custom map record (version 1 schema).

Shape varies by map. Known fields are optional; additional keys may exist.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id?

```ts
optional id?: string
```

Defined in: [shared/api/maps.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L19)

##### deployment?

```ts
optional deployment?: unknown
```

Defined in: [shared/api/maps.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L20)

##### spawn?

```ts
optional spawn?: unknown
```

Defined in: [shared/api/maps.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L21)

##### topBounds?

```ts
optional topBounds?: object
```

Defined in: [shared/api/maps.d.ts:22](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L22)

###### soft?

```ts
optional soft?: number
```

###### hard?

```ts
optional hard?: number
```

##### parallax?

```ts
optional parallax?: unknown
```

Defined in: [shared/api/maps.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L26)

##### depthLight?

```ts
optional depthLight?: unknown
```

Defined in: [shared/api/maps.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L27)

## Functions <!-- {docsify-ignore} -->

### sandkit.api.maps.getActive() (worker) :id=getactive

```ts
getActive(): Readonly<ActiveMapV1> | null
```

Defined in: [shared/api/maps.d.ts:11](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/maps.d.ts#L11)

Return the currently loaded custom map definition.

#### Returns

`Readonly`\<[`ActiveMapV1`](#activemapv1)\> \| `null`

Active map metadata, or `null` outside custom maps.
