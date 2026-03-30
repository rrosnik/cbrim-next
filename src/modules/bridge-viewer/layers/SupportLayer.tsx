
"use client";

import { useMemo } from "react";
import * as THREE from "three";

import type { BridgeModelExportV2, ViewerSelection } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import { isSelected } from "@/lib/bridge-viewer/utils";

type SupportLayerProps = {
  data: BridgeModelExportV2;
};

function makeSelection(kind: ViewerSelection["kind"], id: string | number, label: string, payload: unknown): ViewerSelection {
  return { kind, id, label, payload };
}

export function SupportLayer({ data }: SupportLayerProps) {
  const visibility = useBridgeViewerStore((state) => state.visibility.supports);
  const selected = useBridgeViewerStore((state) => state.selected);
  const hovered = useBridgeViewerStore((state) => state.hovered);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);
  const setHovered = useBridgeViewerStore((state) => state.setHovered);

  const size = useMemo(() => Math.max(data.global_bbox.diagonal * 0.008, 0.5), [data.global_bbox.diagonal]);

  if (!visibility) return null;

  return (
    <group>
      {data.scene.supports.map((support) => {
        const selectedNow = selected?.kind === "support" && isSelected(support.node, selected.id);
        const hoveredNow = hovered?.kind === "support" && isSelected(support.node, hovered.id);
        const color = selectedNow ? "#f59e0b" : hoveredNow ? "#fde68a" : "#cbd5e1";
        const position = new THREE.Vector3(support.coords[0], support.coords[1], support.coords[2] - size * 0.75);

        return (
          <mesh
            key={support.node}
            position={position}
            rotation={[Math.PI, 0, 0]}
            onClick={(event) => {
              event.stopPropagation();
              setSelected(makeSelection("support", support.node, `Support ${support.node}`, support));
            }}
            // onPointerOver={(event) => {
            //   event.stopPropagation();
            //   setHovered(makeSelection("support", support.node, `Support ${support.node}`, support));
            // }}
            // onPointerOut={() => setHovered(null)}
          >
            <coneGeometry args={[size * 0.42, size, 4]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}
