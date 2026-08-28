# Patch definitions

On **0.5.5+**, prefer the public [Sandkit API](https://sandustry.com/sandkit.html) ([local copy](../.tmp/Sandkit%20-%20Sandustry%20Modding%20API.html)). Use **`api.hooks`**, **`configOverrides`**, and **`register`** APIs before you rewrite game bundles.

`patches.json` breaks when the game updates. Minified `find` strings move. Re-test every patch after a game update.

Set **`gameVersion`** in `modinfo.json` to declare compatibility ([`modinfo.ts`](modinfo.md)):

- **Patch-only mods** (bundle rewrites tied to old minified text): set **`maximum: "0.5.2"`**, or use Steam Workshop **Link to Game Version** with the same cap.
- **New API mods** (hooks, `configOverrides`, 0.5.5 Sandkit): set **`minimum: "0.5.5"`**.

Patches are exact (or regex) rewrites of Sandustry JavaScript under `js/`. The loader applies `patches.json` at **mod load**. Renderer hot reload does **not** re-apply them. Restart the game after you change a patch.

Use a patch only when the public API cannot do the job.

Keep each `find` / `code` string small. Set `expectedMatches`.

Patch `code` runs **outside** the game bundle IIFE. Put shared runtime helpers on `globalThis` when patch code must call them.

Types: [`modkit/patches.ts`](../modkit/patches.ts). Manifest: [`modinfo.ts`](modinfo.md). Canonical multi-file example: [`examples/api/collector-patches/patches.ts`](../examples/api/collector-patches/patches.ts).

## Layout

Define the list with `definePatches` from `@modkit/patches`. Export it from that mod's `modinfo.ts`. You may keep the array in `patches.ts` at the mod root and re-export it.

| Export         | When it is written                                |
| -------------- | ------------------------------------------------- |
| `patches`      | Always (`patches.json`)                           |
| `debugPatches` | Dev / `--debug` only. Merged **after** `patches`. |

Release (`npm run build`, `npm run dev:release`) omits `debugPatches`. Dev (`npm run dev`) includes both.

The hot-reload companion ships **`debugPatches`**. **Fast dev boot** (`localStorage["hot-reload.fastBoot"]` is `"true"`) skips `foliage.generate`. Raster fill, shadow rebuild, and shader compile stay vanilla. Auto-load last save is a runtime helper on that companion, not a file patch.

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
  find: 'const n=(e=>(null===l&&(l=i.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===o.RJ.Gold||t.type===n?d:f}',
  operation: "replace",
  code: "return i.FH.collector.getValueFromElementType(e,t.type)>0?d:f}",
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
import { definePatches } from "@modkit/patches";

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
