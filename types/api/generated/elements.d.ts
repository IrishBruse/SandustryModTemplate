/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Element defs and cell mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiElements {
  /**
   * Add interaction info.
   * @param elementTypeOrId element Type Or id.
   */
  addInteractionInfo: (elementTypeOrId: string | ElementType, interaction: Interaction) => void;
  /**
   * Add particle velocity at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param velocity velocity.
   * @param maxSpeed max Speed.
   */
  addParticleVelocityAtCellWhenIdle: (cellX: number, cellY: number, velocity: { x: number; y: number; }, maxSpeed?: number) => void;
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
  convertToParticleAtCellWhenIdle: (cellX: number, cellY: number, velocity: { x: number; y: number; }) => void;
  /**
   * Create at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  createAtCellWhenIdle: (cellX: number, cellY: number, elementType: ElementType, options?: ElementCreateOptions) => void;
  /**
   * Return { x: number; y: number; } | null.
   * @param structureCellX Cell X coordinate.
   * @param structureCellY Cell Y coordinate.
   * @param structureSize structure Size.
   */
  findFreeCellInStructure: (structureCellX: number, structureCellY: number, structureSize: number) => { x: number; y: number; } | null;
  /**
   * Return data field at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getDataFieldAtCell: (cellX: number, cellY: number, fieldNumber: 1 | 2 | 3 | 4) => number | null;
  /** Return definition by type. */
  getDefinitionByType: (elementType: ElementType) => ElementDefinition | undefined;
  /**
   * Return info at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getInfoAtCell: (cellX: number, cellY: number) => { elementType: ElementType; isParticle: boolean; cellId: number; elementIndex: number; } | null;
  /**
   * Return matter type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getMatterTypeAtCell: (cellX: number, cellY: number) => MatterType | null;
  /**
   * Return name by type.
   * @param elementType element Type.
   */
  getNameByType: (elementType: number) => string;
  /** Return registered types. */
  getRegisteredTypes: () => ElementType[];
  /**
   * Return resolved type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getResolvedTypeAtCell: (cellX: number, cellY: number) => ElementType | null;
  /**
   * Return resolved type from cell id.
   * @param cellId cell id.
   */
  getResolvedTypeFromCellId: (cellId: number) => ElementType | null;
  /**
   * Return type at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getTypeAtCell: (cellX: number, cellY: number) => ElementType | null;
  /**
   * Return type from id.
   * @param elementId element id.
   */
  getTypeFromId: (elementId: string) => ElementType;
  /**
   * Return velocity at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getVelocityAtCell: (cellX: number, cellY: number) => { x: number; y: number; } | null;
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
  isTypeAtCell: (cellX: number, cellY: number, elementType: ElementType) => boolean;
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
  register: (definition: ElementDefinition) => { elementType: ElementType; };
  /**
   * Remove at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  removeAtCellWhenIdle: (cellX: number, cellY: number, options?: ElementRemovalOptions) => void;
  /**
   * Replace at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param options Optional settings object.
   */
  replaceAtCellWhenIdle: (cellX: number, cellY: number, elementType: ElementType, options?: ElementCreateOptions) => void;
  /**
   * Set data field at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param value value.
   */
  setDataFieldAtCellWhenIdle: (cellX: number, cellY: number, fieldNumber: 1 | 2 | 3 | 4, value: number) => void;
  /**
   * Set duration at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param duration duration.
   * @param options Optional settings object.
   */
  setDurationAtCellWhenIdle: (cellX: number, cellY: number, duration: number, options?: { updateMax?: boolean; }) => void;
  /**
   * Set physics at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param physicsState physics State.
   */
  setPhysicsAtCellWhenIdle: (cellX: number, cellY: number, physicsState: number) => void;
  /**
   * Set velocity at cell when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param velocity velocity.
   */
  setVelocityAtCellWhenIdle: (cellX: number, cellY: number, velocity: { x: number; y: number; }) => void;
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
  updateDefinition: (elementTypeOrId: string | ElementType, partial: Partial<ElementDefinition>) => void;
}
export type ApiElementsNamespace = ApiElements;
