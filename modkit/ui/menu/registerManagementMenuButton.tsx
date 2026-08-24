import { onDispose } from "@modkit/debug";
import { useEffect, useState } from "react";
import { ManagementMenuButton } from "./ManagementMenuButton";

const api = sandkit.api;

export type RegisterManagementMenuButtonOptions = {
  /** Stable row id. Prefer `${modId}:name`. */
  id: string;
  /** SVG markup for the 20×20 icon slot. Use `fill="currentColor"`. */
  icon: string;
  label: string;
  /** Badge text only — does not bind a key. */
  hotkey: string;
  onClick?: () => void;
  /** When false, the row is removed. Default true. */
  active?: boolean;
};

type RegisteredRow = RegisterManagementMenuButtonOptions;

const rows: RegisteredRow[] = [];
const listeners = new Set<() => void>();

let hostDispose: (() => void) | null = null;

function notify(): void {
  for (const fn of listeners) fn();
}

function hostInjectId(rowId: string): string {
  const cut = rowId.lastIndexOf(":");
  const modId = cut > 0 ? rowId.slice(0, cut) : rowId;
  return `${modId}:management-menu-host`;
}

function SvgIcon({ markup }: { markup: string }) {
  return (
    <span
      style={{ display: "block", width: "100%", height: "100%" }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function ManagementMenuHost() {
  const [, bump] = useState(0);
  useEffect(() => {
    const onChange = () => bump((n) => n + 1);
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  return (
    <>
      {rows.map((row) => (
        <ManagementMenuButton
          key={row.id}
          id={row.id}
          icon={<SvgIcon markup={row.icon} />}
          label={row.label}
          hotkey={row.hotkey}
          active={row.active !== false}
          onClick={row.onClick}
        />
      ))}
    </>
  );
}

function ensureHost(rowId: string): void {
  if (hostDispose) return;
  const dispose = api.ui.inject(hostInjectId(rowId), ManagementMenuHost);
  if (!dispose) {
    console.warn("[modkit] management menu host inject failed");
    return;
  }
  hostDispose = dispose;
}

function teardownHostIfEmpty(): void {
  if (rows.length > 0) return;
  hostDispose?.();
  hostDispose = null;
}

/**
 * Add a vanilla-style row under Upgrades (Toolbox / Building / …).
 * Hotkey is badge text only. Returns a dispose function. Hot reload tracks
 * that dispose automatically — callers do not need `onDispose`.
 */
export function registerManagementMenuButton(
  options: RegisterManagementMenuButtonOptions,
): () => void {
  const next: RegisteredRow = { ...options };
  const index = rows.findIndex((row) => row.id === next.id);
  if (index >= 0) rows[index] = next;
  else rows.push(next);

  ensureHost(next.id);
  notify();

  const stop = () => {
    const i = rows.findIndex((row) => row.id === next.id);
    if (i >= 0) rows.splice(i, 1);
    notify();
    teardownHostIfEmpty();
  };
  onDispose(stop);
  return stop;
}
