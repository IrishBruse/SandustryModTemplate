# Enums

Live on `sandkit.enums.*`. Generated docs: `docs/api/sandkit/enums/`.

## `BuildMode`

| Member      | Value |
| ----------- | ----- |
| Linear      | 1     |
| Rectangular | 2     |

## `ActionType`

| Member   | Value |
| -------- | ----- |
| Weapon   | 1     |
| Building | 2     |
| Tool     | 3     |
| Mod      | 4     |

## `ActionState`

| Member | Value |
| ------ | ----- |
| Start  | 1     |
| Active | 2     |
| End    | 3     |

## `ItemType`

| Member     | Value |
| ---------- | ----- |
| Weapon     | 1     |
| Tool       | 2     |
| Consumable | 3     |
| Mod        | 4     |

## `ItemId` (vanilla tools/weapons)

| Member         | Value |
| -------------- | ----- |
| Shovel         | 1     |
| Grabber        | 2     |
| Demolisher     | 3     |
| GrapplingHook  | 4     |
| Vacuum         | 5     |
| Gun            | 6     |
| Copier         | 7     |
| RocketLauncher | 8     |
| Digger         | 9     |
| Shotgun        | 10    |
| Teleporter     | 11    |
| Flamethrower   | 12    |
| PipeRemover    | 13    |
| Hauler         | 14    |
| Cryoblaster    | 15    |
| MegaShotgun    | 16    |

Hotbar structure slots use **string** ids (e.g. `"conveyor"`) with `type: 4` (`Mod`), not `ItemId`.

## `AbilityType`

| Member | Value |
| ------ | ----- |
| Dig    | 1     |
| Shoot  | 2     |
| Spray  | 3     |
| Laser  | 4     |

## `KeyBinding`

String ids for `sandkit.api.input.getBoundKeys`. Members include: `OpenBuildMenu`, `OpenInventory`, `OpenTechTree`, `OpenUpgrades`, `GrapplingHook`, `Escape`, `Pause`, `Left`, `Right`, `Boost`, `Descend`, `Hover`, `SprintBoost`, `Marquee`, `Demolish`, `BuildMode`, `ReverseBuildDirection`, `OverrideReplaceStructures`, `Ruler`, `Copy`, `Paste`, `Flip`, `Delete`, `QuickSave`, `QuickLoad`, `ToggleGameHud`, `PauseCamera`.

Live key map: `input.md`.
