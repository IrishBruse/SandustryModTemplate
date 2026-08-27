/**
 * Worker entry — type against `WorkerSandkitApi`, not main `SandkitApi`.
 *
 * Ambient `sandkit` is the main-thread shape. Cast here so calls are checked
 * against the worker surface. Compare logged `typeof` probes to TypeDoc
 * `worker` when a method is missing or wrong.
 *
 * The game loads this script on every simulation worker. Probe once on
 * worker 0 — the API bag is the same on each index.
 */
const workerApi = sandkit.api as unknown as WorkerSandkitApi;

type Probe = { path: string; kind: string };

function kindOf(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return typeof value;
}

function probe(path: string, value: unknown): Probe {
  return { path, kind: kindOf(value) };
}

let index = -1;
let count = -1;
try {
  index = workerApi.worker.getIndex();
  count = workerApi.worker.getCount();
} catch (error) {
  console.error(`worker.getIndex/getCount failed`, error);
}

// Other workers share the same api surface — skip duplicate probe spam.
if (index === 0) {
  /** Paths the worker types declare — extend when aligning new namespaces. */
  const probes: Probe[] = [
    probe("worker.getIndex", workerApi.worker?.getIndex),
    probe("worker.getCount", workerApi.worker?.getCount),
    probe("main.emitEvent", workerApi.main?.emitEvent),
    probe("elements.getTypeById", workerApi.elements?.getTypeById),
    probe("elements.getInfoAtCell", workerApi.elements?.getInfoAtCell),
    probe("elements.createAtCell", (workerApi.elements as { createAtCell?: unknown }).createAtCell),
    probe("grid.isCellEmptyAtCell", workerApi.grid?.isCellEmptyAtCell),
    probe("hooks.intercept", workerApi.hooks?.intercept),
    probe("hooks.modify", workerApi.hooks?.modify),
    probe("terrains.createAtCell", workerApi.terrains?.createAtCell),
    probe("structures.getAtCell", workerApi.structures?.getAtCell),
    probe("utils", workerApi.utils),
  ];

  const engine = (sandkit as { engine?: { api?: unknown; state?: unknown } }).engine;
  const engineProbes: Probe[] = [
    probe("engine", engine),
    probe("engine.api", engine?.api),
    probe("engine.state", engine?.state),
  ];

  const missing = probes.filter((p) => p.kind === "undefined");
  const engineMissing = engineProbes.filter((p) => p.kind === "undefined");

  console.log(`worker probe (index 0 of ${count})`, {
    present: probes.length - missing.length,
    missing: missing.map((p) => p.path),
    probes,
  });

  console.log(`worker engine probe (index 0 of ${count})`, {
    present: engineProbes.length - engineMissing.length,
    missing: engineMissing.map((p) => p.path),
    probes: engineProbes,
    engineKeys: engine && typeof engine === "object" ? Object.keys(engine) : [],
  });

  if (missing.length > 0) {
    console.warn(
      `${missing.length} typed path(s) missing at runtime — update node_modules/@sandustry-modding/types/worker or the probe list`,
    );
  }

  if (engineMissing.length > 0) {
    console.warn(
      `worker sandkit.engine missing paths: ${engineMissing.map((p) => p.path).join(", ")}`,
    );
  }
}
