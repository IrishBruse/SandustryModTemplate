# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/).

## Features

- **Multi-file TypeScript** — Split the mod across `src/`; [esbuild](https://esbuild.github.io/) bundles it to one `main.js`. Types from [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types). [Builds](https://ethanconneely.com/SandustryModTemplate/#/builds) · [layout](https://ethanconneely.com/SandustryModTemplate/#/layout)
- **React HUD** — JSX via `sandkit.react` (no extra React package). [React](https://ethanconneely.com/SandustryModTemplate/#/modkit/react) · [UI kit](https://ethanconneely.com/SandustryModTemplate/#/ui/) · [gallery](https://ethanconneely.com/SandustryModTemplate/#/ui/gallery)
- **Modkit utils** — `safe`, settings, scene checks, retro console. [Utils](https://ethanconneely.com/SandustryModTemplate/#/modkit/utils)
- **Hot reload** — `npm run dev` reloads the mod without a game restart. [Builds](https://ethanconneely.com/SandustryModTemplate/#/builds) · [debug](https://ethanconneely.com/SandustryModTemplate/#/modkit/debug)
- **Debug helpers** — F12 DevTools, splash skip, main-menu boot, F3 engine Debug window, console globals. [Debug](https://ethanconneely.com/SandustryModTemplate/#/modkit/debug)
- **Typed `mod.ts`** — one file for the modinfo and [patches](https://ethanconneely.com/SandustryModTemplate/#/patches). [Folder layout](https://ethanconneely.com/SandustryModTemplate/#/layout)

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

Set `id`, `name`, `author`, and `description` in [`mod.ts`](mod.ts). The mods folder uses `name`.

### Run

Run `npm run dev`, then `npm run sandustry` (or **F5** in VS Code). See [builds](https://ethanconneely.com/SandustryModTemplate/#/builds).

In game, **Alt+E** opens the example overlay. More: [docs site](https://ethanconneely.com/SandustryModTemplate/) · [modkit](https://ethanconneely.com/SandustryModTemplate/#/modkit/) · [`AGENTS.md`](AGENTS.md)

## Commands

| Command             | Effect                                                       |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Watch and write to `~/.config/sandustry/mods/<modinfo.name>` |
| `npm run build`     | Release bundle (no debug helpers)                            |
| `npm run typecheck` | TypeScript check                                             |
| `npm run sandustry` | Debug build and launch                                       |

## Troubleshooting

See [Troubleshooting](https://ethanconneely.com/SandustryModTemplate/#/troubleshooting).
