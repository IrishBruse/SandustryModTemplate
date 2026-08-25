# `sandkit.api.resources` (energy)

Fluxite is out of scope. Energy-related methods only.

Live keys (module `92015`):

| Method                           | Role                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `updateEnergy(amount, options?)` | Delta on the global pool. Syncs `shared.energy[0]` when the SAB exists. `deferUi: true` skips immediate HUD refresh. |
| `collectFluxiteAtCell`           | Not energy - ignore unless the user asks about fluxite.                                                              |

Prefer `sandkit.api.energy.consume` / `addAtCell` for network logic. Use `updateEnergy` for direct pool changes.

HUD **Energy** row reads `store.resources.energy` (mirrors `shared.energy[0]`). See **sandustry-ui** `references/hud.md`.
