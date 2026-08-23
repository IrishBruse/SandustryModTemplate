/**
 * Interactive mod picker for `npm run dev` when stdin is a TTY and no `--mod` is passed.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "../lib/cli-style.js";
import { DEBUG_MOD_FOLDER, discoverMods, parseModFilters } from "../lib/mods.js";
import { isCliTty, tuiModCombobox } from "../lib/tui.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SELECTION_FILE = join(ROOT, ".tmp/dev-mod-selection.json");

/**
 * @typedef {{ all: true } | { all: false, folders: string[] }} DevModSelection
 */

/**
 * @param {Set<string>} validFolders
 * @returns {DevModSelection | null}
 */
function readLastSelection(validFolders) {
  try {
    const data = JSON.parse(readFileSync(SELECTION_FILE, "utf8"));
    if (data?.all === true) return { all: true };
    if (Array.isArray(data?.folders)) {
      const folders = data.folders.filter((folder) => validFolders.has(folder));
      if (folders.length > 0) return { all: false, folders };
    }
  } catch {
    /* missing or invalid */
  }
  return null;
}

/** @param {string[] | null} picked */
function writeLastSelection(picked) {
  mkdirSync(dirname(SELECTION_FILE), { recursive: true });
  if (picked == null) {
    writeFileSync(SELECTION_FILE, `${JSON.stringify({ all: true }, null, 2)}\n`);
    return;
  }
  writeFileSync(SELECTION_FILE, `${JSON.stringify({ all: false, folders: picked }, null, 2)}\n`);
}

/**
 * @param {string[]} argv
 * @returns {Promise<string[]>} Extra args to pass to esbuild (`[]` = all mods).
 */
export async function pickDevModArgs(argv) {
  if (parseModFilters(argv).length > 0) return [];

  if (!isCliTty()) return [];

  const mods = discoverMods();
  if (mods.length === 0) {
    throw new Error("No mods found. Add src/<name>/mod.ts or examples/<name>/mod.ts");
  }
  if (mods.length === 1) {
    console.log(styleText("dim", `Watching ${mods[0].folder}`));
    return ["--mod", mods[0].folder];
  }

  const validFolders = new Set(mods.map((mod) => mod.folder));
  const last = readLastSelection(validFolders);

  try {
    const byRoot = (root) =>
      mods
        .filter((mod) => mod.root === root)
        .sort((a, b) => a.folder.localeCompare(b.folder))
        .map((mod) => ({
          folder: mod.folder,
          hint: mod.folder === DEBUG_MOD_FOLDER ? `${mod.repoPath} · companion` : mod.repoPath,
        }));

    /** @type {{ label: string, mods: { folder: string, hint?: string }[] }[]} */
    const groups = [];
    const srcMods = byRoot("src");
    const exampleMods = byRoot("examples");
    if (srcMods.length > 0) groups.push({ label: "src", mods: srcMods });
    if (exampleMods.length > 0) groups.push({ label: "Examples", mods: exampleMods });

    const picked = await tuiModCombobox({
      title: "Watch which mods?",
      groups,
      initialSelected: last?.all ? [] : (last?.folders ?? []),
      initialFocus: last?.all ? "all" : last?.folders?.[0],
    });
    writeLastSelection(picked);
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
