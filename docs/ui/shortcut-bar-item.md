# ShortcutBarItem

A horizontal shortcut entry inside `ShortcutBar`.

**Preview:**

<iframe class="ui-canvas" title="ShortcutBarItem" src="ui/canvas/shortcuts/preview.html?embed=ShortcutBarItem"></iframe>

## Props

| Prop        | Type         | Default | Description                                                                        |
| ----------- | ------------ | ------- | ---------------------------------------------------------------------------------- |
| `hotkeys`   | `ReactNode`  | —       | Hotkey display on the left (required). Use `CompoundHotkeys` for multi-key combos. |
| `label`     | `string`     | —       | Shortcut label (required).                                                         |
| `active`    | `boolean`    | `false` | When true, applies active color and pulse dot.                                     |
| `className` | `string`     | `""`    | Extra CSS classes.                                                                 |
| `onClick`   | `() => void` | —       | When set, item acts as a button.                                                   |

This component has no `style` prop.

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, CompoundHotkeys } from "@modkit/ui";

<ShortcutBar>
  <ShortcutBarItem
    hotkeys={<CompoundHotkeys keys={["Shift", "E"]} />}
    label="Place"
    onClick={() => {}}
  />
</ShortcutBar>;
```
