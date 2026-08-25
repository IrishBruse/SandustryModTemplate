# sandkit.api.elements (worker)

**`Internal`**

Worker-thread `sandkit.api.elements` — shared reads plus direct mutations.

Main thread uses `*WhenIdle` helpers instead of `createAtCell` /
`replaceAtCell` / `removeAtCell`. Built on elements base shapes.

 Worker extension; not interchangeable with main-thread
`sandkit.api.elements`.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.elements.createAtCell() (worker) :id=createatcell

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

## References <!-- {docsify-ignore} -->

### sandkit.api.elements.ElementType (worker) :id=elementtype

Re-exports [ElementType](api/sandkit/api/namespaces/elements/README.md#elementtype)

***

### sandkit.api.elements.MatterType (worker) :id=mattertype

Re-exports [MatterType](api/sandkit/api/namespaces/elements/enumerations/MatterType.md)

***

### sandkit.api.elements.ElementDefinition (worker) :id=elementdefinition

Re-exports [ElementDefinition](api/sandkit/api/namespaces/elements/README.md#elementdefinition)

***

### sandkit.api.elements.ElementCreateOptions (worker) :id=elementcreateoptions

Re-exports [ElementCreateOptions](api/sandkit/api/namespaces/elements/README.md#elementcreateoptions)

***

### sandkit.api.elements.getTypeFromId (worker) :id=gettypefromid

Re-exports [getTypeFromId](api/sandkit/api/namespaces/elements/README.md#gettypefromid)

***

### sandkit.api.elements.getDefinitionByType (worker) :id=getdefinitionbytype

Re-exports [getDefinitionByType](api/sandkit/api/namespaces/elements/README.md#getdefinitionbytype)

***

### sandkit.api.elements.getTypeAtCell (worker) :id=gettypeatcell

Re-exports [getTypeAtCell](api/sandkit/api/namespaces/elements/README.md#gettypeatcell)

***

### sandkit.api.elements.getResolvedTypeAtCell (worker) :id=getresolvedtypeatcell

Re-exports [getResolvedTypeAtCell](api/sandkit/api/namespaces/elements/README.md#getresolvedtypeatcell)

***

### sandkit.api.elements.getResolvedTypeFromCellId (worker) :id=getresolvedtypefromcellid

Re-exports [getResolvedTypeFromCellId](api/sandkit/api/namespaces/elements/README.md#getresolvedtypefromcellid)

***

### sandkit.api.elements.getInfoAtCell (worker) :id=getinfoatcell

Re-exports [getInfoAtCell](api/sandkit/api/namespaces/elements/README.md#getinfoatcell)

***

### sandkit.api.elements.getMatterTypeAtCell (worker) :id=getmattertypeatcell

Re-exports [getMatterTypeAtCell](api/sandkit/api/namespaces/elements/README.md#getmattertypeatcell)

***

### sandkit.api.elements.isTypeAtCell (worker) :id=istypeatcell

Re-exports [isTypeAtCell](api/sandkit/api/namespaces/elements/README.md#istypeatcell)

***

### sandkit.api.elements.isFreeFallingAtCell (worker) :id=isfreefallingatcell

Re-exports [isFreeFallingAtCell](api/sandkit/api/namespaces/elements/README.md#isfreefallingatcell)

***

### sandkit.api.elements.getVelocityAtCell (worker) :id=getvelocityatcell

Re-exports [getVelocityAtCell](api/sandkit/api/namespaces/elements/README.md#getvelocityatcell)

***

### sandkit.api.elements.getDataFieldAtCell (worker) :id=getdatafieldatcell

Re-exports [getDataFieldAtCell](api/sandkit/api/namespaces/elements/README.md#getdatafieldatcell)
