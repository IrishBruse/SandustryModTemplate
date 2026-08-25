# Worker API Example

Probes worker-thread `sandkit.api` against ambient `WorkerSandkitApi`.

## Use

1. Enable the mod.
2. Load a save so simulation workers start.
3. Check the toast: **Worker API loaded — check worker console for probe**.
4. Open the worker / DevTools console for `[example.worker-api]` probe lines.

`modinfo.ts` sets `workerEntry: "worker.js"`. The build bundles `worker.ts` when that file exists. The probe runs once on worker index 0.

## Copy this mod

Copy `examples/api/worker-api/` to `src/<your-mod>/`. Extend the probe list in `worker.ts` when you check new API paths. Set `id`, `name`, `author`, and `description` in `modinfo.ts`.
