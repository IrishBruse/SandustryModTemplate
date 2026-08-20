# MenuButton

A menu row with icon, label, highlighted first letter, and hotkey badge.

**Preview:**

<iframe class="ui-canvas" title="MenuButton" src="ui/canvas/menu/preview.html?embed=MenuButton"></iframe>

## Props

| Prop              | Type               | Default               | Description                                   |
| ----------------- | ------------------ | --------------------- | --------------------------------------------- |
| `icon`            | `ReactNode`        | —                     | Icon shown on the left (required).            |
| `label`           | `string`           | —                     | Button label text (required).                 |
| `hotkey`          | `string`           | —                     | Hotkey label inside `HotkeyBadge` (required). |
| `highlightLetter` | `string`           | first char of `label` | Letter highlighted on hover.                  |
| `width`           | `number \| string` | `208`                 | Row width.                                    |
| `className`       | `string`           | `""`                  | Extra CSS classes.                            |
| `style`           | `CSSProperties`    | —                     | Inline styles merged with width.              |
| `onClick`         | `() => void`       | —                     | When set, row acts as a button.               |

## Usage

```tsx
import { MenuButton } from "@modkit/ui";

<MenuButton icon={<span>⚙</span>} label="Settings" hotkey="S" onClick={() => {}} />;
```
