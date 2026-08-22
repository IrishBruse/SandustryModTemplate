# Changelog

Notable changes to this template. Newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The template has no release tags yet. Dated sections match the day the change landed on `main`.

## Unreleased

### Added

- **Dedicated debug mod** (`src/debug/`, game folder **debug**): DevTools on load, F12, splash skip, main-menu auto-boot, F3 engine Debug, and the splash bundle patch. Debug builds (`npm run dev`, `--debug`) install it. Release (`npm run build`) omits it and removes a leftover `mods/debug`. Settings live on that mod only. See [modkit/debug.md](modkit/debug.md).
- **`npm run publish`:** release-builds the target into `.tmp/publish/<folder>/` so `npm run dev` cannot overwrite the upload. Then SteamCMD uploads from that folder. **SteamCMD is required** ([SteamCMD docs](https://developer.valvesoftware.com/wiki/SteamCMD)). Steam change notes come from that mod's `CHANGELOG.md` for `modinfo.version` (or `## Unreleased` if that heading is missing). See [builds.md](builds.md#workshop-publish).

### Fixed

- **SteamCMD hang after Workshop upload:** `npm run publish` no longer inherits the terminal. After a successful upload it sends `quit` and stops SteamCMD if it stays on the `Steam>` prompt.
- **`--mod` no longer deletes sibling OS mod folders.** Dist links that stay (other src folders still exist) keep their game dirs. Release still removes leftover `mods/debug`.
- **`npm run publish` description:** keep real line breaks. Do not write `\n` into the Steam listing.

### Changed

- **Types submodule layout:** `types/src/main`, `types/src/worker`, `types/src/engine`. Ambient `sandkit` / `SandkitApi` live in [`modkit/sandkit-global.d.ts`](../modkit/sandkit-global.d.ts). Path aliases `types/api` and `types/worker-api` point at those indexes.
- **Workshop assets** live under `src/<name>/workshop/` (`workshop.json`, `preview.gif`, `preview.png`, `workshop.txt`, `screenshots/`). The build copies `workshop.json` and previews to the mod root. `npm run publish` copies `screenshots/` into the uploaded item. `publishedFileId` is no longer set in `mod.ts`.
- **Pixel-perfect Screenshot and GIF recorder** `0.2.0` (`src/selection-capture/`): player-facing name (was Selection Capture) and Workshop copy. Folder and mod id stay `selection-capture`. Build copies **preview.gif** (preferred) and **preview.png** from `workshop/`.
- **`npm run setup`** (was `npm run references`): extracts game source to top-level `sandustry/` and links `logs/`. Workshop mod copies under `references/` are removed.
- **Mod npm deps:** optional `src/<name>/package.json` holds packages for that mod only. Root `npm install` and `npm run mod:install` run `npm install` in those folders. **Selection Capture** `modern-gif` moved from the repo root into `src/selection-capture/package.json`.
- **`npm run sandustry`** only stops and launches the game. It does not build. Keep `npm run dev` (or `npm run build`) for the bundle. See [builds.md](builds.md).
- **Selection Capture** GIF encode uses **modern-gif** instead of **gifenc** (typed API, same 2× pixel look).
- **`npm run dev` cleanup:** when the watch stops (Ctrl+C, terminal close, or process exit), it removes OS mod folders this template owns and the matching `dist/<folder>` links. Use `npm run build` to leave mods installed. See [builds.md](builds.md).
- **Selection Capture** (`src/selection-capture/`): one mod for **C** marquee capture. **F7** opens the panel for PNG and GIF (default **60** frames). This is not an example folder.

### Removed

- **`references/`** Workshop mod copies and **`npm run references`**. Use **`npm run setup`** for extracted game source in `sandustry/` only.
- **Selection Capture** panel **Scale** control. PNG and GIF are always **2×** nearest-neighbor.
- **Selection Capture** **F8** screenshot hotkey. Copy a PNG with the panel **Screenshot** button.
- **Selection Capture Freeze background** (cinematic `timeSpeed` stub froze the game). **Greenscreen** stays.

### Fixed

- **Selection Capture:** a sync read on `frame:render` ran before Pixi painted, so every GIF frame was the sky fill. The recorder now copies on the first microtask after that event and builds one palette from every frame.
- **Selection Capture GIF:** pause on paint before the crop so large selections do not skip sim ticks.
- **Management menu hover:** mod rows under Upgrades sit as direct siblings of the vanilla column (same as Toolbox / Building). Nested spacer / `pointer-events-none` wraps blocked hover shine, yellow letter, and clicks.

### Added

- **Workshop `workshop.json`:** put `workshop/workshop.json` in the mod (with `publishedFileId`). The build copies it to the mod root. Put **`workshop/preview.gif`** (preferred) and **`workshop/preview.png`** in the mod; the build copies them to the mod root too.
- **Hot reload clears logs:** each renderer reload truncates `logs/<mod-id>.log` and clears the DevTools console so the file only holds the current session. `clearLog(modId)` from `@modkit/log` and `POST /log/clear` on the watch server.
- **Selection Capture** (`src/selection-capture/`): after a **C** marquee, **F7** opens the panel to copy a PNG or record a GIF of stepped sim ticks. The folder has `README.md` and `CHANGELOG.md`; the build copies them into the installed mod.
- **Selection Capture** panel: **Greenscreen** (`#00FF00` behind the world).
- **Sample mod READMEs:** each `src/*-example/` folder has a short `README.md`. The build copies it into the installed mod when present.
- **Worker API example** (`src/worker-api-example/`): optional `worker.ts` → `worker.js`, probes worker-thread `sandkit.api` against `types/worker-api` (`WorkerSandkitApi`). Build bundles `worker.ts` when present.

### Changed

- Sandkit type folders nest under `src/sandkit/` (`api`, `engine`, `enums`, …) to match the live object. Path aliases `types/api`, `types/sandkit`, `types/engine`, and `types/enums` point at `types/src/sandkit/…`.
- `sandkit` is an ambient free variable from `types/src/global.d.ts` (plus ambient `Sandkit` / `SandkitApi` / …). Mod and modkit code use `sandkit` with no import. Removed `@modkit/sandkit`.
- TypeDoc nests `api` / `engine` / `enums` under `sandkit` (disk + live object); `worker` stays a sibling entry.

### Added

- **Multi-mod.** Each `src/<name>/` folder with a `mod.ts` is a separate game mod. The build writes each mod to its own OS mods folder. `dist/<folder>/` is a per-mod link. `--mod <folder>` builds one mod.
- **Isolation.** Mods cannot import from another `src/` folder. Typecheck uses a per-mod `tsconfig.json`. The bundle fails sibling imports.
- **Sample mods** (copy one to start a new mod):

| Folder                           | Shows                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `src/hello-toast-example/`       | Toast on load                                                                    |
| `src/overlay-hotkey-example/`    | React overlay + Tailwind; **Alt+E**                                              |
| `src/retro-game-example/`        | Retro Console Noise Test                                                         |
| `src/management-button-example/` | Management-column row under Upgrades                                             |
| `src/worker-api-example/`        | Worker-thread `sandkit.api` probe                                                |
| `src/selection-capture/`         | **Pixel-perfect Screenshot and GIF recorder** — **C** marquee → **F7** PNG / GIF |

- Windows and Linux mods, logs, and launch paths (`~/.config/sandustry` or `%APPDATA%\sandustry`).
- `createLogger` and debug `console.*` lines that also append to `logs/<mod-id>.log` while `npm run dev` runs.
- **Ctrl+R** in the watch terminal forces a hot reload.
- VS Code breakpoints bind through sandkit `new Function` eval (inline maps, `sandkit-workshop://` `sourceURL`, loader line offset).
- Docs [Changelog](Changelog.md), nested [UI kit](ui/README.md) sidebar, and a Discord announcement draft.
- Cursor [chrome-devtools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) config aimed at CDP `:9222`.

### Changed

- Framework debug patches (`skip-startup-splash`) merge into the first src folder only, so two mods do not both patch `js/bundle.js`.
- Management-column rows follow vanilla collapse, hover width, and the engine store.
- Docs home Features list links each title; external Types links open in a new tab with a ↗ mark.
- Sample mod folders use a consistent `*-example` name.

### Fixed

- F5 **Sandustry** compound attaches to Electron main (`:9230`) and the game renderer (`:9222`) instead of debugging the Node launcher script. Renderer attach filters to `index.html` so an open DevTools page does not steal the session.
- F5 / IDE launch writes per-mod `ide-debug.json` so the renderer skips auto-open DevTools (spawn env is not visible in the sandboxed page). Also sets `SANDUSTRY_IDE_DEBUG` on the main process so the renderer does not HTTP-probe `:9222` (that freeze dropped the debugger).
- Hot reload wraps source like sandkit’s loader so indexed source maps stay aligned.
- Watch build removes leftover OS mod folders this template used to own after a rename.
- Splash-skip retries are capped; only the first debug mod injects the shared F3 / management Debug row.

### Removed

- Obsolete `scripts/api` type-generation path (types stay in the `types/` submodule).

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
- Sandkit is an ambient free variable (`types/src/global.d.ts`), not an `@modkit/sandkit` import.

## 2026-08-19

### Added

- First template: TypeScript entry, Example overlay, retro console helper, debug boot (DevTools, splash skip, main-menu Continue), and Sandkit API types.
