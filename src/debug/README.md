# Debug helpers

This folder holds dev-only helpers: DevTools shortcuts, splash skip, main-menu auto-boot, and bundle patches under `patches.ts`.

**Release builds do not compile this code.** `npm run build` sets `__MOD_DEBUG__` to false, so esbuild drops imports from `src/debug/` and omits debug patches from `patches.json`.

**Dev builds include this code.** `npm run dev`, VS Code debug tasks, and `npm run sandustry:debug` set `MOD_DEBUG=1`. The mod config **Debug** toggle (`api.settings.get("debug")`) turns these helpers on or off at runtime without rebuilding.
