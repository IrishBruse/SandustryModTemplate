# mods

## Type Aliases

### AssetProviderV1

```ts
AssetProviderV1 = AssetProviderV1
```

Defined in: [sandkit/api/mods.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/mods.d.ts#L17)

Asset provider entry shape.

## Functions

### getProviders()

```ts
getProviders(kind: string): readonly AssetProviderV1[]
```

Defined in: [sandkit/api/mods.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/mods.d.ts#L15)

Return asset providers registered for a kind string.

#### Parameters

##### kind

`string`

Asset kind identifier (e.g. texture pack category).

#### Returns

readonly [`AssetProviderV1`](api/sandkit/api/namespaces/assets/README.md#assetproviderv1)[]
