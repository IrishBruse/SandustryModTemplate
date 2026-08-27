# Gaps

Still open:

- Per-tech `TechStatus` without the Research UI helper
- Full conservatory roster and ticket curve beyond first-capture `2^n`
- All upgrade `itemId` / `upgradeId` pairs after extra mod registration
- Objective event ids (`burn_residue`, ...) completion rules
- Worker-thread `store.upgrades` (main thread is source of truth)

Public `progression.complete` domains are only `tutorial` and `objective` (HTML). No public API for tutorial, lexicon, or objectives besides that. Conservatory unlocks: `api.tech.conservatory.appendUnlock`.

`getDefinitionById` / `player.tech` boolean map: `tech.md` and `enums.md`.
