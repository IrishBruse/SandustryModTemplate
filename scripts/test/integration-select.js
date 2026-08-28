/**
 * Select integration test files for `--mod` / `--examples`.
 */
import { discoverMods, parseModFilters } from "../lib/mods.js";

/**
 * Keep files under one of the repo-relative prefixes.
 * `null` or an empty list keeps every file.
 *
 * @param {string[]} files
 * @param {string[] | null} [repoPaths]
 * @returns {string[]}
 */
export function filterIntegrationFiles(files, repoPaths) {
  const unique = [...new Set(files)];
  if (!repoPaths || repoPaths.length === 0) return unique.sort();
  const prefixes = repoPaths.map((path) => path.replaceAll("\\", "/").replace(/\/+$/, ""));
  return unique
    .filter((file) => {
      const normalized = file.replaceAll("\\", "/");
      return prefixes.some(
        (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
      );
    })
    .sort();
}

/**
 * Repo-relative folders whose `*.integration.test.ts` files should run.
 * `null` means the full suite.
 *
 * @param {string[]} argv
 * @param {{ folder: string; root: string; repoPath: string }[]} [discovered]
 * @returns {string[] | null}
 */
export function integrationTestRepoPaths(argv, discovered = discoverMods()) {
  const filters = parseModFilters(argv);
  const examplesOnly = argv.includes("--examples");
  if (filters.length > 0) {
    return filters.map((folder) => {
      const mod = discovered.find((entry) => entry.folder === folder);
      if (!mod) {
        throw new Error(
          `Unknown --mod ${JSON.stringify(folder)}. Found: ${discovered.map((entry) => entry.folder).join(", ")}`,
        );
      }
      if (examplesOnly && mod.root !== "examples") {
        throw new Error(`--mod ${JSON.stringify(folder)} is not under examples/`);
      }
      return mod.repoPath;
    });
  }
  if (examplesOnly) return ["examples"];
  return null;
}
