# input

`sandkit.api.input` — key bindings, mouse position, and modifier keys.
Main thread only.

## Interfaces

### InputBindingHandlers

Defined in: [sandkit/api/input.d.ts:70](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L70)

Handlers invoked when a binding is pressed or released.

#### Properties

##### down?

```ts
optional down?: () => void
```

Defined in: [sandkit/api/input.d.ts:72](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L72)

Called when the binding is pressed.

###### Returns

`void`

##### up?

```ts
optional up?: () => void
```

Defined in: [sandkit/api/input.d.ts:74](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L74)

Called when the binding is released.

###### Returns

`void`

***

### InputBindingDefinition

Defined in: [sandkit/api/input.d.ts:78](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L78)

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

Defined in: [sandkit/api/input.d.ts:80](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L80)

Display name shown in settings.

##### displayNameKey?

```ts
optional displayNameKey?: string
```

Defined in: [sandkit/api/input.d.ts:82](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L82)

i18n key for the display name (overrides displayName when set).

##### category

```ts
category: string
```

Defined in: [sandkit/api/input.d.ts:84](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L84)

Settings category for grouping.

##### handlers

```ts
handlers: InputBindingHandlers
```

Defined in: [sandkit/api/input.d.ts:86](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L86)

Press and release handlers.

## Functions

### registerBinding()

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

### getMouseCellPosition()

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

### getBoundKeys()

```ts
getBoundKeys(bindingId: string): string[]
```

Defined in: [sandkit/api/input.d.ts:26](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L26)

Return the keys currently bound to a binding id.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`string`[]

Key code strings for the active binding.

***

### getDisplayKey()

```ts
getDisplayKey(bindingId: string, defaultLabel?: string): string
```

Defined in: [sandkit/api/input.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L34)

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

### triggerBinding()

```ts
triggerBinding(bindingId: string): void
```

Defined in: [sandkit/api/input.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L40)

Fire the binding down handler as if the key was pressed.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`void`

***

### pressBinding()

```ts
pressBinding(bindingId: string): void
```

Defined in: [sandkit/api/input.d.ts:46](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L46)

Fire the binding down handler without a matching release.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`void`

***

### releaseBinding()

```ts
releaseBinding(bindingId: string): void
```

Defined in: [sandkit/api/input.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L52)

Fire the binding up handler.

#### Parameters

##### bindingId

`string`

Registered binding id.

#### Returns

`void`

***

### resetMouseState()

```ts
resetMouseState(): void
```

Defined in: [sandkit/api/input.d.ts:55](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L55)

Clear internal mouse button state.

#### Returns

`void`

***

### isCtrlHeld()

```ts
isCtrlHeld(): boolean
```

Defined in: [sandkit/api/input.d.ts:61](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L61)

Return true when Ctrl is held.

#### Returns

`boolean`

True when the Ctrl modifier is down.

***

### isAltHeld()

```ts
isAltHeld(): boolean
```

Defined in: [sandkit/api/input.d.ts:67](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/api/input.d.ts#L67)

Return true when Alt is held.

#### Returns

`boolean`

True when the Alt modifier is down.
