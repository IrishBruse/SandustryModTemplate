# `modinfo.ts`

Manifest for one mod. Export `const modinfo = defineModInfo({ ... })` from `@modkit/modinfo`.

The build writes `modinfo.json` into `dist/<modinfo.id>/` (and `build/<modinfo.id>/` on `npm run build`). The game folder name is **`id`**, not the repo folder and not **`name`**.

Shapes: [`modkit/modinfo.ts`](../modkit/modinfo.ts). Settings UI: [configSchema](config-schema.md). Bundle rewrites: [Patches](patches.md). Layout: [Folder layout](layout.md).

Canonical starter: [`src/template/modinfo.ts`](../src/template/modinfo.ts). Settings showcase: [`examples/api/settings/`](../examples/api/settings/).

## Required fields

| Field             | Type     | Role                                                                                    |
| ----------------- | -------- | --------------------------------------------------------------------------------------- |
| `manifestVersion` | `1`      | Manifest schema. Use `1`.                                                               |
| `id`              | `string` | OS mods folder and Workshop identity. Use `author.mod` (for example `author.template`). |
| `name`            | `string` | Display name in Options → Mods and the loader.                                          |
| `version`         | `string` | Mod version (for example `0.0.1`). Steam changenotes match this to `CHANGELOG.md`.      |
| `apiVersion`      | `number` | Sandkit API generation. Use `1`.                                                        |

The build fails if `id` or `name` is missing or blank.

## Optional fields

| Field              | Type                     | Default / notes                                                                                                                                                                           |
| ------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entry`            | `string`                 | Main-thread script. Default in types is `main.js`. Set `"main.js"`.                                                                                                                       |
| `workerEntry`      | `string`                 | Worker script. If the folder has `worker.ts`, the build sets `"worker.js"` when this field is omitted.                                                                                    |
| `description`      | `string`                 | Loader / Workshop fallback when `workshop/workshop.md` is missing.                                                                                                                        |
| `author`           | `string`                 | Author label.                                                                                                                                                                             |
| `dependencies`     | `string[]`               | Other mods by **`id`**. Empty list is fine.                                                                                                                                               |
| `loadOrder`        | `number`                 | Load order hint. Lower sorts earlier in host analysis. Entry eval may still follow save/session order — Dev Tools installs its API wrap in an early boot patch.                                                                                          |
| `gameVersion`      | `GameVersionRange`       | Optional `minimum` and `maximum` strings (0.5.5+). Set `minimum: "0.5.5"` when the mod needs new hooks or APIs. Use Steam Workshop **Link to Game Version** to cap patch mods at `0.5.2`. |
| `configSchema`     | object                   | Options → Mods fields. Max 64. See [configSchema](config-schema.md).                                                                                                                      |
| `configOverrides`  | `Record<string, string>` | Paths under `config/`.                                                                                                                                                                    |
| `shaderOverrides`  | `ShaderOverrides`        | Maps shader IDs to relative `.glsl` paths (for example `sky` → `shaders/sky.glsl`).                                                                                                       |
| `textureOverrides` | sheets or path strings   | Paths under `assets/`. A sheet needs `path`, `frameWidth`, `frames`, `intervalMs`.                                                                                                        |
| `provides`         | `AssetProvider[]`        | Asset provider bundles. Each entry has `kind`, `id`, and `textureOverrides` (same shape as top-level `textureOverrides`).                                                                 |
| `map`              | `MapConfig`              | Custom map under `map/` (`blueprints`, `width`, `height`, `spawn`, optional unstuck / deployment / bounds / lighting / parallax / colour maps).                                           |

## Extra exports (not inside `modinfo`)

Keep these next to `export const modinfo` in the same file, or re-export them:

| Export         | Role                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `patches`      | Production patches. Array from `definePatches` (`@modkit/patches`). Written to `patches.json`. |
| `debugPatches` | Extra patches for `npm run dev` / `--debug` only. Omitted from `npm run build`.                |

Example re-export from `patches.ts`:

```ts
export { patches } from "./patches";
```

See [`examples/api/collector-patches/modinfo.ts`](../examples/api/collector-patches/modinfo.ts).

## Minimal example

```ts
import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.template",
  name: "Template",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "Your Name",
  description: "Starter mod. Toast on load.",
  dependencies: [],
  loadOrder: 0,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn the mod off without unsubscribing.",
    },
  },
});
```

Use `modinfo.id` in code when you need the mod id. Do not hard-code a second copy of the id string.

## Workshop

`workshop/workshop.json` is not part of `defineModInfo`. It uses `schemaVersion: 1` and `publishedFileId`. See [Builds](builds.md).
