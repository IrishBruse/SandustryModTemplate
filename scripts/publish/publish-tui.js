/**
 * In-place arrow-key list for `npm run publish` (TTY only). Does not clear the screen.
 */
import readline from "node:readline";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const HIDE = "\x1b[?25l";
const SHOW = "\x1b[?25h";

export function isPublishTty() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

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
