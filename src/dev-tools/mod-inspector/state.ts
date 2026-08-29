/** Open state for pause-menu Dev Tools panel (not vanilla `modsScreen`). */

let open = false;
const listeners = new Set<(next: boolean) => void>();

function closeVanillaModsScreen(): void {
  const state = sandkit.engine.state as
    | { session?: { windows?: { modsScreen?: { open?: boolean } } } }
    | undefined;
  const win = state?.session?.windows?.modsScreen;
  if (!win?.open) return;
  win.open = false;
  sandkit.api.ui.update(sandkit.enums.ComponentId.ModsScreen);
}

export function isModInspectorOpen(): boolean {
  return open;
}

export function setModInspectorOpen(next: boolean): void {
  if (open === next) return;
  open = next;
  if (open) closeVanillaModsScreen();
  for (const fn of listeners) fn(open);
}

export function subscribeModInspector(onChange: (next: boolean) => void): () => void {
  listeners.add(onChange);
  onChange(open);
  return () => {
    listeners.delete(onChange);
  };
}
