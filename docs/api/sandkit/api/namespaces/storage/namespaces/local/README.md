# local

Local session storage without mod id scope.

## Functions

### get()

```ts
get(key: string): JsonValueV1 | undefined
```

Defined in: [sandkit/api/storage.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L42)

Read a local storage value by key.

#### Parameters

##### key

`string`

Storage key.

#### Returns

[`JsonValueV1`](api/shared/jsonvalue/README.md#jsonvaluev1) \| `undefined`

***

### set()

```ts
set(key: string, value: JsonValueV1): void
```

Defined in: [sandkit/api/storage.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L48)

Write a local storage value by key.

#### Parameters

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
remove(key: string): void
```

Defined in: [sandkit/api/storage.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/storage.d.ts#L53)

Remove a local storage key.

#### Parameters

##### key

`string`

Storage key.

#### Returns

`void`
