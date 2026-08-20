/**
 * Regenerate types/api/generated/ and types/api/source/api-docs.json from the runtime dump.
 * Usage: npm run generate-types
 *
 * Paste target: types/api/source/runtime-dump.json (from scripts/api/dump-api-console.js)
 * Docs overlay: types/api/source/api-docs.json (merged on each run; edit descriptions by hand)
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  dumpToJsonBlob,
  formatDocComment,
  formatFunctionSignature,
  getDocEntry,
  mergeApiDocs,
  parseJsonDump,
  parseTextDump,
} from "./api-dump-format.js";
import { applyOfficialReference } from "./apply-official-reference.js";
import { applyTypeCuration } from "./api-type-curation.js";
import { loadOfficialReference } from "./parse-official-reference.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const JSON_SOURCE = join(ROOT, "types/api/source/runtime-dump.json");
const TXT_SOURCE = join(ROOT, "types/api/source/runtime-dump.txt");
const DOCS_TARGET = join(ROOT, "types/api/source/api-docs.json");
const OFFICIAL_SOURCE = join(ROOT, "types/api/source/official-api-reference.txt");
const OUT_DIR = join(ROOT, "types/api/generated");

/** Default namespace descriptions seeded into api-docs.json on first run. */
const NAMESPACE_NOTES = {
  action: "Active/selected tool actions",
  assets: "Mod asset provider selection",
  authorization: "Build/grab/tool permissions",
  building: "Placement helpers",
  camera: "Focus and snap",
  collector: "Collector value queries",
  constants: "Physics constants",
  cooldown: "Cooldown checks",
  discoveries: "Discovery journal",
  effects: "Particles, lights, lasers",
  elements: "Element defs and cell mutation",
  energy: "Energy network",
  events: "Event bus",
  excavation: "Excavation profiles",
  fire: "Burning elements",
  gameConfig: "Read-only game config",
  grid: "Rect/circle iteration",
  hooks: "Intercept and modify hooks",
  i18n: "Translations",
  input: "Key bindings and mouse",
  items: "Item registration",
  lights: "Persistent and VFX lights",
  maps: "Custom maps",
  mods: "Mod provider listing",
  patterns: "Excavation patterns",
  player: "Player state",
  processing: "Grower/shaker/press recipes",
  progression: "Story progression",
  projectiles: "Projectile spawn",
  random: "RNG",
  raycast: "Ray casting",
  reactions: "Contact reactions",
  rendering: "Draw positions, overlay canvas",
  resources: "Fluxite and energy UI",
  scene: "Active scene",
  schedule: "nextTick scheduling",
  settings: "Mod configSchema settings",
  shared: "Cross-thread shared buffers",
  signals: "Signal target registration",
  sound: "Sound playback",
  sprites: "Sprite loading",
  storage: "Mod and local storage",
  structureBehaviors: "Conveyor and launcher types",
  structures: "Structure registration and mutation",
  tech: "Tech tree",
  terrains: "Terrain registration and mutation",
  time: "Simulation tick and time",
  tools: "Grabber helpers",
  triggers: "Interval triggers (main)",
  ui: "Toast, overlays, dialogs",
  upgrades: "Upgrade trees",
  utils: "Math helpers",
  workers: "Worker post-update flag",
  world: "Cell reads, excavation, idle mutation",
};

function loadDump() {
  if (existsSync(JSON_SOURCE)) {
    return parseJsonDump(JSON.parse(readFileSync(JSON_SOURCE, "utf8")));
  }
  if (existsSync(TXT_SOURCE)) {
    const dump = parseTextDump(readFileSync(TXT_SOURCE, "utf8"));
    writeFileSync(JSON_SOURCE, `${JSON.stringify(dumpToJsonBlob(dump), null, 2)}\n`);
    console.log(`Migrated ${TXT_SOURCE} -> ${JSON_SOURCE}`);
    return dump;
  }
  throw new Error(
    `Missing runtime dump. Paste into ${JSON_SOURCE} (see scripts/api/dump-api-console.js).`,
  );
}

function pascal(segment) {
  return segment.replace(/(^|[-_])([a-zA-Z])/g, (_, __, c) => c.toUpperCase());
}

function ifaceName(pathParts) {
  return `Api${pathParts.map(pascal).join("")}`;
}

/** @param {string} kind */
function scalarType(kind) {
  if (kind === "string") return "string";
  if (kind === "number") return "number";
  if (kind === "null") return "null";
  if (kind === "array") return "unknown[]";
  if (kind === "object") return "Record<string, unknown>";
  return "unknown";
}

/** @param {TreeNode} node @param {Record<string, unknown> | null | undefined} docEntry @param {string} methodKey */
function memberType(node, docEntry, methodKey) {
  if (node.kind === "function") return formatFunctionSignature(docEntry, node, methodKey);
  return scalarType(node.kind);
}

/** @typedef {import("./api-dump-format.js").TreeNode} TreeNode */

/** @param {Map<string, TreeNode>} node @param {string[]} pathParts @param {string[]} out @param {Record<string, unknown>} docs */
function emitInterfaces(node, pathParts, out, docs) {
  const entries = [...node.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return;

  const iface = ifaceName(pathParts);
  out.push(`export interface ${iface} {`);
  for (const [key, value] of entries) {
    const doc = formatDocComment(getDocEntry(docs, [...pathParts, key]));
    if (doc) {
      for (const line of doc.split("\n")) {
        out.push(`  ${line}`);
      }
    }
    if (value.members.size > 0) {
      out.push(`  ${key}: ${ifaceName([...pathParts, key])};`);
    } else {
      const docEntry = getDocEntry(docs, [...pathParts, key]);
      out.push(`  ${key}: ${memberType(value, docEntry, key)};`);
    }
  }
  out.push("}");
  out.push("");

  for (const [key, value] of entries) {
    if (value.members.size > 0) {
      emitInterfaces(value.members, [...pathParts, key], out, docs);
    }
  }
}

/** @param {string} rootKey @param {TreeNode} rootNode @param {Record<string, unknown>} docs */
function writeNamespaceFile(rootKey, rootNode, docs) {
  const interfaces = [];
  if (rootNode.members.size > 0) {
    emitInterfaces(rootNode.members, [rootKey], interfaces, docs);
  }

  const nsDoc = getDocEntry(docs, [rootKey]);
  const nsDescription =
    nsDoc && typeof nsDoc.description === "string"
      ? nsDoc.description.trim()
      : NAMESPACE_NOTES[rootKey];

  const header = [
    "/**",
    " * Auto-generated from types/api/source/runtime-dump.json",
    " * Run: npm run generate-types",
    nsDescription ? ` * ${nsDescription}` : "",
    " */",
    "/* eslint-disable @typescript-eslint/no-empty-object-type */",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const rootExport =
    rootNode.members.size > 0
      ? `export type ${ifaceName([rootKey])}Namespace = ${ifaceName([rootKey])};`
      : "";

  const body = [...interfaces, rootExport].filter(Boolean).join("\n");
  writeFileSync(join(OUT_DIR, `${rootKey}.d.ts`), `${header}\n${body}\n`);
}

const dump = loadDump();
writeFileSync(JSON_SOURCE, `${JSON.stringify(dumpToJsonBlob(dump), null, 2)}\n`);

/** @type {Record<string, unknown> | null} */
let existingDocs = null;
if (existsSync(DOCS_TARGET)) {
  existingDocs = JSON.parse(readFileSync(DOCS_TARGET, "utf8"));
}

const docs = mergeApiDocs(existingDocs, dump, NAMESPACE_NOTES);
applyTypeCuration(docs);

if (existsSync(OFFICIAL_SOURCE)) {
  const official = loadOfficialReference(readFileSync, OFFICIAL_SOURCE);
  applyOfficialReference(docs, official);
  console.log(
    `Applied ${docs.meta?.officialReferenceMatches ?? 0} official API signatures from ${OFFICIAL_SOURCE}`,
  );
} else {
  console.warn(`Missing ${OFFICIAL_SOURCE} — skip official reference merge`);
}

writeFileSync(DOCS_TARGET, `${JSON.stringify(docs, null, 2)}\n`);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const rootKeys = [...dump.roots.keys()].sort();
const indexImports = [];
const indexFields = [];

for (const rootKey of rootKeys) {
  const rootNode = dump.roots.get(rootKey);
  writeNamespaceFile(rootKey, rootNode, docs);

  const nsDoc = getDocEntry(docs, [rootKey]);
  const nsDescription =
    nsDoc && typeof nsDoc.description === "string"
      ? nsDoc.description.trim()
      : NAMESPACE_NOTES[rootKey];

  if (rootNode.members.size > 0) {
    indexImports.push(`import type { ${ifaceName([rootKey])} } from "./${rootKey}";`);
    indexFields.push(
      nsDescription
        ? `  /** ${nsDescription} */\n  ${rootKey}: ${ifaceName([rootKey])};`
        : `  ${rootKey}: ${ifaceName([rootKey])};`,
    );
  } else {
    const docEntry = getDocEntry(docs, [rootKey]);
    indexFields.push(`  ${rootKey}: ${memberType(rootNode, docEntry, rootKey)};`);
  }
}

const indexOutput = `/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 *
 * In-game runtime snapshot: ${dump.meta.entries} entries, ${dump.meta.functions} functions.
 * Docs overlay: types/api/source/api-docs.json
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

${indexImports.join("\n")}

/** Runtime API surface from the in-game dump. */
export interface GeneratedSandkitApi {
${indexFields.join("\n")}
}
`;

writeFileSync(join(OUT_DIR, "index.d.ts"), indexOutput);
console.log(`Wrote ${OUT_DIR}/ (${rootKeys.length} namespace files + index.d.ts)`);
console.log(`Wrote ${DOCS_TARGET}`);
