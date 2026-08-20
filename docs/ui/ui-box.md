# UiBox

A simple container with the `ui-box` class for Sandustry panel chrome.

**Preview:** [panels/preview.html](../../framework/ui/panels/preview.html)

## Props

| Prop        | Type            | Default | Description                             |
| ----------- | --------------- | ------- | --------------------------------------- |
| `children`  | `ReactNode`     | —       | Panel content (required).               |
| `className` | `string`        | `""`    | Extra CSS classes appended to `ui-box`. |
| `style`     | `CSSProperties` | —       | Inline styles.                          |

## Usage

```tsx
import { UiBox } from "@framework/ui";

<UiBox className="p-4 text-white">Panel content</UiBox>;
```
