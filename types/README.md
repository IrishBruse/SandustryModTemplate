# Sandustry API types

This folder holds TypeScript definitions for the Sandustry modding API (`sandkit.api`).

Source data and docs live in [`../sandkit-api/`](../sandkit-api/). Generated `.d.ts` files live here.

## Layout

```
types/
  api/
    generated/     Auto-generated stubs (one file per namespace + index)
    index.d.ts     SandkitApi export
  common.d.ts      Shared primitives (CellPos, DataBag, …)
  sandkit.d.ts     sandkit global (api, react, state, enums, engine)
  global.d.ts      Declares sandkit and api in global scope
  index.d.ts       Package entry for IDE imports
```

## Source files (outside `types/`)

| File | Role |
|---|---|
| `sandkit-api/runtime-dump.json` | Paste from DevTools (`scripts/dump-api-console.js`). Lists API members from the game. |
| `sandkit-api/api-docs.json` | Descriptions, param labels, `params[].type`, and `returnType`. Merged on each generate run. |
| `scripts/api-type-curation.js` | Curated type overrides applied into `api-docs.json` on generate. |

## Generate types and docs

1. In Sandustry DevTools, run `scripts/dump-api-console.js`, then paste the JSON into `sandkit-api/runtime-dump.json`.
2. Edit descriptions in `sandkit-api/api-docs.json` (optional). Add or change types in `scripts/api-type-curation.js` for bulk curation.
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

## Rules

- Do not edit `types/api/generated/` by hand.
- Edit `sandkit-api/api-docs.json` for documentation text.
- Paste a new runtime dump when the game API changes.
