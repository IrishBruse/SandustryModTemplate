# Viability

Factory tier progression (HUD **Viability** bar). No public `sandkit.api` namespace. Read store fields and engine factory API.

## Store

```ts
store.viability: {
  goldSpent: number,
  level: number,      // current factory tier (1-based)
  peakEnergy: number  // energy milestone for tier gates
}
```

- `store.productionPoints`: main-thread copy of lifetime production tally.
- `store.shared.productionPoints[0]`: worker-synced mirror (Atomics).
- `store.factoryLevelCap`: optional hard cap (live maxed save: `7`).

## Engine factory API (read)

Use **sandustry-factory** for tier math, process types, and unlock rules.

Read-only calls on `sandkit.engine.api.factory` (pass `sandkit.state` as first arg):

| Method                     | Live sample |
| -------------------------- | ----------- |
| `getLevel(state)`          | `7`         |
| `getProcessCount(state)`   | `4000`      |
| `getProcessRate(state)`    | `0`         |
| `canUnlockNextTier(state)` | `false`     |

Writers (`addViabilityGold`, `unlockNextTier`, `recordProcess`, ...) need explicit user approval.

## HUD

Viability bar and **MAX LEVEL** label: **sandustry-ui** `../../sandustry-ui/references/hud.md`.
