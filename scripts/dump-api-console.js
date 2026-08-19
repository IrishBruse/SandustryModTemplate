/**
 * Paste this whole file into Sandustry DevTools (Console tab).
 *
 * Requires the example mod loaded so window.api exists.
 * Output: JSON for sandkit-api/runtime-dump.json
 * Then run: npm run generate-types
 *
 * Tips:
 * - apiDump() logs JSON and copies to clipboard when allowed
 * - apiDumpObject() returns the parsed object
 */
(function () {
  function resolveApi() {
    return globalThis.api ?? globalThis.sandkit?.api ?? null;
  }

  function kindOf(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    const t = typeof value;
    if (t === "function") return "function";
    if (t === "object") return "object";
    return t;
  }

  function getFunctionSource(fn) {
    try {
      const src = Function.prototype.toString.call(fn);
      if (src.includes("[native code]")) return "[native code]";
      return src;
    } catch {
      return "[source unavailable]";
    }
  }

  function findTopLevelEq(param) {
    let depth = 0;
    for (let i = 0; i < param.length; i++) {
      const ch = param[i];
      if (ch === "(" || ch === "[" || ch === "{") depth++;
      else if (ch === ")" || ch === "]" || ch === "}") depth--;
      else if (ch === "=" && depth === 0) return i;
    }
    return -1;
  }

  function simplifyParam(param) {
    param = param.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    if (!param) return null;
    if (param.startsWith("...")) return param.replace(/\s*=.*$/, "").trim();

    const eqIdx = findTopLevelEq(param);
    if (eqIdx >= 0) param = param.slice(0, eqIdx).trim();

    if (param.startsWith("{") || param.startsWith("[")) {
      return param.replace(/\s+/g, " ");
    }

    const id = param.match(/^([\w$]+)/);
    return id ? id[1] : param;
  }

  function parseParamList(paramsStr) {
    if (!paramsStr.trim()) return [];

    const names = [];
    let depth = 0;
    let current = "";

    for (let i = 0; i < paramsStr.length; i++) {
      const ch = paramsStr[i];
      if (ch === "(" || ch === "[" || ch === "{") depth++;
      else if (ch === ")" || ch === "]" || ch === "}") depth--;
      else if (ch === "," && depth === 0) {
        const name = simplifyParam(current.trim());
        if (name) names.push(name);
        current = "";
        continue;
      }
      current += ch;
    }

    const last = simplifyParam(current.trim());
    if (last) names.push(last);
    return names;
  }

  function extractParamNames(fn) {
    const src = getFunctionSource(fn);
    if (src === "[native code]" || src === "[source unavailable]") return null;

    let paramsStr = null;
    let match = src.match(/^(?:async\s+)?function\*?\s*[\w$]*\s*\(([^)]*)\)/);
    if (match) paramsStr = match[1];
    if (!paramsStr) {
      match = src.match(/^\(([^)]*)\)\s*=>/);
      if (match) paramsStr = match[1];
    }
    if (!paramsStr) {
      match = src.match(/^([\w$]+)\s*=>/);
      if (match) paramsStr = match[1];
    }
    if (paramsStr === null) return null;
    return parseParamList(paramsStr);
  }

  function formatFunctionDetail(name, fn) {
    const params = extractParamNames(fn);
    if (params) {
      return params.length === 0 ? `${name} ()` : `${name} (${params.join(", ")})`;
    }

    const arity = fn.length;
    const plural = arity === 1 ? "parameter" : "parameters";
    return `${name} (${arity} declared ${plural})`;
  }

  function walkObject(value, seen) {
    const kind = kindOf(value);

    if (kind === "function") {
      const params = extractParamNames(value);
      const name = value.name || "anonymous";
      return {
        kind: "function",
        name,
        params: params ?? [],
        declaredArity: params ? params.length : value.length,
        signature: formatFunctionDetail(name, value),
      };
    }

    if (kind === "object") {
      if (seen.has(value)) {
        return { kind: "object", circular: true, members: {} };
      }
      seen.add(value);

      /** @type {Record<string, unknown>} */
      const members = {};
      for (const key of Object.keys(value).sort()) {
        members[key] = walkObject(value[key], seen);
      }
      return {
        kind: "object",
        memberCount: Object.keys(members).length,
        members,
      };
    }

    if (kind === "array") {
      return { kind: "array", length: value.length };
    }

    if (kind === "number" || kind === "string" || kind === "boolean" || kind === "null") {
      return { kind, value };
    }

    return { kind };
  }

  function buildDump(api) {
    /** @type {Record<string, unknown>} */
    const namespaces = {};
    const seen = new WeakSet();
    let functions = 0;
    let entries = 0;

    function count(node) {
      entries++;
      if (node && typeof node === "object" && node.kind === "function") functions++;
      if (node && typeof node === "object" && node.members && typeof node.members === "object") {
        for (const child of Object.values(node.members)) count(child);
      }
    }

    for (const key of Object.keys(api).sort()) {
      namespaces[key] = walkObject(api[key], seen);
      count(namespaces[key]);
    }

    return {
      meta: {
        generatedAt: new Date().toISOString().slice(0, 10),
        entries,
        functions,
      },
      namespaces,
    };
  }

  globalThis.apiDumpObject = function apiDumpObject() {
    const api = resolveApi();
    if (!api) {
      console.error(
        "api not found. Load Sandustry with the example mod, then run apiDump() again.",
      );
      return null;
    }
    return buildDump(api);
  };

  globalThis.apiDump = function apiDump() {
    const payload = globalThis.apiDumpObject();
    if (!payload) return "";

    const text = JSON.stringify(payload, null, 2);
    console.log(text);
    console.info(
      `[apiDump] ${payload.meta.entries} entries, ${payload.meta.functions} functions`,
    );
    console.info("[apiDump] paste into sandkit-api/runtime-dump.json, then: npm run generate-types");

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => console.info("[apiDump] copied to clipboard"))
        .catch(() =>
          console.warn(
            "[apiDump] clipboard blocked — right-click the logged string and copy it",
          ),
        );
    }

    return text;
  };

  const api = resolveApi();
  if (!api) {
    console.warn("[apiDump] api not found yet — run apiDump() after the mod loads");
    return "";
  }

  console.info("[apiDump] running dump…");
  return globalThis.apiDump();
})();
