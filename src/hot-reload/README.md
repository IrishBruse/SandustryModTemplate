# debug

Dev companion mod. Debug builds (`npm run dev`, `--debug`) install it as `mods/hot-reload`. `npm run build` stages a release bundle under `build/hot-reload/`. `npm run publish` does not list it.

Settings live on this mod: DevTools on load, F12, auto-load save, **Start save** (Last played / Mod storage in Options), disable autosave, **F3 debug overlay**, and vanilla Debug / Stats (always on while the mod is enabled). Pause menu **Mods** (under **Options**) opens a blank **Mod Inspector** panel.

This companion does not hot-reload other mods. After you save, restart the game to load the new bundle.

Docs: [docs/modkit/debug.md](../../docs/modkit/debug.md).
