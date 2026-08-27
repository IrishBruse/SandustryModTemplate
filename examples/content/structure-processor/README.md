# Structure Processor Example

Attach a periodic callback with `structures.processing.register`.

Pattern from workshop mod `lunalith.storage`.

## Use

1. Enable the mod and load a save.
2. **Debug menu:** equip the Debug tool → **Building** → **Example Scanner**.
3. Place the 4×4 scanner and pour sand or elements onto it.
4. Open DevTools console. Every second you see an occupancy log for that structure.

## Copy this mod

Copy `examples/content/structure-processor/` to `src/<your-mod>/`. Change interval, footprint scan, and processor logic in `main.ts`.

For structure registration only, see [`register-structure`](../register-structure/).
