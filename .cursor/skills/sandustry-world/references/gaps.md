# Gaps

Not confirmed in the 0.5.2 MCP pass:

- Live `sandkit.api.*` method keys on the closure object (webpack module not exposed to MCP, use types + `__debug.state` buffers)
- Full `sandkit.api.world` / `elements` / `terrains` method arity vs generated docs
- Per-thread cell-row or chunk ownership mapping (`startingIndex` vs world Y bands)
- `waterPresenceZones` semantics (live: 120120 zones, 14400 entries, value 0 at sample cell - meaning of non-zero not confirmed)
- Temperature / heat buffer location on `shared.*`
- `schedulingMode` / `hybridScheduling` object key `"0"` meaning
- `shared.sim.idStats` layout (len 220)
- `shared.sim.overflowPool` eviction rules
- Worker-thread `sandkit` API surface (simulation vs manager vs utility)
- Custom map `getActive()` payload on this save (vanilla map, not custom)
- Full enum numeric values for mod-registered terrains beyond built-in `CellType`
- `world.runWhenSimulationIdle` callback timing vs `chunkShouldUpdateNext`

When confirmed, move notes into the matching reference file and trim this list.
