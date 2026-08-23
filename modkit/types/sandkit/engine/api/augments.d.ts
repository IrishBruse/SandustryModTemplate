/**
 * `sandkit.engine.api.augments` — player augment levels and unlocked perks.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace augments {
  /** Return the current dig augment level. */
  export function getDigLevel(...args: unknown[]): unknown;
  /** Return the current gun augment level. */
  export function getGunLevel(...args: unknown[]): unknown;
  /** Return the current phase augment level. */
  export function getPhaseLevel(...args: unknown[]): unknown;
  /** Return the current rocket ammo augment level. */
  export function getRocketAmmoLevel(...args: unknown[]): unknown;
  /** Return the current rocket reload augment level. */
  export function getRocketReloadLevel(...args: unknown[]): unknown;
  /** Return the current sprint cap augment level. */
  export function getSprintCapLevel(...args: unknown[]): unknown;
  /** Return whether the big-dig augment is unlocked. */
  export function hasBigDig(...args: unknown[]): unknown;
  /** Return whether the bullet-speed augment is unlocked. */
  export function hasBulletSpeed(...args: unknown[]): unknown;
  /** Return whether the bullet-tracer augment is unlocked. */
  export function hasBulletTracer(...args: unknown[]): unknown;
  /** Return whether the kickstart-boost augment is unlocked. */
  export function hasKickstartBoost(...args: unknown[]): unknown;
  /** Return whether the phase-dash augment is unlocked. */
  export function hasPhaseDash(...args: unknown[]): unknown;
  /** Return whether the phase-dash-charge augment is unlocked. */
  export function hasPhaseDashCharge(...args: unknown[]): unknown;
  /** Return whether the ride-boost augment is unlocked. */
  export function hasRideBoost(...args: unknown[]): unknown;
  /** Return whether the rocket-damage augment is unlocked. */
  export function hasRocketDamage(...args: unknown[]): unknown;
  /** Return whether the rocket-warhead augment is unlocked. */
  export function hasRocketWarhead(...args: unknown[]): unknown;
  /** Return whether the sprint-power augment is unlocked. */
  export function hasSprintPower(...args: unknown[]): unknown;
  /** Return whether the triple-shot augment is unlocked. */
  export function hasTripleShot(...args: unknown[]): unknown;
}
