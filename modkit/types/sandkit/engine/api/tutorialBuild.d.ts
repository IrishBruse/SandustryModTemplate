/**
 * `sandkit.engine.api.tutorialBuild` — tutorial build-step constraints and targets.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace tutorialBuild {
  /** Return whether all active tutorial targets are built. */
  export function areAllTargetsBuilt(...args: unknown[]): unknown;
  /** Return whether all targets in a structure family are built. */
  export function areFamilyTargetsBuilt(...args: unknown[]): unknown;
  /** Return whether placement is allowed at the active target. */
  export function canPlaceAtActiveTarget(...args: unknown[]): unknown;
  /** Return foundation move destination cells for the tutorial step. */
  export function getFoundationMoveDests(...args: unknown[]): unknown;
  /** Return foundation move source cells for the tutorial step. */
  export function getFoundationMoveSources(...args: unknown[]): unknown;
  /** Return build targets for the current tutorial step. */
  export function getTargets(...args: unknown[]): unknown;
  /** Return whether a tutorial build definition exists. */
  export function hasDefinition(...args: unknown[]): unknown;
  /** Return whether the current step restricts building. */
  export function isStepConstrained(...args: unknown[]): unknown;
  /** Return whether a foundation move matches tutorial rules. */
  export function matchesFoundationMove(...args: unknown[]): unknown;
  /** Return whether a foundation remove matches tutorial rules. */
  export function matchesFoundationRemove(...args: unknown[]): unknown;
  /** Return whether the active target should be protected at a cell. */
  export function shouldProtectActiveTargetAt(...args: unknown[]): unknown;
}
