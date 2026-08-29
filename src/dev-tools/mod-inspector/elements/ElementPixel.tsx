import { contrastText } from "./element-colors";
import type { ElementRow } from "./list-elements";

/**
 * True sand-grain color square (undarkened `metaColor` / first variant).
 * Matches the Chains picker / tree swatches.
 */
export function ElementPixel({
  element,
  size = 14,
  title,
}: {
  element: ElementRow | undefined;
  size?: number;
  title?: string;
}) {
  const fill = element?.backgroundCss ?? "rgb(71, 85, 105)";
  const ink = contrastText(fill);
  return (
    <span
      className="inline-block shrink-0 border border-black/50"
      style={{
        width: size,
        height: size,
        backgroundColor: fill,
        color: ink,
        borderRadius: 0,
        imageRendering: "pixelated",
      }}
      title={title ?? element?.name}
    />
  );
}
