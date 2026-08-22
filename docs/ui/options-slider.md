# OptionsSlider

Range input with Sandustry `options-slider` chrome.

**Preview:**

<iframe class="ui-canvas" title="OptionsSlider" src="ui/canvas/options/preview.html?embed=OptionsSlider"></iframe>

## Props

| Prop         | Type                      | Default | Description           |
| ------------ | ------------------------- | ------- | --------------------- |
| `value`      | `number`                  | —       | Current value.        |
| `min`        | `number`                  | —       | Range minimum.        |
| `max`        | `number`                  | —       | Range maximum.        |
| `step`       | `number \| "any"`         | —       | Step size.            |
| `onChange`   | `(value: number) => void` | —       | Value change handler. |
| `onStart`    | `() => void`              | —       | Mouse down on slider. |
| `onRelease`  | `() => void`              | —       | Mouse up on slider.   |
| `aria-label` | `string`                  | —       | Accessible name.      |
| `className`  | `string`                  | `""`    | Extra CSS classes.    |
| `style`      | `CSSProperties`           | —       | Inline styles.        |

Import `@modkit/ui/options.css` for thumb and track styling.

## Usage

```tsx
import optionsCss from "@modkit/ui/options.css";
import { OptionsSlider } from "@modkit/ui";

<OptionsSlider value={75} min={50} max={150} onChange={setValue} />;
```
