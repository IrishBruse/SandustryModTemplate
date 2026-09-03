# Host mod loader

`sandustry/source/workshop-mods.js` (game process).
Template docs: `docs/patches.md`, `docs/modinfo.md`, `docs/config-schema.md`.

## Constants (0.5.5 extract)

| Limit              | Value                                            |
| ------------------ | ------------------------------------------------ |
| Manifest file      | `modinfo.json`, version 1                        |
| API version        | 1                                                |
| Manifest max       | 64 KiB                                           |
| `patches.json` max | 1 MiB, 256 patches/mod                           |
| Patch id           | `^[a-zA-Z0-9_.-]+$`, max 128 chars               |
| Operations         | replace, remove, insertBefore, insertAfter, wrap |
| Source file max    | 1 MiB                                            |
| Texture file max   | 16 MiB (png/webp/jpg/jpeg)                       |
| Map blueprint max  | 64 MiB                                           |
| Map config max     | 1 MiB                                            |
| Map dimension      | 3840                                             |
| Color mappings     | 64                                               |
| Config fields      | 64                                               |
| Choice options     | 64                                               |
| `configOverrides`  | 32 files, 256 KiB each                           |
| `shaderOverrides`  | 8 files, 256 KiB each                            |
| Texture overrides  | 128 (total across static + provider bundles)     |
| Asset providers    | 32                                               |

Manifest id: same charset as patch id, not `__proto__` / `prototype` / `constructor`; must not start with `__sandkit`.

## 0.5.5 manifest additions

| Field             | Role                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `gameVersion`     | Optional `{ minimum?, maximum? }` semver-like strings. Loader skips the mod when the running game is out of range. |
| `shaderOverrides` | Maps shader ids to relative `.glsl` paths under the mod folder.                                                    |

A manifest must still declare at least one of: `entry`, `workerEntry`, `configOverrides`, `shaderOverrides`, `textureOverrides`, `provides`, or `map`.

Sandkit signatures: https://sandustry.com/sandkit.html

## Discovery tags

Each external mod record carries `workshop.discoveredVia`:

| Tag          | Meaning                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `local`      | App-data mods folder (developer / side-loaded)                                                                                   |
| `subscribed` | Steam subscribed workshop item                                                                                                   |
| `root-scan`  | Numeric folder under the Steam workshop content root. Subscribed items often have only this tag. Depot-shipped mods also use it. |

Inspector labels:

- `local` -> **Local**
- `subscribed` -> **Workshop**
- `root-scan` with `workshop.itemId` -> **Workshop** (e.g. Laser Overcharge)
- `root-scan` only, no item id -> **Core mod**

Elements from shipped mod content (not owned by a loaded external mod id) are also labeled **Core mod** in the Elements tab.
Built-in enum types stay **Core**.
