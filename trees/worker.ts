import { registerSimHooks } from "./sim/hooks.ts";

const workerApi = sandkit.api as unknown as WorkerSandkitApi;

let booted = false;

function boot(): void {
  if (booted) return;
  registerSimHooks(workerApi);
  booted = true;
}

try {
  boot();
} catch {
  workerApi.events.on("worker:update:post", () => {
    try {
      boot();
    } catch {
      /* main registration may still be in flight */
    }
  });
}
