# overlays

Overlay slot registration and updates.

## Functions

### register()

```ts
register(slot: string, overlayId: string, render: () => ReactNode): void
```

Defined in: [sandkit/api/ui.d.ts:79](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L79)

Register a render function in an overlay slot.

#### Parameters

##### slot

`string`

Slot name (for example `"hotbar"`).

##### overlayId

`string`

Unique id for this overlay within the slot.

##### render

() => `ReactNode`

Function that returns React content.

#### Returns

`void`

***

### unregister()

```ts
unregister(slot: string, overlayId: string): void
```

Defined in: [sandkit/api/ui.d.ts:86](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L86)

Remove an overlay from a slot.

#### Parameters

##### slot

`string`

Slot name the overlay was registered in.

##### overlayId

`string`

Overlay id passed to [register](#register).

#### Returns

`void`

***

### update()

```ts
update(slot: string): void
```

Defined in: [sandkit/api/ui.d.ts:92](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L92)

Request a re-render for all overlays in a slot.

#### Parameters

##### slot

`string`

Slot name to refresh.

#### Returns

`void`
