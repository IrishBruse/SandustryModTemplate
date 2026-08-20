# Mod debug

Optional dev-only hooks for this mod. Release builds resolve `./debug` to [`framework/debug/empty.ts`](../../framework/debug/empty.ts), so nothing in this folder is bundled in production.

## What lives here

| Path | Role |
|---|---|
| `index.ts` | Mod debug entry — calls [`framework/debug`](../../framework/debug/) and re-exports `onDispose` |

Framework helpers live in [`framework/debug/`](../../framework/debug/). That README lists every debug feature (globals, DevTools, splash skip, auto-boot, hot reload, patches). Edit `index.ts` when this mod needs extra behaviour on top of that.

Debug bundle patches live in root [`patches.ts`](../../patches.ts) (`debugPatches` export) and shared helpers in [`framework/patches.ts`](../../framework/patches.ts). See [`src/patches/README.md`](../patches/README.md).

## Build behaviour

**Release** (`npm run build`): esbuild resolves `./debug` to [`framework/debug/empty.ts`](../../framework/debug/empty.ts). `debugPatches` is omitted from `patches.json`.

**Dev** (`npm run dev`, VS Code debug tasks): full `index.ts` is bundled and `debugPatches` is included.

The mod config **Debug** toggle (`api.settings.get("debug")`) controls runtime behaviour without rebuilding.
