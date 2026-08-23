/**
 * Worker-thread `sandkit.api.worker` — identity of the current simulation worker.
 *
 * @internal Base shape reused by {@link WorkerSandkitApi}. Not the same as
 * main-thread APIs.
 */
export namespace worker {
  /** Zero-based index of this worker in the worker pool. */
  export function getIndex(): number;
  /** Total number of simulation workers. */
  export function getCount(): number;
}
