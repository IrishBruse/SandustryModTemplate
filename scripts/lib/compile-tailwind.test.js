import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  bundledContentFiles,
  findTailwindCssEntry,
  metafileInputPath,
  MODKIT_TAILWIND_CSS,
} from "./compile-tailwind.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("metafileInputPath keeps Windows drive paths (no false namespace strip)", () => {
  assert.equal(metafileInputPath("C:/repo/src/main.ts", "/root"), "C:/repo/src/main.ts");
  assert.equal(metafileInputPath("C:\\repo\\src\\main.ts", "/root"), "C:\\repo\\src\\main.ts");
});

test("metafileInputPath strips esbuild namespace from Windows and POSIX paths", () => {
  assert.equal(
    metafileInputPath("modkit-css:C:\\repo\\modkit\\ui\\tailwind.css", "/root"),
    "C:\\repo\\modkit\\ui\\tailwind.css",
  );
  assert.equal(
    metafileInputPath("modkit-css:C:/repo/modkit/ui/tailwind.css", "/root"),
    "C:/repo/modkit/ui/tailwind.css",
  );
  assert.equal(
    metafileInputPath("modkit-css:/home/me/repo/modkit/ui/tailwind.css", "/root"),
    "/home/me/repo/modkit/ui/tailwind.css",
  );
  assert.equal(
    metafileInputPath("modkit-css:modkit/ui/tailwind.css", "/root"),
    join("/root", "modkit/ui/tailwind.css"),
  );
});

test("findTailwindCssEntry returns a readable path for namespaced Windows-style keys", () => {
  const entry = findTailwindCssEntry(
    {
      inputs: {
        [`modkit-css:${MODKIT_TAILWIND_CSS}`]: {},
        "src/main.ts": {},
      },
    },
    ROOT,
  );
  assert.equal(entry, MODKIT_TAILWIND_CSS);
  assert.match(readFileSync(entry, "utf8"), /@tailwind/);
});

test("findTailwindCssEntry matches backslash Windows modkit paths", () => {
  const winKey = "modkit-css:C:\\Users\\me\\SandustryModTemplate\\modkit\\ui\\tailwind.css";
  const entry = findTailwindCssEntry({ inputs: { [winKey]: {}, "src/main.ts": {} } }, ROOT);
  assert.equal(entry, "C:\\Users\\me\\SandustryModTemplate\\modkit\\ui\\tailwind.css");
});

test("bundledContentFiles skips node_modules with either separator", () => {
  mkdirSync(join(ROOT, ".tmp"), { recursive: true });
  const dir = mkdtempSync(join(ROOT, ".tmp", "tw-content-"));
  try {
    const local = join(dir, "main.ts");
    writeFileSync(local, "export {};\n");
    const files = bundledContentFiles(
      {
        inputs: {
          [local]: {},
          "C:/repo/node_modules/pkg/index.ts": {},
          "C:\\repo\\node_modules\\pkg\\index.ts": {},
        },
      },
      ROOT,
    );
    assert.deepEqual(files, [local]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
