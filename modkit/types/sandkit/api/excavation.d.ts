export namespace excavation {
  export function registerProfile(id: string, definition: ExcavationProfileDefinitionV1): void;

  export interface ExcavationProfileDefinitionV1 {
    pattern: number[][];
    power: number;
    options?: Record<string, unknown>;
  }
}
