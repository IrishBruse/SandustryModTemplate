/**
 * Paste this whole file into Sandustry DevTools (Console tab).
 *
 * Requires the example mod loaded so window.api exists.
 * Output matches types/api/runtime-dump.txt
 * Paste into that file, then run: npm run generate-types
 *
 * Tips:
 * - Right-click the logged string → "Copy string contents"
 * - Or use copy(apiDump()) if the clipboard API is allowed
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

  function walk(path, value, depth, seen, lines) {
    const kind = kindOf(value);
    const indent = "  ".repeat(depth);

    if (kind === "function") {
      const name = value.name || path.split(".").pop();
      const arity = value.length;
      const plural = arity === 1 ? "parameter" : "parameters";
      lines.push(
        `${indent}- \`${path}\` — \`function\` — \`${name} (${arity} declared ${plural})\``,
      );
      return;
    }

    if (kind === "object") {
      if (seen.has(value)) {
        lines.push(`${indent}- \`${path}\` — \`object\` — \`[circular]\``);
        return;
      }
      seen.add(value);

      const keys = Object.keys(value).sort();
      const label = keys.length === 1 ? "property" : "properties";
      lines.push(
        `${indent}- \`${path}\` — \`object\` — \`${keys.length} ${label}\``,
      );
      for (const key of keys) {
        walk(`${path}.${key}`, value[key], depth + 1, seen, lines);
      }
      return;
    }

    if (kind === "array") {
      lines.push(`${indent}- \`${path}\` — \`array\` — \`${value.length} items\``);
      return;
    }

    lines.push(`${indent}- \`${path}\` — \`${kind}\``);
  }

  function dump(api) {
    const seen = new WeakSet();
    const body = [];
    const namespaces = Object.keys(api).sort();

    for (const key of namespaces) {
      walk(`api.${key}`, api[key], 0, seen, body);
    }

    const functions = body.filter((line) => line.includes("— `function`")).length;
    const entries = body.length;
    const stamp = new Date().toISOString().slice(0, 10);

    return [
      `# Sandkit API runtime dump (${stamp})`,
      `# Entries: ${entries}, Functions: ${functions}`,
      `# Paste below into types/api/runtime-dump.txt, then: npm run generate-types`,
      "",
      ...body,
      "",
    ].join("\n");
  }

  globalThis.apiDump = function apiDump() {
    const api = resolveApi();
    if (!api) {
      console.error(
        "api not found. Load Sandustry with the example mod, then run apiDump() again.",
      );
      return "";
    }

    const text = dump(api);
    console.log(text);
    console.info(
      `[apiDump] ${text.split("\n").length} lines, ${(text.match(/— `function`/g) ?? []).length} functions`,
    );

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
  if (api) {
    console.info("[apiDump] ready — run apiDump()");
  } else {
    console.warn("[apiDump] api not found yet — run apiDump() after the mod loads");
  }
})();
