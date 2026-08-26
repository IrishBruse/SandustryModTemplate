# Schedule Idle Example

Defer cell writes until the simulation is idle.

Uses `schedule.nextTick` then `world.runWhenSimulationIdle`.

Pattern from workshop mods `paragax.enable-achievements` and `electric131.battery-sensor`.

## Use

1. Enable the mod and load a save.
2. Look for the toast **Schedule Idle — simulation idle callback ran**.

## Copy this mod

Copy `examples/api/schedule-idle/` to `src/<your-mod>/`. Put your cell mutations inside the idle callback in `main.ts`.
