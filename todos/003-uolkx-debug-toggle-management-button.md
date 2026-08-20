# uolkx-debug-toggle management button

## Goal

Make the Debug control from `uolkx-debug-toggle` match the vanilla left management rows (Toolbox / Building / Research / Upgrades): teal row, left icon, label, and a hotkey badge. Open the panel with **F3**.

## Why

The current Debug control is a plain black box under Upgrades. It does not match the management list look, so it reads as an out-of-place mod HUD instead of a normal menu row.

## Acceptance

- [x] Debug uses a management-style row (same look as Upgrades): icon, label, raised hotkey badge
- [x] Hotkey badge shows **F3**; pressing **F3** opens/toggles the same Debug UI as the row click
- [x] Hover / click use the same sound cues as vanilla rows (`blip` / `click`) when that path is available
- [x] Row stays aligned under Upgrades when the management column collapses or the UI scales
- [x] Prefer the shared modkit management-row API from [001-management-menu-button-api.md](001-management-menu-button-api.md) once it exists; avoid a one-off DOM spacer if the API can do the job

## Notes

- Lives in `modkit/debug/toggle/` (dev builds only via `installDebug`).
- Setting `debugMenuButton` (default on) can hide the sidebar row; **F3 cannot be turned off** in a debug build.
- Flag apply logic follows `references/uolkx-debug-toggle/main.js`.

## Origin

In-game screenshot of `uolkx-debug-toggle`: plain “Debug” box + “Stats >” under Upgrades, unlike the teal Toolbox / Building / Research / Upgrades rows above.
