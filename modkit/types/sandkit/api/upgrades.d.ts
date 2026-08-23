export namespace upgrades {
  export function registerCategory(definition: UpgradeCategoryDefinition): void;
  export function register(definition: UpgradeDefinition): void;
  export function updateDefinition(itemId: string, upgradeId: string, partial: Record<string, any>): void;
  export function getLevelById(itemId: string, upgradeId: string): number;
  export function getAvailableLevelById(itemId: string, upgradeId: string): number;

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

  export type UpgradeCategoryDefinition = unknown
}
