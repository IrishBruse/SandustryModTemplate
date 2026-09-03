# Blueprints (structures)

Public structure blueprint helpers for copy/paste and localization.
Official HTML: `api.blueprints`.

## `sandkit.api.blueprints` (public, 0.5.5)

| Method                            | Role                                              |
| --------------------------------- | ------------------------------------------------- |
| `serializeStructures(structures)` | Structure array -> portable blueprint payload     |
| `localizeStructures(structures)`  | Blueprint payload -> localized display structures |

Both are read-only on existing `store.structures` entries.
Do not use them to place or remove structures.

## Live shape (probe)

Input: two `store.structures` items. `serializeStructures` returns an array, each item has keys `type`, `x`, `y` (and more when present on source).

`localizeStructures(serialized)` returns an array with the same top-level keys on the first item.

Internal twin: `engine.api.blueprints` - prefer public `api.blueprints` for mods.

## Related

- Player clipboard / coloring: **sandustry-player** `references/building.md`.
- Structure instance fields: `structures.md`.
