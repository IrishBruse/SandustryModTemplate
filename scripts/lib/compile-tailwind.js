import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** Any mod's `src/<name>/ui/tailwind.css`. */
export const TAILWIND_CSS_FILTER = /[\\/]src[\\/][^/\\]+[\\/]ui[\\/]tailwind\.css$/;

/** Docs canvas source — not a mod file, so mods stay isolated. */
export const PREVIEW_TAILWIND_CSS = join(ROOT, "docs/ui/canvas/_preview/tailwind.css");

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
