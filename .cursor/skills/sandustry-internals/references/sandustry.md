# Extracted `sandustry/`

`package.json` version **0.5.2**. Entry `main.js`. Steamworks via `steamworks.js`.

## Electron process

| File | Role |
| ---- | ---- |
| `main.js` | Window, IPC, saves (gzip after first newline), settings, custom maps, GPU switches, Steam Deck env, `sandustry-patch` protocol |
| `preload.js` | `contextBridge.exposeInMainWorld('electron', …)` |
| `logger.js` | `main.log` under Electron logs dir, ~2 MB rotate to `main.old.log`, levels debug/info/warn/error |
| `platform.js` | Detect steam / msstore / gog (`SANDUSTRY_PLATFORM`, `windowsStore`, `MicrosoftGame.config`, `gog.marker`) |
| `platforms/steam.js` | Steamworks backend (this extract has **steam only**) |
| `steam.js` | Older/direct steamworks helper (init by app id) |
| `workshop-mods.js` | Manifest, patches, maps, config schema - `mods-host.md` |
| `local-mod-publisher.js` | `workshop.json` + `preview.png`, visibility 3 unlisted, upload lock |

CLI: `--sandustry-locale=`, `--sandustry-gpu-pref-relaunched`. SharedArrayBuffer enabled. Steam (not MS Store): `in-process-gpu`, `disable-direct-composition`.

## Renderer dist

`dist/index.html` loads `js/bundle.js`. Layers: `#canvas`, `#overlay-canvas`, `#ui`, splash `#loading`.

Workers: `js/simulation-worker.js`, `manager-worker.js`, `utility-worker.js`, `external-mod-runtime.js`, `external-mod-worker-runtime.js`. Locales under `js/locales/`. Procgen prefab `img/procgen/prefabs/*/config.json`.

Pretty bundle for patch `find` strings: `sandustry/.formatted-source/bundle.js`. Copy finds from the **current** extract after a game update (`docs/patches.md`).
