# Game events example mod

## Goal

Add `src/events-example/`: subscribe to `sandkit.api.events.on` for at least `game:ready` and one other event (for example `frame:render` with a throttled counter), unsubscribe with `onDispose`.

## Why

No template mod shows the event subscribe / dispose pattern. Real mods (`selection-capture`, `debug`) use events inline but are not good copy targets for a new author.

## Acceptance

- [ ] New folder `src/events-example/` (`mod.ts`, `main.ts`, `README.md`)
- [ ] Toast or console log on `game:ready` (respect `reloaded` like `hello-world-example`)
- [ ] Second listener demonstrates ongoing subscription with clear cleanup on hot reload
- [ ] README lists which events the example uses and where to find more in `modkit/types`
- [ ] Listed in [`docs/layout.md`](../layout.md) and [`AGENTS.md`](../../AGENTS.md) sample-mod table

## Origin

Event usage in `src/selection-capture/captureFrame.ts` and `src/debug/boot-menu.ts` with no dedicated sample.
