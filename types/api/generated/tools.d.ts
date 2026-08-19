/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Grabber helpers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiTools {
  grabber: ApiToolsGrabber;
}
export interface ApiToolsGrabber {
  /** Return size. */
  getSize: () => number;
  /** Return whether active. */
  isActive: () => boolean;
  /** Return whether loaded. */
  isLoaded: () => boolean;
  /**
   * Set size.
   * @param size size.
   */
  setSize: (size: number) => void;
}
export type ApiToolsNamespace = ApiTools;
