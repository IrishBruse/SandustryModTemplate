/**
 * Interactive mod picker for `npm run dev` when stdin is a TTY and no `--mod` is passed.
 */
import { styleText } from "../lib/cli-style.js";
import { DEBUG_MOD_FOLDER, discoverMods, parseModFilters } from "../lib/mods.js";
import { isCliTty, tuiModCombobox } from "../lib/tui.js";

/**
 * @param {string[]} argv
 * @returns {Promise<string[]>} Extra args to pass to esbuild (`[]` = all mods).
 */
export async function pickDevModArgs(argv) {
  if (parseModFilters(argv).length > 0) return [];

  if (!isCliTty()) return [];

  const mods = discoverMods().filter((mod) => mod.folder !== DEBUG_MOD_FOLDER);
  if (mods.length === 0) {
    throw new Error("No mods found. Add src/<name>/mod.ts or examples/<name>/mod.ts");
  }
  if (mods.length === 1) {
    console.log(styleText("dim", `Watching ${mods[0].folder}`));
    return ["--mod", mods[0].folder];
  }

  try {
    const picked = await tuiModCombobox({
      title: "Watch which mods?",
      mods: mods.map((mod) => ({
        folder: mod.folder,
        hint: mod.repoPath,
      })),
    });
    if (picked == null) return [];
    return picked.flatMap((folder) => ["--mod", folder]);
  } catch (error) {
    if (error && typeof error === "object" && "cancelled" in error && error.cancelled) {
      console.log("Cancelled.");
      process.exit("exitCode" in error && typeof error.exitCode === "number" ? error.exitCode : 0);
    }
    throw error;
  }
}
