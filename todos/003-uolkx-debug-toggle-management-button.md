# uolkx-debug-toggle management button

## Goal

Make the Debug control from `uolkx-debug-toggle` match the vanilla left management rows (Toolbox / Building / Research / Upgrades): teal row, left icon, label, and a hotkey badge. Open the panel with **F3**.

## Why

The engine Debug control is a plain black box under Upgrades. It does not match the management list look, so it reads as an out-of-place mod HUD instead of a normal menu row.

## Acceptance

- [x] Debug uses a management-style row (same look as Upgrades): icon, label, raised hotkey badge
- [x] Hotkey badge shows **F3**; pressing **F3** opens/toggles the same Debug UI as the row click
- [x] Hover / click use the same sound cues as vanilla rows (`blip` / `click`) when that path is available
- [x] Row stays aligned under Upgrades when the management column collapses or the UI scales
- [x] Prefer the shared modkit management-row API from [001-management-menu-button-api.md](001-management-menu-button-api.md) once it exists; avoid a one-off DOM spacer if the API can do the job
- [x] Engine debug mode follows the single **Debug** setting (no per-flag settings UI)
- [x] Engine plain Debug / Stats buttons are hidden while Debug is on

## Notes

- Lives in `modkit/debug/toggle/` (dev builds only via `installDebug`).
- No `debugActive` / `drawChunks` / … settings — `debug.active` tracks the **Debug** setting.

## Origin

In-game screenshot of `uolkx-debug-toggle`: plain “Debug” box + “Stats >” under Upgrades, unlike the teal Toolbox / Building / Research / Upgrades rows above.
