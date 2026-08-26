# Triage

## MCP unreachable

| Signal | Fix |
| ------ | --- |
| `list_pages` empty or errors | Game not running, or debug port off. Steam/F5 uses `:9222`. Live tests: start the isolated host (`npm test` brings it up on `:9223`). |
| Page list has no **Sandustry** title | Wait for load, or pick the `file://.../dist/index.html` renderer tab. |
| Call fails after game reload | Re-run `list_pages`; stale `pageId` is the usual cause. |

## Probe returns garbage

| Signal | Fix |
| ------ | --- |
| `hasSandkit: false`, `hasDebug: true` | Use `__debug.state` paths from **sandustry-world** / **sandustry-internals**. |
| `sandkit is not defined` | Mod scope symbol missing - open a save in **Game** scene first, see attach script in `scripts.md`. |
| `scene` not Game | Main menu or loading - load a save, or wait for auto-load (`modkit/test/session.ts` retries). |
| Exception in evaluate | Wrap risky calls in try/catch inside the function, return `{ error: String(e) }`. |
| Huge inline response | Re-run with `filePath: ".tmp/..."`. |

## Click misses

| Signal | Fix |
| ------ | --- |
| uid not found | Snapshot again, never reuse uids from an earlier turn. |
| `press_key` no effect | Canvas stole focus - click **Menu [Esc]** or use `evaluate_script` `keydown` on `window`. |
| Pause row won't click | Pause rows are often `div.cursor-pointer` - match `innerText`, not role. See **sandustry-ui**. |

## After mod or hot-reload work

1. `list_console_messages` with `types: ["error","warn"]`.
2. For poll/debug: `list_network_requests` with `resourceTypes: ["fetch","xhr"]`.
3. Ask the user for hard reload if behavior still matches old code.
