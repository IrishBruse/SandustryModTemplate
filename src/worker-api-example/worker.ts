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
import type { WorkerSandkitApi } from "types/worker-api";
import { MOD_ID } from "./globals";

const api = sandkit.api as unknown as WorkerSandkitApi;

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
  index = api.worker.getIndex();
  count = api.worker.getCount();
} catch (error) {
  console.error(`[${MOD_ID}] worker.getIndex/getCount failed`, error);
}

// Other workers share the same api surface — skip duplicate probe spam.
if (index === 0) {
  /** Paths the worker types declare — extend when aligning new namespaces. */
  const probes: Probe[] = [
    probe("worker.getIndex", api.worker?.getIndex),
    probe("worker.getCount", api.worker?.getCount),
    probe("main.emitEvent", api.main?.emitEvent),
    probe("elements.getTypeFromId", api.elements?.getTypeFromId),
    probe("elements.getInfoAtCell", api.elements?.getInfoAtCell),
    probe("elements.createAtCell", api.elements?.createAtCell),
    probe("world.isCellEmptyAtCell", api.world?.isCellEmptyAtCell),
    probe("hooks.intercept", api.hooks?.intercept),
    probe("hooks.modify", api.hooks?.modify),
    probe("terrains.createAtCell", api.terrains?.createAtCell),
    probe("structures.getAtCell", api.structures?.getAtCell),
    probe("utils", api.utils),
  ];

  const missing = probes.filter((p) => p.kind === "undefined");

  console.log(`[${MOD_ID}] worker probe (index 0 of ${count})`, {
    present: probes.length - missing.length,
    missing: missing.map((p) => p.path),
    probes,
  });

  if (missing.length > 0) {
    console.warn(
      `[${MOD_ID}] ${missing.length} typed path(s) missing at runtime — update types/src/worker or the probe list`,
    );
  }
}
