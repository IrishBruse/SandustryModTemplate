# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/) or [`docs/`](docs/).

## Features

- **Multi-mod** — One repo, many mods. Each `src/<name>/` folder with a `mod.ts` builds to its own game folder. Mods cannot import from each other. [Folder layout](docs/layout.md)
- **TypeScript** — Sandkit API types from [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)
- **React HUD** — JSX via `sandkit.react` (no extra React package). [React](docs/modkit/react.md) · [UI kit](docs/ui/README.md) · [gallery](docs/ui/gallery.md)
- **Modkit utils** — `safe`, settings, scene checks, retro console. [Utils](modkit/utils.md)
- **Hot reload** — `npm run dev` reloads the mod without a game restart. [Builds](docs/builds.md) · [debug](docs/modkit/debug.md)
- **Debug helpers** — F12 DevTools, splash skip, main-menu boot, F3 engine Debug window, console globals. [Debug](docs/modkit/debug.md)
- **Typed `mod.ts`** — one file per mod for the modinfo and [patches](docs/patches.md). [Folder layout](docs/layout.md)

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

### Configure the mod

Set `id`, `name`, `author`, and `description` in [`src/example/mod.ts`](../src/example/mod.ts). The mods folder uses `name`. Add another folder under `src/` with its own `mod.ts` to ship a second mod. Mods cannot import from each other.

### Run

Run `npm run dev`, then **F5** in VS Code (or `npm run sandustry`). F5 only stops and launches the game — the watch owns the bundle. See [builds](docs/builds.md).

In game, **Alt+E** opens the example overlay. More: [docs site](https://ethanconneely.com/SandustryModTemplate/) · [modkit](docs/modkit/README.md) · [`AGENTS.md`](AGENTS.md)

## Commands

| Command             | Effect                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run dev`       | Watch and write to the OS mods folder (`~/.config/...` or `%APPDATA%`) |
| `npm run build`     | Release bundle (no debug helpers)                                      |
| `npm run typecheck` | TypeScript check                                                       |
| `npm run sandustry` | Debug build and launch                                                 |

## Troubleshooting

See [Troubleshooting](docs/troubleshooting.md).
