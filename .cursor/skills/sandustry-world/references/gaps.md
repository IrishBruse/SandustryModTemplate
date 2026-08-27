# Gaps

Still open after the 0.5.5 MCP pass:

- Per-thread cell-row or chunk ownership (`startingIndex` is only the worker id 0..13)
- Worker-thread `sandkit` in simulation vs manager vs utility (main renderer confirmed, official worker list in **sandustry-internals**)
- Full numeric ids for mod-registered terrains beyond built-in `CellType`
- `grid.mutate` callback timing vs `chunkShouldUpdateNext`
- `getArtifactLocations()` non-empty `{ cellX, cellY, name }` samples (this save returned `[]`)

Moved to references: scheduling typed arrays (`workers.md`), no shared heat SAB (`wall-heat-foliage.md`), `getDataAtCell` `{ cellType, hitPoints, hp }` (`terrains.md`), Gloom / Stratacore (`cells.md`).
