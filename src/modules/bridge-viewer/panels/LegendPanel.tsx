"use client";

import { useMemo } from "react";

import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import {
  getResultExtrema,
  paletteStops,
  prettyNumber,
} from "@/lib/bridge-viewer/utils";

type LegendPanelProps = {
  data: BridgeModelExportV2;
};

export function LegendPanel({ data }: LegendPanelProps) {
  const resultMode = useBridgeViewerStore((state) => state.resultMode);
  const extrema = useMemo(
    () => getResultExtrema(data, resultMode),
    [data, resultMode],
  );

  return (
    <div className="space-y-4">
      <div className="font-medium text-slate-100">Color legend</div>
      <div className="rounded-md border border-slate-800 p-3">
        <div
          className="h-4 w-full rounded"
          style={{
            background: `linear-gradient(90deg, ${paletteStops.join(", ")})`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>0</span>
          <span>{prettyNumber(extrema.maxValue)}</span>
        </div>
      </div>
      <div className="text-xs text-slate-400">
        Active result mode:{" "}
        <span className="font-medium text-slate-200">{resultMode}</span>
      </div>

      <div className="font-medium text-slate-100">Technical color hints</div>
      <div className="grid gap-2 text-xs text-slate-300">
        <div>
          <span className="font-medium text-sky-300">Deck shells</span> —
          translucent technical panels
        </div>
        <div>
          <span className="font-medium text-emerald-300">Girders</span> —
          centerlines
        </div>
        <div>
          <span className="font-medium text-violet-300">Columns/Piles</span> —
          line members
        </div>
        <div>
          <span className="font-medium text-amber-300">Bearings</span> — link +
          marker
        </div>
        <div>
          <span className="font-medium text-rose-300">Loads</span> — arrows /
          surface glyphs
        </div>
        <div>
          <span className="font-medium text-slate-300">Supports</span> —
          symbolic restraints
        </div>
      </div>
    </div>
  );
}
