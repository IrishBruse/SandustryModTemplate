import { safe } from "./safe";

/** Hide on menu scenes; show everywhere else. */
export function inGame(): boolean {
  const active = safe(() => sandkit.api.scene.getActive());
  if (typeof active !== "number") return true;

  const Scene = safe(() => sandkit.enums.Scene as Record<string, number>) ?? {};
  const menuScenes = [Scene.MainMenu, Scene.Intro].filter(
    (value): value is number => typeof value === "number",
  );
  if (menuScenes.length > 0) return !menuScenes.includes(active);
  return active !== 1 && active !== 2;
}
