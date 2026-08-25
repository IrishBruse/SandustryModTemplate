# Objectives

Optional HUD story cards (**Objectives** in top right). No public API. Read `store.objectives`.

## Store

```ts
store.objectives: {
  active: Array<{
    id: string,
    completed: boolean,
    completedAt?: number   // ms timestamp when done
  }>
}
```

Default chain after init (`research_hover` removed in live mid-game saves):

1. `build_conveyor_under_water`
2. `find_fluxite`
3. `upgrade_grabber`
4. `find_artifact`
5. Plus side goals from research branches (`burn_residue`, `melt_ice`, ...)

Live end-game save (2025-08 probe): only **`active`** secondary cards remain — `build_conveyor_under_water`, `find_fluxite`, `burn_residue`, `melt_ice` (all `completed: false`). Primary story line ("Investigate Anomaly") is driven outside this array (HUD title **SIGNAL DETECTED**).

## Registered ids (core)

| Id                                                          | Auto-check                                 | Notes                    |
| ----------------------------------------------------------- | ------------------------------------------ | ------------------------ |
| `research_hover`                                            | `player.tech[Hover]`                       | Starts chain             |
| `research_flamethrower`                                     | `player.tech[Flamethrower]`                | Fans out side goals      |
| `research_kinetic_press`                                    | `player.tech[KineticPress]`                |                          |
| `build_conveyor_under_water`                                | event `building:placed`                    | conveyor under water     |
| `find_fluxite`                                              | `resources.fluxite > 0`                    |                          |
| `upgrade_grabber`                                           | any `grabber` upgrade `availableLevel > 0` |                          |
| `find_artifact`                                             | `resources.artifacts.found >= 1`           |                          |
| `burn_residue`, `melt_ice`, `vaporize_water`, `let_it_rain` | world events                               |                          |
| `hover`                                                     | manual                                     | description uses keybind |

`nextObjectives` in the registry pushes follow-up ids when one completes.

Internal helpers: `completeObjective`, `addObjective`, `removeObjective`, periodic `checkObjectives` on tick.

HUD layout: **sandustry-ui** `../../sandustry-ui/references/hud.md`.
