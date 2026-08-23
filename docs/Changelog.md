# Changelog

Notable changes to this template. Newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The template has no release tags yet. Dated sections match the day the change landed on `main`.

## Unreleased

### Added

- **`npm run test`:** Node test runner on `src/**/*.test.ts` (type stripping on Node 24). Selection Capture tests the 1 MB GIF encode cap. `OptionsPanel`, `OptionsSection`, `OptionsRow`, `OptionsSelect`, `OptionsSlider`, `OptionsSliderRow`, `OptionsSwitch`, `OptionsNumberInput`, and `OptionsButton` — same Tailwind classes as the in-game Options dialog. Import `@modkit/ui/options.css` only for slider thumb/track. See [ui/overview.md](ui/overview.md).
- **`npm run build:release`:** release-builds mods into `build/<folder>/` (gitignored), separate from `dist/` and the OS mods folder. Staging is the release bundle plus `workshop.json` / previews only (no `README.md`, `CHANGELOG.md`, or `screenshots/`). `npm run publish` runs this, then uploads with SteamCMD. See [builds.md](builds.md#workshop-publish).
- **Pixel-perfect Screenshot and GIF recorder:** panel **Show mouse** toggle draws the in-game cursor into PNG/GIF captures; **Greenscreen** / **Show mouse** use pill toggles; **Frames** / **Ticks / frame** use number boxes with a white up/down strip; **Record GIF** / **Screenshot** show bound keys when set. **Record GIF** clears the **C** marquee when recording starts so you can keep playing. GIF encode runs on a worker after capture so the game does not hitch. **0.4.0** adds panel **1 MB limit** so a GIF stays at or under 1 MiB for Steam Workshop thumbnails.

### Changed

- **`npm run publish`:** if SteamCMD is not on PATH, the script downloads Valve's official installer into `.tmp/steamcmd/` and then uploads. It does not add the npm `steamcmd` package (old `request` / `unzip` deps, and that API is game download, not Workshop). See [builds.md](builds.md#workshop-publish).
- `OptionsPanel` with **`overlay`** and **`surface`** uses a solid `bg-black` fill and the vanilla Debug window edges (`border-gray-700`, `rounded-lg`, `ui-box`, `card-2`). See [ui/options-panel.md](ui/options-panel.md).
- Main bundles skip the entry body when the mod **`enabled`** setting is false. Do not put an `enabled` guard in `main.ts`. See [modkit/utils.md](modkit/utils.md).
- Ambient `sandkit` / `SandkitApi` / `WorkerSandkitApi` are composed in [`modkit/sandkit-global.d.ts`](../modkit/sandkit-global.d.ts) from the types submodule namespaces (types package stays on master; no shipped global).
- `defineModInfo` returns the manifest only. Export `modinfo` and use `modinfo.id` (no separate `MOD_ID`). See [layout.md](layout.md).
- Debug `console.*` inject prefixes DevTools output with `[modinfo.id]`. Do not add that tag in call sites. See [modkit/debug.md](modkit/debug.md).

### Fixed

- Release `main.js` does not inject hot-reload boot (`installHotReload` / `isHotReloadEval`). Debug builds still inject. Release defines **`reloaded`** as `false`. See [modkit/debug.md](modkit/debug.md).
- Options UI components load from `modkit/ui/options/index.ts`. A `./options` import resolved to `options.css`, so `OptionsPanel` was missing and the capture panel did not render. See [ui/overview.md](ui/overview.md).
- VS Code **Sandustry** F5 is a Node launch of the game process (renderer attach starts when CDP is ready). Debugger **Restart** kills Electron and starts a new process, then the renderer reconnects. A Chrome page reload does not reload workers or patches. See [builds.md](builds.md).
- `@modkit/ui/options.css` is inlined into `main.js` at build time (same as Tailwind). Mod folders no longer get a stray `main.css` that Sandkit does not load. The resolve plugin prevents an empty `{}` options import.
- Watch rebuilds when files under the mod folder or `modkit/` change (`mod.ts`, new files, kit edits), and Tailwind no longer calls `rebuild()` from inside `onEnd` (that dropped the next save). See [builds.md](builds.md).
- Watch hot reload notifies after a Tailwind CSS rebuild, names the rebuilt mod, and reloads even when the game still serves a stale `main.js`. **Ctrl+R** is no longer required after a save. See [modkit/debug.md](modkit/debug.md).
- Hot reload stops when a mod folder is gone (rename / watch cleanup) so DevTools does not keep logging `ERR_FILE_NOT_FOUND` for that mod's `main.js`. See [modkit/debug.md](modkit/debug.md).

### Changed

- Main bundles inject hot reload boot: free **`reloaded`**, no `installHotReload` / `isHotReloadEval` in `main.ts`. Import `onDispose` only when you need cleanup. See [modkit/debug.md](modkit/debug.md).

### Removed

- Per-mod `globals.ts` and `debug.ts` are gone. `defineModInfo` returns the manifest as `modinfo`; use `modinfo.id`. Import hot reload from `@modkit/debug` (release stubs that package). See [modkit/debug.md](modkit/debug.md) and [layout.md](layout.md).
- F5 no longer attaches Electron **main** (`:9230`) or launches with `--inspect`. The **Sandustry** compound attaches the **renderer** only (`:9222`).
- Per-mod `ide-debug.json` and `SANDUSTRY_IDE_DEBUG` are gone. Keep **Open DevTools on load** off under F5 so Electron DevTools does not steal the IDE session.

### Changed

- Sample mod folder renamed: `src/hello-toast-example/` → `src/hello-world-example/` (id `author.hello-world-example`). Remove any leftover game folder named **Hello Toast Example** after the next build.
- F5 waits until CDP `:9222` responds before attach, and records the game PID so **sandustry:stop** / the next F5 preLaunch can kill a stuck session without a full IDE close. See [builds.md](builds.md) and [troubleshooting.md](troubleshooting.md).
- **Debug companion:** **F3** toggles a top-left companion **Debug** panel (helper status). Vanilla Debug / Stats buttons stay for engine tools; the old custom management **Debug** row is gone. See [modkit/debug.md](modkit/debug.md).
- Shared Tailwind entry is [`modkit/ui/tailwind.css`](../modkit/ui/tailwind.css). Overlay mods import `@modkit/ui/tailwind.css` instead of a per-mod `ui/tailwind.css` / `ui/css.d.ts`.
- Mods no longer ship empty `patches` exports or `patches/` folders. Add `patches` in `mod.ts` when you need them. See [patches.md](patches.md).
- Dropped `types/api`, `types/worker-api`, `types/sandkit`, and `types/engine` path aliases. Use ambient `sandkit` / `SandkitApi` / `WorkerSandkitApi`, or `@modkit/utils` for Retro Console types. Engine declarations live under `modkit/types/src/shared/engine/`.

### Added

- **Debug companion:** **Disable autosave** setting (default on). Sets `session.settings.autosaveInterval` to `0` on load and each hot-reload eval so the game does not auto-save during development. Manual saves still work. See [modkit/debug.md](modkit/debug.md).

## 2026-08-22

### Added

- **[Quick start](quick-start.md)** guide: clone, `npm run setup`, `npm run dev`, launch, try samples, copy a mod folder.
- **Dedicated debug mod** (`src/debug/`, game folder **debug**): DevTools on load, F12, splash skip, main-menu auto-boot, and F3 engine Debug. Debug builds (`npm run dev`, `--debug`) install it. Release (`npm run build`) omits it and removes a leftover `mods/debug`. Settings live on that mod only. See [modkit/debug.md](modkit/debug.md).
- **`npm run publish`:** release-builds the target into `.tmp/publish/<folder>/` so `npm run dev` cannot overwrite the upload. Then SteamCMD uploads from that folder. **SteamCMD is required** ([SteamCMD docs](https://developer.valvesoftware.com/wiki/SteamCMD)). Steam change notes come from that mod's `CHANGELOG.md` for `modinfo.version` (or `## Unreleased` if that heading is missing). See [builds.md](builds.md#workshop-publish).
- **Workshop `workshop.json`:** put `workshop/workshop.json` in the mod (with `publishedFileId`). The build copies it to the mod root. Put **`workshop/preview.gif`** (preferred) and **`workshop/preview.png`** in the mod; the build copies them to the mod root too.
- **Hot reload clears logs:** each renderer reload truncates `logs/<mod-id>.log` and clears the DevTools console so the file only holds the current session. `clearLog(modId)` from `@modkit/log` and `POST /log/clear` on the watch server.
- **Selection Capture** (`src/selection-capture/`): after a **C** marquee, **F7** opens the panel to copy a PNG or record a GIF of stepped sim ticks. The folder has `README.md` and `CHANGELOG.md`; the build copies them into the installed mod.
- **Selection Capture** panel: **Greenscreen** (`#00FF00` behind the world).
- **Sample mod READMEs:** each `src/*-example/` folder has a short `README.md`. The build copies it into the installed mod when present.
- **Worker API example** (`src/worker-api-example/`): optional `worker.ts` → `worker.js`, probes worker-thread `sandkit.api` against `types/worker-api` (`WorkerSandkitApi`). Build bundles `worker.ts` when present.
- **Multi-mod.** Each `src/<name>/` folder with a `mod.ts` is a separate game mod. The build writes each mod to its own OS mods folder. `dist/<folder>/` is a per-mod link. `--mod <folder>` builds one mod.
- **Isolation.** Mods cannot import from another `src/` folder. Typecheck uses a per-mod `tsconfig.json`. The bundle fails sibling imports.
- **Sample mods** (copy one to start a new mod):

| Folder                           | Shows                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `src/hello-world-example/`       | Toast on load                                                                    |
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

- Quick start flows (root README, docs home, [Quick start](quick-start.md), [Builds](builds.md)) include **`npm run setup`** after `npm install`. Docs describe its checks (Node, npm installs, types submodule, game binary, asar, **[mods]** beta, `sandkit`) plus extract and `logs/` link. See [troubleshooting](troubleshooting.md).
- **Debug companion defaults:** **Open DevTools on load**, **Skip splash**, and **Auto-boot Continue** default to **off**. Turn them on in the debug mod settings when you want them. See [modkit/debug.md](modkit/debug.md).
- **`modkit/esbuild/`** holds esbuild wiring (React/JSX aliases, console inject, patches stub, release debug stub).
- **Scripts folders** match `npm run` commands (`scripts/build`, `dev`, `typecheck`, `setup`, `publish`, `sandustry`, `ui`). Shared helpers live in `scripts/lib/`. Root `postinstall` runs `scripts/mod-install/install-mod-deps.js` for per-mod `package.json` folders.
- **Types submodule** lives at [`modkit/types/`](../modkit/types/) (was top-level `types/`). Import aliases (`types/api`, `types/worker-api`, `types/engine`) are unchanged.
- **[Folder layout](layout.md)** rewritten for new authors: repo folders as a table (not a code block), required vs optional files, sample copy targets, and where the game stores mods. Tooling (`docs/`, `scripts/`, `sandustry/`) stays off that page.
- Docs home and root README point at the Quick start page instead of a long inline walkthrough.
- **Build / publish staging:** `npm run build` and `npm run dev` copy only `workshop.json` and previews. They also remove leftover `README.md`, `CHANGELOG.md`, and `screenshots/` from the game folder. `npm run publish` adds those files into `.tmp/publish/`. See [builds.md](builds.md#workshop-publish).
- **`npm run publish` confirm** prints the full Steam change-notes text (from that mod's `CHANGELOG.md`) before Upload / Cancel.
- **Types submodule layout:** `types/src/main`, `types/src/worker`, `types/src/engine`. Ambient `sandkit` / `SandkitApi` live in [`modkit/sandkit-global.d.ts`](../modkit/sandkit-global.d.ts). Path aliases `types/api` and `types/worker-api` point at those indexes.
- **Workshop assets** live under `src/<name>/workshop/` (`workshop.json`, `preview.gif`, `preview.png`, `workshop.txt`, `screenshots/`). The build copies `workshop.json` and previews to the mod root. `npm run publish` copies `screenshots/`, `README.md`, and `CHANGELOG.md` into staging. `publishedFileId` is no longer set in `mod.ts`.
- **Pixel-perfect Screenshot and GIF recorder** `0.2.0` (`src/selection-capture/`): player-facing name (was Selection Capture) and Workshop copy. Folder and mod id stay `selection-capture`. Build copies **preview.gif** (preferred) and **preview.png** from `workshop/`.
- **`npm run setup`** (was `npm run references`): validates the local install, extracts game source to top-level `sandustry/`, and links `logs/`. Workshop mod copies under `references/` are removed.
- **Mod npm deps:** optional `src/<name>/package.json` holds packages for that mod only. Root `npm install` (`postinstall`) runs `npm install` in those folders. **Selection Capture** `modern-gif` moved from the repo root into `src/selection-capture/package.json`.
- **`npm run sandustry`** only stops and launches the game. It does not build. Keep `npm run dev` (or `npm run build`) for the bundle. See [builds.md](builds.md).
- **Selection Capture** GIF encode uses **modern-gif** instead of **gifenc** (typed API, same 2× pixel look).
- **`npm run dev` cleanup:** when the watch stops (Ctrl+C, terminal close, or process exit), it removes OS mod folders this template owns and the matching `dist/<folder>` links. Use `npm run build` to leave mods installed. See [builds.md](builds.md).
- **Selection Capture** (`src/selection-capture/`): one mod for **C** marquee capture. **F7** opens the panel for PNG and GIF (default **60** frames). This is not an example folder.
- Sandkit type folders nest under `src/sandkit/` (`api`, `engine`, `enums`, …) to match the live object. Path aliases `types/api`, `types/sandkit`, `types/engine`, and `types/enums` point at `types/src/sandkit/…`.
- `sandkit` is an ambient free variable from `types/src/global.d.ts` (plus ambient `Sandkit` / `SandkitApi` / …). Mod and modkit code use `sandkit` with no import. Removed `@modkit/sandkit`.
- TypeDoc nests `api` / `engine` / `enums` under `sandkit` (disk + live object); `worker` stays a sibling entry.
- Framework debug patches (`skip-startup-splash`) merge into the first src folder only, so two mods do not both patch `js/bundle.js`.
- Management-column rows follow vanilla collapse, hover width, and the engine store.
- Docs home Features list links each title; external Types links open in a new tab with a ↗ mark.
- Sample mod folders use a consistent `*-example` name.

### Fixed

- **SteamCMD hang after Workshop upload:** `npm run publish` no longer inherits the terminal. After a successful upload it sends `quit` and stops SteamCMD if it stays on the `Steam>` prompt.
- **SteamCMD "No cached credentials":** SteamCMD login is separate from the Steam client. On a TTY, publish prompts for password / Steam Guard once, then retries the upload. See [troubleshooting](troubleshooting.md).
- **`--mod` no longer deletes sibling OS mod folders.** Dist links that stay (other src folders still exist) keep their game dirs. Release still removes leftover `mods/debug`.
- **`npm run publish` description:** keep real line breaks. Do not write `\n` into the Steam listing.
- **Selection Capture:** a sync read on `frame:render` ran before Pixi painted, so every GIF frame was the sky fill. The recorder now copies on the first microtask after that event and builds one palette from every frame.
- **Selection Capture GIF:** pause on paint before the crop so large selections do not skip sim ticks.
- **Management menu hover:** mod rows under Upgrades sit as direct siblings of the vanilla column (same as Toolbox / Building). Nested spacer / `pointer-events-none` wraps blocked hover shine, yellow letter, and clicks.
- F5 **Sandustry** compound attaches to Electron main (`:9230`) and the game renderer (`:9222`) instead of debugging the Node launcher script. Renderer attach filters to `index.html` so an open DevTools page does not steal the session.
- F5 / IDE launch writes per-mod `ide-debug.json` so the renderer skips auto-open DevTools (spawn env is not visible in the sandboxed page). Also sets `SANDUSTRY_IDE_DEBUG` on the main process so the renderer does not HTTP-probe `:9222` (that freeze dropped the debugger).
- Hot reload wraps source like sandkit’s loader so indexed source maps stay aligned.
- Watch build removes leftover OS mod folders this template used to own after a rename.
- Splash-skip retries are capped; only the first debug mod injects the shared F3 / management Debug row.

### Removed

- **`npm run mod:install`**. Per-mod `package.json` folders still install via root `postinstall` (`scripts/mod-install/install-mod-deps.js`).
- **Debug splash bundle patch** (`skip-startup-splash`). Splash skip is settings-gated runtime only.
- **`references/`** Workshop mod copies and **`npm run references`**. Use **`npm run setup`** for checks, extracted game source in `sandustry/`, and the `logs/` link.
- **Selection Capture** panel **Scale** control. PNG and GIF are always **2×** nearest-neighbor.
- **Selection Capture** **F8** screenshot hotkey. Copy a PNG with the panel **Screenshot** button.
- **Selection Capture Freeze background** (cinematic `timeSpeed` stub froze the game). **Greenscreen** stays.
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
