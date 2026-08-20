/**
 * Shared runtime dump parsing and api-docs merge helpers.
 * Used by scripts/api/generate-api-types.js
 */

/** @typedef {{ kind: string; arity: number | null; params: string[] | null; value?: unknown; members: Map<string, TreeNode> }} TreeNode */

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
    const { params, arity } =
      kind === "function" ? parseFunctionDetail(detail) : { params: null, arity: null };

    upsertPath(roots, parts, {
      kind,
      arity,
      params,
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
    out.params = node.params ?? [];
    out.declaredArity = node.arity ?? out.params.length;
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
          : (namespaceNotes[nsKey] ?? ""),
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

    /** @type {Array<Record<string, unknown>>} */
    const params = [];
    const prevParams = Array.isArray(prevMember.params) ? prevMember.params : [];
    const dumpParams = node.params ?? [];
    for (let i = 0; i < dumpParams.length; i++) {
      const prevParam = prevParams[i];
      /** @type {Record<string, unknown>} */
      const param = {
        name: dumpParams[i],
        label:
          prevParam && typeof prevParam === "object" && typeof prevParam.label === "string"
            ? prevParam.label
            : dumpParams[i],
        description:
          prevParam && typeof prevParam === "object" && typeof prevParam.description === "string"
            ? prevParam.description
            : "",
      };
      const prevType =
        prevParam && typeof prevParam === "object" && typeof prevParam.type === "string"
          ? prevParam.type.trim()
          : "";
      const inferredType = inferParamType(param, key, i);
      param.type = prevType && prevType !== "unknown" ? prevType : inferredType;
      params.push(param);
    }

    /** @type {Record<string, unknown>} */
    const member = {
      description: typeof prevMember.description === "string" ? prevMember.description : "",
      params,
    };

    if (node.kind === "function") {
      const prevReturn =
        typeof prevMember.returnType === "string" && prevMember.returnType.trim()
          ? prevMember.returnType.trim()
          : "";
      member.returnType = prevReturn || inferReturnType(member, key);
    }

    out[key] = member;
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

/**
 * @param {Record<string, unknown>} param
 * @param {string} [methodKey]
 * @param {number} [paramIndex]
 */
export function inferParamType(param, methodKey, paramIndex) {
  const explicit = typeof param.type === "string" ? param.type.trim() : "";
  if (explicit) return explicit;

  const label = String(param.label || param.name || "");
  const labelLower = label.toLowerCase();
  const desc = String(param.description || "");
  const text = `${label} ${desc}`.toLowerCase();

  if (methodKey === "on" && paramIndex === 0) return "string";
  if (methodKey === "on" && paramIndex === 1) return "(...args: unknown[]) => unknown";
  if (methodKey === "emit" && paramIndex === 0) return "string";
  if (methodKey === "emit" && paramIndex === 1) return "unknown";
  if (methodKey === "nextTick" && paramIndex === 0) return "(...args: unknown[]) => unknown";
  if (methodKey === "onChange" && paramIndex === 0) return "(...args: unknown[]) => unknown";
  if (/^register/.test(methodKey ?? "") && paramIndex === 0) return "string";
  if (methodKey === "get" && paramIndex === 0) return "string";
  if (methodKey === "set" && paramIndex === 0) return "string";

  if (/unsubscribe/.test(desc)) return "() => void";

  if (
    /id$|kind$|key$|path$|type$|url$|hook$|event$|locale$|layer$|slot$|message$|title$|name$|scene$|mode$|binding$|sound$|sprite$|matter$|provider$/.test(
      labelLower,
    )
  ) {
    return "string";
  }

  if (
    labelLower === "component" ||
    /callback|handler|\brender\b|listener|\bfn\b|\bfunction\b/.test(text)
  ) {
    return "(...args: unknown[]) => unknown";
  }
  if (
    /coordinate|amount|damage|radius|power|duration|interval|index|level|hp|angle|distance|width|height|size|multiplier|cellx|celley|worldx|worldy|tick|time|min|max|fieldnumber|velocity|capacity|fluxite|energy|declared/.test(
      text,
    )
  ) {
    return "number";
  }
  if (
    /flag|whether|enabled|locked|active|collectable|blocked|ready|held|loaded|empty|terrain|focused|clear|falling|ground|colliding/.test(
      text,
    )
  ) {
    return "boolean";
  }
  if (/string/.test(desc)) return "string";
  if (
    /object|options|settings|definition|config|data|payload|recipe|profile|blueprint|pattern|metadata/.test(
      text,
    )
  ) {
    return "Record<string, unknown>";
  }
  return "unknown";
}

/** @param {Record<string, unknown> | null | undefined} docEntry @param {string} methodKey */
export function inferReturnType(docEntry, methodKey) {
  if (typeof docEntry?.returnType === "string" && docEntry.returnType.trim()) {
    return docEntry.returnType.trim();
  }

  const desc = String(docEntry?.description || "");
  const key = methodKey;

  if (/return whether|return true if|return false if/i.test(desc)) return "boolean";
  if (/return string/i.test(desc)) return "string";
  if (/return number/i.test(desc)) return "number";
  if (key === "on" || /unsubscribe function/i.test(desc)) return "() => void";
  if (key === "inject") return "(() => void) | undefined";
  if (key === "confirm" || /confirm dialog/i.test(desc)) return "Promise<boolean>";
  if (key === "prompt" || /prompt dialog/i.test(desc)) return "Promise<string | null>";
  if (key === "alert" || /alert dialog/i.test(desc)) return "Promise<void>";
  if (/promise/i.test(desc)) return "Promise<unknown>";
  if (/^get|^is|^has|^can|^find|^map|^createCircle|^key$|^t$|^translatable$/.test(key))
    return "unknown";
  return "void";
}

/** @param {string} name */
function sanitizeParamName(name) {
  const raw = String(name || "arg").trim() || "arg";
  const safe = raw.replace(/[^a-zA-Z0-9_$]/g, "_");
  if (/^[a-zA-Z_$]/.test(safe)) return safe;
  return `_${safe}`;
}

/**
 * Build a mod-facing function type for generated `.d.ts` stubs.
 * @param {Record<string, unknown> | null | undefined} docEntry
 * @param {import("./api-dump-format.js").TreeNode} dumpNode
 * @param {string} methodKey
 */
export function formatFunctionSignature(docEntry, dumpNode, methodKey) {
  const docParams = Array.isArray(docEntry?.params) ? docEntry.params : [];
  const dumpParams = dumpNode.params ?? [];

  /** @type {Array<Record<string, unknown>>} */
  let params;
  if (docParams.length > 0) {
    params = docParams;
  } else if (dumpParams.length > 0) {
    params = dumpParams.map((name) => ({ name, label: name, description: "" }));
  } else if (typeof dumpNode.arity === "number" && dumpNode.arity >= 0) {
    params = Array.from({ length: dumpNode.arity }, (_, i) => ({
      name: `arg${i}`,
      label: `arg${i}`,
      description: "",
    }));
  } else {
    params = [];
  }

  const paramList = params
    .map((p, i) => {
      const param = /** @type {Record<string, unknown>} */ (p);
      const name = sanitizeParamName(
        /** @type {Record<string, string>} */ (param.label || param.name),
      );
      const optional = param.optional === true ? "?" : "";
      return `${name}${optional}: ${inferParamType(param, methodKey, i)}`;
    })
    .join(", ");

  const ret = inferReturnType(docEntry, methodKey);
  return `(${paramList}) => ${ret}`;
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
