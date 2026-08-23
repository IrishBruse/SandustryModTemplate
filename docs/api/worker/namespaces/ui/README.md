# ui

**`Internal`**

Shared `sandkit.api.ui` base — lightweight UI helpers available on workers.

Main thread adds richer UI APIs on top of this shape.

 Base namespace reused by main and worker declarations.

## Interfaces

### I18nTextKey

Defined in: [shared/api/ui.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L23)

Translation key with optional parameter substitution.

#### Properties

##### key

```ts
key: string
```

Defined in: [shared/api/ui.d.ts:25](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L25)

Namespaced translation key (for example `ui|save|save`).

##### params?

```ts
optional params?: Record<string, string | number>
```

Defined in: [shared/api/ui.d.ts:27](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L27)

Values merged into the translated string.

***

### I18nTranslatable

Defined in: [shared/api/ui.d.ts:31](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L31)

Value returned by `sandkit.api.i18n.translatable`.

#### Properties

##### \_\_translatable

```ts
\_\_translatable: true
```

Defined in: [shared/api/ui.d.ts:32](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L32)

##### key

```ts
key: string
```

Defined in: [shared/api/ui.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L33)

##### fallback

```ts
fallback: string
```

Defined in: [shared/api/ui.d.ts:34](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L34)

***

### ToastOptions

Defined in: [shared/api/ui.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L38)

Cooldown, style, and auto-dismiss options for [toast](#toast).

#### Properties

##### cooldown?

```ts
optional cooldown?: number
```

Defined in: [shared/api/ui.d.ts:40](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L40)

Minimum ms before the same toast can show again.

##### cooldownKey?

```ts
optional cooldownKey?: string
```

Defined in: [shared/api/ui.d.ts:45](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L45)

Dedupe key paired with [ToastOptions.cooldown](#cooldown).
Defaults to the message string or `message.key`.

##### duration?

```ts
optional duration?: number | false
```

Defined in: [shared/api/ui.d.ts:50](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L50)

Auto-dismiss delay in ms. Default `5000`.
Set `false` to keep the toast until another toast replaces it.

##### variant?

```ts
optional variant?: "danger" | "hint" | "hole" | string & object
```

Defined in: [shared/api/ui.d.ts:52](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L52)

Visual style applied to the toast body.

## Type Aliases

### LocalizedText

```ts
LocalizedText = string | I18nTextKey | I18nTranslatable
```

Defined in: [shared/api/ui.d.ts:17](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L17)

Plain text, translation key object, or i18n translatable value.

## Functions

### toast()

```ts
toast(message: LocalizedText, options?: ToastOptions): void
```

Defined in: [shared/api/ui.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/shared/api/ui.d.ts#L14)

Show a short on-screen toast message.

#### Parameters

##### message

[`LocalizedText`](#localizedtext)

Plain text, translation key, or translatable value.

##### options?

[`ToastOptions`](#toastoptions)

Cooldown, style, and auto-dismiss options.

#### Returns

`void`
