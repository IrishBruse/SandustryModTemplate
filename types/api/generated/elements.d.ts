/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Element defs and cell mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiElements {
  addInteractionInfo: Method2;
  addParticleVelocityAtCellWhenIdle: Method4;
  convertFromParticleAtCellWhenIdle: Method2;
  convertToParticleAtCellWhenIdle: Method3;
  createAtCellWhenIdle: Method4;
  findFreeCellInStructure: Method3;
  getDataFieldAtCell: Method3;
  getDefinitionByType: Method1;
  getInfoAtCell: Method2;
  getMatterTypeAtCell: Method2;
  getNameByType: Method1;
  getRegisteredTypes: Method0;
  getResolvedTypeAtCell: Method2;
  getResolvedTypeFromCellId: Method1;
  getTypeAtCell: Method2;
  getTypeFromId: Method1;
  getVelocityAtCell: Method2;
  isFreeFallingAtCell: Method2;
  isTypeAtCell: Method3;
  refreshColorAtCellWhenIdle: Method2;
  register: Method1;
  removeAtCellWhenIdle: Method3;
  replaceAtCellWhenIdle: Method4;
  setDataFieldAtCellWhenIdle: Method4;
  setDurationAtCellWhenIdle: Method4;
  setPhysicsAtCellWhenIdle: Method3;
  setVelocityAtCellWhenIdle: Method3;
  teleportBetweenCellsWhenIdle: Method4;
  updateDefinition: Method2;
}
export type ApiElementsNamespace = ApiElements;
