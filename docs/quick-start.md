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

Restart the game after you save a file.

In game, **Alt+E** opens the overlay sample (`examples/overlay-hotkey`).

## Your own mod

1. Copy `examples/hello-world/` to `src/<your-mod>/`.
2. Edit that folder’s `mod.ts` (`id`, `name`, `author`).
3. Edit `main.ts`. Put extra source in feature folders, not next to `main.ts`.

Do not import files from another mod folder. Shared code goes in `modkit/`.

## Commands

| Command             | Effect                                    |
| ------------------- | ----------------------------------------- |
| `npm run setup`     | Check the machine and link `dist/` / `logs/` |
| `npm run dev`       | Watch `src/` mods                         |
| `npm run sandustry` | Start the game (no build)                 |

More: [Folder layout](layout.md), [Builds](builds.md), [Troubleshooting](troubleshooting.md).
