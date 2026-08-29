# Mod manifest (`modinfo.json` / `modinfo.ts`)

Manifest for one mod. Use **either** JSON or TypeScript. The build supports both.

When both `modinfo.json` and `modinfo.ts` exist in the same folder, **`modinfo.ts` wins**.

## JSON manifest

Author `modinfo.json` with `$schema` for IDE validation:

```json
{
  "$schema": "https://sandustry-modding.github.io/SandustryTypes/schemas/modinfo.json",
  "manifestVersion": 1,
  "id": "author.template",
  "name": "Template",
  "version": "0.0.1",
  "apiVersion": 1,
  "entry": "main.js"
}
```

Import it from `main.ts`:

```ts
import modinfo from "./modinfo.json";
```

## TypeScript manifest

Use `defineModInfo` in `modinfo.ts`:

```ts
import { defineModInfo } from "@modkit/modinfo";

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "author.template",
  name: "Template",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
});
```

Or import JSON through the helper:

```ts
import manifest from "./modinfo.json";
import { modinfoFromJson } from "@modkit/modinfo";

export const modinfo = modinfoFromJson(manifest);
```

Patch exports can live on `modinfo.ts` (`export { patches } from "./patches"`).

The build writes `modinfo.json` into `dist/<modinfo.id>/` (and `build/<modinfo.id>/` on `npm run build`) **without** `$schema`. The game folder name is **`id`**, not the repo folder and not **`name`**.

Shapes: `@sandustry-modding/types/configs` (`ModInfo`), via [`modkit/modinfo.ts`](../modkit/modinfo.ts). Settings UI: [configSchema](config-schema.md). Bundle rewrites: [Patches](patches.md). Layout: [Folder layout](layout.md).

Canonical starter: [`src/template/modinfo.json`](../src/template/modinfo.json). Settings showcase: [`examples/api/settings/`](../examples/api/settings/).

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
| `loadOrder`        | `number`                 | Load order hint. Lower sorts earlier in host analysis. Entry eval may still follow save/session order — Dev Tools installs its API wrap in an early boot patch.                           |
| `gameVersion`      | `ModGameVersion`         | Optional `minimum` and `maximum` strings (0.5.5+). Set `minimum: "0.5.5"` when the mod needs new hooks or APIs. Use Steam Workshop **Link to Game Version** to cap patch mods at `0.5.2`. |
| `configSchema`     | object                   | Options → Mods fields. Max 64. See [configSchema](config-schema.md).                                                                                                                      |
| `configOverrides`  | `Record<string, string>` | Paths under `config/`.                                                                                                                                                                    |
| `shaderOverrides`  | `ShaderOverrides`        | Maps shader IDs to relative `.glsl` paths (for example `sky` → `shaders/sky.glsl`).                                                                                                       |
| `textureOverrides` | sheets or path strings   | Paths under `assets/`. A sheet needs `path`, `frameWidth`, `frames`, `intervalMs`.                                                                                                        |
| `provides`         | `ModProvide[]`           | Asset provider bundles. Each entry has `kind`, `id`, and `textureOverrides` (same shape as top-level `textureOverrides`).                                                                 |
| `map`              | `ModMapDefinition`       | Custom map under `map/` (`blueprints`, `width`, `height`, `spawn`, optional unstuck / deployment / bounds / lighting / parallax / colour maps).                                           |

## Patches

See [Patches](patches.md). Patch lists can live in `patches.json` or `patches.ts`.

## Minimal example

[`src/template/modinfo.json`](../src/template/modinfo.json) is the starter JSON manifest.

Use the `id` field in code when you need the mod id. Do not hard-code a second copy of the id string.

## Workshop

`workshop/workshop.json` is not part of the manifest. It uses `schemaVersion: 1` and `publishedFileId`. See [Builds](builds.md).
