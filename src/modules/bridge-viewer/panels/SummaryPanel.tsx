
"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";
import { prettyNumber } from "@/lib/bridge-viewer/utils";

type SummaryPanelProps = {
  data: BridgeModelExportV2;
};

export function SummaryPanel({ data }: SummaryPanelProps) {
  const counts = useMemo(() => {
    return {
      nodes: data.nodes.length,
      elements: data.elements.length,
      deckShells: data.groups.deck_shell?.length ?? 0,
      girders: data.groups.girder?.length ?? 0,
      bearings: data.groups.bearing?.length ?? 0,
      piles: data.groups.pile?.length ?? 0,
      supports: data.constraints.fixities.length,
      loadCases: data.loads.patterns.length,
    };
  }, [data]);

  const spanText = data.components.spans.map((span) => `${span.length} m`).join(" + ");

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        <Card className="border-slate-800 bg-slate-950 text-slate-50">
          <CardContent className="space-y-3 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Schema</span>
              <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                {data.schema}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Analysis</span>
              <span className="font-medium text-slate-100">{data.analysis.analysis_status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Return code</span>
              <span className="font-medium text-slate-100">{data.analysis.analysis_return_code}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950 text-slate-50">
          <CardContent className="space-y-2 py-4 text-sm">
            <div className="font-medium text-slate-100">Bridge geometry</div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total length</span>
              <span>{prettyNumber(data.params.total_length ?? data.params.span_lengths.reduce((a, b) => a + b, 0))} m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Span layout</span>
              <span className="text-right">{spanText}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bridge width</span>
              <span>{prettyNumber(data.params.bridge_width)} m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Deck thickness</span>
              <span>{prettyNumber(data.params.deck_thickness)} m</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950 text-slate-50">
          <CardContent className="space-y-2 py-4 text-sm">
            <div className="font-medium text-slate-100">Model counts</div>
            {Object.entries(counts).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-slate-400">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950 text-slate-50">
          <CardContent className="space-y-2 py-4 text-sm">
            <div className="font-medium text-slate-100">Bounding box</div>
            <div className="grid gap-1 text-xs text-slate-300">
              <div>Min: [{data.global_bbox.min.map((v) => prettyNumber(v)).join(", ")}]</div>
              <div>Max: [{data.global_bbox.max.map((v) => prettyNumber(v)).join(", ")}]</div>
              <div>Size: [{data.global_bbox.size.map((v) => prettyNumber(v)).join(", ")}]</div>
              <div>Diagonal: {prettyNumber(data.global_bbox.diagonal)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950 text-slate-50">
          <CardContent className="space-y-2 py-4 text-sm">
            <div className="font-medium text-slate-100">Load cases</div>
            <div className="flex flex-wrap gap-2">
              {data.loads.patterns.map((pattern) => (
                <Badge key={pattern.name} variant="secondary" className="bg-slate-800 text-slate-200">
                  {pattern.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
