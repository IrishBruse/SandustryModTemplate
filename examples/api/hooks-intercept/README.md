# Hooks Intercept Example

Cancel a vanilla input hook with `hooks.intercept` and `context.cancel()`.

Pattern from workshop mod `superman4eg.ricochet-upgrade` (this sample uses `input:escape` only).

## Use

1. Enable the mod and load a save.
2. Press **Escape**. The pause menu does not open.
3. Look for the toast **Hooks Intercept — escape blocked**.

Disable the mod to restore normal Escape behaviour.

## Copy this mod

Copy `examples/api/hooks-intercept/` to `src/<your-mod>/`. Swap `input:escape` for another intercept hook id from `modkit/types/sandkit/api/hooks.d.ts`.
