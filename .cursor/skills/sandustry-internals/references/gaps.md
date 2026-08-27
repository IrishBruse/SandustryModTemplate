# Gaps

Not walked in this pass:

- Full `sandkit.api.*` method lists (use generated `docs/api/sandkit/`; live namespace keys confirmed 2025-08 via MCP on page scope `sandkit.api`)
- Engine overlap signatures vs public (arity / state-first)
- `engine.api.config` and `extend` argument meanings
- `__debug.admin.run` command strings

Confirmed (void MCP pass):

- `engine.api.game.save(state, name, id?)` — returns save id; use for batched void-world saves (**sandustry-mcp** `references/void-world.md`).
- `engine.api.entities` live keys omit `kill` on 0.5.2; creatures in `store.mods.entities.list`.
- Worker-thread `sandkit` (simulation/manager/utility workers)
- `platforms/msstore.js` / `gog.js` (not in this Steam extract)
- Save file on-disk layout beyond gzip-after-newline in `main.js`
- `Noise` constructor API
- `webpackChunksand_v1` module ids
- Custom maps IPC payloads
- `shared.sim` / `store.world` binary buffers (too large to dump)
