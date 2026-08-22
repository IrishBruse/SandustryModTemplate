import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** Shared utilities entry — import `@modkit/ui/tailwind.css` from the mod. */
export const MODKIT_TAILWIND_CSS = join(ROOT, "modkit/ui/tailwind.css");

export const TAILWIND_CSS_FILTER = /[\\/]modkit[\\/]ui[\\/]tailwind\.css$/;

/** Docs canvas source — not a mod file, so mods stay isolated. */
export const PREVIEW_TAILWIND_CSS = join(ROOT, "docs/ui/canvas/_preview/tailwind.css");

/**
 * Absolute path of the modkit Tailwind entry when the bundle imports it.
 *
 * @param {import('esbuild').Metafile} metafile
 * @param {string} root
 * @returns {string | null}
 */
export function findTailwindCssEntry(metafile, root) {
  for (const key of Object.keys(metafile.inputs)) {
    const abs = isAbsolute(key) ? key : join(root, key);
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
    const abs = isAbsolute(key) ? key : join(root, key);
    if (!/\.(ts|tsx|js|jsx)$/.test(abs)) continue;
    if (abs.includes(`${sep}node_modules${sep}`)) continue;
    files.push(abs);
  }
  return files;
}
