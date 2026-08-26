# sandkit.api.ui

## Namespaces <!-- {docsify-ignore} -->

- [overlays](api/sandkit.api.ui.overlays.md)
- [navigation](api/sandkit.api.ui.navigation.md)

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.ui.TooltipMessageData :id=tooltipmessagedata

Defined in: [sandkit/api/ui.d.ts:128](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L128)

Message tooltip with localized body text.

#### Properties

##### type

```ts
type: "message"
```

Defined in: [sandkit/api/ui.d.ts:130](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L130)

Discriminator for tooltip renderer selection.

##### text

```ts
text: LocalizedText
```

Defined in: [sandkit/api/ui.d.ts:132](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L132)

Message body as localized text.

***

### sandkit.api.ui.Focusable :id=focusable

Defined in: [sandkit/api/ui.d.ts:136](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L136)

Focusable element state from useFocusable.

#### Type Parameters

##### T

`T` *extends* `HTMLElement` = `HTMLDivElement`

#### Properties

##### ref

```ts
readonly ref: RefObject<T>
```

Defined in: [sandkit/api/ui.d.ts:138](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L138)

Ref to attach to the focusable element.

##### focused

```ts
readonly focused: boolean
```

Defined in: [sandkit/api/ui.d.ts:140](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L140)

True when the element has controller focus.

##### focus

```ts
readonly focus: () => void
```

Defined in: [sandkit/api/ui.d.ts:142](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L142)

Move controller focus to this element.

###### Returns

`void`

***

### sandkit.api.ui.FocusOptions :id=focusoptions

Defined in: [sandkit/api/ui.d.ts:146](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L146)

Options for useFocusable registration.

#### Properties

##### id

```ts
readonly id: string
```

Defined in: [sandkit/api/ui.d.ts:148](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L148)

Unique id within the focus scope.

##### scope

```ts
readonly scope: string
```

Defined in: [sandkit/api/ui.d.ts:150](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L150)

Focus scope id this element belongs to.

##### onActivate

```ts
readonly onActivate: (element?: HTMLElement) => void
```

Defined in: [sandkit/api/ui.d.ts:152](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L152)

Called when the element is activated (A button / Enter).

###### Parameters

###### element?

`HTMLElement`

###### Returns

`void`

##### onFocus?

```ts
readonly optional onFocus?: () => void
```

Defined in: [sandkit/api/ui.d.ts:154](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L154)

Called when the element receives focus.

###### Returns

`void`

##### disabled?

```ts
readonly optional disabled?: boolean
```

Defined in: [sandkit/api/ui.d.ts:156](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L156)

When true, skip this element during navigation.

##### x?

```ts
readonly optional x?: number
```

Defined in: [sandkit/api/ui.d.ts:158](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L158)

Optional grid column for spatial navigation.

##### y?

```ts
readonly optional y?: number
```

Defined in: [sandkit/api/ui.d.ts:160](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L160)

Optional grid row for spatial navigation.

##### neighbors?

```ts
readonly optional neighbors?: Partial<Record<"left" | "right" | "up" | "down", string>>
```

Defined in: [sandkit/api/ui.d.ts:162](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L162)

Neighbor ids for directional navigation.

##### scrollIntoView?

```ts
readonly optional scrollIntoView?: boolean
```

Defined in: [sandkit/api/ui.d.ts:164](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L164)

When true, scroll the element into view on focus.

## Type Aliases <!-- {docsify-ignore} -->

### sandkit.api.ui.ComponentId :id=componentid

```ts
ComponentId = ComponentId | string
```

Defined in: [sandkit/api/ui.d.ts:119](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L119)

Registered UI component id (built-in enum value or custom string).

***

### sandkit.api.ui.ComponentUpdateOptions :id=componentupdateoptions

```ts
ComponentUpdateOptions = Record<string, unknown>
```

Defined in: [sandkit/api/ui.d.ts:122](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L122)

Component-specific update payload passed to [update](#update).

***

### sandkit.api.ui.TooltipData :id=tooltipdata

```ts
TooltipData = TooltipMessageData
```

Defined in: [sandkit/api/ui.d.ts:125](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L125)

Tooltip payload shown near the cursor or UI target.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.ui.update() :id=update

```ts
update(componentId: ComponentId, options?: ComponentUpdateOptions): void
```

Defined in: [sandkit/api/ui.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L25)

Update a registered UI component by id.

#### Parameters

##### componentId

[`ComponentId`](#componentid)

Built-in [ComponentIdEnum](api/sandkit.enums.ComponentId.md) value or custom string id.

##### options?

[`ComponentUpdateOptions`](#componentupdateoptions)

Component-specific update payload.

#### Returns

`void`

***

### sandkit.api.ui.openPauseMenu() :id=openpausemenu

```ts
openPauseMenu(): void
```

Defined in: [sandkit/api/ui.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L28)

Open the pause menu.

#### Returns

`void`

***

### sandkit.api.ui.showTooltip() :id=showtooltip

```ts
showTooltip(data: TooltipMessageData): void
```

Defined in: [sandkit/api/ui.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L34)

Show a tooltip with the given data.

#### Parameters

##### data

[`TooltipMessageData`](#tooltipmessagedata)

Tooltip type and localized content.

#### Returns

`void`

***

### sandkit.api.ui.alert() :id=alert

```ts
alert(message: LocalizedText, title?: LocalizedText): Promise<void>
```

Defined in: [sandkit/api/ui.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L42)

Show an alert dialog.

#### Parameters

##### message

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Dialog body text.

##### title?

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Optional dialog title.

#### Returns

`Promise`\<`void`\>

Promise that resolves when the user dismisses the dialog.

***

### sandkit.api.ui.confirm() :id=confirm

```ts
confirm(message: LocalizedText, title?: LocalizedText): Promise<boolean>
```

Defined in: [sandkit/api/ui.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L50)

Show a confirm dialog.

#### Parameters

##### message

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Dialog body text.

##### title?

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Optional dialog title.

#### Returns

`Promise`\<`boolean`\>

Promise that resolves with true when confirmed, or false when cancelled.

***

### sandkit.api.ui.prompt() :id=prompt

```ts
prompt(message: LocalizedText, defaultValue?: string, placeholder?: LocalizedText, title?: LocalizedText, allowCopy?: boolean): Promise<string | null>
```

Defined in: [sandkit/api/ui.d.ts:61](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L61)

Show a prompt dialog.

#### Parameters

##### message

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Dialog body text.

##### defaultValue?

`string`

Initial input value.

##### placeholder?

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Placeholder text in the input field.

##### title?

[`LocalizedText`](api/sandkit.api.ui.worker.md#localizedtext)

Optional dialog title.

##### allowCopy?

`boolean`

When true, allow copying the result from the dialog.

#### Returns

`Promise`\<`string` \| `null`\>

Promise that resolves with entered text, or null when cancelled.

***

### sandkit.api.ui.inject() :id=inject

```ts
inject(componentId: ComponentId, component: ComponentType<Record<string, never>>): () => void
```

Defined in: [sandkit/api/ui.d.ts:69](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/ui.d.ts#L69)

Mount a React component by id.

#### Parameters

##### componentId

[`ComponentId`](#componentid)

Overlay slot or custom mount point id.

##### component

`ComponentType`\<`Record`\<`string`, `never`\>\>

React component to render.

#### Returns

Function that unmounts the injected component.

() => `void`

## References <!-- {docsify-ignore} -->

### sandkit.api.ui.toast :id=toast

Re-exports [toast](api/sandkit.api.ui.worker.md#toast)

***

### sandkit.api.ui.LocalizedText :id=localizedtext

Re-exports [LocalizedText](api/sandkit.api.ui.worker.md#localizedtext)

***

### sandkit.api.ui.ToastOptions :id=toastoptions

Re-exports [ToastOptions](api/sandkit.api.ui.worker.md#toastoptions)
