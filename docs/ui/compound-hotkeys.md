# CompoundHotkeys

Renders multi-key hotkeys in `Ctrl` + `Z` style with `HotkeyBadge` and `+` separators.

**Preview:** [shortcuts/preview.html](../../framework/ui/shortcuts/preview.html)

## Props

| Prop   | Type       | Default | Description                     |
| ------ | ---------- | ------- | ------------------------------- |
| `keys` | `string[]` | —       | Key labels in order (required). |

This component has no `className` or `style` props.

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, CompoundHotkeys } from "@framework/ui";

<ShortcutBarItem hotkeys={<CompoundHotkeys keys={["Ctrl", "Shift", "S"]} />} label="Save" />;
```
