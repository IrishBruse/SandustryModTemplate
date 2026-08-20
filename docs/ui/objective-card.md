# ObjectiveCard

A primary objective card with category label, title, and optional icon.

**Preview:**

<iframe class="ui-canvas" title="ObjectiveCard" src="ui/canvas/objectives/preview.html?embed=ObjectiveCard"></iframe>

## Props

| Prop                | Type            | Default             | Description                                |
| ------------------- | --------------- | ------------------- | ------------------------------------------ |
| `category`          | `string`        | —                   | Uppercase category label (required).       |
| `title`             | `string`        | —                   | Objective title (required).                |
| `icon`              | `ReactNode`     | —                   | Optional icon in the top-right corner.     |
| `categoryClassName` | `string`        | `"text-purple-400"` | Tailwind classes for the category label.   |
| `className`         | `string`        | `""`                | Extra CSS classes.                         |
| `style`             | `CSSProperties` | —                   | Inline styles merged with card background. |

## Usage

```tsx
import { ObjectiveCard } from "@framework/ui";

<ObjectiveCard category="Main" title="Build a conveyor belt" icon={<span>📦</span>} />;
```
