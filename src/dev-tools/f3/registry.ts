/** One row in the F3 overlay (`label: value` or plain text). */
export type F3Line = { left: string; right: string } | { text: string };

export type F3Section = {
  id: string;
  /** Optional heading shown above this section's lines. */
  title?: string;
  /** Return lines to show, or `null` to hide the section this frame. */
  lines: () => F3Line[] | null;
};

export type F3Block =
  | { kind: "title"; text: string }
  | { kind: "line"; left: string; right: string }
  | { kind: "text"; text: string }
  | { kind: "blank" };

const sections: F3Section[] = [];

/** Register an F3 section. Returns unregister for cleanup. */
export function registerF3Section(section: F3Section): () => void {
  sections.push(section);
  return () => {
    const index = sections.findIndex((entry) => entry.id === section.id);
    if (index >= 0) sections.splice(index, 1);
  };
}

/** Flatten registered sections into render blocks (skips empty sections). */
export function collectF3Blocks(): F3Block[] {
  const blocks: F3Block[] = [];

  for (const section of sections) {
    let lines: F3Line[] | null;
    try {
      lines = section.lines();
    } catch (error) {
      console.warn(`[F3] section "${section.id}" failed:`, error);
      continue;
    }
    if (!lines || lines.length === 0) continue;

    if (section.title) blocks.push({ kind: "title", text: section.title });

    for (const line of lines) {
      if ("text" in line) blocks.push({ kind: "text", text: line.text });
      else blocks.push({ kind: "line", left: line.left, right: line.right });
    }

    blocks.push({ kind: "blank" });
  }

  if (blocks.length > 0 && blocks[blocks.length - 1]?.kind === "blank") blocks.pop();
  return blocks;
}
