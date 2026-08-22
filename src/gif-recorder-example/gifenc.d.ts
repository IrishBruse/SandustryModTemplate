declare module "gifenc" {
  export type GifPalette = number[][];

  export function GIFEncoder(opts?: { initialCapacity?: number; auto?: boolean }): {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      opts?: {
        palette?: GifPalette | null;
        delay?: number;
        repeat?: number;
        first?: boolean;
        dispose?: number;
        transparent?: boolean;
      },
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  };

  export function quantize(rgba: Uint8Array | Uint8ClampedArray, maxColors: number): GifPalette;

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: GifPalette,
  ): Uint8Array;
}
