# Patch definitions

Patches are exact (or regex) rewrites of Sandustry JavaScript under `js/`. The loader applies `patches.json` at **mod load**. Renderer hot reload does **not** re-apply them. Restart the game after you change a patch.

Prefer the Sandkit API first. Use a patch only when the public API cannot do the job.

Keep each `find` / `code` string small. Set `expectedMatches`. Re-test after every game update — minified bundle text moves.

Patch `code` runs **outside** the game bundle IIFE. Put shared runtime helpers on `globalThis` when patch code must call them.

Types: [`modkit/modinfo.ts`](../modkit/modinfo.ts). Manifest: [`modinfo.ts`](modinfo.md). Canonical multi-file example: [`examples/api/collector-patches/patches.ts`](../examples/api/collector-patches/patches.ts).

## Layout

Define the list with `definePatches`. Export it from that mod's `modinfo.ts`. You may keep the array in `patches.ts` at the mod root and re-export it.

| Export         | When it is written                                |
| -------------- | ------------------------------------------------- |
| `patches`      | Always (`patches.json`)                           |
| `debugPatches` | Dev / `--debug` only. Merged **after** `patches`. |

Release (`npm run build`, `npm run dev:release`) omits `debugPatches`. Dev (`npm run dev`) includes both.

The hot-reload companion ships **`debugPatches`** that skip outline shader build, `warmup`, and the **Compiling shaders…** splash when `localStorage["hot-reload.skipShaderRecomp"]` is `"true"` (Options → **Skip shader recompile**). **Fast dev boot** skips the logo splash on `?db_load=` when `localStorage["hot-reload.fastBoot"]` is `"true"` and does not enable the other boot settings. Auto-load last save is a runtime helper on that companion, not a file patch.

The browser bundle stubs `@modkit/patches` so patch payloads stay out of `main.js`.

## Build validation

`scripts/lib/build-patches.js` checks each patch before it writes JSON:

- `id` is a non-empty string and unique in the written list
- `file` matches `js/<name>.js` (one folder, `.js` only)
- `operation` is `insertBefore`, `replace`, or `wrap`
- `expectedMatches` is an integer
- exactly one of `find` (non-empty string) or `regex` (`{ pattern, flags? }`)
- `replace` / `insertBefore` need non-empty `code`
- `wrap` needs `before` and `after` strings

The game loader also fails the mod if the live match count is not `expectedMatches`.

Do not edit `dist/<modinfo.id>/patches.json` by hand. Change the export and rebuild.

```bash
npm run build          # release — no debugPatches
npm run dev            # debug — patches + debugPatches
npm run dev:release    # watch release — no debugPatches
```

## Fields

| Field              | Role                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `id`               | Unique patch id (required)                                                                                |
| `file`             | Target under `js/` (required). Typical: `js/bundle.js`, `js/simulation-worker.js`, `js/utility-worker.js` |
| `find`             | Exact substring (required unless `regex`)                                                                 |
| `regex`            | `{ pattern, flags? }` instead of `find`                                                                   |
| `expectedMatches`  | Required match count                                                                                      |
| `operation`        | `replace`, `insertBefore`, or `wrap`                                                                      |
| `code`             | Body for `replace` and `insertBefore`                                                                     |
| `before` / `after` | Required for `wrap`                                                                                       |
| `atomicGroup`      | Optional name. Every patch in the group must apply, or none do                                            |

Match with exact `find` when the text is stable. Use `regex` only when a literal match is not stable.

## Operations

### `insertBefore`

Insert `code` immediately before each match.

```ts
{
  id: "bundle-log-prefix",
  file: "js/bundle.js",
  find: "initializing workers",
  operation: "insertBefore",
  code: "[patched]",
  expectedMatches: 1,
}
```

### `replace`

Replace each match with `code`. The collector sample replaces a Gold / liquidGold type check with a collector-value check on **three** files, one `atomicGroup`:

```ts
{
  id: "collector-admission-value-map-main",
  file: "js/bundle.js",
  find: 'const n=(e=>(null===l&&(l=s.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===r.RJ.Gold||t.type===n?d:f}',
  operation: "replace",
  code: "return s.FH.collector.getValueFromElementType(e,t.type)>0?d:f}",
  expectedMatches: 1,
  atomicGroup: "collector-admission-value-map",
}
```

Copy `find` from the extracted bundle in `sandustry/<version>-<branch>/`. Do not reuse old minified snippets after a game update.

### `wrap`

Wrap each match as `before` + match + `after`. Use this when you must keep the original text and add a prefix and suffix.

```ts
{
  id: "wrap-example",
  file: "js/bundle.js",
  find: "/* stable marker */",
  operation: "wrap",
  before: "/* patched-before */",
  after: "/* patched-after */",
  expectedMatches: 1,
}
```

## Adding patches

```ts
// src/<name>/modinfo.ts
import { definePatches } from "@modkit/modinfo";

export const patches = definePatches([
  {
    id: "bundle-log-prefix",
    file: "js/bundle.js",
    find: "initializing workers",
    operation: "insertBefore",
    code: "[patched]",
    expectedMatches: 1,
  },
]);

/** Extra debug-only patches for this mod. */
export const debugPatches = definePatches([
  // ...
]);
```

Or keep the list in `patches.ts` and re-export:

```ts
// src/<name>/modinfo.ts
export { patches } from "./patches";
```
