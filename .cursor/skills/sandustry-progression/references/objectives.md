# Objectives

Optional HUD story cards (**Objectives** in top right). No public `sandkit.api` for secondary cards. Primary **story** objectives use `store.mods.storyProgression` plus `sandkit.engine.api.progression`.

## Store

```ts
store.objectives: {
  active: Array<{
    id: string,
    completed: boolean,
    completedAt?: number   // ms timestamp when done
  }>
}

store.mods.storyProgression: {
  currentStep: string | null,
  completedSteps: string[],
  objectivePositions?: Record<string, { x, y }>,
  waypoints?: unknown[]
}
```

## Engine API (live 0.5.5)

`sandkit.engine.api.progression`:

| Method                           | Role                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `getSteps(state)`                | All story step defs (`objective.type`: `factoryLevel`, `waypoint`, `custom`) |
| `getCurrentStep(state)`          | Active step or null                                                          |
| `isStepCompleted(state, stepId)` | Step in `completedSteps`                                                     |
| `complete(state, stepId)`        | Finish step when checks pass (returns `false` if blocked)                    |
| `triggerCurrentWaypoint(state)`  | Advance waypoint step                                                        |

Factory-tier HUD labels (**Reach Factory Tier {level}**) come from story steps with `objective.type === "factoryLevel"` (e.g. tier 4 = `establish_burnt_residue_processing`).

**Force-complete all story steps** (paused, then save):

```javascript
() => {
  const st = sandkit.state;
  st.session.paused = true;
  const eng = sandkit.engine.api;
  const sp = eng.storage.ensure(st, "storyProgression");
  sp.completedSteps = eng.progression.getSteps(st).map((s) => s.id);
  sp.currentStep = null;
  if (st.store.factoryLevelCap != null) {
    eng.factory.flushDeferredLevelUps(st, st.store.factoryLevelCap);
    st.store.factoryLevelCap = null;
  }
  eng.ui.update(st, sandkit.enums.ComponentId.Objectives);
  const saveId = eng.game.save(st, "Void", "YOUR_SAVE_ID");
  st.session.paused = false;
  return { saveId, completed: sp.completedSteps.length };
};
```

Default chain after init (`research_hover` removed in live mid-game saves):

1. `build_conveyor_under_water`
2. `find_fluxite`
3. `upgrade_grabber`
4. `find_artifact`
5. Plus side goals from research branches (`burn_residue`, `melt_ice`, ...)

Live end-game save (2025-08 probe): only **`active`** secondary cards remain - `build_conveyor_under_water`, `find_fluxite`, `burn_residue`, `melt_ice` (all `completed: false`). Primary story line ("Investigate Anomaly") is driven outside this array (HUD title **SIGNAL DETECTED**).

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
