# ShortcutBar

A horizontal bar that groups shortcut items.

**Preview:** [shortcuts/preview.html](../../framework/ui/shortcuts/preview.html)

## Props

| Prop        | Type            | Default | Description                                                            |
| ----------- | --------------- | ------- | ---------------------------------------------------------------------- |
| `children`  | `ReactNode`     | —       | `ShortcutBarItem`, `ShortcutBarDivider`, or other children (required). |
| `className` | `string`        | `""`    | Extra CSS classes.                                                     |
| `style`     | `CSSProperties` | —       | Inline styles.                                                         |

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, ShortcutBarDivider, CompoundHotkeys } from "@framework/ui";

<ShortcutBar>
  <ShortcutBarItem hotkeys={<CompoundHotkeys keys={["Ctrl", "Z"]} />} label="Undo" />
  <ShortcutBarDivider />
  <ShortcutBarItem hotkeys="R" label="Rotate" active />
</ShortcutBar>;
```
