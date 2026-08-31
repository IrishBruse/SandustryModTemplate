/**
 * F5 uses VS Code Quick Pick (`--mod`). Last CLI pick: `.tmp/f5-debug-mod.json`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "../lib/cli-style.js";
import { loadMods, parseModFilters } from "../lib/mods.js";
import { isCliTty, tuiSelect } from "../lib/tui.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const F5_MOD_SELECTION_FILE = join(ROOT, ".tmp/f5-debug-mod.json");

/**
 * @typedef {{ folder: string; gameId: string; dir: string }} DebugModChoice
 */

/** @returns {DebugModChoice | null} */
export function readLastDebugMod() {
  try {
    const data = JSON.parse(readFileSync(F5_MOD_SELECTION_FILE, "utf8"));
    if (typeof data?.folder === "string" && typeof data?.gameId === "string") {
      return {
        folder: data.folder,
        gameId: data.gameId,
        dir: typeof data.dir === "string" ? data.dir : "",
      };
    }
  } catch {
    /* missing */
  }
  return null;
}

/** @param {DebugModChoice} choice */
export function writeLastDebugMod(choice) {
  mkdirSync(dirname(F5_MOD_SELECTION_FILE), { recursive: true });
  writeFileSync(F5_MOD_SELECTION_FILE, `${JSON.stringify(choice, null, 2)}\n`);
}

function choiceFromMod(mod) {
  return { folder: mod.folder, gameId: mod.gameId, dir: mod.dir };
}

/**
 * @param {string[]} argv
 * @returns {Promise<DebugModChoice>}
 */
export async function pickDebugMod(argv = process.argv.slice(2)) {
  const filters = parseModFilters(argv);
  const mods = await loadMods(argv);
  if (mods.length === 0) throw new Error("No mods found.");

  if (filters.length > 1) {
    throw new Error("F5 debug picks one mod. Pass a single --mod <folder>.");
  }
  if (filters.length === 1) {
    const chosen = mods[0];
    const choice = choiceFromMod(chosen);
    writeLastDebugMod(choice);
    console.log(styleText("dim", `Debug ${chosen.gameId} (${chosen.folder})`));
    return choice;
  }

  if (mods.length === 1) {
    const chosen = mods[0];
    const choice = choiceFromMod(chosen);
    writeLastDebugMod(choice);
    console.log(styleText("dim", `Debug ${chosen.gameId} (${chosen.folder})`));
    return choice;
  }

  const last = readLastDebugMod();
  const lastMod = last && mods.find((mod) => mod.folder === last.folder);

  if (!isCliTty()) {
    if (lastMod) {
      const choice = choiceFromMod(lastMod);
      console.log(styleText("dim", `Debug ${choice.gameId} (last F5 pick)`));
      return choice;
    }
    throw new Error("F5 mod picker needs a TTY, or pass --mod <folder>.");
  }

  try {
    const folder = await tuiSelect({
      title: "Debug which mod?",
      initialValue: lastMod?.folder,
      items: mods
        .slice()
        .sort((a, b) => a.folder.localeCompare(b.folder))
        .map((mod) => ({
          label: `${mod.manifest.name}  ${mod.gameId}`,
          hint: mod.repoPath,
          value: mod.folder,
        })),
    });
    const chosen = mods.find((mod) => mod.folder === folder);
    if (!chosen) throw new Error(`Unknown mod folder ${folder}`);
    const choice = choiceFromMod(chosen);
    writeLastDebugMod(choice);
    return choice;
  } catch (error) {
    if (error && typeof error === "object" && "cancelled" in error && error.cancelled) {
      console.log("Cancelled.");
      process.exit("exitCode" in error && typeof error.exitCode === "number" ? error.exitCode : 0);
    }
    throw error;
  }
}
