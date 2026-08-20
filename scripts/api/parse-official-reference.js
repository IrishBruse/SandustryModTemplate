/**
 * Parse Sandkit API signatures from types/api/source/official-api-reference.txt
 * (vendored from SandLoader's official mod dev docs).
 */

/** @typedef {{ label: string; type: string; optional: boolean }} ParsedParam */
/** @typedef {{ pathKey: string; params: ParsedParam[]; returnType: string }} ParsedSignature */

/** @type {Record<string, string>} */
const TYPE_ALIASES = {
  any: "unknown",
  JsonValueV1: "unknown",
  JsonObjectV1: "Record<string, unknown>",
};

/**
 * @param {string} type
 * @returns {string}
 */
export function normalizeOfficialType(type) {
  const trimmed = type.trim().replace(/;\s*$/, "");
  if (TYPE_ALIASES[trimmed]) return TYPE_ALIASES[trimmed];
  return trimmed.replace(/\bany\b/g, "unknown");
}

/**
 * @param {string} inner
 * @returns {string[]}
 */
function splitParamList(inner) {
  /** @type {string[]} */
  const parts = [];
  let depth = 0;
  let current = "";

  for (const ch of inner) {
    if (ch === "(" || ch === "{" || ch === "<" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === ">" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

/**
 * @param {string} raw
 * @returns {ParsedParam | null}
 */
function parseParam(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const optional = trimmed.includes("?:");
  const match = trimmed.match(/^([A-Za-z_$][\w$]*)\??:\s*(.+)$/);
  if (!match) return null;

  return {
    label: match[1],
    type: normalizeOfficialType(match[2]),
    optional,
  };
}

/**
 * @param {string} line
 * @returns {ParsedSignature | null}
 */
export function parseSignatureLine(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^api\.([A-Za-z0-9_.]+)\((.*)\):\s*(.+)$/);
  if (!match) return null;

  const pathKey = match[1];
  const params = splitParamList(match[2]).map(parseParam).filter(Boolean);

  const returnType = normalizeOfficialType(match[3]);

  return {
    pathKey,
    params: /** @type {ParsedParam[]} */ (params),
    returnType,
  };
}

/**
 * @param {string} text
 * @returns {Map<string, ParsedSignature>}
 */
export function parseOfficialReference(text) {
  /** @type {Map<string, ParsedSignature>} */
  const signatures = new Map();

  const workerSection = text.indexOf("## Worker entry");
  const mainText = workerSection >= 0 ? text.slice(0, workerSection) : text;

  let inTsBlock = false;
  for (const rawLine of mainText.split("\n")) {
    const line = rawLine.trim();

    if (line === "```ts") {
      inTsBlock = true;
      continue;
    }
    if (inTsBlock && line.startsWith("```")) {
      inTsBlock = false;
      continue;
    }
    if (!inTsBlock || !line.startsWith("api.")) continue;

    const parsed = parseSignatureLine(line);
    if (parsed && !signatures.has(parsed.pathKey)) {
      signatures.set(parsed.pathKey, parsed);
    }
  }

  return signatures;
}

/**
 * @param {string} filePath
 * @returns {Map<string, ParsedSignature>}
 */
export function loadOfficialReference(readFileSync, filePath) {
  return parseOfficialReference(readFileSync(filePath, "utf8"));
}
