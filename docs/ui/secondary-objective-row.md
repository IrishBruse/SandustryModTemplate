# SecondaryObjectiveRow

A secondary objective line with optional trailing text and click handling.

**Preview:**

<iframe class="ui-canvas" title="SecondaryObjectiveRow" src="ui/canvas/objectives/preview.html?embed=SecondaryObjectiveRow"></iframe>

## Props

| Prop        | Type               | Default | Description                                         |
| ----------- | ------------------ | ------- | --------------------------------------------------- |
| `children`  | `ReactNode`        | —       | Objective text (required).                          |
| `trailing`  | `ReactNode`        | —       | Optional right-side content (for example progress). |
| `width`     | `number \| string` | `200`   | Row inner width.                                    |
| `className` | `string`           | `""`    | Extra CSS classes.                                  |
| `style`     | `CSSProperties`    | —       | Inline styles merged with row background.           |
| `onClick`   | `() => void`       | —       | When set, row acts as a button.                     |

## Usage

```tsx
import { ObjectiveCard, SecondaryObjectiveRow } from "@framework/ui";

<SecondaryObjectiveRow trailing="3/5" onClick={() => {}}>
  Collect sand
</SecondaryObjectiveRow>;
```
