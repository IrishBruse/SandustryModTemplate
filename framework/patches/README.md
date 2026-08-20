# Patch builders

Typed helpers for Sandustry bundle patches. Mod patch files import these at build time; they are not bundled into `main.js`.

- `helpers.ts` — `insertBefore`, `replace`, `wrap`, and regex variants
- `finalize.ts` — assigns `id` from the patch filename during the patches build

Patch definitions live in [`src/patches/`](../../src/patches/) (production) and [`src/debug/patches/`](../../src/debug/patches/) (dev-only). See [`src/patches/README.md`](../../src/patches/README.md) for usage.
