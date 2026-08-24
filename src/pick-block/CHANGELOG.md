# Changelog

## 0.1.0

### Added

- **Instant Pick Block** — press **Picker** (default **F**) once to pick the structure under the cursor. No hold-and-click.
- **Mod enabled** toggle in Options → Mods. Turn off to restore vanilla Picker immediately.
- Bundle patch on vanilla **Picker** `down` — when enabled, sets `mouse.clicked` and runs vanilla `pressed` so pick logic stays 100% vanilla.

### Removed

- Duplicated pick/copy helpers (`copied-structure`, `resolve-type`, custom `registerBinding` override).
