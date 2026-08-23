/**
 * Upgrade categories, definitions, and level queries.
 *
 * Available as `sandkit.api.upgrades`.
 *
 * @module
 */
export namespace upgrades {
  /**
   * Register an upgrade category.
   * @param definition - Category id and display metadata.
   */
  export function registerCategory(definition: UpgradeCategoryDefinition): void;
  /**
   * Register an upgrade definition.
   * @param definition - Item id, upgrade id, costs, and level metadata.
   */
  export function register(definition: UpgradeDefinition): void;
  /**
   * Patch fields on an existing upgrade definition.
   * @param itemId - Parent item id.
   * @param upgradeId - Upgrade id within the item.
   * @param partial - Fields to merge into the definition.
   */
  export function updateDefinition(itemId: string, upgradeId: string, partial: Partial<UpgradeDefinition>): void;
  /**
   * Return the current purchased level for an upgrade.
   * @param itemId - Parent item id.
   * @param upgradeId - Upgrade id within the item.
   */
  export function getLevelById(itemId: string, upgradeId: string): number;
  /**
   * Return the maximum available level for an upgrade.
   * @param itemId - Parent item id.
   * @param upgradeId - Upgrade id within the item.
   */
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
  export interface UpgradeCategoryDefinition {
    /** Category identifier referenced by upgrades. */
    id: string;
    /** Display name translation key. */
    nameKey?: string;
    [key: string]: unknown;
  }
}
