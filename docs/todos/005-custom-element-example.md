# Custom element example mod

## Goal

Add `src/custom-element-example/`: register one new element with `sandkit.api.elements.register`, give it a display name via `api.i18n.register`, and paint it at the mouse cell with `createAtCellWhenIdle` (hotkey or binding).

## Why

No template mod shows content registration. Authors need a minimal copy target for a new material that uses built-in `matterType` physics (for example `Powder` or `Liquid`) before they add reactions, structures, or worker logic.

## Acceptance

- [ ] New folder `src/custom-element-example/` (`mod.ts`, `main.ts`, `README.md`)
- [ ] `elements.register` with stable mod-scoped `id`, `nameKey`, `colors`, `density`, and `matterType`
- [ ] `i18n.register` (at least `en`) for the element name shown in-game
- [ ] Input path paints the element at `api.input.getMouseCellPosition()` using the returned `elementType` (not a hard-coded type number)
- [ ] Optional: `discoveries.addElementByType` so the element appears in the codex
- [ ] README explains which `matterType` was chosen and what behaviour to expect in the sandbox
- [ ] Listed in [`docs/layout.md`](../layout.md) and [`AGENTS.md`](../../AGENTS.md) sample-mod table
- [ ] User-visible note in [`docs/Changelog.md`](../Changelog.md) when the example ships

## Origin

`api.elements.register` exists in types and docs cover read/create helpers, but no `src/*-example/` mod registers custom content.
