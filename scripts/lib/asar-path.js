/**
 * Paths from `@electron/asar` `listPackage` (leading `/` or `\` + platform separators).
 * Use {@link asarRelPath} for dest joins and comparisons; {@link asarExtractPath} for extractFile.
 */

/**
 * Forward-slash relative path for disk joins and bundle matching.
 * @param {string} listed
 * @returns {string}
 */
export function asarRelPath(listed) {
  return String(listed).replaceAll("\\", "/").replace(/^\//, "");
}

/**
 * Path for `extractFile` / `getFile` (same rule as asar `extractAll`: drop one leading separator).
 * Keep `\` on Windows — asar walks with `path.sep`, so forward slashes fail there.
 * @param {string} listed
 * @returns {string}
 */
export function asarExtractPath(listed) {
  return String(listed).replace(/^[/\\]/, "");
}
