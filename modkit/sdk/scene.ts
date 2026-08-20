import { sandkit } from "../sandkit";
import { safe } from "./safe";

/** Hide on menu scenes; show everywhere else. */
export function inGame(): boolean {
  const active = safe(() => sandkit.api.scene.getActive());
  if (typeof active !== "number") return true;

  const Scene = safe<typeof sandkit.enums.Scene>(() => sandkit.enums.Scene);
  if (Scene) return active !== Scene.MainMenu && active !== Scene.Intro;
  return active !== 1 && active !== 2;
}
