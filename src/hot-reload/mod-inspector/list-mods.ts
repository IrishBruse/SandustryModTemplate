/** UI scale for Dev Tools panel sizing. */
export function readUiScale(): number {
  try {
    const settings = (
      sandkit.engine?.state as { session?: { settings?: { uiScale?: number } } } | undefined
    )?.session?.settings;
    const scale = settings?.uiScale;
    return typeof scale === "number" && scale > 0 ? scale : 1;
  } catch {
    return 1;
  }
}
