# ObjectiveHighlight

An inline span to highlight resource names inside objective text.

**Preview:** [objectives/preview.html](../../framework/ui/objectives/preview.html)

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
