/**
 * Worker thread only.
 *
 * `sandkit.api.worker` — identity of the current simulation worker.
 *
 * @internal Base shape reused by {@link WorkerSandkitApi}. Not the same as
 * main-thread APIs.
 */
export namespace worker {
  /**
   * Return the zero-based index of this worker in the worker pool.
   * @returns Worker index (`0` … `getCount() - 1`).
   */
  export function getIndex(): number;
  /**
   * Return the total number of simulation workers.
   * @returns Worker count for the active simulation.
   */
  export function getCount(): number;
}
