# PanelCard

A dark, rounded panel card with optional click handling.

**Preview:**

<iframe class="ui-canvas" title="PanelCard" src="ui/canvas/panels/preview.html?embed=PanelCard"></iframe>

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
import { PanelCard } from "@modkit/ui";

<PanelCard width={220} onClick={() => {}}>
  Clickable panel
</PanelCard>;
```
