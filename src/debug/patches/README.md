# Debug patches

Dev-only bundle patches for Sandustry game JavaScript files.

**One patch per file.** The patch `id` is the filename without `.js`. Do not set `id` in the patch object.

Release builds (`npm run build`) omit this folder. Dev builds (`npm run dev`, VS Code debug tasks) include these patches in `patches.json`.

Use typed builders from [`framework/patches/helpers.ts`](../../../framework/patches/helpers.ts). See [`src/patches/README.md`](../../patches/README.md) for patch operations and examples.
