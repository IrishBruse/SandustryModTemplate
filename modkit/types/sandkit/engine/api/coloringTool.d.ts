/**
 * `sandkit.engine.api.coloringTool` — paint-bucket and flood-fill structure coloring.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace coloringTool {
  /**
   * Apply a color to one structure.
   * @param args - Game state first, then method-specific arguments.
   */
  export function colorStructure(...args: unknown[]): unknown;
  /**
   * Flood-fill connected structures with a color.
   * @param args - Game state first, then method-specific arguments.
   */
  export function floodFillColor(...args: unknown[]): unknown;
  /**
   * Return the color on a structure.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getColor(...args: unknown[]): unknown;
  /**
   * Return whether a structure can be colored.
   * @param args - Game state first, then method-specific arguments.
   */
  export function isColorableStructure(...args: unknown[]): unknown;
  /**
   * Return whether match-color mode is active.
   * @param args - Game state first, then method-specific arguments.
   */
  export function isMatchColorMode(...args: unknown[]): unknown;
  /**
   * Return whether paint-bucket mode is active.
   * @param args - Game state first, then method-specific arguments.
   */
  export function isPaintBucketMode(...args: unknown[]): unknown;
  /**
   * Set the color on a structure.
   * @param args - Game state first, then method-specific arguments.
   */
  export function setColor(...args: unknown[]): unknown;
  /**
   * Toggle match-color mode on or off.
   * @param args - Game state first, then method-specific arguments.
   */
  export function toggleMatchColorMode(...args: unknown[]): unknown;
  /**
   * Toggle paint-bucket mode on or off.
   * @param args - Game state first, then method-specific arguments.
   */
  export function togglePaintBucketMode(...args: unknown[]): unknown;
}
