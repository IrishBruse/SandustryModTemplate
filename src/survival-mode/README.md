# Survival Mode

Survival rules for Sandustry.

## Features

- Health on the resource HUD (first row in the vanilla `div.mb-4` stack, shown as `current/100`).
- **Jump** on **Space** (120 ms input buffer — press slightly before landing and jump still fires).
- **Run** on **Boost** (hold Up / Boost binding for faster walk speed).
- **Stronger gravity** (1.75× vanilla fall speed).
- **Auto step-up** up to 3 cells when walking into ledges (configurable 1–8).
- Hover flight disabled.

## Controls

- **Up** (Boost binding) — hold to run (1.55× walk speed).
- **Space** — jump when on ground.
- Hover key and sustained up-thrust are blocked.

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
