#!/usr/bin/env node
/**
 * Link scripts/git/commit-msg.js into this repo's .git/hooks/commit-msg.
 * Uses --absolute-git-dir so a global core.hooksPath does not receive the link.
 * No-op when this tree is not a git checkout.
 */
import { execSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const hookSource = join(root, "scripts/git/commit-msg.js");

let gitDir;
try {
  gitDir = execSync("git rev-parse --absolute-git-dir", {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  process.exit(0);
}

if (!gitDir || !existsSync(hookSource)) process.exit(0);

const hooksAbs = join(gitDir, "hooks");
mkdirSync(hooksAbs, { recursive: true });
const dest = join(hooksAbs, "commit-msg");
rmSync(dest, { force: true });
symlinkSync(relative(hooksAbs, hookSource), dest);
chmodSync(hookSource, 0o755);
