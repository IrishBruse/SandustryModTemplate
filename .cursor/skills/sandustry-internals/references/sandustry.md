# Workspace `sandustry/`

Gitignored.
Created by `npm run setup`.
Do not edit by hand; re-run setup after a game update.

| Path                                | Role                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `sandustry/source/`                 | Full `app.asar` extract except `node_modules/` (refreshed each setup)   |
| `sandustry/source/dist/`            | Renderer (`index.html`, `js/bundle.js`, …). Integration tests boot here |
| `sandustry/source/main.js`          | Electron main                                                           |
| `sandustry/source/preload.js`       | `contextBridge` → `window.electron`                                     |
| `sandustry/source/workshop-mods.js` | Mod host / patch loader                                                 |
| `sandustry/logs/`                   | Link to OS logs (`main.log`, …)                                         |
| `sandustry/saves/`                  | Link to OS saves                                                        |
| `sandustry/workshop/`               | Link to Steam Workshop `content/2764460`                                |

Current extract: read `sandustry/source/package.json` `version` after setup.
Entry `main.js`.
Steamworks via `steamworks.js`.

Legacy `sandustry/<version>-<branch>/` folders are removed on the next `npm run setup`.

Pretty bundle for patch `find` strings: `sandustry/source/.formatted-source/bundle.js` when present.
Copy finds from `sandustry/source/dist/js/bundle.js` after a game update (`docs/patches.md`).
Author-facing layout: root `README.md` → **Folder layout** → **`sandustry/`**.
