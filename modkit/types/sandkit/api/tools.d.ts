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
    /** Set grabber radius size. */
    export function setSize(size: number): void;
    /** Return current grabber radius size. */
    export function getSize(): number;
    /** Return true when grabber tool is active. */
    export function isActive(): boolean;
    /** Return true when grabber holds elements. */
    export function isLoaded(): boolean;
  }
}
