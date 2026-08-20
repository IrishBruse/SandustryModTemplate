# PanelCard

A dark, rounded panel card with optional click handling.

**Preview:** [panels/preview.html](../../framework/ui/panels/preview.html)

## Props

| Prop        | Type               | Default | Description                                                        |
| ----------- | ------------------ | ------- | ------------------------------------------------------------------ |
| `children`  | `ReactNode`        | —       | Card content (required).                                           |
| `width`     | `number \| string` | `200`   | Card width.                                                        |
| `className` | `string`           | `""`    | Extra CSS classes.                                                 |
| `style`     | `CSSProperties`    | —       | Inline styles merged with width.                                   |
| `onClick`   | `() => void`       | —       | When set, card acts as a button (`role="button"`, `tabIndex={0}`). |

## Usage

```tsx
import { PanelCard } from "@framework/ui";

<PanelCard width={220} onClick={() => {}}>
  Clickable panel
</PanelCard>;
```
