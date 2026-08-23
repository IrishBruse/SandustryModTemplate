import { useEffect, useState } from "react";
import {
  FixedAnchor,
  Interactive,
  OverlayRoot,
  SectionHeading,
  UiBox,
} from "@modkit/ui";

type AssetInfo = {
  title?: string;
  message?: string;
};

const BADGE_URL = sandkit.api.assets.getUrl("badge.png");
const INFO_URL = sandkit.api.assets.getUrl("info.json");

export function ModAssetsOverlay() {
  const [info, setInfo] = useState<AssetInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(INFO_URL)
      .then((response) => response.json() as Promise<AssetInfo>)
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch((error) => {
        console.warn("Failed to load mod asset JSON", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <OverlayRoot>
      <FixedAnchor anchor="top-left">
        <Interactive>
          <UiBox className="bg-black bg-opacity-85 p-4 shadow-lg card-2 w-[20rem] text-white">
            <SectionHeading size="md">Mod Assets Example</SectionHeading>
            <img
              src={BADGE_URL}
              alt="Mod badge"
              width={32}
              height={32}
              className="mt-3 mb-2"
            />
            <p className="text-sm opacity-80">{info?.message ?? "Loading mod/info.json…"}</p>
            <p className="text-xs opacity-50 mt-2 break-all">{BADGE_URL}</p>
          </UiBox>
        </Interactive>
      </FixedAnchor>
    </OverlayRoot>
  );
}
