# sandkit.api.shared

## Namespaces <!-- {docsify-ignore} -->

| Namespace | Description |
| ------ | ------ |
| [buffers](api/sandkit/api/namespaces/shared/namespaces/buffers/README.md) | Shared buffer create and lookup. |

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.shared.SharedArray :id=sharedarray

```ts
SharedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array
```

Defined in: [shared/api/shared.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/shared.d.ts#L26)

Typed array backing a shared buffer.

Use [SharedArrayType](#sharedarraytype) when creating or requiring a buffer. The runtime
returns the matching `*Array` constructor for the configured type.

***

### sandkit.api.shared.SharedArrayType :id=sharedarraytype

```ts
SharedArrayType = "uint8" | "uint16" | "uint32" | "int8" | "int16" | "int32" | "float32" | "float64"
```

Defined in: [shared/api/shared.d.ts:37](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/shared.d.ts#L37)

Discriminator for the underlying typed array kind.
