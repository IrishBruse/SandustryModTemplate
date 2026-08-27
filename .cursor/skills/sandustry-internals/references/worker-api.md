# Worker entry (official)

Public worker `sandkit.api` is the **Worker entry** section of `.tmp/Sandkit - Sandustry Modding API.html`. The Steam renderer MCP session only sees the **main** object.

Official worker namespaces: `constants`, `collector`, `effects`, `elements` (includes `swapBetweenCells`, `moveBetweenCells`, `markMovementBlockedByIndex`), `events`, `hooks`, `fire`, `patterns`, `player` (read helpers), `random`, `terrains`, `ui.toast`, `utils`, `lights.temporary`, `main.emitEvent`, `maps.getActive`, `worker.getIndex` / `getCount`, `shared.buffers.require`, `structures` (no `register` / `buildAtCell`), `structures.processing.isEnabledAtCell`, `grid` (no `mutate` / `forEachCellIn*`).

Live worker attach (simulation / manager / utility) is still open. Do not assume main-thread aliases (`api.world`, `api.processing`, `WhenIdle`) exist on workers.

## Engine vs public arity (live main, 0.5.5)

| Call                      | Public                                                                       | Engine                                                                                |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| entities spawn            | `spawnAtWorld` arity **3**                                                   | `spawn` arity **4** (state first)                                                     |
| factory `getLevel`        | arity **0**                                                                  | arity **1** (state)                                                                   |
| factory `getProcessCount` | arity **1** (process id required)                                            | present on engine                                                                     |
| pipes                     | `isAtCell`, `isEnabledAtCell`, `getConnectedVentsAtCell`, `setEnabledAtCell` | `isAt`, `isEnabledAt`, `getConnectedVentsAt`, `setEnabledAt`                          |
| blueprints                | `serializeStructures`, `localizeStructures`                                  | `save`, `load`, `delete`, `getAll`, `exportString`, `importString`, `exportAllString` |
