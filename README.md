# Sandustry Mod Template

TypeScript, React, and Tailwind template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods. Includes a small SDK, hot reload, and Sandkit API types.

## Start a mod

1. Use this repository as a GitHub template, or clone it.
2. Install Node 24 (`fnm` / `.nvmrc`) and run `npm install`.
3. Init the types submodule:

   ```bash
   git submodule update --init --recursive
   ```

4. Edit identity in one place, then keep the folder name in sync:

   | File | What to change |
   |---|---|
   | `modinfo.ts` | `id`, `name`, `author`, `description` |
   | `scripts/sandustry/mod-path.js` | `MOD_FOLDER_NAME` (game mods folder) |

   `src/globals.ts` reads `id` from `modinfo.ts`. Do not hard-code a second copy.

5. Point the launcher at your Sandustry binary if it is not at `~/games/SteamLibrary/steamapps/common/Sandustry/sandustry`:

   ```bash
   export SANDUSTRY=/path/to/sandustry
   ```

6. Run `npm run dev`, then launch the game (`npm run sandustry`).

In game, **Alt+E** opens the example overlay. The Retro Console also gets a **Noise Test** sample.

## Commands

| Command | Effect |
|---|---|
| `npm run dev` | Watch and write to `~/.config/sandustry/mods/<folder>` |
| `npm run build` | Release bundle (no debug helpers) |
| `npm run typecheck` | TypeScript check |
| `npm run sandustry` | Debug build and launch |
| `npm run sandustry:debug` | Same, with inspector ports |

## Layout

- `src/` — your mod (entry, UI, patches)
- `framework/` — React runtime, SDK, debug/hot reload, UI kit
- `types/` — Sandkit API types (submodule)
- `scripts/` — esbuild, game launch, type generation

Agent notes: [`AGENTS.md`](AGENTS.md).
