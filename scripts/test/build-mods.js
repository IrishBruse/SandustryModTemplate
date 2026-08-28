#!/usr/bin/env node
/**
 * One-shot debug bundles of src/ then examples/ into dist/ (OS mods folder).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const ESBUILD = join(ROOT, "scripts/build/esbuild.config.mjs");

export function buildModsForIntegration() {
  for (const extra of [[], ["--examples"]]) {
    const result = spawnSync(process.execPath, [ESBUILD, "--debug", ...extra], {
      cwd: ROOT,
      stdio: "inherit",
    });
    if (result.status !== 0) {
      console.error("Integration mod build failed.");
      process.exit(result.status ?? 1);
    }
  }
}
