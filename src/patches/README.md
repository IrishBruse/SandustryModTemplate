# Patch definitions

Each `*.js` file is **raw JavaScript**. The build copies the file body into the patch `code` field. The filename without `.js` is the `id`.

Set the other fields with leading `// @key value` comments:

```js
// @file js/bundle.js
// @find initializing workers
// @expectedMatches 1

[patched]
```

`@operation` defaults to `replace`. Use `insertBefore` or `wrap` when you need those.

At build time the build scans the folders below and writes `patches.json`. The game loader applies those patches to Sandustry JavaScript files (for example `js/bundle.js`).

Patch shapes live in `framework/types/patch.d.ts`.

## When to use patches

Prefer the Sandkit API first. Use patches only when the public API cannot do the job.

Patches are string rewrites on minified game code. Keep each patch small, set `@expectedMatches`, and test after every game update — bundle text can change and break `@find` strings.

Patch `code` runs outside the game bundle IIFE. Put shared runtime helpers on `globalThis` if patch code needs them.

## Layout

| Location | Role |
|---|---|
| `framework/patches/*.js` | Shared production patches |
| `src/patches/*.js` | Mod production patches |
| `framework/patches/debug/*.js` | Shared debug patches (splash skip, …) |
| `src/patches/debug/*.js` | Mod debug patches |

The scan is not recursive: `patches/*.js` never includes `patches/debug/*.js`.

Release builds (`npm run build`) omit `debug/`. Dev builds (`npm run dev`, VS Code debug tasks, `npm run sandustry`) include them.

## Comments

| Comment | Field |
|---|---|
| `// @file` | Target file under `js/` (required) |
| `// @find` | Exact match string (required unless `@regex`) |
| `// @expectedMatches` | Match count; load fails if it differs (required) |
| `// @operation` | `replace` (default), `insertBefore`, or `wrap` |
| `// @regex` | Regex pattern instead of `@find` |
| `// @regexFlags` | Regex flags, for example `i` |
| `// @atomicGroup` | Optional group name; all patches in the group succeed or none apply |
| `// @before` / `// @after` | Required when `@operation wrap` |

## Operations

| Operation | Effect |
|---|---|
| `replace` | Replace each match with the file body |
| `insertBefore` | Insert the file body before each match |
| `wrap` | Wrap each match with `@before` + match + `@after` |

Match by exact `@find` when you can. Use `@regex` only when the bundle text is not stable enough for a literal match.

Always set `@expectedMatches`. The mod loader fails if the match count differs — this catches broken patches early.

## Adding a patch

Create a new `.js` file named after the patch id:

```js
// src/patches/bundle-log-prefix.js
// @file js/bundle.js
// @find initializing workers
// @operation insertBefore
// @expectedMatches 1

[patched]
```

Shared debug example: [`framework/patches/debug/skip-startup-splash.js`](../../framework/patches/debug/skip-startup-splash.js).

## Build output

Do not edit `dist/patches.json` by hand. Add or change patch files and rebuild:

```bash
npm run build          # release — no debug patches
npm run dev            # debug — includes patches/debug
```
