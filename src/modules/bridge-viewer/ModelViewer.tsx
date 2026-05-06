"use client";

import { useEffect } from "react";

import { SceneRoot } from "@/modules/bridge-viewer/SceneRoot";
import { Toolbar } from "@/modules/bridge-viewer/Toolbar";
import { LegendPanel } from "@/modules/bridge-viewer/panels/LegendPanel";
import { ReportPanel } from "@/modules/bridge-viewer/panels/ReportPanel";
import { SelectionPanel } from "@/modules/bridge-viewer/panels/SelectionPanel";
import { SummaryPanel } from "@/modules/bridge-viewer/panels/SummaryPanel";
import { TreePanel } from "@/modules/bridge-viewer/panels/TreePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";

type ModelViewerProps = {
  data: BridgeModelExportV2;
};

export function ModelViewer({ data }: ModelViewerProps) {
  const initializeFromData = useBridgeViewerStore(
    (state) => state.initializeFromData,
  );

  useEffect(() => {
    initializeFromData(data);
  }, [data, initializeFromData]);

  return (
    <div className="grid h-svh grid-cols-[360px_1fr_360px] gap-4 bg-slate-950 p-4 text-slate-50 items-stretch">
      <div className="flex min-h-0 flex-col gap-4">
        <Tabs defaultValue="controls" className="flex h-full min-h-0 flex-col">
          <Card>
            <CardHeader className="pb-3 border-b border-b-slate-800 grid-cols-2 items-center">
              <CardTitle className="text-sm font-semibold tracking-wide text-slate-200">
                Model
              </CardTitle>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="min-h-0 max-h-full overflow-scroll">
              <TabsContent value="controls" className="mt-0 overflow-auto">
                <p className='mb-2'>Viewer controls</p>
                <Toolbar data={data} />
              </TabsContent>
              <TabsContent value="navigation">
                <p className='mb-2'>Model navigation</p>
                <Tabs defaultValue="summary" className="flex min-h-0 flex-col">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="tree">Tree</TabsTrigger>
                    <TabsTrigger value="legend">Legend</TabsTrigger>
                    <TabsTrigger value="report">Report</TabsTrigger>
                  </TabsList>
                  <div className="mt-4 min-h-0 flex flex-1">
                    <TabsContent value="summary" className="mt-0">
                      <SummaryPanel data={data} />
                    </TabsContent>
                    <TabsContent value="tree" className="mt-0">
                      <TreePanel data={data} />
                    </TabsContent>
                    <TabsContent value="legend" className="mt-0">
                      <LegendPanel data={data} />
                    </TabsContent>
                    <TabsContent value="report" className="mt-0 flex-1 flex">
                      <ReportPanel data={data} />
                    </TabsContent>
                  </div>
                </Tabs>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <Card className="border-slate-800 bg-slate-900 text-slate-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold tracking-wide text-slate-200">
            Bridge scene
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100vh-6.5rem)] p-0">
          <SceneRoot data={data} />
        </CardContent>
      </Card>

      <div className="flex min-h-0 flex-col gap-4">
        <Card className="min-h-0 flex-1 border-slate-800 bg-slate-900 text-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-200">
              Selection and details
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-0">
            <Tabs
              defaultValue="selected"
              className="flex h-full min-h-0 flex-col"
            >
              <TabsList className="grid grid-cols-2 bg-slate-800">
                <TabsTrigger value="selected">Selected</TabsTrigger>
                <TabsTrigger value="raw">Raw JSON</TabsTrigger>
              </TabsList>
              <div className="mt-4 min-h-0 flex-1">
                <TabsContent value="selected" className="mt-0 h-full">
                  <SelectionPanel data={data} />
                </TabsContent>
                <TabsContent value="raw" className="mt-0 h-full">
                  <ScrollArea className="h-full rounded-md border border-slate-800 bg-slate-950 p-3">
                    <pre className="whitespace-pre-wrap break-words text-xs text-slate-300">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-slate-50">
          <CardContent className="py-3 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Schema</span>
              <span className="font-medium text-slate-200">{data.schema}</span>
            </div>
            <Separator className="my-2 bg-slate-800" />
            <div className="flex items-center justify-between">
              <span>Analysis status</span>
              <span className="font-medium text-slate-200">
                {data.analysis.analysis_status}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
