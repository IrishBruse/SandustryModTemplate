# Probe

Read-only inspection of progression state. Return JSON-serializable data only.

## Safe

- `Object.keys` on `sandkit.api.tech`, `upgrades`, `discoveries`, `progression`.
- `sandkit.api.tech.getDefinitionById(id)` (read).
- `sandkit.api.tech.isLockedById(id)` (read).
- `sandkit.api.upgrades.getLevelById(itemId, upgradeId)` and `getAvailableLevelById`.
- Read `sandkit.state.store`: `lockedTechs`, `player.tech`, `upgrades`, `discoveries`, `viability`, `conservatory`, `creatures`, `tutorial`, `progression`, `objectives`, `productionPoints`, `hints`, `factoryLevelCap`.
- Read `sandkit.state.shared.productionPoints[0]` (worker sync mirror).
- Read `sandkit.state.session.lexicon`, `session.ui.discoveryPopups`, `session.windows`.
- Read `sandkit.enums.Tech` and `sandkit.enums.TechStatus`.
- Engine read-only (state first arg): `sandkit.engine.api.factory.getLevel`, `getProcessCount`, `getProcessRate`, `canUnlockNextTier`. See **sandustry-factory**.

## Unsafe (needs user ask)

- `sandkit.api.tech.setLockedById`, `addDefinition`, `updateDefinition`, `registerNode`.
- `sandkit.api.upgrades.register`, `registerCategory`, `updateDefinition`.
- `sandkit.api.discoveries.addElementByType`, `addTerrainByType`.
- `sandkit.api.progression.complete`.
- `sandkit.engine.api.factory.addViabilityGold`, `unlockNextTier`, `recordProcess`, `ensureProcessAtLeast`, `flushDeferredLevelUps`.
- `sandkit.engine.api.tutorialBuild.*` when it could affect placement checks during active tutorial.

## Sample script

```js
() => {
  const s = window.sandkit;
  const st = s.state.store;
  return {
    techApi: Object.keys(s.api.tech),
    locked: st.lockedTechs,
    researchedCount: Object.values(st.player.tech).filter(Boolean).length,
    viability: st.viability,
    upgradesGrabber: st.upgrades?.grabber,
    discoveries: {
      elements: st.discoveries?.elements?.length,
      terrains: st.discoveries?.terrains?.length,
    },
    tutorial: st.tutorial,
    objectives: st.objectives?.active,
    lexicon: {
      compiled: s.state.session.lexicon?.compiled,
      entries: s.state.session.lexicon?.entries?.length,
    },
  };
};
```
