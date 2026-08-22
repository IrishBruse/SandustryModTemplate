# OptionsSwitch

Pill toggle from the game options panel.

**Preview:**

<iframe class="ui-canvas" title="OptionsSwitch" src="ui/canvas/options/preview.html?embed=OptionsSwitch"></iframe>

## Props

| Prop        | Type                         | Default | Description                             |
| ----------- | ---------------------------- | ------- | --------------------------------------- |
| `checked`   | `boolean`                    | —       | On state.                               |
| `onChange`  | `(checked: boolean) => void` | —       | Called when user toggles.               |
| `subtle`    | `boolean`                    | `false` | Ring style for dense mod config panels. |
| `className` | `string`                     | `""`    | Extra CSS classes.                      |
| `style`     | `CSSProperties`              | —       | Inline styles.                          |

## Usage

```tsx
import { OptionsRow, OptionsSwitch } from "@modkit/ui";

<OptionsRow label="Autosave">
  <OptionsSwitch checked={on} onChange={setOn} />
</OptionsRow>;
```
