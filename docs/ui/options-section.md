# OptionsSection

Uppercase yellow section heading for options tabs.
Optional intro line under the heading.

**Preview:**

<iframe class="ui-canvas" title="OptionsSection" src="ui/canvas/options/preview.html?embed=OptionsSection"></iframe>

## Props

| Prop          | Type            | Default | Description                            |
| ------------- | --------------- | ------- | -------------------------------------- |
| `title`       | `string`        | —       | Section title (required).              |
| `first`       | `boolean`       | `false` | First section — no top border.         |
| `description` | `string`        | —       | Optional gray intro under the heading. |
| `children`    | `ReactNode`     | —       | Rows and controls.                     |
| `className`   | `string`        | `""`    | Extra CSS classes on `<section>`.      |
| `style`       | `CSSProperties` | —       | Inline styles.                         |

## Usage

```tsx
import { OptionsSection, OptionsRow, OptionsSwitch } from "@modkit/ui";

<OptionsSection
  title="When Unfocused"
  description="Behavior while the window is minimized or another app is focused."
>
  <OptionsRow label="Keep Running">
    <OptionsSwitch checked={keep} onChange={setKeep} />
  </OptionsRow>
</OptionsSection>;
```
