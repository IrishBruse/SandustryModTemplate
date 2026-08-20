# SectionHeading

A section title with optional alignment, size, and gradient background.

**Preview:** [headings/preview.html](../../framework/ui/headings/preview.html)

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
import { SectionHeading } from "@framework/ui";

<SectionHeading align="right" size="lg">
  Objectives
</SectionHeading>;
```
