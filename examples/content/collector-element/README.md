# Collector Element Example

Register **Platinum** with a Collector payout and patch admission so any
element with `collectable.value > 0` can enter (not only Gold and liquidGold).

## What it shows

- `collectable: { value: 2 }` on a mod element
- Collector + smelter interactions (same shape as vanilla Gold)
- Game patches that replace the Gold / liquidGold type list with
  `getValueFromElementType(...) > 0`

## Use

1. Build with `npm run examples -- --mod collector-element` or copy this folder
   to `src/<your-mod>/`.
2. **Fully restart** the game (patches apply at load).
3. Enable the mod and load a save.
4. **Debug menu:** equip the Debug tool → **Element** brush → expand **Elements**
   → **Platinum** (last in the list).
5. Or press **P** to paint at the mouse cell, then drop onto Collector tiles
   like Gold.

Credits should rise while Platinum sits on Collector cells.

## Copy this mod

Copy `examples/content/collector-element/` to `src/<your-mod>/`. Change `id`,
element id, colours, collectable value, and patches in `modinfo.ts`, `main.ts`,
and `patches.ts`.

For a simple element without Collector patches, see
[`custom-element`](../custom-element/).
