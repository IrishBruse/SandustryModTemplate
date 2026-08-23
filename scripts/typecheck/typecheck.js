#!/usr/bin/env node
/**
 * Typecheck the kit, then each mod in its own project
 * so sibling mods cannot see each other's files.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverMods } from "../lib/mods.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const TSC = join(ROOT, "node_modules/typescript/bin/tsc");

function typecheck(project) {
  const result = spawnSync(process.execPath, [TSC, "--noEmit", "-p", project], {
    stdio: "inherit",
    cwd: ROOT,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

typecheck("tsconfig.json");

const mods = discoverMods();
if (mods.length === 0) {
  console.error("No mods found. Add src/<name>/mod.ts or examples/<name>/mod.ts");
  process.exit(1);
}

for (const { folder, root } of mods) {
  const project = join(root, folder, "tsconfig.json");
  if (!existsSync(join(ROOT, project))) {
    console.error(`${root}/${folder}/mod.ts has no tsconfig.json`);
    process.exit(1);
  }
  typecheck(project);

  const workerProject = join(root, folder, "tsconfig.worker.json");
  if (existsSync(join(ROOT, workerProject))) {
    typecheck(workerProject);
  }
}
