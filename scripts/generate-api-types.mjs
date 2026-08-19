/**
 * Regenerate types/api/generated.d.ts from the runtime dump.
 * Usage: npm run generate-types
 *
 * Source: types/api/runtime-dump.txt (paste output from scripts/dump-api-console.js)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SOURCE = join(ROOT, "types/api/runtime-dump.txt");
const TARGET = join(ROOT, "types/api/generated.d.ts");

/** Short namespace notes from the in-game runtime dump index. */
const NAMESPACE_NOTES = {
  action: "Active/selected tool actions",
  augments: "Player augment levels",
  auralite: "Infinite Factory progression",
  authorization: "Build/grab/tool permissions",
  blueprints: "Blueprint save/load/export",
  building: "Placement helpers",
  camera: "Focus and snap",
  clipboard: "Copy/paste structures",
  collector: "Collector value queries",
  colorPicker: "UI color palette",
  coloringTool: "Structure coloring",
  config: "Legacy config read/write",
  constants: "Physics constants",
  conveyors: "Conveyor type registration",
  cooldown: "Cooldown checks",
  debug: "Debug registrations",
  discoveries: "Discovery journal",
  drones: "Drone spawn/kill",
  effects: "Particles, lights, lasers",
  elements: "Element defs and cell mutation",
  energy: "Energy network",
  entities: "Entity spawn/types",
  events: "Event bus",
  excavation: "Excavation profiles",
  extend: "Add custom API namespaces",
  extensions: "Extension definitions",
  factory: "Factory tier progression",
  fire: "Burning elements",
  foliage: "Procedural foliage",
  game: "Save/load/start",
  grid: "Rect/circle iteration",
  heatTransfer: "Temperature diffusion",
  hooks: "Intercept and modify hooks",
  i18n: "Translations",
  input: "Key bindings and mouse",
  items: "Item registration",
  launchers: "Launcher types",
  lights: "Persistent and VFX lights",
  maps: "Custom maps",
  matters: "Matter type registration",
  patterns: "Excavation patterns",
  player: "Player state",
  portals: "Portal markers",
  processing: "Grower/shaker/press recipes",
  progression: "Story progression",
  projectiles: "Projectile spawn",
  queue: "Deferred work queue",
  random: "RNG",
  raycast: "Ray casting",
  reactions: "Contact reactions",
  rendering: "Draw positions, overlay canvas",
  resources: "Fluxite and energy UI",
  retroConsole: "Register embedded retro games",
  scene: "Active scene",
  schedule: "nextTick scheduling",
  signals: "Signal target registration",
  sound: "Sound playback",
  sprites: "Sprite loading",
  storage: "Mod and local storage",
  structures: "Structure registration and mutation",
  tech: "Tech tree",
  terrains: "Terrain registration and mutation",
  tools: "Grabber helpers",
  triggers: "Interval triggers (main)",
  ui: "Toast, overlays, radial menu",
  upgrades: "Upgrade trees",
  utils: "Math helpers",
  wall: "Wall palette data",
  workerLocal: "Per-worker local storage",
  workers: "Worker events, hooks, shared buffers, triggers",
  world: "Cell reads, excavation, idle mutation",
};

const md = readFileSync(SOURCE, "utf8");

/** @typedef {{ kind: string; arity: number | null; children: Map<string, Node> }} Node */

/** @type {Map<string, Node>} */
const roots = new Map();

for (const rawLine of md.split("\n")) {
  const line = rawLine.trimStart();
  const match = line.match(/^- `api\.([^`]+)` — `([^`]+)`(?: — `([^`]+)`)?/);
  if (!match) continue;

  const [, path, kind, detail] = match;
  const parts = path.split(".");
  const rootKey = parts[0];

  if (!roots.has(rootKey)) {
    roots.set(rootKey, { kind: "object", arity: null, children: new Map() });
  }

  /** @type {Map<string, Node>} */
  let node = roots.get(rootKey).children;
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!node.has(part)) {
      node.set(part, { kind: "object", arity: null, children: new Map() });
    }
    const current = node.get(part);
    if (i === parts.length - 1) {
      current.kind = kind;
      const arityMatch = detail?.match(/\((\d+) declared parameters\)/);
      current.arity = arityMatch ? Number(arityMatch[1]) : null;
    }
    node = current.children;
  }

  if (parts.length === 1) {
    const root = roots.get(rootKey);
    root.kind = kind;
    const arityMatch = detail?.match(/\((\d+) declared parameters\)/);
    root.arity = arityMatch ? Number(arityMatch[1]) : null;
  }
}

function pascal(segment) {
  return segment.replace(/(^|[-_])([a-zA-Z])/g, (_, __, c) => c.toUpperCase());
}

function ifaceName(pathParts) {
  return `Api${pathParts.map(pascal).join("")}`;
}

const NO_CTX_ROOTS = new Set([
  "blueprints",
  "clipboard",
  "i18n",
  "prefabData",
  "prefabDecor",
  "prefabulator",
  "usageTracker",
  "utils",
]);

/** @param {number | null} arity */
function rootMethodType(arity) {
  if (arity === 0) return "Method0";
  if (arity === 1) return "Method1";
  if (arity === 2) return "Method2";
  if (arity === 3) return "Method3";
  if (arity === 4) return "Method4";
  if (arity === 5) return "Method5";
  if (arity === 6) return "Method6";
  return "ApiHandler";
}

/** @param {number | null} arity */
function ctxMethodType(arity) {
  if (arity === 0) return "Method0";
  if (arity === 1) return "ByArity<1>";
  if (arity === 2) return "ByArity<2>";
  if (arity === 3) return "ByArity<3>";
  if (arity === 4) return "ByArity<4>";
  if (arity === 5) return "ByArity<5>";
  if (arity === 6) return "ByArity<6>";
  if (arity === 7) return "ByArity<7>";
  return "ApiHandler";
}

/** @param {string} kind @param {number | null} arity @param {boolean} noCtx */
function fieldType(kind, arity, noCtx = false) {
  if (kind === "function") {
    return noCtx ? rootMethodType(arity) : ctxMethodType(arity);
  }
  if (kind === "string") return "string";
  if (kind === "number") return "number";
  if (kind === "null") return "null";
  if (kind === "array") return "unknown[]";
  if (kind === "object") return "Record<string, unknown>";
  return "unknown";
}

/** @param {Map<string, Node>} node @param {string[]} pathParts @param {string[]} out */
function emitInterfaces(node, pathParts, out) {
  const entries = [...node.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return;

  const iface = ifaceName(pathParts);
  out.push(`export interface ${iface} {`);
  for (const [key, value] of entries) {
    if (value.children.size > 0) {
      out.push(`  ${key}: ${ifaceName([...pathParts, key])};`);
    } else {
      out.push(`  ${key}: ${fieldType(value.kind, value.arity)};`);
    }
  }
  out.push("}");
  out.push("");

  for (const [key, value] of entries) {
    if (value.children.size > 0) {
      emitInterfaces(value.children, [...pathParts, key], out);
    }
  }
}

const interfaces = [];
for (const [rootKey, rootNode] of [...roots.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (rootNode.children.size > 0) {
    emitInterfaces(rootNode.children, [rootKey], interfaces);
  }
}

const dumpLines = md.split("\n").filter((line) => line.trimStart().match(/^- `api\./)).length;
const functionLines = md.split("\n").filter((line) => line.includes("— `function`")).length;

const apiLines = [];
for (const [rootKey, rootNode] of [...roots.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const note = NAMESPACE_NOTES[rootKey];
  if (note) {
    apiLines.push(`  /** ${note} */`);
  }
  if (rootKey === "extend") {
    apiLines.push("  extend: Method3;");
    continue;
  }
  if (rootNode.children.size > 0) {
    apiLines.push(`  ${rootKey}: ${ifaceName([rootKey])};`);
  } else if (rootNode.kind === "function") {
    apiLines.push(`  ${rootKey}: ${fieldType(rootNode.kind, rootNode.arity, NO_CTX_ROOTS.has(rootKey))};`);
  } else {
    apiLines.push(`  ${rootKey}: ${fieldType(rootNode.kind, rootNode.arity)};`);
  }
}

const output = `/**
 * Auto-generated from types/api/runtime-dump.txt
 * Run: npm run generate-types
 *
 * In-game runtime snapshot: ${dumpLines} entries, ${functionLines} functions.
 * Signatures are arity-based best guesses (ctx-first when arity >= 1).
 * Prefer hand-crafted types in refined.d.ts where available.
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { ApiHandler, ByArity, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";

${interfaces.join("\n")}
/** Runtime API surface from the in-game dump. */
export interface GeneratedSandkitApi {
${apiLines.join("\n")}
}
`;

writeFileSync(TARGET, output);
console.log(`Wrote ${TARGET}`);
