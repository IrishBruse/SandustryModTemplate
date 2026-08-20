# Interactive

Wraps children so they receive pointer events inside a `pointer-events-none` overlay shell.

**Preview:** [layout/preview.html](../../framework/ui/layout/preview.html)

## Props

| Prop        | Type        | Default | Description                                          |
| ----------- | ----------- | ------- | ---------------------------------------------------- |
| `children`  | `ReactNode` | —       | Interactive content (required).                      |
| `className` | `string`    | `""`    | Extra CSS classes appended to `pointer-events-auto`. |

This component has no `style` prop.

## Usage

```tsx
import { OverlayRoot, FixedAnchor, Interactive, MenuButton } from "@framework/ui";

<OverlayRoot>
  <FixedAnchor anchor="top-left">
    <Interactive>
      <MenuButton icon={<span>▶</span>} label="Resume" hotkey="Esc" />
    </Interactive>
  </FixedAnchor>
</OverlayRoot>;
```
