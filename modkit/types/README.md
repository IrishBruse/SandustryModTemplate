# Sandkit API types

Vendored TypeScript declarations for the live `sandkit` object injected into mod bundles. Folder layout mirrors runtime shape so you can jump from code to the matching `.d.ts` path.

## Runtime map

| Path | Runtime object |
| --- | --- |
| `sandkit/api/` | `sandkit.api` (main thread) |
| `sandkit/engine/api/` | `sandkit.engine.api` |
| `sandkit/engine/state.d.ts` | `sandkit.engine.state` / `sandkit.state` |
| `sandkit/enums/` | `sandkit.enums` |
| `sandkit/react.d.ts` | `sandkit.react` |
| `sandkit/index.d.ts` | Composed `Sandkit` root type |
| `global.d.ts` | Ambient `sandkit` free variable and type aliases |
| `worker/` | Worker-thread `sandkit.api` (see `WorkerSandkitApi`) |
| `shared/` | Internal base shapes reused by main and worker declarations |

## Runtime shape vs `export namespace`

At runtime, every API bag is a **plain object** with function properties — not a TypeScript `namespace`. MCP checks on a live game session show:

- `sandkit.api`, `sandkit.api.ui`, `sandkit.api.ui.overlays`, and `sandkit.engine.api.game` are all `typeof "object"` with `Object.prototype`
- Nested keys hold functions or further plain objects

Declaration files use `export namespace` because it is the usual `.d.ts` pattern for nested object APIs. It matches how you call the API (`sandkit.api.ui.update`) and supports `export import` when main and worker share base shapes under `shared/`.

`interface` or `type` object literals would also work for runtime shape, but they do not support the `export import` re-export style used across main, worker, and shared modules.

## Usage

- **Main mod (`main.js`):** use the ambient free name `sandkit`. Type aliases such as `SandkitApi` are global; do not import a value binding.
- **Worker mod (`worker.js`):** type `sandkit.api` as `WorkerSandkitApi`. Worker and main APIs overlap but are not interchangeable.
- **Shared folder:** not a runtime namespace. It holds domain shapes and API bases that main and worker modules extend.

## Upstream

Types are copied from the upstream repo. For license, vendored commit, and refresh steps, see [ATTRIBUTION.md](./ATTRIBUTION.md).

- **Upstream repo:** https://github.com/flamableassassin/sandustry-modding-types
- **API reference:** https://flamableassassin.github.io/sandustry-modding-types/

To change API shapes, open an issue or pull request upstream, then refresh this folder from upstream `src/**/*.d.ts` and update `SOURCE.json`.

## Docs site

Regenerate the Docsify API reference from these declarations:

```bash
npm run docs:api
```

Output lands in `docs/api/`. `npm run docs` runs that step, then serves the docs site.
