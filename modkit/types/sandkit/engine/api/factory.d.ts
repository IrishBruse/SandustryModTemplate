/**
 * `sandkit.engine.api.factory` — factory tier progression and process tracking.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace factory {
  /** Add viability gold toward the next factory tier. */
  export function addViabilityGold(...args: unknown[]): unknown;
  /** Return whether the next factory tier can be unlocked. */
  export function canUnlockNextTier(...args: unknown[]): unknown;
  /** Ensure at least the given process count has been recorded. */
  export function ensureProcessAtLeast(...args: unknown[]): unknown;
  /** Apply deferred factory level-ups. */
  export function flushDeferredLevelUps(...args: unknown[]): unknown;
  /** Return the current factory level. */
  export function getLevel(...args: unknown[]): unknown;
  /** Return total recorded process count. */
  export function getProcessCount(...args: unknown[]): unknown;
  /** Return the current process rate. */
  export function getProcessRate(...args: unknown[]): unknown;
  /** Record one factory process event. */
  export function recordProcess(...args: unknown[]): unknown;
  /** Unlock the next factory tier. */
  export function unlockNextTier(...args: unknown[]): unknown;
}
