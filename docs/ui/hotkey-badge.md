# HotkeyBadge

Shows a single keyboard key label with Sandustry HUD badge styling.

**Preview:** [badges/preview.html](../../framework/ui/badges/preview.html)

## Props

| Prop        | Type            | Default | Description                                   |
| ----------- | --------------- | ------- | --------------------------------------------- |
| `children`  | `string`        | —       | Key label text (required).                    |
| `className` | `string`        | `""`    | Extra CSS classes.                            |
| `style`     | `CSSProperties` | —       | Inline styles merged over `hotkeyBadgeStyle`. |

## Usage

```tsx
import { HotkeyBadge } from "@framework/ui";

<HotkeyBadge>E</HotkeyBadge>;
```
