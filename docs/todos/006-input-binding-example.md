# Input binding example mod

## Goal

Add `src/input-binding-example/`: register one or two bindings with `sandkit.api.input.registerBinding`, show the bound key with `HotkeyBadge` / `getDisplayKey`, and run a handler on press (toast or toggle).

## Why

`overlay-hotkey-example` uses a hand-rolled capture-phase `keydown` listener. `selection-capture` uses bindings but is a full product mod. Authors need a minimal copy target for the Sandkit input API before (or alongside) the modkit keybind helper in [004-keybind-api.md](004-keybind-api.md).

## Acceptance

- [ ] New folder `src/input-binding-example/` (`mod.ts`, `main.ts`, optional `ui/`, `README.md`)
- [ ] At least one `registerBinding` with `displayName` / category and `down` handler
- [ ] UI or console shows `getDisplayKey` so rebinding in game settings is visible
- [ ] Binding dispose on hot reload (`onDispose` stops the registration if the API returns a dispose function, or document the game's cleanup behaviour)
- [ ] README states when capture-phase listeners are still needed (F-keys the game swallows)
- [ ] Listed in [`docs/layout.md`](../layout.md) and [`AGENTS.md`](../../AGENTS.md) sample-mod table

## Origin

Repeated ad-hoc key wiring in `overlay-hotkey-example` and [004-keybind-api.md](004-keybind-api.md).
