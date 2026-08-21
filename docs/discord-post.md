TypeScript template for Sandustry mods (Steam **[mods]** branch).

**Repo:** https://github.com/IrishBruse/SandustryModTemplate
**Docs:** https://ethanconneely.com/SandustryModTemplate/
**Changelog:** https://ethanconneely.com/SandustryModTemplate/Changelog

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
