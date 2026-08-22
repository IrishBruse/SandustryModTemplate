# Troubleshooting

**`npm run setup` fails** — Fix each `FAIL` line, then run `npm run setup` again. Common checks: Node 24, root `npm install`, `git submodule update --init --recursive`, Sandustry binary / `SANDUSTRY`, Steam **[mods]** beta, and `sandkit` in the game asar.

**Mods do not load** — Opt into the Steam beta: Library → Sandustry → Properties → Betas → select `mods`. Run `npm run setup` to confirm the asar has `sandkit`.

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

**Duplicate mods in the console** — After a rename, old folders can stay in the OS mods directory. The game loads every folder there, so you get two copies of each sample. The watch build removes leftover game folders this template used to own. Stopping `npm run dev` also removes those owned folders. Restart the game after a rename or after you stop the watch.

**VS Code breakpoints do not bind** — Run `npm run dev`, then select the **Sandustry** compound and press F5. That launches the game, then attaches **Renderer** (`127.0.0.1:9222`, mods) and **Main** (`9230`, Electron). Set breakpoints in `src/<name>/` TypeScript files, not in `dist/` or `main.js`. Do not press **F12** while the IDE debugger is attached — Electron DevTools steals the CDP session. Launch configs must allow `sandkit-workshop://**` in `resolveSourceMapLocations` (the game names mod scripts that way).

**Hot reload does nothing under F5** — Keep `npm run dev` running. F5 does not build. The client polls `GET http://127.0.0.1:19147/hot-reload/last`. Restart the game once after you pull a template change so the new client loads. A toast shows when the mod reloads.

**`npm run publish` hangs after a successful upload** — SteamCMD used to keep the `Steam>` prompt because it inherited the terminal. Publish now closes stdin and stops SteamCMD if it does not exit. See [Workshop publish](builds.md#workshop-publish).

**`npm run publish` fails with steamcmd not found** — SteamCMD is required. Install it from the [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) page. See [Workshop publish](builds.md#workshop-publish).

**`npm run publish` fails with "No cached credentials"** — SteamCMD does not use the Steam client login. On a TTY, publish prompts for password / Steam Guard once, then retries. Without a TTY, run `steamcmd +login <account>` once (use the item owner), then publish again.

**Types missing** — Run `git submodule update --init --recursive`. Types live in `modkit/types/` ([sandustry-modding-types](https://github.com/flamableassassin/sandustry-modding-types)).
