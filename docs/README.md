# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/) or [`docs/`](docs/).

## Features

- **[Multi-mod](layout.md)** — One repo, many mods. Each `src/<name>/` folder with a `mod.ts` builds to its own game folder. Mods cannot import from each other.
- **[TypeScript](https://github.com/flamableassassin/sandustry-modding-types ":target=_blank")** — Write your code in Typescript and use Sandkit API types from `flamableassassin/sandustry-modding-types`.
- **[React HUD](modkit/react.md)** — JSX via `sandkit.react` (no extra React package), plus the [UI kit](ui/README.md) and [gallery](ui/gallery.md).
- **[Modkit utils](modkit/utils.md)** — `safe`, settings, scene checks, and retro console helpers.
- **[Hot reload](builds.md)** — `npm run dev` reloads the mod without a game restart.
- **[Debug helpers](modkit/debug.md)** — F12 DevTools, splash skip, main-menu boot, F3 engine Debug window, and console globals.
- **[Typed `mod.ts`](layout.md)** — One file per mod for the modinfo and [patches](patches.md).

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

### Configure a mod

Copy [`src/hello-toast-example/`](../src/hello-toast-example/) to `src/<your-mod>/` (or edit one of the demos). Set `id`, `name`, `author`, and `description` in that folder’s `mod.ts`. The mods folder uses `name`. Each `src/<name>/` with a `mod.ts` is a separate mod. Mods cannot import from each other.

### Mods

| Folder                                                | Shows                            |
| ----------------------------------------------------- | -------------------------------- |
| [`src/selection-capture/`](../src/selection-capture/) | **C** marquee → **F7** PNG / GIF |

### Examples

| Folder                                                                | Shows                                |
| --------------------------------------------------------------------- | ------------------------------------ |
| [`src/hello-toast-example/`](../src/hello-toast-example/)             | Toast on load                        |
| [`src/overlay-hotkey-example/`](../src/overlay-hotkey-example/)       | React overlay + Tailwind; **Alt+E**  |
| [`src/retro-game-example/`](../src/retro-game-example/)               | Retro Console Noise Test             |
| [`src/management-button-example/`](../src/management-button-example/) | Management-column row under Upgrades |
| [`src/worker-api-example/`](../src/worker-api-example/)               | Worker-thread `sandkit.api` probe    |

### Run

Run `npm run dev`, then **F5** in VS Code (or `npm run sandustry`). F5 only stops and launches the game — the watch owns the bundle. See [builds](docs/builds.md).

In game, **Alt+E** opens the overlay from `overlay-hotkey-example`. More: [docs site](https://ethanconneely.com/SandustryModTemplate/) · [modkit](docs/modkit/README.md) · [`AGENTS.md`](AGENTS.md)

## Commands

| Command             | Effect                                                       |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Watch OS mods folder; remove owned mods when the watch stops |
| `npm run build`     | Release bundle (no debug helpers)                            |
| `npm run typecheck` | TypeScript check                                             |
| `npm run sandustry` | Debug build and launch                                       |

## Troubleshooting

See [Troubleshooting](docs/troubleshooting.md).
