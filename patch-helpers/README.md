# Patch helpers

TypeScript builders and types for Sandustry bundle patches.

- `helpers.ts` — `insertBefore`, `replace`, `wrap` (patch body omits `id`)
- `finalize.ts` — sets `id` from the patch filename at build time
- `types.ts` — patch shapes and JSDoc

One patch per file under `src/patches/` or `src/debug/patches/`. esbuild bundles them into `patches.json` for the mod output.

Patch shapes are also re-exported from `types/index.d.ts` for IDE use.
