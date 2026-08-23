/**
 * `sandkit.engine.api.augments` — player augment levels and unlocked perks.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace augments {
  /**
   * Return the current dig augment level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getDigLevel(...args: unknown[]): unknown;
  /**
   * Return the current gun augment level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getGunLevel(...args: unknown[]): unknown;
  /**
   * Return the current phase augment level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getPhaseLevel(...args: unknown[]): unknown;
  /**
   * Return the current rocket ammo augment level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getRocketAmmoLevel(...args: unknown[]): unknown;
  /**
   * Return the current rocket reload augment level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getRocketReloadLevel(...args: unknown[]): unknown;
  /**
   * Return the current sprint cap augment level.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getSprintCapLevel(...args: unknown[]): unknown;
  /**
   * Return whether the big-dig augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasBigDig(...args: unknown[]): unknown;
  /**
   * Return whether the bullet-speed augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasBulletSpeed(...args: unknown[]): unknown;
  /**
   * Return whether the bullet-tracer augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasBulletTracer(...args: unknown[]): unknown;
  /**
   * Return whether the kickstart-boost augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasKickstartBoost(...args: unknown[]): unknown;
  /**
   * Return whether the phase-dash augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasPhaseDash(...args: unknown[]): unknown;
  /**
   * Return whether the phase-dash-charge augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasPhaseDashCharge(...args: unknown[]): unknown;
  /**
   * Return whether the ride-boost augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasRideBoost(...args: unknown[]): unknown;
  /**
   * Return whether the rocket-damage augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasRocketDamage(...args: unknown[]): unknown;
  /**
   * Return whether the rocket-warhead augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasRocketWarhead(...args: unknown[]): unknown;
  /**
   * Return whether the sprint-power augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasSprintPower(...args: unknown[]): unknown;
  /**
   * Return whether the triple-shot augment is unlocked.
   * @param args - Game state first, then method-specific arguments.
   */
  export function hasTripleShot(...args: unknown[]): unknown;
}
