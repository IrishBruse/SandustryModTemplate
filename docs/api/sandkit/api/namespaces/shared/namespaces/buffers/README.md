# buffers

Shared buffer create and lookup.

## Functions

### create()

```ts
create(key: string, config: object): SharedArray
```

Defined in: [sandkit/api/shared.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/shared.d.ts#L18)

Create a named shared buffer with type and length.

#### Parameters

##### key

`string`

Buffer name shared across threads.

##### config

Typed array kind and element count.

###### type

[`SharedArrayType`](api/sandkit/api/namespaces/shared/README.md#sharedarraytype)

###### length

`number`

#### Returns

[`SharedArray`](api/sandkit/api/namespaces/shared/README.md#sharedarray)

***

### get()

```ts
get(key: string): SharedArray | undefined
```

Defined in: [shared/api/shared.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/shared.d.ts#L17)

Look up a named shared buffer without creating it.

#### Parameters

##### key

`string`

Buffer name shared across threads.

#### Returns

[`SharedArray`](api/sandkit/api/namespaces/shared/README.md#sharedarray) \| `undefined`

The typed array, or `undefined` when the buffer does not exist.
