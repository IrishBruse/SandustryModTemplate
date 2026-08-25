# Management menu row

Add a vanilla-style row under Upgrades (same look as Toolbox / Building / Research / Upgrades). The row mounts in the management column and follows expand / collapse.

Prefer `registerManagementMenuButton` from `src/<name>/main.ts`. Live demo: [`examples/ui/management-button/`](../../examples/ui/management-button/). Use the React `ManagementMenuButton` only when the icon must be a React node or `active` must update every render.

Hover plays `blip`; click plays `click` when those sounds exist. `hotkey` is badge text only — it does not bind a key.

## `registerManagementMenuButton`

```ts
import { registerManagementMenuButton } from "@modkit/ui";
import { modinfo } from "./modinfo";

registerManagementMenuButton({
  id: `${modinfo.id}:example`,
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-642l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
  label: "Example",
  hotkey: "F1",
  onClick: () => {
    /* open panel */
  },
});
```

| Param     | Type         | Default | Description                                                          |
| --------- | ------------ | ------- | -------------------------------------------------------------------- |
| `id`      | `string`     | —       | Stable row id. Prefer `${modId}:name` (required).                    |
| `icon`    | `string`     | —       | SVG markup for the 20×20 slot. Use `fill="currentColor"` (required). |
| `label`   | `string`     | —       | Row label (required).                                                |
| `hotkey`  | `string`     | —       | Badge text only (required).                                          |
| `onClick` | `() => void` | —       | Click handler.                                                       |
| `active`  | `boolean`    | `true`  | When false, the row is removed.                                      |

Returns a dispose function. Call it to remove the row by hand.

Rows stack under Upgrades in registration order. Each row root is placed as a **direct sibling** of the vanilla column rows (same as Toolbox / Building). The first register injects a host overlay; the last dispose removes it.

## `ManagementMenuButton` (React)

```tsx
import { ManagementMenuButton } from "@modkit/ui";

<ManagementMenuButton
  id="example.management-button:example"
  icon={<span>?</span>}
  label="Example"
  hotkey="F1"
  onClick={() => setOpen(true)}
/>;
```

| Prop              | Type         | Default               | Description                                 |
| ----------------- | ------------ | --------------------- | ------------------------------------------- |
| `id`              | `string`     | —                     | Stable row id (unique per row) (required).  |
| `icon`            | `ReactNode`  | —                     | Icon on the left (required).                |
| `label`           | `string`     | —                     | Row label (required).                       |
| `hotkey`          | `string`     | —                     | Hotkey badge text (required).               |
| `highlightLetter` | `string`     | first char of `label` | Letter highlighted on hover.                |
| `active`          | `boolean`    | `true`                | When false, the row is removed.             |
| `onClick`         | `() => void` | —                     | Click handler (also plays vanilla `click`). |

Register the component through `api.ui.inject` (or use `registerManagementMenuButton` instead).
