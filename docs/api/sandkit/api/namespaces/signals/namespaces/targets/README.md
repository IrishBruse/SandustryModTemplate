# sandkit.api.signals.targets

Signal target registration for structure types.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.signals.targets.register() :id=register

```ts
register(structureTypeOrId: unknown, apply: (structure: unknown, payload: unknown) => void): void
```

Defined in: [sandkit/api/signals.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/signals.d.ts#L16)

Register a handler when a signal targets a structure type.

#### Parameters

##### structureTypeOrId

`unknown`

Structure type id or enum value.

##### apply

(`structure`: `unknown`, `payload`: `unknown`) => `void`

Called when a signal reaches a matching structure.

#### Returns

`void`
