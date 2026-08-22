# OptionsSelect

Listbox dropdown for language and choice settings. Keyboard: Arrow keys, Enter, Escape.

**Preview:**

<iframe class="ui-canvas" title="OptionsSelect" src="ui/canvas/options/preview.html?embed=OptionsSelect"></iframe>

## Props

| Prop        | Type                      | Default | Description                    |
| ----------- | ------------------------- | ------- | ------------------------------ |
| `value`     | `string`                  | —       | Selected option value.         |
| `options`   | `OptionsSelectOption[]`   | —       | `{ value, label }` list.       |
| `onChange`  | `(value: string) => void` | —       | Called when user picks a row.  |
| `disabled`  | `boolean`                 | `false` | Disables the trigger button.   |
| `className` | `string`                  | `""`    | Extra classes on root wrapper. |
| `style`     | `CSSProperties`           | —       | Inline styles.                 |

## Usage

```tsx
import { OptionsRow, OptionsSelect } from "@modkit/ui";

<OptionsRow label="Language">
  <OptionsSelect
    value={lang}
    options={[
      { value: "auto", label: "Auto-detect (en)" },
      { value: "en", label: "English" },
    ]}
    onChange={setLang}
    className="min-w-40"
  />
</OptionsRow>;
```
