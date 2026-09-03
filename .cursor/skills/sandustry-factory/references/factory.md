# Factory viability

Factory tier progression (HUD **Viability**).
Prefer public `sandkit.api.factory` for reads.
Writers and tier math remain `engine.api.factory` (internal).

Brief store summary also in **sandustry-progression** `references/viability.md`.
This file has tier math and process ids.

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

## `sandkit.api.factory` (public, 0.5.5)

| Method                       | Role                                  |
| ---------------------------- | ------------------------------------- |
| `getLevel()`                 | Current factory tier (live save: `7`) |
| `getProcessCount(processId)` | Completed count for one process id    |
| `getProcessRate(processId)`  | Current rate for one process id       |

Official `processId` strings:

| processId           | Live count (maxed save) | Required (tier gate) |
| ------------------- | ----------------------- | -------------------- |
| `shakeWetSand`      | 4000                    | 4000                 |
| `pressBurntResidue` | 3000                    | 3000                 |
| `growFlowers`       | 4000                    | 4000                 |
| `condenseFlorin`    | 10000                   | 10000                |

`getProcessCount()` with no `processId` throws: `Unknown factory process "undefined"`.

Live rates on maxed save: all four ids return `0`.

## `engine.api.factory` (internal)

Pass `sandkit.state` as first arg.
Use when public getters are not enough.

| Method                           | Live sample (maxed save)      |
| -------------------------------- | ----------------------------- |
| `getLevel(state)`                | `7`                           |
| `getProcessCount(state, index?)` | `4000` total, per index below |
| `getProcessRate(state, index?)`  | `0`                           |
| `canUnlockNextTier(state)`       | `false`                       |

Per-process counts (index -> enum name):

| Index | Name                | Required | Live count |
| ----- | ------------------- | -------- | ---------- |
| 0     | `ShakeWetSand`      | 4000     | 4000       |
| 1     | `PressBurntResidue` | 3000     | 3000       |
| 2     | `GrowFlowers`       | 4000     | 4000       |
| 3     | `CondenseFlorin`    | 10000    | 10000      |

Writers (need user ask): `addViabilityGold`, `unlockNextTier`, `recordProcess`, `ensureProcessAtLeast`, `flushDeferredLevelUps`.

## Tier requirement chain (engine, 0.5.5)

Between tiers the game checks requirements in order:

| Id                  | Type    | Amount          | Enabling tech (approx) |
| ------------------- | ------- | --------------- | ---------------------- |
| `shakeWetSand`      | process | 4000            | Shaker                 |
| `pressBurntResidue` | process | 3000            | Kinetic Press          |
| `growFlowers`       | process | 4000            | Planter Box            |
| `condenseFlorin`    | process | 10000           | Thermo                 |
| `peakEnergy`        | energy  | 100000          | Gold Battery           |
| `saturateAura`      | aura    | swarm threshold | swarmConsole           |

Gold spent thresholds per tier band: `0`, `30000`, `150000`, `400000`, `1500000`.
Tier spacing array: `[2, 5, 8, 11, 16, 23, 29]`.

Later tiers may also gate on auralite produced, prismite/prismaline available, and swarm crystal mined (engine checks).

## Stratacores

`store.stratacores` lists unlocked stratacore type ids.
World pickups use `PickupType.Stratacore` - **sandustry-entities** `references/world-items.md`.
Toolbox UI: **sandustry-ui** `references/toolbox.md`.

## HUD

Viability bar: **sandustry-ui** `references/hud.md` (`ComponentId.FactoryProgress`).
