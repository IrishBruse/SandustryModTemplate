# storage

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [local](api/sandkit/api/namespaces/storage/namespaces/local/README.md) | Local session storage without mod id scope. |

## Functions

### ensure()

```ts
ensure(modId: string): JsonObjectV1
```

Defined in: [sandkit/api/storage.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L15)

Ensure storage exists for a mod id.

#### Parameters

##### modId

`string`

Mod identifier (typically `modinfo.id`).

#### Returns

[`JsonObjectV1`](api/shared/jsonvalue/README.md#jsonobjectv1)

***

### get()

```ts
get(modId: string, key: string): JsonValueV1 | undefined
```

Defined in: [sandkit/api/storage.d.ts:21](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L21)

Read a value from mod storage by key.

#### Parameters

##### modId

`string`

Mod identifier.

##### key

`string`

Storage key.

#### Returns

[`JsonValueV1`](api/shared/jsonvalue/README.md#jsonvaluev1) \| `undefined`

***

### set()

```ts
set(modId: string, key: string, value: JsonValueV1): void
```

Defined in: [sandkit/api/storage.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L28)

Write a value to mod storage by key.

#### Parameters

##### modId

`string`

Mod identifier.

##### key

`string`

Storage key.

##### value

[`JsonValueV1`](api/shared/jsonvalue/README.md#jsonvaluev1)

JSON-serializable value.

#### Returns

`void`

***

### remove()

```ts
remove(modId: string, key: string): void
```

Defined in: [sandkit/api/storage.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L34)

Remove a key from mod storage.

#### Parameters

##### modId

`string`

Mod identifier.

##### key

`string`

Storage key.

#### Returns

`void`
