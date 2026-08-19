# Debug helpers

This folder holds the framework's dev-only runtime helpers: global `window.api`, DevTools shortcuts, splash skip, and main-menu auto-boot. Dev-only bundle patches live in [`src/patches/debug/`](../../src/patches/debug/).

**Release builds do not compile the real debug helpers.** `npm run build` sets `__MOD_DEBUG__` to false, so esbuild loads `empty.ts` instead of this folder's runtime helpers, and omits debug patches from `patches.json`.

**Dev builds include this code.** `npm run dev`, VS Code debug tasks, and `npm run sandustry:debug` build with debug helpers enabled. The mod config **Debug** toggle (`api.settings.get("debug")`) turns these helpers on or off at runtime without rebuilding.
