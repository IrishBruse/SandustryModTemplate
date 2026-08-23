/**
 * Tool-specific API helpers.
 *
 * Available as `sandkit.api.tools`.
 *
 * @module
 */
export namespace tools {
  /** Grabber tool size and state. */
  export namespace grabber {
    /**
     * Set grabber radius size.
     * @param size - Grab radius in cells.
     */
    export function setSize(size: number): void;

    /**
     * Return current grabber radius size.
     * @returns Grab radius in cells.
     */
    export function getSize(): number;

    /**
     * Return true when grabber tool is active.
     * @returns True when the grabber is the active tool.
     */
    export function isActive(): boolean;

    /**
     * Return true when grabber holds elements.
     * @returns True when the grabber buffer is not empty.
     */
    export function isLoaded(): boolean;
  }
}
