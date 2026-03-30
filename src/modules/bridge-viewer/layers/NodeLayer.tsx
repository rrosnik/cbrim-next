
"use client";

import { Fragment, useMemo } from "react";

import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { colorFromNormalized, getResultExtrema, getNodeResultValue, isSelected } from "@/lib/bridge-viewer/utils";

type NodeLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function NodeLayer({ data }: NodeLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.nodes);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);
  const resultMode = useBridgeViewerStore((state) => state.resultMode);

  const radius = Math.max(data.global_bbox.diagonal * 0.002, 0.08);
  const maxValue = useMemo(() => getResultExtrema(data, resultMode).maxValue, [data, resultMode]);

  if (!visibility) return null;

  return (
    <group>
      {data.nodes.map((node) => {
        const selectedNow = selected?.kind === "node" && isSelected(node.tag, selected.id);
        const hoveredNow = hovered?.kind === "node" && isSelected(node.tag, hovered.id);
        const value = getNodeResultValue(node, resultMode);
        const baseColor = resultMode === "none" ? "#cbd5e1" : colorFromNormalized(value / maxValue);
        const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : baseColor;

        return (
          <Fragment key={node.tag}>
            <mesh
              position={node.coords}
              onClick={(event) => {
                event.stopPropagation();
                setSelected(makeSelection("node", node.tag, `Node ${node.tag}`, node));
              }}
              // onPointerOver={(event) => {
              //   event.stopPropagation();
              //   setHovered(makeSelection("node", node.tag, `Node ${node.tag}`, node));
              // }}
              // onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[radius, 10, 10]} />
              <meshStandardMaterial color={color} emissive={selectedNow ? "#a16207" : "#000000"} />
            </mesh>
          </Fragment>
        );
      })}
    </group>
  );
}
