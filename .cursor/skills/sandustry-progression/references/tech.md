# Tech

Public API: `sandkit.api.tech`. Types: `node_modules/@sandustry-modding/types/sandkit/api/tech.d.ts`. UI map: **sandustry-ui** `../../sandustry-ui/references/research.md`.

## API (live 0.5.2)

| Method                                              | Role                                                                                                                                                                                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getDefinitionById(techId)`                         | Return definition. Numeric string ids (`"1"`) and mod string ids (`"fluxEmanator"`) work. Common slugs like `"conveyor"`, `"hover"`, `"signalGate"` return **`null`** on live — use enum numeric strings or registered mod ids. |
| `isLockedById(techId)`                              | `true` when locked. Id may be `string` or `number` (`sandkit.enums.Tech`).                                                                                                                                                      |
| `setLockedById(techId, locked)`                     | Write lock flag into `store.lockedTechs`.                                                                                                                                                                                       |
| `addDefinition`, `updateDefinition`, `registerNode` | Mod registration.                                                                                                                                                                                                               |

Engine twin (state first): `sandkit.engine.api.tech` with `getDefinition`, `isLocked`, `setLocked`, `registerNode`, etc. Prefer public API in mods.

## Researched state

`store.player.tech` is a map of **researched** nodes. Value `true` means purchased.

- Keys are **mixed**: numeric enum values as strings (`"1"`, `"22"`) and string ids (`"fluxEmanator"`, `"swarmConsole"`).
- Live maxed save: ~116 `true` entries.
- This is not `TechStatus`. UI derives Available / Visible / Researched from definitions, parents, and `lockedTechs`.

## Locks

`store.lockedTechs` overrides definition `locked` when the key exists.

- Value `true`: locked (cannot buy).
- Value `false`: explicitly unlocked (cheat/debug paths).
- Missing key: fall back to static definition `locked`.

Live end-game save (2025-08): **70** keys — **2** with value `true` (locked), **68** with `false` (explicit unlock). Missing key falls back to definition `locked`.

## Definitions

`getDefinitionById` returns fields such as:

- `nameKey`, `descriptionKey`, `descriptionParams`
- `cost`, `branch`, `currencyType` (`gold`, `ticket`, `auralite`, ...)
- `requires` (parent tech id or array)
- `unlocks.structures`, `unlocks.items`, `unlocks.map`
- `isElectricity`, `electricityNodeStyle`, `isAlien`, `threshold`, `radiusUnlockPx`

Full enum list: `enums.md`. Grid layout is internal (not on public API).

## Tutorial gate

During tutorial, only some tech may be bought. Engine checks `isTechAllowedDuringTutorial` (Shaker always; Conveyors after step `UnlockLogistics`).
