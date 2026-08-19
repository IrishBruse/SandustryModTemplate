export interface StorageLocalApi {
  get<T = unknown>(key: string): T | null;
  set(key: string, value: unknown): void;
  remove(key: string): void;
}

export interface StorageApi {
  get<T = unknown>(key: string, fallback?: T): T | null;
  set(key: string, value: unknown): void;
  remove(key: string, value?: unknown): void;
  ensure(key: string): void;
  local: StorageLocalApi;
}
