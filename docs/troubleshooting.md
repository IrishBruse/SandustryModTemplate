# Troubleshooting

**Mods do not load** — Opt into the Steam beta: Library → Sandustry → Properties → Betas → select `mods`.

![Steam Properties Betas tab with the mods branch selected](assets/images/mods-branch.png)

**Game binary not found** — Point the launcher at your executable.

Linux:

```bash
export SANDUSTRY=/path/to/steamapps/common/Sandustry/sandustry
```

Default probe includes `~/games/SteamLibrary/steamapps/common/Sandustry/sandustry` and Steam library folders from `libraryfolders.vdf`.

Windows (PowerShell):

```powershell
$env:SANDUSTRY="C:\Program Files (x86)\Steam\steamapps\common\Sandustry\Sandustry.exe"
```

Windows (cmd):

```bat
set SANDUSTRY=C:\Program Files (x86)\Steam\steamapps\common\Sandustry\Sandustry.exe
```

Default probe includes `%ProgramFiles(x86)%\Steam` and `%ProgramFiles%\Steam`, plus libraries from `libraryfolders.vdf`.

**Mods / logs folders**

| OS      | Mods                                                          | Logs                       |
| ------- | ------------------------------------------------------------- | -------------------------- |
| Linux   | `~/.config/sandustry/mods/<modinfo.name>`                     | `~/.config/sandustry/logs` |
| Windows | `%APPDATA%\sandustry\mods\<modinfo.name>` (`AppData\Roaming`) | `%APPDATA%\sandustry\logs` |

`dist/<src-folder>/` links to that mod's game folder (symlink on Linux, directory junction on Windows). `logs/` links to the OS sandustry logs folder.

**Types missing** — Run `git submodule update --init --recursive`. Types live in `types/` ([sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)).
