# Lexicon

In-game encyclopedia (elements, terrains, tech, items, upgrades, mods).
No public `sandkit.api.lexicon`.
Read `session.lexicon`.

## Session

```ts
session.lexicon: {
  compiled: boolean,
  entries: LexiconEntry[],
  entriesById: { [id: string]: LexiconEntry }
}
session.windows.lexicon: { open: boolean }
```

`LexiconEntry` shape (live):

- `kind`: `"element"` | `"terrain"` | `"tech"` | `"items"` | `"upgrades"` | `"projectiles"` | `"misc"` | ...
- `id`: string key (e.g. `"1"`, `"fluxEmanator"`, `"grabber:scanner"`)
- `name`, `description`: resolved display strings
- `source`: `"core"` | `"mod"`
- `details`: raw backing object

## Compile timing

`compiled` is `false` until the lexicon builder runs (first open or lazy init).
On loaded end-game saves it may already be **`compiled: true`** with a full `entries[]` before you open the window (live probe: thousands of entries, elements/tech/items/upgrades).

Before first compile: `compiled: false`, `entries.length: 0`.

## Relation to discoveries

- `store.discoveries` lists numeric type ids the player has seen.
- Lexicon entries add names, descriptions, and cross-links for UI search.

Discovery popups (`session.ui.discoveryPopups`) are separate short toasts on first sight.

Open via management UI or hotkey, screen map in **sandustry-ui** (Lexicon window in `session.windows`).
