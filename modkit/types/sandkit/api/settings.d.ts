export namespace settings {
  export function get(fieldId: string): ConfigValueV1 | undefined;
  export function getAll(): Readonly<Record<string, ConfigValueV1>>;
  export function onChange(callback: (values: Readonly<Record<string, ConfigValueV1>>) => void): () => void;

  export type ConfigValueV1 = unknown
}