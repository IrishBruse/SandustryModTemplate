/** Known scene ids from Workshop overlay mods (hide-list pattern). */
export type SceneId =
  | 1 // MainMenu
  | 2 // Intro
  | 3 // Deploy
  | 4; // Game

export interface SceneApi {
  /** Active scene id, or undefined before first read. */
  getActive(): SceneId | undefined;
}
