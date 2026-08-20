# ResourceRow

A resource counter row with icon and value on a left gradient background.

**Preview:**

<iframe class="ui-canvas" title="ResourceRow" src="ui/canvas/resources/preview.html?embed=ResourceRow"></iframe>

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
import { ResourceRow } from "@modkit/ui";

<ResourceRow icon={<span>💎</span>} value="42" />;
```
