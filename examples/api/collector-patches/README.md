# Collector Patches Example

Patch Collector admission so any element with `collectable.value > 0` can enter.

**Still required on game 0.5.5.** Vanilla reads `collectable.value` for payout (`getValueFromElementType`) but tile admission still allows only Gold and liquidGold. There is no public collector admission hook in the Sandkit API.

Same patch set as the old combined collector-element sample. Pair with [`collectable-element`](../../content/collectable-element/) to test mod elements on Collectors.

## Use

1. **Fully restart** the game after any patch change (patches apply at load only).
2. Enable this mod and [`collectable-element`](../../content/collectable-element/).
3. Load a save and place Platinum on Collector tiles.

## Copy this mod

Copy `examples/api/collector-patches/` to `src/<your-mod>/`. `patches.ts` find strings match `sandustry/0.5.5-mods/dist/js/`. Re-match from the extracted bundle when the game updates.

Patch types: [`docs/patches.md`](../../../docs/patches.md).
