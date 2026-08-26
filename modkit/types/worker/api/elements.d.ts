import type { CellCoordinates } from "../../shared/player";
import { shared } from "../../shared";

/**
 * Worker-thread `sandkit.api.elements` — shared reads plus direct mutations.
 *
 * Main thread uses `*WhenIdle` helpers instead of `createAtCell` /
 * `replaceAtCell` / `removeAtCell`. Built on {@link elements} base shapes.
 *
 * @internal Worker extension; not interchangeable with main-thread
 * `sandkit.api.elements`.
 */
export namespace elements {
  /** Numeric id for a registered element type. */
  export import ElementType = shared.api.elements.ElementType;
  /** Mod or built-in element string id. */
  export import ElementId = shared.api.elements.ElementId;
  /** Type handle or string id accepted by lookup helpers. */
  export import ElementRef = shared.api.elements.ElementRef;
  /** Matter category for element physics behavior. */
  export import MatterType = shared.api.elements.MatterType;
  /** Full definition used to register a custom element. */
  export import ElementDefinition = shared.api.elements.ElementDefinition;
  /** Options for {@link createAtCell}. */
  export import ElementCreateOptions = shared.api.elements.ElementCreateOptions;
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

  /**
   * Create an element at a cell immediately on this worker.
   * Main thread: use `createAtCellWhenIdle`.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param elementType - Element type to place.
   * @param options - Optional spawn overrides.
   */
  export function createAtCell(
    ...args: [...CellCoordinates, elementType: ElementType, options?: ElementCreateOptions]
  ): void;
}
