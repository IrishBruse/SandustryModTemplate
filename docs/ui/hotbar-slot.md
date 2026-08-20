# HotbarSlot

A single hotbar cell with slot number, icon area, and optional outline.

**Preview:** [hotbar/preview.html](../../framework/ui/hotbar/preview.html)

## Props

| Prop        | Type               | Default | Description                                                 |
| ----------- | ------------------ | ------- | ----------------------------------------------------------- |
| `slot`      | `string \| number` | —       | Slot index shown in the corner (required).                  |
| `children`  | `ReactNode`        | —       | Icon or content in the slot (required).                     |
| `outlined`  | `boolean`          | `false` | When true, adds a black outline around the inner icon area. |
| `className` | `string`           | `""`    | Extra CSS classes.                                          |
| `style`     | `CSSProperties`    | —       | Inline styles merged over `hotbarSlotBackground`.           |
| `draggable` | `boolean`          | `false` | HTML `draggable` attribute on the slot.                     |
| `onClick`   | `() => void`       | —       | When set, slot acts as a button.                            |

## Usage

```tsx
import { HotbarSlot, HotbarIcon } from "@framework/ui";

<HotbarSlot slot={1} outlined onClick={() => {}}>
  <HotbarIcon src="/sprites/drill.png" />
</HotbarSlot>;
```
