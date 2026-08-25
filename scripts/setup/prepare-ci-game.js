/**
 * Build a minimal fake Sandustry install for CI (`npm run setup` without Steam).
 * Writes `.tmp/ci-sandustry/` with a binary and `resources/app.asar` that contains sandkit.
 *
 * Usage: node scripts/setup/prepare-ci-game.js
 * Prints the binary path on stdout (last line).
 */
import { createPackage } from "@electron/asar";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const DEST = join(ROOT, ".tmp", "ci-sandustry");
const ASAR_SRC = join(ROOT, ".tmp", "ci-asar-src");
const BINARY_NAME = process.platform === "win32" ? "Sandustry.exe" : "sandustry";
const BINARY = join(DEST, BINARY_NAME);

rmSync(DEST, { recursive: true, force: true });
rmSync(ASAR_SRC, { recursive: true, force: true });

mkdirSync(join(ASAR_SRC, "dist", "js"), { recursive: true });
writeFileSync(join(ASAR_SRC, "dist", "js", "bundle.js"), "// sandkit fixture for CI\n");
writeFileSync(join(ASAR_SRC, "index.html"), "<!doctype html>\n");

mkdirSync(join(DEST, "resources"), { recursive: true });
writeFileSync(BINARY, "");
await createPackage(ASAR_SRC, join(DEST, "resources", "app.asar"));

console.error(`Fake Sandustry install: ${DEST}`);
console.log(BINARY);
