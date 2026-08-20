import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { readFileSync } from "node:fs";
import { dirname, isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const CSS_ENTRY = join(ROOT, "src/ui/tailwind.css");

export const TAILWIND_CSS_FILTER = /[\\/]src[\\/]ui[\\/]tailwind\.css$/;

/**
 * Compile `@tailwind utilities` for the given content files or globs.
 * Preflight stays off so a second reset does not fight the game HUD.
 *
 * @param {string[]} content
 * @returns {Promise<string>}
 */
export async function compileTailwindUtilities(content) {
  const source = readFileSync(CSS_ENTRY, "utf8");
  const result = await postcss([
    tailwindcss({
      content,
      corePlugins: { preflight: false },
    }),
  ]).process(source, { from: CSS_ENTRY });
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
