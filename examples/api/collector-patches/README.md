# Collector Patches Example

Patch Collector admission so any element with `collectable.value > 0` can enter.

Same patch set as the old combined collector-element sample. Pair with [`collectable-element`](../../content/collectable-element/) to test mod elements on Collectors.

## Use

1. **Fully restart** the game (patches apply at load).
2. Enable this mod and [`collectable-element`](../../content/collectable-element/).
3. Load a save and place Platinum on Collector tiles.

## Copy this mod

Copy `examples/api/collector-patches/` to `src/<your-mod>/`. Edit `patches.ts` find strings when the game updates.

Patch types: [`docs/patches.md`](../../../docs/patches.md).
