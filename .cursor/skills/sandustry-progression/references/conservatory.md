# Conservatory

Side branch of Research (tickets, creatures, rewards). UI: **sandustry-ui** `../../sandustry-ui/references/research.md`.

## Public API (0.5.5)

`sandkit.api.tech.conservatory.appendUnlock(techId, unlocks)` - append extra unlocks to a conservatory reward tech.

- `techId`: `Tech | string` (built-in or mod id).
- `unlocks.structures` (optional): structure id strings.
- `unlocks.items` (optional): item id strings.

Write - do not call during read-only probes. Purchased state is still `store.player.tech[id]`.

## Store

```ts
store.conservatory: { tickets: number }
store.creatures: {
  [typeId: string]: { available: number, found: number }
}
```

- **Tickets**: spent on conservatory reward tech. First unique creature capture grants `2^n` tickets where `n` is count of species with `found > 0`.
- **Creatures**: `found` is lifetime captures; `available` is spendable count for mechanics that consume critters.

Creature type ids (examples): `lumling`, `shinelet`, `resinWeaver`, `eyes`, `voidgrazer`, `redweaver`, `voltblub`.

## Reward tech ids

Conservatory rewards are tech entries with `currencyType: "ticket"`. Purchased state is still `store.player.tech[id]`.

| Id (enum or string)    | Ticket cost | Notes                     |
| ---------------------- | ----------- | ------------------------- |
| `ColoringTool` (92)    | 1           |                           |
| `GlassFoundation` (95) | 1           |                           |
| `CritterFence` (110)   | 1           |                           |
| `SignalGate` (93)      | 1           | Door in UI                |
| `GrapplingHook` (94)   | 5           |                           |
| `PrecisionTools` (96)  | 5           |                           |
| `SignalDevices` (97)   | 5           |                           |
| `SignalControls` (98)  | 5           | requires `SignalDevices`  |
| `LogicGates` (99)      | 5           | requires `SignalControls` |
| `WallTool` (101)       | 10          |                           |
| `RetroConsole` (100)   | 20          |                           |

`Corraller` tech (102) unlocks the conservatory tab when researched.

## Session flags

- `session.windows.conservatory.open`
- `session.conservatoryAttention`, `session.conservatoryNewCreature` (first capture UX)
- `store.hints.conservatoryIntroSeen`

Reward purchase is a tech unlock (not a separate store bag).
