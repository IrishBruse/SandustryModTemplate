# Debug framework

Shared dev-only runtime helpers for Sandustry mods: global `window.api`, DevTools shortcuts, splash skip, and main-menu auto-boot.

Mod-specific debug setup and dev-only patches live in [`src/debug/`](../../src/debug/). That folder imports this module and adds mod-only behaviour.

**Release builds do not compile this code.** `npm run build` stubs `src/debug` to `empty.ts`, so neither this folder nor mod debug code is bundled.

**Dev builds include this code.** `npm run dev`, VS Code debug tasks, and `npm run sandustry:debug` build with debug enabled. The mod config **Debug** toggle (`api.settings.get("debug")`) turns helpers on or off at runtime without rebuilding.
