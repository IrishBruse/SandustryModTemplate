# Pipes and fluids

Fluid transport structures are split from the main structure list.

## `sandkit.api.pipes` (public, 0.5.5)

| Method                                    | Role                                    |
| ----------------------------------------- | --------------------------------------- |
| `isAtCell(cellX, cellY)`                  | Pipe segment at cell                    |
| `isEnabledAtCell(cellX, cellY)`           | Pipe flow enabled at cell               |
| `getConnectedVentsAtCell(cellX, cellY)`   | Connected liquid vents (`[]` when none) |
| `setEnabledAtCell(cellX, cellY, enabled)` | **mutate** - do not call in probes      |

Live on structure cell with no pipe: `isAtCell` / `isEnabledAtCell` -> `false`, `getConnectedVentsAtCell` -> `[]`.

Pumps and liquid vents still appear in `store.structures` via `structures.getAtCell`. Pipe segments live in `store.pipes`.

## Store

| Field                 | Role                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `store.pipes[]`       | Pipe segments only (`type` === `StructureType.Pipe` / `23`)      |
| `store.pumpsCache[]`  | Pump structures (`type` 24) for fast fluid graph updates         |
| `session.cache.pipes` | Spatial block index (same pattern as `session.cache.structures`) |

This save: `pipes` length 0, `pumpsCache` length 0. Pipes still render from defs when placed.

## Pipe instance

Placed pipe (from engine):

- `type`: `23` (`Pipe`)
- `x`, `y`: snap-grid cell
- `data.pipeSpriteIndex`: connection bitmask sprite (0-15) from neighbor pipes

Pump / liquid vent at a cell without adjacent pipe may get `data.connectedVents: []`.

## Placement rules (engine)

- Pipe goes to `store.pipes`, not `store.structures`.
- Pump pushes into `pumpsCache` on place.
- Pump and liquid vent require a pipe at the same cell.

## Settings

`session.settings.pipesModeView` - pipes overlay mode (foreground vs background tilemap).

## Builtin ids

`Pipe` 23, `Pump` 24, `LiquidVent` 25 - `enums.md`.

## Related

- Building menu fluid tab: **sandustry-ui** `references/building.md`.
- `ItemId.PipeRemover` (13) - player tool, not covered here.
