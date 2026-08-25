# Host mod loader

`sandustry/workshop-mods.js` (game process). Template docs: `docs/patches.md`, `docs/modkit/config-schema.md`.

## Constants (0.5.2 extract)

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
| Texture overrides  | 128                                              |
| Asset providers    | 32                                               |

Manifest id: same charset as patch id, not `__proto__` / `prototype` / `constructor`; must not start with `__sandkit`.

Publisher (`local-mod-publisher.js`): `workshop.json` schema 1, max 16 KiB, preview `preview.png`. IPC `local-mods-upload`.
