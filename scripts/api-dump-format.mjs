/**
 * Shared runtime dump parsing and api-docs merge helpers.
 * Used by scripts/generate-api-types.mjs
 */

/** @typedef {{ kind: string; arity: number | null; params: string[] | null; signature?: string; value?: unknown; members: Map<string, TreeNode> }} TreeNode */

/** @param {string | undefined} detail */
export function parseFunctionDetail(detail) {
  if (!detail) return { params: null, arity: null };

  const declaredMatch = detail.match(/\((\d+) declared parameters?\)/);
  if (declaredMatch) {
    return { params: null, arity: Number(declaredMatch[1]) };
  }

  const paramsMatch = detail.match(/^[^(]+\(([^)]*)\)$/);
  if (!paramsMatch) return { params: null, arity: null };

  const inner = paramsMatch[1].trim();
  if (!inner) return { params: [], arity: 0 };

  const params = inner
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return { params, arity: params.length };
}

/** @returns {TreeNode} */
function createNode(kind, extra = {}) {
  return { kind, arity: null, params: null, members: new Map(), ...extra };
}

/** @param {Map<string, TreeNode>} roots @param {string[]} parts @param {Partial<TreeNode>} leaf */
function upsertPath(roots, parts, leaf) {
  const rootKey = parts[0];
  if (!roots.has(rootKey)) {
    roots.set(rootKey, createNode("object"));
  }

  let node = roots.get(rootKey);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!node.members.has(part)) {
      node.members.set(part, createNode(i === parts.length - 1 ? leaf.kind : "object"));
    }
    const current = node.members.get(part);
    if (i === parts.length - 1) {
      Object.assign(current, leaf);
    }
    node = current;
  }

  if (parts.length === 1) {
    Object.assign(roots.get(rootKey), leaf);
  }
}

/** @param {string} md */
export function parseTextDump(md) {
  /** @type {Map<string, TreeNode>} */
  const roots = new Map();
  let skipSourceBlock = false;

  for (const rawLine of md.split("\n")) {
    const line = rawLine.trimStart();

    if (line.match(/^```js$/)) {
      skipSourceBlock = true;
      continue;
    }
    if (skipSourceBlock) {
      if (line.startsWith("```")) skipSourceBlock = false;
      continue;
    }

    const match = line.match(/^- `api\.([^`]+)` — `([^`]+)`(?: — `([^`]+)`)?/);
    if (!match) continue;

    const [, path, kind, detail] = match;
    const parts = path.split(".");
    const { params, arity } = kind === "function" ? parseFunctionDetail(detail) : { params: null, arity: null };

    upsertPath(roots, parts, {
      kind,
      arity,
      params,
      signature: kind === "function" ? detail ?? undefined : undefined,
    });
  }

  let entries = 0;
  let functions = 0;
  for (const line of md.split("\n")) {
    if (line.trimStart().match(/^- `api\./)) entries++;
    if (line.includes("— `function`")) functions++;
  }

  const dateMatch = md.match(/^# Sandkit API runtime dump \(([^)]+)\)/m);

  return {
    meta: {
      generatedAt: dateMatch?.[1] ?? null,
      entries,
      functions,
    },
    roots,
  };
}

/** @param {Record<string, unknown>} jsonMember */
function jsonMemberToNode(jsonMember) {
  const kind = /** @type {string} */ (jsonMember.kind);
  /** @type {TreeNode} */
  const node = createNode(kind, {
    arity:
      typeof jsonMember.declaredArity === "number"
        ? jsonMember.declaredArity
        : Array.isArray(jsonMember.params)
          ? jsonMember.params.length
          : null,
    params: Array.isArray(jsonMember.params) ? jsonMember.params : null,
    signature: typeof jsonMember.signature === "string" ? jsonMember.signature : undefined,
    value: "value" in jsonMember ? jsonMember.value : undefined,
  });

  if (kind === "object" && jsonMember.members && typeof jsonMember.members === "object") {
    for (const [key, child] of Object.entries(jsonMember.members)) {
      node.members.set(key, jsonMemberToNode(/** @type {Record<string, unknown>} */ (child)));
    }
  }

  return node;
}

/** @param {Record<string, unknown>} json */
export function parseJsonDump(json) {
  /** @type {Map<string, TreeNode>} */
  const roots = new Map();
  const namespaces = json.namespaces;
  if (!namespaces || typeof namespaces !== "object") {
    throw new Error("runtime-dump.json must have a namespaces object");
  }

  for (const [key, ns] of Object.entries(namespaces)) {
    roots.set(key, jsonMemberToNode(/** @type {Record<string, unknown>} */ (ns)));
  }

  const meta = json.meta && typeof json.meta === "object" ? json.meta : {};
  return {
    meta: {
      generatedAt: typeof meta.generatedAt === "string" ? meta.generatedAt : null,
      entries: typeof meta.entries === "number" ? meta.entries : countEntries(roots),
      functions: typeof meta.functions === "number" ? meta.functions : countFunctions(roots),
    },
    roots,
  };
}

/** @param {Map<string, TreeNode>} roots @param {(node: TreeNode, path: string[]) => void} visit @param {string[]} [path] */
function walkTree(roots, visit, path = []) {
  for (const [key, node] of [...roots.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const nextPath = [...path, key];
    visit(node, nextPath);
    if (node.members.size > 0) {
      walkTree(node.members, visit, nextPath);
    }
  }
}

/** @param {Map<string, TreeNode>} roots */
function countEntries(roots) {
  let count = 0;
  walkTree(roots, () => {
    count++;
  });
  return count;
}

/** @param {Map<string, TreeNode>} roots */
function countFunctions(roots) {
  let count = 0;
  walkTree(roots, (node) => {
    if (node.kind === "function") count++;
  });
  return count;
}

/** @param {TreeNode} node */
function treeNodeToJson(node) {
  /** @type {Record<string, unknown>} */
  const out = { kind: node.kind };
  if (node.kind === "function") {
    out.name = node.signature?.match(/^([^(]+)/)?.[1]?.trim() ?? "";
    out.params = node.params ?? [];
    out.declaredArity = node.arity ?? out.params.length;
    if (node.signature) out.signature = node.signature;
  } else if (node.kind === "object") {
    /** @type {Record<string, unknown>} */
    const members = {};
    for (const [key, child] of [...node.members.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      members[key] = treeNodeToJson(child);
    }
    out.members = members;
    out.memberCount = node.members.size;
  } else if (node.value !== undefined) {
    out.value = node.value;
  }
  return out;
}

/** @param {{ meta: Record<string, unknown>; roots: Map<string, TreeNode> }} dump */
export function dumpToJsonBlob(dump) {
  /** @type {Record<string, unknown>} */
  const namespaces = {};
  for (const [key, node] of [...dump.roots.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    namespaces[key] = treeNodeToJson(node);
  }
  return {
    meta: {
      generatedAt: dump.meta.generatedAt,
      entries: dump.meta.entries,
      functions: dump.meta.functions,
    },
    namespaces,
  };
}

/** @param {Record<string, unknown> | null} existing @param {{ meta: Record<string, unknown>; roots: Map<string, TreeNode> }} dump @param {Record<string, string>} namespaceNotes */
export function mergeApiDocs(existing, dump, namespaceNotes) {
  const existingNamespaces =
    existing?.namespaces && typeof existing.namespaces === "object"
      ? /** @type {Record<string, Record<string, unknown>>} */ (existing.namespaces)
      : {};

  /** @type {Record<string, unknown>} */
  const namespaces = {};

  for (const [nsKey, nsNode] of [...dump.roots.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const prevNs = existingNamespaces[nsKey] ?? {};
    /** @type {Record<string, unknown>} */
    const members = {};
    mergeDocMembers(members, prevNs.members, nsNode.members);

    namespaces[nsKey] = {
      description:
        typeof prevNs.description === "string" && prevNs.description
          ? prevNs.description
          : namespaceNotes[nsKey] ?? "",
      members,
    };
  }

  return {
    meta: {
      updatedAt: new Date().toISOString(),
      sourceGeneratedAt: dump.meta.generatedAt,
      entryCount: dump.meta.entries,
      functionCount: dump.meta.functions,
    },
    namespaces,
  };
}

/** @param {Record<string, unknown>} out @param {unknown} prevMembers @param {Map<string, TreeNode>} dumpMembers */
function mergeDocMembers(out, prevMembers, dumpMembers) {
  const prev =
    prevMembers && typeof prevMembers === "object"
      ? /** @type {Record<string, Record<string, unknown>>} */ (prevMembers)
      : {};

  for (const [key, node] of [...dumpMembers.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const prevMember = prev[key] ?? {};
    if (node.kind === "object" && node.members.size > 0) {
      /** @type {Record<string, unknown>} */
      const nested = {};
      mergeDocMembers(nested, prevMember.members, node.members);
      out[key] = {
        description: typeof prevMember.description === "string" ? prevMember.description : "",
        members: nested,
      };
      continue;
    }

    /** @type {Array<Record<string, string>>} */
    const params = [];
    const prevParams = Array.isArray(prevMember.params) ? prevMember.params : [];
    const dumpParams = node.params ?? [];
    for (let i = 0; i < dumpParams.length; i++) {
      const prevParam = prevParams[i];
      params.push({
        name: dumpParams[i],
        label:
          prevParam && typeof prevParam === "object" && typeof prevParam.label === "string"
            ? prevParam.label
            : dumpParams[i],
        description:
          prevParam && typeof prevParam === "object" && typeof prevParam.description === "string"
            ? prevParam.description
            : "",
      });
    }

    out[key] = {
      description: typeof prevMember.description === "string" ? prevMember.description : "",
      signature: node.signature ?? "",
      params,
    };
  }
}

/** @param {Record<string, unknown>} docs @param {string[]} path */
export function getDocEntry(docs, path) {
  let current = docs.namespaces;
  if (!current || typeof current !== "object") return null;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    const entry = /** @type {Record<string, unknown>} */ (current)[key];
    if (!entry) return null;
    if (i === path.length - 1) return entry;
    current = entry.members;
    if (!current || typeof current !== "object") return null;
  }
  return null;
}

/** @param {Record<string, unknown> | null | undefined} entry */
export function formatDocComment(entry) {
  if (!entry) return null;
  const description = typeof entry.description === "string" ? entry.description.trim() : "";
  const params = Array.isArray(entry.params) ? entry.params : [];
  const paramLines = params
    .filter((p) => p && typeof p === "object")
    .map((p) => {
      const param = /** @type {Record<string, string>} */ (p);
      const label = param.label?.trim() || param.name;
      const desc = param.description?.trim();
      if (!desc) return null;
      return `@param ${label} ${desc}`;
    })
    .filter(Boolean);

  const lines = [];
  if (description) lines.push(description);
  lines.push(...paramLines);
  if (lines.length === 0) return null;

  if (lines.length === 1) return `/** ${lines[0]} */`;
  return ["/**", ...lines.map((line) => ` * ${line}`), " */"].join("\n");
}
