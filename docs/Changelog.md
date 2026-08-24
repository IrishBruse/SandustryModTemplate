# Changelog

The template has no release tags yet. Dated sections match the day the change landed on `main`.

## Unreleased

### Changed

- **Mod layout:** a mod root keeps only `mod.ts`, `main.ts`, and optional `worker.ts` as TypeScript. Other source files live in feature folders. See [layout.md](layout.md).
- **Survival Mode:** vanilla **Sprint Boost** (Shift burst and meter) is off. **Shift** is a hold sprint on the ground (1.6× walk speed). See [`src/survival-mode/`](../src/survival-mode/).
- **Survival Mode:** fire deals 6 and lava deals 12 every 400 ms while overlapping. See [`src/survival-mode/`](../src/survival-mode/).

### Fixed

- **Survival Mode:** fire and lava keep dealing damage while you stand still. Ticks run on `frame:render` with a cooldown, not only on `player:moved`. See [`src/survival-mode/`](../src/survival-mode/).
- **Survival Mode:** hold **Shift** now speeds up walk. The SprintBoost binding is `Shift`; session keys use `ShiftLeft` / `ShiftRight`. See [`src/survival-mode/`](../src/survival-mode/).

- **`@modkit/debug`:** Release builds no longer stub `onDispose` to a no-op. Hot reload can run disposers from release `main.js` when the debug companion is installed. See [modkit/debug.md](modkit/debug.md).
- **Debug companion:** **Auto-load save** runs once per browser session on initial boot only. Exit to the main menu no longer forces you back into the save. Hot reload still skips auto-load. See [modkit/debug.md](modkit/debug.md).
- **Sandkit API types:** `modkit/types/` is described as normal template types, not vendored copies from sandustry-modding-types. `npm run setup` checks for `modkit/types/` declarations without upstream wording.
- **`dist/`:** `npm run setup` links `dist/` to the OS Sandustry mods folder. Debug builds no longer create per-mod `dist/<folder>/` links on each rebuild. `npm run dev` still removes template-built mod folders when the watch stops; the `dist/` link stays. See [layout.md](layout.md) and [builds.md](builds.md).
- **Console inject:** All builds prefix bare `console.*` with `[modId]`. POST to the watch log server (`logs/<mod-id>.log`) stays debug-only. See [builds.md](builds.md) and [modkit/debug.md](modkit/debug.md).
- **`npm run build`:** Writes the OS mods folder and copies each mod to `build/<folder>/` for Workshop staging. `npm run build:release` is removed; `npm run publish` runs `npm run build`. See [builds.md](builds.md).
- **Sample mods** moved from `src/*-example/` to [`examples/`](examples/README.md) without the `-example` suffix (`hello-world`, `overlay-hotkey`, …). `src/` keeps shipped mods (`selection-capture`, `debug`). Copy an example into `src/<your-mod>/` to start a new mod. See [layout.md](layout.md).
- **Debug companion:** loader patches on `js/external-mod-runtime.js` share an atomic group. A miss toasts after boot. `patches.json` / `modinfo.json` / worker changes toast **restart the game** and keep that toast across a page reload. `loadOrder` is `-2147483648`. Free `reloaded` comes from the loader patch only (no esbuild `void reloaded`). See [modkit/debug.md](modkit/debug.md).
- **Example mods** grouped under `examples/ui/`, `examples/content/`, `examples/api/`, and `examples/games/`. [`hello-world`](examples/hello-world/) stays at the top level. Folder names omit `-example`; `modinfo.id` keeps it (for example `author.hello-world-example`).

### Added

- **Survival Mode:** **H** restores health to 100 (debug). Rebind under **Options → Controls**. See [`src/survival-mode/`](../src/survival-mode/).
- **Survival Mode:** fire, flame, and lava now damage the player. The player sprite tints orange or red while touching a hazard. See [`src/survival-mode/`](../src/survival-mode/) and [player sprite tint](player-sprite-tint.md).
- **`npm run dev` mod picker:** In a TTY, choose **All mods** or filter and multi-select folders before the watch starts. Repeat `--mod` on the CLI for several mods without the picker.
- **`custom-element`:** register a powder element, paint at the mouse cell with **P**, and unlock it in the codex. See [`examples/custom-element/`](../examples/custom-element/).
- **`input-binding`:** `registerBinding`, `getDisplayKey`, and a small overlay that reflects rebinding in settings. See [`examples/input-binding/`](../examples/input-binding/).
- **`events`:** subscribe to `game:ready` and `frame:render`, and unsubscribe through `onDispose` on hot reload. See [`examples/events/`](../examples/events/).
- **`mod-assets`:** ship files under `mod/` and load them with `assets.getUrl`. See [`examples/mod-assets/`](../examples/mod-assets/).
- **`content-machine`:** input and output elements, a custom structure, and `addProcessor` conversion loop. See [`examples/content-machine/`](../examples/content-machine/).
- **Debug companion:** watches **local** mods (not Workshop) and hot-evals `main.js` when the mod has `onDispose` or auto-tracked `api.ui.inject`. Settings: **Watch local mods**, **If hot reload cannot run** (off / toast / reload page). Loader patches on `js/external-mod-runtime.js` define `reloaded` and publish a local-mod registry. `patches.json` / `modinfo.json` / worker still require a game restart. See [modkit/debug.md](modkit/debug.md).
- **Debug companion:** **Start save** is Last played or Mod storage in Options. A companion panel lists local saves and writes `api.storage`. Auto-load boots that world with `?db_load=`. See [modkit/debug.md](modkit/debug.md).
- **`settings`:** sample mod that shows every game-supported `configSchema` field type (`boolean`, `number`, `choice`) and reacts with `settings.onChange`. See [modkit/config-schema.md](modkit/config-schema.md) and [`examples/settings/`](../examples/settings/).
- **`npm run docs:api`:** generates a Sandkit API Markdown reference under `docs/api/` from vendored `modkit/types/` JSDoc (TypeDoc). `npm run docs` runs this, then serves Docsify. See [modkit/types/README.md](../modkit/types/README.md).
- **`npm run test`:** Node test runner on `src/**/*.test.ts` (type stripping on Node 24). Selection Capture tests the 1 MB GIF encode cap. `OptionsPanel`, `OptionsSection`, `OptionsRow`, `OptionsSelect`, `OptionsSlider`, `OptionsSliderRow`, `OptionsSwitch`, `OptionsNumberInput`, and `OptionsButton` — same Tailwind classes as the in-game Options dialog. Import `@modkit/ui/options.css` only for slider thumb/track. See [ui/overview.md](ui/overview.md).
- **`npm run build:release`:** release-builds mods into `build/<folder>/` (gitignored), separate from `dist/` and the OS mods folder. Staging is the release bundle plus `workshop.json` / previews only (no `README.md`, `CHANGELOG.md`, or `screenshots/`). `npm run publish` runs this, then uploads with SteamCMD. See [builds.md](builds.md#workshop-publish).
- **Pixel-perfect Screenshot and GIF recorder:** panel **Show mouse** toggle draws the in-game cursor into PNG/GIF captures; **Greenscreen** / **Show mouse** use pill toggles; **Frames** / **Ticks / frame** use number boxes with a white up/down strip; **Record GIF** / **Screenshot** show bound keys when set. **Record GIF** clears the **C** marquee when recording starts so you can keep playing. GIF encode runs on a worker after capture so the game does not hitch. **0.4.0** adds panel **1 MB limit** so a GIF stays at or under 1 MiB for Steam Workshop thumbnails.

### Removed

- Watch HTTP hot-reload notify (`GET /hot-reload/last` and **Ctrl+R** in the `npm run dev` TTY). The debug companion polls local files instead. `npm run dev` still starts `scripts/dev/log-server.js` for `POST /log`. See [modkit/debug.md](modkit/debug.md).
- Debug companion bundle patch `mod-settings-start-save`. Choice fields cannot list live saves. The Start save panel writes `api.storage` instead. See [modkit/debug.md](modkit/debug.md).
- Debug companion bundle patch `options-debug-tab`. The companion no longer shows the vanilla Options **Debug** tab. Use **Engine debug** and **F3** instead. See [modkit/debug.md](modkit/debug.md).

### Changed

- Watch extra `watchDirs` cover only static `mod/` copies. Imported `modkit/` files are already in the esbuild graph. The watch writes bundles; the debug companion polls those files for hot reload. See [builds.md](builds.md).
- **Debug companion:** source layout — `mod.ts`, `main.ts`, and `patches.ts` at `src/debug/`; other files under `boot/`, `reload/`, and `f3/`. See [modkit/debug.md](modkit/debug.md).
- **Debug companion:** game-file patches live in [`src/debug/patches.ts`](../src/debug/patches.ts) (re-exported from `mod.ts`). See [modkit/debug.md](modkit/debug.md).
- **`@modkit/debug`** exports `onDispose` only. Re-eval and file poll live in `src/debug/reload/`. Loader rewrites live in `src/debug/patches.ts`. See [modkit/debug.md](modkit/debug.md).
- **Debug companion:** `loadOrder` is `-2147483648` so the companion runs before other local mods. See [modkit/debug.md](modkit/debug.md).
- **Debug companion:** local-mod hot reload no longer needs esbuild inject in each bundle. Subscribe to the companion on the Workshop (this template still installs a local copy on debug builds). It watches **local** folders only, not other Workshop items. See [modkit/debug.md](modkit/debug.md).
- **Debug companion:** **Auto-load save** (default on) replaces splash skip and main-menu Continue clicking. **Start save** in Options chooses Last played or Mod storage. Pick a world in the Start save panel. Legacy `autoBoot` prefs still apply until you set `autoLoad`. See [modkit/debug.md](modkit/debug.md).
- **`configSchema` types** in `modkit/modinfo.ts` match the game validator: `boolean`, `number`, and `choice` (with `{ value, labelKey }` options). Removed incorrect `string` and `enum` field types. See [modkit/config-schema.md](modkit/config-schema.md).
- **`modkit/types/`:** vendored `.d.ts` files from [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types) (MIT). Layout mirrors the live `sandkit` object (`sandkit/api`, `sandkit/engine/api`, `worker/`, …). See [`modkit/types/ATTRIBUTION.md`](../modkit/types/ATTRIBUTION.md). Ambient `sandkit` is in [`modkit/types/global.d.ts`](../modkit/types/global.d.ts); template-only `reloaded` and `WorkerSandkitApi` are in [`modkit/ambient.d.ts`](../modkit/ambient.d.ts).
- **`npm run publish`:** if SteamCMD is not on PATH, the script downloads Valve's official installer into `.tmp/steamcmd/` and then uploads. It does not add the npm `steamcmd` package (old `request` / `unzip` deps, and that API is game download, not Workshop). See [builds.md](builds.md#workshop-publish).
- `OptionsPanel` with **`overlay`** and **`surface`** uses a solid `bg-black` fill and the vanilla Debug window edges (`border-gray-700`, `rounded-lg`, `ui-box`, `card-2`). See [ui/options-panel.md](ui/options-panel.md).
- Main bundles skip the entry body when the mod **`enabled`** setting is false. Do not put an `enabled` guard in `main.ts`. See [modkit/utils.md](modkit/utils.md).
- `defineModInfo` returns the manifest only. Export `modinfo` and use `modinfo.id` (no separate `MOD_ID`). See [layout.md](layout.md).
- Debug `console.*` inject prefixes DevTools output with `[modinfo.id]`. Do not add that tag in call sites. See [modkit/debug.md](modkit/debug.md).

### Fixed

- Options UI components load from `modkit/ui/options/index.ts`. A `./options` import resolved to `options.css`, so `OptionsPanel` was missing and the capture panel did not render. See [ui/overview.md](ui/overview.md).
- VS Code **Sandustry** F5 is a Node launch of the game process (renderer attach starts when CDP is ready). Debugger **Restart** kills Electron and starts a new process, then the renderer reconnects. A Chrome page reload does not reload workers or patches. See [builds.md](builds.md).
- `@modkit/ui/options.css` is inlined into `main.js` at build time (same as Tailwind). Mod folders no longer get a stray `main.css` that Sandkit does not load. The resolve plugin prevents an empty `{}` options import.
- Watch rebuilds when files under the mod folder or `modkit/` change (`mod.ts`, new files, kit edits), and Tailwind no longer calls `rebuild()` from inside `onEnd` (that dropped the next save). See [builds.md](builds.md).
- Watch hot reload notifies after a Tailwind CSS rebuild, names the rebuilt mod, and reloads even when the game still serves a stale `main.js`. **Ctrl+R** is no longer required after a save. See [modkit/debug.md](modkit/debug.md).
- Hot reload stops when a mod folder is gone (rename / watch cleanup) so DevTools does not keep logging `ERR_FILE_NOT_FOUND` for that mod's `main.js`. See [modkit/debug.md](modkit/debug.md).

### Changed

- Free **`reloaded`** comes from the debug companion loader patch. Do not call `installHotReload` in `main.ts`. Import `onDispose` only when you need cleanup. See [modkit/debug.md](modkit/debug.md).

### Removed

- Debug companion splash click poll (`splash.ts`) and main-menu Continue click helpers (`menu.ts`). Use **Auto-load save** + **Start save** in Options → Mods instead.
- F3 Debug companion panel (`DebugPanel.tsx`). **Start save** moved to Options → Mods via bundle patch.
- **Types git submodule** — `modkit/types/` is now vendored declarations only (no `git submodule update`). Credit and upstream link: [`modkit/types/ATTRIBUTION.md`](../modkit/types/ATTRIBUTION.md). Removed [`modkit/sandkit-global.d.ts`](../modkit/sandkit-global.d.ts).
- Per-mod `globals.ts` and `debug.ts` are gone. `defineModInfo` returns the manifest as `modinfo`; use `modinfo.id`. Import hot reload from `@modkit/debug` (release stubs that package). See [modkit/debug.md](modkit/debug.md) and [layout.md](layout.md).
- F5 no longer attaches Electron **main** (`:9230`) or launches with `--inspect`. The **Sandustry** compound attaches the **renderer** only (`:9222`).
- Per-mod `ide-debug.json` and `SANDUSTRY_IDE_DEBUG` are gone. Keep **Open DevTools on load** off under F5 so Electron DevTools does not steal the IDE session.

### Changed

- Sample mod folder renamed: `src/hello-toast-example/` → `src/hello-world-example/` (id `author.hello-world-example`). Remove any leftover game folder named **Hello Toast Example** after the next build.
- F5 waits until CDP `:9222` responds before attach, and records the game PID so **sandustry:stop** / the next F5 preLaunch can kill a stuck session without a full IDE close. See [builds.md](builds.md) and [troubleshooting.md](troubleshooting.md).
- **Debug companion:** **F3** toggles a top-left companion **Debug** panel (helper status). Vanilla Debug / Stats buttons stay for engine tools; the old custom management **Debug** row is gone. See [modkit/debug.md](modkit/debug.md).
- Shared Tailwind entry is [`modkit/ui/tailwind.css`](../modkit/ui/tailwind.css). Overlay mods import `@modkit/ui/tailwind.css` instead of a per-mod `ui/tailwind.css` / `ui/css.d.ts`.
- Mods no longer ship empty `patches` exports or `patches/` folders. Add `patches` in `mod.ts` when you need them. See [patches.md](patches.md).
- Dropped `types/api`, `types/worker-api`, `types/sandkit`, and `types/engine` path aliases. Use ambient `sandkit` / `SandkitApi` / `WorkerSandkitApi`, or `@modkit/utils` for Retro Console types. Engine declarations live under `modkit/types/sandkit/engine/`.

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
- **`modkit/internal/`** — debug hot reload (`internal/debug`) and esbuild wiring (`internal/esbuild`: React/JSX aliases, patches stub, debug inject). Mods import `@modkit/debug` and `react`; do not import `modkit/internal/*` paths directly.
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
