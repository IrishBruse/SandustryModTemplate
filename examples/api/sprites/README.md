# Sprites Example

Load a texture from the mod folder with `sprites.loadFromMod`.

Pattern from workshop mod `electric131.battery-sensor`.

## Use

1. Enable the mod and load a save.
2. Look for the toast **Sprites — loadFromMod ok**.
3. Open DevTools console for the `getById` log.

Structures that use the same sprite id in `render.imageName` are covered in [`register-structure`](../../content/register-structure/).

## Copy this mod

Copy `examples/api/sprites/` to `src/<your-mod>/`. Put PNG files under `mod/` and load them in `main.ts`.
