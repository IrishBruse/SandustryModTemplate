/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Cooldown checks
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiCooldown {
  /**
   * Return whether check.
   * @param overrideTime override Time id.
   */
  check: (cooldownId: string, overrideTime: number) => boolean;
  /**
   * Return whether ready.
   * @param overrideTime override Time id.
   */
  isReady: (cooldownId: string, overrideTime: number) => boolean;
}
export type ApiCooldownNamespace = ApiCooldown;
