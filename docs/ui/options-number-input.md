# OptionsNumberInput

Compact number field for options rows.

**Preview:**

<iframe class="ui-canvas" title="OptionsNumberInput" src="ui/canvas/options/preview.html?embed=OptionsNumberInput"></iframe>

## Props

| Prop         | Type                      | Default | Description           |
| ------------ | ------------------------- | ------- | --------------------- |
| `value`      | `number`                  | —       | Current value.        |
| `min`        | `number`                  | —       | Minimum.              |
| `max`        | `number`                  | —       | Maximum.              |
| `step`       | `number \| "any"`         | —       | Step size.            |
| `onChange`   | `(value: number) => void` | —       | Valid number changes. |
| `aria-label` | `string`                  | —       | Accessible name.      |
| `className`  | `string`                  | `""`    | Extra CSS classes.    |
| `style`      | `CSSProperties`           | —       | Inline styles.        |

## Usage

```tsx
import { OptionsNumberInput } from "@modkit/ui";

<OptionsNumberInput value={5} min={1} max={10} onChange={setHotbars} aria-label="Hotbars" />;
```
