# ShortcutBar

A horizontal bar that groups shortcut items.

**Preview:**

<iframe class="ui-canvas" title="ShortcutBar" src="ui/canvas/shortcuts/preview.html?embed=ShortcutBar"></iframe>

## Props

| Prop        | Type            | Default | Description                                                            |
| ----------- | --------------- | ------- | ---------------------------------------------------------------------- |
| `children`  | `ReactNode`     | —       | `ShortcutBarItem`, `ShortcutBarDivider`, or other children (required). |
| `className` | `string`        | `""`    | Extra CSS classes.                                                     |
| `style`     | `CSSProperties` | —       | Inline styles.                                                         |

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, ShortcutBarDivider, CompoundHotkeys } from "@modkit/ui";

<ShortcutBar>
  <ShortcutBarItem hotkeys={<CompoundHotkeys keys={["Ctrl", "Z"]} />} label="Undo" />
  <ShortcutBarDivider />
  <ShortcutBarItem hotkeys="R" label="Rotate" active />
</ShortcutBar>;
```
