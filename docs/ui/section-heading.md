# SectionHeading

A section title with optional alignment, size, and gradient background.

**Preview:**

<iframe class="ui-canvas" title="SectionHeading" src="ui/canvas/headings/preview.html?embed=SectionHeading"></iframe>

## Props

| Prop        | Type                   | Default  | Description                                 |
| ----------- | ---------------------- | -------- | ------------------------------------------- |
| `children`  | `ReactNode`            | —        | Heading text (required).                    |
| `align`     | `"left" \| "right"`    | `"left"` | Text alignment and gradient direction.      |
| `size`      | `"sm" \| "md" \| "lg"` | `"md"`   | Font size preset.                           |
| `className` | `string`               | `""`     | Extra CSS classes.                          |
| `style`     | `CSSProperties`        | —        | Inline styles merged over section gradient. |

## Usage

```tsx
import { SectionHeading } from "@modkit/ui";

<SectionHeading align="right" size="lg">
  Objectives
</SectionHeading>;
```
