# ResourceRow

A resource counter row with icon and value on a left gradient background.

**Preview:** [resources/preview.html](../../framework/ui/resources/preview.html)

## Props

| Prop        | Type            | Default | Description                                      |
| ----------- | --------------- | ------- | ------------------------------------------------ |
| `icon`      | `ReactNode`     | —       | Icon or sprite on the left (required).           |
| `value`     | `ReactNode`     | —       | Resource amount or label (required).             |
| `iconWidth` | `number`        | `24`    | Width of the icon column in pixels.              |
| `className` | `string`        | `""`    | Extra CSS classes.                               |
| `style`     | `CSSProperties` | —       | Inline styles merged over `sectionGradientLeft`. |

## Usage

```tsx
import { ResourceRow } from "@framework/ui";

<ResourceRow icon={<span>💎</span>} value="42" />;
```
