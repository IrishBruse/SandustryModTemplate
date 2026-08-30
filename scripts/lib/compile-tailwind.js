import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** Shared utilities entry — import `@modkit/ui/tailwind.css` from the mod. */
export const MODKIT_TAILWIND_CSS = join(ROOT, "modkit/ui/tailwind.css");

/** Options slider chrome — import `@modkit/ui/options.css` when you use OptionsSlider. */
export const MODKIT_OPTIONS_CSS_ENTRY = join(ROOT, "modkit/ui/options.css");
export const MODKIT_OPTIONS_CSS = join(ROOT, "modkit/ui/options/options.css");

export const TAILWIND_CSS_FILTER = /[\\/]modkit[\\/]ui[\\/]tailwind\.css$/;
export const OPTIONS_CSS_FILTER = /[\\/]modkit[\\/]ui[\\/]options\.css$/;
export const MODKIT_UI_CSS_FILTER = /[\\/]modkit[\\/]ui[\\/](?:tailwind|options)\.css$/;

/** @returns {string} */
export function readModkitOptionsCss() {
  return readFileSync(MODKIT_OPTIONS_CSS, "utf8");
}

/** Windows drive path or UNC, even when this process runs on POSIX (unit tests). */
function isWindowsAbsolute(p) {
  return /^[A-Za-z]:[\\/]/.test(p) || p.startsWith("\\\\");
}

/** True for host-absolute paths and Windows-shaped absolutes. */
function isFsAbsolute(p) {
  return isAbsolute(p) || isWindowsAbsolute(p) || p.startsWith("/");
}

/**
 * Resolve an esbuild metafile input key to a filesystem path.
 * Keys may be plain paths or `namespace:path` (for example `modkit-css:C:\\…\\tailwind.css`).
 * Do not treat a Windows drive letter (`C:`) as an esbuild namespace.
 * @param {string} key
 * @param {string} root
 * @returns {string}
 */
export function metafileInputPath(key, root) {
  const ns = /^([A-Za-z_][\w-]*):(.*)$/.exec(key);
  if (ns && ns[1].length > 1) {
    const rest = ns[2];
    if (rest && isFsAbsolute(rest)) return rest;
    if (rest) return join(root, rest);
  }
  if (isFsAbsolute(key)) return key;
  return join(root, key);
}

/**
 * Absolute path of the modkit Tailwind entry when the bundle imports it.
 *
 * @param {import('esbuild').Metafile} metafile
 * @param {string} root
 * @returns {string | null}
 */
export function findTailwindCssEntry(metafile, root) {
  for (const key of Object.keys(metafile.inputs)) {
    const abs = metafileInputPath(key, root);
    if (TAILWIND_CSS_FILTER.test(abs)) return abs;
  }
  return null;
}

/**
 * Compile `@tailwind utilities` for the given content files or globs.
 * Preflight stays off so a second reset does not fight the game HUD.
 *
 * @param {string[]} content
 * @param {string} cssEntry
 * @returns {Promise<string>}
 */
export async function compileTailwindUtilities(content, cssEntry) {
  const source = readFileSync(cssEntry, "utf8");
  const result = await postcss([
    tailwindcss({
      content,
      corePlugins: { preflight: false },
    }),
  ]).process(source, { from: cssEntry });
  return result.css;
}

/**
 * Source files esbuild actually bundled. Unused modkit UI is omitted.
 *
 * @param {import('esbuild').Metafile} metafile
 * @param {string} root
 * @returns {string[]}
 */
export function bundledContentFiles(metafile, root) {
  const files = [];
  for (const key of Object.keys(metafile.inputs)) {
    const abs = metafileInputPath(key, root);
    if (!/\.(ts|tsx|js|jsx)$/.test(abs)) continue;
    if (/[/\\]node_modules[/\\]/.test(abs)) continue;
    files.push(abs);
  }
  return files;
}
