# Probe

Capture: `sandustry-mcp` on CDP `:9222`. Scripts must be JSON-serializable. Skip DOM wait on reads.

## Safe

- `Object.keys` / `getOwnPropertyNames` on `sandkit`, `sandkit.engine.api`, `sandkit.state.*`, `window.electron`, `__debug`.
- Sync electron: `getPlatformSync`, `getIsSteamDeckSync`, `getPreferredSystemLanguagesSync`, `isFilePatchingActiveSync`, `getLastPlayedGameSync`, `getSystemInfo`, `saveExistsSync`.
- Read fields on `__debug.config` (plain data). `sandkit.state === sandkit.engine.state === __debug.state`.

## Unsafe (needs user ask)

- Any `ipcRenderer.invoke` that writes disk or Steam (save, settings, workshop, achievements, quit).
- `electron.openDevTools()` - drops an IDE debugger attach.
- `sandkit.engine.api.game.load|save|start`.
- Engine mutators (`factory.unlockNextTier`, `drones.spawn`, `teleportZones.teleportPlayerTo`, `queue.process`, `wall.setWallDataAt`).
- `__debug.admin.run`, `__debug.moveCamera`, `__debug.setSchedulingMode`, `__debug.ensureQueuedStructuresAreBuilt`.
