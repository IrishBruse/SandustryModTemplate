/**
 * `sandkit.engine.api.colorPicker` — structure color palette UI helpers.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace colorPicker {
  /** Sentinel value for cycling through predefined colors. */
  export const CYCLE_COLOR: unknown;
  /** Sentinel value for no color selected. */
  export const NO_COLOR: unknown;
  /** List of predefined palette colors. */
  export const PREDEFINED_COLORS: unknown;
  /** Sentinel value for a random palette color. */
  export const RANDOM_COLOR: unknown;
  /** Close the active color palette UI. */
  export function closePalette(...args: unknown[]): unknown;
  /** Return the active palette identifier. */
  export function getActivePalette(...args: unknown[]): unknown;
  /** Return the next color in the cycle. */
  export function getCycleColor(...args: unknown[]): unknown;
  /** Return a random predefined color. */
  export function getRandomColor(...args: unknown[]): unknown;
  /** Convert a hex color string to RGBA components. */
  export function hexToRgba(...args: unknown[]): unknown;
  /** Render a color-picker button in the UI. */
  export function renderColorButton(...args: unknown[]): unknown;
  /** Render a color section in the UI. */
  export function renderColorSection(...args: unknown[]): unknown;
  /** Render the full color palette UI. */
  export function renderPalette(...args: unknown[]): unknown;
  /** Convert RGBA components to a hex color string. */
  export function rgbaToHex(...args: unknown[]): unknown;
  /** Set the active palette identifier. */
  export function setActivePalette(...args: unknown[]): unknown;
  /** Open or close the color palette UI. */
  export function togglePalette(...args: unknown[]): unknown;
}
