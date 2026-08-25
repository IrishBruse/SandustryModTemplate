# sandkit.api.progression

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.progression.ProgressionCompletionRequestV1 :id=progressioncompletionrequestv1

Defined in: [sandkit/api/progression.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/progression.d.ts#L17)

Progression completion request shape.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### id

```ts
id: string
```

Defined in: [sandkit/api/progression.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/progression.d.ts#L19)

Progression step or quest identifier.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.progression.complete() :id=complete

```ts
complete(request: ProgressionCompletionRequestV1): boolean
```

Defined in: [sandkit/api/progression.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/progression.d.ts#L14)

Mark a progression step complete. Return true when completion succeeds.

#### Parameters

##### request

[`ProgressionCompletionRequestV1`](#progressioncompletionrequestv1)

Progression id and optional metadata for the step.

#### Returns

`boolean`
