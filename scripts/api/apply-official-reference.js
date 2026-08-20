/**
 * Merge official Sandkit API signatures into api-docs.json entries.
 */

/** @typedef {import("./parse-official-reference.js").ParsedSignature} ParsedSignature */

/**
 * @param {Record<string, unknown>} docs
 * @param {Map<string, ParsedSignature>} signatures
 */
export function applyOfficialReference(docs, signatures) {
  /** @param {Record<string, unknown>} members @param {string[]} path */
  function walkMembers(members, path) {
    if (!members || typeof members !== "object") return;

    for (const [key, value] of Object.entries(members)) {
      const entry = /** @type {Record<string, unknown>} */ (value);
      const memberPath = [...path, key];

      if (entry.members && typeof entry.members === "object") {
        walkMembers(/** @type {Record<string, unknown>} */ (entry.members), memberPath);
        continue;
      }

      if (!Array.isArray(entry.params)) continue;

      const pathKey = memberPath.join(".");
      const official = signatures.get(pathKey);
      if (!official) continue;

      entry.returnType = official.returnType;

      /** @type {Array<Record<string, unknown>>} */
      const params = entry.params;

      for (let i = 0; i < official.params.length; i++) {
        const src = official.params[i];
        if (i < params.length) {
          const param = params[i];
          param.label = src.label;
          param.type = src.type;
          if (src.optional) param.optional = true;
          else delete param.optional;
          continue;
        }

        params.push({
          name: src.label,
          label: src.label,
          description: "",
          type: src.type,
          optional: src.optional || undefined,
        });
      }
    }
  }

  const namespaces = docs.namespaces;
  if (!namespaces || typeof namespaces !== "object") return docs;

  for (const [nsKey, nsValue] of Object.entries(namespaces)) {
    const ns = /** @type {Record<string, unknown>} */ (nsValue);
    if (ns.members && typeof ns.members === "object") {
      walkMembers(/** @type {Record<string, unknown>} */ (ns.members), [nsKey]);
    }
  }

  if (docs.meta && typeof docs.meta === "object") {
    docs.meta.officialReferenceAppliedAt = new Date().toISOString();
    docs.meta.officialReferenceMatches = countMatches(docs, signatures);
  }

  return docs;
}

/**
 * @param {Record<string, unknown>} docs
 * @param {Map<string, ParsedSignature>} signatures
 */
function countMatches(docs, signatures) {
  let count = 0;
  const namespaces = docs.namespaces;
  if (!namespaces || typeof namespaces !== "object") return 0;

  /** @param {Record<string, unknown>} members @param {string[]} path */
  function walk(members, path) {
    for (const [key, value] of Object.entries(members)) {
      const entry = /** @type {Record<string, unknown>} */ (value);
      const memberPath = [...path, key];
      if (entry.members && typeof entry.members === "object") {
        walk(/** @type {Record<string, unknown>} */ (entry.members), memberPath);
        continue;
      }
      if (signatures.has(memberPath.join("."))) count++;
    }
  }

  for (const [nsKey, nsValue] of Object.entries(namespaces)) {
    const ns = /** @type {Record<string, unknown>} */ (nsValue);
    if (ns.members && typeof ns.members === "object") {
      walk(/** @type {Record<string, unknown>} */ (ns.members), [nsKey]);
    }
  }

  return count;
}
