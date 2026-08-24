# Survival Mode

Survival rules for Sandustry.

## Features

- Health on the resource HUD (first row in the vanilla `div.mb-4` stack, shown as `current/100`).
- **Fire, flame, and lava** damage the player while overlapping (lava hits harder). The player sprite tints orange or red. Damage ticks on a timer, so standing still still hurts.
- **Jump** on **Boost** (Up / W) or **Space** (120 ms input buffer).
- **Sprint** on **Shift** (SprintBoost binding) while moving left/right on ground.
- Vanilla **Sprint Boost** (temporary Shift burst and meter) is off.
- **Stronger gravity** (1.75× vanilla fall speed).
- **Auto step-up** up to 3 cells when walking into ledges (configurable 1–8).
- Hover flight disabled.

## Controls

- **Up** (Boost binding, e.g. W) — press to jump.
- **Shift** (SprintBoost binding) + **A/D** on ground — hold sprint (1.6× walk speed, no meter).
- **Space** — jump when on ground.
- **H** — restore health to 100 (debug). Rebind under **Options → Controls**.
- Hover key, Sprint Boost burst, and sustained up-thrust are blocked.

## Options

Under **Options → Mods → Survival Mode**:

- **Mod enabled** — turn all survival rules off.
- **Max step cells** — ledge step height when walking (default **3**).

## Dev / hot reload

Use the dev watcher (debug build — required for hot reload):

```bash
npm run dev -- --mod survival-mode
```

On reload, the console should show `reloaded — jump velocity -380`.

`npm run build` without `--debug` still defines `reloaded` as `false` at compile time. Use `npm run dev` or `npm run build -- --mod survival-mode --debug` for dev.
