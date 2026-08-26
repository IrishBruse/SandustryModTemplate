# Custom Element Example

Register one powder element with `api.elements.register`.

## Use

1. Enable the mod and load a save.
2. **Debug menu:** equip the Debug tool → **Element** brush → **Elements** → **Spark Dust**.
3. Paint Spark Dust on the map.

Spark Dust uses `MatterType.Powder`. It falls and piles like sand.

## Copy this mod

Copy `examples/content/custom-element/` to `src/<your-mod>/`. Change `id`, element id, and colours in `modinfo.ts` and `main.ts`.

For a collectable payout value, see [`collectable-element`](../collectable-element/). For a buildable machine, see [`register-structure`](../register-structure/) and [`structure-processor`](../structure-processor/).

Workshop reference: `whisper.gold-refinement`, `sandustry-labs.red-sand-production`.
