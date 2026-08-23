# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/).

## Features

- **Multi-mod** — One repo, many mods. Each `src/<name>/` folder with a `mod.ts` builds to its own game folder. Mods cannot import from each other. [Folder layout](https://ethanconneely.com/SandustryModTemplate/#/layout)
- **Multi-file TypeScript** — Split each mod across `src/<name>/`; [esbuild](https://esbuild.github.io/) bundles it to one `main.js`. Types from [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). [Builds](https://ethanconneely.com/SandustryModTemplate/#/builds) · [layout](https://ethanconneely.com/SandustryModTemplate/#/layout)
- **React HUD** — JSX via `sandkit.react` (no extra React package). [React](https://ethanconneely.com/SandustryModTemplate/#/modkit/react) · [UI kit](https://ethanconneely.com/SandustryModTemplate/#/ui/)
- **Modkit utils** — `safe`, settings, scene checks, retro console. [Utils](https://ethanconneely.com/SandustryModTemplate/#/modkit/utils)
- **Hot reload** — `npm run dev` reloads the mod without a game restart. [Builds](https://ethanconneely.com/SandustryModTemplate/#/builds) · [debug](https://ethanconneely.com/SandustryModTemplate/#/modkit/debug)
- **Debug helpers** — companion mod `src/debug` (F12 DevTools, splash skip, main-menu boot, F3 Debug panel). [Debug](https://ethanconneely.com/SandustryModTemplate/#/modkit/debug)
- **Typed `mod.ts`** — one file per mod for the modinfo and [patches](https://ethanconneely.com/SandustryModTemplate/#/patches). [Folder layout](https://ethanconneely.com/SandustryModTemplate/#/layout)

## Quick start

Node 24 installed.

```bash
git clone --recursive https://github.com/IrishBruse/SandustryModTemplate.git <my-folder>
cd <my-folder>
npm install
npm run setup
npm run dev
```

Then **F5** in VS Code (or `npm run sandustry`). In game, **Alt+E** opens the overlay sample.

Full steps, copy-a-mod, and sample list: [Quick start](https://ethanconneely.com/SandustryModTemplate/#/quick-start). Folder map: [layout](https://ethanconneely.com/SandustryModTemplate/#/layout).

## Commands

| Command                 | Effect                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run setup`         | Check install, extract game source to `sandustry/`, link `logs/`                                                                                        |
| `npm run dev`           | Watch and write to the OS mods folder (`~/.config/...` or `%APPDATA%`)                                                                                  |
| `npm run build`         | Release bundle (no debug helpers)                                                                                                                       |
| `npm run build:release` | Release staging to `build/<folder>/` (Workshop assets; not the OS mods folder)                                                                          |
| `npm run publish`       | Runs `build:release`, then Workshop upload ([SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) on PATH, or a download into `.tmp/steamcmd/`) |
| `npm run typecheck`     | TypeScript check                                                                                                                                        |
| `npm run test`          | Node tests (`src/**/*.test.ts`)                                                                                                                         |
| `npm run sandustry`     | Stop and launch the game (no build)                                                                                                                     |

## Troubleshooting

See [Troubleshooting](https://ethanconneely.com/SandustryModTemplate/#/troubleshooting).
