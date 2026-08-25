#!/usr/bin/env node
/**
 * Generate Docsify Markdown API reference from modkit/types declarations.
 * Usage: npm run docs:api
 *
 * TypeDoc runs from scripts/docs/ with TypeScript 5.9 (TypeDoc does not support TS 7 yet).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  apiPathToQualifiedName,
  collectSearchPaths,
  qualifyApiMarkdown,
  renderSearchPathsScript,
} from "./api-search.mjs";
import { npmCli } from "../lib/npm-cli.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const DOCS_SCRIPTS = join(ROOT, "scripts/docs");
const DOCS = join(ROOT, "docs");
const OUT = join(DOCS, "api");
const TYPEDOC = join(DOCS_SCRIPTS, "node_modules/typedoc/bin/typedoc");
const CONFIG = join(DOCS_SCRIPTS, "typedoc.json");

function ensureDocsDeps() {
  if (existsSync(TYPEDOC)) return;
  console.log("Installing docs generator deps in scripts/docs/ …");
  const install = spawnSync(npmCli(), ["install", "--no-audit", "--no-fund"], {
    cwd: DOCS_SCRIPTS,
    stdio: "inherit",
    windowsHide: true,
  });
  if (install.status !== 0) process.exit(install.status ?? 1);
}

ensureDocsDeps();

if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true, force: true });
}

const result = spawnSync(process.execPath, [TYPEDOC, "--options", CONFIG], {
  stdio: "inherit",
  cwd: DOCS_SCRIPTS,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

fixDocsifyLinks(OUT);
highlightTypeDocSignatures(OUT);
qualifyApiPages(OUT);
writeApiSidebar(OUT);
writeSearchPaths(DOCS);

console.log("Wrote API docs to docs/api/");

/**
 * Docsify resolves links from the docs root, not the current page. Rewrite relative
 * TypeDoc links so they include the `api/` prefix from `docs/`.
 */
function fixDocsifyLinks(outDir) {
  for (const filePath of walkMarkdownFiles(outDir)) {
    if (filePath.endsWith("_sidebar.md")) continue;

    const pageDir = dirname(filePath);
    const relPageDir = toPosixPath(pageDir.slice(outDir.length + 1));
    const content = readFileSync(filePath, "utf8");
    const fixed = content.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
      const rewritten = rewriteDocsifyHref(href, relPageDir);
      return rewritten === href ? match : `[${label}](${rewritten})`;
    });

    if (fixed !== content) writeFileSync(filePath, fixed);
  }
}

function rewriteDocsifyHref(href, relPageDir) {
  if (
    !href ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("/")
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";

  if (!pathPart || !pathPart.endsWith(".md")) return href;

  const resolved = normalize(join(relPageDir, pathPart));
  if (resolved.startsWith("..")) return href;

  return `api/${toPosixPath(resolved)}${hash}`;
}

function walkMarkdownFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
  }

  return files;
}

function toPosixPath(path) {
  return path.split("\\").join("/");
}

/**
 * TypeDoc emits API signatures as blockquotes. Rewrite them to fenced TypeScript
 * so Docsify + Prism can syntax-highlight names, types, and keywords.
 */
function highlightTypeDocSignatures(outDir) {
  for (const filePath of walkMarkdownFiles(outDir)) {
    if (filePath.endsWith("_sidebar.md")) continue;

    const content = readFileSync(filePath, "utf8");
    const fixed = content.replace(/^> (.+)$/gm, (match, body) => {
      return `\`\`\`ts\n${typedocSignatureToTs(body)}\n\`\`\``;
    });

    if (fixed !== content) writeFileSync(filePath, fixed);
  }
}

function typedocSignatureToTs(source) {
  let line = source;

  line = line.replace(/\\([[\]{}<>|\\])/g, "$1");
  line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  line = line.replace(/\*\*([^*]+)\*\*/g, "$1");
  line = line.replace(/`([^`]+)`/g, "$1");

  return line.trim();
}

/** Docsify sidebar for pages under docs/api/ (generated; do not edit by hand). */
function writeApiSidebar(outDir) {
  const p = (path) => `api/${path}`;

  const lines = [
    "- [← Docs home](/)",
    `- [Overview](${p("README.md")} 'Sandkit API')`,
    `- [Module index](${p("modules.md")})`,
    "",
    "- Globals",
    `  - [global](${p("global/README.md")})`,
    "",
    "- Main thread (`sandkit.api`)",
    ...indentNamespaceLinks(outDir, "sandkit/api", p),
    "",
    "- Worker (`sandkit.api`)",
    ...indentNamespaceLinks(outDir, "worker", p),
    "",
    "- Engine (`sandkit.engine`)",
    ...indentNamespaceLinks(outDir, "engine", p),
    "",
    "- Other",
    `  - [sandkit](${p("sandkit/README.md")})`,
    `  - [enums](${p("sandkit/enums/README.md")})`,
    `  - [react](${p("sandkit/react/README.md")})`,
    "",
    "- Shared domain types",
    `  - [asset](${p("shared/asset/README.md")})`,
    `  - [engine](${p("shared/engine/README.md")})`,
    `  - [jsonvalue](${p("shared/jsonvalue/README.md")})`,
    `  - [player](${p("shared/player/README.md")})`,
    "",
  ];

  writeFileSync(join(outDir, "_sidebar.md"), `${lines.join("\n")}\n`);
}

function qualifyApiPages(outDir) {
  for (const filePath of walkMarkdownFiles(outDir)) {
    if (filePath.endsWith("_sidebar.md")) continue;

    const rel = toPosixPath(filePath.slice(outDir.length + 1));
    const qualified = apiPathToQualifiedName(rel);
    if (!qualified) continue;

    const content = readFileSync(filePath, "utf8");
    const fixed = qualifyApiMarkdown(content, qualified);
    if (fixed !== content) writeFileSync(filePath, fixed);
  }
}

function writeSearchPaths(docsDir) {
  const relFiles = walkMarkdownFiles(docsDir).map((filePath) =>
    toPosixPath(relative(docsDir, filePath)),
  );
  const script = renderSearchPathsScript(collectSearchPaths(relFiles));
  writeFileSync(join(docsDir, "assets/search-paths.js"), script);
}

function indentNamespaceLinks(outDir, modulePath, prefixPath) {
  const nsDir = join(outDir, modulePath, "namespaces");
  if (!existsSync(nsDir)) return ["  - _(no namespaces)_"];

  return readdirSync(nsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => `  - [${name}](${prefixPath(`${modulePath}/namespaces/${name}/README.md`)})`);
}
