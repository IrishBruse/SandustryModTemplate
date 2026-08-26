# sandkit.engine.api.colorPicker

**`Internal`**

`sandkit.engine.api.colorPicker` — structure color palette UI helpers.

**Internal API.** Prefer [sandkit.api](api/sandkit.md#api-1) when a public method exists.
Methods use loose stubs; signatures may take game state as the first argument.
Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.

## Variables <!-- {docsify-ignore} -->

### CYCLE\_COLOR

```ts
const CYCLE\_COLOR: unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:12](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L12)

Sentinel value for cycling through predefined colors.

***

### NO\_COLOR

```ts
const NO\_COLOR: unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L14)

Sentinel value for no color selected.

***

### PREDEFINED\_COLORS

```ts
const PREDEFINED\_COLORS: unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:16](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L16)

List of predefined palette colors.

***

### RANDOM\_COLOR

```ts
const RANDOM\_COLOR: unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:18](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L18)

Sentinel value for a random palette color.

## Functions <!-- {docsify-ignore} -->

### sandkit.engine.api.colorPicker.closePalette() :id=closepalette

```ts
closePalette(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:23](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L23)

Close the active color palette UI.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.getActivePalette() :id=getactivepalette

```ts
getActivePalette(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:28](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L28)

Return the active palette identifier.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.getCycleColor() :id=getcyclecolor

```ts
getCycleColor(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:33](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L33)

Return the next color in the cycle.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.getRandomColor() :id=getrandomcolor

```ts
getRandomColor(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:38](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L38)

Return a random predefined color.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.hexToRgba() :id=hextorgba

```ts
hexToRgba(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:43](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L43)

Convert a hex color string to RGBA components.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.renderColorButton() :id=rendercolorbutton

```ts
renderColorButton(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:48](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L48)

Render a color-picker button in the UI.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.renderColorSection() :id=rendercolorsection

```ts
renderColorSection(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:53](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L53)

Render a color section in the UI.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.renderPalette() :id=renderpalette

```ts
renderPalette(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:58](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L58)

Render the full color palette UI.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.rgbaToHex() :id=rgbatohex

```ts
rgbaToHex(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:63](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L63)

Convert RGBA components to a hex color string.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.setActivePalette() :id=setactivepalette

```ts
setActivePalette(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:68](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L68)

Set the active palette identifier.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`

***

### sandkit.engine.api.colorPicker.togglePalette() :id=togglepalette

```ts
togglePalette(...args: unknown[]): unknown
```

Defined in: [sandkit/engine/api/colorPicker.d.ts:73](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/sandkit/engine/api/colorPicker.d.ts#L73)

Open or close the color palette UI.

#### Parameters

##### args

...`unknown`[]

Game state first, then method-specific arguments.

#### Returns

`unknown`
