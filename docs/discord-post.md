TypeScript template for Sandustry mods (Steam **[mods]** branch).

**Repo:** https://github.com/IrishBruse/SandustryModTemplate
**Docs:** https://ethanconneely.com/SandustryModTemplate/
**Full changelog:** https://ethanconneely.com/SandustryModTemplate/Changelog

# What's new (2026-08-22)

- **`npm run setup`** extracts game source to `sandustry/` and links `logs/` (replaces `npm run references`; no Workshop copies)
- Mod npm deps live in `src/<name>/package.json` (root `npm install` installs them too)
- Build writes `workshop.json` from `publishedFileId` in `mod.ts`; `preview.png` still copies when present (Workshop)
- **`npm run sandustry`** only launches (no build) — keep `npm run dev` for the bundle
- Stopping `npm run dev` removes owned OS mod folders (use `npm run build` to keep them)
- Hot reload works with **F5** (file poll; CDP attach can stall EventSource)
- Hot reload clears `logs/<mod-id>.log` and the DevTools console for a clean session
- Management menu rows: hover / click match vanilla (no nested spacer wrap)
- Sandkit types nest under `types/src/sandkit/` (`api` / `engine` / `enums`) — no `modkit/types` shim
- Use free `sandkit` (ambient types) — no `@modkit/sandkit` import
- Worker API example mod probes worker-thread `sandkit.api` (`worker.ts` → `worker.js`)
- **Selection Capture** (`src/selection-capture/`): **C** marquee, then **F7** panel for PNG / GIF (default 60 frames, 2×); **Greenscreen** on the panel; sample mods ship a short `README.md` in the installed folder

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
Sandkit API types come from the `types/` submodule.

**React HUD:**
Write JSX overlays with the UI kit.
Runtime React comes from `sandkit.react`.

**Tailwind:**
The game CSS is purged, so extra classes have no rules. The build compiles only the utilities your bundle uses and injects a `<style>` tag.

**Hot reload:**
Run `npm run dev`. Save a file. The mod reloads in game with no restart.
It also notifies of any changes that cant be hotreloaded with a notification at the top of the screen.

**Debug helpers:**
Debug builds add F12 DevTools, splash skip, main-menu boot, F3 engine Debug, and console globals. `npm run build` stubs these out for release.

**Typed `mod.ts`:**
One file per mod for the manifest and patches. Each `src/<mod-name>/` folder with a `mod.ts` is a separate game mod.

**VS Code launch and debugger:**
Press **F5** to stop and launch the game (Linux and Windows).
Keep `npm run dev` running.

## Quick start

Node 24 installed.

```
git clone --recursive https://github.com/IrishBruse/SandustryModTemplate.git <project-name>
cd <project-name>
npm install
```

Set `id`, `name`, `author`, and `description` in `src/example/mod.ts`.

1. Run `npm run dev` (this build the mods and watches for changes).
2. Press **F5** in VS Code, or run `npm run sandustry`.
3. Sandustry will launch and quickly skip past the splash and
   autoamtically press the continue button for your last save to start testing.

Questions and feedback are welcome.
