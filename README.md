# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/) or [`docs/`](docs/).

## Features

- **TypeScript** — Sandkit API types from [sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)
- **React HUD** — JSX via `sandkit.react` (no extra React package). [React](docs/modkit/react.md) · [UI kit](docs/ui/README.md) · [gallery](docs/ui/gallery.md)
- **SDK** — `safe`, settings, scene checks, retro console. [SDK](docs/modkit/sdk.md)
- **Hot reload** — `npm run dev` reloads the mod without a game restart. [Builds](docs/builds.md) · [debug](docs/modkit/debug.md)
- **Debug helpers** — F12 DevTools, splash skip, main-menu boot, F3 engine flags, console globals. [Debug](docs/modkit/debug.md)
- **Typed `mod.ts`** — one file for the manifest and [patches](docs/patches.md). [Folder layout](docs/layout.md)

## Quick start

1. Use this repo as a GitHub template, or clone it (Node 24).
2. Install and pull types:

   ```bash
   git submodule update --init --recursive
   npm install
   ```

3. Set `id`, `name`, `author`, and `description` in [`mod.ts`](mod.ts). Match the folder name in [`scripts/sandustry/mod-path.js`](scripts/sandustry/mod-path.js) (`MOD_FOLDER_NAME`).
4. Run `npm run dev`, then `npm run sandustry` (or **F5** in VS Code). See [builds](docs/builds.md).

In game, **Alt+E** opens the example overlay. More: [docs site](https://ethanconneely.com/SandustryModTemplate/) · [modkit](docs/modkit/README.md) · [`AGENTS.md`](AGENTS.md)

## Commands

| Command                   | Effect                                                 |
| ------------------------- | ------------------------------------------------------ |
| `npm run dev`             | Watch and write to `~/.config/sandustry/mods/<folder>` |
| `npm run build`           | Release bundle (no debug helpers)                      |
| `npm run typecheck`       | TypeScript check                                       |
| `npm run sandustry`       | Debug build and launch                                 |
| `npm run sandustry:debug` | Same, with inspector ports                             |

## Troubleshooting

**Mods do not load** — Opt into the Steam beta: Library → Sandustry → Properties → Betas → select `mods`.

![Steam Properties Betas tab with the mods branch selected](assets/images/mods-branch.png)

**Game binary not found** — Point the launcher at your executable:

```bash
export SANDUSTRY=/path/to/sandustry
```

Default path: `~/games/SteamLibrary/steamapps/common/Sandustry/sandustry`.

**Types missing** — Run `git submodule update --init --recursive`. Types live in `types/` ([sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)).
