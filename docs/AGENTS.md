# Docs agent notes

Rules for editing files under `docs/`.

## Writing style

Use **ASD-STE100 Simplified Technical English**:

- Short sentences. One idea per sentence.
- Prefer active voice and clear verbs (`run`, `set`, `open`, `write`).
- Prefer lists. Use a markdown table only when the table stays narrow.
- Prefer concrete paths, commands, and UI labels over vague wording.
- Prefer **bold** for key terms and UI labels. Do not bold whole sentences.
- Link related pages with relative paths (`layout.md`, `hot-reload/`).
- Match the tone of nearby pages. Do not invent a new voice.

Avoid:

- Long compound sentences and filler.
- Marketing tone in guide pages.
- Duplicating large code samples that already live next to the feature.

## Generated API reference (`docs/api/`)

`docs/api/` is **generated** from `modkit/types/` by `npm run docs:api`. Do not edit those Markdown files by hand.

- Change JSDoc in `modkit/types/**/*.d.ts`, then run `npm run docs:api`.
- Main docs sidebar links to **Sandkit API** only (`api/README.md`). The API tree uses [`api/_sidebar.md`](api/_sidebar.md), generated with the reference (commit this file so the API sidebar works before a full regen).
- Other files under `docs/api/` are generated; run `npm run docs:api` before `npm run docs` or publishing the docs site.

## Site pages and code-side links

Keep the real Markdown under `docs/` so Docsify can serve it. Do not put a symlink inside `docs/` that points outside that tree.

When a kit or mod needs a `docs/` folder next to the code, make that folder a symlink into `docs/`:

- [`modkit/docs`](../modkit/docs/) → `docs/modkit/`
- [`src/hot-reload/docs`](../src/hot-reload/docs/) → `docs/hot-reload/`

Write kit pages in [`docs/modkit/`](modkit/). Write companion pages in [`docs/hot-reload/`](hot-reload/). Do not put companion pages under `docs/modkit/`.

Mods that are not on the site may keep a real `src/<name>/docs/` folder. Builds do not copy `docs/` folders.

## Sample mod READMEs (`examples/*/README.md`)

Short player-facing copy. Builds do not copy these files into the game folder or `build/` staging.

- Use lists for steps and controls. Do not use markdown tables.
- Match the tone and structure of the other `*-example` READMEs.

## Changelog and Discord

When a change is **user-visible** (new feature, behaviour change, fix, removal, or docs that announce a product change), update [`Changelog.md`](Changelog.md) in the same change set. Do not wait for a release tag.

### Mod `CHANGELOG.md` (Steam change notes)

Each shipped mod may keep `src/<name>/CHANGELOG.md`. `npm run publish` sends the matching version section to Steam.

- Write for **players**, not developers.
- Say what changed in play (controls, options, feel, fixes you can notice).
- Do **not** mention patches, APIs, file paths, internals, or implementation unless that detail changes how the mod plays.
- Keep technical notes in that mod's `docs/` folder, or in `docs/<name>/` when the site has a page. Do not put mod-specific pages under `docs/modkit/`.

### `Changelog.md`

- Newest first. Follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Use dated sections (`## YYYY-MM-DD`) for work that landed on `main`. Put in-progress notes under `## Unreleased` until they land.
- Group under `### Added`, `### Changed`, `### Fixed`, `### Removed` as needed.
- Write full bullets: what changed and why it matters. Link to related docs when useful.
- Keep sample-mod tables and debugger notes in the full changelog when they help a reader.

### `discord-post.md`

- Evergreen pitch only: Quick start, Features, and the **Full changelog** link.
- Do not put a **What's new** / dated change list here. Put those in `Changelog.md` only.
- Update Features / Quick start only when those sections are wrong.
