# sandkit.api.structures.processing

Per-structure processing enablement and registration.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.structures.processing.register() :id=register

```ts
register(id: string, definition: StructureProcessingDefinitionV1): void
```

Defined in: [sandkit/api/structures.d.ts:187](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L187)

Register a custom processing definition by id.

#### Parameters

##### id

`string`

Unique processing registration id.

##### definition

[`StructureProcessingDefinitionV1`](api/sandkit/api/namespaces/structures/README.md#structureprocessingdefinitionv1)

Structure type, interval, and callback.

#### Returns

`void`

***

### sandkit.api.structures.processing.setEnabledAt() :id=setenabledat

```ts
setEnabledAt(...args: [number, number, boolean]): boolean
```

Defined in: [sandkit/api/structures.d.ts:196](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/structures.d.ts#L196)

Enable or disable processing at a cell.

#### Parameters

##### args

...\[`number`, `number`, `boolean`\]

#### Returns

`boolean`

True when the enabled state changed.

## References <!-- {docsify-ignore} -->

### sandkit.api.structures.processing.isEnabledAt :id=isenabledat

Re-exports [isEnabledAt](api/worker/namespaces/structures/namespaces/processing/README.md#isenabledat)
