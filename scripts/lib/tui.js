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
 * Filterable multi-select combobox for mod folders, grouped under section headers.
 * @param {object} opts
 * @param {string} opts.title
 * @param {{ label: string, mods: { folder: string, hint?: string }[] }[]} opts.groups
 * @param {string[]} [opts.initialSelected] Pre-checked mod folders.
 * @param {"all" | string} [opts.initialFocus] Highlight **All mods** or a folder row.
 * @returns {Promise<string[] | null>} `null` = all mods; otherwise selected folder names.
 */
export function tuiModCombobox(opts) {
  const allMods = opts.groups.flatMap((group) => group.mods);
  if (allMods.length === 0) {
    return Promise.reject(new Error("No selectable mods."));
  }

  return new Promise((resolve, reject) => {
    /** @type {Set<string>} */
    const selected = new Set();
    for (const folder of opts.initialSelected ?? []) {
      if (allMods.some((mod) => mod.folder === folder)) selected.add(folder);
    }
    let filter = "";
    /** Index into {@link buildLayout} for the highlighted row. */
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

    function buildLayout() {
      /** @type {({ kind: "all" } | { kind: "header", label: string } | { kind: "mod", mod: { folder: string, hint?: string } })[]} */
      const layout = [{ kind: "all" }];
      const query = filter.trim().toLowerCase();

      for (const group of opts.groups) {
        const mods = group.mods.filter((mod) => {
          if (!query) return true;
          const hay = `${mod.folder} ${mod.hint ?? ""} ${group.label}`.toLowerCase();
          return hay.includes(query);
        });
        if (mods.length === 0) continue;
        layout.push({ kind: "header", label: group.label });
        for (const mod of mods) layout.push({ kind: "mod", mod });
      }

      return layout;
    }

    function selectableIndices(layout) {
      return layout.flatMap((row, index) =>
        row.kind === "all" || row.kind === "mod" ? [index] : [],
      );
    }

    function clampCursor() {
      const layout = buildLayout();
      const selectable = selectableIndices(layout);
      if (selectable.length === 0) {
        cursor = 0;
        return;
      }
      if (!selectable.includes(cursor)) {
        cursor = selectable[0];
      }
    }

    function selectedSummary() {
      if (selected.size === 0) return `${DIM}—${RESET}`;
      const names = [...selected].sort((a, b) => a.localeCompare(b));
      return `${GREEN}${names.join(", ")}${RESET}`;
    }

    function render() {
      const layout = buildLayout();
      const rows = [`${BOLD}${opts.title}${RESET}`];

      for (let i = 0; i < layout.length; i++) {
        const row = layout[i];
        if (row.kind === "all") {
          const active = cursor === i;
          const mark = active ? `${CYAN}${BOLD}❯${RESET}` : " ";
          const label = active ? `${CYAN}${BOLD}All mods${RESET}` : "All mods";
          rows.push(`  ${mark} ${label}`);
          rows.push(`  ${DIM}${"─".repeat(24)}${RESET}`);
          continue;
        }
        if (row.kind === "header") {
          rows.push(`  ${DIM}${row.label}${RESET}`);
          continue;
        }
        const active = cursor === i;
        const mark = active ? `${CYAN}${BOLD}❯${RESET}` : " ";
        const box = selected.has(row.mod.folder) ? `${GREEN}[x]${RESET}` : "[ ]";
        const name = active ? `${CYAN}${BOLD}${row.mod.folder}${RESET}` : row.mod.folder;
        const hint = row.mod.hint ? ` ${DIM}${row.mod.hint}${RESET}` : "";
        rows.push(`  ${mark} ${box} ${name}${hint}`);
      }

      if (layout.length === 1) {
        rows.push(`  ${DIM}(no matches)${RESET}`);
      }

      rows.push("");
      rows.push(`  ${DIM}Selected:${RESET} ${selectedSummary()}`);
      const filterText = filter.length > 0 ? filter : `${DIM}(type to filter)${RESET}`;
      rows.push(`  ${DIM}Filter:${RESET} ${filterText}`);
      rows.push(`${DIM}  ↑↓ move  Space toggle  Enter confirm  Backspace filter  q cancel${RESET}`);
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
      const layout = buildLayout();
      const selectable = selectableIndices(layout);
      if (selectable.length === 0) return;
      const pos = selectable.indexOf(cursor);
      const next = pos < 0 ? 0 : (pos + delta + selectable.length) % selectable.length;
      cursor = selectable[next];
      draw();
    }

    function rowAtCursor() {
      return buildLayout()[cursor];
    }

    function toggleAtCursor() {
      const row = rowAtCursor();
      if (!row || row.kind !== "mod") return;
      if (selected.has(row.mod.folder)) selected.delete(row.mod.folder);
      else selected.add(row.mod.folder);
      draw();
    }

    function confirm() {
      const row = rowAtCursor();
      if (row?.kind === "all") {
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
      if (row?.kind === "mod") {
        finish(`  ${CYAN}${BOLD}❯${RESET} ${row.mod.folder}`);
        resolve([row.mod.folder]);
      }
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
        const layout = buildLayout();
        const selectable = selectableIndices(layout);
        if (selectable.length > 0 && !selectable.includes(cursor)) {
          cursor = selectable[0];
        }
        draw();
      }
    }

    function initCursor() {
      if (opts.initialFocus === "all") {
        cursor = 0;
        return;
      }
      const focus = opts.initialFocus ?? opts.initialSelected?.[0];
      if (typeof focus !== "string") return;
      const layout = buildLayout();
      const index = layout.findIndex((row) => row.kind === "mod" && row.mod.folder === focus);
      if (index >= 0) cursor = index;
    }

    process.stdin.on("keypress", onKey);
    initCursor();
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
