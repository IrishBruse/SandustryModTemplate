# Factory viability

Factory tier progression (HUD **Viability**). No public `sandkit.api.factory`. Use store fields + `engine.api.factory`.

Brief store summary also in **sandustry-progression** `references/viability.md`. This file has tier math and process indices.

## Store

```ts
store.viability: {
  goldSpent: number,
  level: number,       // current tier (1-based)
  peakEnergy: number   // peak stored energy milestone
}
store.factoryLevelCap: number | null  // hard cap; live maxed save: 7
store.stratacores: string[]           // unlocked stratacore ids, e.g. ["terracortex"]
session.factoryProcessRates: { "0": number, "1": number, "2": number, "3": number }
```

Effective displayed level: `min(viability.level, factoryLevelCap ?? viability.level)`.

## `engine.api.factory` (live)

Pass `sandkit.state` as first arg.

| Method                           | Live sample (this save)       |
| -------------------------------- | ----------------------------- |
| `getLevel(state)`                | `7`                           |
| `getProcessCount(state, index?)` | `4000` total, per index below |
| `getProcessRate(state, index?)`  | `0`                           |
| `canUnlockNextTier(state)`       | `false`                       |

Per-process counts (index -> enum name):

| Index | Name                | Required (tier gate) | Live count |
| ----- | ------------------- | -------------------- | ---------- |
| 0     | `ShakeWetSand`      | 4000                 | 4000       |
| 1     | `PressBurntResidue` | 3000                 | 3000       |
| 2     | `GrowFlowers`       | 4000                 | 4000       |
| 3     | `CondenseFlorin`    | 10000                | 10000      |

Writers (need user ask): `addViabilityGold`, `unlockNextTier`, `recordProcess`, `ensureProcessAtLeast`, `flushDeferredLevelUps`.

## Tier requirement chain (engine, 0.5.2)

Between tiers the game checks requirements in order:

| Id                  | Type    | Amount          | Enabling tech (approx) |
| ------------------- | ------- | --------------- | ---------------------- |
| `shakeWetSand`      | process | 4000            | Shaker                 |
| `pressBurntResidue` | process | 3000            | Kinetic Press          |
| `growFlowers`       | process | 4000            | Planter Box            |
| `condenseFlorin`    | process | 10000           | Thermo                 |
| `peakEnergy`        | energy  | 100000          | Gold Battery           |
| `saturateAura`      | aura    | swarm threshold | swarmConsole           |

Gold spent thresholds per tier band: `0`, `30000`, `150000`, `400000`, `1500000`. Tier spacing array: `[2, 5, 8, 11, 16, 23, 29]`.

Later tiers may also gate on auralite produced, prismite/prismaline available, and swarm crystal mined (engine checks).

## Stratacores

`store.stratacores` lists unlocked stratacore type ids. World pickups use `WorldItemType.Stratacore` - **sandustry-entities** `references/world-items.md`. Toolbox UI: **sandustry-ui** `references/toolbox.md`.

## HUD

Viability bar: **sandustry-ui** `references/hud.md` (`ComponentId.FactoryProgress`).
