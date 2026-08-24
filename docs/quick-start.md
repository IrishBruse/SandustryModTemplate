# Quick start

Get a sample mod running in Sandustry, then make your own folder.

## Before you start

- **Node 24** installed
- Sandustry on Steam, **[mods]** beta selected (Library → Properties → Betas)
- VS Code optional — **F5** launches the game with the debugger

## 1. Clone and install

```bash
git clone https://github.com/IrishBruse/SandustryModTemplate.git <my-folder>
cd <my-folder>
npm install
npm run setup
```

Root `npm install` sets up the template. It also runs `npm install` in each mod folder that has a `package.json` (`src/` or `examples/`). Put mod-only packages there — not in the repo root.

`npm run setup` checks the machine (Node version, root and mod npm installs, `modkit/types/`, Sandustry binary, game asar, Steam **[mods]** beta, and `sandkit` in the bundle). It then extracts game source to `sandustry/`, links `dist/` to the OS mods folder, and links `logs/`. Run it again after a Sandustry update if you need a fresh extract.

## 2. Run the watch, then the game

Keep the watch running in one terminal:

```bash
npm run dev
```

Then launch Sandustry:

- **F5** in VS Code, or
- `npm run sandustry`

`npm run sandustry` only starts the game. It does not build. The watch owns the bundle. The **debug** companion hot-reloads local mods.

With the **debug** companion installed (debug builds), turn on **Auto-load last save** to boot straight into your last played world. See [Debug](modkit/debug.md).

## 3. Try a sample

In game:

- **Alt+E** — overlay from `examples/overlay-hotkey`
- Toast on load — `examples/hello-world`
- **C** then **F7** — Selection Capture (PNG / GIF)

Edit a file under `src/`. Save. The mod reloads without a game restart.

## 4. Make your own mod

1. Copy `examples/hello-world/` to `src/<your-mod>/`.
2. Open that folder’s `mod.ts`.
3. Set `id`, `name`, `author`, and `description`.
4. Change `main.ts`. Add `ui/` for overlays. Put other source files in feature folders, not next to `main.ts`.

Rules:

- Each `src/<name>/` or `examples/<name>/` with a `mod.ts` is a separate game mod.
- The OS mods folder uses `modinfo.id`.
- Import `@modkit/*` and files in your own folder only. Do not import another mod folder.
- Import `onDispose` from `@modkit/debug` when a registration needs cleanup. Release builds stub that package. The debug companion watches local mods.

## Useful commands

| Command             | Effect                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| `npm run setup`     | Check install, extract game source to `sandustry/`, link `dist/` and `logs/` |
| `npm run dev`       | Watch all mods; remove owned folders when the watch stops                    |
| `npm run build`     | Release bundle (no debug helpers); leaves mods installed                     |
| `npm run sandustry` | Stop and launch the game (no build)                                          |
| `npm run typecheck` | TypeScript check                                                             |

Build one folder: `npm run dev -- --mod hello-world`.

## Next steps

- [Folder layout](layout.md) — what each path is for
- [Builds](builds.md) — debug vs release, Tailwind, Workshop publish
- [Modkit](modkit/README.md) — React, utils, debug helpers
- [Troubleshooting](troubleshooting.md) — mods beta, paths, SteamCMD
