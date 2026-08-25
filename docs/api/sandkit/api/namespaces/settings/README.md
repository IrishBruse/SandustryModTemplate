# sandkit.api.settings

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.settings.ConfigValueV1 :id=configvaluev1

```ts
ConfigValueV1 = string | number | boolean | null
```

Defined in: [sandkit/api/settings.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/settings.d.ts#L23)

Settings field value shape.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.settings.get() :id=get

```ts
get(fieldId: string): ConfigValueV1 | undefined
```

Defined in: [sandkit/api/settings.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/settings.d.ts#L13)

Return a settings field value by id.

#### Parameters

##### fieldId

`string`

Settings field identifier.

#### Returns

[`ConfigValueV1`](#configvaluev1) \| `undefined`

***

### sandkit.api.settings.getAll() :id=getall

```ts
getAll(): Readonly<Record<string, ConfigValueV1>>
```

Defined in: [sandkit/api/settings.d.ts:15](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/settings.d.ts#L15)

Return all settings as a read-only map.

#### Returns

`Readonly`\<`Record`\<`string`, [`ConfigValueV1`](#configvaluev1)\>\>

***

### sandkit.api.settings.onChange() :id=onchange

```ts
onChange(callback: (values: Readonly<Record<string, ConfigValueV1>>) => void): () => void
```

Defined in: [sandkit/api/settings.d.ts:20](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/settings.d.ts#L20)

Subscribe to settings changes. Return an unsubscribe function.

#### Parameters

##### callback

(`values`: `Readonly`\<`Record`\<`string`, [`ConfigValueV1`](#configvaluev1)\>\>) => `void`

Called with the full settings map after a change.

#### Returns

() => `void`
