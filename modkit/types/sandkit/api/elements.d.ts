import { CellCoordinates, Vector2 } from "../../shared/player";
import { elements as sharedElements } from "../../shared/api/elements";

export namespace elements {


  // Shared types
  export import ElementType = sharedElements.ElementType
  export import MatterType = sharedElements.MatterType
  export import ElementDefinition = sharedElements.ElementDefinition
  export import getTypeFromId = sharedElements.getTypeFromId
  export import getDefinitionByType = sharedElements.getDefinitionByType
  export import getTypeAtCell = sharedElements.getTypeAtCell
  export import getResolvedTypeAtCell = sharedElements.getResolvedTypeAtCell
  export import getResolvedTypeFromCellId = sharedElements.getResolvedTypeFromCellId
  export import getInfoAtCell = sharedElements.getInfoAtCell
  export import getMatterTypeAtCell = sharedElements.getMatterTypeAtCell
  export import isTypeAtCell = sharedElements.isTypeAtCell
  export import isFreeFallingAtCell = sharedElements.isFreeFallingAtCell
  export import getVelocityAtCell = sharedElements.getVelocityAtCell
  export import getDataFieldAtCell = sharedElements.getDataFieldAtCell


  export type InteractionDestroyer = { kind: "destroyer", items: e };
  export type InteractionStructure = { kind: "structure", structures: r };
  export type InteractionEntity = { kind: "entity", entities: e };
  export type InteractionFlammable = { kind: "flammable" };
  export type InteractionMeltable = { kind: "meltable" };
  export type InteractionFreezable = { kind: "freezable" };
  export type InteractionCustom = { kind: "custom" };
  export type Interaction = InteractionDestroyer
    | InteractionStructure
    | InteractionEntity
    | InteractionFlammable
    | InteractionMeltable
    | InteractionFreezable
    | InteractionCustom;

  export function getRegisteredTypes(): ElementType[];
  export function register(definition: ElementDefinition): { elementType: ElementType; };
  export function updateDefinition(elementTypeOrId: string | ElementType, partial: Partial<ElementDefinition>): void;
  export function addInteractionInfo(elementTypeOrId: string | ElementType, interaction: Interaction): void;
  export function getNameByType(elementType: number): string;
  export function findFreeCellInStructure(structureCellX: number, structureCellY: number, structureSize: number): Vector2 | null;
  export function createAtCellWhenIdle(...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]): void;
  export function replaceAtCellWhenIdle(...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]): void;
  export function removeAtCellWhenIdle(...args: [...CellCoordinates, options?: ElementRemovalOptions]): void;
  export function teleportBetweenCellsWhenIdle(fromCellX: number, fromCellY: number, toCellX: number, toCellY: number): void;
  export function setVelocityAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2]): void;
  export function addParticleVelocityAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2, maxSpeed?: number]): void;
  export function convertToParticleAtCellWhenIdle(...args: [...CellCoordinates, velocity: Vector2]): void;
  export function convertFromParticleAtCellWhenIdle(...args: CellCoordinates): void;
  export function setDataFieldAtCellWhenIdle(...args: [...CellCoordinates, fieldNumber: 1 | 2 | 3 | 4, value: number]): void;
  export function refreshColorAtCellWhenIdle(...args: CellCoordinates): void;
  export function setPhysicsAtCellWhenIdle(...args: [...CellCoordinates, physicsState: number]): void;
  export function setDurationAtCellWhenIdle(...args: [...CellCoordinates, duration: number, options?: { updateMax?: boolean; }]): void;

  export type ElementCreateOptions = unknown
  export type ElementRemovalOptions = unknown
  export type e = unknown
  export type r = unknown
}

