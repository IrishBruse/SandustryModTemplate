# Events Example

Subscribe to game events and unsubscribe on hot reload.

## Use

1. Enable the mod and load a save.
2. On first load, look for the toast **Events — game ready**.
3. Open DevTools console. Every five seconds you see a `frame:render` count.

Hot reload does not show the toast again. Listeners are removed through `onDispose` before the bundle re-evaluates.

## Events in this mod

- `game:ready` — one-shot toast when the world is ready
- `frame:render` — throttled console log on each render pass

Search `modkit/types/` and [`docs/api/`](../docs/api/) for more event ids.

## Copy this mod

Copy `examples/events/` to `src/<your-mod>/`. Add listeners with `api.events.on` and pass each unsubscribe function to `onDispose`.
