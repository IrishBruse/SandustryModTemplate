# discoveries

`sandkit.api.discoveries` — unlock element and terrain entries in the discovery log.
Main thread only.

## Functions

### addElementByType()

```ts
addElementByType(elementType: number): void
```

Defined in: [sandkit/api/discoveries.d.ts:10](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/discoveries.d.ts#L10)

Marks an element type as discovered for the player.

#### Parameters

##### elementType

`number`

Numeric element type id.

#### Returns

`void`

***

### addTerrainByType()

```ts
addTerrainByType(terrainType: number): void
```

Defined in: [sandkit/api/discoveries.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/discoveries.d.ts#L15)

Marks a terrain type as discovered for the player.

#### Parameters

##### terrainType

`number`

Numeric terrain type id.

#### Returns

`void`
