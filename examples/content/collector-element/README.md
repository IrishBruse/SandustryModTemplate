# Collector Element Example

Register **Platinum** with a Collector payout and patch admission so any
element with `collectable.value > 0` can enter (not only Gold and liquidGold).

**Still required on game 0.5.5.** Vanilla reads `collectable.value` for payout
but tile admission still allows only Gold and liquidGold. There is no public
collector admission hook in the Sandkit API.

## Use

1. Enable the mod and **fully restart** the game (patches apply at load only).
2. Load a save.
3. **Debug menu:** equip the Debug tool → **Element** brush → **Elements** → **Platinum**.
4. Or press **P** to paint at the mouse cell.
5. Drop Platinum onto Collector tiles like Gold.

Credits should rise while Platinum sits on Collector cells.

## Copy this mod

Copy `examples/content/collector-element/` to `src/<your-mod>/`. Change `id`,
element id, colours, collectable value, and patches in `modinfo.ts`, `main.ts`,
and `patches.ts`.

`patches.ts` find strings match `sandustry/0.5.5-mods/dist/js/`. Re-match from
the extracted bundle when the game updates.

For the patches only, see [`collector-patches`](../../api/collector-patches/).
