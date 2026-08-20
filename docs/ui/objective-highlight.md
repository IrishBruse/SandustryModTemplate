# ObjectiveHighlight

An inline span to highlight resource names inside objective text.

**Preview:**

<iframe class="ui-canvas" title="ObjectiveHighlight" src="ui/canvas/objectives/preview.html?embed=ObjectiveHighlight"></iframe>

## Props

| Prop       | Type        | Default                | Description                  |
| ---------- | ----------- | ---------------------- | ---------------------------- |
| `children` | `ReactNode` | —                      | Highlighted text (required). |
| `color`    | `string`    | `"rgb(249, 117, 255)"` | Text color.                  |

This component has no `className` or `style` props. It applies bold weight and `objectiveTextShadow` from shared styles.

## Usage

```tsx
import { SecondaryObjectiveRow, ObjectiveHighlight } from "@framework/ui";

<SecondaryObjectiveRow>
  Mine <ObjectiveHighlight>Gold</ObjectiveHighlight>
</SecondaryObjectiveRow>;
```
