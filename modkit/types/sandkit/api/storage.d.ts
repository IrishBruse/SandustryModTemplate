export namespace storage {
  export function ensure(modId: string): any;
  export function get(modId: string, key: string): any;
  export function set(modId: string, key: string, value: any): void;
  export function remove(modId: string, key: string): void;

  export namespace local {
    export function get(key: string): any;
    export function set(key: string, value: any): void;
    export function remove(key: string): void;
  }
}