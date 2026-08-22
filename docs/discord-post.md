TypeScript template for Sandustry mods (Steam **[mods]** branch).

**Repo:** https://github.com/IrishBruse/SandustryModTemplate
**Docs:** https://ethanconneely.com/SandustryModTemplate/
**Full changelog:** https://ethanconneely.com/SandustryModTemplate/Changelog

# What's new (2026-08-22)

- **Docs:** [Quick start](https://ethanconneely.com/SandustryModTemplate/#/quick-start) guide; [Folder layout](https://ethanconneely.com/SandustryModTemplate/#/layout) uses tables and beginner copy
- **`modkit/esbuild/`** for React/JSX aliases, console inject, and release stubs
- **Scripts folders** match `npm run` commands; shared helpers in `scripts/lib/`
- **Types submodule** moved to `modkit/types/` (import aliases `types/api` etc. unchanged)
- **Dedicated debug mod** (`src/debug`, game folder **debug**): DevTools, splash skip, auto-boot, F3, and splash patch. Debug builds install it; release omits it. Settings live on that mod (not on every example). Each example keeps a one-file `debug.ts` for hot reload.
- **`npm run publish`:** SteamCMD exits after upload (no leftover `Steam>` prompt). Release-builds into `.tmp/publish/<folder>/` so `npm run dev` cannot overwrite it. Change notes come from that mod's `CHANGELOG.md`. Requires [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD).
- Mod npm deps live in `src/<name>/package.json` (root `npm install` installs them too)
- Build copies `workshop/workshop.json` and preview images to the mod root; `npm run publish` also copies `screenshots/`, `README.md`, and `CHANGELOG.md` into `.tmp/publish/`
- **`npm run sandustry`** only launches (no build) — keep `npm run dev` for the bundle
- Stopping `npm run dev` removes owned OS mod folders (use `npm run build` to keep them)
- Hot reload works with **F5** (same HTTP poll to the dev watch server)
- Hot reload clears `logs/<mod-id>.log` and the DevTools console for a clean session
- Management menu rows: hover / click match vanilla (no nested spacer wrap)
- Sandkit types: `modkit/types/src/main`, `modkit/types/src/worker`, `modkit/types/src/engine`; ambient `sandkit` in `modkit/sandkit-global.d.ts`
- Use free `sandkit` (ambient types) — no `@modkit/sandkit` import
- Worker API example mod probes worker-thread `sandkit.api` (`worker.ts` → `worker.js`)
- **Pixel-perfect Screenshot and GIF recorder** `0.2.0` (`src/selection-capture/`): **C** marquee, then **F7** panel for PNG / GIF (default 60 frames, 2×); **Greenscreen** on the panel; Workshop copy in `README.md` / `workshop/workshop.txt`
- Sample mods ship a short `README.md` in the installed folder

# What's new (2026-08-21)

- **Multi-mod:** each `src/<name>/` with a `mod.ts` is its own game mod
- Sample mods: toast, overlay hotkey, retro game, management button
- Windows + Linux mods / logs / launch paths
- Hot reload: **Ctrl+R** in the watch terminal; leftover mod folders cleaned on rename
- F5 debugger attaches to Electron main + game renderer
- File log: `console.*` also goes to `logs/<mod-id>.log` while `npm run dev` runs

# Features

**TypeScript:**
Split each mod across files in `src/<mod-name>/`.
esbuild bundles them to one `main.js`.
Sandkit API types come from the `modkit/types/` submodule.

**React HUD:**
Write JSX overlays with the UI kit.
Runtime React comes from `sandkit.react`.

**Tailwind:**
The game CSS is purged, so extra classes have no rules. The build compiles only the utilities your bundle uses and injects a `<style>` tag.

**Hot reload:**
Run `npm run dev`. Save a file. The mod reloads in game with no restart.
It also notifies of any changes that cant be hotreloaded with a notification at the top of the screen.

**Debug helpers:**
Debug builds install the **debug** companion (`src/debug`). It adds F12 DevTools, splash skip, main-menu boot, F3 engine Debug, and console globals. `npm run build` omits that mod.

**Typed `mod.ts`:**
One file per mod for the manifest and patches. Each `src/<mod-name>/` folder with a `mod.ts` is a separate game mod.

**VS Code launch and debugger:**
Press **F5** to stop and launch the game (Linux and Windows).
Keep `npm run dev` running.

## Quick start

Node 24 installed. Full guide: https://ethanconneely.com/SandustryModTemplate/#/quick-start

```
git clone --recursive https://github.com/IrishBruse/SandustryModTemplate.git <project-name>
cd <project-name>
npm install
npm run dev
```

1. Press **F5** in VS Code, or run `npm run sandustry`.
2. Copy `src/hello-toast-example/` to `src/<your-mod>/` and set `id`, `name`, `author`, and `description` in `mod.ts`.

Questions and feedback are welcome.
