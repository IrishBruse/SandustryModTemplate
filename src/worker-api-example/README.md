# Worker API Example

Probes worker-thread `sandkit.api` against `types/worker-api` (`WorkerSandkitApi`).

## Use

1. Enable the mod.
2. Load a save so simulation workers start.
3. Check the toast: **Worker API Example loaded — check worker console for probe**.
4. Open the worker / DevTools console for `[author.worker-api-example]` probe lines.

`mod.ts` sets `workerEntry: "worker.js"`. The build bundles `worker.ts` when that file exists. The probe runs once on worker index 0.

## Copy this mod

Copy `src/worker-api-example/` to `src/<your-mod>/`. Extend the probe list in `worker.ts` when you check new API paths. Set `id`, `name`, `author`, and `description` in `mod.ts`.
