# OptionsSliderRow

Slider row with label and value readout (for example UI scale).

**Preview:**

<iframe class="ui-canvas" title="OptionsSliderRow" src="ui/canvas/options/preview.html?embed=OptionsSliderRow"></iframe>

## Props

| Prop          | Type                           | Default            | Description             |
| ------------- | ------------------------------ | ------------------ | ----------------------- |
| `label`       | `ReactNode`                    | —                  | Row label.              |
| `value`       | `number`                       | —                  | Current value.          |
| `min`         | `number`                       | —                  | Range minimum.          |
| `max`         | `number`                       | —                  | Range maximum.          |
| `step`        | `number \| "any"`              | —                  | Step size.              |
| `onChange`    | `(value: number) => void`      | —                  | Value change handler.   |
| `onStart`     | `() => void`                   | —                  | Mouse down on slider.   |
| `onRelease`   | `() => void`                   | —                  | Mouse up on slider.     |
| `formatValue` | `(value: number) => ReactNode` | `(v) => \`${v}%\`` | Readout next to slider. |
| `className`   | `string`                       | `""`               | Extra CSS classes.      |
| `style`       | `CSSProperties`                | —                  | Inline styles.          |

Import `@modkit/ui/options.css` for slider thumb styling.

## Usage

```tsx
import optionsCss from "@modkit/ui/options.css";
import { OptionsSliderRow } from "@modkit/ui";

<OptionsSliderRow label="UI Scale" value={scale} min={50} max={150} onChange={setScale} />;
```
