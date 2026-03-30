
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";
import { fetchBridgeModel } from "@/lib/bridge-viewer/loaders";
import { ModelViewer } from './ModelViewer';

type BridgeViewerPageProps = {
  dataUrl: string;
};

export function BridgeViewerPage({ dataUrl }: BridgeViewerPageProps) {
  const [data, setData] = useState<BridgeModelExportV2 | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBridgeModel(dataUrl)
      .then((json) => {
        if (!cancelled) {
          setData(json);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load bridge model JSON.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-50">
        <Card className="w-full max-w-2xl border-red-900 bg-slate-900 text-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-300">
              <AlertCircle className="h-5 w-5" />
              Failed to load bridge viewer data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-300">{error}</p>
            <p className="text-xs text-slate-400">
              Make sure the exported JSON exists at <code className="rounded bg-slate-800 px-1 py-0.5">{dataUrl}</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-50">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-50">
          <CardContent className="flex items-center gap-3 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
            <div>
              <div className="font-medium">Loading bridge model</div>
              <div className="text-sm text-slate-400">{dataUrl}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ModelViewer data={data} />;
}
