# Gaps

Not walked in the 0.5.2 player pass:

- Per-tool runtime state (Shovel dig radius, Copier source, Digger recall, Teleporter targets, Hauler route) beyond hotbar `AssetRef`
- `session.sprintBoost` meter fields
- `session.reconMode` internals
- Deck (`session.input.mode !== "kbm"`) cursor and tab flow
- Worker-thread player helpers (`sandkit.api.player` on sim/manager workers)
- Full `abilities[].attributes` matrix per `ItemId`
- Structure placement preview geometry (ghost tiles, clearance enum)
- `engine.api.tutorialBuild` placement constraints
- Coloring `floodFillColor` graph limits and performance
- Clipboard `set` / `activate` payload schema (structure array shape)
- `store.player.buildings` id -> name map (use **sandustry-factory** or `StructureType` enum)
- Mod-registered items (`items.register`) on this save

Re-probe after game updates, arity and keys can drift.
