# OverlayRoot

Full-screen fixed overlay root that matches `#ui` fixed layers. Pointer events pass through by default.

**Preview:** [layout/preview.html](../../framework/ui/layout/preview.html)

## Props

| Prop        | Type            | Default | Description                 |
| ----------- | --------------- | ------- | --------------------------- |
| `children`  | `ReactNode`     | —       | Overlay content (required). |
| `className` | `string`        | `""`    | Extra CSS classes.          |
| `style`     | `CSSProperties` | —       | Inline styles.              |

## Usage

```tsx
import { OverlayRoot, FixedAnchor, Interactive, PanelCard } from "@framework/ui";

<OverlayRoot>
  <FixedAnchor anchor="top-right">
    <Interactive>
      <PanelCard>HUD panel</PanelCard>
    </Interactive>
  </FixedAnchor>
</OverlayRoot>;
```
