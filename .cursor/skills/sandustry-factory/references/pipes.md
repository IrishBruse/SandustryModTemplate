# Pipes and fluids

Fluid transport structures are split from the main structure list.

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

## API surface

No public `sandkit.api.pipes`. Use `structures.getAtCell` for pumps/vents in `store.structures`. Pipe lookup uses `session` spatial cache key `"pipes"`.

Builtin ids: `Pipe` 23, `Pump` 24, `LiquidVent` 25 - `enums.md`.

## Related

- Building menu fluid tab: **sandustry-ui** `references/building.md`.
- `ItemId.PipeRemover` (13) - player tool, not covered here.
