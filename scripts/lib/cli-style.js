/**
 * TTY-aware ANSI styles for CLI scripts (`util.styleText`).
 * Respects NO_COLOR / non-TTY automatically.
 */
import { styleText as st } from "node:util";

export { st as styleText };

/**
 * `key: value` with a cyan key.
 * @param {string} key
 * @param {string} value
 */
export function kv(key, value) {
  return `${st("cyan", key)}${st("dim", ":")} ${value}`;
}
