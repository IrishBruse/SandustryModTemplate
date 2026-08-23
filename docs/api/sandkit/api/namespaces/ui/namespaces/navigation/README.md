# navigation

Controller focus and scope navigation hooks.

## Functions

### useFocusable()

```ts
useFocusable<T>(options: FocusOptions): Focusable<T>
```

Defined in: [sandkit/api/ui.d.ts:102](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L102)

React hook for a focusable UI element in a scope.

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLDivElement`

#### Parameters

##### options

[`FocusOptions`](api/sandkit/api/namespaces/ui/README.md#focusoptions)

Focus registration and neighbor wiring.

#### Returns

[`Focusable`](api/sandkit/api/namespaces/ui/README.md#focusable)\<`T`\>

Ref, focus state, and a focus helper.

***

### useFocusScope()

```ts
useFocusScope(options: object): void
```

Defined in: [sandkit/api/ui.d.ts:108](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L108)

React hook to register a focus scope with back handling.

#### Parameters

##### options

Scope id, priority, default focus, and back handler.

###### id

`string`

###### active

`boolean`

###### priority?

`number`

###### defaultId?

`string`

###### onBack?

() => `boolean` \| `void`

#### Returns

`void`

***

### controllerFocusClass()

```ts
controllerFocusClass(focused: boolean): string
```

Defined in: [sandkit/api/ui.d.ts:115](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L115)

Return CSS class for controller focus ring state.

#### Parameters

##### focused

`boolean`

True when the element has controller focus.

#### Returns

`string`

Class name string for the focus ring.
