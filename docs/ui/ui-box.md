# UiBox

A simple container with the `ui-box` class for Sandustry panel chrome.

**Preview:**

<iframe class="ui-canvas" title="UiBox" src="ui/canvas/panels/preview.html?embed=UiBox"></iframe>

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
