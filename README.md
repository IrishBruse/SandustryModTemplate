# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/).

## Features

- **Multi-mod** — One repo, many mods. Each `src/<name>/` folder with a `mod.ts` builds to its own game folder. Mods cannot import from each other. [Folder layout](https://ethanconneely.com/SandustryModTemplate/#/layout)
- **Multi-file TypeScript** — Split each mod across `src/<name>/`; [esbuild](https://esbuild.github.io/) bundles it to one `main.js`. Types from [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). [Builds](https://ethanconneely.com/SandustryModTemplate/#/builds) · [layout](https://ethanconneely.com/SandustryModTemplate/#/layout)
- **React HUD** — JSX via `sandkit.react` (no extra React package). [React](https://ethanconneely.com/SandustryModTemplate/#/modkit/react) · [UI kit](https://ethanconneely.com/SandustryModTemplate/#/ui/) · [gallery](https://ethanconneely.com/SandustryModTemplate/#/ui/gallery)
- **Modkit utils** — `safe`, settings, scene checks, retro console. [Utils](https://ethanconneely.com/SandustryModTemplate/#/modkit/utils)
- **Hot reload** — `npm run dev` reloads the mod without a game restart. [Builds](https://ethanconneely.com/SandustryModTemplate/#/builds) · [debug](https://ethanconneely.com/SandustryModTemplate/#/modkit/debug)
- **Debug helpers** — companion mod `src/debug` (F12 DevTools, splash skip, main-menu boot, F3 engine Debug). [Debug](https://ethanconneely.com/SandustryModTemplate/#/modkit/debug)
- **Typed `mod.ts`** — one file per mod for the modinfo and [patches](https://ethanconneely.com/SandustryModTemplate/#/patches). [Folder layout](https://ethanconneely.com/SandustryModTemplate/#/layout)

## Quick start

Node 24 installed.

### Clone or use as a template

```bash
git clone --recursive https://github.com/IrishBruse/SandustryModTemplate.git <my-folder-name-here>
```

### Install dependencies

```bash
cd <my-folder-name-here>
npm install
```

Root `npm install` sets up the template (esbuild, TypeScript, lint). It also runs `npm install` in each `src/<name>/` folder that has a `package.json`. Put mod-only npm packages there — not in the repo root. Run `npm run mod:install` to refresh mod folders after you add or change a mod `package.json`.

### Configure a mod

Copy [`src/hello-toast-example/`](src/hello-toast-example/) to `src/<your-mod>/` (or edit one of the demos). Set `id`, `name`, `author`, and `description` in that folder’s `mod.ts`. The mods folder uses `name`. Each `src/<name>/` with a `mod.ts` is a separate mod. Mods cannot import from each other.

### Mods

| Folder                                             | Shows                            |
| -------------------------------------------------- | -------------------------------- |
| [`src/debug/`](src/debug/)                         | Dev companion (debug builds only): DevTools, splash skip, F3 |
| [`src/selection-capture/`](src/selection-capture/) | **Pixel-perfect Screenshot and GIF recorder** — **C** marquee → **F7** PNG / GIF |

### Examples

| Folder                                                             | Shows                                |
| ------------------------------------------------------------------ | ------------------------------------ |
| [`src/hello-toast-example/`](src/hello-toast-example/)             | Toast on load                        |
| [`src/overlay-hotkey-example/`](src/overlay-hotkey-example/)       | React overlay + Tailwind; **Alt+E**  |
| [`src/retro-game-example/`](src/retro-game-example/)               | Retro Console Noise Test             |
| [`src/management-button-example/`](src/management-button-example/) | Management-column row under Upgrades |
| [`src/worker-api-example/`](src/worker-api-example/)               | Worker-thread `sandkit.api` probe    |

### Run

Run `npm run dev`, then **F5** in VS Code (or `npm run sandustry`). Neither launches a build — the watch owns the bundle. See [builds](https://ethanconneely.com/SandustryModTemplate/#/builds).

In game, **Alt+E** opens the overlay from `overlay-hotkey-example`. More: [docs site](https://ethanconneely.com/SandustryModTemplate/) · [modkit](https://ethanconneely.com/SandustryModTemplate/#/modkit/) · [`AGENTS.md`](AGENTS.md)

## Commands

| Command             | Effect                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run setup`       | Extract game source to `sandustry/`, link `logs/`                      |
| `npm run dev`       | Watch and write to the OS mods folder (`~/.config/...` or `%APPDATA%`) |
| `npm run build`     | Release bundle (no debug helpers)                                      |
| `npm run publish`   | Requires [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD). Release-build, then Workshop upload from `workshop/` |
| `npm run typecheck` | TypeScript check                                                       |
| `npm run mod:install` | `npm install` in each `src/<name>/` with `package.json`              |
| `npm run sandustry` | Stop and launch the game (no build)                                    |

## Troubleshooting

See [Troubleshooting](https://ethanconneely.com/SandustryModTemplate/#/troubleshooting).
