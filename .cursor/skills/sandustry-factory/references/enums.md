# Enums

Live values from `sandkit.enums` on 0.5.5.
Prefer string structure ids from API when registering mods.

## `StructureType` (builtin 1-27)

| Name                       | Value |
| -------------------------- | ----- |
| ConveyorLeft               | 1     |
| ConveyorRight              | 2     |
| ShakerLeft                 | 3     |
| ShakerRight                | 4     |
| LauncherUp                 | 5     |
| LauncherLeft               | 6     |
| LauncherRight              | 7     |
| SplitterLeft               | 8     |
| SplitterRight              | 9     |
| Dropper                    | 10    |
| Foundation                 | 11    |
| FoundationAngledLeft       | 12    |
| FoundationTriangleLeftDel  | 13    |
| FoundationAngledRight      | 14    |
| FoundationTriangleRightDel | 15    |
| Collector                  | 16    |
| FilterLeft                 | 17    |
| FilterRight                | 18    |
| SlidingFoundation          | 19    |
| VelocitySoaker             | 20    |
| Grower                     | 21    |
| SoundBox                   | 22    |
| Pipe                       | 23    |
| Pump                       | 24    |
| LiquidVent                 | 25    |
| Light                      | 26    |
| FluxEmanator               | 27    |

Mod structures use string ids (`conveyorLeftMk2`, `signalButton`, ...). `store.structures[].type` may be number or string.

Duplicate enum also on `sandkit.api.building.StructureType` (same values).

## `BuildingClearance`

| Member           | Value |
| ---------------- | ----- |
| Available        | 1     |
| FullyBlocked     | 2     |
| PartiallyBlocked | 3     |
| CanBeReplaced    | 4     |

Used during placement checks. `PartiallyBlocked` and `CanBeReplaced` (with shape overlap) set `structure.queued`.

## `AuthorizationType`

See `authorization.md`.

## `BuildMode`

| Member      | Value |
| ----------- | ----- |
| Linear      | 1     |
| Rectangular | 2     |

On structure definition `buildModes`, not on instances.

## Related

- Full enum bag list: **sandustry-internals** `references/globals.md`.
- `CellType` conveyor/shaker/grower terrain ids overlap logistics - **sandustry-world** `references/cells.md`.
