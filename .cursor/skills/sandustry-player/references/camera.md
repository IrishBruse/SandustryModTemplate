# Camera

## `session.camera`

| Field    | Role                          |
| -------- | ----------------------------- |
| `x`, `y` | Camera center in world pixels |

Related session fields (read-only probes):

| Field                     | Live sample                     |
| ------------------------- | ------------------------------- |
| `zoomLevel`               | `1`                             |
| `overrideCamera`          | `false` - scripted focus active |
| `lerpCamera`              | `false`                         |
| `movementSpeedMultiplier` | `1` - pan speed when focused    |

## `sandkit.api.camera`

| Method                          | Arity | Notes                                    |
| ------------------------------- | ----- | ---------------------------------------- |
| `snapToPlayer()`                | 0     | **mutate**                               |
| `setFocusAtWorld(x, y)`         | 2     | **mutate** - move focus, returns applied |
| `releaseFocus({ durationMs? })` | 1     | **mutate** - return to player            |

## Engine twin

`engine.api.camera`: `snapToPlayer(state)`, `setFocusAtWorld(state, x, y)`, `releaseFocusToPlayer(state)`.

## Do not use in probes

`__debug.moveCamera` - mutates view. Needs explicit user ask (see **sandustry-internals** `probe.md`).
