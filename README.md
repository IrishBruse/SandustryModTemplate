# Sandustry Mod Template

TypeScript template for [Sandustry](https://store.steampowered.com/app/2764460/Sandustry/) mods (Steam **[mods]** beta). Full docs: [docs site](https://ethanconneely.com/SandustryModTemplate/).

## Quick start

Need **Node 24** and Sandustry with the **[mods]** beta.

```bash
git clone https://github.com/IrishBruse/SandustryModTemplate.git <my-folder>
cd <my-folder>
npm install
npm run setup
npm run dev
```

Then **F5** in VS Code (or `npm run sandustry`). In game, look for **Template loaded**. **Alt+E** opens the overlay sample.

**Windows:** if setup cannot find the game, set `SANDUSTRY` to `Sandustry.exe`. PowerShell:

```powershell
$env:SANDUSTRY="C:\Program Files (x86)\Steam\steamapps\common\Sandustry\Sandustry.exe"
```

More: [Quick start](https://ethanconneely.com/SandustryModTemplate/#/quick-start) · [Troubleshooting](https://ethanconneely.com/SandustryModTemplate/#/troubleshooting)

## Commands

| Command             | Effect                                           |
| ------------------- | ------------------------------------------------ |
| `npm run setup`     | Check install, extract game source, link folders |
| `npm run dev`       | Watch `src/` mods                                |
| `npm run build`     | Release build to `build/<modinfo.id>/`           |
| `npm run publish`   | Release build, then Steam Workshop upload        |
| `npm run sandustry` | Start the game (no build)                        |
