# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/).

## Quick start

Need **Node 24** and Sandustry with the **[mods]** beta.

```bash
git clone https://github.com/IrishBruse/SandustryModTemplate.git
cd SandustryModTemplate
npm install
npm run setup
npm run dev
```

Then **F5** in VS Code (or `npm run sandustry`). In game, look for **Template loaded**. **Alt+E** opens the overlay sample.

More: [Quick start](https://ethanconneely.com/SandustryModTemplate/#/quick-start) · [Troubleshooting](https://ethanconneely.com/SandustryModTemplate/#/troubleshooting)

## Commands

### Setup and game

- **`npm run setup`** — Check install, extract game source to `sandustry/<version>-<branch>/`, link `dist/` and `logs/`
- **`npm run sandustry`** — Stop and launch the game (no build)

### Development

- **`npm run dev`** — Watch all `src/` mods; remove owned mods when the watch stops
- **`npm run dev:release`** — Same watch as `dev`, without debug helpers, sourcemaps, or `hot-reload`. Use to test mods before upload to workshop.
- **`npm run dev:pick`** — Same as `dev`, with a TTY picker first
- **`npm run examples`** — Watch `examples/` mods (optional `--mod <name>`)

### Release

- **`npm run build`** — Release all `src/` mods to `build/<modinfo.id>/` (Workshop staging)
- **`npm run publish`** — Runs `npm run build`, then SteamCMD upload

### Quality

- **`npm run typecheck`** — TypeScript check
- **`npm run test`** — Node tests (`src/**/*.test.ts`, `scripts/**/*.test.js`)
- **`npm run lint`** — Typecheck, oxlint, and format check
- **`npm run lint:fix`** — oxlint `--fix` and oxfmt

### Docs and UI

- **`npm run docs`** — Regenerate API reference (`docs:api`), then serve Docsify on `docs/`
- **`npm run docs:api`** — Generate `docs/api/` from `modkit/types/`
- **`npm run ui:css`** — Compile Tailwind for UI preview canvases
- **`npm run ui:previews`** — Generate UI preview PNGs
