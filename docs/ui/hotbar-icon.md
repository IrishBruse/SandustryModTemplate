# HotbarIcon

A pixel-art sprite scaled for display inside `HotbarSlot`.

**Preview:**

<iframe class="ui-canvas" title="HotbarIcon" src="ui/canvas/hotbar/preview.html?embed=HotbarIcon"></iframe>

## Props

| Prop        | Type            | Default | Description                                   |
| ----------- | --------------- | ------- | --------------------------------------------- |
| `src`       | `string`        | —       | Image URL (required).                         |
| `width`     | `number`        | `16`    | Source sprite width in pixels.                |
| `height`    | `number`        | `16`    | Source sprite height in pixels.               |
| `scale`     | `number`        | `2`     | CSS transform scale.                          |
| `className` | `string`        | `""`    | Extra CSS classes on the `img` element.       |
| `style`     | `CSSProperties` | —       | Inline styles merged with pixel-art defaults. |

## Usage

```tsx
import { HotbarSlot, HotbarIcon } from "@framework/ui";

<HotbarSlot slot={3}>
  <HotbarIcon src="/sprites/grabber.png" width={16} height={16} scale={2} />
</HotbarSlot>;
```
