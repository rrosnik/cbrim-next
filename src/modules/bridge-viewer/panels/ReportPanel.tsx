"use client";

import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";

type ReportPanelProps = {
  data: BridgeModelExportV2;
};

export function ReportPanel({ data }: ReportPanelProps) {
  return (
    <div className="flex-1 rounded-md border border-slate-800 bg-slate-900 p-3">
      <pre className="whitespace-pre-wrap break-words text-xs text-slate-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
