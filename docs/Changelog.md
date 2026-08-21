# Changelog

Notable changes to this template. Newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The template has no release tags yet. Dated sections match the day the change landed on `main`.

## Unreleased

### Added

- **Multi-mod.** Each `src/<name>/` folder with a `mod.ts` is a separate game mod. The build writes each mod to its own OS mods folder. `dist/<folder>/` is a per-mod link. `--mod <folder>` builds one mod.
- **Isolation.** Mods cannot import from another `src/` folder. Typecheck uses a per-mod `tsconfig.json`. The bundle fails sibling imports.
- **Sample mods** (copy one to start a new mod):

| Folder                           | Shows                                |
| -------------------------------- | ------------------------------------ |
| `src/hello-toast-example/`       | Toast on load                        |
| `src/overlay-hotkey-example/`    | React overlay + Tailwind; **Alt+E**  |
| `src/retro-game-example/`        | Retro Console Noise Test             |
| `src/management-button-example/` | Management-column row under Upgrades |

- Windows and Linux mods, logs, and launch paths (`~/.config/sandustry` or `%APPDATA%\sandustry`).
- `createLogger` and debug `console.*` lines that also append to `logs/<mod-id>.log` while `npm run dev` runs.
- **Ctrl+R** in the watch terminal forces a hot reload.
- VS Code breakpoints bind through sandkit `new Function` eval (inline maps, `sandkit-workshop://` `sourceURL`, loader line offset).

### Changed

- Framework debug patches (`skip-startup-splash`) merge into the first src folder only, so two mods do not both patch `js/bundle.js`.
- Management-column rows follow vanilla collapse, hover width, and the engine store.

## 2026-08-20

### Added

- Docsify site (`npm run docs`), live UI canvases, and a component gallery.
- The build compiles only the Tailwind utilities the bundle uses and injects a `<style>` tag.
- Hot reload from the `npm run dev` SSE notify (dispose, then eval `main.js`).
- F3 and a management **Debug** row open the engine Debug window.
- Typed `mod.ts` for the manifest and [patches](patches.md).
- Shared kit renamed to **modkit** (`@modkit/*`).

### Changed

- Debug schema merges at build time. Release builds stub `./debug`.
- Sandkit is imported from `@modkit/sandkit`, not from ambient globals.

## 2026-08-19

### Added

- First template: TypeScript entry, Example overlay, retro console helper, debug boot (DevTools, splash skip, main-menu Continue), and Sandkit API types.
