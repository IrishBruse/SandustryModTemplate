# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/).

## Features

- **[Multi-mod](layout.md)** — One repo, many mods. Each `src/<name>/` or `examples/<name>/` with a `modinfo.ts` builds to its own game folder.
- **[TypeScript](modkit/types/README.md)** — Sandkit API types in `modkit/types/`.
- **[React HUD](modkit/react.md)** — JSX via `sandkit.react`, plus the [UI kit gallery](ui/README.md).
- **[Watch rebuild](builds.md)** — `npm run dev` writes `main.js`. The hot-reload companion re-evals the renderer bundle.
- **[Hot Reload](hot-reload/)** — companion mod: F12 DevTools, auto-load last save, F3, in-game `main.js` reload.
- **[Typed `modinfo.ts`](modinfo.md)** — Manifest fields. Optional [patches](patches.md) from the same folder.

## Get started

1. Clone, then `npm install` and `npm run setup`.
2. Run `npm run dev`, then **F5** (or `npm run sandustry`).
3. Look for **Template loaded**, or press **Alt+E**.

**Windows:** if setup cannot find the game, set `SANDUSTRY` (see [Troubleshooting](troubleshooting.md)).

Full steps: **[Quick start](quick-start.md)**.

## Commands

### Setup and game

- **`npm run setup`** — Check install, extract game source to `sandustry/<version>-<branch>/`, link `dist/` and `logs/`
- **`npm run sandustry`** — Stop and launch the game (no build)

### Development

- **`npm run dev`** — Watch all `src/` mods; remove owned mods when the watch stops
- **`npm run dev:release`** — Same watch as `dev`, without debug helpers, sourcemaps, or `hot-reload`
- **`npm run dev:pick`** — Same as `dev`, with a TTY picker first
- **`npm run examples`** — Watch `examples/` mods (optional `--mod <name>`)

### Release

- **`npm run build`** — Release all `src/` mods to `build/<modinfo.id>/` (Workshop staging)
- **`npm run publish`** — Runs `npm run build`, then SteamCMD upload (dedicated OS cache)

### Quality

- **`npm run typecheck`** — TypeScript check
- **`npm run test`** — Node tests (`src/**/*.test.ts`, `modkit/**/*.test.ts`, `scripts/**/*.test.js`). Isolated host; headless on Windows.
- **`npm run test:integration`** — Same tests with a visible Sandustry window (CDP `:9223`)
- **`npm run lint`** — Typecheck, oxlint, and format check
- **`npm run lint:fix`** — oxlint `--fix` and oxfmt

### Docs and UI

- **`npm run docs`** — Regenerate API reference (`docs:api`), then serve Docsify on `docs/`
- **`npm run docs:api`** — Generate `docs/api/` Markdown from `modkit/types/` (TypeDoc)
- **`npm run ui:css`** — Compile Tailwind for UI preview canvases
- **`npm run ui:previews`** — Generate UI preview PNGs

Stuck? See [Troubleshooting](troubleshooting.md).
