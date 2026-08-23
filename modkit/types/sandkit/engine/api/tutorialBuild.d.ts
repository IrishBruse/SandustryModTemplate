/**
 * `sandkit.engine.api.tutorialBuild` — tutorial build-step constraints and targets.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace tutorialBuild {
  /**
   * Return whether all active tutorial targets are built.
   * @param args - Game state first, then method-specific arguments.
   */
  export function areAllTargetsBuilt(...args: unknown[]): unknown;
  /**
   * Return whether all targets in a structure family are built.
   * @param args - Game state first, then method-specific arguments.
   */
  export function areFamilyTargetsBuilt(...args: unknown[]): unknown;
  /**
   * Return whether placement is allowed at the active target.
   * @param args - Game state first, then method-specific arguments.
   */
  export function canPlaceAtActiveTarget(...args: unknown[]): unknown;
  /**
   * Return foundation move destination cells for the tutorial step.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getFoundationMoveDests(...args: unknown[]): unknown;
  /**
   * Return foundation move source cells for the tutorial step.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getFoundationMoveSources(...args: unknown[]): unknown;
  /**
   * Return build targets for the current tutorial step.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getTargets(...args: unknown[]): unknown;
  /**
   * Return whether a tutorial build definition exists.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasDefinition(...args: unknown[]): unknown;
  /**
   * Return whether the current step restricts building.
   * @param args - Game state first, then method-specific arguments.
   */
  export function isStepConstrained(...args: unknown[]): unknown;
  /**
   * Return whether a foundation move matches tutorial rules.
   * @param args - Game state first, then method-specific arguments.
   */
  export function matchesFoundationMove(...args: unknown[]): unknown;
  /**
   * Return whether a foundation remove matches tutorial rules.
   * @param args - Game state first, then method-specific arguments.
   */
  export function matchesFoundationRemove(...args: unknown[]): unknown;
  /**
   * Return whether the active target should be protected at a cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function shouldProtectActiveTargetAt(...args: unknown[]): unknown;
}
