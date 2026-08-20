import type { ConfigSchema } from "../modinfo";

/**
 * Dev-only mod settings for engine debug flags and the F3 debug panel.
 * Spread into `mod.ts` `configSchema`. Release builds omit these keys.
 */
export const modkitDebugConfigSchema = {
  debug: {
    type: "boolean",
    default: true,
    labelKey: "Debug",
    descriptionKey: "DevTools, splash skip, and main-menu auto-boot. Dev builds only.",
  },
  debugMenuButton: {
    type: "boolean",
    default: true,
    labelKey: "Debug menu button",
    descriptionKey:
      "Show the Debug row under Upgrades. F3 always opens the panel even when this is off.",
  },
  debugActive: {
    type: "boolean",
    default: false,
    labelKey: "Debug active",
    descriptionKey:
      "Debug panel, debug brush and debug controls. Restart the game after changing this, in either direction.",
  },
  drawChunks: {
    type: "boolean",
    default: false,
    labelKey: "Draw chunks",
    descriptionKey:
      "Overlay showing chunk boundaries. Restart the game after changing this, in either direction.",
  },
  cellInspector: {
    type: "boolean",
    default: false,
    labelKey: "Cell inspector",
    descriptionKey:
      "Live readout of the cell under the cursor. May need a game restart to take effect.",
  },
  showLights: {
    type: "boolean",
    default: false,
    labelKey: "Show lights",
    descriptionKey:
      "Visualises light sources in the world. May need a game restart to take effect.",
  },
  showAuthorizationZones: {
    type: "boolean",
    default: false,
    labelKey: "Show authorization zones",
    descriptionKey: "Draws where building is permitted. May need a game restart to take effect.",
  },
  showFilters: {
    type: "boolean",
    default: false,
    labelKey: "Show filters",
    descriptionKey: "Filter visualisation. May need a game restart to take effect.",
  },
  doNotDrawStructures: {
    type: "boolean",
    default: false,
    labelKey: "Hide structures",
    descriptionKey:
      "Stops drawing structures so you can see the material underneath. May need a game restart to take effect.",
  },
} as const satisfies ConfigSchema;

/** Config keys stripped from release `modinfo.json`. */
export const debugOnlyConfigKeys: readonly string[] = Object.keys(modkitDebugConfigSchema);
