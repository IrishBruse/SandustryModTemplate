import assert from "node:assert/strict";
import * as esbuild from "esbuild";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { modkitAliasPlugin } from "./modkit-alias.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("esbuild rejects @modkit/test in a game bundle", async () => {
  const result = await esbuild
    .build({
      stdin: {
        contents: 'import "@modkit/test";',
        resolveDir: ROOT,
        sourcefile: "bundle-entry.js",
      },
      bundle: true,
      write: false,
      logLevel: "silent",
      plugins: [modkitAliasPlugin(join(ROOT, "modkit"))],
    })
    .catch((error) => error);

  assert.ok(result instanceof Error);
  assert.match(String(result), /Node tests only/);
});
