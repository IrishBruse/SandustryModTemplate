# Interactive

Wraps children so they receive pointer events inside a `pointer-events-none` overlay shell.

**Preview:**

<iframe class="ui-canvas" title="Interactive" src="ui/canvas/layout/preview.html?embed=Interactive"></iframe>

## Props

| Prop        | Type        | Default | Description                                          |
| ----------- | ----------- | ------- | ---------------------------------------------------- |
| `children`  | `ReactNode` | —       | Interactive content (required).                      |
| `className` | `string`    | `""`    | Extra CSS classes appended to `pointer-events-auto`. |

This component has no `style` prop.

## Usage

```tsx
import { OverlayRoot, FixedAnchor, Interactive, MenuButton } from "@modkit/ui";

<OverlayRoot>
  <FixedAnchor anchor="top-left">
    <Interactive>
      <MenuButton icon={<span>▶</span>} label="Resume" hotkey="Esc" />
    </Interactive>
  </FixedAnchor>
</OverlayRoot>;
```
