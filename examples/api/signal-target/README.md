# Signal Target Example

Register a signal handler for vanilla structure types with `signals.targets.register`.

Pattern from workshop mod `electric131.wired-pyro`.

## Use

1. Enable the mod and load a save that has signal devices unlocked.
2. Wire a signal into a heat cannon.
3. The cannon enables or disables from the signal, same as vanilla signal logic.

This mod does not add UI. It only registers the handler.

## Copy this mod

Copy `examples/api/signal-target/` to `src/<your-mod>/`. Swap structure type ids and call `structures.processing.setEnabledAtCell` or your own handler in `main.ts`.
