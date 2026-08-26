# Register Structure Example

Register one buildable structure with `structures.register`.

Pattern from workshop mods `kpadula.waypoints` and `electric131.battery-sensor`.

## Use

1. Enable the mod and load a save.
2. **Debug menu:** equip the Debug tool → **Building** → **Example Beacon**.
3. Place the 4×4 beacon on the map.

## Copy this mod

Copy `examples/content/register-structure/` to `src/<your-mod>/`. Change structure id, sprite under `mod/`, shape, and render size in `main.ts`.

For a periodic callback on a structure, see [`structure-processor`](../structure-processor/).
