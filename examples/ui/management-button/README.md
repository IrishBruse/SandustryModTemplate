# Management Button Example

Adds an **Example** row under **Upgrades** in the left management column.

## Use

1. Enable the mod.
2. Open the management column (left side of the HUD).
3. Click **Example** (hotkey badge **F1**).
4. Look for the toast: **Example row clicked**.

Use `registerManagementMenuButton` from `@modkit/ui` — not a one-off DOM spacer.

## Copy this mod

Copy `examples/ui/management-button/` to `src/<your-mod>/`. Change the label, hotkey, and `onClick` in `main.ts`. Set `id`, `name`, `author`, and `description` in `modinfo.ts`.
