/**
 * Framework types — manifest, patches, and other kit contracts.
 * Sandkit game API types live in `types/api/`.
 */

export type * from "./manifest";
export type * from "./patch";

export type { ModManifest, ConfigSchema } from "./manifest";
export type { Patch, PatchOperation } from "./patch";
