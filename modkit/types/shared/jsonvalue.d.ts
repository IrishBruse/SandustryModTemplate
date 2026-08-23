export interface JsonObjectV1 {
  [key: string]: JsonValueV1
}

export type JsonValueV1 = string | number | JsonObjectV1 | JsonValueV1[] | null;

