/**
 * Clone sandustry-modding/SandustryExamples into examples/ when that folder is missing.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { styleText } from "./cli-style.js";

export const EXAMPLES_REMOTE = "https://github.com/sandustry-modding/SandustryExamples.git";

/**
 * @param {{ status?: number | null }} result
 * @returns {number}
 */
function cloneStatus(result) {
  return result.status ?? 1;
}

/**
 * @param {string} repoRoot Template repository root
 * @param {{ clone?: (args: string[]) => { status?: number | null } }} [deps]
 * @returns {string} Absolute `examples/` path
 */
export function ensureExamplesRepo(repoRoot, deps = {}) {
  const dest = join(repoRoot, "examples");
  if (existsSync(join(dest, ".git"))) return dest;
  if (existsSync(dest)) {
    throw new Error(
      `examples/ exists but is not a git clone of ${EXAMPLES_REMOTE}. Remove examples/ or clone that repository into examples/.`,
    );
  }

  console.log(styleText(["bold", "cyan"], "Cloning SandustryExamples into examples/"));
  const clone =
    deps.clone ?? ((args) => spawnSync("git", args, { cwd: repoRoot, stdio: "inherit" }));
  const result = clone(["clone", EXAMPLES_REMOTE, "examples"]);
  if (cloneStatus(result) !== 0) {
    throw new Error(`Failed to clone ${EXAMPLES_REMOTE} into examples/.`);
  }
  return dest;
}
