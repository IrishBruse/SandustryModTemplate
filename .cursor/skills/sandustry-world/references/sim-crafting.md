# Reactions, excavation, fire, patterns, random

Registration and pattern helpers for world sim.
Official: [sandkit.html](https://sandustry.com/sandkit.html).

## `api.reactions` (main)

`registerContact(definition)`:

- `inputA`, `inputB` - element string ids
- `outputA`, `outputB` - element string ids or `null`
- `orientation` (optional): `"any"` | `"stacked"`

Live store (0.5.5): registered contacts land in `state.sandkit.mods.recipes.contacts` (often empty).
Contact **mix** lookup also merges:

1. Engine builtins (not in `recipes.contacts`): Water+Sand→WetSand, Water+Seed→WetSeed, Water+Lava→Steam, Water+Flame→Steam — table in `js/bundle.js` as `[[r.RJ.Water,r.RJ.Sand,r.RJ.WetSand],…]`
2. Element defs with `mixes[]`: `{ elementType, result, secondaryResult? }` (example: Void Petal + Redsand → Voidbloom)
3. Mod `registerContact` rows (participant-bound A/B outputs; skipped when a mix already covers the pair)

Same `recipes` bag also holds **mod** machine rows: `condensers`, `steamDryers`, `synthesizers`, `snowmakers`, `smelters`, `growers`, `shakers`, `kineticPresses`.
Vanilla shaker / grower / press work is **not** in those arrays (they start empty).
Hardcoded machine paths and live scrape patterns: **sandustry-factory** `references/processing.md`.

## `api.excavation` (main)

`registerProfile(id, definition)`:

- `definition.pattern`, `definition.power`, `definition.options` (same flags as `grid.excavateAtCell`)
- `definition.terrainRules[]`: `{ cellType, damage, outputElementType }` - deprecated alias `terrainType` -> `cellType`

## `api.fire` (main and worker)

| Method                               | Role                 |
| ------------------------------------ | -------------------- |
| `canBurnElementAtCell(cellX, cellY)` | Burn eligibility     |
| `burnElementAtCell(cellX, cellY)`    | Ignite (**mutates**) |

Main entry deprecated alias: `burnElementAtCellWhenIdle` -> `burnElementAtCell`.
Engine twin: `engine.api.fire.canBurnElementAt` / `burnElementAt`.

Residue is burnable with **no** `def.flammable` object (only `interactions: [{ kind: "flammable" }]`). `burnElementAt` replaces it with Flame whose `data.output` is Burnt Residue at chance **0.25**.
Water also lists `kind: "flammable"` with no burn product.
Mod elements that set `flammable.outputElementId` use that object instead.

## `api.patterns` (main and worker)

| Method                                                                | Role                      |
| --------------------------------------------------------------------- | ------------------------- |
| `createCircle(diameterCells)`                                         | `number[][]` mask         |
| `excavateAtCell(cellX, cellY, pattern, outVelocity, power, options?)` | Pattern dig (**mutates**) |

## `api.random` (main and worker)

| Method            | Role              |
| ----------------- | ----------------- |
| `int(min, max)`   | Inclusive integer |
| `float(min, max)` | Inclusive float   |
