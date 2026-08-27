# Script templates

Pass `waitForStableDom: false` on every template unless the script opens UI.

## Attach check

```javascript
() => {
  const g = globalThis;
  const sk = typeof sandkit !== "undefined" ? sandkit : g.sandkit;
  const st = sk?.engine?.state ?? sk?.state ?? g.__debug?.state;
  return {
    title: document.title,
    href: location.href,
    hasSandkit: Boolean(sk?.api),
    hasDebug: Boolean(g.__debug),
    scene: st?.store?.scene?.active ?? null,
    loading: Boolean(document.getElementById("loading")),
  };
};
```

## Mod / hot-reload bundle

One call beats separate polls for mods, overlays, and reload state.

```javascript
() => {
  const g = globalThis;
  const sk = typeof sandkit !== "undefined" ? sandkit : g.sandkit;
  const st = sk?.engine?.state ?? sk?.state ?? g.__debug?.state;
  const session = st?.session;
  const overlays = session?.ui?.overlays;
  const overlaySummary = {};
  if (overlays && typeof overlays === "object") {
    for (const slot of Object.keys(overlays)) {
      overlaySummary[slot] = Object.keys(overlays[slot] || {});
    }
  }
  let watch = null;
  try {
    watch = sk?.api?.settings?.get("watchLocalMods");
  } catch (e) {
    watch = String(e);
  }
  const ordered = (session?.externalMods?.orderedMods || []).map((m) => ({
    id: m.manifest?.id,
    via: m.workshop?.discoveredVia,
    rootUrl: m.rootUrl,
  }));
  return {
    scene: st?.store?.scene?.active ?? null,
    watch,
    ordered,
    overlaySummary,
    generations: g.__sandkitHotGenerations__ ?? {},
    disposeCounts: Object.fromEntries(
      Object.entries(g.__sandkitDisposeLists__ || {}).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.length : typeof v,
      ]),
    ),
  };
};
```

## Open window via state

Prefer over click chains when the goal is data, not UI walk coverage.

```javascript
(componentKey, componentId) => {
  const sk = typeof sandkit !== "undefined" ? sandkit : globalThis.sandkit;
  const win = sk.state.session.windows[componentKey];
  win.open = true;
  sk.api.ui.update(componentId);
  return { open: win.open, componentId };
};
```

Example args: `("lexicon", sk.enums.ComponentId.Lexicon)`.

## DOM probe by selector

When snapshot uids are awkward (stacking, z-index):

```javascript
(selector) => {
  const el = document.querySelector(selector);
  if (!el) return { found: false };
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    found: true,
    zIndex: s.zIndex,
    display: s.display,
    text: (el.innerText || "").slice(0, 120),
    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
  };
};
```

Pass element uids via `args` when the MCP tool supports snapshot references.

## Void world (batched)

Full save wipe — structures, terrain, background, map fog, player platform. **User must ask.**

| Topic                                          | File                                                  |
| ---------------------------------------------- | ----------------------------------------------------- |
| Batch sizes, save-as-you-go, all phase scripts | [void-world.md](void-world.md)                        |
| Background buffers and Pixi layers             | **sandustry-world** `references/background-layers.md` |

Quick save helper:

```javascript
() => {
  const st = sandkit.state;
  const id = sandkit.engine.api.game.save(st, "Void", "EXISTING_ID_OR_OMIT");
  return { id };
};
```
