# HotkeyBadge

Shows a single keyboard key label with Sandustry HUD badge styling.

**Preview:**

<iframe class="ui-canvas" title="HotkeyBadge" src="ui/canvas/badges/preview.html?embed=HotkeyBadge"></iframe>

## Props

| Prop        | Type            | Default | Description                                   |
| ----------- | --------------- | ------- | --------------------------------------------- |
| `children`  | `string`        | —       | Key label text (required).                    |
| `className` | `string`        | `""`    | Extra CSS classes.                            |
| `style`     | `CSSProperties` | —       | Inline styles merged over `hotkeyBadgeStyle`. |

## Usage

```tsx
import { HotkeyBadge } from "@modkit/ui";

<HotkeyBadge>E</HotkeyBadge>;
```
