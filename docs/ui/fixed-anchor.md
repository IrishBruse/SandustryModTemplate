# FixedAnchor

A fixed-position HUD anchor with `pointer-events-none` shell. Use `Interactive` inside for clickable children.

**Preview:** [layout/preview.html](../../framework/ui/layout/preview.html)

## Props

| Prop        | Type                                                            | Default      | Description                                |
| ----------- | --------------------------------------------------------------- | ------------ | ------------------------------------------ |
| `children`  | `ReactNode`                                                     | —            | Anchored content (required).               |
| `className` | `string`                                                        | `""`         | Extra CSS classes.                         |
| `style`     | `CSSProperties`                                                 | —            | Inline styles merged with anchor position. |
| `anchor`    | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-center"` | `"top-left"` | Screen corner and `transform-origin`.      |
| `zIndex`    | `number`                                                        | `9999`       | CSS `z-index`.                             |

## Usage

```tsx
import { OverlayRoot, FixedAnchor, Interactive } from "@framework/ui";

<OverlayRoot>
  <FixedAnchor anchor="bottom-center" zIndex={10000}>
    <Interactive>
      <div>Bottom HUD</div>
    </Interactive>
  </FixedAnchor>
</OverlayRoot>;
```
