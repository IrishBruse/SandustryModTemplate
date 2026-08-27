# Reactions, excavation, fire, patterns, random

Registration and pattern helpers for world sim. Official: [sandkit.html](https://sandustry.com/sandkit.html).

## `api.reactions` (main)

`registerContact(definition)`:

- `inputA`, `inputB` - element string ids
- `outputA`, `outputB` - element string ids or `null`
- `orientation` (optional): `"any"` | `"stacked"`

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
