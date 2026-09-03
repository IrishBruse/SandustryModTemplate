# Extracted `sandustry/`

Setup writes the game tree to `sandustry/source/` (refreshed each `npm run setup`). `npm run setup` also links `sandustry/saves/` to the OS save folder, `sandustry/workshop/` to Steam Workshop content for app **2764460**, and `sandustry/logs/` to OS sandustry logs.

Current extract (`sandustry/source/`): read `package.json` `version` after setup. Entry `main.js`. Steamworks via `steamworks.js`.

## Layout

| Path | Role |
| --- | --- |
| `sandustry/source/dist/` | Renderer (`index.html`, `js/bundle.js`, …) |
| `sandustry/source/workshop-mods.js` | Mod host / patch loader (Node side) |
| `sandustry/saves/` | Link to OS saves |
| `sandustry/workshop/` | Link to Steam Workshop `content/2764460` |
| `sandustry/logs/` | Link to OS logs (`main.log`, …) |

Legacy `sandustry/<version>-<branch>/` folders are removed on the next `npm run setup`.

Pretty bundle for patch `find` strings: `sandustry/source/.formatted-source/bundle.js` when present. Copy finds from `sandustry/source/dist/js/bundle.js` after a game update (`docs/patches.md`).
