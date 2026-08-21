# Management menu row

Add a vanilla-style row under Upgrades (same look as Toolbox / Building / Research / Upgrades). The row mounts in the management column and follows expand / collapse.

Prefer `registerManagementMenuButton` from `src/<name>/main.ts`. Use the React `ManagementMenuButton` only when the icon must be a React node or `active` must update every render.

Hover plays `blip`; click plays `click` when those sounds exist. `hotkey` is badge text only — it does not bind a key.

## `registerManagementMenuButton`

```ts
import { onDispose } from "./debug";
import { registerManagementMenuButton } from "@modkit/ui";
import { MOD_ID } from "./globals";

const stop = registerManagementMenuButton({
  id: `${MOD_ID}:tools`,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M120-160v-640h80v640h-80Zm160-80v-480h80v480h-80Z"/></svg>`,
  label: "Tools",
  hotkey: "F4",
  onClick: () => {
    /* open tools */
  },
});
onDispose(stop);
```

| Param     | Type         | Default | Description                                                          |
| --------- | ------------ | ------- | -------------------------------------------------------------------- |
| `id`      | `string`     | —       | Stable spacer id. Prefer `${modId}:name` (required).                 |
| `icon`    | `string`     | —       | SVG markup for the 20×20 slot. Use `fill="currentColor"` (required). |
| `label`   | `string`     | —       | Row label (required).                                                |
| `hotkey`  | `string`     | —       | Badge text only (required).                                          |
| `onClick` | `() => void` | —       | Click handler.                                                       |
| `active`  | `boolean`    | `true`  | When false, the row and spacer are removed.                          |

Returns a dispose function. Pass it to `onDispose` so hot reload removes the row.

Rows stack under Upgrades in registration order. The first register injects a host overlay; the last dispose removes it.

## `ManagementMenuButton` (React)

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

| Prop              | Type         | Default               | Description                                   |
| ----------------- | ------------ | --------------------- | --------------------------------------------- |
| `id`              | `string`     | —                     | Stable spacer id (unique per row) (required). |
| `icon`            | `ReactNode`  | —                     | Icon on the left (required).                  |
| `label`           | `string`     | —                     | Row label (required).                         |
| `hotkey`          | `string`     | —                     | Hotkey badge text (required).                 |
| `highlightLetter` | `string`     | first char of `label` | Letter highlighted on hover.                  |
| `active`          | `boolean`    | `true`                | When false, the row and spacer are removed.   |
| `onClick`         | `() => void` | —                     | Click handler (also plays vanilla `click`).   |

Register the component through `api.ui.inject` (or use `registerManagementMenuButton` instead).
