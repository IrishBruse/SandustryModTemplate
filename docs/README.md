# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/).

## Features

- **[Multi-mod](layout.md)** — One repo, many mods. Each `src/<name>/` with a `mod.ts` builds to its own game folder.
- **[TypeScript](https://github.com/flamableassassin/sandustry-modding-types ":target=_blank")** — Sandkit API types vendored in `modkit/types/` from `flamableassassin/sandustry-modding-types`.
- **[React HUD](modkit/react.md)** — JSX via `sandkit.react`, plus the [UI kit gallery](ui/README.md).
- **[Hot reload](builds.md)** — `npm run dev` reloads without a game restart.
- **[Debug helpers](modkit/debug.md)** — companion mod: F12 DevTools, splash skip, main-menu boot, F3.
- **[Typed `mod.ts`](layout.md)** — Manifest and [patches](patches.md) in one file per mod.

## Get started

1. Clone the repo, then `npm install` and `npm run setup`.
2. Run `npm run dev`, then **F5** (or `npm run sandustry`).
3. Press **Alt+E** in game for the overlay sample.

Full steps: **[Quick start](quick-start.md)**.

## Commands

| Command                 | Effect                                                                |
| ----------------------- | --------------------------------------------------------------------- |
| `npm run setup`         | Check install, extract game source to `sandustry/`, link `logs/`      |
| `npm run dev`           | Watch OS mods folder; remove owned mods when the watch stops          |
| `npm run build`         | Release bundle (no debug helpers)                                     |
| `npm run build:release` | Release staging to `build/<folder>/` (Workshop assets)                |
| `npm run publish`       | Runs `build:release`, then SteamCMD upload (PATH or `.tmp/steamcmd/`) |
| `npm run typecheck`     | TypeScript check                                                      |
| `npm run test`          | Node tests (`src/**/*.test.ts`)                                       |
| `npm run docs`          | Regenerate API reference (`docs:api`), then serve Docsify on `docs/`    |
| `npm run docs:api`      | Generate `docs/api/` Markdown from `modkit/types/` (TypeDoc)          |
| `npm run sandustry`     | Stop and launch the game (no build)                                   |

Stuck? See [Troubleshooting](troubleshooting.md).
