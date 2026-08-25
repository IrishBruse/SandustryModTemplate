# Gaps

Not confirmed in this pass:

- Full list of valid `sandkit.api.progression.complete` request ids and payloads.
- Per-tech `TechStatus` without running the same UI helper the Research tree uses.
- Complete conservatory creature roster and per-species ticket curve beyond `2^n` first-capture rule.
- All upgrade `itemId` / `upgradeId` pairs after mod registration (core list is in `upgrades.md`).
- `store.player.tech` definition grid positions (`x`, `y`) on live saves (types show them on `Player.tech` but live map is boolean-only).
- Lexicon entry count and ids before first Lexicon open (`compiled: false`).
- Objective event-driven ids (`burn_residue`, etc.) completion rules beyond title keys.
- `sandustry-factory` skill (linked from `viability.md`) - not in this repo yet.
- Worker-thread reads of `store.upgrades` (main thread is source of truth for API).
- Public API for objectives, tutorial, conservatory, or lexicon (none on 0.5.2).

Re-probe after game updates. Confirm string tech ids in `getDefinitionById` on live `sandkit.api.tech`.
