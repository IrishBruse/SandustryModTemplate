# ShortcutChip

A vertical shortcut tile with hotkey, label, and optional active state.

**Preview:** [shortcuts/preview.html](../../framework/ui/shortcuts/preview.html)

## Props

| Prop        | Type            | Default | Description                                                     |
| ----------- | --------------- | ------- | --------------------------------------------------------------- |
| `hotkey`    | `ReactNode`     | —       | Hotkey display; strings render inside `HotkeyBadge` (required). |
| `label`     | `string`        | —       | Shortcut label below the hotkey (required).                     |
| `active`    | `boolean`       | `false` | When true, applies active glow and pulse dot.                   |
| `className` | `string`        | `""`    | Extra CSS classes.                                              |
| `style`     | `CSSProperties` | —       | Inline styles.                                                  |
| `onClick`   | `() => void`    | —       | When set, chip acts as a button.                                |

## Usage

```tsx
import { ShortcutChip } from "@framework/ui";

<ShortcutChip hotkey="1" label="Build" active onClick={() => {}} />;
```
