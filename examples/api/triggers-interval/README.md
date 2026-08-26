# Triggers Interval Example

Run a repeating main-thread callback with `triggers.register`.

Pattern from workshop mod `Reka.trashcan`.

## Use

1. Enable the mod and load a save.
2. Open DevTools console.
3. Every few seconds you see a `triggers interval` log.

## Copy this mod

Copy `examples/api/triggers-interval/` to `src/<your-mod>/`. Change trigger id, interval ticks, and callback in `main.ts`.

For one-shot lifecycle hooks, see [`events`](../events/). For worker threads, see [`worker-api`](../worker-api/).
