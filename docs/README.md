# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/).

## Features

- **[Multi-mod](layout.md)** — One repo, many mods. Each `src/<name>/` or `examples/<name>/` with a `mod.ts` builds to its own game folder.
- **[TypeScript](modkit/types/README.md)** — Sandkit API types in `modkit/types/`.
- **[React HUD](modkit/react.md)** — JSX via `sandkit.react`, plus the [UI kit gallery](ui/README.md).
- **[Watch rebuild](builds.md)** — `npm run dev` writes `main.js`. Restart the game to load it.
- **[Debug helpers](modkit/debug.md)** — companion mod: F12 DevTools, auto-load last save, F3.
- **[Typed `mod.ts`](layout.md)** — Manifest and [patches](patches.md) in one file per mod.

## Get started

1. Clone, then `npm install` and `npm run setup`.
2. Run `npm run dev`, then **F5** (or `npm run sandustry`).
3. Press **Alt+E** in game.

**Windows:** if setup cannot find the game, set `SANDUSTRY` (see [Troubleshooting](troubleshooting.md)).

Full steps: **[Quick start](quick-start.md)**.

## Commands

| Command             | Effect                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| `npm run setup`     | Check install, extract game source to `sandustry/`, link `dist/` and `logs/` |
| `npm run dev`       | Watch all src/ mods; remove owned mods when the watch stops                  |
| `npm run dev:pick`  | Same as `dev`, with a TTY picker first                                       |
| `npm run build`     | Release all src/ mods to `build/<modinfo.id>/` (Workshop staging)            |
| `npm run publish`   | Runs `npm run build`, then SteamCMD upload (dedicated OS cache)              |
| `npm run typecheck` | TypeScript check                                                             |
| `npm run test`      | Node tests (`src/**/*.test.ts`)                                              |
| `npm run docs`      | Regenerate API reference (`docs:api`), then serve Docsify on `docs/`         |
| `npm run docs:api`  | Generate `docs/api/` Markdown from `modkit/types/` (TypeDoc)                 |
| `npm run sandustry` | Stop and launch the game (no build)                                          |

Stuck? See [Troubleshooting](troubleshooting.md).
