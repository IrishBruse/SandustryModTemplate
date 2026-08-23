# prefabData

**`Internal`**

`sandkit.engine.api.prefabData` — prefab artifact and metadata lookup.

**Internal API.** Prefer [sandkit.api](api/sandkit/README.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Functions

### getAll()

```ts
getAll(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prefabData.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prefabData.d.ts#L15)

Return all prefab data entries.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### getAllMetadata()

```ts
getAllMetadata(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prefabData.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prefabData.d.ts#L20)

Return metadata for all prefabs.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### getArtifactLocations()

```ts
getArtifactLocations(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prefabData.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prefabData.d.ts#L25)

Return artifact locations for prefabs.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### getAtCell()

```ts
getAtCell(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prefabData.d.ts:30](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prefabData.d.ts#L30)

Return prefab data at one grid cell.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### getMetadata()

```ts
getMetadata(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/prefabData.d.ts:35](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/prefabData.d.ts#L35)

Return metadata for one prefab.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
