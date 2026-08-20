# Keybind / hotkey API

## Goal

Give mods a small, typed way to declare keybinds (in `mod.ts` or a colocated helper) so UI badges, listeners, and dispose stay in sync — instead of hand-rolled `keydown` capture listeners next to a separate `hotkey="F3"` string.

## Why

Overlays and debug helpers each wire `window.addEventListener("keydown", …, true)` by hand (`ExampleOverlay`, F3 debug toggle, F12 DevTools). The badge label can drift from the real binding. Sandkit already has `api.input.registerBinding`, but there is no modkit helper that ties declaration, display label, handler, and `onDispose` together.

## Acceptance

- [ ] Modkit API (for example `defineKeybinds` in `mod.ts`, or `@modkit/utils` / `@modkit/ui`) can declare a binding: id, default keys, display label, and down/up handlers
- [ ] Installing a binding returns a dispose path that works with `onDispose` / hot reload
- [ ] Badge / `ManagementMenuButton` hotkey text can come from the same declaration (no duplicated `"F3"` string)
- [ ] Prefer Sandkit `api.input.registerBinding` when it fits; document when a capture-phase listener is still required (for example F-keys the game swallows)
- [ ] Template example (debug F3 and/or Alt+E overlay) uses the API
- [ ] Short docs page under `docs/modkit/` or `docs/ui/`

## Origin

Repeated capture-phase keydown wiring in `src/ui/ExampleOverlay.tsx`, `modkit/debug/toggle/DebugToggleOverlay.tsx`, and `modkit/debug/boot-menu.ts`.
