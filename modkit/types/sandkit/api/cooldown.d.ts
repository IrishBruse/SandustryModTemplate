export namespace cooldown {
  export function check(cooldown: Cooldown, overrideTime?: number): boolean;
  export function isReady(cooldown: Cooldown, overrideTime?: number): boolean;

  // TODO
  export type Cooldown = unknown
}