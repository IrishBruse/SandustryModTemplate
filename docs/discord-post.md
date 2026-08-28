TypeScript template for Sandustry mods on Steam **[mods]** beta (game **0.5.5**).

**Repo:** https://github.com/sandustry-modding/SandustryModTemplate
**Docs:** https://sandustry-modding.github.io/SandustryModTemplate/#/
**Types:** https://sandustry-modding.github.io/SandustryTypes/#/
**Sandkit API:** https://sandustry.com/sandkit.html

## Quick start

Node 24. See Docs for the full guide.

```
git clone https://github.com/sandustry-modding/SandustryModTemplate.git <project-name>
cd <project-name>
npm install
npm run setup
npm run dev
```

1. **F5** in VS Code, or `npm run sandustry`.
2. Edit `src/template/modinfo.ts`, then copy the folder for a second mod.

# Features

**TypeScript:** Split mods across files in `src/<mod-name>/`; esbuild bundles to `main.js`.

**React HUD:** JSX overlays via the UI kit (`sandkit.react`).

**Tailwind:** Build injects only the utility classes your bundle uses.

**Hot reload:** `npm run dev` + **Watch local mods** reloads renderer code. Restart for workers and patches. Debug builds add F12 DevTools and auto-load save (`src/hot-reload`; not published).

**Typed `modinfo.ts`:** Manifest and patches in one file per mod folder.

**VS Code:** **F5** launches the game (Linux/Windows). Keep `npm run dev` running.
