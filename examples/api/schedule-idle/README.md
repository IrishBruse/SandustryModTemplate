# Schedule Idle Example

Defer cell writes with the grid mutation writer.

Uses `schedule.nextTick` then `grid.mutate`.

Pattern from workshop mods `paragax.enable-achievements` and `electric131.battery-sensor`.

## Use

1. Enable the mod and load a save.
2. Look for the toast **Schedule Idle — grid.mutate callback ran**.

## Copy this mod

Copy `examples/api/schedule-idle/` to `src/<your-mod>/`. Put your cell mutations on the `writer` inside the `grid.mutate` callback in `main.ts`.
