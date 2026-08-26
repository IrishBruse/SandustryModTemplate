# sandkit.api.input

`sandkit.api.input` — key bindings, mouse position, and modifier keys.
Main thread only.

## Interfaces <!-- {docsify-ignore} -->

### sandkit.api.input.InputBindingHandlers :id=inputbindinghandlers

Defined in: [sandkit/api/input.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L72)

Handlers invoked when a binding is pressed or released.

#### Properties

##### down?

```ts
optional down?: () => void
```

Defined in: [sandkit/api/input.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L74)

Called when the binding is pressed.

###### Returns

`void`

##### up?

```ts
optional up?: () => void
```

Defined in: [sandkit/api/input.d.ts:76](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L76)

Called when the binding is released.

###### Returns

`void`

***

### sandkit.api.input.InputBindingDefinition :id=inputbindingdefinition

Defined in: [sandkit/api/input.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L80)

Definition for a registered input binding.

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

##### displayName

```ts
displayName: string
```

Defined in: [sandkit/api/input.d.ts:82](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L82)

Display name shown in settings.

##### displayNameKey?

```ts
optional displayNameKey?: string
```

Defined in: [sandkit/api/input.d.ts:84](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L84)

i18n key for the display name (overrides displayName when set).

##### category

```ts
category: string
```

Defined in: [sandkit/api/input.d.ts:86](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L86)

Settings category for grouping.

##### handlers

```ts
handlers: InputBindingHandlers
```

Defined in: [sandkit/api/input.d.ts:88](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L88)

Press and release handlers.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.input.registerBinding() :id=registerbinding

```ts
registerBinding(bindingId: string, defaultKeys: string[], definition: InputBindingDefinition): string
```

Defined in: [sandkit/api/input.d.ts:13](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L13)

Register a key binding and return its binding id.

#### Parameters

##### bindingId

`string`

Unique id for the binding (also used in settings).

##### defaultKeys

`string`[]

Default key codes (for example `"Control+KeyC"`).

##### definition

[`InputBindingDefinition`](#inputbindingdefinition)

Display metadata and press/release handlers.

#### Returns

`string`

The registered binding id.

***

### sandkit.api.input.getMouseCellPosition() :id=getmousecellposition

```ts
getMouseCellPosition(): object
```

Defined in: [sandkit/api/input.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L19)

Return the mouse position in cell coordinates.

#### Returns

`object`

Cell `{ x, y }` under the cursor.

##### x

```ts
x: number
```

##### y

```ts
y: number
```

***

### sandkit.api.input.getBoundKeys() :id=getboundkeys

```ts
getBoundKeys(bindingId: string): string[]
```

Defined in: [sandkit/api/input.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L28)

Return the keys currently bound to a binding id.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`string`[]

Key strings from settings (for example `"KeyA"` or `"Shift"`).
Session `input.keys` is keyed by `KeyboardEvent.code`. Modifier aliases
(`Shift`, `Alt`, `Control`, `Meta`) expand to `ShiftLeft` / `ShiftRight` and the same for the other modifiers.

***

### sandkit.api.input.getDisplayKey() :id=getdisplaykey

```ts
getDisplayKey(bindingId: string, defaultLabel?: string): string
```

Defined in: [sandkit/api/input.d.ts:36](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L36)

Return a display label for the bound key.

#### Parameters

##### bindingId

`string`

Registered binding id.

##### defaultLabel?

`string`

Fallback label when no key is bound.

#### Returns

`string`

Human-readable key label for UI.

***

### sandkit.api.input.triggerBinding() :id=triggerbinding

```ts
triggerBinding(bindingId: string): void
```

Defined in: [sandkit/api/input.d.ts:42](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L42)

Fire the binding down handler as if the key was pressed.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`void`

***

### sandkit.api.input.pressBinding() :id=pressbinding

```ts
pressBinding(bindingId: string): void
```

Defined in: [sandkit/api/input.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L48)

Fire the binding down handler without a matching release.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`void`

***

### sandkit.api.input.releaseBinding() :id=releasebinding

```ts
releaseBinding(bindingId: string): void
```

Defined in: [sandkit/api/input.d.ts:54](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L54)

Fire the binding up handler.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`void`

***

### sandkit.api.input.resetMouseState() :id=resetmousestate

```ts
resetMouseState(): void
```

Defined in: [sandkit/api/input.d.ts:57](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L57)

Clear internal mouse button state.

#### Returns

`void`

***

### sandkit.api.input.isCtrlHeld() :id=isctrlheld

```ts
isCtrlHeld(): boolean
```

Defined in: [sandkit/api/input.d.ts:63](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L63)

Return true when Ctrl is held.

#### Returns

`boolean`

True when the Ctrl modifier is down.

***

### sandkit.api.input.isAltHeld() :id=isaltheld

```ts
isAltHeld(): boolean
```

Defined in: [sandkit/api/input.d.ts:69](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L69)

Return true when Alt is held.

#### Returns

`boolean`

True when the Alt modifier is down.
