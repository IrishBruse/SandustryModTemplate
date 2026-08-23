import { CellCoordinates, Vector2 } from "../../shared/player";
import { shared } from "../../shared";

/**
 * `sandkit.api.elements` — register elements and read or change cells when idle.
 * Main thread only.
 */
export namespace elements {

  // Shared types
  /** Numeric id for a registered element type. */
  export import ElementType = shared.api.elements.ElementType;
  /** Matter category for element physics behavior. */
  export import MatterType = shared.api.elements.MatterType;
  /** Full definition used to register a custom element. */
  export import ElementDefinition = shared.api.elements.ElementDefinition;
  /** Options for create and replace calls. */
  export import ElementCreateOptions = shared.api.elements.ElementCreateOptions;
  /** Options for element removal. */
  export import ElementRemovalOptions = shared.api.elements.ElementRemovalOptions;
  /** Resolves a string element id to its numeric type. */
  export import getTypeFromId = shared.api.elements.getTypeFromId;
  /** Returns the definition for an element type. */
  export import getDefinitionByType = shared.api.elements.getDefinitionByType;
  /** Returns the element type at a cell, or null. */
  export import getTypeAtCell = shared.api.elements.getTypeAtCell;
  /** Returns the resolved element type at a cell, or null. */
  export import getResolvedTypeAtCell = shared.api.elements.getResolvedTypeAtCell;
  /** Returns the resolved element type from a cell id, or null. */
  export import getResolvedTypeFromCellId = shared.api.elements.getResolvedTypeFromCellId;
  /** Returns element info at a cell, or null. */
  export import getInfoAtCell = shared.api.elements.getInfoAtCell;
  /** Returns the matter type at a cell, or null. */
  export import getMatterTypeAtCell = shared.api.elements.getMatterTypeAtCell;
  /** Returns true when the cell contains the given element type. */
  export import isTypeAtCell = shared.api.elements.isTypeAtCell;
  /** Returns true when the element at the cell is free-falling. */
  export import isFreeFallingAtCell = shared.api.elements.isFreeFallingAtCell;
  /** Returns particle velocity at a cell, or null. */
  export import getVelocityAtCell = shared.api.elements.getVelocityAtCell;
  /** Returns a data field value at a cell, or null. */
  export import getDataFieldAtCell = shared.api.elements.getDataFieldAtCell;

  /** Optional tooltip metadata on structure interactions. */
  export interface InteractionStructureMetadata {
    /** i18n key for custom interaction label text. */
    textKey?: string;
    /** Hide the label when a data field matches a value. */
    crossedOutWhen?: { dataField: number; equals: number; };
    /** Show the label only when a data field matches a value. */
    visibleWhen?: { dataField: number; equals: number; };
    /** Require the text key to exist in the active locale. */
    onlyWhenTranslated?: boolean;
  }

  /** Interaction that destroys specific items. */
  export type InteractionDestroyer = {
    kind: "destroyer";
    /** Item ids removed by this interaction (for example `"drill"`). */
    items: readonly string[];
  };

  /** Interaction that affects specific structures. */
  export type InteractionStructure = InteractionStructureMetadata & {
    kind: "structure";
    /** Structure ids shown in the interaction tooltip. */
    structures: readonly string[];
  };

  /** Interaction that affects specific entities. */
  export type InteractionEntity = {
    kind: "entity";
    /** Entity type ids referenced by the interaction. */
    entities: readonly string[];
  };

  /** Interaction that marks the element as flammable. */
  export type InteractionFlammable = { kind: "flammable" };
  /** Interaction that marks the element as meltable. */
  export type InteractionMeltable = { kind: "meltable" };
  /** Interaction that marks the element as freezable. */
  export type InteractionFreezable = { kind: "freezable" };
  /** Interaction handled by custom mod logic and tooltip text. */
  export type InteractionCustom = InteractionStructureMetadata & { kind: "custom" };

  /** Union of element interaction kinds for tool and structure logic. */
  export type Interaction = InteractionDestroyer
    | InteractionStructure
    | InteractionEntity
    | InteractionFlammable
    | InteractionMeltable
    | InteractionFreezable
    | InteractionCustom;

  /** Returns all registered element type ids. */
  export function getRegisteredTypes(): ElementType[];

  /**
   * Registers a new element and returns its assigned type id.
   * @param definition - Full element definition to register.
   * @returns Object with the assigned `elementType`.
   */
  export function register(definition: ElementDefinition): { elementType: ElementType; };

  /**
   * Updates fields on an existing element definition.
   * @param elementTypeOrId - Numeric type or string id.
   * @param partial - Fields to merge onto the definition.
   */
  export function updateDefinition(elementTypeOrId: string | ElementType, partial: Partial<ElementDefinition>): void;

  /**
   * Adds an interaction entry to an element definition.
   * @param elementTypeOrId - Numeric type or string id.
   * @param interaction - Interaction entry to append.
   */
  export function addInteractionInfo(elementTypeOrId: string | ElementType, interaction: Interaction): void;

  /**
   * Returns the display name for an element type.
   * @param elementType - Numeric element type.
   */
  export function getNameByType(elementType: number): string;

  /**
   * Finds a free cell inside a structure footprint, or null.
   * @param structureCellX - Structure anchor cell column.
   * @param structureCellY - Structure anchor cell row.
   * @param structureSize - Structure footprint size in cells.
   * @returns Cell coordinates of a free cell, or null when none.
   */
  export function findFreeCellInStructure(structureCellX: number, structureCellY: number, structureSize: number): Vector2 | null;

  /**
   * Creates an element at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param elementType - Element type to place.
   * @param options - Optional spawn overrides.
   */
  export function createAtCellWhenIdle(...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]): void;

  /**
   * Replaces the element at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param elementType - Element type to place.
   * @param options - Optional spawn overrides.
   */
  export function replaceAtCellWhenIdle(...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]): void;

  /**
   * Removes the element at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param options - Optional removal flags.
   */
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: ElementRemovalOptions]): void;

  /**
   * Moves an element between cells when the simulation is idle.
   * @param fromCellX - Source cell column.
   * @param fromCellY - Source cell row.
   * @param toCellX - Destination cell column.
   * @param toCellY - Destination cell row.
   */
  export function teleportBetweenCellsWhenIdle(fromCellX: number, fromCellY: number, toCellX: number, toCellY: number): void;

  /**
   * Sets particle velocity at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param velocity - New velocity vector.
   */
  export function setVelocityAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2]): void;

  /**
   * Adds velocity to a particle at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param velocity - Velocity delta to add.
   * @param maxSpeed - Optional speed cap after the addition.
   */
  export function addParticleVelocityAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2, maxSpeed?: number]): void;

  /**
   * Converts a cell element to a particle when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param velocity - Initial particle velocity.
   */
  export function convertToParticleAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2]): void;

  /**
   * Converts a particle back to a solid element when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function convertFromParticleAtCellWhenIdle(...args: CellCoordinates): void;

  /**
   * Sets a data field on the element at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param fieldNumber - Data field index (1–4).
   * @param value - New field value.
   */
  export function setDataFieldAtCellWhenIdle(...args: [...CellCoordinates, fieldNumber: 1 | 2 | 3 | 4, value: number]): void;

  /**
   * Refreshes the rendered color at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function refreshColorAtCellWhenIdle(...args: CellCoordinates): void;

  /**
   * Sets the physics skip mode at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param physicsState - Physics skip flags for the element.
   */
  export function setPhysicsAtCellWhenIdle(...args: [...CellCoordinates, physicsState: number]): void;

  /**
   * Sets element duration at a cell when the simulation is idle.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param duration - Duration in simulation units.
   * @param options - When `updateMax` is true, also update max duration.
   */
  export function setDurationAtCellWhenIdle(...args: [...CellCoordinates, duration: number, options?: { updateMax?: boolean; }]): void;
}
