# Sandustry Mod Template

Start a Sandustry mod on the Steam **[mods] branch** — the beta that loads local mods and Workshop content. Get the game on [Steam](https://store.steampowered.com/app/2764460/Sandustry/) and browse mods on the [Workshop](https://steamcommunity.com/app/2764460/workshop/).

## Docs

Full layout, framework, debug, patches, and UI kit: [Docs](docs/) and [https://ethanconneely.com/SandustryModTemplate/](https://ethanconneely.com/SandustryModTemplate/).

## Features

- TypeScript
- React via `sandkit.react` (JSX; no extra React package)
- HUD UI kit
- Small SDK (`safe`, settings, retro console)
- Hot reload without a game restart
- Debug: F12 DevTools, splash skip, main-menu auto-boot, console globals
- Typed `mod.ts` / patches
- Sandkit API types from [flamableassassin/sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)

## Start a mod

**Opt in:** Steam Library → Sandustry → Properties → Betas → select `mods`.

![Steam Properties Betas tab with the mods branch selected](assets/images/mods-branch.png)

1. Use this repository as a GitHub template, or clone it.
2. Install Node 24 (`fnm` / `.nvmrc`) and run `npm install`.
3. Init the types submodule:

   ```bash
   git submodule update --init --recursive
   ```

   API types come from [flamableassassin/sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types) (the `types/` submodule). This submodule is temporary; a package will replace it when that package is available.

4. Edit identity in one place, then keep the folder name in sync:

   | File                            | What to change                        |
   | ------------------------------- | ------------------------------------- |
   | `mod.ts`                        | `id`, `name`, `author`, `description` |
   | `scripts/sandustry/mod-path.js` | `MOD_FOLDER_NAME` (game mods folder)  |

   `src/globals.ts` reads `id` from `mod.ts`. Do not hard-code a second copy.

5. Point the launcher at your Sandustry binary if it is not at `~/games/SteamLibrary/steamapps/common/Sandustry/sandustry`:

   ```bash
   export SANDUSTRY=/path/to/sandustry
   ```

6. Run `npm run dev`, then launch the game (`npm run sandustry`). In VS Code, **F5** also launches the game.

In game, **Alt+E** opens the example overlay. The Retro Console also gets a **Noise Test** sample.

## Commands

| Command                   | Effect                                                 |
| ------------------------- | ------------------------------------------------------ |
| `npm run dev`             | Watch and write to `~/.config/sandustry/mods/<folder>` |
| `npm run build`           | Release bundle (no debug helpers)                      |
| `npm run typecheck`       | TypeScript check                                       |
| `npm run sandustry`       | Debug build and launch                                 |
| `npm run sandustry:debug` | Same, with inspector ports                             |

Folder layout and framework details: [Docs](docs/).

Agent notes: [`AGENTS.md`](AGENTS.md).
