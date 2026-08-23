# Content Machine Example

End-to-end content mod: input element, output element, custom structure, and processor.

## Use

1. Enable the mod and load a save.
2. **Flake Converter** is unlocked on the building hotbar.
3. Place the converter (4×4 structure).
4. Press **F** at the mouse cell to paint **Raw Flake** onto the converter.
5. After a short interval, each Raw Flake cell becomes **Refined Flake**.

## Machine API

This mod uses `structures.addProcessor` on the custom structure. The callback scans the 4×4 footprint and replaces one input cell per tick.

For paint-only registration, see [`custom-element-example`](../custom-element-example/).

## Copy this mod

Copy `src/content-machine-example/` to `src/<your-mod>/`. Adjust element ids, sprite under `mod/`, shape, and processor logic in `main.ts`.
