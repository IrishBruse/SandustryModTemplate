# Docs agent notes

Rules for editing files under `docs/`.

## Sandkit API reference

Do **not** keep API reference pages in this repo. The live reference is:

https://sandustry-modding.github.io/SandustryTypes/#/

Edit declarations in [SandustryTypes](https://github.com/sandustry-modding/SandustryTypes). Link out to that site from template docs and skills. Do not copy or regenerate `docs/api/` here.

## Site pages and code-side links

The install guide, folder layout, commands, and troubleshooting live in the [repository README](../README.md). Do not duplicate those pages under `docs/`.

Keep kit and reference Markdown under `docs/` so Docsify can serve it. Do not put a symlink inside `docs/` that points outside that tree.

When a kit needs a `docs/` folder next to the code, make that folder a symlink into `docs/`:

- [`modkit/docs`](../modkit/docs/) → `docs/modkit/`

Write kit pages in [`docs/modkit/`](modkit/). Do not put mod-specific pages under `docs/modkit/`.

A mod with its own repo documents in that repo with `README.md` and `CHANGELOG.md`. Builds do not copy those files.

## Sample mod READMEs (`examples/*/README.md`)

Those files live in [SandustryExamples](https://github.com/sandustry-modding/SandustryExamples). `npm run examples` clones them into `examples/`. Short player-facing copy. Builds do not copy these files into the game folder or `build/` staging.

- Use lists for steps and controls. Do not use markdown tables.
- Match the tone and structure of the other sample READMEs.

## Mod `CHANGELOG.md` and Discord

### Mod `CHANGELOG.md` (Steam change notes)

Each shipped mod may keep `src/<name>/CHANGELOG.md`. `npm run publish` sends the matching version section to Steam.

- Write for **players**, not developers.
- Say what changed in play (controls, options, feel, fixes you can notice).
- Do **not** mention patches, APIs, file paths, internals, or implementation unless that detail changes how the mod plays.
- Keep technical notes in that mod's `README.md`. `docs/modkit/` is kit-only.

### `discord-post.md`

- Evergreen pitch only: Quick start and Features.
- Do not put a **What's new** / dated change list here.
- Update Features / Quick start only when those sections are wrong.
