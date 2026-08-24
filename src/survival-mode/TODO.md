# Survival Mode — plan

Survival rules for Sandustry: health, hazards, fall damage, and grounded movement. The mod stays a **gameplay layer** on the factory sim. It does not replace progression, tech, or building loops.

## Locked decisions (2026-08-24)

| Topic                | Decision                                                   |
| -------------------- | ---------------------------------------------------------- |
| **Death**            | Instant respawn at 0 HP (no downed state, no game over)    |
| **Respawn point**    | Deploy portal at world **6772 / 7388 px** (hard-coded)     |
| **Respawn health**   | **50 HP**                                                  |
| **Respawn feedback** | Toast only (`You died` / `Respawned`) — no invulnerability |
| **Lives**            | Unlimited portal respawns                                  |
| **Phase 1 heal**     | Keep debug **H** (full restore) until Phase 2 crops ship   |
| **Phase 2 heal**     | Carrot and cabbage crops — no seed-mix recipe              |
| **Crop elements**    | Four: `carrot-seed`, `carrot`, `cabbage-seed`, `cabbage`   |
| **Planting**         | Vanilla grower / planter box (`processing.registerGrower`) |
| **Eating**           | Auto-eat on touch — mature crop heals and is removed       |
| **Heal values**      | Carrot **+15 HP**, cabbage **+30 HP**                      |
| **Seed access**      | Codex unlock (like other elements)                         |

> **Note:** Hard-coded portal coords work for the current test world. Other seeds may place the deploy portal elsewhere. Revisit `cache-on-deploy` if cross-save respawn breaks.

---

## Design rules

- Prefer Sandkit hooks and events. Use patches only when the public API cannot do the job.
- Keep pure rules (math, thresholds) in testable modules. Wire one call from the hook owner.
- One folder per concern: `health/`, `hazards/`, `movement/`, `ui/`, `crops/` (Phase 2).
- New settings go in `mod.ts` `configSchema`. Do not hard-code toggles in `main.ts`.

## Shipped (v0.1)

| Area           | Where                                      | Notes                                                |
| -------------- | ------------------------------------------ | ---------------------------------------------------- |
| Health HUD     | `ui/HealthHud.tsx`, `ui/mountHealthRow.ts` | First row in vanilla resource stack; `current/100`   |
| Health storage | `health/health.ts`                         | Persists in `api.storage`; no death handling yet     |
| Hazard damage  | `hazards/hazards.ts`                       | Fire/flame 6, lava 12 every 400 ms; sprite tint      |
| Fall damage    | `movement/fallDamage.ts`                   | Safe ≤28 cells; 2 HP per extra cell                  |
| Movement       | `movement/movement.ts`                     | Jump, hold sprint, 1.75× gravity, step-up, hover off |
| Debug heal     | `health/health.ts`                         | **H** restores to 100 (stays until Phase 2)          |

---

## Phase 1 — Death and respawn (next)

Instant portal respawn when HP hits 0.

### Tasks

- [ ] `health/death.ts` — detect first transition to 0 HP; idempotent handler.
- [ ] `health/respawn.ts` — constants `RESPAWN_X = 6772`, `RESPAWN_Y = 7388`, `RESPAWN_HEALTH = 50`.
- [ ] On death: toast `You died` → `api.player.setWorldPosition(RESPAWN_X, RESPAWN_Y)` → `api.player.teleportToGround()` if needed → `setHealth(50)` → toast `Respawned`.
- [ ] Reset hazard sprite tint and fall tracker on death.
- [ ] Wire from `applyDamage` or a `health:changed` callback in `health/health.ts`.
- [ ] Tests: death at 0, no double-respawn, respawn restores 50 HP.

### Files

```
health/
  health.ts      — existing; emit change events
  death.ts       — zero-HP handler
  respawn.ts     — portal coords + teleport sequence
```

---

## Phase 2 — Carrot and cabbage crops

Healing through factory-grown food. Replaces debug **H** as the main heal loop.

### Crop design

| Element        | Role         | Grower recipe              | On player touch     |
| -------------- | ------------ | -------------------------- | ------------------- |
| `carrot-seed`  | Input powder | —                          | —                   |
| `carrot`       | Mature crop  | `carrot-seed` → `carrot`   | +15 HP, remove cell |
| `cabbage-seed` | Input powder | —                          | —                   |
| `cabbage`      | Mature crop  | `cabbage-seed` → `cabbage` | +30 HP, remove cell |

### Tasks

- [ ] `crops/registerElements.ts` — register four custom elements (powder + mature visuals).
- [ ] `crops/registerGrower.ts` — `processing.registerGrower` for each seed → mature recipe.
- [ ] `crops/codex.ts` — unlock seeds in codex.
- [ ] `crops/autoEat.ts` — on `player:moved` or `frame:render`, detect mature crop under hitbox; `applyDamage(-heal)` / `setHealth`; remove element at cell.
- [ ] Remove or hide debug **H** binding once crops are playable.
- [ ] README and changelog update.

### Out of scope for crops

- Seed + water mix recipes (rejected).
- Petalium key-heal bridge (rejected).
- Eat-key + inventory consume (rejected — auto-eat on touch instead).

---

## Phase 3 — Feedback and tuning

- [ ] Low health: heart row pulse below 25%.
- [ ] Move hazard and fall constants to `configSchema` or shared `rules.ts`.
- [ ] Difficulty preset (Normal / Hard).
- [ ] Revisit respawn point: cache deploy position on `game:ready` if hard-coded coords fail on other seeds.

---

## Phase 4 — More hazards (optional)

- [ ] Water drowning timer.
- [ ] Gloom / acid (if element types exist in target game version).
- [ ] Optional limited-lives setting (deferred — unlimited for now).

---

## Test checklist (manual)

- [ ] New game: HUD shows `100/100`.
- [ ] Fire and lava hurt while standing still.
- [ ] Fall from safe height: no damage. Tall drop: damage on land.
- [ ] **Phase 1:** HP → 0 → toast → portal at 6772/7388 → 50 HP → toast.
- [ ] **Phase 2:** Grow carrot on grower → walk into crop → +15 HP, crop gone.
- [ ] **Mod enabled** off: no damage, no HUD row, vanilla movement returns.

---

## References

- Mod README: [README.md](./README.md)
- Player sprite tint: [docs/player-sprite-tint.md](../../docs/player-sprite-tint.md)
- Grower API: [docs/api/sandkit/api/namespaces/processing/README.md](../../docs/api/sandkit/api/namespaces/processing/README.md)
- Deploy portal coords (test world): cell **1693 / 1847**, world **6772 / 7388 px**
