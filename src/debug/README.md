# Mod debug

Optional dev-only hooks for this mod. Release builds stub this folder to `empty.ts`, so nothing here is bundled in production.

## What lives here

| Path | Role |
|---|---|
| `index.ts` | Mod debug entry — calls [`framework/debug`](../../framework/debug/) and adds mod-specific setup |
| `patches/*.js` | Dev-only bundle patches (included in dev builds only) |

Framework helpers (DevTools, splash skip, main-menu boot) live in [`framework/debug/`](../../framework/debug/). Edit `index.ts` when this mod needs extra dev behaviour on top of that.

## Build behaviour

**Release** (`npm run build`): esbuild resolves `./debug` to `empty.ts`. Debug patches are omitted from `patches.json`.

**Dev** (`npm run dev`, VS Code debug tasks): full `index.ts` is bundled and debug patches are included.

The mod config **Debug** toggle (`api.settings.get("debug")`) controls runtime behaviour without rebuilding.
