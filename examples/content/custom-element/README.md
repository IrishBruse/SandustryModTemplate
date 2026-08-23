# Custom Element Example

Register one powder element and paint it at the mouse cell.

## Use

1. Enable the mod and load a save.
2. Point the cursor at an empty sandbox cell.
3. Press **P** to place **Spark Dust**.

Spark Dust uses `MatterType.Powder`. It falls and piles like sand.

## Copy this mod

Copy `examples/content/custom-element/` to `src/<your-mod>/`. Change `id`, element id, colours, and binding in `mod.ts` and `main.ts`.

For a full factory loop (structure + processor), see [`content-machine`](../content-machine/).
