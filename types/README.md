# Sandustry API types

This folder holds TypeScript definitions for the Sandustry modding API (`sandkit.api`).

Source data and docs live in [`api/source/`](api/source/). Generated `.d.ts` files live in [`api/generated/`](api/generated/).

## Layout

```
types/
  api/
    generated/     Auto-generated stubs (one file per namespace + index)
    source/        Runtime dump and docs overlay JSON
    index.d.ts     SandkitApi export
  framework/
    manifest.d.ts  Mod manifest (modinfo.ts)
    patch.d.ts     Output shapes for patches.json (sources: see src/patches/README.md)
    index.d.ts     Framework types entry
  common.d.ts      Shared primitives (CellPos, DataBag, …)
  enums.d.ts       sandkit.enums maps from the runtime dump
  sandkit.d.ts     sandkit global (api, react, state, enums, engine)
  engine.d.ts      sandkit.engine.api (retroConsole)
  global.d.ts      Declares sandkit and api in global scope
  index.d.ts       Package entry for IDE imports
```

## Source files

| File | Role |
|---|---|
| `types/api/source/runtime-dump.json` | Paste from DevTools (`scripts/api/dump-api-console.js`). Lists API members from the game. |
| `types/api/source/runtime-enums.json` | Paste `JSON.stringify(sandkit.enums, null, 2)` from DevTools. Source for `types/enums.d.ts`. |
| `types/api/source/official-api-reference.txt` | Vendored Sandkit API signatures (from [SandLoader](https://github.com/LopeKinz/SandLoader)). Merged on each generate run. |
| `types/api/source/api-docs.json` | Descriptions, param labels, `params[].type`, and `returnType`. Merged on each generate run. |
| `types/api/domain.d.ts` | Opaque domain type aliases used by generated signatures. |
| `scripts/api/api-type-curation.js` | Curated type overrides applied into `api-docs.json` on generate. |

## Generate types and docs

1. In Sandustry DevTools, run `scripts/api/dump-api-console.js`, then paste the JSON into `types/api/source/runtime-dump.json`.
2. Edit descriptions in `types/api/source/api-docs.json` (optional). Add or change types in `scripts/api/api-type-curation.js` for bulk curation. Update `types/api/source/official-api-reference.txt` when a new official reference is published.
3. Run:

```bash
npm run generate-types
```

This writes `types/api/generated/*.d.ts` with JSDoc from `api-docs.json`, and updates `api-docs.json` for any new or removed API members.

## Usage in mod source

Mod entry files (`main.js`, `worker.js`) do not use imports. Types are for IDE checking in separate `.ts` files:

```ts
import type { SandkitApi } from "types/api";
```

Globals `sandkit` and `api` are declared in `global.d.ts`.

## Patches

Patch **source** files are raw JavaScript. Leading `// @file`, `// @find`, and `// @expectedMatches` comments set the other fields; the filename is the id. The build writes `patches.json`.

Authoring guide: [`src/patches/README.md`](../src/patches/README.md). Output types: [`framework/patch.d.ts`](framework/patch.d.ts).

## Rules

- Do not edit `types/api/generated/` by hand.
- Edit `types/api/source/api-docs.json` for documentation text.
- Paste a new runtime dump when the game API changes.
