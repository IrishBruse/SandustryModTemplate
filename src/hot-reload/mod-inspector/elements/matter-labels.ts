const MatterType = sandkit.enums.MatterType;

const LABELS: Record<number, string> = {
  [MatterType.Solid]: "Solid",
  [MatterType.Liquid]: "Liquid",
  [MatterType.Particle]: "Particle",
  [MatterType.Gas]: "Gas",
  [MatterType.Static]: "Static",
  [MatterType.Slushy]: "Slushy",
  [MatterType.Wisp]: "Wisp",
  [MatterType.Powder]: "Powder",
};

export function matterLabel(matterType: number): string {
  return LABELS[matterType] ?? `Type ${matterType}`;
}
