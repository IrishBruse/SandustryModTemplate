# Extracted `sandustry/`

Setup writes versioned folders under `sandustry/<version>-<branch>/` (for example `sandustry/0.5.2-mods/`). Older extracts stay on disk when you switch game version or Steam branch. `npm run setup` also links `sandustry/saves/` to the OS save folder and `sandustry/workshop/` to Steam Workshop content for app **2764460**.

Latest [mods] extract (`sandustry/0.5.5-mods/`): `package.json` version **0.5.5**. Entry `main.js`. Steamworks via `steamworks.js`. Older extracts (for example `0.5.2-mods/`) may still be present.

## Electron process

| File                     | Role                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `main.js`                | Window, IPC, saves (gzip after first newline), settings, custom maps, GPU switches, Steam Deck env, `sandustry-patch` protocol |
| `preload.js`             | `contextBridge.exposeInMainWorld('electron', …)`                                                                               |
| `logger.js`              | `main.log` under Electron logs dir, ~2 MB rotate to `main.old.log`, levels debug/info/warn/error                               |
| `platform.js`            | Detect steam / msstore / gog (`SANDUSTRY_PLATFORM`, `windowsStore`, `MicrosoftGame.config`, `gog.marker`)                      |
| `platforms/steam.js`     | Steamworks backend (this extract has **steam only**)                                                                           |
| `steam.js`               | Older/direct steamworks helper (init by app id)                                                                                |
| `workshop-mods.js`       | Manifest, patches, maps, config schema - `mods-host.md`                                                                        |
| `local-mod-publisher.js` | `workshop.json` + `preview.png`, visibility 3 unlisted, upload lock                                                            |

CLI: `--sandustry-locale=`, `--sandustry-gpu-pref-relaunched`. SharedArrayBuffer enabled. Steam (not MS Store): `in-process-gpu`, `disable-direct-composition`.

## Renderer dist

`dist/index.html` loads `js/bundle.js`. Layers: `#canvas`, `#overlay-canvas`, `#ui`, splash `#loading`. Loader / **Starting game**: `boot.md`.

`npm run setup` extracts the full asar tree except `node_modules/` (img, fonts, sfx, hashed `dist/js/*.ttf`). Workers: `js/simulation-worker.js`, `manager-worker.js`, `utility-worker.js`, `external-mod-runtime.js`, `external-mod-worker-runtime.js`. Locales under `js/locales/`. Procgen prefab `img/procgen/prefabs/*/config.json`.

Pretty bundle for patch `find` strings: `sandustry/0.5.5-mods/.formatted-source/bundle.js`. Copy finds from the matching version folder after a game update (`docs/patches.md`).
