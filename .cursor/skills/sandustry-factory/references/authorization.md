# Authorization

Build and grab permission zones. Main thread only.

## `sandkit.api.authorization` (live)

| Method                                            | Role                        |
| ------------------------------------------------- | --------------------------- |
| `canBuildAtCell(cellX, cellY)`                    | Player may place structures |
| `canGrabAtCell(cellX, cellY)`                     | Player may grab elements    |
| `canUseTool(player, isFlamethrower?)`             | Tool use at player position |
| `canUseToolAtCell(cellX, cellY, isFlamethrower?)` | Tool use at cell            |
| `getZoneIdAtCell(cellX, cellY)`                   | Zone id at cell             |
| `getPlayerZoneId()`                               | Zone id under player        |

Engine twin (state first): `canBuild`, `canGrab`, `canUseTool`, `canUseToolAt`, `getZoneIdAt`, `getPlayerZoneId`.

## `shared.authorization`

| Field             | Live                                                          |
| ----------------- | ------------------------------------------------------------- |
| `width`, `height` | `3840` `3840` (cell grid)                                     |
| `data`            | `Uint8Array` len **14745600** (3840 x 3840), zone id per cell |

Zone `0` means unrestricted. Live player cell and sampled corners were **0**; `canBuildAtCell` true. Non-zero zone layouts were not present on this save.

Do not dump `data` in probe scripts. Sample sparse cells only.

## `sandkit.enums.AuthorizationType`

| Member                     | Value |
| -------------------------- | ----- |
| `NoJetpack`                | 1     |
| `NoGrab`                   | 2     |
| `NoBuild`                  | 3     |
| `NoTool`                   | 4     |
| `NoExcavation`             | 5     |
| `NoToolExceptFlamethrower` | 6     |

## Debug

F3 `config.debug.showAuthorizationZones` - overlay (UI: **sandustry-ui** `references/debug.md`).

## Related

- Placement blocked by terrain uses `sandkit.api.building.isBlockedAtCell` - separate from authorization.
- Player session building: **sandustry-player** `references/building.md`.
