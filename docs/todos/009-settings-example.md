# Mod settings example

## Goal

Add `src/settings-example/`: extend `configSchema` in `mod.ts` beyond the default `enabled` flag (for example a number or enum), read values with `sandkit.api.settings.get`, and react with `settings.onChange`.

## Why

`hello-world-example` only documents the `enabled` toggle. The debug companion reads settings but is debug-only and not a copy target. Authors need a small in-game sample for custom mod options in the game's mod settings UI.

## Acceptance

- [ ] New folder `src/settings-example/` (`mod.ts`, `main.ts`, `README.md`)
- [ ] `configSchema` defines at least one non-`enabled` field with label/description keys
- [ ] `main.ts` reads the value on boot and subscribes to `onChange` with `onDispose` cleanup
- [ ] User-visible feedback when a setting changes (toast or overlay label)
- [ ] README explains where to change the setting in the game UI
- [ ] Listed in [`docs/layout.md`](../layout.md) and [`AGENTS.md`](../../AGENTS.md) sample-mod table

## Origin

`configSchema` in every example `mod.ts` but only `enabled` is exercised; `src/debug/settings.ts` is the only reader sample.
