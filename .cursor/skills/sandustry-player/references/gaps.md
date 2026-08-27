# Gaps

Not walked in the 0.5.2 player pass:

- Per-tool runtime state (Shovel dig radius, Copier source, Digger recall, Teleporter targets, Hauler route) beyond hotbar `AssetRef`
- Deck (`session.input.mode !== "kbm"`) cursor and tab flow
- Worker-thread player helpers (`sandkit.api.player` on sim/manager workers)
- Full `abilities[].attributes` matrix per `ItemId`
- Structure placement preview geometry (ghost tiles, clearance enum)
- `engine.api.tutorialBuild` placement constraints
- Coloring `floodFillColor` graph limits and performance
- Clipboard `set` / `activate` payload schema (structure array shape)
- `store.player.buildings` id -> name map (use **sandustry-factory** or `StructureType` enum)
- Mod-registered items (`items.register`) on this save

Confirmed (void MCP pass):

- New game can start with `hotbar.activeSlotIndex: null` — set before bulk scripts.
- Mod hotbar `type: 4` without `handleAction` crashes input (`undefined.handleAction`).
- `store.mods.entities.list` holds live creatures; `engine.api.entities.kill` not on live 0.5.2 API.

Re-probe after game updates, arity and keys can drift.
