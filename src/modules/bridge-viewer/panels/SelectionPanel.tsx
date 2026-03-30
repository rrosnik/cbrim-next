
"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";

type SelectionPanelProps = {
  data: BridgeModelExportV2;
};

export function SelectionPanel({ data }: SelectionPanelProps) {
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);

  const panelData = useMemo(() => selected ?? hovered, [selected, hovered]);

  if (!panelData) {
    return (
      <div className="rounded-md border border-dashed border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
        Select or hover any node, element, support, bearing, pile cap, load, or component to inspect it.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="bg-slate-800 text-slate-200">
            {panelData.kind}
          </Badge>
          <div className="font-medium text-slate-100">{panelData.label}</div>
        </div>
        <div className="text-xs text-slate-400">ID: {String(panelData.id)}</div>
      </div>

      <ScrollArea className="min-h-0 flex-1 rounded-md border border-slate-800 bg-slate-950 p-3">
        <pre className="whitespace-pre-wrap break-words text-xs text-slate-300">
          {JSON.stringify(panelData.payload, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  );
}
