import type { ReactNode } from "react";
import { ACCENT } from "../shared/styles";

type InfoBannerProps = {
  label: string;
  value: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function InfoBanner({ label, value, actionLabel, onAction }: InfoBannerProps) {
  return (
    <div className="bg-black bg-opacity-75 border border-slate-700 rounded ui-box px-2 py-1 text-white text-xs flex items-center gap-2">
      <span className="opacity-70">{label}</span>
      <span className="font-bold" style={{ color: ACCENT }}>
        {value}
      </span>
      {actionLabel ? (
        <button
          type="button"
          className="ml-2 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded border border-slate-500"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
