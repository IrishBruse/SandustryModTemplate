# shared/jsonvalue

## Interfaces

### JsonObjectV1

Defined in: [shared/jsonvalue.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/jsonvalue.d.ts#L15)

JSON object with string keys and [JsonValueV1](#jsonvaluev1) values.

Use for open-ended config bags and serialized mod data.

#### Indexable

```ts
[key: string]: JsonValueV1
```

## Type Aliases

### JsonValueV1

```ts
JsonValueV1 = string | number | boolean | JsonObjectV1 | JsonValueV1[] | null
```

Defined in: [shared/jsonvalue.d.ts:24](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/jsonvalue.d.ts#L24)

JSON value: primitive, object, array, or null.

Does not include `undefined` — omit keys instead.
