/** Open state for the Mod Inspector overlay (pause menu → Mods). */

let open = false;
const listeners = new Set<(next: boolean) => void>();

export function isModInspectorOpen(): boolean {
  return open;
}

export function setModInspectorOpen(next: boolean): void {
  if (open === next) return;
  open = next;
  for (const fn of listeners) fn(open);
}

export function subscribeModInspector(onChange: (next: boolean) => void): () => void {
  listeners.add(onChange);
  onChange(open);
  return () => {
    listeners.delete(onChange);
  };
}
