import { CellCoordinates, Vector2 } from "../../shared/player";
import { elements as sharedElements } from "../../shared/api/elements";

/**
 * `sandkit.api.elements` — register elements and read or change cells when idle.
 * Main thread only.
 */
export namespace elements {


  // Shared types
  /** Numeric id for a registered element type. */
  export import ElementType = sharedElements.ElementType
  /** Matter category for element physics behavior. */
  export import MatterType = sharedElements.MatterType
  /** Full definition used to register a custom element. */
  export import ElementDefinition = sharedElements.ElementDefinition
  /** Resolves a string element id to its numeric type. */
  export import getTypeFromId = sharedElements.getTypeFromId
  /** Returns the definition for an element type. */
  export import getDefinitionByType = sharedElements.getDefinitionByType
  /** Returns the element type at a cell, or null. */
  export import getTypeAtCell = sharedElements.getTypeAtCell
  /** Returns the resolved element type at a cell, or null. */
  export import getResolvedTypeAtCell = sharedElements.getResolvedTypeAtCell
  /** Returns the resolved element type from a cell id, or null. */
  export import getResolvedTypeFromCellId = sharedElements.getResolvedTypeFromCellId
  /** Returns element info at a cell, or null. */
  export import getInfoAtCell = sharedElements.getInfoAtCell
  /** Returns the matter type at a cell, or null. */
  export import getMatterTypeAtCell = sharedElements.getMatterTypeAtCell
  /** Returns true when the cell contains the given element type. */
  export import isTypeAtCell = sharedElements.isTypeAtCell
  /** Returns true when the element at the cell is free-falling. */
  export import isFreeFallingAtCell = sharedElements.isFreeFallingAtCell
  /** Returns particle velocity at a cell, or null. */
  export import getVelocityAtCell = sharedElements.getVelocityAtCell
  /** Returns a data field value at a cell, or null. */
  export import getDataFieldAtCell = sharedElements.getDataFieldAtCell


  /** Interaction that destroys specific items. */
  export type InteractionDestroyer = { kind: "destroyer", items: e };
  /** Interaction that affects specific structures. */
  export type InteractionStructure = { kind: "structure", structures: r };
  /** Interaction that affects specific entities. */
  export type InteractionEntity = { kind: "entity", entities: e };
  /** Interaction that marks the element as flammable. */
  export type InteractionFlammable = { kind: "flammable" };
  /** Interaction that marks the element as meltable. */
  export type InteractionMeltable = { kind: "meltable" };
  /** Interaction that marks the element as freezable. */
  export type InteractionFreezable = { kind: "freezable" };
  /** Interaction handled by custom mod logic. */
  export type InteractionCustom = { kind: "custom" };
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
  /** Registers a new element and returns its assigned type id. */
  export function register(definition: ElementDefinition): { elementType: ElementType; };
  /** Updates fields on an existing element definition. */
  export function updateDefinition(elementTypeOrId: string | ElementType, partial: Partial<ElementDefinition>): void;
  /** Adds an interaction entry to an element definition. */
  export function addInteractionInfo(elementTypeOrId: string | ElementType, interaction: Interaction): void;
  /** Returns the display name for an element type. */
  export function getNameByType(elementType: number): string;
  /** Finds a free cell inside a structure footprint, or null. */
  export function findFreeCellInStructure(structureCellX: number, structureCellY: number, structureSize: number): Vector2 | null;
  /** Creates an element at a cell when the simulation is idle. */
  export function createAtCellWhenIdle(...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]): void;
  /** Replaces the element at a cell when the simulation is idle. */
  export function replaceAtCellWhenIdle(...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]): void;
  /** Removes the element at a cell when the simulation is idle. */
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: ElementRemovalOptions]): void;
  /** Moves an element between cells when the simulation is idle. */
  export function teleportBetweenCellsWhenIdle(fromCellX: number, fromCellY: number, toCellX: number, toCellY: number): void;
  /** Sets particle velocity at a cell when the simulation is idle. */
  export function setVelocityAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2]): void;
  /** Adds velocity to a particle at a cell when the simulation is idle. */
  export function addParticleVelocityAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2, maxSpeed?: number]): void;
  /** Converts a cell element to a particle when the simulation is idle. */
  export function convertToParticleAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2]): void;
  /** Converts a particle back to a solid element when the simulation is idle. */
  export function convertFromParticleAtCellWhenIdle(...args: CellCoordinates): void;
  /** Sets a data field on the element at a cell when the simulation is idle. */
  export function setDataFieldAtCellWhenIdle(...args: [...CellCoordinates, fieldNumber: 1 | 2 | 3 | 4, value: number]): void;
  /** Refreshes the rendered color at a cell when the simulation is idle. */
  export function refreshColorAtCellWhenIdle(...args: CellCoordinates): void;
  /** Sets the physics skip mode at a cell when the simulation is idle. */
  export function setPhysicsAtCellWhenIdle(...args: [...CellCoordinates, physicsState: number]): void;
  /** Sets element duration at a cell when the simulation is idle. */
  export function setDurationAtCellWhenIdle(...args: [...CellCoordinates, duration: number, options?: { updateMax?: boolean; }]): void;

  /** Options for create and replace calls (not yet typed in declarations). */
  export type ElementCreateOptions = unknown
  /** Options for element removal (not yet typed in declarations). */
  export type ElementRemovalOptions = unknown
  /** Opaque item list used in destroyer and entity interactions. */
  export type e = unknown
  /** Opaque structure list used in structure interactions. */
  export type r = unknown
}

