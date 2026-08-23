/**
 * `sandkit.engine.api.factory` — factory tier progression and process tracking.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace factory {
  /**
   * Add viability gold toward the next factory tier.
   * @param args - Game state first, then method-specific arguments.
   */
  export function addViabilityGold(...args: unknown[]): unknown;
  /**
   * Return whether the next factory tier can be unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function canUnlockNextTier(...args: unknown[]): unknown;
  /**
   * Ensure at least the given process count has been recorded.
   * @param args - Game state first, then method-specific arguments.
   */
  export function ensureProcessAtLeast(...args: unknown[]): unknown;
  /**
   * Apply deferred factory level-ups.
   * @param args - Game state first, then method-specific arguments.
   */
  export function flushDeferredLevelUps(...args: unknown[]): unknown;
  /**
   * Return the current factory level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getLevel(...args: unknown[]): unknown;
  /**
   * Return total recorded process count.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getProcessCount(...args: unknown[]): unknown;
  /**
   * Return the current process rate.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getProcessRate(...args: unknown[]): unknown;
  /**
   * Record one factory process event.
   * @param args - Game state first, then method-specific arguments.
   */
  export function recordProcess(...args: unknown[]): unknown;
  /**
   * Unlock the next factory tier.
   * @param args - Game state first, then method-specific arguments.
   */
  export function unlockNextTier(...args: unknown[]): unknown;
}
