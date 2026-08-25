/**
 * Normalize paths from `@electron/asar` `listPackage`.
 * Windows returns leading backslashes (`\dist\js\bundle.js`); extractFile wants `dist/js/bundle.js`.
 * @param {string} listed
 * @returns {string}
 */
export function asarRelPath(listed) {
  return String(listed).replaceAll("\\", "/").replace(/^\//, "");
}
