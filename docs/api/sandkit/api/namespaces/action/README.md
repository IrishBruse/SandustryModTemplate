# action

`sandkit.api.action` — active hotbar action and custom handler data.
Main thread only.

## Type Aliases

### Action

```ts
Action = AssetRef
```

Defined in: [sandkit/api/action.d.ts:9](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/action.d.ts#L9)

Hotbar action asset reference.

## Functions

### getActive()

```ts
getActive(): AssetRef
```

Defined in: [sandkit/api/action.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/action.d.ts#L15)

Return the action slot the player is using.

#### Returns

[`AssetRef`](api/shared/asset/README.md#assetref)

Active hotbar action reference.

***

### getSelected()

```ts
getSelected(): AssetRef
```

Defined in: [sandkit/api/action.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/action.d.ts#L21)

Return the action slot selected in the hotbar.

#### Returns

[`AssetRef`](api/shared/asset/README.md#assetref)

Selected hotbar action reference.

***

### setCustomData()

```ts
setCustomData<Input>(data: Input): void
```

Defined in: [sandkit/api/action.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/action.d.ts#L27)

Store custom data on the active action handler.

#### Type Parameters

##### Input

`Input`

#### Parameters

##### data

`Input`

Serializable payload attached to the active action.

#### Returns

`void`
