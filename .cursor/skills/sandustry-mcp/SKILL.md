---
name: sandustry-mcp
description: "Use when attaching to live Sandustry: evaluate_script, list_pages, click, CDP :9222/:9224, void-world batches. Official API HTML. Domain facts: Read sandustry/SKILL.md then one domain SKILL.md."
---

# Sandustry MCP

Chrome DevTools MCP on the Sandustry Electron renderer. Official Sandkit API: `.tmp/Sandkit - Sandustry Modding API.html`. After attach, vanilla facts: Read `.cursor/skills/sandustry/SKILL.md`, then **one** domain `SKILL.md`.

## Attach

1. `GetDynamicTools` once for the tool you need (skip repeat discovery on the same tool).
2. `list_pages` - pick title **Sandustry**, URL `file://.../dist/index.html`.
3. Remember `pageId`; it changes after reload, reconnect, or a new tab. Re-run `list_pages` when a call fails or the game restarted.
4. Done when the next MCP call succeeds on that `pageId`.

| Port    | Instance                                                                           |
| ------- | ---------------------------------------------------------------------------------- |
| `:9222` | Player / Steam / F5 debug renderer                                                 |
| `:9224` | Extracted-game Chromium (`npm run test:integration`, `.tmp/sandustry-test-chrome`) |

Never kill Sandustry. Ask the user for a hard reload when code or mods changed. Restart the game (F5) after `worker.js` or `patches.json` changes. Do not use save reload as a substitute on Steam.

## Probe

Read live state with `evaluate_script`:

- Set `waitForStableDom: false`.
- Return JSON-serializable data only, slice large strings (for example `.slice(0, 2000)`).
- Batch related reads in **one** function - not one call per field.
- Large output -> `filePath` under `.tmp/`.

**Entry resolution** (use the first that works):

```javascript
() => {
  const g = globalThis;
  const sk = typeof sandkit !== "undefined" ? sandkit : g.sandkit;
  const state = sk?.engine?.state ?? sk?.state ?? g.__debug?.state ?? null;
  return {
    hasSandkit: Boolean(sk?.api),
    hasDebug: Boolean(g.__debug),
    scene: state?.store?.scene?.active ?? null,
  };
};
```

Ambient `sandkit` works in `evaluate_script` on 0.5.5 (`hasSandkit: true` when `sandkit.api` exists). **`window.sandkit` may still be missing** - check `typeof window.sandkit`; fall back to `__debug.state` for vanilla reads when needed. Do not call mutators (`api.game.start`, saves, grid writes) unless the user asks. Mutator bans live in each domain skill's probe reference.

Done when the returned shape answers the question (or triage explains why not).

## Click

Screen work -> **sandustry-ui** for labels and panel maps.

1. `take_snapshot` (prefer over screenshot).
2. Click `uid` from the **latest** snapshot. Uids die after DOM changes - snapshot again before the next click.
3. `press_key` when focus matters, use `includeSnapshot: true` to confirm. If keys are swallowed, dispatch `keydown` via `evaluate_script` or click **Menu [Esc]**.
4. `fill_form` beats many `fill`/`click` pairs on the same form.
5. Done when the target label or state flag appears in the latest snapshot or script result.

## Triage

When attach, probe, or click fails: [references/triage.md](references/triage.md).

## Script templates

Reusable bundles (mod reload, window flags, DOM probes): [references/scripts.md](references/scripts.md).

## Void world (batched mutators)

Full-grid wipes must run in row batches with saves between chunks or MCP times out and the game freezes.

Workflow, batch sizes, save pattern, and copy-paste phases: [references/void-world.md](references/void-world.md).

Background buffers and Pixi layers: **sandustry-world** `references/background-layers.md`.
