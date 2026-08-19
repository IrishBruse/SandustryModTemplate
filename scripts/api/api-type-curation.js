/**
 * Curated Sandkit API types written into types/api/source/api-docs.json.
 * Applied after merge on each generate-types run.
 */

/** @typedef {{ label?: string; description?: string; type?: string }} ParamPatch */
/** @typedef {{ returnType?: string; params?: Record<number, ParamPatch> }} MemberCuration */

/** @type {Record<string, MemberCuration>} */
export const MEMBER_CURATION = {
  "action.getActive": { returnType: "string" },
  "action.getSelected": { returnType: "string" },
  "assets.getSelectedProvider": { returnType: "string | null" },
  "assets.getUrl": { returnType: "string" },
  "authorization.getPlayerZoneId": { returnType: "string" },
  "authorization.getZoneIdAtCell": { returnType: "string" },
  "building.cancelPlacement": { returnType: "void" },
  "building.getSnappedPositionAtCell": { returnType: "{ x: number; y: number }" },
  "collector.getValueByType": { returnType: "number" },
  "collector.getValueFromCellId": { returnType: "number" },
  "cooldown.check": { params: { 0: { label: "cooldownId", type: "string" } } },
  "cooldown.isReady": { params: { 0: { label: "cooldownId", type: "string" } } },
  "elements.addInteractionInfo": { params: { 1: { label: "interaction", type: "Record<string, unknown>" } } },
  "elements.findFreeCellInStructure": { returnType: "{ x: number; y: number } | null" },
  "elements.getDataFieldAtCell": { returnType: "number" },
  "elements.getDefinitionByType": { returnType: "Record<string, unknown> | undefined" },
  "elements.getInfoAtCell": { returnType: "Record<string, unknown> | undefined" },
  "elements.getMatterTypeAtCell": { returnType: "string" },
  "elements.getNameByType": { returnType: "string" },
  "elements.getRegisteredTypes": { returnType: "string[]" },
  "elements.getResolvedTypeAtCell": { returnType: "string" },
  "elements.getResolvedTypeFromCellId": { returnType: "string" },
  "elements.getTypeAtCell": { returnType: "string" },
  "elements.getTypeFromId": { returnType: "string" },
  "elements.getVelocityAtCell": { returnType: "{ x: number; y: number }" },
  "elements.setDataFieldAtCellWhenIdle": { params: { 3: { label: "value", type: "number" } } },
  "elements.setPhysicsAtCellWhenIdle": { params: { 2: { label: "physicsState", type: "Record<string, unknown>" } } },
  "energy.getNetworkAtCell": { returnType: "Record<string, unknown> | undefined" },
  "energy.getNetworkFreeCapacityAtCell": { returnType: "number" },
  "events.emit": {
    params: {
      0: { label: "eventName", type: "string" },
      1: { label: "payload", type: "unknown" },
    },
  },
  "events.on": {
    params: {
      0: { label: "eventName", type: "string" },
      1: { label: "handler", type: "(...args: unknown[]) => unknown" },
    },
  },
  "gameConfig.get": { returnType: "unknown" },
  "gameConfig.getAll": { returnType: "Record<string, unknown>" },
  "hooks.intercept": {
    params: {
      0: { label: "hookId", type: "string" },
      1: { label: "handler", type: "(...args: unknown[]) => unknown" },
      2: { label: "priority", type: "number" },
    },
  },
  "hooks.modify": {
    params: {
      0: { label: "hookId", type: "string" },
      1: { label: "handler", type: "(...args: unknown[]) => unknown" },
      2: { label: "priority", type: "number" },
    },
  },
  "i18n.formatNumber": { params: { 0: { label: "value", type: "number" } } },
  "i18n.getAvailableLocales": { returnType: "string[]" },
  "i18n.getDescription": { returnType: "string" },
  "i18n.getGlobal": { returnType: "string" },
  "i18n.getGlobals": { returnType: "Record<string, string>" },
  "i18n.getLanguages": { returnType: "string[]" },
  "i18n.getLocale": { returnType: "string" },
  "i18n.getName": { returnType: "string" },
  "i18n.t": { params: { 1: { label: "params", type: "Record<string, unknown>" } } },
  "i18n.translatable": { returnType: "{ __translatable: true; key: string; fallback: string }" },
  "input.getBoundKeys": { returnType: "string[]" },
  "input.getDisplayKey": { returnType: "string" },
  "input.getMouseCellPosition": { returnType: "{ x: number; y: number }" },
  "items.getActive": { returnType: "string | null" },
  "items.getDefinitionById": { returnType: "Record<string, unknown> | undefined" },
  "maps.getActive": { returnType: "string | null" },
  "maps.getAvailable": { returnType: "string[]" },
  "mods.getProviders": { returnType: "string[]" },
  "patterns.createCircle": { returnType: "{ x: number; y: number }[]" },
  "player.getWorldPosition": { returnType: "{ x: number; y: number }" },
  "progression.complete": { params: { 0: { label: "request", type: "Record<string, unknown>" } } },
  "projectiles.getAll": { returnType: "Record<string, unknown>[]" },
  "projectiles.getById": { returnType: "Record<string, unknown> | undefined" },
  "projectiles.getDefinitionById": { returnType: "Record<string, unknown> | undefined" },
  "projectiles.remove": { params: { 0: { label: "projectile", type: "Record<string, unknown>" } } },
  "rendering.getDrawPositionAtCell": { returnType: "{ x: number; y: number }" },
  "rendering.getGridMetrics": { returnType: "Record<string, number>" },
  "rendering.getOverlayViewportSize": { returnType: "{ width: number; height: number }" },
  "rendering.withOverlayContext": {
    params: { 0: { label: "draw", type: "(ctx: CanvasRenderingContext2D) => void" } },
  },
  "scene.getActive": { returnType: "string" },
  "settings.get": { returnType: "string | number | boolean | undefined" },
  "settings.getAll": { returnType: "Record<string, string | number | boolean>" },
  "shared.buffers.get": { returnType: "SharedArrayBuffer | undefined" },
  "signals.targets.register": { params: { 1: { label: "apply", type: "(...args: unknown[]) => unknown" } } },
  "sound.calculateDistanceOptionsAtWorld": { params: { 2: { label: "baseVolume", type: "number" } } },
  "sound.playLayers": { params: { 0: { label: "layers", type: "Record<string, unknown>[]" } } },
  "sprites.getById": { returnType: "Record<string, unknown> | undefined" },
  "storage.get": { returnType: "unknown" },
  "storage.set": { params: { 2: { label: "value", type: "unknown" } } },
  "storage.local.get": { returnType: "unknown" },
  "storage.local.set": { params: { 1: { label: "value", type: "unknown" } } },
  "structures.addVariant": { params: { 1: { label: "variant", type: "Record<string, unknown>" } } },
  "structures.getAtCell": { returnType: "Record<string, unknown> | undefined" },
  "structures.getDefinitionByType": { returnType: "Record<string, unknown> | undefined" },
  "structures.getTypeFromId": { returnType: "string" },
  "structures.getUnlockedTypes": { returnType: "string[]" },
  "structures.isType": { params: { 0: { label: "structure", type: "Record<string, unknown>" } } },
  "structures.mapValueToSpritesheetIndex": {
    params: {
      0: { label: "value", type: "number" },
      1: { label: "thresholds", type: "number[]" },
    },
  },
  "structures.removeAtCellsWhenIdle": { params: { 0: { label: "positions", type: "{ x: number; y: number }[]" } } },
  "structures.setData": { params: { 0: { label: "structure", type: "Record<string, unknown>" } } },
  "structures.setSpritesheetIndex": { params: { 0: { label: "structure", type: "Record<string, unknown>" } } },
  "structures.setSpritesheetIndexByValue": {
    params: {
      0: { label: "structure", type: "Record<string, unknown>" },
      1: { label: "value", type: "number" },
      2: { label: "thresholds", type: "number[]" },
    },
  },
  "structures.setSpritesheetIndexByValueAtCell": {
    params: {
      2: { label: "value", type: "number" },
      3: { label: "thresholds", type: "number[]" },
    },
  },
  "structures.update": { params: { 0: { label: "structure", type: "Record<string, unknown>" } } },
  "tech.getDefinitionById": { returnType: "Record<string, unknown> | undefined" },
  "tech.updateDefinition": { params: { 1: { label: "updates", type: "Record<string, unknown>" } } },
  "terrains.getDataAtCell": { returnType: "Record<string, unknown>" },
  "terrains.getTypeAtCell": { returnType: "string" },
  "terrains.getTypeFromId": { returnType: "string" },
  "time.getTick": { returnType: "number" },
  "time.getTimeMs": { returnType: "number" },
  "tools.grabber.getSize": { returnType: "number" },
  "ui.navigation.useFocusable": { params: { 0: { label: "options", type: "Record<string, unknown>" } } },
  "ui.prompt": { params: { 2: { label: "placeholder", type: "string" } } },
  "upgrades.getAvailableLevelById": { returnType: "number" },
  "upgrades.getLevelById": { returnType: "number" },
  "utils.getAngle": {
    returnType: "number",
    params: {
      0: { label: "pointA", type: "{ x: number; y: number }" },
      1: { label: "pointB", type: "{ x: number; y: number }" },
    },
  },
  "utils.getCoordinatesBetweenPoints": {
    returnType: "{ x: number; y: number }[]",
    params: {
      0: { label: "pointA", type: "{ x: number; y: number }" },
      1: { label: "pointB", type: "{ x: number; y: number }" },
    },
  },
  "utils.getDirection": {
    returnType: "{ x: number; y: number }",
    params: {
      0: { label: "pointA", type: "{ x: number; y: number }" },
      1: { label: "pointB", type: "{ x: number; y: number }" },
    },
  },
  "utils.getDistance": { returnType: "number" },
  "world.getCellIdAtCell": { returnType: "number" },
  "world.pickups.destroy": { params: { 0: { label: "worldItem", type: "Record<string, unknown>" } } },
  "world.pickups.getAll": { returnType: "Record<string, unknown>[]" },
  "world.pickups.getById": { returnType: "Record<string, unknown> | undefined" },
  "world.pickups.pickUp": { params: { 0: { label: "worldItem", type: "Record<string, unknown>" } } },
  "world.pickups.spawnAtWorld": { params: { 4: { label: "light", type: "Record<string, unknown> | undefined" } } },
  "world.redrawAroundCellWhenIdle": { params: { 2: { label: "range", type: "number" } } },
};

/** @param {string} description */
function returnTypeFromDescription(description) {
  const desc = description.trim();
  if (!desc) return null;

  const objectMatch = desc.match(/^Return (\{[^.]+\})\.?$/i);
  if (objectMatch) return objectMatch[1];

  const typedMatch = desc.match(/^Return ([A-Za-z0-9_|<>[\].\s]+)\.?$/i);
  if (typedMatch) {
    const raw = typedMatch[1].trim();
    if (/^ConfigValueV1 \| undefined$/i.test(raw)) return "string | number | boolean | undefined";
    if (/^SharedArray \| undefined$/i.test(raw)) return "SharedArrayBuffer | undefined";
    if (/^JsonValueV1 \| undefined$/i.test(raw)) return "unknown";
    if (/^SoundOptions\.?$/i.test(raw)) return "Record<string, unknown>";
    if (/^string$/i.test(raw)) return "string";
    if (/^number$/i.test(raw)) return "number";
    if (/^boolean$/i.test(raw)) return "boolean";
    if (/^any$/i.test(raw)) return "unknown";
    if (/^all$/i.test(raw)) return "unknown[]";
  }

  const wordMatch = desc.match(/^Return ([a-z][a-z ]+)\.?$/i);
  if (wordMatch) {
    const phrase = wordMatch[1].toLowerCase();
    /** @type {Record<string, string>} */
    const map = {
      active: "string",
      selected: "string",
      url: "string",
      locale: "string",
      name: "string",
      description: "string",
      global: "string",
      tick: "number",
      "time ms": "number",
      size: "number",
      angle: "number",
      distance: "number",
      all: "unknown[]",
      any: "unknown",
    };
    if (map[phrase]) return map[phrase];
  }

  return null;
}

/**
 * @param {Record<string, unknown>} docs
 * @param {typeof MEMBER_CURATION} [curation]
 */
export function applyTypeCuration(docs, curation = MEMBER_CURATION) {
  /** @param {Record<string, unknown>} members @param {string[]} path */
  function walkMembers(members, path) {
    if (!members || typeof members !== "object") return;

    for (const [key, value] of Object.entries(members)) {
      const entry = /** @type {Record<string, unknown>} */ (value);
      const memberPath = [...path, key];
      const pathKey = memberPath.join(".");

      if (entry.members && typeof entry.members === "object") {
        walkMembers(/** @type {Record<string, unknown>} */ (entry.members), memberPath);
        continue;
      }

      if (!Array.isArray(entry.params)) continue;

      const curated = curation[pathKey];
      const description =
        typeof entry.description === "string" ? returnTypeFromDescription(entry.description) : null;

      if (curated?.returnType) entry.returnType = curated.returnType;
      else if (description) entry.returnType = description;

      for (let i = 0; i < entry.params.length; i++) {
        const param = /** @type {Record<string, unknown>} */ (entry.params[i]);
        const patch = curated?.params?.[i];
        if (!patch) continue;
        if (patch.label) param.label = patch.label;
        if (patch.description) param.description = patch.description;
        if (patch.type) param.type = patch.type;
      }
    }
  }

  const namespaces = docs.namespaces;
  if (!namespaces || typeof namespaces !== "object") return docs;

  for (const [nsKey, nsValue] of Object.entries(namespaces)) {
    const ns = /** @type {Record<string, unknown>} */ (nsValue);
    if (ns.members && typeof ns.members === "object") {
      walkMembers(/** @type {Record<string, unknown>} */ (ns.members), [nsKey]);
    }
  }

  return docs;
}
