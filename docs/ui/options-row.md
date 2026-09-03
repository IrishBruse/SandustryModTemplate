# OptionsRow

Label on the left, control on the right.
Optional description under the label.

**Preview:**

<iframe class="ui-canvas" title="OptionsRow" src="ui/canvas/options/preview.html?embed=OptionsRow"></iframe>

## Props

| Prop          | Type            | Default | Description               |
| ------------- | --------------- | ------- | ------------------------- |
| `label`       | `ReactNode`     | —       | Primary label (required). |
| `description` | `ReactNode`     | —       | Smaller gray helper text. |
| `children`    | `ReactNode`     | —       | Control on the right.     |
| `className`   | `string`        | `""`    | Extra CSS classes.        |
| `style`       | `CSSProperties` | —       | Inline styles.            |

## Usage

```tsx
import { OptionsRow, OptionsNumberInput } from "@modkit/ui";

<OptionsRow label="Hotbars" description="Number of hotbar banks you can switch between.">
  <OptionsNumberInput value={5} min={1} max={10} onChange={setCount} />
</OptionsRow>;
```
