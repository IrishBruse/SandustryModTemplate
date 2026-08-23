# Survival Mode

Survival rules for Sandustry.

## Features

- Health on the resource HUD (first row in the vanilla `div.mb-4` stack, shown as `current/100`).
- Hover flight disabled (Hover tech locked; ground mode forced).
- Step-up on small inclines (`maxStepCells` setting, default 2).

## Options

Under **Options → Mods → Survival Mode**:

- **Mod enabled** — turn all survival rules off.
- **Max step cells** — how many cells you can step up when walking (1–8).

## Dev

```bash
npm run dev -- --mod survival-mode
```
