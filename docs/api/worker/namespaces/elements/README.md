# elements

**`Internal`**

Worker-thread `sandkit.api.elements` — shared reads plus direct mutations.

Main thread uses `*WhenIdle` helpers instead of `createAtCell` /
`replaceAtCell` / `removeAtCell`. Built on elements base shapes.

 Worker extension; not interchangeable with main-thread
`sandkit.api.elements`.

## Functions

### createAtCell()

```ts
createAtCell(...args: number, number, number, [ElementCreateOptions]): void
```

Defined in: [worker/api/elements.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/api/elements.d.ts#L53)

Create an element at a cell immediately on this worker.
Main thread: use `createAtCellWhenIdle`.

#### Parameters

##### args

...\[`number`, `number`, `number`, [`ElementCreateOptions`](api/sandkit/api/namespaces/elements/README.md#elementcreateoptions)\]

#### Returns

`void`

## References

### ElementType

Re-exports [ElementType](api/sandkit/api/namespaces/elements/README.md#elementtype)

***

### MatterType

Re-exports [MatterType](api/sandkit/api/namespaces/elements/enumerations/MatterType.md)

***

### ElementDefinition

Re-exports [ElementDefinition](api/sandkit/api/namespaces/elements/README.md#elementdefinition)

***

### ElementCreateOptions

Re-exports [ElementCreateOptions](api/sandkit/api/namespaces/elements/README.md#elementcreateoptions)

***

### getTypeFromId

Re-exports [getTypeFromId](api/sandkit/api/namespaces/elements/README.md#gettypefromid)

***

### getDefinitionByType

Re-exports [getDefinitionByType](api/sandkit/api/namespaces/elements/README.md#getdefinitionbytype)

***

### getTypeAtCell

Re-exports [getTypeAtCell](api/sandkit/api/namespaces/elements/README.md#gettypeatcell)

***

### getResolvedTypeAtCell

Re-exports [getResolvedTypeAtCell](api/sandkit/api/namespaces/elements/README.md#getresolvedtypeatcell)

***

### getResolvedTypeFromCellId

Re-exports [getResolvedTypeFromCellId](api/sandkit/api/namespaces/elements/README.md#getresolvedtypefromcellid)

***

### getInfoAtCell

Re-exports [getInfoAtCell](api/sandkit/api/namespaces/elements/README.md#getinfoatcell)

***

### getMatterTypeAtCell

Re-exports [getMatterTypeAtCell](api/sandkit/api/namespaces/elements/README.md#getmattertypeatcell)

***

### isTypeAtCell

Re-exports [isTypeAtCell](api/sandkit/api/namespaces/elements/README.md#istypeatcell)

***

### isFreeFallingAtCell

Re-exports [isFreeFallingAtCell](api/sandkit/api/namespaces/elements/README.md#isfreefallingatcell)

***

### getVelocityAtCell

Re-exports [getVelocityAtCell](api/sandkit/api/namespaces/elements/README.md#getvelocityatcell)

***

### getDataFieldAtCell

Re-exports [getDataFieldAtCell](api/sandkit/api/namespaces/elements/README.md#getdatafieldatcell)
