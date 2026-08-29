/** Mirror of `sandkit.enums.MatterType` so tests do not load Sandkit. */
export const Matter = {
  Solid: 1,
  Liquid: 2,
  Particle: 3,
  Gas: 4,
  Static: 5,
  Slushy: 6,
  Wisp: 7,
  Powder: 8,
} as const;

export function isLoadableMatter(matterType: number | null): boolean {
  if (matterType == null) return false;
  return (
    matterType === Matter.Powder ||
    matterType === Matter.Liquid ||
    matterType === Matter.Particle ||
    matterType === Matter.Slushy
  );
}
