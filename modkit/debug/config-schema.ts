import type { ConfigSchema } from "../modinfo";

/**
 * Dev-only mod settings. The build merges these into `modinfo.json` for
 * debug builds and omits them from release.
 */
export const modkitDebugConfigSchema = {
  debug: {
    type: "boolean",
    default: true,
    labelKey: "Debug",
    descriptionKey:
      "DevTools, splash skip, main-menu auto-boot, and F3 engine Debug window. Dev builds only.",
  },
} as const satisfies ConfigSchema;

/** Config keys stripped from release `modinfo.json`. */
export const debugOnlyConfigKeys: readonly string[] = Object.keys(modkitDebugConfigSchema);
