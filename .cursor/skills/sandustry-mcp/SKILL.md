---
name: sandustry-mcp
description: "Sandustry CDP via namespace sandustry (CallDynamicTool): attach, probe, click, triage. Use when verifying live game state, driving UI, evaluate_script, list_pages, or chrome-devtools on Sandustry."
---

# Sandustry MCP

Chrome DevTools MCP on the Sandustry Electron renderer. Domain facts stay in **sandustry-ui**, **sandustry-world**, **sandustry-internals**, and sibling skills - load **one** of those after attach.

## Attach

1. `GetDynamicTools` once for the tool you need (skip repeat discovery on the same tool).
2. `list_pages` - pick title **Sandustry**, URL `file://.../dist/index.html`.
3. Remember `pageId`; it changes after reload, reconnect, or a new tab. Re-run `list_pages` when a call fails or the game restarted.
4. Done when the next MCP call succeeds on that `pageId`.

| Port | Instance |
| ---- | -------- |
| `:9222` | Player / Steam / F5 debug renderer |
| `:9223` | Isolated test host (`.tmp/sandustry-test`, `npm test`) |

Never kill Sandustry. Ask the user for a hard reload when code or mods changed.

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
  const state =
    sk?.engine?.state ?? sk?.state ?? g.__debug?.state ?? null;
  return {
    hasSandkit: Boolean(sk?.api),
    hasDebug: Boolean(g.__debug),
    scene: state?.store?.scene?.active ?? null,
  };
};
```

Ambient `sandkit` works inside mod bundle scope when mods are loaded. `window.sandkit` is often missing - use `__debug.state` for vanilla reads. Mutator bans live in each domain skill's probe reference.

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
