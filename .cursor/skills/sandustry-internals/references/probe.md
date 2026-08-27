# Probe

Read-only inspection of live host objects. Return JSON-serializable data only.

## Safe

- `Object.keys` / `getOwnPropertyNames` on `sandkit`, `sandkit.engine.api`, `sandkit.state.*`, `window.electron`, `__debug`.
- Sync electron: `getPlatformSync`, `getIsSteamDeckSync`, `getPreferredSystemLanguagesSync`, `isFilePatchingActiveSync`, `getLastPlayedGameSync`, `getSystemInfo`, `saveExistsSync`.
- Read fields on `__debug.config` (plain data). `sandkit.state === sandkit.engine.state === __debug.state`.

## Unsafe (needs user ask)

- Any `ipcRenderer.invoke` that writes disk or Steam (save, settings, workshop, achievements, quit).
- `sandkit.engine.api.game.load|save|start` and public `sandkit.api.game.start`.
- Engine mutators (`factory.unlockNextTier`, `drones.spawn`, `teleportZones.teleportPlayerTo`, `queue.process`, `wall.setWallDataAt`).
- `__debug.admin.run`, `__debug.moveCamera`, `__debug.setSchedulingMode`, `__debug.ensureQueuedStructuresAreBuilt`.
