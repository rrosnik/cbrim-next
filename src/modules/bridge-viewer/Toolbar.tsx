
"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { BridgeModelExportV2, LayerVisibility, ResultMode, ViewerDisplayMode } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { getEffectiveDeformationScale } from "@/lib/bridge-viewer/utils";

type ToolbarProps = {
  data: BridgeModelExportV2;
};

const layerOrder: Array<keyof LayerVisibility> = [
  "nodes",
  "elements",
  "shells",
  "loads",
  "supports",
  "bearings",
  "pileCaps",
  "rigidLinks",
];

export function Toolbar({ data }: ToolbarProps) {
  const {
    visibility,
    groupVisibility,
    selectedLoadCases,
    displayMode,
    resultMode,
    deformationScale,
    showNodalLoads,
    showSurfaceLoads,
    setLayerVisibility,
    toggleGroupVisibility,
    toggleLoadCase,
    setDisplayMode,
    setResultMode,
    setDeformationScale,
    setShowNodalLoads,
    setShowSurfaceLoads,
    initializeFromData,
  } = useBridgeViewerStore();

  const loadCaseNames = useMemo(
    () => data.loads.patterns.map((pattern) => pattern.name),
    [data.loads.patterns],
  );

  const activeScale = getEffectiveDeformationScale(data, deformationScale);

  return (
    <Card className="border-slate-800 bg-slate-900 text-slate-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold tracking-wide text-slate-200">
          Viewer controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-400">Display mode</div>
            <Select value={displayMode} onValueChange={(value: ViewerDisplayMode) => setDisplayMode(value)}>
              <SelectTrigger className="border-slate-800 bg-slate-950 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950 text-slate-50">
                <SelectItem value="undeformed">Undeformed</SelectItem>
                <SelectItem value="deformed">Deformed</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-400">Result mode</div>
            <Select value={resultMode} onValueChange={(value: ResultMode) => setResultMode(value)}>
              <SelectTrigger className="border-slate-800 bg-slate-950 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-800 bg-slate-950 text-slate-50">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="displacement">Displacement</SelectItem>
                <SelectItem value="elementForce">Element force</SelectItem>
                <SelectItem value="reaction">Reaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
            <span>Deformation scale</span>
            <Badge variant="secondary" className="bg-slate-800 text-slate-200">
              {activeScale.toFixed(1)}
            </Badge>
          </div>
          <Slider
            min={1}
            max={200}
            step={1}
            value={[activeScale]}
            onValueChange={(value) => setDeformationScale(value[0])}
          />
          <div className="text-xs text-slate-500">
            Uses JSON default when unset. Adjust this to exaggerate or soften the deformed view.
          </div>
        </div> */}

        <Separator className="bg-slate-800" />

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-400">Layer visibility</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {layerOrder.map((layerKey) => (
              <label key={layerKey} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2">
                <span className="capitalize text-slate-200">{layerKey}</span>
                <Switch
                  checked={visibility[layerKey]}
                  onCheckedChange={(checked) => setLayerVisibility(layerKey, checked)}
                />
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-400">Load visualization</div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2">
              <span className="text-slate-200">Nodal arrows</span>
              <Switch checked={showNodalLoads} onCheckedChange={setShowNodalLoads} />
            </label>
            <label className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2">
              <span className="text-slate-200">Surface loads</span>
              <Switch checked={showSurfaceLoads} onCheckedChange={setShowSurfaceLoads} />
            </label>
          </div>
          <div className="space-y-2 rounded-md border border-slate-800 bg-slate-950 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">Active load cases</div>
            <div className="grid gap-2">
              {loadCaseNames.map((name) => (
                <label key={name} className="flex items-center gap-3 text-slate-200">
                  <Checkbox
                    checked={selectedLoadCases.includes(name)}
                    onCheckedChange={() => toggleLoadCase(name)}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-slate-400">Group filters</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(groupVisibility).map((groupName) => (
              <label key={groupName} className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200">
                <Checkbox
                  checked={groupVisibility[groupName]}
                  onCheckedChange={() => toggleGroupVisibility(groupName)}
                />
                <span className='truncate'>{groupName}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1 bg-slate-800 text-slate-50 hover:bg-slate-700"
            onClick={() => initializeFromData(data)}
          >
            Reset viewer state
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
