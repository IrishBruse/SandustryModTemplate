# Hooks Intercept Example

Register `hooks.intercept` on a vanilla input hook. This sample listens for `input:escape` and does **not** call `context.cancel()`, so Escape still opens the pause menu.

To block the pause menu, call `context.cancel()` in the intercept callback (pattern from workshop mod `superman4eg.ricochet-upgrade`).

## Use

1. Enable the mod and load a save.
2. Press **Escape**. The pause menu still opens.
3. Open the console. You see `hooks.intercept(input:escape)`.

## Copy this mod

Copy `examples/api/hooks-intercept/` to `src/<your-mod>/`. Swap `input:escape` for another intercept hook id from the [Sandkit API reference](https://sandustry-modding.github.io/SandustryTypes/#/) (`sandkit.api.hooks`). Add `context.cancel()` only when you want to stop the vanilla action.
