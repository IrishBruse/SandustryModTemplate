/**
 * Shared `sandkit.api.ui` base — lightweight UI helpers available on workers.
 *
 * Main thread adds richer UI APIs on top of this shape.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace ui {
  /** Show a short on-screen toast message. */
  export function toast(message: LocalizedText, options?: ToastOptions): void;

  /** i18n key, plain string, or structured text payload. */
  export type LocalizedText = unknown
  /** Duration, style, and placement options for {@link toast}. */
  export type ToastOptions = unknown
}
