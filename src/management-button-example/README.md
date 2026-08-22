# Management Button Example

Adds a **Tools** row under **Upgrades** in the left management column.

## Use

1. Enable the mod.
2. Open the management column (left side of the HUD).
3. Click **Tools** (or press **F4**).
4. Look for the toast: **Tools row clicked**.

Use `registerManagementMenuButton` from `@modkit/ui` — not a one-off DOM spacer.

## Copy this mod

Copy `src/management-button-example/` to `src/<your-mod>/`. Change the label, hotkey, and `onClick` in `main.ts`. Set `id`, `name`, `author`, and `description` in `mod.ts`.
