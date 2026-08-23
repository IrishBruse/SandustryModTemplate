# Sandkit API types (vendored)

Declaration files mirror the live `sandkit` object:

| Path | Live object |
| --- | --- |
| `sandkit/api/` | `sandkit.api` (main thread) |
| `sandkit/engine/api/` | `sandkit.engine.api` (engine-only namespaces) |
| `sandkit/engine/state.d.ts` | `sandkit.engine.state` / `sandkit.state` |
| `sandkit/enums/` | `sandkit.enums` |
| `sandkit/react.d.ts` | `sandkit.react` |
| `global.d.ts` | Ambient `sandkit` value + type names |
| `worker/` | Worker-thread `sandkit.api` typing entry |
| `shared/` | Shared domain shapes and base API declarations reused by main and worker |

- **Upstream:** https://github.com/flamableassassin/sandustry-modding-types
- **API reference:** https://flamableassassin.github.io/sandustry-modding-types/
- **Vendored commit:** see [`SOURCE.json`](SOURCE.json)
- **License:** [`LICENSE`](LICENSE) (copied from upstream)

To fix or extend API shapes, open an issue or pull request on the upstream repo.
After upstream merges, refresh this folder from the new upstream `src/**/*.d.ts`
and update `SOURCE.json`.
