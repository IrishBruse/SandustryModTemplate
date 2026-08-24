import { useLayoutEffect, useRef } from "react";
import { ResourceRow } from "@modkit/ui";
import { formatHealth, getHealth } from "../health/health";
import { mountHealthRow } from "./mountHealthRow";

const HEART_COLOR = "#ff2f45";

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="black"
      strokeWidth={1.5}
      paintOrder="stroke"
      aria-label="Health"
      className="inline-block h-full w-full"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

/** Hidden JSX source. `mountHealthRow` clones it into the vanilla resource stack. */
export function HealthHud() {
  const sourceRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const source = sourceRef.current;
    if (!source) return;
    return mountHealthRow(source);
  }, []);

  return (
    <div ref={sourceRef} style={{ display: "none" }} aria-hidden="true">
      <ResourceRow
        icon={
          <span style={{ color: HEART_COLOR }}>
            <HeartIcon />
          </span>
        }
        value={formatHealth(getHealth())}
      />
    </div>
  );
}
