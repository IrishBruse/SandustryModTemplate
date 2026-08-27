# Events Example

Subscribe to one game event with `api.events.on`.

## Use

1. Enable the mod and load a save.
2. On first load, look for the toast **Events — game ready**.
3. Open DevTools console for the `game:ready` log.

Search [`@sandustry-modding/types`](https://www.npmjs.com/package/@sandustry-modding/types) and the [Sandkit API reference](https://sandustry-modding.github.io/SandustryTypes/#/) for more event ids.

## Copy this mod

Copy `examples/api/events/` to `src/<your-mod>/`. Add listeners with `api.events.on`.

Workshop reference: `kpadula.waypoints`, `Kingcub.map-editor`.
