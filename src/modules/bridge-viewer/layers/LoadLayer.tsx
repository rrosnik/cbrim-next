
"use client";

import { useMemo } from "react";

import { ArrowGlyph } from "@/modules/bridge-viewer/primitives/ArrowGlyph";
import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { averagePoints, buildNodeMap, loadCaseColor } from "@/lib/bridge-viewer/utils";

type LoadLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function LoadLayer({ data }: LoadLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.loads);
  const selectedLoadCases = useBridgeViewerStore((state) => state.selectedLoadCases);
  const showNodalLoads = useBridgeViewerStore((state) => state.showNodalLoads);
  const showSurfaceLoads = useBridgeViewerStore((state) => state.showSurfaceLoads);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  const nodeMap = useMemo(() => buildNodeMap(data), [data]);
  const arrowScale = Math.max(data.loads.display.suggested_arrow_scale, 0.2);

  if (!visibility) return null;

  return (
    <group>
      {showNodalLoads &&
        data.loads.patterns
          .filter((pattern) => selectedLoadCases.includes(pattern.name))
          .flatMap((pattern) =>
            pattern.display_arrows.map((arrow) => {
              const id = `${pattern.name}-${arrow.node}`;
              const selectedNow = selected?.kind === "load" && selected.id === id;
              const hoveredNow = hovered?.kind === "load" && hovered.id === id;
              const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : loadCaseColor(pattern.name);

              const start = arrow.start;
              const end = arrow.display_end;

              return (
                <ArrowGlyph
                  key={id}
                  start={start}
                  end={end}
                  color={color}
                  shaftWidth={selectedNow ? 3.2 : 1.8}
                  headSize={0.18 + arrowScale * 0.2}
                  opacity={0.95}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelected(makeSelection("load", id, `Load ${pattern.name} @ node ${arrow.node}`, { pattern, arrow }));
                  }}
                  onPointerOver={(event) => {
                    event.stopPropagation();
                    setHovered(makeSelection("load", id, `Load ${pattern.name} @ node ${arrow.node}`, { pattern, arrow }));
                  }}
                  onPointerOut={() => setHovered(null)}
                />
              );
            }),
          )}

      {showSurfaceLoads &&
        data.loads.surface_loads
          .filter((surfaceLoad) => selectedLoadCases.includes(surfaceLoad.pattern))
          .map((surfaceLoad) => {
            const id = `${surfaceLoad.pattern}-surface-${surfaceLoad.element}`;
            const selectedNow = selected?.kind === "load" && selected.id === id;
            const hoveredNow = hovered?.kind === "load" && hovered.id === id;
            const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : loadCaseColor(surfaceLoad.pattern);

            const points = surfaceLoad.nodes
              .map((nodeId) => nodeMap.get(nodeId)?.coords)
              .filter(Boolean) as [number, number, number][];

            if (points.length !== 4) return null;

            const centroid = averagePoints(points);
            const end: [number, number, number] = [
              centroid[0],
              centroid[1],
              centroid[2] + surfaceLoad.direction[2] * (Math.abs(surfaceLoad.pressure) * data.loads.display.suggested_arrow_scale),
            ];

            return (
              <ArrowGlyph
                key={id}
                start={centroid}
                end={end}
                color={color}
                shaftWidth={selectedNow ? 2.6 : 1.2}
                headSize={0.14}
                opacity={0.78}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(makeSelection("load", id, `Surface load ${surfaceLoad.pattern} @ element ${surfaceLoad.element}`, surfaceLoad));
                }}
                onPointerOver={(event) => {
                  event.stopPropagation();
                  setHovered(makeSelection("load", id, `Surface load ${surfaceLoad.pattern} @ element ${surfaceLoad.element}`, surfaceLoad));
                }}
                onPointerOut={() => setHovered(null)}
              />
            );
          })}
    </group>
  );
}
