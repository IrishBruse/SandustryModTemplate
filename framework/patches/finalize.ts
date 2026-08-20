import type { Patch } from "types/framework/patch";

/** Patch body without id — id comes from the filename at build time. */
export type PatchBody = Omit<Patch, "id"> & { id?: string };

/** Assign patch id from the source filename (e.g. `skip-startup-splash.js` → `skip-startup-splash`). */
export function finalizePatch(filename: string, patch: PatchBody): Patch {
  const id = filename.replace(/\.js$/, "");
  if (patch.id !== undefined && patch.id !== id) {
    throw new Error(`Patch id "${patch.id}" must match filename "${id}"`);
  }
  const { id: _ignored, ...rest } = patch;
  return { id, ...rest } as Patch;
}
