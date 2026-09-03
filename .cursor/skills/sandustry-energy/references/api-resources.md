# `sandkit.api.resources` (energy)

Fluxite is out of scope.
Energy-related methods only.

Live keys (0.5.5):

| Method                           | Role                                                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `adjustEnergy(amount, options?)` | Delta on the global pool. Syncs `shared.energy[0]` when the SAB exists. `deferUi: true` skips immediate HUD refresh. |
| `updateEnergy(amount, options?)` | **Deprecated alias** of `adjustEnergy`.                                                                              |
| `refresh(resourceId)`            | Refresh a resource display (not energy-specific).                                                                    |
| `collectFluxiteAtCell`           | Not energy - ignore unless the user asks about fluxite.                                                              |

Prefer `sandkit.api.energy.consume` / `addAtCell` for network logic.
Use `adjustEnergy` for direct pool changes.

HUD **Energy** row reads `store.resources.energy` (mirrors `shared.energy[0]`).
See **sandustry-ui** `references/hud.md`.
