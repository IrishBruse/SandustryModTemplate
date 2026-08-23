# buffers

Named shared memory buffers for worker threads.

## Functions

### require()

```ts
require(key: string, config: object): SharedArray
```

Defined in: [worker/api/shared.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/api/shared.d.ts#L26)

Attach to a named shared buffer on this worker.

The buffer must already exist on the main thread with the same
[SharedArrayType](api/sandkit/api/namespaces/shared/README.md#sharedarraytype) and length as `config`.

#### Parameters

##### key

`string`

Buffer name shared across threads.

##### config

Expected array type and length for validation.

###### type

[`SharedArrayType`](api/sandkit/api/namespaces/shared/README.md#sharedarraytype)

###### length

`number`

#### Returns

[`SharedArray`](api/sandkit/api/namespaces/shared/README.md#sharedarray)

## References

### get

Re-exports [get](api/sandkit/api/namespaces/shared/namespaces/buffers/README.md#get)
