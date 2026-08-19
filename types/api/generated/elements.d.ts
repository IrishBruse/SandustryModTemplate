/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Element defs and cell mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiElements {
  /**
   * Add interaction info.
   * @param elementTypeOrId element Type Or id.
   */
  addInteractionInfo: (elementTypeOrId: string, interaction: Record<string, unknown>) => void;
  /**
   * Add particle velocity at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param velocity velocity.
   * @param maxSpeed max Speed.
   */
  addParticleVelocityAtCellWhenIdle: (cellX: number, cellY: number, velocity: number, maxSpeed: number) => void;
  /**
   * Convert from particle at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  convertFromParticleAtCellWhenIdle: (cellX: number, cellY: number) => void;
  /**
   * Convert to particle at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param velocity velocity.
   */
  convertToParticleAtCellWhenIdle: (cellX: number, cellY: number, velocity: number) => void;
  /**
   * Create at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  createAtCellWhenIdle: (cellX: number, cellY: number, elementType: string, options: Record<string, unknown>) => void;
  /**
   * Return { x: number; y: number; } | null.
   * @param structureCellX Cell X coordinate.
   * @param structureCellY Cell Y coordinate.
   * @param structureSize structure Size.
   */
  findFreeCellInStructure: (structureCellX: number, structureCellY: number, structureSize: number) => { x: number; y: number } | null;
  /**
   * Return data field at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getDataFieldAtCell: (cellX: number, cellY: number, fieldNumber: number) => number;
  /** Return definition by type. */
  getDefinitionByType: (elementType: string) => Record<string, unknown> | undefined;
  /**
   * Return info at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getInfoAtCell: (cellX: number, cellY: number) => Record<string, unknown> | undefined;
  /**
   * Return matter type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getMatterTypeAtCell: (cellX: number, cellY: number) => string;
  /**
   * Return name by type.
   * @param elementType element Type.
   */
  getNameByType: (elementType: string) => string;
  /** Return registered types. */
  getRegisteredTypes: () => string[];
  /**
   * Return resolved type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getResolvedTypeAtCell: (cellX: number, cellY: number) => string;
  /**
   * Return resolved type from cell id.
   * @param cellId cell id.
   */
  getResolvedTypeFromCellId: (cellId: string) => string;
  /**
   * Return type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getTypeAtCell: (cellX: number, cellY: number) => string;
  /**
   * Return type from id.
   * @param elementId element id.
   */
  getTypeFromId: (elementId: string) => string;
  /**
   * Return velocity at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getVelocityAtCell: (cellX: number, cellY: number) => { x: number; y: number };
  /**
   * Return whether free falling at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isFreeFallingAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isTypeAtCell: (cellX: number, cellY: number, elementType: string) => boolean;
  /**
   * Refresh color at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  refreshColorAtCellWhenIdle: (cellX: number, cellY: number) => void;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   */
  register: (definition: Record<string, unknown>) => void;
  /**
   * Remove at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  removeAtCellWhenIdle: (cellX: number, cellY: number, options: Record<string, unknown>) => void;
  /**
   * Replace at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  replaceAtCellWhenIdle: (cellX: number, cellY: number, elementType: string, options: Record<string, unknown>) => void;
  /**
   * Set data field at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param value value.
   */
  setDataFieldAtCellWhenIdle: (cellX: number, cellY: number, fieldNumber: number, value: number) => void;
  /**
   * Set duration at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param duration duration.
   * @param options Optional settings object.
   */
  setDurationAtCellWhenIdle: (cellX: number, cellY: number, duration: number, options: Record<string, unknown>) => void;
  /**
   * Set physics at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param physicsState physics State.
   */
  setPhysicsAtCellWhenIdle: (cellX: number, cellY: number, physicsState: Record<string, unknown>) => void;
  /**
   * Set velocity at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param velocity velocity.
   */
  setVelocityAtCellWhenIdle: (cellX: number, cellY: number, velocity: number) => void;
  /**
   * Teleport the player or an element.
   * @param fromCellX Cell X coordinate.
   * @param fromCellY Cell Y coordinate.
   * @param toCellX Cell X coordinate.
   * @param toCellY Cell Y coordinate.
   */
  teleportBetweenCellsWhenIdle: (fromCellX: number, fromCellY: number, toCellX: number, toCellY: number) => void;
  /**
   * Update definition.
   * @param elementTypeOrId element Type Or id.
   * @param partial Optional settings object.
   */
  updateDefinition: (elementTypeOrId: string, partial: Record<string, unknown>) => void;
}
export type ApiElementsNamespace = ApiElements;
