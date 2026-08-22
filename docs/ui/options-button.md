# OptionsButton

Secondary action button in the options panel (for example Hide UI).

**Preview:**

<iframe class="ui-canvas" title="OptionsButton" src="ui/canvas/options/preview.html?embed=OptionsButton"></iframe>

## Props

| Prop        | Type            | Default | Description          |
| ----------- | --------------- | ------- | -------------------- |
| `children`  | `ReactNode`     | —       | Button label.        |
| `disabled`  | `boolean`       | `false` | Disables the button. |
| `onClick`   | `() => void`    | —       | Click handler.       |
| `className` | `string`        | `""`    | Extra CSS classes.   |
| `style`     | `CSSProperties` | —       | Inline styles.       |

## Usage

```tsx
import { OptionsButton, OptionsRow } from "@modkit/ui";

<OptionsRow label="Hide UI" description="Press F4 to toggle.">
  <OptionsButton onClick={hideUi}>Hide UI</OptionsButton>
</OptionsRow>;
```
