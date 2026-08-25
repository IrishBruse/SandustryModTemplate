# Session state (player branch)

Subset of `sandkit.state.session` used for player, tools, and building probes. Full bag list: **sandustry-internals** `state.md`.

## Player-related `session` keys

| Key                                      | Role                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `camera`                                 | View center - `camera.md`                                                            |
| `input`                                  | Keys and mouse - `input.md`                                                          |
| `building`                               | Placement drag - `building.md`                                                       |
| `construction`                           | Marquee / demolish / ruler flags                                                     |
| `action`                                 | Active use state - `action.md`                                                       |
| `actionLocked`                           | Blocks new actions                                                                   |
| `cheat.bypassCosts`                      | Free placement                                                                       |
| `movementSpeedMultiplier`                | Session movement scale                                                               |
| `overrideCamera`, `lerpCamera`           | Scripted camera                                                                      |
| `zoomLevel`                              | Zoom factor                                                                          |
| `reconMode`                              | Recon drone active (`false` when idle)                                               |
| `sprintBoost`                            | `{ meter: 0-1, recharging: boolean }` — live idle: `{ meter: 1, recharging: false }` |
| `windows.building`, `windows.blueprints` | Management overlays open                                                             |

## `store` (player branch)

| Key      | Role                               |
| -------- | ---------------------------------- |
| `player` | Full player snapshot - `player.md` |

## `shared` (read-only hints)

| Key           | Role                       |
| ------------- | -------------------------- |
| `playerPos`   | Worker-synced position     |
| `actionState` | Cross-thread action mirror |
| `mouse`       | Shared mouse snapshot      |

Do not dump large `store.world` / `shared.sim` buffers in probes.
