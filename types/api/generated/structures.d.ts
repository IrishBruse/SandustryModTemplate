/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Structure registration and mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiStructures {
  addProcessor: Method2;
  addVariant: Method3;
  buildAtCellWhenIdle: Method4;
  forEachOfType: Method2;
  getAtCell: Method2;
  getDefinitionByType: Method1;
  getTypeFromId: Method1;
  getUnlockedTypes: Method0;
  hasBuiltAtCell: Method2;
  isBlockedByPlayerAtCell: Method2;
  isLauncherAtCell: Method2;
  isType: Method2;
  isTypeAtCell: Method3;
  isUnlockedByType: Method1;
  mapValueToSpritesheetIndex: Method2;
  processing: ApiStructuresProcessing;
  recipes: ApiStructuresRecipes;
  register: Method2;
  registerPlacementConfig: Method1;
  removeAtCellsWhenIdle: Method2;
  removeAtCellWhenIdle: Method3;
  removeBetweenCellsWhenIdle: Method5;
  setData: Method3;
  setSpritesheetIndex: Method2;
  setSpritesheetIndexAtCell: Method3;
  setSpritesheetIndexByValue: Method3;
  setSpritesheetIndexByValueAtCell: Method4;
  update: Method2;
  updateDefinition: Method3;
}
export interface ApiStructuresProcessing {
  isEnabledAt: Method2;
  register: Method2;
  setEnabledAt: Method3;
}
export interface ApiStructuresRecipes {
  register: Method2;
}
export type ApiStructuresNamespace = ApiStructures;
