# CompoundHotkeys

Renders multi-key hotkeys in `Ctrl` + `Z` style with `HotkeyBadge` and `+` separators.

**Preview:**

<iframe class="ui-canvas" title="CompoundHotkeys" src="ui/canvas/shortcuts/preview.html?embed=CompoundHotkeys"></iframe>

## Props

| Prop   | Type       | Default | Description                     |
| ------ | ---------- | ------- | ------------------------------- |
| `keys` | `string[]` | —       | Key labels in order (required). |

This component has no `className` or `style` props.

## Usage

```tsx
import { ShortcutBar, ShortcutBarItem, CompoundHotkeys } from "@modkit/ui";

<ShortcutBarItem hotkeys={<CompoundHotkeys keys={["Ctrl", "Shift", "S"]} />} label="Save" />;
```
