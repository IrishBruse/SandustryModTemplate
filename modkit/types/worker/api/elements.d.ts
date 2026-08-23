import type { CellCoordinates } from "../../shared/player";
import { elements as sharedElements } from "../../shared/api/elements";

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
  export import ElementType = sharedElements.ElementType;
  /** Matter category for element physics behavior. */
  export import MatterType = sharedElements.MatterType;
  /** Full definition used to register a custom element. */
  export import ElementDefinition = sharedElements.ElementDefinition;
  /** Resolves a string element id to its numeric type. */
  export import getTypeFromId = sharedElements.getTypeFromId;
  /** Returns the definition for an element type. */
  export import getDefinitionByType = sharedElements.getDefinitionByType;
  /** Returns the element type at a cell, or null. */
  export import getTypeAtCell = sharedElements.getTypeAtCell;
  /** Returns the resolved element type at a cell, or null. */
  export import getResolvedTypeAtCell = sharedElements.getResolvedTypeAtCell;
  /** Returns the resolved element type from a cell id, or null. */
  export import getResolvedTypeFromCellId = sharedElements.getResolvedTypeFromCellId;
  /** Returns element info at a cell, or null. */
  export import getInfoAtCell = sharedElements.getInfoAtCell;
  /** Returns the matter type at a cell, or null. */
  export import getMatterTypeAtCell = sharedElements.getMatterTypeAtCell;
  /** Returns true when the cell contains the given element type. */
  export import isTypeAtCell = sharedElements.isTypeAtCell;
  /** Returns true when the element at the cell is free-falling. */
  export import isFreeFallingAtCell = sharedElements.isFreeFallingAtCell;
  /** Returns particle velocity at a cell, or null. */
  export import getVelocityAtCell = sharedElements.getVelocityAtCell;
  /** Returns a data field value at a cell, or null. */
  export import getDataFieldAtCell = sharedElements.getDataFieldAtCell;

  /** Create an element at a cell immediately on this worker. Main thread: use `createAtCellWhenIdle`. */
  export function createAtCell(
    ...args: [...CellCoordinates, elementType: ElementType, options?: unknown]
  ): void;
}
