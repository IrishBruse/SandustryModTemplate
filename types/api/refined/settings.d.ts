export interface SettingsApi {
  get<T = unknown>(key: string): T;
  getAll(): Record<string, unknown>;
  onChange(handler: () => void): () => void;
}
