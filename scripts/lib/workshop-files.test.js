import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  findWorkshopLinkIssues,
  workshopDescriptionText,
  workshopMarkdownToBbcode,
} from "./workshop-files.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("workshopMarkdownToBbcode converts headings, bold, and lists", () => {
  const bbcode = workshopMarkdownToBbcode(`# Title

**Tagline**

Body with **bold**.

## Section

1. First
2. Second

- Bullet
`);
  assert.match(bbcode, /^\[h1\]Title\[\/h1\]/);
  assert.match(bbcode, /^\[b\]Tagline\[\/b\]$/m);
  assert.match(bbcode, /Body with \[b\]bold\[\/b\]\./);
  assert.match(bbcode, /\[h2\]Section\[\/h2\]/);
  assert.match(bbcode, /\[olist\]\n\[\*\]First\n\[\*\]Second\n\[\/olist\]/);
  assert.match(bbcode, /\[list\]\n\[\*\]Bullet\n\[\/list\]/);
});

test("findWorkshopLinkIssues flags markdown links and raw URLs", () => {
  const issues = findWorkshopLinkIssues(`# Title

See [docs](https://example.com/page).

Visit https://example.com for more.
`);
  assert.equal(issues.length, 2);
  assert.equal(issues[0]?.kind, "markdown link");
  assert.equal(issues[1]?.kind, "URL");
});

test("workshopDescriptionText rejects workshop.md with links", () => {
  const dir = join(ROOT, ".tmp/workshop-link-test");
  const workshop = join(dir, "workshop");
  mkdirSync(workshop, { recursive: true });
  writeFileSync(join(workshop, "workshop.md"), "# Mod\n\n[bad](https://example.com)\n", "utf8");
  assert.throws(() => workshopDescriptionText(dir), /must not contain links or URLs/);
});
