# Viability

Factory tier progression (HUD **Viability** bar). No dedicated `sandkit.api.viability` namespace. Read store fields and factory APIs.

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

## Factory reads

Use **sandustry-factory** `references/factory.md` for `sandkit.api.factory` (`getLevel`, `getProcessCount`, `getProcessRate`) and internal `engine.api.factory` tier math. Do not duplicate process ids or tier gates here.

Live 0.5.5 sample: `api.factory.getLevel()` = `7`, matches `store.viability.level`.

## HUD

Viability bar and **MAX LEVEL** label: **sandustry-ui** `../../sandustry-ui/references/hud.md`.
