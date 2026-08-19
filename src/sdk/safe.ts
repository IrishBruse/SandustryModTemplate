import type { SandkitApi } from "types/api";

export function safe<T>(fn: () => T, fallback: T | null = null): T | null {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function isEnabled(api: SandkitApi): boolean {
  const value = safe(() => api.settings.get("enabled"));
  return typeof value === "boolean" ? value : true;
}

/** Hide on menu scenes; show everywhere else (Workshop overlay pattern). */
export function inGame(): boolean {
  const active = safe(() => sandkit.api.scene.getActive());
  if (active === undefined || active === null) return true;

  const Scene = safe(() => sandkit.enums.Scene as Record<string, number>) ?? {};
  const menuScenes = [Scene.MainMenu, Scene.Intro].filter(
    (value): value is number => typeof value === "number",
  );
  if (menuScenes.length > 0) return !menuScenes.includes(active);
  return active !== 1 && active !== 2;
}
