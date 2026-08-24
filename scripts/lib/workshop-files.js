/**
 * Files under `src/<name>/workshop/` (Steam listing assets).
 * The build copies `workshop.json` and previews to the installed mod root.
 * `workshop.md` is converted to Steam BBCode when you publish.
 * `README.md`, `CHANGELOG.md`, and `workshop/screenshots/` stay in the repo only.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const WORKSHOP_PREVIEW_NAMES = ["preview.gif", "preview.png"];
/** SteamCMD creates a new Workshop item when `publishedfileid` is `"0"`. */
export const WORKSHOP_NEW_ITEM_ID = "0";
const PUBLISHED_FILE_ID_PATTERN = /^[1-9]\d*$/;

/** @param {string} value */
export function isValidPublishedFileId(value) {
  return typeof value === "string" && PUBLISHED_FILE_ID_PATTERN.test(value);
}

/** @param {string} modDir */
export function workshopDir(modDir) {
  return join(modDir, "workshop");
}

/**
 * @param {string} modDir
 * @returns {{ schemaVersion: 1; publishedFileId: string | null } | null}
 */
export function readWorkshopManifest(modDir) {
  const file = join(workshopDir(modDir), "workshop.json");
  if (!existsSync(file)) return null;
  const value = JSON.parse(readFileSync(file, "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value) || value.schemaVersion !== 1) {
    throw new Error(`Invalid workshop.json: ${file}`);
  }
  const raw = typeof value.publishedFileId === "string" ? value.publishedFileId.trim() : "";
  return {
    schemaVersion: 1,
    publishedFileId: isValidPublishedFileId(raw) ? raw : null,
  };
}

/**
 * @param {string} modDir
 * @param {string} publishedFileId
 */
export function writeWorkshopManifest(modDir, publishedFileId) {
  if (!isValidPublishedFileId(publishedFileId)) {
    throw new Error(`Invalid publishedFileId: ${publishedFileId}`);
  }
  const dir = workshopDir(modDir);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "workshop.json");
  writeFileSync(
    file,
    `${JSON.stringify({ schemaVersion: 1, publishedFileId }, null, 2)}\n`,
    "utf8",
  );
}

/**
 * Read the item id SteamCMD writes into the upload VDF after a successful build.
 * @param {string} vdfText
 * @returns {string | null}
 */
export function parsePublishedFileIdFromVdf(vdfText) {
  const match = vdfText.match(/"publishedfileid"\s+"(\d+)"/i);
  if (!match) return null;
  return isValidPublishedFileId(match[1]) ? match[1] : null;
}

/**
 * @param {string} modDir
 * @param {{ description?: string }} [manifest]
 * @returns {{ ready: boolean; publishedFileId: string | null; error: string | null }}
 */
export function workshopPublishReadiness(modDir, manifest = {}) {
  if (!workshopPreviewPath(modDir)) {
    return { ready: false, publishedFileId: null, error: "needs preview.gif or preview.png" };
  }
  let hasDescription = false;
  try {
    hasDescription = Boolean(workshopDescriptionText(modDir));
  } catch (error) {
    return {
      ready: false,
      publishedFileId: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  if (
    !hasDescription &&
    !(typeof manifest.description === "string" && manifest.description.trim().length > 0)
  ) {
    return {
      ready: false,
      publishedFileId: null,
      error: "needs workshop.md or modinfo.description",
    };
  }
  try {
    const workshop = readWorkshopManifest(modDir);
    return {
      ready: true,
      publishedFileId: workshop?.publishedFileId ?? null,
      error: null,
    };
  } catch (error) {
    return {
      ready: false,
      publishedFileId: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** @param {string} modDir @returns {string | null} */
export function workshopPreviewPath(modDir) {
  for (const name of WORKSHOP_PREVIEW_NAMES) {
    const file = join(workshopDir(modDir), name);
    if (existsSync(file)) return file;
  }
  return null;
}

/**
 * Inline markdown → Steam Workshop BBCode (bold).
 * @param {string} text
 * @returns {string}
 */
function workshopInlineMarkdown(text) {
  return text.replaceAll(/\*\*([^*]+)\*\*/g, "[b]$1[/b]").replaceAll(/`([^`]+)`/g, "$1");
}

/** @typedef {{ kind: string; line: number; snippet: string }} WorkshopLinkIssue */

const WORKSHOP_LINK_PATTERNS = [
  { kind: "markdown link", pattern: /\[[^\]]+\]\([^)]+\)/ },
  { kind: "autolink", pattern: /<https?:\/\/[^>\s]+>/i },
  { kind: "URL", pattern: /https?:\/\/[^\s\])>]+/i },
  { kind: "BBCode link", pattern: /\[\/?url(?:=[^\]]+)?\]/i },
  { kind: "HTML link", pattern: /<a\s+[^>]*href\s*=/i },
];

/**
 * Find links and other URL markup that Steam Workshop virus scan rejects.
 * @param {string} text
 * @returns {WorkshopLinkIssue[]}
 */
export function findWorkshopLinkIssues(text) {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  /** @type {WorkshopLinkIssue[]} */
  const issues = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    for (const { kind, pattern } of WORKSHOP_LINK_PATTERNS) {
      if (!pattern.test(line)) continue;
      issues.push({
        kind,
        line: index + 1,
        snippet: line.trim().slice(0, 120),
      });
      break;
    }
  }
  return issues;
}

/**
 * @param {string} text
 * @param {string} fileLabel
 */
function assertWorkshopListingHasNoLinks(text, fileLabel) {
  const issues = findWorkshopLinkIssues(text);
  if (issues.length === 0) return;
  const detail = issues
    .map((issue) => `  line ${issue.line}: ${issue.kind} — ${issue.snippet}`)
    .join("\n");
  throw new Error(
    `${fileLabel} must not contain links or URLs (Steam Workshop virus scan rejects them):\n${detail}`,
  );
}

/**
 * Convert `workshop.md` to Steam Workshop BBCode (`[h1]`, `[h2]`, `[b]`, `[list]`, `[olist]`).
 * @param {string} markdown
 * @returns {string}
 */
export function workshopMarkdownToBbcode(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  /** @type {string[]} */
  const out = [];
  /** @type {"ordered" | "unordered" | null} */
  let listKind = null;

  const closeList = () => {
    if (!listKind) return;
    out.push(listKind === "ordered" ? "[/olist]" : "[/list]");
    listKind = null;
  };

  const openList = (kind) => {
    if (listKind === kind) return;
    closeList();
    listKind = kind;
    out.push(kind === "ordered" ? "[olist]" : "[list]");
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trimEnd().trim();
    if (!trimmed) {
      closeList();
      if (out.length > 0 && out[out.length - 1] !== "") out.push("");
      continue;
    }

    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1) {
      closeList();
      out.push(`[h1]${workshopInlineMarkdown(h1[1])}[/h1]`);
      continue;
    }

    const h2 = trimmed.match(/^##+\s+(.+)$/);
    if (h2) {
      closeList();
      out.push(`[h2]${workshopInlineMarkdown(h2[1])}[/h2]`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      openList("ordered");
      out.push(`[*]${workshopInlineMarkdown(ordered[1])}`);
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.*)$/);
    if (unordered) {
      openList("unordered");
      out.push(`[*]${workshopInlineMarkdown(unordered[1])}`);
      continue;
    }

    closeList();
    out.push(workshopInlineMarkdown(trimmed));
  }

  closeList();
  return out
    .join("\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

/** @param {string} modDir @returns {string | null} */
export function workshopDescriptionText(modDir) {
  const mdFile = join(workshopDir(modDir), "workshop.md");
  if (existsSync(mdFile)) {
    const text = readFileSync(mdFile, "utf8").trim();
    if (text.length > 0) {
      assertWorkshopListingHasNoLinks(text, "workshop/workshop.md");
      return workshopMarkdownToBbcode(text);
    }
  }
  const txtFile = join(workshopDir(modDir), "workshop.txt");
  if (existsSync(txtFile)) {
    const text = readFileSync(txtFile, "utf8").trim();
    if (text.length > 0) {
      assertWorkshopListingHasNoLinks(text, "workshop/workshop.txt");
      return text;
    }
  }
  return null;
}

const CHANGELOG_HEADING = /^##\s+\[?([^\]]+?)\]?(?:\s*[-–—]\s*\d{4}-\d{2}-\d{2})?\s*$/;
const VERSION_TITLE = /^(\d+\.\d+\.\d+)\b/;
/** Steam Workshop changenote limit. */
const CHANGE_NOTE_MAX = 8000;

/**
 * @param {string} line
 * @returns {{ version: string | null } | null}
 */
function parseChangelogHeading(line) {
  const match = line.match(CHANGELOG_HEADING);
  if (!match) return null;
  const title = match[1].trim();
  if (/^unreleased$/i.test(title)) return { version: null };
  const version = title.match(VERSION_TITLE);
  if (!version) return null;
  return { version: version[1] };
}

/**
 * @param {string} markdown
 * @returns {{ version: string | null; body: string }[]}
 */
function changelogSections(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  /** @type {{ version: string | null; bodyLines: string[] }[]} */
  const sections = [];
  /** @type {{ version: string | null; bodyLines: string[] } | null} */
  let current = null;
  for (const line of lines) {
    const heading = parseChangelogHeading(line);
    if (heading) {
      if (current) sections.push(current);
      current = { version: heading.version, bodyLines: [] };
      continue;
    }
    if (current) current.bodyLines.push(line);
  }
  if (current) sections.push(current);
  return sections.map((section) => ({
    version: section.version,
    body: section.bodyLines.join("\n").trim(),
  }));
}

/**
 * @param {string} markdown
 * @returns {string}
 */
function changelogBodyToPlain(markdown) {
  return markdown
    .replaceAll(/\r\n/g, "\n")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replaceAll(/\*\*([^*]+)\*\*/g, "$1")
    .replaceAll(/^###\s+/gm, "")
    .replaceAll(/`([^`]+)`/g, "$1")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Steam changenote from `CHANGELOG.md` for `modinfo.version`.
 * Prefers `## 1.2.3`. Falls back to `## Unreleased` when that version heading is missing.
 * @param {string} modDir
 * @param {string} version
 * @returns {{ text: string; source: "version" | "unreleased" } | null}
 */
export function readChangelogChangeNote(modDir, version) {
  const file = join(modDir, "CHANGELOG.md");
  if (!existsSync(file) || typeof version !== "string" || !version.trim()) return null;
  const wanted = version.trim();
  const sections = changelogSections(readFileSync(file, "utf8"));
  const versionSection = sections.find((section) => section.version === wanted && section.body);
  const unreleased = sections.find((section) => section.version == null && section.body);
  const picked = versionSection
    ? { body: versionSection.body, source: /** @type {const} */ ("version") }
    : unreleased
      ? { body: unreleased.body, source: /** @type {const} */ ("unreleased") }
      : null;
  if (!picked) return null;

  let text = `${wanted}\n\n${changelogBodyToPlain(picked.body)}`;
  if (text.length > CHANGE_NOTE_MAX) {
    text = `${text.slice(0, CHANGE_NOTE_MAX - 1).trimEnd()}…`;
  }
  return { text, source: picked.source };
}

/**
 * Copy listing files the game expects at the installed mod root.
 * @param {string} modDir
 * @param {string} outDir
 */
export function copyWorkshopInstallFiles(modDir, outDir) {
  const json = join(workshopDir(modDir), "workshop.json");
  if (existsSync(json)) {
    cpSync(json, join(outDir, "workshop.json"), { force: true });
  }
  for (const name of WORKSHOP_PREVIEW_NAMES) {
    const from = join(workshopDir(modDir), name);
    if (!existsSync(from)) continue;
    cpSync(from, join(outDir, name), { force: true });
  }
}

const PUBLISH_DOC_NAMES = ["README.md", "CHANGELOG.md"];

/**
 * Drop leftover docs/screenshots from a prior staging or game-folder build.
 * @param {string} outDir
 */
export function removeWorkshopPublishFiles(outDir) {
  for (const name of PUBLISH_DOC_NAMES) {
    rmSync(join(outDir, name), { force: true });
  }
  rmSync(join(outDir, "screenshots"), { recursive: true, force: true });
}
