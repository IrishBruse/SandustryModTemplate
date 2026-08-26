# Collectable Element Example

Register one element with `collectable.value` for Collector payout.

Pattern from workshop mod `lunalith.collector`.

## Use

1. Enable the mod and load a save.
2. **Debug menu:** equip the Debug tool → **Element** brush → **Elements** → **Platinum**.
3. Drop Platinum onto Collector tiles like Gold.

Without [`collector-patches`](../../api/collector-patches/), only Gold and liquidGold enter Collectors by default.

## Copy this mod

Copy `examples/content/collectable-element/` to `src/<your-mod>/`. Change `id`, element id, colours, and collectable value in `modinfo.ts` and `main.ts`.

For Collector admission patches, see [`collector-patches`](../../api/collector-patches/).
