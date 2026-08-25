# Store

Progression-related keys on `sandkit.state.store`. Full bag list: **sandustry-internals** `../../sandustry-internals/references/state.md`.

## Progression cluster

| Key                | Type                                 | Role                                                                  |
| ------------------ | ------------------------------------ | --------------------------------------------------------------------- |
| `player.tech`      | `{ [id]: boolean }`                  | Researched tech nodes                                                 |
| `lockedTechs`      | `{ [id]: boolean }`                  | Per-save tech locks (live: **70** keys; `true` = locked, `false` = unlocked) |
| `upgrades`         | nested `level` / `availableLevel`    | Tool upgrade state                                                    |
| `discoveries`      | `{ elements[], terrains[] }`         | Discovery log ids                                                     |
| `progression`      | `{ upgradesUnlocked, dungeons }`     | Meta progression flags                                                |
| `tutorial`         | step machine                         | Early tutorial                                                        |
| `objectives`       | `{ active[] }`                       | HUD objective cards                                                   |
| `viability`        | `{ goldSpent, level, peakEnergy }`   | Factory tier                                                          |
| `productionPoints` | `number`                             | Lifetime production stat                                              |
| `conservatory`     | `{ tickets }`                        | Ticket currency                                                       |
| `creatures`        | `{ [typeId]: { available, found } }` | Critter counts                                                        |
| `hints`            | flags                                | Intro toasts seen (`upgradesIntroSeen`, `conservatoryIntroSeen`, ...) |
| `factoryLevelCap`  | `number?`                            | Optional tier cap                                                     |
| `resources`        | gold, fluxite, energy, artifacts     | Often used in objective checks                                        |
| `stratacores`      | array                                | Collectible progression items                                         |

## Session (progression UI)

| Key                                                               | Role                     |
| ----------------------------------------------------------------- | ------------------------ |
| `session.lexicon`                                                 | Encyclopedia entries     |
| `session.ui.discoveryPopups`                                      | Pending discovery toasts |
| `session.windows.techTree`, `upgrades`, `conservatory`, `lexicon` | `{ open: boolean }`      |
| `session.techTreeAttention`, `session.conservatoryAttention`      | New-content badges       |

## Shared

`shared.productionPoints[0]` mirrors `store.productionPoints` for workers.
