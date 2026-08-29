import { useEffect, useState, type ReactNode } from "react";
import { modSourceLabel } from "./mod-source";
import { readModReport, type ModDiagnostic, type ModReportEntry } from "./mod-report";
import { refreshTypeDrift, type TypeDriftEntry } from "./type-drift";

function isFilePatchingActive(): boolean | null {
  try {
    const bridge = (window as { electron?: { isFilePatchingActiveSync?: () => boolean } }).electron;
    if (!bridge?.isFilePatchingActiveSync) return null;
    return bridge.isFilePatchingActiveSync();
  } catch {
    return null;
  }
}

function statusTone(status: string): string {
  if (status === "loaded") return "text-green-300";
  if (status === "failed") return "text-red-300";
  if (status === "blocked") return "text-yellow-200";
  return "text-gray-400";
}

function openWorkshopPage(itemId: string): void {
  const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${itemId}`;
  try {
    const overlay = (
      window as {
        electron?: { platform?: { overlay?: { openUrl?: (href: string) => unknown } } };
      }
    ).electron?.platform?.overlay;
    if (typeof overlay?.openUrl === "function") {
      void overlay.openUrl(url);
      return;
    }
  } catch {
    /* ignore */
  }
  window.open(url, "_blank");
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div
      className="grid items-baseline py-1.5"
      style={{
        gridTemplateColumns: "9.5rem minmax(0, 1fr)",
        columnGap: "12px",
        borderBottom: "1px solid rgba(71, 85, 105, 0.35)",
      }}
    >
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 text-left break-all min-w-0">{value}</span>
    </div>
  );
}

function yesNo(value: boolean): string {
  return value ? "yes" : "no";
}

function formatBytes(value: number | null): string | null {
  if (value == null) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDiagnostic(entry: { code: string; modId: string | null; message: string }): string {
  if (entry.modId && entry.message.includes(entry.modId)) {
    return `[${entry.code}] ${entry.message}`;
  }
  return `[${entry.code}]${entry.modId ? ` ${entry.modId}` : ""}: ${entry.message}`;
}

function ContributeBag({ bag, count, items }: { bag: string; count: number; items: string[] }) {
  const [open, setOpen] = useState(count <= 12);
  return (
    <details
      open={open}
      onToggle={(event) => {
        setOpen((event.currentTarget as HTMLDetailsElement).open);
      }}
    >
      <summary className="cursor-pointer select-none py-1 text-[12px] text-slate-200 hover:text-[#ffe700] flex items-center gap-2 [&::-webkit-details-marker]:hidden">
        <span className="text-slate-500 inline-block w-3 text-center" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
        <span>
          {bag} <span className="text-slate-500">({count})</span>
        </span>
      </summary>
      <ul
        className="pb-2 pt-1 space-y-1"
        style={{ margin: "0 0 0 1.25rem", paddingLeft: "1.1rem", listStyleType: "disc" }}
      >
        {items.map((item) => (
          <li
            key={item}
            className="font-mono text-[11px] text-slate-300 break-all leading-snug"
            style={{ paddingLeft: "0.25rem" }}
          >
            {item}
          </li>
        ))}
      </ul>
    </details>
  );
}

function ModDetailView({
  mod,
  diagnostics,
  onBack,
  onOpenWorkshop,
}: {
  mod: ModReportEntry;
  diagnostics: ModDiagnostic[];
  onBack: () => void;
  onOpenWorkshop: (itemId: string) => void;
}) {
  const ownDiagnostics = diagnostics.filter((entry) => entry.modId === mod.id);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="text-[12px] text-slate-400 hover:text-[#ffe700] transition-colors mb-1"
          >
            ← Mods
          </button>
          <h3 className="text-base font-semibold text-white truncate">{mod.name}</h3>
          <p className="text-xs text-gray-500 truncate">
            Version {mod.version} • {mod.id}
          </p>
          {mod.author ? (
            <p className="text-xs text-gray-500 truncate">By {mod.author}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-white bg-black border rounded-tr-lg rounded-bl-lg border-slate-200 hover:text-[#ffe700] item-button-transition shrink-0"
        >
          Close
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4 text-xs text-gray-300">
        {mod.description ? (
          <p className="text-[13px] text-gray-200 leading-relaxed whitespace-pre-wrap">
            {mod.description}
          </p>
        ) : (
          <p className="text-gray-500">No description.</p>
        )}

        <div>
          <p className="text-gray-400 mb-1 text-[11px] uppercase tracking-wider">Details</p>
          <DetailRow
            label="Status"
            value={
              <span className={`font-semibold uppercase ${statusTone(mod.status)}`}>
                {mod.status}
              </span>
            }
          />
          <DetailRow label="Load index" value={String(mod.order + 1)} />
          <DetailRow label="Source" value={modSourceLabel(mod.sourceKind)} />
          <DetailRow
            label="Discovered via"
            value={mod.discoveredVia.length > 0 ? mod.discoveredVia.join(", ") : "—"}
          />
          <DetailRow label="Folder" value={mod.folder} />
          <DetailRow label="API" value={mod.apiVersion != null ? String(mod.apiVersion) : null} />
          <DetailRow
            label="Manifest"
            value={mod.manifestVersion != null ? String(mod.manifestVersion) : null}
          />
          <DetailRow
            label="Load order"
            value={mod.loadOrder != null ? String(mod.loadOrder) : null}
          />
          <DetailRow label="Entry" value={mod.entry} />
          <DetailRow label="Worker entry" value={mod.workerEntry} />
          <DetailRow label="Has main.js" value={yesNo(mod.hasEntrySource)} />
          <DetailRow label="Entry size" value={formatBytes(mod.entrySourceBytes)} />
          <DetailRow label="Has worker" value={yesNo(mod.hasWorker)} />
          <DetailRow label="Worker size" value={formatBytes(mod.workerSourceBytes)} />
          <DetailRow label="Settings schema" value={yesNo(mod.hasSettings)} />
          {mod.dependencies.length > 0 ? (
            <DetailRow label="Depends on" value={mod.dependencies.join(", ")} />
          ) : (
            <DetailRow label="Depends on" value="none" />
          )}
        </div>

        {mod.registry.length > 0 ? (
          <div className="pt-1 border-t border-gray-700/60">
            <p className="text-gray-400 mb-2 text-[11px] uppercase tracking-wider pt-3">
              Contributes
            </p>
            <div className="space-y-1.5">
              {mod.registry.map((entry) => (
                <ContributeBag
                  key={entry.bag}
                  bag={entry.bag}
                  count={entry.count}
                  items={entry.items}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 pt-1 border-t border-gray-700/60 pt-3">
            No registered contributions found for this mod id.
          </p>
        )}

        {mod.itemId ? (
          <div>
            <p className="text-gray-500 mb-1">Workshop item {mod.itemId}</p>
            <button
              type="button"
              onClick={() => onOpenWorkshop(mod.itemId!)}
              className="px-3 py-1.5 text-xs text-gray-300 bg-black border border-gray-600 rounded hover:text-[#ffe700] item-button-transition"
            >
              Open Workshop page
            </button>
          </div>
        ) : null}

        {ownDiagnostics.length > 0 ? (
          <div>
            <p className="text-yellow-200 mb-1">Diagnostics</p>
            {ownDiagnostics.map((entry, index) => (
              <p key={index} className="font-mono text-yellow-200 leading-snug">
                {formatDiagnostic(entry)}
              </p>
            ))}
          </div>
        ) : null}

        {mod.error ? (
          <pre className="text-red-300 whitespace-pre-wrap font-mono leading-snug">{mod.error}</pre>
        ) : null}
      </div>
    </div>
  );
}

function ModCard({ mod, onOpen }: { mod: ModReportEntry; onOpen: () => void }) {
  return (
    <div className="p-3 bg-gray-900 bg-opacity-50 rounded border border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium truncate">{mod.name}</div>
          <div className="text-xs text-gray-500 truncate">
            Version {mod.version} • {mod.id}
          </div>
          {mod.author ? (
            <div className="text-xs text-gray-500 truncate">By {mod.author}</div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="px-3 py-1.5 text-xs text-white bg-black border rounded-tr-lg rounded-bl-lg border-slate-200 hover:text-[#ffe700] item-button-transition shrink-0"
        >
          Open
        </button>
      </div>
    </div>
  );
}

function SaveIssues({
  open,
  missing,
  diagnostics,
  drift,
  driftFirstRun,
  onToggle,
}: {
  open: boolean;
  missing: string[];
  diagnostics: { code: string; modId: string | null; message: string }[];
  drift: TypeDriftEntry[];
  driftFirstRun: boolean;
  onToggle: () => void;
}) {
  const count = missing.length + diagnostics.length + drift.length;
  if (count === 0 && !driftFirstRun) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-700/40">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left py-1"
      >
        <span className="text-[11px] uppercase tracking-wider text-amber-400">
          Save issues{count > 0 ? ` (${count})` : ""}
        </span>
        <span className="text-slate-500 text-[12px]">{open ? "▾" : "▸"}</span>
      </button>

      {open ? (
        <div className="mt-2 space-y-3">
          {missing.length > 0 ? (
            <IssueBlock title="Used by this save but not installed" tone="warn">
              {missing.map((id) => (
                <p key={id} className="text-[11px] text-amber-400 font-mono truncate">
                  {id}
                </p>
              ))}
            </IssueBlock>
          ) : null}

          {diagnostics.length > 0 ? (
            <IssueBlock title="Diagnostics" tone="warn">
              {diagnostics.map((entry, index) => (
                <p key={index} className="text-[11px] text-amber-400 font-mono leading-snug">
                  {formatDiagnostic(entry)}
                </p>
              ))}
            </IssueBlock>
          ) : null}

          {drift.length > 0 ? (
            <IssueBlock title="Type id drift" tone="error">
              <p className="text-[11px] text-slate-500 mb-1">
                Ids moved since this save was written. The save may read the wrong elements.
              </p>
              {drift.map((entry) => (
                <p
                  key={`${entry.kind}/${entry.id}`}
                  className="text-[11px] text-red-300/90 font-mono leading-snug"
                >
                  {entry.kind}/{entry.id}: was {entry.was} →{" "}
                  {entry.now === null ? "missing" : entry.now}
                </p>
              ))}
            </IssueBlock>
          ) : driftFirstRun ? (
            <IssueBlock title="Type id drift" tone="muted">
              <p className="text-[11px] text-slate-500">
                Snapshot saved. Drift will be detected from the next load on.
              </p>
            </IssueBlock>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function IssueBlock({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "muted" | "warn" | "error";
  children: ReactNode;
}) {
  const titleClass =
    tone === "error" ? "text-red-400" : tone === "warn" ? "text-amber-400" : "text-slate-500";
  return (
    <div>
      <p className={`text-[10px] uppercase tracking-wider mb-1 ${titleClass}`}>{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function modKey(mod: ModReportEntry): string {
  return `${mod.order}:${mod.id}`;
}

export function ModsTab() {
  const [openModKey, setOpenModKey] = useState<string | null>(null);
  const [saveIssuesOpen, setSaveIssuesOpen] = useState(false);
  const [driftState] = useState(() => refreshTypeDrift());
  const [report, setReport] = useState(() => readModReport());
  const [patchingActive, setPatchingActive] = useState<boolean | null>(() =>
    isFilePatchingActive(),
  );

  useEffect(() => {
    function tick() {
      setReport(readModReport());
      setPatchingActive(isFilePatchingActive());
    }
    tick();
    const id = window.setInterval(tick, 2000);
    return () => window.clearInterval(id);
  }, []);

  const { drift, firstRun: driftFirstRun } = driftState;

  if (!report) {
    return (
      <p className="text-[13px] text-slate-400 text-center py-8">
        No mod report yet. Load a world first.
      </p>
    );
  }

  if (report.mods.length === 0) {
    return (
      <p className="text-[13px] text-slate-400 text-center py-8">No mods in the load order.</p>
    );
  }

  const openMod = openModKey
    ? (report.mods.find((mod) => modKey(mod) === openModKey) ?? null)
    : null;

  if (openMod) {
    return (
      <ModDetailView
        mod={openMod}
        diagnostics={report.diagnostics}
        onBack={() => setOpenModKey(null)}
        onOpenWorkshop={openWorkshopPage}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-sm text-gray-300">Loaded mods ({report.mods.length})</h3>
        {patchingActive === true ? (
          <span className="text-xs text-[#ffe700] shrink-0">● file patches active</span>
        ) : null}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-2">
        {report.mods.map((mod) => (
          <ModCard key={modKey(mod)} mod={mod} onOpen={() => setOpenModKey(modKey(mod))} />
        ))}

        <SaveIssues
          open={saveIssuesOpen}
          missing={report.missing}
          diagnostics={report.diagnostics}
          drift={drift}
          driftFirstRun={driftFirstRun}
          onToggle={() => setSaveIssuesOpen((current) => !current)}
        />
      </div>
    </div>
  );
}
