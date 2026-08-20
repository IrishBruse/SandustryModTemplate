# ManagementMenuButton

A vanilla-style management column row under Upgrades (same look as Toolbox / Building / Research / Upgrades). Stacks additional mod rows without overlap.

## Props

| Prop              | Type         | Default               | Description                                   |
| ----------------- | ------------ | --------------------- | --------------------------------------------- |
| `id`              | `string`     | —                     | Stable spacer id (unique per row) (required). |
| `icon`            | `ReactNode`  | —                     | Icon on the left (required).                  |
| `label`           | `string`     | —                     | Row label (required).                         |
| `hotkey`          | `string`     | —                     | Hotkey badge text (required).                 |
| `highlightLetter` | `string`     | first char of `label` | Letter highlighted on hover.                  |
| `active`          | `boolean`    | `true`                | When false, the row and spacer are removed.   |
| `onClick`         | `() => void` | —                     | Click handler (also plays vanilla `click`).   |

Hover plays `blip`; click plays `click` when those sounds exist.

## Usage

```tsx
import { ManagementMenuButton } from "@modkit/ui";

<ManagementMenuButton
  id="author.example-mod:tools"
  icon={<span>⚙</span>}
  label="Tools"
  hotkey="F4"
  onClick={() => setOpen(true)}
/>;
```

Rows register in mount order under the Upgrades button. Prefer this over a one-off DOM spacer.
