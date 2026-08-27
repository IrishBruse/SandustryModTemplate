# Gaps

Not confirmed in the 0.5.2 MCP pass:

- Live `sandkit.api.*` method keys on the closure object (webpack module not exposed to MCP, use types + `__debug.state` buffers)
- Full `sandkit.api.grid` / `elements` / `terrains` method arity vs generated docs
- Per-thread cell-row or chunk ownership mapping (`startingIndex` vs world Y bands)
- Temperature / heat buffer location on `shared.*` (energy SABs confirmed; element heat not on `shared.sim`)
- `schedulingMode` / `hybridScheduling` object key `"0"` meaning (live: `{ "0": 1 }` on `shared`, mode **1** via `getSchedulingMode()`)
- Worker-thread `sandkit` API surface (simulation vs manager vs utility)
- Custom map `getActive()` payload on this save (vanilla map, not custom)
- Full enum numeric values for mod-registered terrains beyond built-in `CellType`
- `grid.mutate` callback timing vs `chunkShouldUpdateNext`

Confirmed (void MCP pass):

- `shared.mapData.data` is RGBA, 58982400 bytes on 3840² worlds — see [background-layers.md](background-layers.md).
- Prefab decor: `store.mods.prefabData.placements`, `store.mods.foliage.data.prefabPlacements`.
- Pixi parallax keys on `session.rendering.pixi` — see [background-layers.md](background-layers.md).
- Batch clear: 256 rows per MCP call for buffers; 128–512 rows for `revealFogAtCell` — **sandustry-mcp** `references/void-world.md`.

When confirmed, move notes into the matching reference file and trim this list.
