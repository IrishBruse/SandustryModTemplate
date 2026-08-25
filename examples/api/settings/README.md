# Settings

Shows every `configSchema` field type the game accepts: **boolean**, **number**, and **choice**.

## Use

1. Enable the mod.
2. Load a save (or continue).
3. Look for the toast with the current setting values.
4. Open **Options → Mods → Settings**.
5. Change **Toast on change**, **Volume**, **Retry count**, or **Priority**.
6. Look for a toast (when enabled) and a console line on each change.

## Field types in this mod

- **boolean** — Mod enabled, Toast on change
- **number** with min/max — Volume (slider + number box)
- **number** without min/max — Retry count (number box only)
- **choice** — Priority (select list: Low / Normal / High)

There is no free-text `string` type and no `enum` type. Use `choice` for a fixed set of string values.

Full reference: [`docs/modkit/config-schema.md`](../../docs/modkit/config-schema.md).

## Copy this mod

Copy `examples/api/settings/` to `src/<your-mod>/`. Keep the fields you need in `modinfo.ts`. Set `id`, `name`, `author`, and `description`.
