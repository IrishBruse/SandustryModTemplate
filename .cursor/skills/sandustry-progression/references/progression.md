# Progression

Public API: `sandkit.api.progression`. Types: `node_modules/@sandustry-modding/types/sandkit/api/progression.d.ts`.

## API

```ts
progression.complete(request: { id: string, ... }): boolean
```

Marks a story or quest step complete. Returns `true` on success. **Write** - do not call during read-only probes.

## Store

```ts
store.progression: {
  upgradesUnlocked: boolean,
  dungeons: { [dungeonId: number]: { done: boolean } }
}
```

- `upgradesUnlocked`: gates the Upgrades management tab.
- `dungeons`: keyed by enum value. New save: `{ 1: { done: false } }` (`Boss1` = 1).

Setting `upgradesUnlocked` or dungeon `done` is done by game systems (boss win, debug cheats). No public getter besides reading `store`.

## Relation to other bags

| Bag                 | Role                          |
| ------------------- | ----------------------------- |
| `store.player.tech` | Tech tree purchases           |
| `store.upgrades`    | Tool and drone upgrade levels |
| `store.objectives`  | Optional HUD objective cards  |
| `store.tutorial`    | Guided early-game steps       |
| `store.viability`   | Factory tier bar              |

`progression.complete` ids are not listed in public types. Confirm in extracted `sandustry/` or live logs before calling.
