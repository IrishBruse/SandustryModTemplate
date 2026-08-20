# Mod debug

Optional dev-only hooks for this mod. Release builds stub this folder to `empty.ts`, so nothing here is bundled in production.

## What lives here

| Path | Role |
|---|---|
| `index.ts` | Mod debug entry — calls [`framework/debug`](../../framework/debug/) and re-exports `onDispose` |

Framework helpers (DevTools, splash skip, main-menu boot, hot reload) live in [`framework/debug/`](../../framework/debug/). Edit `index.ts` when this mod needs extra dev behaviour on top of that.

Debug bundle patches live in `framework/patches/debug/` and `src/patches/debug/`. Each file is raw JavaScript (the body is `code`). Set `file`, `find`, and `expectedMatches` with leading `// @` comments; the filename is the id. See [`src/patches/README.md`](../patches/README.md).

## Build behaviour

**Release** (`npm run build`): esbuild resolves `./debug` to `empty.ts`. Files under `patches/debug/` are omitted from `patches.json`.

**Dev** (`npm run dev`, VS Code debug tasks): full `index.ts` is bundled and `patches/debug/` is included.

The mod config **Debug** toggle (`api.settings.get("debug")`) controls runtime behaviour without rebuilding.
