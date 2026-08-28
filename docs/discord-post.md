TypeScript template for Sandustry mods (Steam **[mods]** branch).

**Repo:** https://github.com/IrishBruse/SandustryModTemplate
**Docs:** https://ethanconneely.com/SandustryModTemplate/

## Quick start

Node 24 installed. Full guide: https://ethanconneely.com/SandustryModTemplate/#/quick-start

```
git clone https://github.com/IrishBruse/SandustryModTemplate.git <project-name>
cd <project-name>
npm install
npm run setup # one time only
npm run dev
```

1. Press **F5** in VS Code, or run `npm run sandustry`.
2. Edit `src/template/` (`modinfo.ts`: `id`, `name`, `author`, `description`). Copy that folder to `src/<your-mod>/` for a second mod.

# Features

**TypeScript:**
Split each mod across files in `src/<mod-name>/`.
esbuild bundles them to one `main.js`.
Sandkit API types: [`@sandustry-modding/types`](https://www.npmjs.com/package/@sandustry-modding/types) · [reference](https://sandustry-modding.github.io/SandustryTypes/#/).

**React HUD:**
Write JSX overlays with the UI kit.
Runtime React comes from `sandkit.react`.

**Tailwind:**
The game CSS is purged, so extra classes have no rules. The build compiles only the utilities your bundle uses and injects a `<style>` tag.

**Watch rebuild:**
Run `npm run dev`. Save a file. Restart the game to load the new bundle.

**Debug helpers:**
Debug builds install the **hot-reload** companion (`src/hot-reload`). It adds F12 DevTools, auto-load save, and console globals. `npm run build` stages that mod; `npm run publish` does not list it.

**Typed `modinfo.ts`:**
One file per mod for the manifest and patches. Each `src/<mod-name>/` folder with a `modinfo.ts` is a separate game mod.

**VS Code launch and debugger:**
Press **F5** to stop and launch the game (Linux and Windows).
Keep `npm run dev` running.

Questions and feedback are welcome.
