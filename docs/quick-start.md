# Quick start

## Need

- **Node 24**
- Sandustry on Steam, **[mods]** beta (Library → Properties → Betas)

## Install

```bash
git clone https://github.com/IrishBruse/SandustryModTemplate.git <my-folder>
cd <my-folder>
npm install
npm run setup
```

Windows: the same commands work in PowerShell. If setup cannot find the game:

```powershell
$env:SANDUSTRY="C:\Program Files (x86)\Steam\steamapps\common\Sandustry\Sandustry.exe"
npm run setup
```

If a mod has its own `package.json`, run `npm install` in that folder too. Root `npm install` does not do this.

## Run

Keep the watch in one terminal:

```bash
npm run dev
```

Then launch the game:

- **F5** in VS Code, or
- `npm run sandustry`

Keep `npm run dev` running. Save a file. The dev-tools companion re-evals renderer `main.js` when **Watch local mods** is on. Restart the game for workers and patches.

In game, look for the toast **Template loaded**. **Alt+E** opens the overlay sample (`examples/overlay-hotkey`).

## Your own mod

1. Open `src/template/`.
2. Set `id`, `name`, and `author` in `modinfo.ts` ([field list](modinfo.md)).
3. Edit `main.ts`. Put extra source in feature folders, not next to `main.ts`.
4. Copy `src/template/` to `src/<your-mod>/` when you want a second mod.

Do not import files from another mod folder. Shared code goes in `modkit/`.

## Commands

### Setup and game

- **`npm run setup`** — Check install, extract `app.asar` (except `node_modules/`) to `sandustry/<version>-<branch>/`, link `dist/` and `logs/`
- **`npm run sandustry`** — Start the game (no build)

### Development

- **`npm run dev`** — Watch all `src/` mods (debug)
- **`npm run dev:release`** — Watch without debug / `dev-tools`
- **`npm run dev:pick`** — Same as `dev`, with a TTY picker first
- **`npm run examples`** — Watch `examples/` mods

### Release

- **`npm run build`** — Release build to `build/<modinfo.id>/`

More commands: [README](README.md#commands). Also see [Folder layout](layout.md), [Builds](builds.md), [Troubleshooting](troubleshooting.md).
