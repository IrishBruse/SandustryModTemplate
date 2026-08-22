# Quick start

Get a sample mod running in Sandustry, then make your own folder.

## Before you start

- **Node 24** installed
- Sandustry on Steam, **[mods]** beta selected (Library → Properties → Betas)
- VS Code optional — **F5** launches the game with the debugger

## 1. Clone and install

```bash
git clone --recursive https://github.com/IrishBruse/SandustryModTemplate.git <my-folder>
cd <my-folder>
npm install
```

Root `npm install` sets up the template. It also runs `npm install` in each `src/<name>/` that has a `package.json`. Put mod-only packages there — not in the repo root.

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
- Toast on load — `hello-toast-example`
- **C** then **F7** — Selection Capture (PNG / GIF)

Edit a file under `src/`. Save. The mod reloads without a game restart.

## 4. Make your own mod

1. Copy `src/hello-toast-example/` to `src/<your-mod>/`.
2. Open that folder’s `mod.ts`.
3. Set `id`, `name`, `author`, and `description`.
4. Change `main.ts` (and add `ui/` when you need overlays).

Rules:

- Each `src/<name>/` with a `mod.ts` is a separate game mod.
- The OS mods folder uses `modinfo.name`.
- Import `@modkit/*` and files in your own folder only. Do not import another `src/<name>/` tree.
- Import hot reload from `./debug`, not from `modkit/debug`.

## Useful commands

| Command             | Effect                                                    |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Watch all mods; remove owned folders when the watch stops |
| `npm run build`     | Release bundle (no debug helpers); leaves mods installed  |
| `npm run sandustry` | Stop and launch the game (no build)                       |
| `npm run typecheck` | TypeScript check                                          |
| `npm run setup`     | Extract game source to `sandustry/`, link `logs/`         |

Build one folder: `npm run dev -- --mod hello-toast-example`.

## Next steps

- [Folder layout](layout.md) — what each path is for
- [Builds](builds.md) — debug vs release, Tailwind, Workshop publish
- [Modkit](modkit/README.md) — React, utils, debug helpers
- [Troubleshooting](troubleshooting.md) — mods beta, paths, SteamCMD
