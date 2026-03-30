
"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";

import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { buildNodeMap, isSelected } from "@/lib/bridge-viewer/utils";

type RigidLinkLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function RigidLinkLayer({ data }: RigidLinkLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.rigidLinks);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  const nodeMap = useMemo(() => buildNodeMap(data), [data]);

  if (!visibility) return null;

  return (
    <group>
      {data.scene.rigid_links.map((link, index) => {
        const retained = nodeMap.get(link.retained);
        const constrained = nodeMap.get(link.constrained);
        if (!retained || !constrained) return null;

        const linkId = `${link.retained}-${link.constrained}`;
        const selectedNow = selected?.kind === "rigidLink" && isSelected(linkId, selected.id);
        const hoveredNow = hovered?.kind === "rigidLink" && isSelected(linkId, hovered.id);
        const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : "#94a3b8";

        return (
          <Line
            key={`${link.retained}-${link.constrained}-${index}`}
            points={[retained.coords, constrained.coords]}
            color={color}
            dashed
            dashSize={0.4}
            gapSize={0.22}
            lineWidth={1.2}
            transparent
            opacity={0.6}
            onClick={(event) => {
              event.stopPropagation();
              setSelected(makeSelection("rigidLink", linkId, `Rigid link ${linkId}`, link));
            }}
            // onPointerOver={(event) => {
            //   event.stopPropagation();
            //   setHovered(makeSelection("rigidLink", linkId, `Rigid link ${linkId}`, link));
            // }}
            // onPointerOut={() => setHovered(null)}
          />
        );
      })}
    </group>
  );
}
