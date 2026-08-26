/** Helpers for Docsify search over generated Sandkit API Markdown. */

const IGNORE_H2 = new Set([
  "Accessors",
  "Classes",
  "Constructors",
  "Enumerations",
  "Enumeration Members",
  "Functions",
  "Interfaces",
  "Methods",
  "Modules",
  "Namespaces",
  "Overrides",
  "Properties",
  "References",
  "Type Aliases",
  "Type Parameters",
  "Variables",
]);

const SKIP_SEARCH_FILES = new Set(["_sidebar.md", "AGENTS.md"]);

/**
 * Map a path under `docs/api/` (TypeDoc layout or flat slug) to the runtime name.
 * @param {string} relPosix
 * @returns {string | null}
 */
export function apiPathToQualifiedName(relPosix) {
  let p = relPosix.replaceAll("\\", "/");
  if (!p || p.endsWith("_sidebar.md")) return null;
  if (p === "README.md" || p === "types.md") return "Sandkit API types";
  if (p === "modules.md") return "Sandkit API";
  // Template ambient aliases (`global.d.ts`) — not the live Sandkit API.
  if (p === "global" || p.startsWith("global/")) return null;

  p = p.replace(/\/README\.md$/, "");
  p = p.replace(/\.md$/, "");

  // Flat slug routes: sandkit.api.settings / sandkit.api.elements.worker
  if (p.includes(".") && !p.includes("/")) {
    if (p.endsWith(".worker")) {
      return `${p.slice(0, -".worker".length)} (worker)`;
    }
    return p;
  }

  let worker = false;
  if (p === "worker" || p.startsWith("worker/")) {
    worker = true;
    p = p === "worker" ? "sandkit/api" : p.replace(/^worker/, "sandkit/api");
  }

  if (p === "engine") return "sandkit.engine";
  if (p.startsWith("engine/")) {
    p = p.replace(/^engine/, "sandkit/engine/api");
  }

  p = p.replaceAll("/namespaces/", "/");
  p = p.replaceAll("/enumerations/", "/");

  const name = p.replaceAll("/", ".");
  return worker ? `${name} (worker)` : name;
}

/**
 * Docsify route slug for a qualified runtime name (no `.md`).
 * Example: `sandkit.api.action` → `sandkit.api.action`
 * Worker: `sandkit.api.elements (worker)` → `sandkit.api.elements.worker`
 * @param {string} qualified
 * @returns {string | null}
 */
export function qualifiedNameToSlug(qualified) {
  if (!qualified) return null;
  if (qualified === "Sandkit API") return "modules";
  if (qualified === "Sandkit API types") return "types";
  if (qualified.endsWith(" (worker)")) {
    return `${qualified.slice(0, -" (worker)".length)}.worker`;
  }
  return qualified;
}

/**
 * TypeDoc-relative path under `docs/api/` → flat slug filename (`sandkit.api.action.md`).
 * @param {string} relPosix
 * @returns {string | null}
 */
export function apiPathToRouteFile(relPosix) {
  const qualified = apiPathToQualifiedName(relPosix);
  const slug = qualifiedNameToSlug(qualified);
  return slug ? `${slug}.md` : null;
}

/**
 * Rewrite TypeDoc headings so Docsify search can match `sandkit.api.settings.get`.
 * @param {string} content
 * @param {string} qualified
 */
export function qualifyApiMarkdown(content, qualified) {
  let out = content.replace(/^# .+$/m, `# ${qualified}`);

  out = out.replace(/^## (.+)$/gm, (line, title) => {
    const name = String(title)
      .replace(/\s*<!--.*?-->\s*$/, "")
      .trim();
    if (!IGNORE_H2.has(name)) return line;
    if (String(title).includes("docsify-ignore")) return line;
    return `## ${name} <!-- {docsify-ignore} -->`;
  });

  const worker = qualified.endsWith(" (worker)");
  const base = worker ? qualified.slice(0, -" (worker)".length) : qualified;

  out = out.replace(/^### (.+)$/gm, (line, raw) => {
    const title = String(raw).trim();
    if (title.includes(":id=")) return line;

    const fn = /^([A-Za-z_][\w]*)\(\)$/.exec(title);
    const ident = /^([A-Za-z_][\w]*)$/.exec(title);
    const name = fn ? fn[1] : ident ? ident[1] : null;
    if (!name) return line;

    const core = fn ? `${base}.${name}()` : `${base}.${name}`;
    const display = worker ? `${core} (worker)` : core;
    return `### ${display} :id=${name.toLowerCase()}`;
  });

  return out;
}

/**
 * Docsify `search.paths` entries (leading slash, no `.md`).
 * @param {string} relFromDocs posix path under `docs/`
 * @returns {string | null}
 */
export function mdFileToSearchPath(relFromDocs) {
  const rel = relFromDocs.replaceAll("\\", "/");
  const base = rel.split("/").pop() || "";
  if (SKIP_SEARCH_FILES.has(base)) return null;
  if (!rel.endsWith(".md")) return null;
  // Template ambient aliases — not part of the published Sandkit API index.
  if (rel === "api/global.md" || rel.startsWith("api/global/")) return null;

  let path = `/${rel.slice(0, -".md".length)}`;
  if (path === "/README") return "/";
  return path;
}

/**
 * @param {string[]} relFiles posix paths under `docs/`
 */
export function collectSearchPaths(relFiles) {
  const paths = [];
  const seen = new Set();

  for (const rel of relFiles) {
    const path = mdFileToSearchPath(rel);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    paths.push(path);
  }

  paths.sort((a, b) => a.localeCompare(b));
  return paths;
}

/**
 * @param {string[]} paths
 */
export function renderSearchPathsScript(paths) {
  return `window.SMT_SEARCH_PATHS = ${JSON.stringify(paths, null, 2)};\n`;
}

/**
 * Rewrite `api/...` markdown hrefs using oldRel → newRel map (both under `api/`, with `.md`).
 * @param {string} content
 * @param {Map<string, string>} linkMap keys/values like `api/sandkit/api/namespaces/action/README.md`
 */
export function rewriteApiHrefMap(content, linkMap) {
  return content.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    const hashIndex = href.indexOf("#");
    const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
    if (!pathPart.startsWith("api/") || !pathPart.endsWith(".md")) return match;
    const next = linkMap.get(pathPart);
    if (!next) return match;
    return `[${label}](${next}${hash})`;
  });
}

export { IGNORE_H2 };
