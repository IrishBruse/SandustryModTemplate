# sandkit.api.gameConfig

`sandkit.api.gameConfig` — read merged game configuration values.
Main thread only.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.gameConfig.get() :id=get

```ts
get(key: string): JsonValueV1 | undefined
```

Defined in: [sandkit/api/gameconfig.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/gameconfig.d.ts#L12)

Returns a config value by key, or undefined when missing.

#### Parameters

##### key

`string`

Game config key (merged defaults and overrides).

#### Returns

[`JsonValueV1`](api/shared/jsonvalue/README.md#jsonvaluev1) \| `undefined`

***

### sandkit.api.gameConfig.getAll() :id=getall

```ts
getAll(): JsonObjectV1
```

Defined in: [sandkit/api/gameconfig.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/gameconfig.d.ts#L14)

Returns the full config object.

#### Returns

[`JsonObjectV1`](api/shared/jsonvalue/README.md#jsonobjectv1)
