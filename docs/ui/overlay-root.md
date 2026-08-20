# OverlayRoot

Full-screen fixed overlay root that matches `#ui` fixed layers. Pointer events pass through by default.

**Preview:**

<iframe class="ui-canvas" title="OverlayRoot" src="ui/canvas/layout/preview.html?embed=OverlayRoot"></iframe>

## Props

| Prop        | Type            | Default | Description                 |
| ----------- | --------------- | ------- | --------------------------- |
| `children`  | `ReactNode`     | —       | Overlay content (required). |
| `className` | `string`        | `""`    | Extra CSS classes.          |
| `style`     | `CSSProperties` | —       | Inline styles.              |

## Usage

```tsx
import { OverlayRoot, FixedAnchor, Interactive, PanelCard } from "@modkit/ui";

<OverlayRoot>
  <FixedAnchor anchor="top-right">
    <Interactive>
      <PanelCard>HUD panel</PanelCard>
    </Interactive>
  </FixedAnchor>
</OverlayRoot>;
```
