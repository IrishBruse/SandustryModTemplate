/**
 * In-place keyboard TUI for CLI scripts (TTY only). Does not clear the screen.
 */
import readline from "node:readline";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const HIDE = "\x1b[?25l";
const SHOW = "\x1b[?25h";

export function isCliTty() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/** @deprecated Use {@link isCliTty}. */
export const isPublishTty = isCliTty;

/**
 * @param {string} text
 */
function lineCount(text) {
  return text.split("\n").length;
}

/**
 * @template T
 * @param {object} opts
 * @param {string} opts.title
 * @param {{ label: string, hint?: string, disabled?: boolean, value: T }[]} opts.items
 * @returns {Promise<T>}
 */
export function tuiSelect(opts) {
  const enabled = opts.items
    .map((item, index) => ({ item, index }))
    .filter((row) => !row.item.disabled);
  if (enabled.length === 0) {
    return Promise.reject(new Error("No selectable items."));
  }

  return new Promise((resolve, reject) => {
    let cursor = enabled[0].index;
    let drawn = 0;

    readline.emitKeypressEvents(process.stdin);
    const wasRaw = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdout.write(HIDE);

    function cleanup() {
      process.stdin.setRawMode(wasRaw ?? false);
      process.stdin.removeListener("keypress", onKey);
      process.stdout.write(SHOW);
    }

    function render() {
      const rows = [`${BOLD}${opts.title}${RESET}`];
      for (let i = 0; i < opts.items.length; i++) {
        const item = opts.items[i];
        const active = i === cursor && !item.disabled;
        const mark = active ? `${CYAN}${BOLD}❯${RESET}` : " ";
        const name = item.disabled
          ? `${DIM}${item.label}${RESET}`
          : active
            ? `${CYAN}${BOLD}${item.label}${RESET}`
            : item.label;
        const hint = item.hint ? ` ${DIM}${item.hint}${RESET}` : "";
        rows.push(`  ${mark} ${name}${hint}`);
      }
      rows.push(`${DIM}  ↑↓ move  Enter select  q cancel${RESET}`);
      return rows.join("\n");
    }

    function draw() {
      const text = render();
      if (drawn > 0) process.stdout.write(`\x1b[${drawn}A\x1b[J`);
      process.stdout.write(`${text}\n`);
      drawn = lineCount(text);
    }

    function finish(summary) {
      cleanup();
      process.stdout.write(`\x1b[${drawn}A\x1b[J`);
      if (summary) process.stdout.write(`${summary}\n`);
    }

    function move(delta) {
      const order = enabled.map((row) => row.index);
      const pos = order.indexOf(cursor);
      cursor = order[(pos + delta + order.length) % order.length];
      draw();
    }

    function onKey(_str, key) {
      if (!key) return;
      if (key.ctrl && key.name === "c") {
        finish("");
        reject(Object.assign(new Error("Cancelled."), { cancelled: true, exitCode: 130 }));
        return;
      }
      if (key.name === "escape" || key.name === "q") {
        finish("");
        reject(Object.assign(new Error("Cancelled."), { cancelled: true, exitCode: 0 }));
        return;
      }
      if (key.name === "up" || key.name === "k") {
        move(-1);
        return;
      }
      if (key.name === "down" || key.name === "j") {
        move(1);
        return;
      }
      if (key.name === "return") {
        const chosen = opts.items[cursor];
        if (chosen.disabled) return;
        finish(`  ${CYAN}${BOLD}❯${RESET} ${chosen.label}`);
        resolve(chosen.value);
      }
    }

    process.stdin.on("keypress", onKey);
    draw();
  });
}

/**
 * Filterable multi-select combobox for mod folders.
 * @param {object} opts
 * @param {string} opts.title
 * @param {{ folder: string, hint?: string }[]} opts.mods
 * @returns {Promise<string[] | null>} `null` = all mods; otherwise selected folder names.
 */
export function tuiModCombobox(opts) {
  if (opts.mods.length === 0) {
    return Promise.reject(new Error("No selectable mods."));
  }

  return new Promise((resolve, reject) => {
    /** @type {Set<string>} */
    const selected = new Set();
    let filter = "";
    /** 0 = All mods row; 1+ = index in visibleMods */
    let cursor = 0;
    let drawn = 0;

    readline.emitKeypressEvents(process.stdin);
    const wasRaw = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdout.write(HIDE);

    function cleanup() {
      process.stdin.setRawMode(wasRaw ?? false);
      process.stdin.removeListener("keypress", onKey);
      process.stdout.write(SHOW);
    }

    function visibleMods() {
      const query = filter.trim().toLowerCase();
      if (!query) return opts.mods;
      return opts.mods.filter((mod) => {
        const hay = `${mod.folder} ${mod.hint ?? ""}`.toLowerCase();
        return hay.includes(query);
      });
    }

    function clampCursor() {
      const count = visibleMods().length;
      if (cursor < 0) cursor = 0;
      if (cursor > count) cursor = count;
    }

    function selectedSummary() {
      if (selected.size === 0) return `${DIM}—${RESET}`;
      const names = [...selected].sort((a, b) => a.localeCompare(b));
      return `${GREEN}${names.join(", ")}${RESET}`;
    }

    function render() {
      const rows = [`${BOLD}${opts.title}${RESET}`];
      const allActive = cursor === 0;
      const allMark = allActive ? `${CYAN}${BOLD}❯${RESET}` : " ";
      const allLabel = allActive ? `${CYAN}${BOLD}All mods${RESET}` : "All mods";
      rows.push(`  ${allMark} ${allLabel}`);
      rows.push(`  ${DIM}${"─".repeat(24)}${RESET}`);

      const visible = visibleMods();
      if (visible.length === 0) {
        rows.push(`  ${DIM}(no matches)${RESET}`);
      } else {
        for (let i = 0; i < visible.length; i++) {
          const mod = visible[i];
          const row = i + 1;
          const active = cursor === row;
          const mark = active ? `${CYAN}${BOLD}❯${RESET}` : " ";
          const box = selected.has(mod.folder) ? `${GREEN}[x]${RESET}` : "[ ]";
          const name = active ? `${CYAN}${BOLD}${mod.folder}${RESET}` : mod.folder;
          const hint = mod.hint ? ` ${DIM}${mod.hint}${RESET}` : "";
          rows.push(`  ${mark} ${box} ${name}${hint}`);
        }
      }

      rows.push("");
      rows.push(`  ${DIM}Selected:${RESET} ${selectedSummary()}`);
      const filterText = filter.length > 0 ? filter : `${DIM}(type to filter)${RESET}`;
      rows.push(`  ${DIM}Filter:${RESET} ${filterText}`);
      rows.push(
        `${DIM}  ↑↓ move  Space toggle  Enter confirm  Backspace filter  q cancel${RESET}`,
      );
      return rows.join("\n");
    }

    function draw() {
      clampCursor();
      const text = render();
      if (drawn > 0) process.stdout.write(`\x1b[${drawn}A\x1b[J`);
      process.stdout.write(`${text}\n`);
      drawn = lineCount(text);
    }

    function finish(summary) {
      cleanup();
      process.stdout.write(`\x1b[${drawn}A\x1b[J`);
      if (summary) process.stdout.write(`${summary}\n`);
    }

    function move(delta) {
      const max = visibleMods().length;
      cursor = Math.max(0, Math.min(max, cursor + delta));
      draw();
    }

    function toggleAtCursor() {
      if (cursor === 0) return;
      const mod = visibleMods()[cursor - 1];
      if (!mod) return;
      if (selected.has(mod.folder)) selected.delete(mod.folder);
      else selected.add(mod.folder);
      draw();
    }

    function confirm() {
      if (cursor === 0) {
        finish(`  ${CYAN}${BOLD}❯${RESET} All mods`);
        resolve(null);
        return;
      }
      if (selected.size > 0) {
        const folders = [...selected].sort((a, b) => a.localeCompare(b));
        finish(`  ${CYAN}${BOLD}❯${RESET} ${folders.join(", ")}`);
        resolve(folders);
        return;
      }
      const mod = visibleMods()[cursor - 1];
      if (!mod) return;
      finish(`  ${CYAN}${BOLD}❯${RESET} ${mod.folder}`);
      resolve([mod.folder]);
    }

    function onKey(str, key) {
      if (!key) return;
      if (key.ctrl && key.name === "c") {
        finish("");
        reject(Object.assign(new Error("Cancelled."), { cancelled: true, exitCode: 130 }));
        return;
      }
      if (key.name === "escape") {
        if (filter.length > 0) {
          filter = "";
          draw();
          return;
        }
        finish("");
        reject(Object.assign(new Error("Cancelled."), { cancelled: true, exitCode: 0 }));
        return;
      }
      if (key.name === "q") {
        finish("");
        reject(Object.assign(new Error("Cancelled."), { cancelled: true, exitCode: 0 }));
        return;
      }
      if (key.name === "up" || key.name === "k") {
        move(-1);
        return;
      }
      if (key.name === "down" || key.name === "j") {
        move(1);
        return;
      }
      if (key.name === "space") {
        toggleAtCursor();
        return;
      }
      if (key.name === "return") {
        confirm();
        return;
      }
      if (key.name === "backspace") {
        filter = filter.slice(0, -1);
        draw();
        return;
      }
      if (str && !key.ctrl && !key.meta && str.length === 1 && str >= " ") {
        filter += str;
        cursor = cursor === 0 ? 1 : cursor;
        draw();
      }
    }

    process.stdin.on("keypress", onKey);
    draw();
  });
}

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {[string, string][]} opts.fields
 * @param {{ label: string; body: string } | undefined} [opts.preview]
 * @returns {Promise<boolean>}
 */
export async function tuiConfirm(opts) {
  const labelWidth = Math.max(0, ...opts.fields.map(([label]) => label.length));
  console.log(`\n${BOLD}${opts.title}${RESET}`);
  for (const [label, value] of opts.fields) {
    console.log(`  ${DIM}${label.padEnd(labelWidth)}${RESET}  ${value}`);
  }
  if (opts.preview) {
    console.log(`\n  ${DIM}${opts.preview.label}${RESET}`);
    for (const line of opts.preview.body.replaceAll("\r\n", "\n").split("\n")) {
      console.log(`  ${line}`);
    }
  }
  console.log("");
  return tuiSelect({
    title: "Confirm",
    items: [
      { label: "Upload", value: true },
      { label: "Cancel", value: false },
    ],
  });
}
