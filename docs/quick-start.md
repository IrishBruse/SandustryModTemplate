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

Root `npm install` sets up the template. It also runs `npm install` in each `src/<name>/` that has a `package.json`. Put mod-only packages there — not in the repo root.

`npm run setup` checks the machine (Node version, root and mod npm installs, vendored types in `modkit/types/`, Sandustry binary, game asar, Steam **[mods]** beta, and `sandkit` in the bundle). It then extracts game source to `sandustry/` and links `logs/`. Run it again after a Sandustry update if you need a fresh extract.

## 2. Run the watch, then the game

Keep the watch running in one terminal:

```bash
npm run dev
```

Then launch Sandustry:

- **F5** in VS Code, or
- `npm run sandustry`

`npm run sandustry` only starts the game. It does not build. The watch owns the bundle and hot reload.

With the **debug** companion installed (debug builds), the game can skip the splash and continue your last save. See [Debug](modkit/debug.md).

## 3. Try a sample

In game:

- **Alt+E** — overlay from `overlay-hotkey-example`
- Toast on load — `hello-world-example`
- **C** then **F7** — Selection Capture (PNG / GIF)

Edit a file under `src/`. Save. The mod reloads without a game restart.

## 4. Make your own mod

1. Copy `src/hello-world-example/` to `src/<your-mod>/`.
2. Open that folder’s `mod.ts`.
3. Set `id`, `name`, `author`, and `description`.
4. Change `main.ts` (and add `ui/` when you need overlays).

Rules:

- Each `src/<name>/` with a `mod.ts` is a separate game mod.
- The OS mods folder uses `modinfo.name`.
- Import `@modkit/*` and files in your own folder only. Do not import another `src/<name>/` tree.
- Import hot reload from `@modkit/debug`. Release builds stub that package.

## Useful commands

| Command             | Effect                                                           |
| ------------------- | ---------------------------------------------------------------- |
| `npm run setup`     | Check install, extract game source to `sandustry/`, link `logs/` |
| `npm run dev`       | Watch all mods; remove owned folders when the watch stops        |
| `npm run build`     | Release bundle (no debug helpers); leaves mods installed         |
| `npm run sandustry` | Stop and launch the game (no build)                              |
| `npm run typecheck` | TypeScript check                                                 |

Build one folder: `npm run dev -- --mod hello-world-example`.

## Next steps

- [Folder layout](layout.md) — what each path is for
- [Builds](builds.md) — debug vs release, Tailwind, Workshop publish
- [Modkit](modkit/README.md) — React, utils, debug helpers
- [Troubleshooting](troubleshooting.md) — mods beta, paths, SteamCMD
