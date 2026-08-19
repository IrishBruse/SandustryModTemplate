/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Upgrade trees
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiUpgrades {
  /**
   * Return available level by id.
   * @param itemId item id.
   * @param upgradeId upgrade id.
   */
  getAvailableLevelById: (itemId: string, upgradeId: string) => number;
  /**
   * Return level by id.
   * @param itemId item id.
   * @param upgradeId upgrade id.
   */
  getLevelById: (itemId: string, upgradeId: string) => number;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   */
  register: (definition: UpgradeDefinition) => void;
  /**
   * Register category.
   * @param definition Registration definition object.
   */
  registerCategory: (definition: UpgradeCategoryDefinition) => void;
  /**
   * Update definition.
   * @param itemId item id.
   * @param upgradeId upgrade id.
   * @param partial Optional settings object.
   */
  updateDefinition: (itemId: string, upgradeId: string, partial: Record<string, unknown>) => void;
}
export type ApiUpgradesNamespace = ApiUpgrades;
