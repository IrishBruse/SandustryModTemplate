# debug

Dev companion mod. Debug builds (`npm run dev`, `--debug`) install it as `mods/hot-reload`. Release builds omit it.

Settings live on this mod: DevTools on load, F12, auto-load save, **Start save** (Last played / Mod storage in Options), disable autosave, engine debug, and **F3** Minecraft-style debug overlay. Game-file rewrites live in `patches.ts`. They hook the local-mod loader.

Docs: [docs/modkit/debug.md](../../docs/modkit/debug.md).
