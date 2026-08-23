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
  export import ElementType = sharedElements.ElementType;
  export import MatterType = sharedElements.MatterType;
  export import ElementDefinition = sharedElements.ElementDefinition;
  export import getTypeFromId = sharedElements.getTypeFromId;
  export import getDefinitionByType = sharedElements.getDefinitionByType;
  export import getTypeAtCell = sharedElements.getTypeAtCell;
  export import getResolvedTypeAtCell = sharedElements.getResolvedTypeAtCell;
  export import getResolvedTypeFromCellId = sharedElements.getResolvedTypeFromCellId;
  export import getInfoAtCell = sharedElements.getInfoAtCell;
  export import getMatterTypeAtCell = sharedElements.getMatterTypeAtCell;
  export import isTypeAtCell = sharedElements.isTypeAtCell;
  export import isFreeFallingAtCell = sharedElements.isFreeFallingAtCell;
  export import getVelocityAtCell = sharedElements.getVelocityAtCell;
  export import getDataFieldAtCell = sharedElements.getDataFieldAtCell;

  /**
   * Create an element at a cell immediately on this worker.
   * Main thread: use `createAtCellWhenIdle` instead.
   */
  export function createAtCell(
    ...args: [...CellCoordinates, elementType: ElementType, options?: unknown]
  ): void;
}
