/**
 * Upgrade categories, definitions, and level queries.
 *
 * Available as `sandkit.api.upgrades`.
 *
 * @module
 */
export namespace upgrades {
  /** Register an upgrade category. */
  export function registerCategory(definition: UpgradeCategoryDefinition): void;
  /** Register an upgrade definition. */
  export function register(definition: UpgradeDefinition): void;
  /** Patch fields on an existing upgrade definition. */
  export function updateDefinition(itemId: string, upgradeId: string, partial: Record<string, any>): void;
  /** Return the current purchased level for an upgrade. */
  export function getLevelById(itemId: string, upgradeId: string): number;
  /** Return the maximum available level for an upgrade. */
  export function getAvailableLevelById(itemId: string, upgradeId: string): number;

  /** Upgrade definition registered for an item. */
  export interface UpgradeDefinition {
    itemId: string;
    itemNameKey?: string;
    categoryId?: string;
    upgrade: {
      id: string;
      nameKey?: string;
      descriptionKey?: string;
      maxLevel: number;
      costs: number[];
      oneOff?: boolean;
    };
    [key: string]: unknown;
  }

  /** Upgrade category definition shape. */
  export type UpgradeCategoryDefinition = unknown
}
