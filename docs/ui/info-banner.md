# InfoBanner

A compact label and value row with an optional action button.

**Preview:**

<iframe class="ui-canvas" title="InfoBanner" src="ui/canvas/panels/preview.html?embed=InfoBanner"></iframe>

## Props

| Prop          | Type         | Default | Description                                   |
| ------------- | ------------ | ------- | --------------------------------------------- |
| `label`       | `string`     | —       | Muted label on the left (required).           |
| `value`       | `ReactNode`  | —       | Highlighted value in accent color (required). |
| `actionLabel` | `string`     | —       | When set, shows a button with this label.     |
| `onAction`    | `() => void` | —       | Click handler for the action button.          |

## Usage

```tsx
import { InfoBanner } from "@modkit/ui";

<InfoBanner label="Energy" value="1,240" actionLabel="Collect" onAction={() => {}} />;
```
